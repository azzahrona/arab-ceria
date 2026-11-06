import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes, randomUUID } from 'node:crypto';
import { getDb, initializeDb, publicUser, updateDb } from './db.js';
import { categories, words } from './words.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) console.warn('JWT_SECRET belum diatur; sesi login akan berakhir saat server dimulai ulang.');
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]);
const localNetworkOrigin = /^http:\/\/(?:10\.(?:\d{1,3}\.){2}\d{1,3}|192\.168\.(?:\d{1,3}\.)\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.(?:\d{1,3}\.)\d{1,3}):5173$/;
const quizSessions = new Map();
const QUIZ_SESSION_TTL = 30 * 60 * 1000;

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || localNetworkOrigin.test(origin)) return callback(null, true);
    return callback(new Error('Asal permintaan tidak diizinkan.'));
  }
}));
app.use(express.json({ limit: '100kb' }));

function sendError(res, status, message) {
  return res.status(status).json({ message });
}

function createToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return sendError(res, 401, 'Silakan masuk terlebih dahulu.');
    const payload = jwt.verify(token, JWT_SECRET);
    const db = await getDb();
    const user = db.users.find((item) => item.id === payload.sub);
    if (!user || user.role !== payload.role) return sendError(res, 401, 'Sesi tidak valid. Silakan masuk kembali.');
    req.user = user;
    return next();
  } catch {
    return sendError(res, 401, 'Sesi berakhir atau tidak valid. Silakan masuk kembali.');
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return sendError(res, 403, 'Kamu tidak memiliki izin untuk membuka bagian ini.');
    }
    return next();
  };
}

function progressFor(user) {
  const learned = new Set(user.learnedWords || []);
  const learnedCount = words.filter((word) => learned.has(word.id)).length;
  const history = [...(user.quizHistory || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const bestScore = history.reduce((best, quiz) => Math.max(best, quiz.score), 0);
  return {
    learnedWords: [...learned],
    learnedCount,
    remainingCount: words.length - learnedCount,
    totalWords: words.length,
    percentage: Math.round((learnedCount / words.length) * 100),
    quizHistory: history,
    bestScore
  };
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function cleanExpiredQuizSessions() {
  const now = Date.now();
  for (const [id, session] of quizSessions.entries()) {
    if (now - session.createdAt > QUIZ_SESSION_TTL) quizSessions.delete(id);
  }
}

function quizMessage(score) {
  if (score >= 8) return 'Hebat! Kamu menguasai banyak kosakata. Pertahankan semangat belajarmu!';
  if (score >= 5) return 'Bagus! Kamu sudah berusaha dengan baik. Ayo berlatih lagi agar makin hebat!';
  return 'Jangan menyerah. Setiap latihan membuatmu semakin pintar. Yuk, pelajari kosakatanya lagi!';
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'Arab Ceria API' }));

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body?.name || '').trim().replace(/\s+/g, ' ');
  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (name.length < 2 || name.length > 50) return sendError(res, 400, 'Nama harus terdiri dari 2–50 karakter.');
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return sendError(res, 400, 'Username harus 3–20 karakter dan hanya boleh berisi huruf kecil, angka, atau garis bawah.');
  }
  if (username === 'guru') return sendError(res, 400, 'Username tersebut khusus untuk akun guru.');
  if (password.length < 6 || Buffer.byteLength(password, 'utf8') > 72) {
    return sendError(res, 400, 'Password harus minimal 6 karakter dan maksimal 72 byte.');
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await updateDb((db) => {
      if (db.users.some((item) => item.username === username)) {
        const error = new Error('Username sudah digunakan. Coba username lain.');
        error.status = 409;
        throw error;
      }
      const newUser = {
        id: randomUUID(),
        name,
        username,
        passwordHash,
        role: 'student',
        learnedWords: [],
        quizHistory: [],
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      return publicUser(newUser);
    });
    return res.status(201).json({ message: 'Akun berhasil dibuat. Silakan masuk.', user });
  } catch (error) {
    return sendError(res, error.status || 500, error.status ? error.message : 'Pendaftaran belum berhasil. Silakan coba lagi.');
  }
});

app.post('/api/auth/login', async (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!username || !password) return sendError(res, 400, 'Username dan password harus diisi.');
  if (Buffer.byteLength(password, 'utf8') > 72) return sendError(res, 400, 'Password tidak boleh lebih dari 72 byte.');
  try {
    const db = await getDb();
    const user = db.users.find((item) => item.username === username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return sendError(res, 401, 'Username atau password belum tepat.');
    }
    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch {
    return sendError(res, 500, 'Terjadi kesalahan saat masuk.');
  }
});

app.get('/api/auth/me', authenticate, (req, res) => res.json({ user: publicUser(req.user) }));
app.post('/api/auth/logout', authenticate, (_req, res) => res.json({ message: 'Berhasil keluar.' }));

app.get('/api/words', (_req, res) => res.json({ categories, words }));

app.get('/api/progress/me', authenticate, requireRole('student'), (req, res) => {
  res.json({ student: publicUser(req.user), progress: progressFor(req.user) });
});

app.post('/api/progress/learned', authenticate, requireRole('student'), async (req, res) => {
  const wordId = String(req.body?.wordId || '');
  const learned = req.body?.learned;
  if (!words.some((word) => word.id === wordId)) return sendError(res, 400, 'Kosakata tidak ditemukan.');
  if (typeof learned !== 'boolean') return sendError(res, 400, 'Status belajar tidak valid.');
  try {
    const updated = await updateDb((db) => {
      const user = db.users.find((item) => item.id === req.user.id);
      const learnedSet = new Set(user.learnedWords || []);
      if (learned) learnedSet.add(wordId);
      else learnedSet.delete(wordId);
      user.learnedWords = [...learnedSet];
      return { student: publicUser(user), progress: progressFor(user) };
    });
    return res.json(updated);
  } catch {
    return sendError(res, 500, 'Progres belum berhasil disimpan.');
  }
});

// Soal dan pilihan diacak di server. Kunci jawaban tidak dikirim ke browser.
app.post('/api/quiz/start', authenticate, requireRole('student'), (req, res) => {
  cleanExpiredQuizSessions();
  const quizId = randomUUID();
  const answerKey = {};
  const questions = shuffle(words).slice(0, 10).map((word) => {
    const direction = Math.random() < 0.5 ? 'arabic-to-meaning' : 'meaning-to-arabic';
    const options = shuffle([word, ...shuffle(words.filter((item) => item.id !== word.id)).slice(0, 3)]);
    const questionId = randomUUID();
    answerKey[questionId] = word.id;
    return {
      id: questionId,
      direction,
      prompt: direction === 'arabic-to-meaning' ? word.arabic : word.meaning,
      promptEmoji: direction === 'meaning-to-arabic' ? word.emoji : null,
      options: options.map((option) => ({
        id: option.id,
        label: direction === 'arabic-to-meaning' ? option.meaning : option.arabic,
        emoji: direction === 'arabic-to-meaning' ? option.emoji : null
      }))
    };
  });
  quizSessions.set(quizId, {
    userId: req.user.id,
    answerKey,
    questions,
    answers: {},
    createdAt: Date.now()
  });
  return res.status(201).json({ quizId, questions });
});

app.post('/api/quiz/answer', authenticate, requireRole('student'), (req, res) => {
  const quizId = String(req.body?.quizId || '');
  const questionId = String(req.body?.questionId || '');
  const optionId = String(req.body?.optionId || '');
  const session = quizSessions.get(quizId);
  if (!session || Date.now() - session.createdAt > QUIZ_SESSION_TTL) {
    quizSessions.delete(quizId);
    return sendError(res, 410, 'Sesi kuis sudah berakhir. Silakan mulai kuis baru.');
  }
  if (session.userId !== req.user.id) return sendError(res, 403, 'Kuis ini bukan milik akunmu.');
  const question = session.questions.find((item) => item.id === questionId);
  if (!question) return sendError(res, 400, 'Soal tidak ditemukan dalam kuis ini.');
  if (Object.hasOwn(session.answers, questionId)) return sendError(res, 409, 'Jawaban untuk soal ini sudah dikirim.');
  const option = question.options.find((item) => item.id === optionId);
  if (!option) return sendError(res, 400, 'Pilihan jawaban tidak tersedia.');
  session.answers[questionId] = optionId;
  const correctOptionId = session.answerKey[questionId];
  const correctOption = question.options.find((item) => item.id === correctOptionId);
  return res.json({
    isCorrect: optionId === correctOptionId,
    correctOptionId,
    correctAnswer: correctOption.label,
    correctEmoji: correctOption.emoji
  });
});

app.post('/api/quiz/submit', authenticate, requireRole('student'), async (req, res) => {
  const quizId = String(req.body?.quizId || '');
  const session = quizSessions.get(quizId);
  if (!session || Date.now() - session.createdAt > QUIZ_SESSION_TTL) {
    quizSessions.delete(quizId);
    return sendError(res, 410, 'Sesi kuis sudah berakhir. Silakan mulai kuis baru.');
  }
  if (session.userId !== req.user.id) return sendError(res, 403, 'Kuis ini bukan milik akunmu.');
  if (Object.keys(session.answers).length !== 10) return sendError(res, 400, 'Selesaikan semua 10 soal sebelum menyimpan nilai.');

  const score = session.questions.reduce((sum, question) => (
    sum + (session.answers[question.id] === session.answerKey[question.id] ? 1 : 0)
  ), 0);
  const result = {
    id: randomUUID(),
    score,
    total: 10,
    percentage: score * 10,
    createdAt: new Date().toISOString()
  };
  try {
    await updateDb((db) => {
      const user = db.users.find((item) => item.id === req.user.id);
      user.quizHistory = [...(user.quizHistory || []), result];
    });
    quizSessions.delete(quizId);
    return res.status(201).json({ result, message: quizMessage(score) });
  } catch {
    return sendError(res, 500, 'Nilai kuis belum berhasil disimpan.');
  }
});

app.get('/api/teacher/students', authenticate, requireRole('teacher'), async (_req, res) => {
  try {
    const db = await getDb();
    const students = db.users
      .filter((user) => user.role === 'student')
      .map((user) => ({ ...publicUser(user), progress: progressFor(user) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id'));
    return res.json({ students, totalStudents: students.length });
  } catch {
    return sendError(res, 500, 'Data siswa belum dapat dimuat.');
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return sendError(res, 500, err.message === 'Asal permintaan tidak diizinkan.' ? err.message : 'Terjadi kesalahan pada server.');
});

await initializeDb();
app.listen(PORT, () => {
  console.log(`Arab Ceria API berjalan di http://localhost:${PORT}`);
  console.log('Akun demo guru: username guru, password guru123');
});

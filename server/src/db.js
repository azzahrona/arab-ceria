import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const DB_PATH = path.resolve(here, '../data/db.json');
let writeQueue = Promise.resolve();

async function readFileDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users)) {
      throw new Error('Struktur server/data/db.json tidak valid.');
    }
    return { version: 1, users: [], ...parsed };
  } catch (error) {
    if (error.code === 'ENOENT') return { version: 1, users: [] };
    throw error;
  }
}

async function atomicWrite(db) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  // Nama sementara unik dan rename atomik mencegah file JSON terbaca setengah.
  const tempPath = `${DB_PATH}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(tempPath, `${JSON.stringify(db, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
    await fs.rename(tempPath, DB_PATH);
  } catch (error) {
    await fs.rm(tempPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

export async function initializeDb() {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  const db = await readFileDb();
  const teacher = db.users.find((user) => user.username === 'guru');
  if (!teacher) {
    db.users.push({
      id: 'teacher-demo',
      name: 'Guru Arab Ceria',
      username: 'guru',
      passwordHash: await bcrypt.hash('guru123', 10),
      role: 'teacher',
      learnedWords: [],
      quizHistory: [],
      createdAt: new Date().toISOString()
    });
  } else if (teacher.role !== 'teacher') {
    throw new Error('Username guru sudah dipakai oleh akun non-guru di db.json.');
  }
  await atomicWrite(db);
}

export async function getDb() {
  await writeQueue;
  return readFileDb();
}

/**
 * Semua perubahan data melewati antrean tunggal dalam proses server ini.
 * File ditulis ke file sementara lalu dipindahkan dengan rename atomik.
 */
export function updateDb(mutator) {
  const task = writeQueue.then(async () => {
    const db = await readFileDb();
    const result = await mutator(db);
    await atomicWrite(db);
    return result;
  });
  writeQueue = task.catch(() => undefined);
  return task;
}

export function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role,
    createdAt: user.createdAt
  };
}

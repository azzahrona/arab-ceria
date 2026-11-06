import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ProgressBar from '../components/ProgressBar';

function formatDate(value) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value));
}

export default function TeacherPage() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    setError('');
    api('/teacher/students').then((data) => {
      setStudents(data.students);
      setSelectedId((current) => current || data.students[0]?.id || '');
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(() => { refresh(); }, []);

  const selected = students.find((student) => student.id === selectedId);
  const average = students.length ? Math.round(students.reduce((sum, student) => sum + (student.progress.quizHistory.length ? student.progress.quizHistory.reduce((a, q) => a + q.score * 10, 0) / student.progress.quizHistory.length : 0), 0) / students.length) : 0;

  return (
    <div className="page-container content-page teacher-page">
      <section className="page-title-row"><div><span className="eyebrow">👩‍🏫 RUANG PENDAMPING</span><h1>Dashboard Guru</h1><p>Pantau perjalanan belajar dan hasil latihan seluruh siswa.</p></div><div className="page-title-emoji">📊</div></section>
      {error && <div className="notice-error">⚠️ {error}</div>}
      <section className="teacher-overview"><div><span>👧🧒</span><strong>{students.length}</strong><small>Total siswa terdaftar</small></div><div><span>📚</span><strong>{students.length ? Math.round(students.reduce((sum, s) => sum + s.progress.percentage, 0) / students.length) : 0}%</strong><small>Rata-rata progres kosakata</small></div><div><span>⭐</span><strong>{average}</strong><small>Rata-rata nilai kuis</small></div></section>
      <section className="teacher-content-grid">
        <div className="student-list-panel"><div className="panel-heading"><div><span className="eyebrow">DAFTAR KELAS</span><h2>Siswa terdaftar</h2></div><button className="refresh-button" onClick={refresh} title="Muat ulang">↻</button></div>
          {loading ? <div className="empty-state">Memuat data siswa...</div> : students.length ? <div className="student-list">{students.map((student) => <button key={student.id} className={`student-list-item ${selectedId === student.id ? 'selected' : ''}`} onClick={() => setSelectedId(student.id)}><span className="student-list-avatar">🧒</span><span className="student-list-name"><strong>{student.name}</strong><small>@{student.username}</small></span><span className="student-list-percent">{student.progress.percentage}%</span></button>)}</div> : <div className="empty-history"><span>🌱</span><strong>Belum ada siswa</strong><p>Siswa yang mendaftar akan muncul di sini.</p></div>}
        </div>
        <div className="student-detail-panel">
          {selected ? <>
            <div className="student-detail-heading"><div className="student-avatar small-avatar">🧑🏻‍🎓</div><div><span>PROFIL SISWA</span><h2>{selected.name}</h2><small>@{selected.username} · Bergabung {formatDate(selected.createdAt)}</small></div></div>
            <ProgressBar value={selected.progress.percentage} label="Progres belajar kosakata" />
            <div className="student-detail-stats"><div><strong>{selected.progress.learnedCount}</strong><small>Kata dipelajari</small></div><div><strong>{selected.progress.remainingCount}</strong><small>Belum dipelajari</small></div><div><strong>{selected.progress.bestScore * 10}</strong><small>Nilai terbaik</small></div></div>
            <div className="teacher-history-heading"><h3>Riwayat kuis</h3><span>{selected.progress.quizHistory.length} percobaan</span></div>
            {selected.progress.quizHistory.length ? <div className="teacher-quiz-list">{selected.progress.quizHistory.map((quiz) => <div className="teacher-quiz-row" key={quiz.id}><span>📝 {formatDate(quiz.createdAt)}</span><strong className={quiz.score >= 8 ? 'score-good' : ''}>{quiz.score * 10}/100</strong></div>)}</div> : <p className="no-quiz-yet">Siswa ini belum mengerjakan kuis.</p>}
          </> : <div className="empty-state"><span>👈</span><strong>Pilih siswa</strong><p>Pilih nama siswa untuk melihat detail perkembangannya.</p></div>}
        </div>
      </section>
      <p className="teacher-note">🔒 Data siswa hanya ditampilkan pada dashboard guru setelah guru masuk.</p>
    </div>
  );
}

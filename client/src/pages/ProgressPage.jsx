import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

function formatDate(value) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/progress/me').then(setData).catch((err) => setError(err.message)); }, []);

  if (error) return <div className="page-container content-page"><div className="notice-error">⚠️ {error}</div></div>;
  if (!data) return <div className="page-container empty-state">🌼 Menghitung progres belajarmu...</div>;
  const progress = data.progress;

  return (
    <div className="page-container content-page">
      <section className="page-title-row"><div><span className="eyebrow">🏆 PENCAPAIANMU</span><h1>Progres Belajar</h1><p>Setiap kata yang kamu pelajari adalah prestasi. Terus bertumbuh!</p></div><div className="page-title-emoji">🌻</div></section>
      <section className="student-welcome-card"><div className="student-avatar">🧑🏻‍🎓</div><div><span>Halo, pejuang bahasa Arab!</span><h2>{user?.name}</h2><p>Terus semangat menambah kosakata baru, ya.</p></div><div className="welcome-medal">🏅</div></section>
      <section className="stats-grid">
        <div className="stat-card stat-mint"><span>📚</span><strong>{progress.learnedCount}</strong><small>Kosakata dipelajari</small></div>
        <div className="stat-card stat-yellow"><span>🌱</span><strong>{progress.remainingCount}</strong><small>Kosakata belum dipelajari</small></div>
        <div className="stat-card stat-pink"><span>⭐</span><strong>{progress.quizHistory.length}</strong><small>Kuis diselesaikan</small></div>
        <div className="stat-card stat-blue"><span>🏆</span><strong>{progress.bestScore * 10}</strong><small>Nilai terbaik</small></div>
      </section>
      <section className="progress-panel"><div className="panel-heading"><div><span className="eyebrow">LANGKAH KECILMU</span><h2>Perjalanan kosakata</h2></div><span className="big-percent">{progress.percentage}%</span></div><ProgressBar value={progress.percentage} label="Kosakata yang sudah dipelajari" /><p className="progress-caption">Kamu sudah mempelajari {progress.learnedCount} dari {progress.totalWords} kosakata. {progress.percentage === 100 ? 'Hebat! Semua kata sudah dipelajari!' : 'Ayo lanjutkan, sedikit lagi kamu semakin hebat!'}</p></section>
      <section className="history-panel"><div className="panel-heading"><div><span className="eyebrow">CATATAN LATIHAN</span><h2>Riwayat nilai kuis</h2></div><span className="history-icon">📝</span></div>
        {progress.quizHistory.length ? <div className="history-list">{progress.quizHistory.map((quiz, index) => <div className="history-row" key={quiz.id}><div className="history-medal">{index === 0 ? '🌟' : '⭐'}</div><div className="history-info"><strong>Kuis Bahasa Arab</strong><small>{formatDate(quiz.createdAt)}</small></div><div className="history-score"><strong>{quiz.score * 10}</strong><small>/ 100</small></div></div>)}</div> : <div className="empty-history"><span>✏️</span><strong>Belum ada nilai kuis</strong><p>Yuk, coba kuis pertamamu dan lihat hasilnya di sini.</p></div>}
      </section>
    </div>
  );
}

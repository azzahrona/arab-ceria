import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ initialMode = 'login' }) {
  const [searchParams] = useSearchParams();
  const teacherMode = searchParams.get('role') === 'guru';
  const [mode, setMode] = useState(teacherMode ? 'login' : initialMode);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') {
        await register(name, username, password);
        await login(username, password);
      } else {
        await login(username, password);
      }
      navigate(teacherMode || username.trim().toLowerCase() === 'guru' ? '/guru' : '/belajar');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <div className="auth-decoration"><span>🌟</span><span>📚</span><span>🌈</span><span>🧸</span></div>
      <section className="auth-card">
        <div className="auth-illustration">{teacherMode ? '👩‍🏫' : '🧑🏻‍🎓'}</div>
        <span className="eyebrow">{teacherMode ? 'RUANG GURU' : 'RUANG BELAJAR'}</span>
        <h1>{teacherMode ? 'Selamat datang, Guru!' : mode === 'register' ? 'Ayo buat akun!' : 'Senang bertemu lagi!'}</h1>
        <p className="auth-intro">{teacherMode ? 'Masuk untuk melihat perkembangan belajar siswa.' : mode === 'register' ? 'Isi data singkat berikut dan mulai petualangan bahasa Arabmu.' : 'Masuk untuk melanjutkan petualangan bahasa Arabmu.'}</p>

        {!teacherMode && <div className="auth-tabs"><button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>Masuk</button><button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>Daftar siswa</button></div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && <label>Nama lengkap<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Aisyah Putri" minLength={2} maxLength={50} required /></label>}
          <label>Username<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Contoh: aisyah123" autoComplete="username" minLength={3} maxLength={20} required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={6} required /></label>
          {error && <div className="form-error" role="alert">⚠️ {error}</div>}
          <button className="button button-primary button-large button-full" type="submit" disabled={busy}>{busy ? 'Sebentar...' : mode === 'register' ? 'Buat akun dan mulai' : 'Masuk sekarang'} <span>→</span></button>
        </form>
        {teacherMode && <div className="demo-credential"><strong>🔑 Akun demo guru</strong><span>Username: <b>guru</b></span><span>Password: <b>guru123</b></span></div>}
        {!teacherMode && <p className="auth-switch">{mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}<button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}</button></p>}
        <Link to="/" className="back-home">← Kembali ke beranda</Link>
      </section>
    </div>
  );
}

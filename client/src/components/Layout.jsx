import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/belajar', label: 'Belajar', icon: '📚' },
  { to: '/kuis', label: 'Kuis', icon: '⭐' },
  { to: '/permainan', label: 'Permainan', icon: '🎮' },
  { to: '/progres', label: 'Progres', icon: '🏆' }
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label="Arab Ceria, halaman utama">
            <span className="brand-mark">أ</span>
            <span><strong>Arab Ceria</strong><small>Belajar jadi menyenangkan!</small></span>
          </Link>
          <nav className="main-nav" aria-label="Navigasi utama">
            <NavLink to="/" end>Beranda</NavLink>
            {user?.role === 'student' && studentLinks.map((link) => <NavLink key={link.to} to={link.to}>{link.icon} {link.label}</NavLink>)}
            {user?.role === 'teacher' && <NavLink to="/guru">Dashboard Guru</NavLink>}
          </nav>
          <div className="header-action">
            {user ? (
              <>
                <span className="user-chip">{user.role === 'teacher' ? '👩‍🏫' : '👋'} {user.name.split(' ')[0]}</span>
                <button className="button button-small button-ghost" onClick={handleLogout}>Keluar</button>
              </>
            ) : <Link className="button button-small button-primary" to="/masuk">Masuk</Link>}
          </div>
        </div>
      </header>
      <main className="page-main">{children}</main>
      <footer className="site-footer">
        <span>🌈 Arab Ceria</span>
        <span>Belajar sedikit demi sedikit, hebat setiap hari!</span>
      </footer>
    </div>
  );
}

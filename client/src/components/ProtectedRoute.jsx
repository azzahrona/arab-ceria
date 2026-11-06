import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role = 'student' }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><span className="loading-bubble">🌼</span><p>Menyiapkan kelas ceria...</p></div>;
  if (!user) return <Navigate to="/masuk" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'teacher' ? '/guru' : '/progres'} replace />;
  return children;
}

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setLoading(false);
      return () => { active = false; };
    }
    api('/auth/me')
      .then((data) => { if (active) setUser(data.user); })
      .catch(() => { setToken(null); if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const login = async (username, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { username, password } });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, username, password) => api('/auth/register', {
    method: 'POST', body: { name, username, password }
  });

  const logout = async () => {
    try { await api('/auth/logout', { method: 'POST' }); } catch { /* token tetap dihapus di sisi lokal */ }
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth harus digunakan di dalam AuthProvider.');
  return value;
}

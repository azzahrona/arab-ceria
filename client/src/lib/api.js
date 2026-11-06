const API_BASE = import.meta.env.VITE_API_URL || '';

export function getToken() {
  return localStorage.getItem('arab-ceria-token');
}

export function setToken(token) {
  if (token) localStorage.setItem('arab-ceria-token', token);
  else localStorage.removeItem('arab-ceria-token');
}

export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}/api${path}`, {
      ...options,
      headers,
      body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Pastikan backend sudah dijalankan.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Permintaan belum berhasil. Silakan coba lagi.');
  return data;
}

import api from './client';

export async function adminLogin(payload: { email: string; password: string }) {
  const res = await api.post('/admin/login', payload);
  const token = res.data?.data;
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  return res.data;
}

import api from './client';

export async function adminLogin(payload: { email: string; password: string }) {
  try {
    const res = await api.post('/admin/login', payload);
    return res;
  } catch (e) {
    console.error(e);
  }
}

export async function fetchMe() {
  try {
    const res = await api.get('/admin/me');
    console.log(res);
    return res;
  } catch (e) {
    console.error(e);
  }
}

export function logout() {
  try {
    api.post('admin/logout');
  } catch (e) {
    console.error(e);
  }
}

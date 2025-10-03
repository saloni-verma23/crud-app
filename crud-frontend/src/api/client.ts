import axios from 'axios';
import router from '../router';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      if (router.currentRoute.value.path != '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

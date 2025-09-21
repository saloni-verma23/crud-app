import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminLogin, logout } from '../api/authAPI';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  const email = ref('superadmin@cgi.com');
  const password = ref('superadmin@123');
  const loading = ref(false);
  const error = ref('');
  const token = ref<string | null>();
  const isAuthenticated = ref(!!localStorage.getItem('auth_token'));

  async function submit() {
    error.value = '';
    loading.value = true;
    try {
      const res = await adminLogin({ email: email.value, password: password.value });
      if (res?.success) {
        isAuthenticated.value = true;
        router.push('/dashboard');
      } else {
        error.value = res?.message || 'Login failed';
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message || 'Login failed';
    } finally {
      loading.value = false;
    }
  }

  function handleLogout() {
    logout();
    isAuthenticated.value = false;
    router.push('/login');
  }

  return { email, password, loading, error, submit, isAuthenticated, handleLogout };
});

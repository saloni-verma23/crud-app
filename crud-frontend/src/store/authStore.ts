import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { adminLogin, fetchMe, logout } from '../api/authAPI';
import router from '../router';

interface User {
  adminId: number | null;
  email: string;
  role: string;
  permissions: string[];
}

export const useAuthStore = defineStore('auth', () => {
  const email = ref('');
  const password = ref('');
  const loading = ref(false);
  const error = ref('');
  const user = ref<User>({
    adminId: null,
    email: '',
    role: '',
    permissions: [],
  });
  const autoFetched = ref(false);
  const isAuthenticated = computed(() => user.value?.adminId);

  async function submit() {
    error.value = '';
    loading.value = true;
    try {
      const res = await adminLogin({ email: email.value, password: password.value });
      if (res?.data.success) {
        await loadAdmin();
        router.push('/dashboard');
      } else {
        error.value = res?.data.message || 'Login failed';
      }
    } catch (e: any) {
      error.value = e?.response?.data?.message || 'Login failed';
    } finally {
      loading.value = false;
    }
  }

  async function loadAdmin() {
    try {
      const res = await fetchMe();
      user.value = res?.data.data;
      console.log(user.value);
    } catch (e) {
      console.log("can't fetch admin");
    } finally {
      autoFetched.value = true;
    }
  }

  function isPermitted(permission: string) {
    return user.value.permissions.includes(permission);
  }

  function handleLogout() {
    logout();
    router.push('/login');
    user.value = {
      adminId: null,
      email: '',
      role: '',
      permissions: [],
    };
  }

  return {
    email,
    password,
    loading,
    error,
    submit,
    isAuthenticated,
    handleLogout,
    autoFetched,
    loadAdmin,
    user,
    isPermitted,
  };
});

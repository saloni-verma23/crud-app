<script setup lang="ts">
import router from '../router';
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
function goToLogin() {
  router.push('/login');
}
function goToDashboard(){
  router.push("/dashboard");
}
</script>
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
    <div class="container-fluid">
      <a class="navbar-brand d-flex align-items-center" href="/">
        <span class="logo-text me-2">CGI</span>
        <span class="fw-bold fs-5 logo-sub-text">CrudApp</span>
      </a>
      <div class="flex-grow-1"></div>
      <a
        v-if="auth.autoFetched && auth.isAuthenticated"
        @click="goToDashboard"
        class="nav-link px-4 py-2"
        >Dashboard</a
      >

      <button
        v-if="auth.autoFetched && !auth.isAuthenticated"
        class="btn primary-btn px-4 py-2"
        type="button"
        @click="goToLogin"
      >
        Login
      </button>

      <button
        v-if="auth.autoFetched && auth.isAuthenticated"
        class="btn primary-btn px-4 py-2"
        type="button"
        @click="auth.handleLogout"
      >
        Logout
      </button>
    </div>
  </nav>
</template>

<style scoped>
.logo-text {
  display: inline-block;
  background: linear-gradient(90deg, var(--dark) 60%, var(--primary) 100%);
  color: #fff;
  font-weight: bold;
  font-size: 1.5rem;
  border-radius: 50%;
  width: 50px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.08);
}

.logo-sub-text {
  color: var(--dark);
}
@media (max-width: 576px) {
  .navbar-brand span {
    font-size: 1rem;
  }
  .logo-text {
    font-size: 1.1rem;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }
}
</style>

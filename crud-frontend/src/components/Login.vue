<script setup lang="ts">
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-4">
            <h3 class="text-center mb-4 fw-bold login-heading">Admin Login</h3>
            <form @submit.prevent="authStore.submit">
              <div class="mb-3">
                <label for="email" class="form-label fw-semibold">Email</label>
                <input
                  v-model="authStore.email"
                  id="email"
                  type="email"
                  class="form-control form-control-lg"
                  placeholder="Enter your email"
                  autocomplete="username"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label fw-semibold">Password</label>
                <input
                  v-model="authStore.password"
                  id="password"
                  type="password"
                  class="form-control form-control-lg"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  required
                />
              </div>
              <div class="d-grid mb-2">
                <button class="btn primary-btn btn-lg" type="submit" :disabled="authStore.loading">
                  <span
                    v-if="authStore.loading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  Login
                </button>
              </div>
              <div v-if="authStore.error" class="alert alert-danger mt-2 py-2 text-center">
                {{ authStore.error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 1rem;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(90deg, #6c63ff 60%, #0d6efd 100%);
  color: #fff;
}
.form-label {
  color: var(--accent);
}
.login-heading {
  color: var(--dark);
}
@media (max-width: 576px) {
  .card-body {
    padding: 1rem !important;
  }
  .form-control-lg {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
  }
  .btn-lg {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}
</style>

<script setup lang="ts">
import { useAuthStore } from '../store/authStore';

const auth = useAuthStore();
</script>
<template>
  <div class="container col-xxl-8">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img
          src="/cover-img.png"
          class="d-block mx-lg-auto img-fluid"
          alt="Bootstrap Themes"
          width="700"
          height="500"
          loading="lazy"
        />
      </div>
      <div class="col-lg-6">
        <h1 class="display-4 fw-bold hero-heading lh-1 mb-3 text-start">Welcome to CGI Crud App</h1>
        <p class="lead text-start mb-4">
          CGI Crud App helps you manage users efficiently with a modern, responsive interface.<br />
          Please proceed to login for further details and access to all features.
        </p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
          <button
            v-if="!auth.isAuthenticated"
            type="button"
            class="btn primary-btn btn-lg px-4"
            @click="$router.push('/login')"
          >
            Login
          </button>
          <button
            v-else
            type="button"
            class="btn primary-btn btn-lg px-4"
            @click="auth.handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.hero-heading {
  color: var(--dark);
}
</style>

<template>
  <div class="container text-center my-5">
    <h1 class="mb-4">Welcome to User Management</h1>
    <p class="mb-4">Please login to access the admin dashboard.</p>
    <button class="btn btn-primary px-4" @click="goToLogin">Login</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToLogin() {
  router.push('/login');
}
</script>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: 600;
}
</style>

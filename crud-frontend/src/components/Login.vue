<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminLogin } from '../api/authAPI';

const router = useRouter();
const email = ref('superadmin@cgi.com');
const password = ref('superadmin@123');
const loading = ref(false);
const error = ref('');

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    const res = await adminLogin({ email: email.value, password: password.value });
    if (res?.success) {
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
</script>

<template>
  <div class="container my-5">
    <div class="card mx-auto" style="max-width: 420px">
      <div class="card-body">
        <h3 class="text-center mb-3">Admin Login</h3>
        <form @submit.prevent="submit">
          <div class="mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="Email" />
          </div>
          <div class="mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Password" />
          </div>
          <div class="text-center">
            <button class="btn submitBtn" type="submit" :disabled="loading">Login</button>
          </div>
          <div v-if="error" class="text-danger mt-2">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.submitBtn {
  width: 100%;
  background-color: var(--secondary);
  color: white;
}
.submitBtn:hover {
  border: 2px solid var(--accent);
  background-color: white;
  color: var(--accent);
}
</style>

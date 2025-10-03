<script setup lang="ts">
import Header from './components/Header.vue';
import { onMounted } from 'vue';
import { useAuthStore } from './store/authStore';
import router from './router';

const authStore = useAuthStore();
onMounted(async () => {
  await authStore.loadAdmin();
});
</script>

<template>
  <Header />
  <router-view />
</template>

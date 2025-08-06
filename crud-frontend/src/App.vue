<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUsers } from './api/userAPI';
import UserTable from './components/UserTable.vue';
import UserForm from './components/UserForm.vue';

const users = ref([]);
const showForm = ref(false);

onMounted(async () => {
  users.value = await getUsers();
});

async function loadUsers() {
  users.value = await getUsers();
}
function openForm() {
  showForm.value = true;
}
function closeForm() {
  showForm.value = false;
}
</script>

<template>
  <div>
    <div class="table-container px-5 m-5">
      <button class="btn submitBtn" @click="openForm">Add User</button>
      <UserForm v-if="showForm" @close="closeForm" @refresh="loadUsers" />

      <UserTable :users="users" @refresh="loadUsers" />
    </div>
  </div>
</template>

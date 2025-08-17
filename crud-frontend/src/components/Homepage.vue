<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUsers } from '../api/userAPI';
import UserTable from './UserTable.vue';
import { useRouter } from 'vue-router';

const users = ref([]);
const router = useRouter();

onMounted(async () => {
  users.value = await getUsers();
});

async function loadUsers() {
  users.value = await getUsers();
}

function goToUserForm() {
  router.push('/user/save');
}
</script>

<template>
  <div>
    <div class="table-container container mx-auto px-5 m-5">
      <div class="d-flex">
        <button class="btn submitBtn ms-auto" @click="goToUserForm">Add User</button>
      </div>
      <UserTable :users="users" @refresh="loadUsers" />
    </div>
  </div>
</template>

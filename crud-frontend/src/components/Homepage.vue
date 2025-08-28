<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getUsers } from '../api/userAPI';
import UserTable from './UserTable.vue';
import { useRouter } from 'vue-router';

const users = ref([]);
const totalUsers = ref(0);
const currentPage = ref(1);
const usersPerPage = ref(10);
const sortBy = ref('');
const sortOrder = ref<'asc' | 'desc' | undefined>(undefined);

const router = useRouter();
const searchQuery = ref('');

watch(currentPage, loadUsers);

const sortByOptions = [
  {
    value: 'first_name',
    label: 'First Name',
  },
  {
    value: 'dob',
    label: 'Date of Birth',
  },
];
const sortOrderOptions = [
  { value: 'asc', label: 'asc' },
  { value: 'desc', label: 'desc' },
];
onMounted(loadUsers);

async function loadUsers() {
  try {
    const userData = await getUsers({
      query: searchQuery.value || undefined,
      page: currentPage.value,
      limit: usersPerPage.value,
      sortBy: sortBy.value || 'created_at',
      order: sortOrder.value || 'desc',
    });

    users.value = userData.users;
    totalUsers.value = userData.totalUsers;
  } catch (error) {
    console.error('Failed to load users:', error);
  }
}

async function handleSearchInput() {
  currentPage.value = 1;
  await loadUsers();
}

function goToUserForm() {
  router.push('/user/save');
}
</script>

<template>
  <div>
    <div class="table-container container mx-auto px-5 m-5">
      <h1 class="text-center mb-4 user-heading">User Management Panel</h1>
      <div class="row align-items-center">
        <!-- Search bar -->
        <div class="col-md-6 d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            v-model="searchQuery"
            @input="handleSearchInput"
          />
        </div>
        <!-- Sort By: -->
        <div class="col-md-2">
          <select class="form-select" v-model="sortBy" @change="loadUsers">
            <option disabled value="">Sort By:</option>
            <option v-for="option in sortByOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <!-- User button-->
        <div class="col-md-4 text-end">
          <button class="btn submitBtn ms-auto" @click="goToUserForm">Add User</button>
        </div>
      </div>
      <UserTable
        :users="users"
        @refresh="loadUsers"
        :totalUsers="totalUsers"
        v-model:currentPage="currentPage"
        :usersPerPage="usersPerPage"
        v-model:sortBy="sortBy"
        v-model:sortOrder="sortOrder"
        :sortOrderOptions="sortOrderOptions"
      />
    </div>
  </div>
</template>

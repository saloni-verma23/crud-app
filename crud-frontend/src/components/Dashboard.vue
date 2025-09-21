<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import UserTable from './UserTable.vue';

const userStore = useUserStore();
const router = useRouter();

watch(
  () => userStore.currentPage,
  () => {
    userStore.fetchUsers();
  }
);

watch(
  () => userStore.sortBy,
  () => {
    userStore.fetchUsers();
  }
);

watch(
  () => userStore.sortOrder,
  () => {
    userStore.fetchUsers();
  }
);

onMounted(() => {
  userStore.fetchUsers();
});

const handleSearchInput = async () => {
  await userStore.fetchUsers();
};

const handleSortChange = async () => {
  await userStore.fetchUsers();
};

const goToUserForm = () => {
  router.push('/user/save');
};
</script>

<template>
  <div>
    <div class="table-container container mx-auto px-5 m-5">
      <h1 class="text-center mb-4 user-heading">User Management Panel</h1>

      <div v-if="userStore.error" class="alert alert-danger alert-dismissible" role="alert">
        {{ userStore.error }}
        <button
          type="button"
          class="btn-close"
          @click="userStore.clearError()"
          aria-label="Close"
        ></button>
      </div>

      <div class="row align-items-center">
        <div class="col-md-6 d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search users..."
            aria-label="Search"
            v-model="userStore.searchQuery"
            @input="handleSearchInput"
          />
        </div>

        <div class="col-md-2">
          <select class="form-select" v-model="userStore.sortBy" @change="handleSortChange">
            <option disabled value="">Sort By:</option>
            <option
              v-for="option in userStore.sortByOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="col-md-4 text-end">
          <button class="btn submitBtn ms-auto" @click="goToUserForm" :disabled="userStore.loading">
            <span
              v-if="userStore.loading"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            Add User
          </button>
        </div>
      </div>

      <div v-if="userStore.loading && userStore.users.length === 0" class="text-center my-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <UserTable />
    </div>
  </div>
</template>

<style scoped>
.user-heading {
  color: var(--primary);
  font-weight: 600;
}

.submitBtn {
  background-color: var(--secondary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease-in-out;
}

.submitBtn:hover:not(:disabled) {
  background-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.submitBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.table-container {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}
</style>

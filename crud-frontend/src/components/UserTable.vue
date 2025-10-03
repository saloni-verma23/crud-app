<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const goToEditForm = (id: number) => {
  router.push('/user/edit/' + id);
};


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userStore.removeUser(id);
    } catch (error) {
      console.error('Delete operation failed:', error);
    }
  }
};

const handleSortOrderChange = (newOrder: 'asc' | 'desc') => {
  userStore.updateSort(userStore.sortBy, newOrder);
  userStore.fetchUsers();
};

const handlePageChange = (page: number | string) => {
  if (typeof page === 'number') {
    userStore.goToPage(page);
  }
};
</script>

<template>
  <table class="my-5 table table-hover table-bordered">
    <thead class="table-header">
      <tr>
        <th>Sr.No.</th>
        <th>
          First Name
          <template v-if="userStore.sortBy === 'first_name'">
            <select
              class="form-select d-inline w-auto ms-2"
              v-model="userStore.sortOrder"
              @change="handleSortOrderChange(userStore.sortOrder)"
            >
              <option
                v-for="option in userStore.sortOrderOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </template>
        </th>
        <th>Last Name</th>
        <th>
          Date of Birth
          <template v-if="userStore.sortBy === 'dob'">
            <select
              class="form-select d-inline w-auto ms-2"
              v-model="userStore.sortOrder"
              @change="handleSortOrderChange(userStore.sortOrder)"
            >
              <option
                v-for="option in userStore.sortOrderOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </template>
        </th>
        <th>Mobile</th>
        <th>Address</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody v-if="userStore.users.length > 0">
      <tr v-for="(user, index) in userStore.users" :key="user.id">
        <td>{{ (userStore.currentPage - 1) * userStore.usersPerPage + index + 1 }}</td>
        <td>{{ user.first_name }}</td>
        <td>{{ user.last_name }}</td>
        <td>{{ formatDate(user.dob) }}</td>
        <td>{{ user.mobile }}</td>
        <td>{{ user.address }}</td>
        <td>
          <div class="d-flex">
              <button
              class="btn submitBtn me-3"
              @click="goToEditForm(user.id!)"
              :disabled="userStore.loading"
              v-if="authStore.isPermitted('update_user')"
            >
              Edit
            </button>
           
            <button
              class="btn btn-danger"
              @click="handleDelete(user.id!)"
              :disabled="userStore.loading"
               v-if="authStore.isPermitted('delete_user')"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>

      <tr>
        <td colspan="7">
          <div class="d-flex justify-content-center align-items-center">
            <button
              class="btn btn-outline-primary me-2"
              :disabled="userStore.currentPage <= 1 || userStore.loading"
              @click="userStore.goToPrevPage"
            >
              Previous
            </button>

            <span v-for="page in userStore.paginationRange" :key="page" class="mx-1">
              <button
                v-if="typeof page === 'number'"
                class="btn"
                :class="page === userStore.currentPage ? 'btn-primary' : 'btn-outline-primary'"
                @click="handlePageChange(page)"
                :disabled="page === userStore.currentPage || userStore.loading"
              >
                {{ page }}
              </button>
              <span v-else class="px-2">{{ page }}</span>
            </span>

            <button
              class="btn btn-outline-primary ms-2 me-5"
              :disabled="userStore.currentPage >= userStore.totalPages || userStore.loading"
              @click="userStore.goToNextPage"
            >
              Next
            </button>

            <select
              class="form-select w-auto"
              name="page"
              id="page"
              v-model="userStore.currentPage"
              @change="handlePageChange(userStore.currentPage)"
              :disabled="userStore.loading"
            >
              <option v-for="n in userStore.totalPages" :key="n" :value="n">Page {{ n }}</option>
            </select>
          </div>

          <div class="text-center mt-2 text-muted small">
            Showing {{ (userStore.currentPage - 1) * userStore.usersPerPage + 1 }} to
            {{ Math.min(userStore.currentPage * userStore.usersPerPage, userStore.totalUsers) }}
            of {{ userStore.totalUsers }} users
          </div>
        </td>
      </tr>
    </tbody>

    <tbody v-else-if="!userStore.loading">
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="text-muted">
            <i class="fas fa-users fa-3x mb-3"></i>
            <h5>No users found</h5>
            <p>
              {{
                userStore.searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'Start by adding your first user'
              }}
            </p>
          </div>
        </td>
      </tr>
    </tbody>

    <tbody v-else>
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table-header {
  background-color: var(--primary);
  color: white;
}

.table-header th {
  border: none;
  font-weight: 600;
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: rgba(var(--primary-rgb), 0.05);
}

.submitBtn {
  background-color: var(--secondary);
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: all 0.2s ease-in-out;
}

.submitBtn:hover:not(:disabled) {
  background-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-danger {
  transition: all 0.2s ease-in-out;
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
}

.btn-outline-primary:disabled {
  border-color: #dee2e6;
  color: #6c757d;
}

.form-select {
  font-size: 0.875rem;
}

.table td {
  vertical-align: middle;
}

.text-muted i {
  opacity: 0.5;
}
</style>

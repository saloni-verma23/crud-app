import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../api/userAPI';
import type { User } from '../api/userAPI';

export interface UserFilters {
  query?: string;
  page: number;
  limit: number;
  sortBy: string;
  order: 'asc' | 'desc';
}

export const useUserStore = defineStore('user', () => {
  // user states
  const users = ref<User[]>([]);
  const totalUsers = ref(0);
  const currentPage = ref(1);
  const usersPerPage = ref(10);
  const searchQuery = ref('');
  const sortBy = ref('');
  const sortOrder = ref<'asc' | 'desc'>('desc');
  const loading = ref(false);
  const error = ref<string | null>(null);

  // computed values
  const totalPages = computed(() => {
    return Math.ceil(totalUsers.value / usersPerPage.value);
  });

  const sortByOptions = computed(() => [
    { value: 'first_name', label: 'First Name' },
    { value: 'dob', label: 'Date of Birth' },
  ]);

  const sortOrderOptions = computed(() => [
    { value: 'asc', label: 'asc' },
    { value: 'desc', label: 'desc' },
  ]);

  const paginationRange = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const range: (number | string)[] = [];

    let start = current;
    let end = current + 2;

    if (end > total) {
      end = total;
      start = Math.max(1, end - 2);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 1) {
      range.unshift('...');
      range.unshift(1);
    }

    if (end < total) {
      range.push('...');
      range.push(total);
    }

    return range;
  });

  // action methods
  const fetchUsers = async () => {
    try {
      loading.value = true;
      error.value = null;

      const filters: UserFilters = {
        query: searchQuery.value || undefined,
        page: currentPage.value,
        limit: usersPerPage.value,
        sortBy: sortBy.value || 'created_at',
        order: sortOrder.value,
      };

      const userData = await getUsers(filters);
      users.value = userData.users;
      totalUsers.value = userData.totalUsers;
    } catch (err) {
      error.value = 'Failed to load users';
      console.error('Failed to load users:', err);
    } finally {
      loading.value = false;
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      loading.value = true;
      error.value = null;

      await createUser(userData);
      await fetchUsers();
    } catch (err) {
      error.value = 'Failed to create user';
      console.error('Failed to create user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateUserData = async (id: number, userData: User) => {
    try {
      loading.value = true;
      error.value = null;

      await updateUser(id, userData);
      await fetchUsers();
    } catch (err) {
      error.value = 'Failed to update user';
      console.error('Failed to update user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeUser = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;

      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      error.value = 'Failed to delete user';
      console.error('Failed to delete user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getUserData = async (id: number): Promise<User> => {
    try {
      loading.value = true;
      error.value = null;

      return await getUserById(id);
    } catch (err) {
      error.value = 'Failed to get user';
      console.error('Failed to get user:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // pagination code
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const goToPrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }
  };

  const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value = currentPage.value + 1;
    }
  };

  // search and sort code
  const updateSearch = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const updateSort = (field: string, order: 'asc' | 'desc') => {
    sortBy.value = field;
    sortOrder.value = order;
  };

  const resetFilters = () => {
    searchQuery.value = '';
    currentPage.value = 1;
    sortBy.value = '';
    sortOrder.value = 'desc';
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    users,
    totalUsers,
    currentPage,
    usersPerPage,
    searchQuery,
    sortBy,
    sortOrder,
    loading,
    error,

    totalPages,
    sortByOptions,
    sortOrderOptions,
    paginationRange,

    fetchUsers,
    addUser,
    updateUserData,
    removeUser,
    getUserData,
    goToPage,
    goToPrevPage,
    goToNextPage,
    updateSearch,
    updateSort,
    resetFilters,
    clearError,
  };
});

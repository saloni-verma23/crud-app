<script setup>
import { deleteUser } from '../api/userAPI';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
  users: Array,
  totalUsers: Number,
  currentPage: Number,
  usersPerPage: Number,
  sortBy: String,
  sortOrder: String,
  sortOrderOptions: Array,
});

const emit = defineEmits(['refresh', 'update:currentPage', 'update:sortBy', 'update:sortOrder']);
const router = useRouter();

const goToEditForm = (id) => {
  router.push('/user/edit/' + id);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

async function handleDelete(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    await deleteUser(id);
    emit('refresh');
  }
}

const totalPages = computed(() => {
  return Math.ceil(props.totalUsers / props.usersPerPage);
});

const goToPrevPage = () => {
  if (props.currentPage > 1) {
    emit('update:currentPage', props.currentPage - 1);
  }
};

const goToNextPage = () => {
  if (props.currentPage < totalPages.value) {
    emit('update:currentPage', props.currentPage + 1);
    console.log(props.currentPage);
  }
};

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
};

const paginationRange = computed(() => {
  const total = totalPages.value;
  const current = props.currentPage;
  const range = [];

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
</script>

<template>
  <table class="my-5 table table-hover table-bordered">
    <thead class="table-header">
      <tr>
        <th>Sr.No.</th>
        <th>
          First Name
          <template v-if="props.sortBy === 'first_name'">
            <select
              class="form-select d-inline w-auto ms-2"
              :value="props.sortOrder"
              @change="
                emit('update:sortOrder', $event.target.value);
                emit('refresh');
              "
            >
              <option
                v-for="option in props.sortOrderOptions"
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
          <template v-if="props.sortBy === 'dob'">
            <select
              class="form-select d-inline w-auto ms-2"
              :value="props.sortOrder"
              @change="
                emit('update:sortOrder', $event.target.value);
                emit('refresh');
              "
            >
              <option
                v-for="option in props.sortOrderOptions"
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
    <tbody v-if="props.users.length > 0">
      <tr v-for="(user, index) in props.users" :key="user.id">
        <td>{{ (props.currentPage - 1) * props.usersPerPage + index + 1 }}</td>
        <td>{{ user.first_name }}</td>
        <td>{{ user.last_name }}</td>
        <td>{{ formatDate(user.dob) }}</td>
        <td>{{ user.mobile }}</td>
        <td>{{ user.address }}</td>

        <td>
          <div class="d-flex">
            <button class="btn submitBtn me-3" @click="goToEditForm(user.id)">Edit</button>
            <button class="btn btn-danger" @click="handleDelete(user.id)">Delete</button>
          </div>
        </td>
      </tr>

      <!-- pagination code -->
      <tr>
        <td colspan="7">
          <div class="d-flex justify-content-center align-items-center">
            <button
              class="btn btn-outline-primary me-2"
              :disabled="props.currentPage <= 1"
              @click="goToPrevPage"
            >
              Previous
            </button>

            <span v-for="page in paginationRange" :key="page" class="mx-1">
              <button
                class="btn"
                :class="page === props.currentPage ? 'btn-primary' : 'btn-outline-primary'"
                @click="goToPage(page)"
                :disabled="page === props.currentPage"
              >
                {{ page }}
              </button>
            </span>
            <button
              class="btn btn-outline-primary ms-2 me-5"
              :disabled="props.currentPage >= totalPages"
              @click="goToNextPage"
            >
              Next
            </button>
            <select
              class="form-select w-auto"
              name="page"
              id="page"
              :value="props.currentPage"
              @change="goToPage(Number($event.target.value))"
            >
              <option v-for="n in totalPages" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="7" class="text-center">No users found.</td>
      </tr>
    </tbody>
  </table>
</template>

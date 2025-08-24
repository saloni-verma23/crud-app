<script setup>
import { deleteUser } from '../api/userAPI';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
  users: {
    type: Array,
  },
  totalUsers: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  usersPerPage: {
    type: Number,
    default: 2,
  },
});

const emit = defineEmits(['refresh', 'update:currentPage']);
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
</script>

<template>
  <table class="my-5 table table-hover table-bordered">
    <thead class="table-header">
      <tr>
        <th>Sr.No.</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Date of Birth</th>
        <th>Mobile</th>
        <th>Address</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody v-if="props.users.length > 0">
      <tr v-for="(user, index) in props.users" :key="user.id">
        <td>{{ index + 1 }}</td>

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

            <span v-for="n in totalPages" :key="n" class="mx-1">
              <button
                class="btn"
                :class="n === props.currentPage ? 'btn-primary' : 'btn-outline-primary'"
                @click="goToPage(n)"
                :disabled="n === props.currentPage"
              >
                {{ n }}
              </button>
            </span>
            <button
              class="btn btn-outline-primary ms-2"
              :disabled="props.currentPage >= totalPages"
              @click="goToNextPage"
            >
              Next
            </button>
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

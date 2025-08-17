<script setup>
import { deleteUser } from '../api/userAPI';
import { useRouter } from 'vue-router';

defineProps({
  users: {
    type: Array,
  },
});
const emit = defineEmits(['refresh']);
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
    <tbody>
      <tr v-for="(user, index) in users" :key="user.id">
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
    </tbody>
  </table>
</template>

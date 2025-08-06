<script setup>
import { deleteUser, updateUser } from '../api/userAPI';
import { ref } from 'vue';

defineProps({
  users: {
    type: Array,
  },
});
const emit = defineEmits(['refresh']);

const editingId = ref(null);
const editingUser = ref({});

const startEdit = (user) => {
  editingId.value = user.id;
  editingUser.value = { ...user };
  if (editingUser.value.dob) {
    editingUser.value.dob = editingUser.value.dob.split('T')[0];
  }
};
function cancelEdit() {
  editingId.value = null;
  editingUser.value = {};
}
async function saveEdit() {
  try {
    await updateUser(editingId.value, editingUser.value);
    emit('refresh');
    cancelEdit();
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

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

        <td v-if="editingId === user.id">
          <input v-model="editingUser.first_name" type="text" class="form-control" />
        </td>
        <td v-else>{{ user.first_name }}</td>

        <td v-if="editingId === user.id">
          <input v-model="editingUser.last_name" type="text" class="form-control" />
        </td>
        <td v-else>{{ user.last_name }}</td>

        <td v-if="editingId === user.id">
          <input type="date" v-model="editingUser.dob" class="form-control" />
        </td>
        <td v-else>{{ formatDate(user.dob) }}</td>

        <td v-if="editingId === user.id">
          <input v-model="editingUser.mobile" type="phone" class="form-control" />
        </td>
        <td v-else>{{ user.mobile }}</td>

        <td v-if="editingId === user.id">
          <input v-model="editingUser.address" type="text" class="form-control" />
        </td>
        <td v-else>{{ user.address }}</td>

        <td>
          <div v-if="editingId === user.id" class="d-flex">
            <button class="btn submitBtn me-3" @click="saveEdit">Update</button>
            <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
          </div>
          <div v-else class="d-flex">
            <button class="btn submitBtn me-3" @click="startEdit(user)">Edit</button>
            <button class="btn btn-danger" @click="handleDelete(user.id)">Delete</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

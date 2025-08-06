<script setup lang="ts">
import { ref } from 'vue';
import { createUser } from '../api/userAPI';
import type { User } from '../api/userAPI';

const emit = defineEmits(['refresh', 'close']);

const userData = ref<User>({
  first_name: '',
  last_name: '',
  dob: '',
  mobile: '',
  address: '',
});

async function handleSubmit() {
  try {
    await createUser(userData.value);
    emit('refresh');
    emit('close');
    clearForm();
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

function clearForm() {
  userData.value = {
    first_name: '',
    last_name: '',
    dob: '',
    mobile: '',
    address: '',
  };
}

const closeForm = () => {
  emit('close');
};
</script>

<template>
  <div class="container my-5">
    <div class="card mx-5 shadow-lg userform">
      <div class="card-header text-white">
        <h3 class="mb-0">Create New User</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="handleSubmit" class="row g-3">
          <div class="col-md-6">
            <label class="form-label">First Name</label>
            <input
              v-model="userData.first_name"
              type="text"
              class="form-control"
              placeholder="Enter first name"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input
              v-model="userData.last_name"
              type="text"
              class="form-control"
              placeholder="Enter last name"
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Date of Birth</label>
            <input v-model="userData.dob" type="date" class="form-control" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Mobile</label>
            <input
              v-model="userData.mobile"
              type="tel"
              class="form-control"
              placeholder="Enter phone number"
            />
          </div>
          <div class="col-12">
            <label class="form-label">Address</label>
            <input
              v-model="userData.address"
              type="text"
              class="form-control"
              placeholder="Enter address"
            />
          </div>
          <div class="col-12 text-center mt-4">
            <button type="submit" class="btn me-2 submitBtn px-4">Submit</button>
            <button type="button" class="btn me-2 clearBtn px-4" @click="clearForm">Clear</button>
            <button type="button" class="btn closeBtn px-4" @click="closeForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.userform {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  font-size: 1.5rem;
  font-weight: 600;
  background-color: var(--secondary);
}

.form-label {
  font-weight: 500;
}

input.form-control {
  border-radius: 8px;
}

button {
  min-width: 100px;
}
button:hover,
button:focus {
  border: 2px solid var(--accent);
  background-color: white;
  color: var(--accent);
}
.submitBtn {
  background-color: var(--secondary);
  color: white;
}
.clearBtn {
  background-color: var(--primary);
  color: white;
}
.closeBtn {
  background-color: var(--dark);
  color: white;
}
</style>

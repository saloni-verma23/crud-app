<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { createUser, getUserById, updateUser } from '../api/userAPI';
import type { User } from '../api/userAPI';
import { useRouter, useRoute } from 'vue-router';

const userData = ref<User>({
  first_name: '',
  last_name: '',
  dob: '',
  mobile: '',
  address: '',
});

const emit = defineEmits(['refresh']);
const route = useRoute();
const router = useRouter();
const errors = ref<{ [key: string]: string }>({});

const isFormEditable = ref(false);

onMounted(async () => {
  if (route.params.id) {
    isFormEditable.value = true;
    const existingUser = await getUserById(Number(route.params.id));

    if (existingUser.dob) {
      const date = new Date(existingUser.dob);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      existingUser.dob = `${year}-${month}-${day}`;
    }

    userData.value = existingUser;
  }
});

const addValidations = () => {
  errors.value = {};

  if (!userData.value.first_name) {
    errors.value.first_name = 'First name is required';
  }

  if (!userData.value.last_name) {
    errors.value.last_name = 'Last name is required';
  }

  if (!userData.value.dob) {
    errors.value.dob = 'Date of Birth is required';
  }

  if (!userData.value.mobile) {
    errors.value.mobile = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(userData.value.mobile)) {
    errors.value.mobile = 'Invalid mobile number';
  }

  if (!userData.value.address) {
    errors.value.address = 'Address is required';
  }

  return Object.keys(errors.value).length === 0;
};

async function handleSubmit() {
  try {
    if (!addValidations()) return;
    if (isFormEditable.value) {
      const userId = Number(route.params.id);
      await updateUser(userId, userData.value);
      isFormEditable.value = false;
      goToHomepage();
      return;
    } else {
      await createUser(userData.value);
      goToHomepage();
    }
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
function goToHomepage() {
  router.push('/');
}
</script>

<template>
  <div class="container my-5">
    <div class="card mx-5 shadow-lg userform">
      <div class="card-header text-white">
        <h3 class="mb-0">{{ isFormEditable ? 'Update User' : 'Create New User' }}</h3>
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
            <span v-if="errors.first_name" class="text-danger">{{ errors.first_name }}</span>
          </div>
          <div class="col-md-6">
            <label class="form-label">Last Name</label>
            <input
              v-model="userData.last_name"
              type="text"
              class="form-control"
              placeholder="Enter last name"
            />
            <span v-if="errors.last_name" class="text-danger">{{ errors.last_name }}</span>
          </div>
          <div class="col-md-6">
            <label class="form-label">Date of Birth</label>
            <input v-model="userData.dob" type="date" class="form-control" />
            <span v-if="errors.dob" class="text-danger">{{ errors.dob }}</span>
          </div>
          <div class="col-md-6">
            <label class="form-label">Mobile</label>
            <input
              v-model="userData.mobile"
              type="tel"
              class="form-control"
              placeholder="Enter phone number"
            />
            <span v-if="errors.mobile" class="text-danger">{{ errors.mobile }}</span>
          </div>
          <div class="col-12">
            <label class="form-label">Address</label>
            <input
              v-model="userData.address"
              type="text"
              class="form-control"
              placeholder="Enter address"
            />
            <span v-if="errors.address" class="text-danger">{{ errors.address }}</span>
          </div>
          <div class="col-12 text-center mt-4">
            <button type="submit" class="btn me-2 submitBtn px-4">
              {{ isFormEditable ? 'Update' : 'Submit' }}
            </button>
            <button type="button" class="btn me-2 clearBtn px-4" @click="clearForm">Clear</button>
            <button type="button" class="btn closeBtn px-4" @click="goToHomepage">Cancel</button>
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

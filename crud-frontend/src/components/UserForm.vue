<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/userStore';
import type { User } from '../api/userAPI';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const userData = ref<Omit<User, 'id'>>({
  first_name: '',
  last_name: '',
  dob: '',
  mobile: '',
  address: '',
});

const errors = ref<{ [key: string]: string }>({});
const isSubmitting = ref(false);

const isFormEditable = computed(() => Boolean(route.params.id));
const userId = computed(() => (route.params.id ? Number(route.params.id) : null));
const formTitle = computed(() => (isFormEditable.value ? 'Update User' : 'Create New User'));
const submitButtonText = computed(() => (isFormEditable.value ? 'Update' : 'Submit'));

onMounted(async () => {
  if (userId.value) {
    try {
      const existingUser = await userStore.getUserData(userId.value);

      if (existingUser.dob) {
        const date = new Date(existingUser.dob);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        existingUser.dob = `${year}-${month}-${day}`;
      }

      userData.value = {
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        dob: existingUser.dob,
        mobile: existingUser.mobile,
        address: existingUser.address,
      };
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }
});

const validateForm = (): boolean => {
  errors.value = {};

  if (!userData.value.first_name?.trim()) {
    errors.value.first_name = 'First name is required';
  } else if (userData.value.first_name.trim().length < 2) {
    errors.value.first_name = 'First name must be at least 2 characters';
  }

  if (!userData.value.last_name?.trim()) {
    errors.value.last_name = 'Last name is required';
  } else if (userData.value.last_name.trim().length < 2) {
    errors.value.last_name = 'Last name must be at least 2 characters';
  }

  if (!userData.value.dob) {
    errors.value.dob = 'Date of Birth is required';
  } else {
    const selectedDate = new Date(userData.value.dob);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 150, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());

    if (selectedDate > maxDate) {
      errors.value.dob = 'User must be at least 13 years old';
    } else if (selectedDate < minDate) {
      errors.value.dob = 'Please enter a valid date of birth';
    }
  }

  if (!userData.value.mobile?.trim()) {
    errors.value.mobile = 'Mobile number is required';
  } else if (!/^[6-9]\d{9}$/.test(userData.value.mobile.trim())) {
    errors.value.mobile = 'Enter a valid 10-digit mobile number starting with 6-9';
  }

  if (!userData.value.address?.trim()) {
    errors.value.address = 'Address is required';
  } else if (userData.value.address.trim().length < 10) {
    errors.value.address = 'Address must be at least 10 characters';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const cleanedUserData = {
      first_name: userData.value.first_name.trim(),
      last_name: userData.value.last_name.trim(),
      dob: userData.value.dob,
      mobile: userData.value.mobile.trim(),
      address: userData.value.address.trim(),
    };

    if (isFormEditable.value && userId.value) {
      await userStore.updateUserData(userId.value, cleanedUserData);
    } else {
      await userStore.addUser(cleanedUserData);
    }

    goToHomepage();
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const clearForm = () => {
  userData.value = {
    first_name: '',
    last_name: '',
    dob: '',
    mobile: '',
    address: '',
  };
  errors.value = {};
};

const goToHomepage = () => {
  router.push('/');
};

const validateField = (field: keyof typeof userData.value) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
  if (userData.value[field]) {
    validateForm();
  }
};
</script>

<template>
  <div class="container my-5">
    <div class="card mx-5 shadow-lg userform">
      <div class="card-header text-white">
        <h3 class="mb-0">{{ formTitle }}</h3>
      </div>

      <div class="card-body">
        <div v-if="userStore.error" class="alert alert-danger alert-dismissible" role="alert">
          {{ userStore.error }}
          <button
            type="button"
            class="btn-close"
            @click="userStore.clearError()"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit" class="row g-3" novalidate>
          <div class="col-md-6">
            <label class="form-label" for="first_name">
              First Name <span class="text-danger">*</span>
            </label>
            <input
              id="first_name"
              v-model="userData.first_name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.first_name }"
              placeholder="Enter first name"
              @blur="validateField('first_name')"
              maxlength="50"
            />
            <div v-if="errors.first_name" class="invalid-feedback">
              {{ errors.first_name }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="last_name">
              Last Name <span class="text-danger">*</span>
            </label>
            <input
              id="last_name"
              v-model="userData.last_name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.last_name }"
              placeholder="Enter last name"
              @blur="validateField('last_name')"
              maxlength="50"
            />
            <div v-if="errors.last_name" class="invalid-feedback">
              {{ errors.last_name }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="dob">
              Date of Birth <span class="text-danger">*</span>
            </label>
            <input
              id="dob"
              v-model="userData.dob"
              type="date"
              class="form-control"
              :class="{ 'is-invalid': errors.dob }"
              @blur="validateField('dob')"
              :max="new Date().toISOString().split('T')[0]"
            />
            <div v-if="errors.dob" class="invalid-feedback">
              {{ errors.dob }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label" for="mobile">
              Mobile <span class="text-danger">*</span>
            </label>
            <input
              id="mobile"
              v-model="userData.mobile"
              type="tel"
              class="form-control"
              :class="{ 'is-invalid': errors.mobile }"
              placeholder="Enter 10-digit mobile number"
              @blur="validateField('mobile')"
              maxlength="10"
              pattern="[6-9][0-9]{9}"
            />
            <div v-if="errors.mobile" class="invalid-feedback">
              {{ errors.mobile }}
            </div>
          </div>

          <div class="col-12">
            <label class="form-label" for="address">
              Address <span class="text-danger">*</span>
            </label>
            <textarea
              id="address"
              v-model="userData.address"
              class="form-control"
              :class="{ 'is-invalid': errors.address }"
              placeholder="Enter complete address"
              rows="3"
              @blur="validateField('address')"
              maxlength="200"
            ></textarea>
            <div v-if="errors.address" class="invalid-feedback">
              {{ errors.address }}
            </div>
          </div>

          <div class="col-12 text-center mt-4">
            <button
              type="submit"
              class="btn me-2 submitBtn px-4"
              :disabled="isSubmitting || userStore.loading"
            >
              <span
                v-if="isSubmitting || userStore.loading"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{ submitButtonText }}
            </button>

            <button
              type="button"
              class="btn me-2 clearBtn px-4"
              @click="clearForm"
              :disabled="isSubmitting || userStore.loading"
            >
              Clear
            </button>

            <button
              type="button"
              class="btn closeBtn px-4"
              @click="goToHomepage"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
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
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  font-size: 1.5rem;
  font-weight: 600;
  background-color: var(--secondary);
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--primary-rgb), 0.25);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

button {
  min-width: 100px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled),
button:focus:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submitBtn {
  background-color: var(--secondary);
  color: white;
  border: none;
}

.submitBtn:hover:not(:disabled) {
  background-color: var(--primary);
}

.clearBtn {
  background-color: var(--primary);
  color: white;
  border: none;
}

.clearBtn:hover:not(:disabled) {
  background-color: var(--secondary);
}

.closeBtn {
  background-color: var(--dark);
  color: white;
  border: none;
}

.closeBtn:hover:not(:disabled) {
  background-color: #495057;
}

.text-danger {
  color: #dc3545 !important;
}

.alert {
  border-radius: 8px;
  margin-bottom: 1rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .userform {
    margin: 1rem;
  }

  .card-body {
    padding: 1rem;
  }

  .col-12.text-center.mt-4 button {
    margin-bottom: 0.5rem;
    width: 100%;
  }
}
</style>

import { createWebHistory, createRouter } from 'vue-router';

import FormView from './components/UserForm.vue';
import LoginView from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import Homepage from './components/Homepage.vue';

const routes = [
  { path: '/', name: 'Home', component: Homepage },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/user/save', name: 'SaveUser', component: FormView, meta: { requiresAuth: true } },
  { path: '/user/edit/:id', name: 'UserEdit', component: FormView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login' });
  } else {
    next();
  }
});

export default router;

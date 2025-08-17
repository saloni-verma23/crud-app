import { createWebHistory, createRouter } from 'vue-router';

import HomeView from './components/Homepage.vue';
import FormView from './components/UserForm.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/user/save', name: 'SaveUser', component: FormView },
  { path: '/user/edit/:id', name: 'UserEdit', component: FormView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router';
import './style.css';
import { createPinia } from 'pinia';

const store = createPinia();

createApp(App).use(store).use(router).mount('#app');

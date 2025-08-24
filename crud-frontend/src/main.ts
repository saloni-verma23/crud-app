import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import router from './router';
import './style.css';

createApp(App).use(router).mount('#app');

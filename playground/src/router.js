import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import FormView from './FormView.vue';

const routes = [
  { path: '/', component: App },
  { path: '/form', component: FormView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

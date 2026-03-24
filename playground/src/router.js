import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import FormView from './FormView.vue';
import MenuView from './MenuView.vue';
import PaletteView from './PaletteView.vue';

const routes = [
  { path: '/', component: App },
  { path: '/form', component: FormView },
  { path: '/menu', component: MenuView },
  { path: '/palette', component: PaletteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

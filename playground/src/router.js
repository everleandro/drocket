import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import CardView from './CardView.vue';
import FormView from './FormView.vue';
import MenuView from './MenuView.vue';
import PaletteView from './PaletteView.vue';
import ProgressView from './ProgressView.vue';
import RadioView from './RadioView.vue';

const routes = [
  { path: '/', component: App },
  { path: '/card', component: CardView },
  { path: '/form', component: FormView },
  { path: '/progress', component: ProgressView },
  { path: '/radio', component: RadioView },
  { path: '/menu', component: MenuView },
  { path: '/palette', component: PaletteView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

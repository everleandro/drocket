import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./views/HomeView.vue";
import ComponentsView from "./views/ComponentsView.vue";
import ThemingView from "./views/ThemingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/components", name: "components", component: ComponentsView },
    { path: "/theming", name: "theming", component: ThemingView },
  ],
});

export default router;

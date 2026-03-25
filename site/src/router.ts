import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import HomeView from "./views/HomeView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Getting Started",
      description:
        "Install Drocket, understand the layout primitives, and start composing application shells.",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

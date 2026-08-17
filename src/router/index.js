import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/simular-apostas-com-dados",
      name: "simular-apostas-com-dados",
      component: () => import("../views/SimularApostasComDados.vue"),
      meta: { fullscreen: true },
    },
  ],
});

export default router;

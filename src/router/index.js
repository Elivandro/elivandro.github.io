import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0 };
  },
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

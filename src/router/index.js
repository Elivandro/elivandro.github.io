import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SimularApostasComDados from "../views/SimularApostasComDados.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/simular-apostas-com-dados",
      name: "simular-apostas-com-dados",
      component: SimularApostasComDados,
      meta: { fullscreen: true },
    },
  ],
});

export default router;

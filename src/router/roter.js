import { createRouter, createWebHistory } from "vue-router";
import FormSearchEdit from "../components/FormSearchEdit.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "pagination",
      component: FormSearchEdit,
    },
  ],
});

export default router;

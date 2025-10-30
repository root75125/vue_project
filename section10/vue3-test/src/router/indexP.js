import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CheckBoxAllCheckP from "@/views/CheckBoxAllCheckP.vue";
import ChildrenP from "@/views/ChildrenP.vue";
import CompositionTestP from "@/views/CompositionTestP.vue";
import FunctionTestP from "@/views/FunctionTestP.vue";
import PropsEmitTestP from "@/views/PropsEmitTestP.vue";
import Test from "@/views/Test.vue";
import Test2 from "@/views/Test2.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/children-p",
    name: "children",
    component: ChildrenP,
  },
  {
    path: "/component-test-p",
    name: "ComponentTestP",
    component: CompositionTestP,
  },
  {
    path: "/function-test-p",
    name: "FunctionTestP",
    component: FunctionTestP,
  },
  {
    path: "/props-test-p",
    name: "PropsTestP",
    component: PropsEmitTestP,
  },
  {
    path: "/check-box-all-check-p",
    name: "CheckBoxAllCheck",
    component: CheckBoxAllCheckP,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  {
    path: "/test2",
    name: "Test2",
    component: Test2,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

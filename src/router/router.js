import Home from "@/pages/home";
import Search from "@/pages/Search";
import Register from "@/pages/Register";
import Login from "@/pages/login";
export default [
  {
    path: "/",
    component: Home,
  },
  {
    name: "search",
    path: "/search/:keyworld?",
    component: Search,
    props: (route) => ({
      keyworld1: route.params.keyworld,
      keywold2: route.query.name,
    }),
  },
  {
    path: "/register",
    component: Register,
    meta: {
      isHideFooter: true,
    },
  },
  {
    path: "/login",
    component: Login,
    meta: {
      isHideFooter: true,
    },
  },
];

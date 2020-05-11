import Vue from "vue";
import "swiper/css/swiper.min.css";
import App from "@/App";
import router from "./router";
import store from "./store";
import TypeNav from "./components/typeNav/index.vue";
import Carousel from "./components/Carousel/index.vue";
import Pagination from "@/components/Pagination";
Vue.config.productionTip = false;
import "./mock/mockServer";
//全部分类的全局组件
Vue.component("TypeNav", TypeNav);
Vue.component("Carousel", Carousel);
Vue.component("Pagination", Pagination);
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");

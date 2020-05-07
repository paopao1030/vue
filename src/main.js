import Vue from "vue";
import App from "@/App";
import router from "./router";
import store from "./store";
import TypeNav from "./components/typeNav/index.vue";
Vue.config.productionTip = false;
import './mock/mockServer'
//全部分类的全局组件
Vue.component("TypeNav", TypeNav);
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");

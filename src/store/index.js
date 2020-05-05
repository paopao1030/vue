import Vue from "vue";
import Vuex from "vuex";
import home from "./modules/home.js";
import user from "./modules/user.js";
Vue.use(Vuex);
const mutations = {
  test2() {
    // 总state
    console.log("我是store总文件的");
  },
};

const actions = {};

const getters = {};
export default new Vuex.Store({
  mutations,
  actions,
  getters,
  modules: {
    home,
    user,
  },
});

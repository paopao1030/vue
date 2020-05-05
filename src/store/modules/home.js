import { reqBaseCategoryList } from "../../api/index.js";
export default {
  state: {
    baseCategoryList: [],
    x: {},
    y: "",
  },
  mutations: {
    RECEIVE_BASE_CATEGORY_LIST(state, baseCategoryList) {
      state.baseCategoryList = baseCategoryList;
    },
  },
  actions: {
    async getNewList({ commit }) {
      const result = await reqBaseCategoryList();
      if (result.code === 200) {
        commit("RECEIVE_BASE_CATEGORY_LIST", result.data);
      }
    },
  },
  getters: {},
};

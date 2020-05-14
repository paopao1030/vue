import { getUserTempId, saveUserInfo, getUserInfo, deleteInfo } from "@/utils";
import { reqRegister, reqLogout } from "@/api";
export default {
  state: {
    userInfo: getUserInfo(),
    userTempId: getUserTempId(), // 用户临时ID, 获取函数只执行一次
  },
  mutations: {
    RECEIVE_USER_INFO(state, { userInfo }) {
      state.userInfo = userInfo;
    },
  },
  actions: {
    //请求注册
    async register(context, userInfo) {
      const result = await reqRegister(userInfo);
      if (result.code !== 200) {
        throw new Error(result.data || "注册失败");
      }
    },
    //请求登录
    async login({ commit }, { mobile, password }) {
      const result = await reqLogout(mobile, password);
      if (result.code === 200) {
        //登录成功
        const userInfo = result.data;
        // console.log(userInfo);
        //将数据存在state是不行的,刷新vuex是重置的
        commit("RECEIVE_USER_INFO", { userInfo });
        saveUserInfo(userInfo);
      } else {
        //登录失败
        throw new Error(result.message || "登录已失败!");
      }
    },
    //请求退出
    remove() {
      deleteInfo();
    },
  },
  getters: {},
};

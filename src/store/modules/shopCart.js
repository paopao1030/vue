//管理购物车相关的vuex
import { reqCartLit, reqCheckCartItem, reqAddToCart, removeItem } from "@/api";
export default {
  state: {
    cartList: [], //购物车的列表
  },
  mutations: {
    RECEIVE_CART_LIST(state, { cartList }) {
      state.cartList = cartList;
    },
  },
  actions: {
    //获取购物车列表
    async getCartList({ commit }) {
      const result = await reqCartLit();
      if (result.code === 200) {
        const cartList = result.data;
        commit("RECEIVE_CART_LIST", { cartList });
      }
    },
    //改变选中的状态
    async checkCartItem({}, { skuId, isChecked }) {
      // 异步请求
      const result = await reqCheckCartItem(skuId, isChecked);

      if (result.code !== 200) {
        // 操作失败
        throw new Error(result.message || "修改勾选状态操作成功");
      }
    },
    //全选或者全不选
    async checkAllCartItems({ state, dispatch }, checked) {
      const isChecked = checked ? 1 : 0;
      let promises = [];
      state.cartList.forEach((item) => {
        if (item.isChecked === isChecked) return;
        const promise = dispatch("checkCartItem", {
          skuId: item.skuId,
          isChecked,
        });
        promises.push(promise);
      });
      return Promise.all(promises);
    },
    //改变商品的数量和添加到购物车
    async addToCarta({ commit }, { skuId, skuNum }) {
      // 1. 发异步ajax请求
      const result = await reqAddToCart(skuId, skuNum);
      // 2. 成功后, 提交mutation保存数据
      if (result.code === 200) {
        return "";
      } else {
        return "商品添加失败";
      }
    },
    //删除商品
    async deleteCarItem({}, { skuId }) {
      const result = await removeItem(skuId);
      if (result.code !== 200) {
        console.log("删除之前的数据" + skuId);
        throw new Error(result.message || "删除商品成功");
      }
    },
    //删除所有选中的ischecked为1的item
    async deleteAllCarItem({ state, dispatch }) {
      let promises = [];
      state.cartList.forEach((item) => {
        if (item.isChecked === 1) {
          const promise = dispatch("deleteCarItem", { skuId: item.skuId });
          promises.push(promise);
        }
      });
      return Promise.all(promises);
    },
  },
  getters: {
    //计算选中了几个
    totalCount(state) {
      let num = 0;
      state.cartList.forEach((item) => {
        const { isChecked, skuNum } = item;
        // 只有在当前购物项选中才累加
        if (isChecked === 1) {
          num += skuNum;
        }
      });
      return num;
    },
    //计算选中的总价格
    totalPrice(state) {
      let num = 0;
      state.cartList.forEach((item) => {
        const { isChecked, skuNum, skuPrice } = item;
        if (isChecked === 1) {
          num += skuNum * skuPrice;
        }
      });
      return num;
    },
  },
};

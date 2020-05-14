/* 
用来管理detail数据详情的vuex模块
*/
import { reqDeatil } from "@/api";

export default {
  state: {
    detailInfo: {},
  },

  mutations: {
    /* 
    接收保存新的detail列表
    */
    RECEIVE_DETAIL_INFO(state, detailInfo) {
      state.detailInfo = detailInfo;
    },
  },

  actions: {
    /* 
    获取分类列表的异步action
    */
    async getDetailInfo({ commit }, skuId) {
      // 1. 发异步ajax请求
      const result = await reqDeatil(skuId);
      // 2. 成功后, 提交mutation保存数据
      if (result.code === 200) {
        const reqDeatilList = result.data;
        commit("RECEIVE_DETAIL_INFO", reqDeatilList);
      }
    },
    
  },
  getters: {
    categoryView(state) {
      const categoryView = state.detailInfo.categoryView; // 初始时是undefined, 后来就有值了
      return categoryView || {}; // 保存返回的是一个空对象或者带数据的对
    },

    /* 
    商品信息
    */
    skuInfo(state) {
      const skuInfo = state.detailInfo.skuInfo;
      return skuInfo || {};
    },
    //图片的列表信息
    skuImageList(state) {
      const skuInfo = state.detailInfo.skuInfo;
      return skuInfo ? skuInfo.skuImageList : [];
    },
    //获取选择选项的内容
    spuSaleAttrList(state) {
      const spuSaleAttrList = state.detailInfo.spuSaleAttrList;
      return spuSaleAttrList || [];
    },
  },
};

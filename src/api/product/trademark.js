//商品管理相关的请求
import request from "@/utils/request";
const api_name = "/admin/product/baseTrademark";

export default {
  //根据id获取品牌
  getById(id) {
    return request(`${api_name}/get/${id}`);
  },
  //获取所有列表
  getAllList(page, limit) {
    if (page && limit) {
      return request(`${api_name}/${page}/${limit}`);
    } else {
      return request(`${api_name}/getTrademarkList`);
    }
  },
  //根据id删除对应的品牌
  remove(id) {
    return request.delete(`/admin/product/baseTrademark/remove/${id}`);
  },
  //添加一个新的品牌
  add(trademark) {
    return request.post(`${api_name}/save`, trademark);
  },
  //更新品牌
  update(trademark) {
    return request.put(`${api_name}/update`, trademark);
  },
  //  获取品牌分页列表
  getPageList(page, limit) {
    return request(`/admin/product/baseTrademark/${page}/${limit}`);
  }
};

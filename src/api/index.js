import ajax from "./ajax";
import mockAjax from "./mockAjax";
export function reqBaseCategoryList() {
  return ajax({
    method: "GET",
    url: "/product/getBaseCategoryList",
  });
}
export function reqLogin(mobile, password) {
  return ajax({
    method: "POST",
    url: "/user/passport/login",
    data: { mobile, password },
  });
}
export const reqBanners = () => mockAjax("/banners");
export const reqFloors = () => mockAjax("/floors");
export const reqProductList = (searchParams) =>
  ajax({
    url: "/list",
    method: "POST",
    data: searchParams,
  });
//获取detail信息的请求
export const reqDeatil = (skuId) => ajax(`/item/${skuId}`);
//添加购物车的请求
export const reqAddToCart = (skuId, skuNum) =>
  ajax.post(`/cart/addToCart/${skuId}/${skuNum}`);
//获取购物车列表
export const reqCartLit = () => ajax("/cart/cartList");
//把选中的状态更改成选中或者没选中
export const reqCheckCartItem = (skuId, ischecked) =>
  ajax(`/cart/checkCart/${skuId}/${ischecked}`);
//删除商品
export const removeItem = (skuId) => ajax.delete(`/cart/deleteCart/${skuId}`);
//请求注册
export const reqRegister = (userInfo) =>
  ajax.post("/user/passport/register", userInfo);
//请求登录
export function reqLogout(mobile, password) {
  return ajax({
    method: "POST",
    url: "/user/passport/login",
    data: { mobile, password },
  });
}

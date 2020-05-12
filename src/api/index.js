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

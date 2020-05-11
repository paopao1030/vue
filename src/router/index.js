import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./router";
Vue.use(VueRouter);
const originPush = VueRouter.prototype.push;
const originReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function(location, onComplete, onAbort) {
  //如果传递了成功或者失败的回调
  if (onComplete || onAbort) {
    //调用原来的push方法
    originPush.call(this, location, onComplete, onAbort);
  } else {
    //如果没有传递,则自己指定一个catch
    return originPush.call(this, location).catch(() => {
      return new Promise(() => {});
      //空串的undefied也是成功,只有空promise中断promise链
    });
  }
};
VueRouter.prototype.replace = function(location, onComplete, onAbort) {
  if (onComplete || onAbort) {
    originReplace.call(this, location, onComplete, onAbort);
  } else {
    return originReplace.call(this, location).catch(() => {});
  }
};
export default new VueRouter({
  mode: "history",
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }; // 在跳转路由时, 滚动条自动滚动到x轴和y轴的起始位置,就是最上面
  },
});

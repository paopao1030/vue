import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import store from "@/store";
const newAxios = axios.create({
  baseURL: "/api",
  timeout: 15000,
});
newAxios.interceptors.request.use((config) => {
  nprogress.start();
  //把uuid发送给服务器
  config.headers["userTempId"] = store.state.user.userTempId;
  return config;
});
newAxios.interceptors.response.use((res) => {
  console.log("响应拦截器成功回调执行");
  nprogress.done();
  return res.data;
});
export default newAxios;

import axios from "axios";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
const newAxios = axios.create({
  baseURL: "/api",
  timeout: 15000,
});
newAxios.interceptors.request.use((config) => {
  nprogress.start();
  return config;
});
newAxios.interceptors.response.use((res) => {
  console.log("响应拦截器成功回调执行");
  nprogress.done();
  return res.data;
});
export default newAxios;

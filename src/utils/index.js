import { v4 as uuidv4 } from "uuid";

/* 
得到当前的用户临时ID
1. 从localStorage中获取
2. 通过UUID库来生成
*/
export function getUserTempId() {
  // 从localStorage读取保存的用户临时ID, 如果有, 直接返回
  let userTempId = localStorage.getItem("USER_TEMP_ID_KEY");
  // 如果没有, 通过UUID生成一个新的, 保存到localStorage, 并返回
  if (!userTempId) {
    userTempId = uuidv4();
    localStorage.setItem("USER_TEMP_ID_KEY", userTempId);
  }
  // 返回
  return userTempId;
}
//将登录用户信息保存到local里
export function saveUserInfo(userinfo) {
  localStorage.setItem("USER_INFO_KEY", JSON.stringify(userinfo));
}
//读取local里的用户数据
export function getUserInfo() {
  return JSON.parse(localStorage.getItem('USER_INFO_KEY'))||{}
}
//删除local里的用户数据
export function deleteInfo(){
  localStorage.removeItem('USER_INFO_KEY')
}

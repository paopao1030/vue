//使用mockjs来模拟数据
import Mock from "mockjs";
import bannner from "./banners.json";
import floors from "./floors.json";
//轮播图数据的接口
Mock.mock("/mock/banners", { code: 200, data: bannner });
//楼层数据的接口
Mock.mock("/mock/floors", { code: 200, data: floors });
console.log('mock数据已加载')
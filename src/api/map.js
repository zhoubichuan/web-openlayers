import request from "@/util/request";
// 获取中国地图数据
export function getMap1() {
  return request({
    url: "mock/map1.json",
    method: "get",
  });
}

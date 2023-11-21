import request from "@/util/request";
export function getTurf() {
  return request({
    url: "data/geojson/roads-seoul.geojson",
    method: "get",
  });
}
export function getBar2() {
  return request({
    url: "mock/bar2.json",
    method: "get",
  });
}

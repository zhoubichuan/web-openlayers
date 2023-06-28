import request from '@/util/request'
// 获取中国地图数据
export function getBar1 () {
  return request({
    url: 'mock/bar1.json',
    method: 'get',
  })
}
// 获取中国地图数据
export function getBar2 () {
    return request({
      url: 'mock/bar2.json',
      method: 'get',
    })
  }
  
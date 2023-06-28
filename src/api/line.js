import request from '@/util/request'
// 获取中国地图数据
export function getLine1 () {
  return request({
    url: 'mock/line1.json',
    method: 'get',
  })
}
// 获取中国地图数据
export function getLine2 () {
    return request({
      url: 'mock/line2.json',
      method: 'get',
    })
  }
  
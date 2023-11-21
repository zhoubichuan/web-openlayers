import request from '@/util/request'
// 获取中国地图数据
export function getPie1 () {
  return request({
    url: 'mock/pie1.json',
    method: 'get',
  })
}

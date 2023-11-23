<template>
  <div class="map-example">
    <div ref="map" class="map"></div>
    <div ref="map1" class="map"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM, XYZ },
    } = ol
    const map = new Map({
      view: new View({
        center: [12579156, 3274244], // 坐标
        zoom: 12, // 放大倍数
      }),
      layers: [
        new TileLayer({
          // 创建一个使用Open Street Map地图源的瓦片图层
          name: "矢量图层",
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
    })
    new Map({
      view: map.getView(),
      layers: [
        new TileLayer({
          name: "卫星图",
          source: new XYZ({
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
            crossOrigin: "anonymous", //跨域
          }),
        }),
      ],
      target: this.$refs.map1,
    })
  },
}
</script>
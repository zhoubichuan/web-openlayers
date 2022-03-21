<template>
  <div class="map-example">
    <div ref="map" class="map"> </div>
    <div ref="map1" class="map"> </div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map"; 
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
export default {
  name: "navigation",
  mounted() {
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
    });
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
    });
  },
};
</script>

<style lang="stylus" scoped>
.map-example {
  width: 100%;
  height: 80vh;
  position: relative;
  display: flex;
  .map {
    width: 100%;
    height: 100%;
    border: 1px solid #000;
  }
}
</style>


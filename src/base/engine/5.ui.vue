<template>
  <div class="map-example">
    <div ref="map" class="map">
      <div>
        <label v-for="(item,i) of layers" :key="i">
          <input type="checkbox" v-model="checkedList[i]" :value="item.getVisible()" @change="item.setVisible(checkedList[i])" >
          {{item.get('name')}}
        </label>
      </div>
    </div>
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
  data() {
    return {
      layers: [
        new TileLayer({
          // 创建一个使用Open Street Map地图源的瓦片图层
          name: "矢量图层",
          source: new OSM(),
        }),
        new TileLayer({
          name: "卫星图",
          source: new XYZ({
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
            crossOrigin: "anonymous", //跨域
          }),
        }),
        new TileLayer({
          name: "影像路图",
          source: new XYZ({
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=8`,
            crossOrigin: "anonymous", //跨域
          }),
        }),
      ],
      checkedList: [true,true,true],
    }
  },
  mounted() {
    new Map({
      view: new View({
        center: [12579156, 3274244], // 坐标
        zoom: 12, // 放大倍数
      }),
      layers: this.layers,
      target: this.$refs.map,
    });
  },
};
</script>

<style lang="stylus" scoped>
.map-example {
  width: 100%;
  height: 80vh;
  position relative
  .map {
    width: 100%;
    height: 100%;
    border: 1px solid $accentColor;
    >div{
      position absolute
      top 0
      right 0
      background-color rgba(0,0,0,.4)
      z-index 10
      label{
        color: white
        display block
      }
    }
  }
}
</style>


<template>
    <div ref="map" class="map">
      <label>
        <input
          ref="input1"
          checked
          type="checkbox"
          @input="() => handleClick(1)"
        />
        瓦片图层
      </label>
      <label>
        <input
          ref="input2"
          checked
          type="checkbox"
          @input="() => handleClick(2)"
        />
        卫星图
      </label>
      <label>
        <input
          ref="input3"
          checked
          type="checkbox"
          @input="() => handleClick(3)"
        />
        影像路图
      </label>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        layers: "",
      };
    },
    mounted() {
      let {
        Map,
        View,
        layer: { Tile: TileLayer },
        source: { OSM, XYZ },
      } = ol;
      let layers = [
        new TileLayer({
          name: "瓦片图层", // 创建一个使用Open Street Map地图源的瓦片图层
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
      ];
      this.layers = layers;
      new Map({
        view: new View({
          center: [12579156, 3274244], // 坐标
          zoom: 12, // 放大倍数
        }),
        layers,
        target: this.$refs.map,
      });
    },
    methods: {
      handleClick(i) {
        this.layers[i - 1].setVisible(this.$refs["input" + i].checked);
      },
    },
  };
  </script>
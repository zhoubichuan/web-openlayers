<template>
  <div class="map">
    <div ref="map1" class="map1 map"></div>
    <div ref="map2" class="map2 map"></div>
    <button ref="teleport">传送</button>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ },
    } = ol;
    const map = new Map({
      layers: [
        new TileLayer({
          name: "卫星图",
          source: new XYZ({
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
            crossOrigin: "anonymous", //跨域
          }),
        }),
      ],
      view: new View({
        center: [12579156, 3274244], // 坐标
        zoom: 12, // 放大倍数
      }),
      target: this.$refs.map1,
    });
    this.$refs.teleport.addEventListener(
      "click",
      function () {
        const target = map.getTarget().className.includes('map1') ? this.$refs.map2 : this.$refs.map1;
        map.setTarget(target);
      },
      false
    );
  },
};
</script>
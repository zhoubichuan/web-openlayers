<template>
  <div ref="map" class="map"></div>
</template>
<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { OSM },
    } = ol
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
          className: "layer-style", // 要设置为图层元素的 CSS 类名
          opacity: 0.5, // 设置地图的不透明度
          zIndex: 0, // 地图层级
        }),
      ],
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
    })
  },
}
</script>
<style>
.layer-style {
  width: 50% !important;
}
</style>
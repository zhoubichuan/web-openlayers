<template>
  <div>
    <div ref="map" class="map"></div>
    <button ref="setsource">添加图层服务</button>
    <button ref="unsetsource">删除图层服务</button>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
    } = ol;
    const source = new OSM();
    const layer = new TileLayer();
    const map = new Map({
      layers: [layer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    this.$refs.setsource.onclick = function () {
      layer.setSource(source);
    };
    this.$refs.unsetsource.onclick = function () {
      layer.setSource(null);
    };
  },
};
</script>
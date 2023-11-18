<template>
  <div>
    <div ref="map" class="map"></div>
    <button ref="zoom-out">缩小地图</button>
    <button ref="zoom-in">放大地图</button>
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
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 10,
      }),
    });
    this.$refs["zoom-out"].onclick = function () {
      const view = map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom - 1);
    };
    this.$refs["zoom-in"].onclick = function () {
      const view = map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom + 1);
    };
  },
};
</script>
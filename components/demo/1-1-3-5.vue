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
    } = ol;
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        maxResolution: 20000,
        minResolution: 2000,
        maxZoom: 14,
        minZoom: 10,
        center: [12579156, 3274244],
        zoom: 12,
      }),
    });
  },
};
</script>
<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { Tile: TileLayer },
        source: { OSM, TileDebug },
      } = ol;
      new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source: new TileDebug(),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: [12579156, 3274244],
          zoom: 1,
        }),
      });
    },
  };
  </script>
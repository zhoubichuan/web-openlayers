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
        source: { Stamen },
        proj: { fromLonLat },
      } = ol;
      const map = new Map({
        layers: [
          new TileLayer({
            source: new Stamen({
              layer: "watercolor",
            }),
          }),
          new TileLayer({
            source: new Stamen({
              layer: "terrain-labels",
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: fromLonLat([114.31, 30.52]),
          zoom: 12,
        }),
      });
    },
  };
  </script>
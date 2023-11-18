<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { MapboxVector },
      } = ol;
      const map = new Map({
        target: this.$refs.map,
        layers: [
          new MapboxVector({
            styleUrl: "mapbox://styles/mapbox/bright-v9",
            accessToken: mapkeys.mapbox,
          }),
        ],
        view: new View({
          center: [12579156, 3274244],
          zoom: 2,
        }),
      });
    },
  };
  </script>
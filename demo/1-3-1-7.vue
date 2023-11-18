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
        source: { TileJSON },
      } = ol;
      const map = new Map({
        layers: [
          new TileLayer({
            source: new TileJSON({
              url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
              crossOrigin: "anonymous",
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: [12579156, 3274244],
          zoom: 2,
        }),
      });
    },
  };
  </script>
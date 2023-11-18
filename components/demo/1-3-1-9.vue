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
        source: { TileJSON, OSM },
        proj: { fromLonLat },
      } = ol;
      const map = new Map({
        layers: [
          new TileLayer({
            className: "bw",
            source: new OSM(),
          }),
          new TileLayer({
            source: new TileJSON({
              url:
                "https://api.tiles.mapbox.com/v4/mapbox.va-quake-aug.json?secure&access_token=" +
                mapkeys.mapbox,
              crossOrigin: "anonymous",
              transition: 0,
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: fromLonLat([-77.93255, 37.9555]),
          zoom: 7,
        }),
      });
    },
  };
  </script>
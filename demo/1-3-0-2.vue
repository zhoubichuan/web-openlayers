<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { Tile: TileLayer, Graticule },
        source: { OSM },
        style: { Stroke },
        proj: { fromLonLat },
      } = ol;
  
      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM({
              wrapX: false,
            }),
          }),
          new Graticule({
            strokeStyle: new Stroke({
              color: "rgba(255,120,0,0.9)",
              width: 2,
              lineDash: [0.5, 4],
            }),
            showLabels: true,
            wrapX: false,
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: fromLonLat([4.8, 47.75]),
          zoom: 5,
        }),
      });
    },
  };
  </script>
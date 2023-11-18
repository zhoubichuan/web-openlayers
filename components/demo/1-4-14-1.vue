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
        source: { OGCMapTile },
      } = ol;
      const map = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new OGCMapTile({
              url: "https://maps.ecere.com/ogcapi/collections/blueMarble/map/tiles/WorldCRS84Quad",
            }),
          }),
        ],
        view: new View({
          projection: "EPSG:4326",
          center: [12579156, 3274244],
          zoom: 1,
        }),
      });
    },
  };
  </script>
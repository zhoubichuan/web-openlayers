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
        proj: { transformExtent },
      } = ol
      function transform(extent) {
        return transformExtent(extent, "EPSG:4326", "EPSG:3857")
      }
      const extents = {
        India: transform([68.17665, 7.96553, 97.40256, 35.49401]),
      }
      new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new OSM(),
            extent: extents.India,
          }),
        ],
        view: new View({
          center: [12579156, 3274244],
          zoom: 4,
        }),
      })
    },
  }
  </script>
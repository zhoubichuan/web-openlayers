<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { Tile: TileLayer, Image: ImageLayer },
        source: { OSM, ImageArcGISRest },
      } = ol
      const url =
        "https://sampleserver1.arcgisonline.com/ArcGIS/rest/services/" +
        "Specialty/ESRI_StateCityHighway_USA/MapServer"
      const layers = [
        new TileLayer({
          source: new OSM(),
        }),
        new ImageLayer({
          source: new ImageArcGISRest({
            ratio: 1,
            params: {},
            url: url,
          }),
        }),
      ]
      const map = new Map({
        layers: layers,
        target: this.$refs.map,
        view: new View({
          center: [-10997148, 4569099],
          zoom: 4,
        }),
      })
    },
  }
  </script>
<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { Image: ImageLayer },
        source: { ImageMapGuide },
      } = ol
  
      const mdf = "Library://Samples/Sheboygan/Maps/Sheboygan.MapDefinition"
      const agentUrl = "https://mikenunn.net/mapguide/mapagent/mapagent.fcgi?"
      const bounds = [
        -87.865114442365922, 43.665065564837931, -87.595394059497067,
        43.823852564430069,
      ]
      const map = new Map({
        layers: [
          new ImageLayer({
            extent: bounds,
            source: new ImageMapGuide({
              projection: "EPSG:4326",
              url: agentUrl,
              useOverlay: false,
              metersPerUnit: 111319.4908,
              params: {
                MAPDEFINITION: mdf,
                FORMAT: "PNG",
                VERSION: "3.0.0",
                USERNAME: "OLGuest",
                PASSWORD: "olguest",
              },
              ratio: 2,
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: [-87.7302542509315, 43.744459064634],
          projection: "EPSG:4326",
          zoom: 12,
        }),
      })
    },
  }
  </script>
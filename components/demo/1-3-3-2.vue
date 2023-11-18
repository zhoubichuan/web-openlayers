<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { VectorTile: VectorTileLayer },
        source: { OGCVectorTile },
        format: { MVT },
      } = ol
      const map = new Map({
        target: this.$refs.map,
        layers: [
          new VectorTileLayer({
            source: new OGCVectorTile({
              url: "https://maps.ecere.com/ogcapi/collections/NaturalEarth:cultural:ne_10m_admin_0_countries/tiles/WebMercatorQuad",
              format: new MVT(),
            }),
          }),
        ],
        view: new View({
          center: [12579156, 3274244],
          zoom: 1,
        }),
      })
    },
  }
  </script>
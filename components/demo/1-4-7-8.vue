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
      source: { XYZ },
    } = ol
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: "Copyright:© 2013 ESRI, i-cubed, GeoEye",
            url:
              "https://services.arcgisonline.com/arcgis/rest/services/" +
              "ESRI_Imagery_World_2D/MapServer/tile/{z}/{y}/{x}",
            maxZoom: 15,
            projection: "EPSG:4326",
            tileSize: 512,
            maxResolution: 180 / 512,
            wrapX: true,
          }),
        }),
      ],
      view: new View({
        center: [12579156, 3274244],
        projection: "EPSG:4326",
        zoom: 2,
        minZoom: 2,
      }),
    })
  },
}
</script>
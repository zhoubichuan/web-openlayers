<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { WKT },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
    } = ol
    const raster = new TileLayer({
      source: new OSM(),
    })
    const wkt =
      "POLYGON((10.689 -25.092, 34.595 " +
      "-20.170, 38.814 -35.639, 13.502 " +
      "-39.155, 10.689 -25.092))"
    const format = new WKT()
    const feature = format.readFeature(wkt, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    })
    const vector = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
    })
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [2952104.0199, -3277504.823],
        zoom: 4,
      }),
    })
  },
}
</script>
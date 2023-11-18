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
      source: { OSM, TileArcGISRest },
    } = ol
    const url =
      "https://sampleserver.arcgisonline.com/ArcGIS/rest/services/" +
      "Specialty/ESRI_StateCityHighway_USA/MapServer"

    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      new TileLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new TileArcGISRest({
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
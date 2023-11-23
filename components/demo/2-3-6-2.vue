<template>
  <div ref="map" class="map">
    <pre id="info" />
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { MVT },
      Map,
      View,
      layer: { Vector: VectorLayer, VectorTile: VectorTileLayer },
      source: { Vector: VectorSource, VectorTile: VectorTileSource },
    } = ol
    const map = new Map({
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            format: new MVT(),
            url: "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/{z}/{y}/{x}.pbf",
          }),
        }),
      ],
    })

    map.on("pointermove", showInfo)

    const info = document.getElementById("info")
    function showInfo(event) {
      const features = map.getFeaturesAtPixel(event.pixel)
      if (features.length == 0) {
        info.innerText = ""
        info.style.opacity = 0
        return
      }
      const properties = features[0].getProperties()
      info.innerText = JSON.stringify(properties, null, 2)
      info.style.opacity = 1
    }
  },
}
</script>
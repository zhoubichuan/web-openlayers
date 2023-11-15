<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { KML },
      Map,
      View,
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      has: { DEVICE_PIXEL_RATIO },
      style: { Fill, Stroke, Style },
      proj: { fromLonLat },
    } = ol
    const pixelRatio = DEVICE_PIXEL_RATIO
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")
    const gradient = context.createLinearGradient(0, 0, 1024 * pixelRatio, 0)
    gradient.addColorStop(0, "red")
    gradient.addColorStop(1 / 6, "orange")
    gradient.addColorStop(2 / 6, "yellow")
    gradient.addColorStop(3 / 6, "green")
    gradient.addColorStop(4 / 6, "aqua")
    gradient.addColorStop(5 / 6, "blue")
    gradient.addColorStop(1, "purple")
    const vectorLayer = new VectorLayer({
      background: "white",
      source: new VectorSource({
        url: this.$withBase("/data/kml/states.kml"),
        format: new KML({ extractStyles: false }),
      }),
      style: new Style({
        fill: new Fill({ color: gradient }),
        stroke: new Stroke({
          color: "#333",
          width: 1,
        }),
      }),
    })
    const map = new Map({
      layers: [vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-100, 38.5]),
        zoom: 4,
      }),
    })
  },
}
</script>
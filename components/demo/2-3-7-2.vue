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
      source: { OSM },
    } = ol
    const viewport = this.$refs.map
    function getMinZoom() {
      const width = viewport.clientWidth
      return Math.ceil(Math.LOG2E * Math.log(width / 256))
    }
    const initialZoom = getMinZoom()
    const view = new View({
      center: [12579156, 3274244],
      minZoom: initialZoom,
      zoom: initialZoom,
    })
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: view,
    })
    window.addEventListener("resize", function () {
      const minZoom = getMinZoom()
      if (minZoom !== view.getMinZoom()) {
        view.setMinZoom(minZoom)
      }
    })
  },
}
</script>
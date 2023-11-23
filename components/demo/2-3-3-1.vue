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
      worker: {
        version: { create: createVersionWorker },
      },
    } = ol

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })

    const worker = createVersionWorker()
    worker.addEventListener("error", function (error) {
      console.error("worker error", error)
    })

    worker.addEventListener("message", function (event) {
      console.log("message from worker:", event.data)
    })

    map.on("moveend", function (event) {
      const state = event.frameState.viewState
      worker.postMessage({ zoom: state.zoom, center: state.center })
    })
  },
}
</script>
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
    let zoom = 2
    let center = [0, 0]
    let rotation = 0

    if (window.location.hash !== "") {
      const hash = window.location.hash.replace("#map=", "")
      const parts = hash.split("/")
      if (parts.length === 4) {
        zoom = parseFloat(parts[0])
        center = [parseFloat(parts[1]), parseFloat(parts[2])]
        rotation = parseFloat(parts[3])
      }
    }
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: center,
        zoom: zoom,
        rotation: rotation,
      }),
    })
    let shouldUpdate = true
    const view = map.getView()
    const updatePermalink = function () {
      if (!shouldUpdate) {
        shouldUpdate = true
        return
      }
      const center = view.getCenter()
      const hash =
        "#map=" +
        view.getZoom().toFixed(2) +
        "/" +
        center[0].toFixed(2) +
        "/" +
        center[1].toFixed(2) +
        "/" +
        view.getRotation()
      const state = {
        zoom: view.getZoom(),
        center: view.getCenter(),
        rotation: view.getRotation(),
      }
      window.history.pushState(state, "map", hash)
    }
    map.on("moveend", updatePermalink)
    window.addEventListener("popstate", function (event) {
      if (event.state === null) {
        return
      }
      map.getView().setCenter(event.state.center)
      map.getView().setZoom(event.state.zoom)
      map.getView().setRotation(event.state.rotation)
      shouldUpdate = false
    })
  },
}
</script>
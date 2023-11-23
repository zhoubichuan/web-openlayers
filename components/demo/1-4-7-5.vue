<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Heatmap: HeatmapLayer, Layer },
      source: { Source, Vector: VectorSource },
      proj: { fromLonLat, toLonLat },
    } = ol
    const center = [-98.8, 37.9]
    const mbMap = new mapboxgl.Map({
      style:
        "https://api.maptiler.com/maps/bright/style.json?key=" +
        mapkeys.maptiler,
      attributionControl: false,
      boxZoom: false,
      center: center,
      container: "map",
      doubleClickZoom: false,
      dragPan: false,
      dragRotate: false,
      interactive: false,
      keyboard: false,
      pitchWithRotate: false,
      scrollZoom: false,
      touchZoomRotate: false,
    })
    const mbLayer = new Layer({
      render: function (frameState) {
        const canvas = mbMap.getCanvas()
        const viewState = frameState.viewState
        const visible = mbLayer.getVisible()
        canvas.style.display = visible ? "block" : "none"
        canvas.style.position = "absolute"
        const opacity = mbLayer.getOpacity()
        canvas.style.opacity = opacity
        const rotation = viewState.rotation
        mbMap.jumpTo({
          center: toLonLat(viewState.center),
          zoom: viewState.zoom - 1,
          bearing: (-rotation * 180) / Math.PI,
          animate: false,
        })
        if (mbMap._frame) {
          mbMap._frame.cancel()
          mbMap._frame = null
        }
        mbMap._render()
        return canvas
      },
      source: new Source({
        attributions: [
          '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
        ],
      }),
    })
    const cities = new HeatmapLayer({
      source: new VectorSource({
        url: this.$withBase("/data/geojson/world-cities.geojson"),
        format: new GeoJSON(),
      }),
      weight: function (feature) {
        return feature.get("population") / 1e7
      },
      radius: 15,
      blur: 15,
    })
    const map = new Map({
      target: this.$refs.map,
      view: new View({
        center: fromLonLat(center),
        zoom: 4,
      }),
      layers: [mbLayer, cities],
    })
  },
}
</script>
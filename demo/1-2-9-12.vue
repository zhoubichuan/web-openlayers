<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      Map,
      geom: { Point },
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { Stamen, Vector: VectorSource },
      style: { Icon, Style },
    } = ol
    const iconFeature = new Feature({
      geometry: new Point([0, 0]),
    })
    const vectorSource = new VectorSource({
      features: [iconFeature],
    })
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    })
    const rasterLayer = new TileLayer({
      source: new Stamen({
        layer: "toner",
      }),
    })
    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })
    const gifUrl = this.$withBase("/data/globe.gif")
    const gif = gifler(gifUrl)
    gif.frames(
      document.createElement("canvas"),
      function (ctx, frame) {
        if (!iconFeature.getStyle()) {
          iconFeature.setStyle(
            new Style({
              image: new Icon({
                img: ctx.canvas,
                imgSize: [frame.width, frame.height],
                opacity: 0.8,
              }),
            })
          )
        }
        ctx.clearRect(0, 0, frame.width, frame.height)
        ctx.drawImage(frame.buffer, frame.x, frame.y)
        map.render()
      },
      true
    )
    map.on("pointermove", function (e) {
      const pixel = map.getEventPixel(e.originalEvent)
      const hit = map.hasFeatureAtPixel(pixel)
      map.getTarget().style.cursor = hit ? "pointer" : ""
    })
  },
}
</script>
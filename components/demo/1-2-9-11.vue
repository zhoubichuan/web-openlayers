<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { Stamen },
      style: { Circle, Fill, Style },
      proj: { useGeographic },
      render: { getVectorContext },
      easing: { upAndDown },
    } = ol
    useGeographic()
    const layer = new TileLayer({
      source: new Stamen({
        layer: "toner",
      }),
    })
    const map = new Map({
      layers: [layer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })
    const image = new Circle({
      radius: 8,
      fill: new Fill({ color: "rgb(255, 153, 0)" }),
    })
    const style = new Style({
      image: image,
    })
    const n = 1000
    const geometries = new Array(n)
    for (let i = 0; i < n; ++i) {
      const lon = 360 * Math.random() - 180
      const lat = 180 * Math.random() - 90
      geometries[i] = new Point([lon, lat])
    }
    layer.on("postrender", function (event) {
      const vectorContext = getVectorContext(event)
      for (let i = 0; i < n; ++i) {
        const importance = upAndDown(Math.pow((n - i) / n, 0.15))
        if (importance < 0.1) {
          continue
        }
        image.setOpacity(importance)
        image.setScale(importance)
        vectorContext.setStyle(style)
        vectorContext.drawGeometry(geometries[i])
      }
      const lon = 360 * Math.random() - 180
      const lat = 180 * Math.random() - 90
      geometries.push(new Point([lon, lat]))
      geometries.shift()
      map.render()
    })
  },
}
</script>
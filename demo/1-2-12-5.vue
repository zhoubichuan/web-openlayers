<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Feature,
        geom: { LineString },
        Map,
        View,
        layer: { Vector: VectorLayer },
        source: { Vector: VectorSource },
        style: { Stroke, Style },
      } = ol
      const count = 10000
      const features = new Array(count)
  
      let startPoint = [0, 0]
      let endPoint
  
      let delta, deltaX, deltaY
      let signX = 1
      let signY = -1
  
      let i
      for (i = 0; i < count; ++i) {
        delta = (i + 1) * 2500
        if (i % 2 === 0) {
          signY *= -1
        } else {
          signX *= -1
        }
        deltaX = delta * signX
        deltaY = delta * signY
        endPoint = [startPoint[0] + deltaX, startPoint[1] + deltaY]
        features[i] = new Feature({
          geometry: new LineString([startPoint, endPoint]),
        })
        startPoint = endPoint
      }
  
      const vector = new VectorLayer({
        source: new VectorSource({
          features: features,
          wrapX: false,
        }),
        style: new Style({
          stroke: new Stroke({
            color: "#666666",
            width: 1,
          }),
        }),
      })
  
      const view = new View({
        center: [12579156, 3274244],
        zoom: 0,
      })
  
      const map = new Map({
        layers: [vector],
        target: this.$refs.map,
        view: view,
      })
    },
  }
  </script>
<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { WebGLTile: TileLayer },
        source: { DataTile },
      } = ol
      const size = 256
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext("2d")
      context.strokeStyle = "white"
      context.textAlign = "center"
      context.font = "24px sans-serif"
      const lineHeight = 30
      const map = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new DataTile({
              loader: function (z, x, y) {
                const half = size / 2
                context.clearRect(0, 0, size, size)
                context.fillStyle = "rgba(100, 100, 100, 0.5)"
                context.fillRect(0, 0, size, size)
                context.fillStyle = "black"
                context.fillText(`z: ${z}`, half, half - lineHeight)
                context.fillText(`x: ${x}`, half, half)
                context.fillText(`y: ${y}`, half, half + lineHeight)
                context.strokeRect(0, 0, size, size)
                const data = context.getImageData(0, 0, size, size).data
                return new Uint8Array(data.buffer)
              },
              transition: 0,
            }),
          }),
        ],
        view: new View({
          center: [12579156, 3274244],
          zoom: 0,
        }),
      })
    },
  }
  </script>
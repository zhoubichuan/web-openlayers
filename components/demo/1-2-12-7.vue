<template>
    <div ref="map" class="map" id="canvas"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        geom: { LineString, Point, Polygon },
        style: { Circle: CircleStyle, Fill, Stroke, Style },
        render: { toContext },
      } = ol
  
      const canvas = document.getElementById("canvas")
      const vectorContext = toContext(canvas.getContext("2d"), {
        size: [100, 100],
      })
  
      const fill = new Fill({ color: "blue" })
      const stroke = new Stroke({ color: "black" })
      const style = new Style({
        fill: fill,
        stroke: stroke,
        image: new CircleStyle({
          radius: 10,
          fill: fill,
          stroke: stroke,
        }),
      })
      vectorContext.setStyle(style)
  
      vectorContext.drawGeometry(
        new LineString([
          [10, 10],
          [90, 90],
        ])
      )
      vectorContext.drawGeometry(
        new Polygon([
          [
            [2, 2],
            [98, 2],
            [2, 98],
            [2, 2],
          ],
        ])
      )
      vectorContext.drawGeometry(new Point([88, 88]))
    },
  }
  </script>
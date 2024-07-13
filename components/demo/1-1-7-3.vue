<template>
  <div style="position:relative">
    <div ref="map" class="map"></div>
    <div ref="position"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { XYZ },
      control: { MousePosition, defaults },
      coordinate: { createStringXY },
    } = ol
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
            crossOrigin: "anonymous", //跨域
          })
        }),
      ],
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
      controls: defaults({
        attributionOptions: {
          collapsible: true,
        },
      }).extend([
        new MousePosition({
          coordinateFormat: createStringXY(3),
          projection: "EPSG:4326",
          target: this.$refs.position,
        }),
      ]),
    })
  },
}
</script>
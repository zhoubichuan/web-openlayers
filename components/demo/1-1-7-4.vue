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
      source: { XYZ },
      control: { OverviewMap, defaults },
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
      controls: defaults().extend([
        new OverviewMap({
          collapsed: false,
          layers: [
            new TileLayer({
              source: new XYZ(),
            }),
          ],
        }),
      ]),
    })
  },
}
</script>
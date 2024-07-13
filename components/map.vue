<template>
  <div ref="map" class="map"></div>
</template>

<script>

export default {
  name:'WebMap',
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ, TileWMS },
    } = ol
    const layers = [
      new TileLayer({
        source: new XYZ({
          url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
          crossOrigin: "anonymous", //跨域
        })
      }),
      new TileLayer({
        source: new TileWMS({
          url: "https://ahocevar.com/geoserver/ne/wms",
          params: { LAYERS: "ne:ne_10m_admin_0_countries", TILED: true },
          serverType: "geoserver",
        }),
      }),
    ]
    const map = new Map({
      layers: layers,
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1,
      }),
    })
  },
}
</script>
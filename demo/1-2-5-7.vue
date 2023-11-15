<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  async mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: {
        OSM,
        WMTS: { optionsFromCapabilities },
      },
      format: { WMTSCapabilities },
    } = ol

    const parser = new WMTSCapabilities()
    let map
    let res = await this.$axios({
      type:'get',
      url:this.$withBase("/data/WMTSCapabilities.xml")
    })
    const result = parser.read(res.data)
    const options = optionsFromCapabilities(result, {
      layer: "layer-7328",
      matrixSet: "EPSG:3857",
    })

    map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.7,
        }),
        new TileLayer({
          opacity: 1,
          source: new ol.source.WMTS(options),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [19412406.33, -5050500.21],
        zoom: 5,
      }),
    })
  },
}
</script>
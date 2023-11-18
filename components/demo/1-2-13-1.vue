<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    async mounted() {
      let {
        format: { WMTSCapabilities },
        Map,
        View,
        layer: { Tile: TileLayer },
        source: { WMTS },
        has: { DEVICE_PIXEL_RATIO },
      } = ol
      const hiDPI = DEVICE_PIXEL_RATIO > 1
      const layer = hiDPI ? "bmaphidpi" : "geolandbasemap"
      const tilePixelRatio = hiDPI ? 2 : 1
  
      const map = new Map({
        target: this.$refs.map,
        view: new View({
          center: [1823849, 6143760],
          zoom: 11,
        }),
      })
      let res = await this.$axios.get(
        "https://basemap.at/wmts/1.0.0/WMTSCapabilities.xml"
      )
      const result = new WMTSCapabilities().read(res.data)
      const options = WMTS.optionsFromCapabilities(result, {
        layer: layer,
        matrixSet: "google3857",
        style: "normal",
      })
      options.tilePixelRatio = tilePixelRatio
      options.attributions =
        'Grundkarte: <a target="_blank" href="https://basemap.at/">basemap.at</a>'
      map.addLayer(
        new TileLayer({
          source: new WMTS(options),
        })
      )
    },
  }
  </script>
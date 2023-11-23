<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Image: ImageLayer },
      source: { ImageWMS, TileWMS },
      control: { ScaleLine, defaults: defaultControls },
      proj: { Projection },
    } = ol

    const layers = [
      new TileLayer({
        source: new TileWMS({
          attributions:
            '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000"' +
            'target="_blank">Pixelmap 1:1000000 / geo.admin.ch</a>',
          crossOrigin: "anonymous",
          params: {
            LAYERS: "ch.swisstopo.pixelkarte-farbe-pk1000.noscale",
            FORMAT: "image/jpeg",
          },
          url: "https://wms.geo.admin.ch/",
        }),
      }),
      new ImageLayer({
        source: new ImageWMS({
          attributions:
            '© <a href="https://www.hydrodaten.admin.ch/en/notes-on-the-flood-alert-maps.html"' +
            'target="_blank">Flood Alert / geo.admin.ch</a>',
          crossOrigin: "anonymous",
          params: { LAYERS: "ch.bafu.hydroweb-warnkarte_national" },
          serverType: "mapserver",
          url: "https://wms.geo.admin.ch/",
        }),
      }),
    ]

    const projection = new Projection({
      code: "EPSG:21781",
      units: "m",
    })

    const map = new Map({
      controls: defaultControls().extend([new ScaleLine()]),
      layers: layers,
      target: this.$refs.map,
      view: new View({
        center: [660000, 190000],
        projection: projection,
        zoom: 9,
      }),
    })
  },
}
</script>
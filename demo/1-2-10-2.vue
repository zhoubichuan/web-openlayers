<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Feature,
        geom: { Circle },
        Map,
        View,
        layer: { Tile: TileLayer, Image: ImageLayer },
        source: { OSM, ImageWMS },
        control: { ScaleLine, defaults: defaultControls },
        proj: {
          Projection,
          fromLonLat,
          proj4: { register },
        },
      } = ol
      this.$proj4.defs(
        "EPSG:21781",
        "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 " +
          "+x_0=600000 +y_0=200000 +ellps=bessel " +
          "+towgs84=660.077,13.551,369.344,2.484,1.783,2.939,5.66 +units=m +no_defs"
      )
      register(this.$proj4)
      const projection = new Projection({
        code: "EPSG:21781",
        extent: [485869.5728, 76443.1884, 837076.5648, 299941.7864],
      })
      const extent = [420000, 30000, 900000, 350000]
      const layers = [
        new ImageLayer({
          extent: extent,
          source: new ImageWMS({
            url: "https://wms.geo.admin.ch/",
            crossOrigin: "anonymous",
            attributions:
              '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000"' +
              'target="_blank">Pixelmap 1:1000000 / geo.admin.ch</a>',
            params: {
              LAYERS: "ch.swisstopo.pixelkarte-farbe-pk1000.noscale",
              FORMAT: "image/jpeg",
            },
            serverType: "mapserver",
          }),
        }),
        new ImageLayer({
          extent: extent,
          source: new ImageWMS({
            url: "https://wms.geo.admin.ch/",
            crossOrigin: "anonymous",
            attributions:
              '© <a href="https://www.hydrodaten.admin.ch/en/notes-on-the-flood-alert-maps.html"' +
              'target="_blank">Flood Alert / geo.admin.ch</a>',
            params: { LAYERS: "ch.bafu.hydroweb-warnkarte_national" },
            serverType: "mapserver",
          }),
        }),
      ]
      const map = new Map({
        controls: defaultControls().extend([new ScaleLine()]),
        layers: layers,
        target: this.$refs.map,
        view: new View({
          projection: projection,
          center: fromLonLat([8.23, 46.86], projection),
          extent: extent,
          zoom: 2,
        }),
      })
    },
  }
  </script>
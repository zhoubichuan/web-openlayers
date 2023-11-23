<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      tilegrid: { WMTS: WMTSTileGrid },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, WMTS },
      extent: { getTopLeft, getWidth },
      proj: { get: getProjection },
    } = ol

    const projection = getProjection("EPSG:3857")
    const projectionExtent = projection.getExtent()
    const size = getWidth(projectionExtent) / 256
    const resolutions = new Array(19)
    const matrixIds = new Array(19)
    for (let z = 0; z < 19; ++z) {
      resolutions[z] = size / Math.pow(2, z)
      matrixIds[z] = z
    }

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          opacity: 0.7,
          source: new WMTS({
            attributions:
              'Tiles © <a href="https://mrdata.usgs.gov/geology/state/"' +
              ' target="_blank">USGS</a>',
            url: "https://mrdata.usgs.gov/mapcache/wmts",
            layer: "sgmc2",
            matrixSet: "GoogleMapsCompatible",
            format: "image/png",
            projection: projection,
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(projectionExtent),
              resolutions: resolutions,
              matrixIds: matrixIds,
            }),
            style: "default",
            wrapX: true,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [-11158582, 4813697],
        zoom: 4,
      }),
    })
  },
}
</script>
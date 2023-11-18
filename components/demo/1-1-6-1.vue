<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { MVT },
      Map,
      tilegrid: { TileGrid },
      View,
      layer: { VectorTile: VectorTileLayer },
      source: { VectorTile: VectorTileSource },
      style: { Fill, Icon, Stroke, Style, Text },
      proj: { get: getProjection },
    } = ol
    const resolutions = []
    for (let i = 0; i <= 8; ++i) {
      resolutions.push(156543.03392804097 / Math.pow(2, i * 2))
    }
    function tileUrlFunction(tileCoord) {
      return (
        "https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/" +
        "{z}/{x}/{y}.vector.pbf?access_token=" +
        mapkeys.mapbox
      )
        .replace("{z}", String(tileCoord[0] * 2 - 1))
        .replace("{x}", String(tileCoord[1]))
        .replace("{y}", String(tileCoord[2]))
        .replace(
          "{a-d}",
          "abcd".substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
        )
    }
    new Map({
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            attributions:
              '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
              '© <a href="https://www.openstreetmap.org/copyright">' +
              "OpenStreetMap contributors</a>",
            format: new MVT(),
            tileGrid: new TileGrid({
              extent: getProjection("EPSG:3857").getExtent(),
              resolutions: resolutions,
              tileSize: 512,
            }),
            tileUrlFunction: tileUrlFunction,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        minZoom: 1,
        zoom: 2,
      }),
    })
  },
}
</script>
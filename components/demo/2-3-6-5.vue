<template>
  <div ref="map" class="map" style="background:none;"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { MVT },
      View,
      source: { VectorTile: VectorTileSource },
      tilegrid: { TileGrid },
    } = ol
    const maxResolution = 360 / 512
    defaultResolutions.length = 14
    for (let i = 0; i < 14; ++i) {
      defaultResolutions[i] = maxResolution / Math.pow(2, i + 1)
    }

    olms(
      "map",
      "https://api.maptiler.com/maps/basic-4326/style.json?key=" +
        mapkeys.maptiler
    ).then(function (map) {
      // Custom tile grid for the EPSG:4326 projection
      const tileGrid = new TileGrid({
        extent: [-180, -90, 180, 90],
        tileSize: 512,
        resolutions: defaultResolutions,
      })

      const mapboxStyle = map.get("mapbox-style")

      // Replace the source with a EPSG:4326 projection source for each vector tile layer
      map.getLayers().forEach(function (layer) {
        const mapboxSource = layer.get("mapbox-source")
        if (
          mapboxSource &&
          mapboxStyle.sources[mapboxSource].type === "vector"
        ) {
          const source = layer.getSource()
          layer.setSource(
            new VectorTileSource({
              format: new MVT(),
              projection: "EPSG:4326",
              urls: source.getUrls(),
              tileGrid: tileGrid,
            })
          )
        }
      })

      // Configure the map with a view with EPSG:4326 projection
      map.setView(
        new View({
          projection: "EPSG:4326",
          zoom: mapboxStyle.zoom,
          center: mapboxStyle.center,
        })
      )
    })
  },
}
</script>
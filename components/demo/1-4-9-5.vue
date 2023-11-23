<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      layer: { WebGLTile: TileLayer },
      source: { GeoTIFF },
    } = ol
    const source = new GeoTIFF({
      sources: [
        {
          url: "https://s2downloads.eox.at/demo/Sentinel-2/3857/R10m.tif",
          bands: [3, 4],
          min: 0,
          nodata: 0,
          max: 65535,
        },
        {
          url: "https://s2downloads.eox.at/demo/Sentinel-2/3857/R60m.tif",
          bands: [9],
          min: 0,
          nodata: 0,
          max: 65535,
        },
      ],
    })
    source.setAttributions(
      "<a href='https://s2maps.eu'>Sentinel-2 cloudless</a> by <a href='https://eox.at/'>EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2019)"
    )
    const ndvi = [
      "/",
      ["-", ["band", 2], ["band", 1]],
      ["+", ["band", 2], ["band", 1]],
    ]
    const ndwi = [
      "/",
      ["-", ["band", 3], ["band", 1]],
      ["+", ["band", 3], ["band", 1]],
    ]
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          style: {
            color: [
              "color",
              ["*", 255, ["abs", ["-", ndvi, ndwi]]],
              ["*", 255, ndvi],
              ["*", 255, ndwi],
              ["band", 4],
            ],
          },
          source,
        }),
      ],
      view: source.getView(),
    })
  },
}
</script>
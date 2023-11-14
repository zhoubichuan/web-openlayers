<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Graticule, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Fill, Style },
      proj: {
        Projection,
        proj4: { register },
      },
    } = ol
    this.$proj4.defs(
      "ESRI:53009",
      "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 " +
        "+b=6371000 +units=m +no_defs"
    )
    register(this.$proj4)
    const sphereMollweideProjection = new Projection({
      code: "ESRI:53009",
      extent: [
        -18019909.21177587, -9009954.605703328, 18019909.21177587,
        9009954.605703328,
      ],
      worldExtent: [-179, -89.99, 179, 89.99],
    })

    const style = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
    })

    const map = new Map({
      keyboardEventTarget: document,
      layers: [
        new VectorLayer({
          source: new VectorSource({
            url: "https://openlayers.org/data/vector/ecoregions.json",
            format: new GeoJSON(),
          }),
          style: function (feature) {
            const color = feature.get("COLOR_BIO") || "#eeeeee"
            style.getFill().setColor(color)
            return style
          },
        }),
        new Graticule(),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        projection: sphereMollweideProjection,
        zoom: 2,
      }),
    })
  },
}
</script>
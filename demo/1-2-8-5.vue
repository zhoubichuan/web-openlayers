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
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Stamen, Vector: VectorSource },
      style: { Fill, Style },
      proj: { fromLonLat },
      render: { getVectorContext },
    } = ol
    const background = new TileLayer({
      className: "stamen",
      source: new Stamen({
        layer: "toner",
      }),
    })
    const base = new TileLayer({
      source: new OSM(),
    })
    const clipLayer = new VectorLayer({
      style: null,
      source: new VectorSource({
        url: this.$withBase("/data/geojson/switzerland.geojson"),
        format: new GeoJSON(),
      }),
    })
    clipLayer.getSource().on("addfeature", function () {
      base.setExtent(clipLayer.getSource().getExtent())
    })
    const style = new Style({
      fill: new Fill({
        color: "black",
      }),
    })
    base.on("postrender", function (e) {
      const vectorContext = getVectorContext(e)
      e.context.globalCompositeOperation = "destination-in"
      clipLayer.getSource().forEachFeature(function (feature) {
        vectorContext.drawFeature(feature, style)
      })
      e.context.globalCompositeOperation = "source-over"
    })
    const map = new Map({
      layers: [background, base, clipLayer],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([8.23, 46.86]),
        zoom: 7,
      }),
    })
  },
}
</script>
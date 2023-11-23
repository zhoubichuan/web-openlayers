<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  async mounted() {
    let {
      format: { GeoJSON },
      geom: {
        LinearRing,
        LineString,
        MultiLineString,
        MultiPoint,
        MultiPolygon,
        Point,
        Polygon,
      },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      proj: { fromLonLat },
    } = ol
    const source = new VectorSource()
    let res = await this.$axios.get(
      this.$withBase("/data/geojson/roads-seoul.geojson")
    )
    console.log(res)
    const format = new GeoJSON()
    const features = format.readFeatures(res.data, {
      featureProjection: "EPSG:3857",
    })
    const parser = new this.$jsts.io.OL3Parser()
    parser.inject(
      Point,
      LineString,
      LinearRing,
      Polygon,
      MultiPoint,
      MultiLineString,
      MultiPolygon
    )
    for (let i = 0; i < features.length; i++) {
      const feature = features[i]
      const jstsGeom = parser.read(feature.getGeometry())
      const buffered = jstsGeom.buffer(40)
      feature.setGeometry(parser.write(buffered))
    }
    source.addFeatures(features)
    const vectorLayer = new VectorLayer({
      source: source,
    })
    const rasterLayer = new TileLayer({
      source: new OSM(),
    })
    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([126.979293, 37.528787]),
        zoom: 15,
      }),
    })
  },
}
</script>
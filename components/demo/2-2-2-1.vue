<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  async mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      proj: { fromLonLat },
    } = ol
    const source = new VectorSource()
    const turf = this.$turf
    fetch(this.$withBase("/data/geojson/roads-seoul.geojson"))
      .then(function (response) {
        return response.json()
      }).then(function (json) {
        const format = new GeoJSON()
        const features = format.readFeatures(json)
        const street = features[0]
        const turfLine = format.writeFeatureObject(street)
        const distance = 0.2
        const length = turf.lineDistance(turfLine, "kilometers")
        for (let i = 1; i <= length / distance; i++) {
          const turfPoint = turf.along(turfLine, i * distance, "kilometers")
          const marker = format.readFeature(turfPoint)
          marker.getGeometry().transform("EPSG:4326", "EPSG:3857")
          source.addFeature(marker)
        }
        street.getGeometry().transform("EPSG:4326", "EPSG:3857")
        source.addFeature(street)
      })
    const vectorLayer = new VectorLayer({
      source: source,
    })
    const rasterLayer = new TileLayer({
      source: new OSM(),
    })
    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: document.getElementById("map"),
      view: new View({
        center: fromLonLat([126.980366, 37.52654]),
        zoom: 15,
      }),
    })
  },
}
</script>
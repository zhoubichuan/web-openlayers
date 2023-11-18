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
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      interaction: { Select, Translate, defaults: defaultInteractions },
      proj: { fromLonLat },
    } = ol
    const vector = new VectorLayer({
      background: "white",
      source: new VectorSource({
        url: "https://openlayers.org/data/vector/us-states.json",
        format: new GeoJSON(),
      }),
    })
    const select = new Select()
    const translate = new Translate({
      features: select.getFeatures(),
    })
    const map = new Map({
      interactions: defaultInteractions().extend([select, translate]),
      layers: [vector],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-100, 38.5]),
        zoom: 4,
      }),
    })
  },
}
</script>
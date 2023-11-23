<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ },
    } = ol
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new XYZ({
            url:
              "https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png" +
              "?apikey=Your API key from https://www.thunderforest.com/docs/apikeys/ here",
          }),
        }),
      ],
      view: new View({
        center: [-472202, 7530279],
        zoom: 12,
      }),
    })
  },
}
</script>
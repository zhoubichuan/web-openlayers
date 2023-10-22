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
      source: { OSM },
    } = ol
    new Map({
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
    })
  },
}
</script>
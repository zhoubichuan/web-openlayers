<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { defaults },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      events: { condition: platformModifierKeyOnly },
    } = ol

    const map = new Map({
      interactions: defaults({
        mouseWheelZoom: false,
        doubleClickZoom: false,
        dragPan: false,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })
  },
}
</script>
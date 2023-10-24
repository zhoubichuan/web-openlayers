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
      interaction: { PinchZoom, defaults: defaultInteractions },
    } = ol
    const map = new Map({
      interactions: defaultInteractions().extend([new PinchZoom()]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
        constrainResolution: true,
      }),
    })
  },
}
</script>
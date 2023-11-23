<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { DragRotateAndZoom, defaults: defaultInteractions },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
    } = ol;
    const map = new Map({
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
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
    });
  },
};
</script>
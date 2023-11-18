<template>
  <div ref="map" class="map"></div>
</template>
<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { Stamen },
    } = ol;
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "watercolor",
          }),
        }),
      ],
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
    });
  },
};
</script>
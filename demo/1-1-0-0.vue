<template>
  <div ref="map" class="map"></div>
</template>
<script>
import { Map, View } from "ol";
import { Stamen } from "ol/source";
import { WebGLTile as TileLayer } from "ol/layer";
debugger
export default {
  mounted() {
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
<style>
.map {
  width: 100%;
  height: 100%;
}
</style>
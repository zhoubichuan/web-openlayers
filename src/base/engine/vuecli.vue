<template>
  <div class="map-example">
    <div ref="map" class="map"></div>
    <div class="position" ref="position"></div>
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { MousePosition, defaults } from "ol/control";
import {createStringXY} from 'ol/coordinate';
export default {
  name: "mousePosition",
  mounted() {
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
      controls: defaults({
        attributionOptions: {
          collapsible: true,
        },
      }).extend([new MousePosition({
        coordinateFormat: createStringXY(3),
        projection: 'EPSG:4326',
        target: this.$refs.position,
      })]),
      target: this.$refs.map,
    });
  },
};
</script>

<style lang="stylus" scoped>
.map-example {
  width: 100%;
  height: 80vh;
  position relative
  .map {
    width: 100%;
    height: 100%;
    border: 1px solid $accentColor;
  }
  .position{
    position absolute
    top -50px
    right 0
    white-space: nowrap
  }
}
</style>


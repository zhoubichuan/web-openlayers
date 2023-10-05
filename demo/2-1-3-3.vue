<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
let {
  format: { TopoJSON },
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { XYZ, Vector: VectorSource },
  style: { Fill, Stroke, Style },
} = ol;
export default {
  mounted() {
    const map = new Map({
      layers: [
        new VectorLayer({
          source: new VectorSource({
            url: this.$withBase("/data/topojson/world-110m.json"),
            format: new TopoJSON({
              layers: ["countries"],
            }),
            overlaps: false,
          }),
          style: new Style({
            fill: new Fill({
              color: "#eeeeee",
            }),
            stroke: new Stroke({
              color: "#c3c3c4",
              width: 1,
            }),
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1.5,
        maxZoom: 19,
        minZoom: 1,
      }),
    });
  },
};
</script>
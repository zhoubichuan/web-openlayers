<template>
  <div style="position:relative">
    <div ref="map" class="map"></div>
    <div ref="position"></div>
  </div>
</template>
<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { OSM },
      control: { MousePosition, defaults },
      coordinate: { createStringXY },
    } = ol
    new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
      controls: defaults({
        attributionOptions: {
          collapsible: true,
        },
      }).extend([
        new MousePosition({
          coordinateFormat: createStringXY(3),
          projection: "EPSG:4326",
          target: this.$refs.position,
        }),
      ]),
    })
  },
}
</script>
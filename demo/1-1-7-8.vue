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
      source: { OSM },
      control: { ZoomToExtent, defaults },
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
        zoom: 2,
      }),
      controls: defaults().extend([
        new ZoomToExtent({
          tipLabel: "缩放至广州",
          label: "Z",
          extent: [12583177, 2639953, 12622469, 2669156],
        }),
      ]),
    })
  },
}
</script>
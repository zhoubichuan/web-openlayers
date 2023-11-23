<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      control: { ZoomSlider, defaults: defaultControls },
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      style: { Circle: CircleStyle, Fill, Stroke, Style, Text },
    } = ol
    const view = new View({
      center: [328627.563458, 5921296.662223],
      zoom: 8,
      extent: [-572513.341856, 5211017.966314, 916327.095083, 6636950.728974],
    })

    new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      keyboardEventTarget: document,
      target: this.$refs.map,
      view: view,
      controls: defaultControls().extend([new ZoomSlider()]),
    })
  },
}
</script>
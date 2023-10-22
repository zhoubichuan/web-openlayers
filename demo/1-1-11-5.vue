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
      source: { XYZ },
      control: { FullScreen, defaults: defaultControls },
      interaction: { DragRotateAndZoom, defaults: defaultInteractions },
    } = ol
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

    const map = new Map({
      controls: defaultControls().extend([new FullScreen()]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
              mapkeys.maptiler,
            maxZoom: 20,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [-33519607, 5616436],
        rotation: -Math.PI / 8,
        zoom: 8,
      }),
    })
  },
}
</script>
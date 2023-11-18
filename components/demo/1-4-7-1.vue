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
      } = ol;
  
      const attributions =
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
  
      const map = new Map({
        target: this.$refs.map,
        layers: [
          new TileLayer({
            source: new XYZ({
              attributions: attributions,
              url:
                "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
                mapkeys.maptiler,
            }),
          }),
        ],
        view: new View({
          center: [-13553864, 5918250],
          zoom: 11,
          minZoom: 9,
          maxZoom: 13,
        }),
      });
    },
  };
  </script>
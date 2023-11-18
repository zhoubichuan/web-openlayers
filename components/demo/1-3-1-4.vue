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
        proj: { fromLonLat },
      } = ol;
      const key = "get_your_own_D6rA4zTHduk6KOKTXzGB";
      const attributions =
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
      const map = new Map({
        layers: [
          new TileLayer({
            source: new XYZ({
              attributions: attributions,
              url:
                "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
                key,
              tileSize: 512,
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: fromLonLat([114.31, 30.52]),
          zoom: 12,
        }),
      });
      map.on("loadstart", function () {
        map.getTargetElement().classList.add("spinner");
      });
      map.on("loadend", function () {
        map.getTargetElement().classList.remove("spinner");
      });
    },
  };
  </script>
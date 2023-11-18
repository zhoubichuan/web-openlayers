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
        source: { OSM, TileWMS },
      } = ol;
  
      const layers = [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          extent: [-13884991, 2870341, -7455066, 6338219],
          source: new TileWMS({
            url: "https://ahocevar.com/geoserver/wms",
            params: { LAYERS: "topp:states", TILED: true },
            serverType: "geoserver",
            transition: 0,
          }),
        }),
      ];
      const map = new Map({
        layers: layers,
        target: this.$refs.map,
        view: new View({
          center: [-10997148, 4569099],
          zoom: 4,
        }),
      });
    },
  };
  </script>
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
        source: { TileWMS },
        control: { ScaleLine, defaults: defaultControls },
      } = ol;
  
      const map = new Map({
        controls: defaultControls().extend([
          new ScaleLine({
            units: "degrees",
          }),
        ]),
        layers: [
          new TileLayer({
            source: new TileWMS({
              url: "https://ahocevar.com/geoserver/wms",
              params: {
                LAYERS: "ne:NE1_HR_LC_SR_W_DR",
                TILED: true,
              },
            }),
          }),
        ],
        target: this.$refs.map,
        view: new View({
          projection: "EPSG:4326",
          center: [12579156, 3274244],
          zoom: 2,
        }),
      });
    },
  };
  </script>
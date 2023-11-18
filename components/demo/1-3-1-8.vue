<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        format: { MVT },
        Map,
        View,
        layer: { Tile: TileLayer, VectorTile: VectorTileLayer },
        source: { VectorTile: VectorTileSource, TileDebug },
        style: { Fill, Stroke, Style, Text },
      } = ol;
      const style = new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.6)",
        }),
        stroke: new Stroke({
          color: "#319FD3",
          width: 1,
        }),
        text: new Text({
          font: "12px Calibri,sans-serif",
          fill: new Fill({
            color: "#000",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 3,
          }),
        }),
      });
  
      const vtLayer = new VectorTileLayer({
        declutter: true,
        source: new VectorTileSource({
          maxZoom: 15,
          format: new MVT(),
          url:
            "https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/" +
            "ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf",
        }),
        style: function (feature) {
          style.getText().setText(feature.get("name"));
          return style;
        },
      });
  
      const debugLayer = new TileLayer({
        source: new TileDebug({
          template: "z:{z} x:{x} y:{-y}",
          projection: vtLayer.getSource().getProjection(),
          tileGrid: vtLayer.getSource().getTileGrid(),
          zDirection: 1,
        }),
      });
  
      const map = new Map({
        layers: [vtLayer, debugLayer],
        target: this.$refs.map,
        view: new View({
          center: [0, 6000000],
          zoom: 4,
        }),
      });
    },
  };
  </script>
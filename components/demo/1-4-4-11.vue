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
      source: {
        OSM: { ATTRIBUTION },
      },
    } = ol;
    const openCycleMapLayer = new TileLayer({
      source: new ol.source.OSM({
        attributions: [
          'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
          ATTRIBUTION,
        ],
        url:
          "https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png" +
          "?apikey=Your API key from https://www.thunderforest.com/docs/apikeys/ here",
      }),
    });

    const openSeaMapLayer = new TileLayer({
      source: new ol.source.OSM({
        attributions: [
          'All maps © <a href="https://www.openseamap.org/">OpenSeaMap</a>',
          ATTRIBUTION,
        ],
        opaque: false,
        url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
      }),
    });

    const map = new Map({
      layers: [openCycleMapLayer, openSeaMapLayer],
      target: this.$refs.map,
      view: new View({
        maxZoom: 18,
        center: [-244780.24508882355, 5986452.183179816],
        zoom: 15,
      }),
    });
  },
};
</script>
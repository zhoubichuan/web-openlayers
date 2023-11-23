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
      source: { OSM },
    } = ol;
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [-8730000, 5930000],
        rotation: Math.PI / 5,
        zoom: 8,
      }),
    });

    $(".ol-zoom-in, .ol-zoom-out").tooltip({
      placement: "right",
      container: "#map",
    });
    $(".ol-rotate-reset, .ol-attribution button[title]").tooltip({
      placement: "left",
      container: "#map",
    });
  },
};
</script>
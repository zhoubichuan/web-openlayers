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
      source: { OSM, XYZ },
      proj: { transform },
    } = ol;

    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=" +
              mapkeys.maptiler,
            tilePixelRatio: 2,
          }),
        }),
      ],
      view: new View({
        projection: "EPSG:3857",
        center: transform(
          [-116.18688965, 36.057944835],
          "EPSG:4326",
          "EPSG:3857"
        ),
        zoom: 12,
      }),
    });
  },
};
</script>
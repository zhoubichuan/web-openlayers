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
      source: { OSM, TileJSON },
    } = ol;
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
          minResolution: 200,
          maxResolution: 2000,
        }),
        new TileLayer({
          source: new TileJSON({
            url:
              "https://api.tiles.mapbox.com/v4/mapbox.natural-earth-hypso-bathy.json?secure&access_token=" +
              mapkeys.mapbox,
            crossOrigin: "anonymous",
          }),
          minResolution: 2000,
          maxResolution: 20000,
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [653600, 5723680],
        zoom: 5,
      }),
    });
  },
};
</script>
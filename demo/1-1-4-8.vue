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
      proj: { fromLonLat },
    } = ol

    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          maxZoom: 14,
          source: new OSM(),
        }),
        new TileLayer({
          minZoom: 14,
          source: new TileJSON({
            url:
              "https://api.maptiler.com/maps/outdoor/tiles.json?key=" +
              mapkeys.maptiler,
            tileSize: 512,
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([-116.18688965, 36.057944835]),
        zoom: 15,
        maxZoom: 18,
        constrainOnlyCenter: true,
      }),
    })
  },
}
</script>
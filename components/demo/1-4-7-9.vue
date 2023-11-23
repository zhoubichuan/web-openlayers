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
    } = ol

    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions:
              'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
              'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
            url:
              "https://server.arcgisonline.com/ArcGIS/rest/services/" +
              "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          }),
        }),
      ],
      view: new View({
        center: fromLonLat([-121.1, 47.5]),
        zoom: 7,
      }),
    })
  },
}
</script>
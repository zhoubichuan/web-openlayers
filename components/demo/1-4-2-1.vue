<template>
  <div>
    <div ref="map1" class="map" style="height: 300px"></div>
    <div ref="map2" class="map" style="margin-top: 10px; height: 300px"></div>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { BingMaps },
    } = ol;
    const view = new View({
      center: [-4808600, -2620936],
      zoom: 8,
    });
    const map1 = new Map({
      layers: [
        new TileLayer({
          preload: Infinity,
          source: new BingMaps({
            key: mapkeys.BingMaps,
            imagerySet: "Aerial",
          }),
        }),
      ],
      target: this.$refs.map1,
      view: view,
    });
    const map2 = new Map({
      layers: [
        new TileLayer({
          preload: 0,
          source: new BingMaps({
            key: mapkeys.BingMaps,
            imagerySet: "AerialWithLabelsOnDemand",
          }),
        }),
      ],
      target: this.$refs.map2,
      view: view,
    });
  },
};
</script>
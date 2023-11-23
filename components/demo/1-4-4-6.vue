<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { Extent: ExtentInteraction },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      events: { condition: shiftKeyOnly },
    } = ol;
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });

    const extent = new ExtentInteraction({ condition: shiftKeyOnly });
    map.addInteraction(extent);
  },
};
</script>
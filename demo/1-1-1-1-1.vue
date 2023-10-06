<template>
  <div>
    <div id="map1" class="map"></div>
    <div id="map2" class="map"></div>
    <button ref="teleport">传送</button>
  </div>
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
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    map.setTarget("map1");
    this.$refs.teleport.addEventListener(
      "click",
      function () {
        const target = map.getTarget() === "map1" ? "map2" : "map1";
        map.setTarget(target);
      },
      false
    );
  },
};
</script>
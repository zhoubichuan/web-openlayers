<template>
  <div class="map">
    <div ref="map" style="height: 80%"></div>
    <label>left: <input readonly="readonly" type="text" id="left" /></label>
    <label>right: <input readonly="readonly" type="text" id="right" /></label>
    <label>bottom: <input readonly="readonly" type="text" id="bottom" /></label>
    <label>top: <input readonly="readonly" type="text" id="top" /></label>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { Vector: VectorSource },
      extent: { getBottomLeft, getTopRight },
      proj: { toLonLat, fromLonLat },
    } = ol;
    const map = new Map({
      layers: [
        new VectorLayer({
          source: new VectorSource({
            url: "/data/100000_full.json",
            format: new GeoJSON(),
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([108.522097, 37.272848]),
        zoom: 4,
      }),
    });
    function display(id, value) {
      document.getElementById(id).value = value.toFixed(2);
    }
    function wrapLon(value) {
      const worlds = Math.floor((value + 180) / 360);
      return value * worlds * 360;
    }
    map.on("moveend", function onMoveEnd(evt) {
      const map = evt.map;
      const extent = map.getView().calculateExtent(map.getSize());
      const bottomLeft = toLonLat(getBottomLeft(extent));
      const topRight = toLonLat(getTopRight(extent));
      display("left", wrapLon(bottomLeft[0]));
      display("bottom", bottomLeft[1]);
      display("right", wrapLon(topRight[0]));
      display("top", topRight[1]);
    });
  },
};
</script>
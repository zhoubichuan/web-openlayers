<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="shall-smoothen">绘制平滑几何图形?</label>
      <input ref="shallsmoothen" type="checkbox" checked /><br />
      <label for="iterations">平滑次数</label>
      <input
        style="width: 250px"
        type="range"
        ref="iterations"
        min="2"
        max="10"
        step="1"
        value="5"
      />
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { Draw },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: Style,
    } = ol;
    function makeSmooth(path, numIterations) {
      numIterations = Math.min(Math.max(numIterations, 1), 10);
      while (numIterations > 0) {
        path = smooth(path);
        numIterations--;
      }
      return path;
    }
    const vectorSource = new VectorSource({});
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
          opacity: 0.5,
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [1078373.595, 6871994.591],
        zoom: 5,
      }),
    });
    const shallSmoothen = this.$refs.shallsmoothen;
    const numIterations = this.$refs.iterations;
    const draw = new Draw({
      source: vectorSource,
      type: "LineString",
    });
    map.addInteraction(draw);
    draw.on("drawend", function (event) {
      if (!shallSmoothen.checked) {
        return;
      }
      const feat = event.feature;
      const geometry = feat.getGeometry();
      const coords = geometry.getCoordinates();
      const smoothened = makeSmooth(
        coords,
        parseInt(numIterations.value, 10) || 5
      );
      geometry.setCoordinates(smoothened);
    });
  },
};
</script>
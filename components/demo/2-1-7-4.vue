<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">几何类型 &nbsp;</label>
      <select ref="type">
        <option value="LineString">线条</option>
        <option value="Polygon">多边形</option>
        <option value="Circle">圆圈</option>
        <option value="None">无</option>
      </select>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      interaction: { Draw },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
    } = ol;
    const raster = new TileLayer({
      source: new OSM(),
    });
    const source = new VectorSource({ wrapX: false });
    const vector = new VectorLayer({
      source: source,
    });
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
      }),
    });
    const typeSelect = this.$refs.type;
    let draw;
    function addInteraction() {
      const value = typeSelect.value;
      if (value !== "None") {
        draw = new Draw({
          source: source,
          type: typeSelect.value,
          freehand: true,
        });
        draw.on("drawend", function (e) {
          const geometry = e.feature.getGeometry();
          const corrdinates = geometry.getCoordinates();
          console.log(corrdinates);
          // map.removeInteraction(draw)
          // map.removeInteraction(snap)
        });
        map.addInteraction(draw);
      }
    }
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };
    addInteraction();
  },
};
</script>
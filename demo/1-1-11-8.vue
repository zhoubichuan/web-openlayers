<template>
  <div>
    <div ref="map" class="map"></div>
    <div class="row">
      <div class="col-auto">
        <span class="input-group">
          <label class="input-group-text" for="type">几何类型:</label>
          <select class="form-select" ref="type">
            <option value="Point">点</option>
            <option value="LineString">直线</option>
            <option value="Polygon">多边形</option>
            <option value="Circle">圆</option>
            <option value="None">无</option>
          </select>
          <input class="form-control" type="button" value="撤销" ref="undo" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      interaction: { Draw },
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
        zoom: 8,
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
        });
        map.addInteraction(draw);
      }
    }
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };
    this.$refs.undo.addEventListener("click", function () {
      draw.removeLastPoint();
    });
    addInteraction();
  },
};
</script>
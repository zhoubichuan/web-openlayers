<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">形状类型: &nbsp;</label>
      <select ref="type">
        <option value="Circle">圆</option>
        <option value="Square">正方形</option>
        <option value="Box">长方形</option>
        <option value="Star">星星</option>
        <option value="None">无</option>
      </select>
      <input type="button" value="撤销" ref="undo" />
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      geom: { Polygon },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      interaction: {
        Draw: { createBox, createRegularPolygon },
      },
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
        center: [-11000000, 4600000],
        zoom: 4,
      }),
    });
    const typeSelect = this.$refs.type;
    let draw;
    function addInteraction() {
      let value = typeSelect.value;
      if (value !== "None") {
        let geometryFunction;
        if (value === "Square") {
          value = "Circle";
          geometryFunction = createRegularPolygon(4);
        } else if (value === "Box") {
          value = "Circle";
          geometryFunction = createBox();
        } else if (value === "Star") {
          value = "Circle";
          geometryFunction = function (coordinates, geometry) {
            const center = coordinates[0];
            const last = coordinates[coordinates.length - 1];
            const dx = center[0] - last[0];
            const dy = center[1] - last[1];
            const radius = Math.sqrt(dx * dx + dy * dy);
            const rotation = Math.atan2(dy, dx);
            const newCoordinates = [];
            const numPoints = 12;
            for (let i = 0; i < numPoints; ++i) {
              const angle = rotation + (i * 2 * Math.PI) / numPoints;
              const fraction = i % 2 === 0 ? 1 : 0.5;
              const offsetX = radius * fraction * Math.cos(angle);
              const offsetY = radius * fraction * Math.sin(angle);
              newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
            }
            newCoordinates.push(newCoordinates[0].slice());
            if (!geometry) {
              geometry = new Polygon([newCoordinates]);
            } else {
              geometry.setCoordinates([newCoordinates]);
            }
            return geometry;
          };
        }
        draw = new ol.interaction.Draw({
          source: source,
          type: value,
          geometryFunction: geometryFunction,
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
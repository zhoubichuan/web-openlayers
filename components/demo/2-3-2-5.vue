<template>
  <div>
    <div ref="map" class="map"></div>
    <div ref="position"></div>
    <form>
      <label for="projection">坐标系</label>
      <select ref="projection">
        <option value="EPSG:4326">EPSG:4326</option>
        <option value="EPSG:3857">EPSG:3857</option>
      </select>
      <label for="precision">精度</label>
      <input ref="precision" type="number" min="0" max="12" value="4" />
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      control: { MousePosition, defaults: defaultControls },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      coordinate: { createStringXY },
    } = ol;
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: "EPSG:4326",
      className: "custom-mouse-position",
      target: this.$refs.position,
    });
    const map = new Map({
      controls: defaultControls().extend([mousePositionControl]),
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
    const projectionSelect = this.$refs.projection;
    projectionSelect.addEventListener("change", function (event) {
      mousePositionControl.setProjection(event.target.value);
    });
    const precisionInput = this.$refs.projection;
    precisionInput.addEventListener("change", function (event) {
      const format = createStringXY(event.target.valueAsNumber);
      mousePositionControl.setCoordinateFormat(format);
    });
  },
};
</script>
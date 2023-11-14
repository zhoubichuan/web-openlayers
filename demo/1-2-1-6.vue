<template>
  <div>
    <div ref="map" class="map"></div>
    <div>
      <label for="view-projection">视图投影</label>
      <select ref="viewprojection">
        <option value="EPSG:3857">球面墨卡托 (EPSG:3857)</option>
        <option value="EPSG:4326" selected>WGS 84 (EPSG:4326)</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      control: { ScaleLine, defaults: defaultControls },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      proj: { getPointResolution, get: getProjection, transform },
    } = ol;
    const viewProjSelect = this.$refs.viewprojection;
    const projection = getProjection(viewProjSelect.value);
    const map = new Map({
      controls: defaultControls().extend([
        new ScaleLine({
          units: "metric",
          bar: true,
          steps: 4,
          text: true,
          minWidth: 140,
        }),
      ]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: transform([0, 52], "EPSG:4326", projection),
        zoom: 6,
        projection: projection,
      }),
    });
    function onChangeProjection() {
      const currentView = map.getView();
      const currentProjection = currentView.getProjection();
      const newProjection = getProjection(viewProjSelect.value);
      const currentResolution = currentView.getResolution();
      const currentCenter = currentView.getCenter();
      const currentRotation = currentView.getRotation();
      const newCenter = transform(
        currentCenter,
        currentProjection,
        newProjection
      );
      const currentPointResolution = getPointResolution(
        currentProjection,
        1,
        currentCenter,
        "m"
      );
      const newPointResolution = getPointResolution(
        newProjection,
        1,
        newCenter,
        "m"
      );
      const newResolution =
        (currentResolution * currentPointResolution) / newPointResolution;
      const newView = new View({
        center: newCenter,
        resolution: newResolution,
        rotation: currentRotation,
        projection: newProjection,
      });
      map.setView(newView);
    }
    viewProjSelect.addEventListener("change", onChangeProjection);
  },
};
</script>
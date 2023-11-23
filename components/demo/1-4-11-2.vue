<template>
  <div>
    <div ref="map" class="map"></div>
    <div>Selected regions: <span ref="info">None</span></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      interaction: { DragBox, Select },
      style: { Fill, Stroke, Style },
      events: { condition: platformModifierKeyOnly },
    } = ol;
    const style = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
    });
    const map = new Map({
      layers: [
        new VectorLayer({
          source: new VectorSource({
            url: "https://openlayers.org/data/vector/ecoregions.json",
            format: new GeoJSON(),
          }),
          background: "#1a2b39",
          style: function (feature) {
            const color = feature.get("COLOR_BIO") || "#eeeeee";
            style.getFill().setColor(color);
            return style;
          },
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
        constrainRotation: 16,
      }),
    });
    const selectedStyle = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.6)",
      }),
      stroke: new Stroke({
        color: "rgba(255, 255, 255, 0.7)",
        width: 2,
      }),
    });
    const select = new Select({
      style: function (feature) {
        const color = feature.get("COLOR_BIO") || "#eeeeee";
        selectedStyle.getFill().setColor(color);
        return selectedStyle;
      },
    });
    map.addInteraction(select);
    const selectedFeatures = select.getFeatures();
    const dragBox = new DragBox({
      condition: platformModifierKeyOnly,
    });
    map.addInteraction(dragBox);
    dragBox.on("boxend", function () {
      const extent = dragBox.getGeometry().getExtent();
      const boxFeatures = vectorSource
        .getFeaturesInExtent(extent)
        .filter((feature) => feature.getGeometry().intersectsExtent(extent));
      const rotation = map.getView().getRotation();
      const oblique = rotation % (Math.PI / 2) !== 0;
      if (oblique) {
        const anchor = [0, 0];
        const geometry = dragBox.getGeometry().clone();
        geometry.rotate(-rotation, anchor);
        const extent = geometry.getExtent();
        boxFeatures.forEach(function (feature) {
          const geometry = feature.getGeometry().clone();
          geometry.rotate(-rotation, anchor);
          if (geometry.intersectsExtent(extent)) {
            selectedFeatures.push(feature);
          }
        });
      } else {
        selectedFeatures.extend(boxFeatures);
      }
    });
    dragBox.on("boxstart", function () {
      selectedFeatures.clear();
    });
    const infoBox = this.$refs.info;
    selectedFeatures.on(["add", "remove"], function () {
      const names = selectedFeatures.getArray().map(function (feature) {
        return feature.get("ECO_NAME");
      });
      if (names.length > 0) {
        infoBox.innerHTML = names.join(", ");
      } else {
        infoBox.innerHTML = "None";
      }
    });
  },
};
</script>
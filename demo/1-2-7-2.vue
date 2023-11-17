<template>
  <div>
    <div ref="map" class="map"></div>
    <span ref="status">&nbsp;</span>
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
      style: { Fill, Stroke, Style },
    } = ol;
    const style = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
    });
    const vector = new VectorLayer({
      source: new VectorSource({
        url: "https://openlayers.org/data/vector/ecoregions.json",
        format: new GeoJSON(),
      }),
      background: "white",
      style: function (feature) {
        const color = feature.get("COLOR") || "#eeeeee";
        style.getFill().setColor(color);
        return style;
      },
    });
    const map = new Map({
      layers: [vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    const selectStyle = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
      stroke: new Stroke({
        color: "rgba(255, 255, 255, 0.7)",
        width: 2,
      }),
    });
    const status = this.$refs.status;
    let selected = null;
    map.on("pointermove", function (e) {
      if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
      }
      map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        selectStyle.getFill().setColor(f.get("COLOR") || "#eeeeee");
        f.setStyle(selectStyle);
        return true;
      });
      if (selected) {
        status.innerHTML = selected.get("ECO_NAME");
      } else {
        status.innerHTML = "&nbsp;";
      }
    });
  },
};
</script>
<template>
  <div>
    <div ref="map" class="map"></div>
    <div id="info">&nbsp;</div>
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

    const vectorLayer = new VectorLayer({
      background: "#1a2b39",
      source: new VectorSource({
        url: "https://openlayers.org/data/vector/ecoregions.json",
        format: new GeoJSON(),
      }),
      style: function (feature) {
        const color = feature.get("COLOR_NNH") || "#eeeeee";
        style.getFill().setColor(color);
        return style;
      },
    });

    const map = new Map({
      layers: [vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1,
      }),
    });

    const highlightStyle = new Style({
      stroke: new Stroke({
        color: "rgba(255, 255, 255, 0.7)",
        width: 2,
      }),
    });

    const featureOverlay = new VectorLayer({
      source: new VectorSource(),
      map: map,
      style: highlightStyle,
    });

    let highlight;
    const displayFeatureInfo = function (pixel) {
      vectorLayer.getFeatures(pixel).then(function (features) {
        const feature = features.length ? features[0] : undefined;
        const info = document.getElementById("info");
        if (features.length) {
          info.innerHTML =
            feature.get("ECO_NAME") + ": " + feature.get("NNH_NAME");
        } else {
          info.innerHTML = "&nbsp;";
        }

        if (feature !== highlight) {
          if (highlight) {
            featureOverlay.getSource().removeFeature(highlight);
          }
          if (feature) {
            featureOverlay.getSource().addFeature(feature);
          }
          highlight = feature;
        }
      });
    };

    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });

    map.on("click", function (evt) {
      displayFeatureInfo(evt.pixel);
    });
  },
};
</script>
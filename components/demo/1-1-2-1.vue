<template>
  <div ref="map" class="map"></div>
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
      proj: { fromLonLat },
      has: { DEVICE_PIXEL_RATIO },
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
        multiWorld: false,
      }),
    });
    const selected = [];

    var gradient = (function () {
      var canvas = document.createElement("canvas");
      var pixelRatio = DEVICE_PIXEL_RATIO;
      var context = canvas.getContext("2d");
      var grad = context.createLinearGradient(0, 0, 512 * pixelRatio, 0);
      grad.addColorStop(0, "rgba(66,99,232,1)");
      grad.addColorStop(1, "rgba(55,183,249,1)");
      return grad;
    })();
    // var fill = new Fill();
    // fill.setColor(gradient);
    map.on("singleclick", function (e) {
      map.forEachFeatureAtPixel(e.pixel, function (f) {
        const selIndex = selected.indexOf(f);
        if (selIndex < 0) {
          selected.push(f);
          f.setStyle(
            new Style({
              fill: new Fill({
                color: gradient,
              }),
              stroke: new Stroke({
                color: gradient,
                width: 2,
              }),
            })
          );
        } else {
          selected.splice(selIndex, 1);
          f.setStyle(undefined);
        }
      });
    });
  },
};
</script>
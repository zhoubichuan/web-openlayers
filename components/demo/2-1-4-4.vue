<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
let {
  Map,
  View,
  layer: { Tile: TileLayer, Heatmap: HeatmapLayer },
  source: { Stamen, Vector: VectorSource },
  format: { KML },
} = ol;
export default {
  mounted() {
    const blur = document.getElementById("blur");
    const radius = document.getElementById("radius");

    const vector = new HeatmapLayer({
      source: new VectorSource({
        url: this.$withBase("/data/kml/2012_Earthquakes_Mag5.kml"),
        format: new KML({
          extractStyles: false,
        }),
      }),
      blur: parseInt(blur.value, 10),
      radius: parseInt(radius.value, 10),
      weight: function (feature) {
        const name = feature.get("name");
        const magnitude = parseFloat(name.substr(2));
        return magnitude - 5;
      },
    });

    new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "toner",
          }),
        }),
        vector,
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });

    const blurHandler = function () {
      vector.setBlur(parseInt(blur.value, 10));
    };
    blur.addEventListener("input", blurHandler);
    blur.addEventListener("change", blurHandler);

    const radiusHandler = function () {
      vector.setRadius(parseInt(radius.value, 10));
    };
    radius.addEventListener("input", radiusHandler);
    radius.addEventListener("change", radiusHandler);
  },
};
</script>
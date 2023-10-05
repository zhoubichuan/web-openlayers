<template>
  <div ref="map" class="map"><div id="info"></div></div>
</template>
  
  <script>
let {
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { Stamen, Vector: VectorSource },
  style: { Circle: CircleStyle, Fill, Stroke, Style },
  format: { KML },
} = ol;
export default {
  mounted() {
    const styleCache = {};
    const styleFunction = function (feature) {
      const name = feature.get("name");
      const magnitude = parseFloat(name.substr(2));
      const radius = 5 + 20 * (magnitude - 5);
      let style = styleCache[radius];
      if (!style) {
        style = new Style({
          image: new CircleStyle({
            radius: radius,
            fill: new Fill({
              color: "rgba(255, 153, 0, 0.4)",
            }),
            stroke: new Stroke({
              color: "rgba(255, 204, 0, 0.2)",
              width: 1,
            }),
          }),
        });
        styleCache[radius] = style;
      }
      return style;
    };

    const map = new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "toner",
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: this.$withBase("/data/kml/2012_Earthquakes_Mag5.kml"),
            format: new KML({
              extractStyles: false,
            }),
          }),
          style: styleFunction,
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });

    // const info = $("#info");
    // info.tooltip({
    //   animation: false,
    //   trigger: "manual",
    // });

    // const displayFeatureInfo = function (pixel) {
    //   info.css({
    //     left: pixel[0] + "px",
    //     top: pixel[1] - 15 + "px",
    //   });
    //   const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    //     return feature;
    //   });
    //   if (feature) {
    //     info.attr("data-original-title", feature.get("name")).tooltip("show");
    //   } else {
    //     info.tooltip("hide");
    //   }
    // };

    // map.on("pointermove", function (evt) {
    //   if (evt.dragging) {
    //     info.tooltip("hide");
    //     return;
    //   }
    //   displayFeatureInfo(map.getEventPixel(evt.originalEvent));
    // });

    // map.on("click", function (evt) {
    //   displayFeatureInfo(evt.pixel);
    // });
  },
};
</script>
  <style></style>
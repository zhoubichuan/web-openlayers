<template>
    <div ref="map" class="map"><div id="info"></div></div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        format: { KML },
        Map,
        View,
        layer: { Tile: TileLayer, Vector: VectorLayer },
        source: { Stamen, Vector: VectorSource },
        style: { Fill, Stroke, Style },
      } = ol;
      const map = new Map({
        layers: [
          new TileLayer({
            source: new Stamen({
              layer: "toner",
            }),
          }),
          new VectorLayer({
            source: new VectorSource({
              url: this.$withBase("/data/kml/timezones.kml"),
              format: new KML({
                extractStyles: false,
              }),
            }),
            style: function (feature) {
              let offset = 0;
              const name = feature.get("name");
              const match = name.match(/([\-+]\d{2}):(\d{2})$/);
              if (match) {
                const hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);
                offset = 60 * hours + minutes;
              }
              const date = new Date();
              const local = new Date(
                date.getTime() + (date.getTimezoneOffset() + offset) * 60000
              );
              let delta = Math.abs(
                12 - local.getHours() + local.getMinutes() / 60
              );
              if (delta > 12) {
                delta = 24 - delta;
              }
              const opacity = 0.75 * (1 - delta / 12);
              return new Style({
                fill: new Fill({
                  color: [0xff, 0xff, 0x33, opacity],
                }),
                stroke: new Stroke({
                  color: "#ffffff",
                }),
              });
            },
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: [12579156, 3274244],
          zoom: 2,
        }),
      });
      const info = $("#info");
      info.tooltip({
        animation: false,
        trigger: "manual",
      });
      const displayFeatureInfo = function (pixel) {
        info.css({
          left: pixel[0] + "px",
          top: pixel[1] - 15 + "px",
        });
        const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
          return feature;
        });
        if (feature) {
          info.attr("data-original-title", feature.get("name")).tooltip("show");
        } else {
          info.tooltip("hide");
        }
      };
      map.on("pointermove", function (evt) {
        if (evt.dragging) {
          info.tooltip("hide");
          return;
        }
        displayFeatureInfo(map.getEventPixel(evt.originalEvent));
      });
      map.on("click", function (evt) {
        displayFeatureInfo(evt.pixel);
      });
    },
  };
  </script>
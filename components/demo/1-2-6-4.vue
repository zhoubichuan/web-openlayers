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
      format: { GPX },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
    } = ol;

    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    const raster = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        maxZoom: 20,
      }),
    });

    const style = {
      Point: new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: "rgba(255,255,0,0.4)",
          }),
          radius: 5,
          stroke: new Stroke({
            color: "#ff0",
            width: 1,
          }),
        }),
      }),
      LineString: new Style({
        stroke: new Stroke({
          color: "#f00",
          width: 3,
        }),
      }),
      MultiLineString: new Style({
        stroke: new Stroke({
          color: "#0f0",
          width: 3,
        }),
      }),
    };

    const vector = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/gpx/fells_loop.gpx"),
        format: new GPX(),
      }),
      style: function (feature) {
        return style[feature.getGeometry().getType()];
      },
    });

    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [-7916041.528716288, 5228379.045749711],
        zoom: 12,
      }),
    });

    const displayFeatureInfo = function (pixel) {
      const features = [];
      map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
      });
      if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          info.push(features[i].get("desc"));
        }
        document.getElementById("info").innerHTML =
          info.join(", ") || "(unknown)";
        map.getTarget().style.cursor = "pointer";
      } else {
        document.getElementById("info").innerHTML = "&nbsp;";
        map.getTarget().style.cursor = "";
      }
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
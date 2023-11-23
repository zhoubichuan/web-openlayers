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
      format: { KML },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
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
    const vector = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/kml/2012-02-10.kml"),
        format: new KML(),
      }),
    });
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [876970.8463461736, 5859807.853963373],
        projection: "EPSG:3857",
        zoom: 10,
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
          info.push(features[i].get("name"));
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
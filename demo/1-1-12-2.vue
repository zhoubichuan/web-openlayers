<template>
  <div>
    <div ref="map" class="map"></div>
    <div id="info">信息：&nbsp;</div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { DragAndDrop, defaults: defaultInteractions },
      Map,
      View,
      layer: { Tile: TileLayer, VectorImage: VectorImageLayer },
      source: { XYZ, Vector: VectorSource },
      format: { GPX, GeoJSON, IGC, KML, TopoJSON },
    } = ol;
    const dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [GPX, GeoJSON, IGC, KML, TopoJSON],
    });
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const map = new Map({
      interactions: defaultInteractions().extend([dragAndDropInteraction]),
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
              mapkeys.maptiler,
            maxZoom: 20,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    dragAndDropInteraction.on("addfeatures", function (event) {
      const vectorSource = new VectorSource({
        features: event.features,
      });
      map.addLayer(
        new VectorImageLayer({
          source: vectorSource,
        })
      );
      map.getView().fit(vectorSource.getExtent());
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
        document.getElementById("info").innerHTML = info.join(", ") || "&nbsp";
      } else {
        document.getElementById("info").innerHTML = "&nbsp;";
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
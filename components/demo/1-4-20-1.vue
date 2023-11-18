<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      format: {
        GeoJSON,
        WFS,
        filter: { and: andFilter, equalTo: equalToFilter, like: likeFilter },
      },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      style: { Stroke, Style },
      proj: { fromLonLat },
    } = ol;
    const vectorSource = new VectorSource();
    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 255, 1.0)",
          width: 2,
        }),
      }),
    });
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
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [-8908887.277395891, 5381918.072437216],
        maxZoom: 19,
        zoom: 12,
      }),
    });
    const featureRequest = new WFS().writeGetFeature({
      srsName: "EPSG:3857",
      featureNS: "http://openstreemap.org",
      featurePrefix: "osm",
      featureTypes: ["water_areas"],
      outputFormat: "application/json",
      filter: andFilter(
        likeFilter("name", "Mississippi*"),
        equalToFilter("waterway", "riverbank")
      ),
    });
    fetch("https://ahocevar.com/geoserver/wfs", {
      method: "POST",
      body: new XMLSerializer().serializeToString(featureRequest),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        const features = new GeoJSON().readFeatures(json);
        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent());
      });
  },
};
</script>
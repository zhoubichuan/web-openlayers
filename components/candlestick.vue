<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
let {
  Map,
  View,
  Feature,
  style: { Style, Stroke, Fill },
  layer: { Vector: VectorLayer, Tile: TileLayer },
  geom: { Polygon, MultiPolygon },
  source: { XYZ, Vector: VectorSource },
  proj: { fromLonLat },
  control: { OverviewMap, defaults },
} = ol;
import china from "./data/100000_full.json";
import province from "./data/topojson/province.json";
import world from "./data/topojson/world-110m.json";
let target = {
  china,
  province,
  world,
};
export default {
  name: "WebOLChina",
  props: {
    type: {
      type: String,
      defaults: "china",
    },
  },
  data() {
    return {
      layer: "",
      show: true,
    };
  },
  async mounted() {
    let map = new Map({
      target: this.$refs.map,
      controls: defaults({
        zoom: true,
      }).extend([]),
      view: new View({
        center: fromLonLat([108.522097, 37.272848]),
        zoom: 3,
        maxZoom: 19,
        minZoom: 1,
      }),
    });
    let areaLayer = new VectorLayer({
      source: new VectorSource({
        features: [],
      }),
    });
    map.addLayer(areaLayer);
    let areaFeature = null;
    target[this.type].features.forEach((g) => {
      let lineData = g;
      if (lineData.geometry.type == "MultiPolygon") {
        areaFeature = new Feature({
          geometry: new MultiPolygon(lineData.geometry.coordinates).transform(
            "EPSG:4326",
            "EPSG:3857"
          ),
        });
      } else if (lineData.geometry.type == "Polygon") {
        areaFeature = new Feature({
          geometry: new Polygon(lineData.geometry.coordinates).transform(
            "EPSG:4326",
            "EPSG:3857"
          ),
        });
      }
      areaFeature.setStyle(
        new Style({
          fill: new Fill({ color: "#4e98f444" }),
          stroke: new Stroke({
            width: 1,
            color: [71, 137, 227, 1],
          }),
        })
      );
      areaLayer.getSource().addFeatures([areaFeature]);
    });
  },
};
</script>
<style>
.map {
  width: 100%;
  height: 100%;
}
</style>
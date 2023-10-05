<template>
  <div ref="map" class="map" style="position: relative">
    <button
      style="position: absolute; z-index: 100; right: 0"
      @click="handleClick"
    >
      {{ !show ? "显示" : "隐藏" }}底图
    </button>
  </div>
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
export default {
  data() {
    return {
      layer: "",
      show: true,
    };
  },
  async mounted() {
    let { data } = await this.$axios.get(
      this.$withBase("/data/100000_full.json")
    );
    let layer = new TileLayer(
      {
        source: new XYZ({
          url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunityENG/MapServer/tile/{z}/{y}/{x}",
        }),
      },
      { zoomOffset: 1 }
    );
    this.layer = layer;
    let map = new Map({
      target: this.$refs.map,
      controls: defaults({
        zoom: true,
      }).extend([]),
      layers: [layer],
      view: new View({
        center: fromLonLat([108.522097, 37.272848]),
        zoom: 2,
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
    data.features.forEach((g) => {
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
  methods: {
    handleClick() {
      this.show = !this.show;
      this.layer.setVisible(this.show);
    },
  },
};
</script>
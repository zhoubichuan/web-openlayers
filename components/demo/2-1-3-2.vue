<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
let {
  format: { TopoJSON },
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { XYZ, Vector: VectorSource },
  style: { Fill, Stroke, Style },
} = ol;
export default {
  async mounted() {
    let chinaLayer = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/topojson/province.json"),
        format: new TopoJSON(),
      }),
      style: new Style({
        fill: new Fill({
          color: "#eeeeee",
        }),
        stroke: new Stroke({
          color: "#c3c3c4",
          width: 1,
        }),
      }),
    });
    const map = new Map({
      layers: [chinaLayer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
        maxZoom: 19,
        minZoom: 1,
      }),
    });
    function addHighlightLayer(layer) {
      layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: () => {
          const style = new ol.style.Style({
            fill: new ol.style.Fill({
              color: "raba(0,0,0,1)",
            }),
            stroke: new ol.style.Stroke({
              color: "rgba(255, 255, 255, 1)",
              width: 1,
            }),
          });
          return style;
        },
      });
      map.addLayer(layer);
      onBindLayerClick(layer);
      return layer;
    }

    function onBindLayerClick(layer) {
      layer.on("precompose", (evt) => {
        evt.context.shadowBlur = 25;
        evt.context.shadowColor = "black";
      });
      layer.on("postcompose", (evt) => {
        evt.context.shadowBlur = 0;
        evt.context.shadowColor = "black";
      });
    }
    let res = await this.$axios({
      type: "get",
      url: this.$withBase("/data/topojson/province.json"),
    });
    var features = new ol.format.TopoJSON({
      featureProjection: "EPSG:3857",
    }).readFeatures(res.data);
    var f = features[0];
    chinaLayer.getSource().addFeature(f);
    //添加阴影的图层
    var highlightLayer = addHighlightLayer(chinaLayer);

    //新增以下代码
    highlightLayer.setStyle(() => {
      return new ol.style.Style({
        fill: new ol.style.Fill({
          color:
            f.style && f.style.getFill ? f.style.getFill().getColor() : "#aaa",
        }),
        stroke: new ol.style.Stroke({
          color: "rgba(255, 255, 255, 0.2)",
          width: 2,
        }),
      });
    });
    highlightLayer.getSource().addFeature(f);
  },
};
</script>
  ```
  
  <style>
.map-container {
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>
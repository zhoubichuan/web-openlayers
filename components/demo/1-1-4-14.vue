<template>
  <div>
    <div class="mapcontainer">
      <div ref="map" class="map"></div>
      <div class="padding-top"></div>
      <div class="padding-left"></div>
      <div class="padding-right"></div>
      <div class="padding-bottom"></div>
      <div class="center"></div>
    </div>
    <button ref="zoomtoswitzerland">缩放到瑞士</button> 最佳匹配
    <button ref="zoomtolausanne">缩放到洛桑</button> 最小分辨率
    <button ref="centerlausanne">洛桑中心</button>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
    } = ol;
    const source = new VectorSource({
      url: this.$withBase("/data/geojson/switzerland.geojson"),
      format: new GeoJSON(),
    });
    const style = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.6)",
      }),
      stroke: new Stroke({
        color: "#319FD3",
        width: 1,
      }),
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.6)",
        }),
        stroke: new Stroke({
          color: "#319FD3",
          width: 1,
        }),
      }),
    });
    const vectorLayer = new VectorLayer({
      source: source,
      style: style,
    });
    const view = new View({
      center: [12579156, 3274244],
      zoom: 1,
    });
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: this.$refs.map,
      view: view,
    });
    this.$refs.zoomtoswitzerland.addEventListener(
      "click",
      function () {
        const feature = source.getFeatures()[0];
        const polygon = feature.getGeometry();
        view.fit(polygon, { padding: [170, 50, 30, 150] });
      },
      false
    );
    this.$refs.zoomtolausanne.addEventListener(
      "click",
      function () {
        const feature = source.getFeatures()[1];
        const point = feature.getGeometry();
        view.fit(point, { padding: [170, 50, 30, 150], minResolution: 50 });
      },
      false
    );
    this.$refs.centerlausanne.addEventListener(
      "click",
      function () {
        const feature = source.getFeatures()[1];
        const point = feature.getGeometry();
        const size = map.getSize();
        view.centerOn(point.getCoordinates(), size, [570, 500]);
      },
      false
    );
  },
};
</script>
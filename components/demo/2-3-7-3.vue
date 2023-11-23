<template>
  <div>
    <div class="mapcontainer">
      <div ref="map" class="map"></div>
      <div class="padding-top"></div>
      <div class="padding-left"></div>
      <div class="padding-right"></div>
      <div class="padding-bottom"></div>
    </div>
    <button ref="zoomtoswitzerland">移动到瑞士</button>
    <button ref="centerlausanne">瑞士洛桑中心</button>
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
      proj: { fromLonLat },
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
      center: fromLonLat([6.6339863, 46.5193823]),
      padding: [170, 50, 30, 150],
      zoom: 6,
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
    vectorLayer.getSource().on(
      "featuresloadend",
      function () {
        this.$refs.zoomtoswitzerland.addEventListener(
          "click",
          function () {
            const feature = source.getFeatures()[0];
            const polygon = feature.getGeometry();
            view.fit(polygon);
          },
          false
        );
        this.$refs.centerlausanne.addEventListener(
          "click",
          function () {
            const feature = source.getFeatures()[1];
            const point = feature.getGeometry();
            view.setCenter(point.getCoordinates());
          },
          false
        );
      }.bind(this)
    );
  },
};
</script>
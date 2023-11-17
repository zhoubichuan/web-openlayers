<template>
  <div>
    <div ref="map" class="map"></div>
    <div id="info" style="display: none"></div>
    <label for="track">
      轨道位置
      <input id="track" type="checkbox" />
    </label>
    <p>
      位置精度 : <code id="accuracy"></code>&nbsp;&nbsp; 海拔高度 :
      <code id="altitude"></code>&nbsp;&nbsp; 高度精度 :
      <code id="altitudeAccuracy"></code>&nbsp;&nbsp; 标题 :
      <code id="heading"></code>&nbsp;&nbsp; 速度 : <code id="speed"></code>
    </p>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      Geolocation,
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
    } = ol;

    const view = new View({
      center: [12579156, 3274244],
      zoom: 2,
    });
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: view,
    });
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });
    function el(id) {
      return document.getElementById(id);
    }
    el("track").addEventListener("change", function () {
      geolocation.setTracking(this.checked);
    });
    geolocation.on("change", function () {
      el("accuracy").innerText = geolocation.getAccuracy() + " [m]";
      el("altitude").innerText = geolocation.getAltitude() + " [m]";
      el("altitudeAccuracy").innerText =
        geolocation.getAltitudeAccuracy() + " [m]";
      el("heading").innerText = geolocation.getHeading() + " [rad]";
      el("speed").innerText = geolocation.getSpeed() + " [m/s]";
    });
    geolocation.on("error", function (error) {
      const info = document.getElementById("info");
      info.innerHTML = error.message;
      info.style.display = "";
    });
    const accuracyFeature = new Feature();
    geolocation.on("change:accuracyGeometry", function () {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });
    const positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 2,
          }),
        }),
      })
    );
    geolocation.on("change:position", function () {
      const coordinates = geolocation.getPosition();
      positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
    });
    new VectorLayer({
      map: map,
      source: new VectorSource({
        features: [accuracyFeature, positionFeature],
      }),
    });
  },
};
</script>
<template>
  <div class="content">
    <div ref="map" class="map"></div>
    <button ref="btn">轨迹回放</button>
  </div>
</template>
  
  <script>
export default {
  async mounted() {
    // 获取轨迹点
    let res = await this.$axios({
      type: "get",
      url: this.$withBase("/data/1.json"),
    });
    let points = res.data.map((i) =>
      ol.proj.transform(i, "EPSG:4326", "EPSG:3857")
    );
    // 轨迹
    var route = new ol.geom.LineString(points);
    var routeCoords = route.getCoordinates();
    var routeLength = routeCoords.length;

    // 轨迹线要素
    var routeFeature = new ol.Feature({
      type: "route",
      geometry: route,
    });

    // 轨迹点要素
    var geoMarker = new ol.Feature({
      type: "geoMarker",
      geometry: new ol.geom.Point(routeCoords[0]),
    });

    // 创建样式
    var styles = {
      route: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 5,
          color: "blue",
        }),
      }),
      geoMarker: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          snapToPixel: false,
          fill: new ol.style.Fill({
            color: "red",
          }),
        }),
      }),
    };

    var center = points[0];
    var animating = false;
    var speed, now;

    // 创建瓦片图层
    var tileLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
    });

    // 创建要素图层
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [routeFeature, geoMarker],
      }),
      style: function (feature) {
        if (animating && feature.get("type") === "geoMarker") {
          return null;
        }
        return styles[feature.get("type")];
      },
    });

    // 创建地图
    var map = new ol.Map({
      target: this.$refs.map,
      layers: [tileLayer, vectorLayer],
      view: new ol.View({
        center: center,
        zoom: 17,
      }),
    });

    // 监听事件
    var moveFeature = function (event) {
      var vectorContext = event.vectorContext;
      var frameState = event.frameState;
      if (animating) {
        var elapsedTime = frameState.time - now;
        var index = Math.round((speed * elapsedTime) / 1000);
        if (index >= routeLength) {
          stopAnimation(true);
          return;
        }
        var currentPoint = new ol.geom.Point(routeCoords[index]);
        var feature = new ol.Feature(currentPoint);
        vectorContext.drawFeature(feature, styles.geoMarker);
      }
      map.render();
    };

    // 开始动画
    function startAnimation() {
      if (animating) {
        stopAnimation(false);
      } else {
        animating = true;
        now = new Date().getTime();
        speed = 50;
        geoMarker.setStyle(null);
        map.getView().setCenter(center);
        map.on("postcompose", moveFeature);
        map.render();
      }
    }

    // 停止动画
    function stopAnimation(ended) {
      animating = false;
      var coord = ended ? routeCoords[routeLength - 1] : routeCoords[0];
      geoMarker.getGeometry().setCoordinates(coord);
      map.un("postcompose", moveFeature);
    }

    // 轨迹回放
    this.$refs.btn.addEventListener("click", function () {
      startAnimation();
    });
  },
};
</script>
<style>
.content {
  width: 100%;
  height: 100%;
}
.map {
  width: 100%;
  height: 400px;
}
</style>
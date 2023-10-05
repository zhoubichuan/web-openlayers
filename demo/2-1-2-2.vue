<template>
  <div>
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
    let points = res.data;
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

    var center = [13451034.958002912, 3594986.8806004445];
    var animating = false;
    var speed, now;

    // 创建瓦片图层
    var tileLayer = new ol.layer.Tile({
      source: new ol.source.OSM(),
    });

    // 创建轨迹点图层
    var markerLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        image: new ol.style.Circle({
          radius: 20,
          fill: new ol.style.Fill({
            color: "red",
          }),
        }),
      }),
    });

    // 创建轨迹线图层
    var lineLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 5,
          color: "blue",
        }),
      }),
    });
    // 创建地图
    var map = new ol.Map({
      target: this.$refs.map,
      layers: [tileLayer, markerLayer, lineLayer],
      view: new ol.View({
        center: center,
        zoom: 17,
      }),
    });
    // 定时器
    var interval;
    var index = 0;
    var markerFeature;
    // 显示轨迹
    this.$refs.btn.addEventListener("click", function () {
      // 清除定时器
      if (interval != undefined) {
        clearInterval(interval);
      }

      // 清空要素图层
      markerLayer.getSource().clear();
      lineLayer.getSource().clear();
      index = 0;

      // 绘制轨迹线
      if (points.length > 1) {
        var lineFeature = new ol.Feature({
          geometry: new ol.geom.LineString(points),
        });
        lineLayer.getSource().addFeature(lineFeature);
      }

      // 创建定时器
      interval = setInterval(function () {
        if (index < points.length) {
          // 清除已有轨迹点
          markerLayer.getSource().clear();

          // 添加轨迹点
          var currentPoint = points[index];
          markerFeature = new ol.Feature({
            geometry: new ol.geom.Point(currentPoint),
          });
          markerLayer.getSource().addFeature(markerFeature);

          // 索引+1
          index++;
        } else {
          clearInterval(interval);
          index = 0;
        }
      }, 10);
    });
  },
};
</script>
<style>
.map {
  width: 100%;
  height: 400px;
}
</style>
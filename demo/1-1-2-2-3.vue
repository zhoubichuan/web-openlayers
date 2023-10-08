<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ },
      proj: { fromLonLat },
    } = ol;
    const key = "get_your_own_D6rA4zTHduk6KOKTXzGB";
    const attributions = "";
    const map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url: "http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=5a257cd2df1b3311723bd77b0de14baf",
            tileSize: 512,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([112.91, 28.21], "EPSG:4326", "EPSG:3857"),
        zoom: 5,
      }),
    });
    map.on("loadstart", function () {
      map.getTargetElement().classList.add("spinner");
    });
    map.on("loadend", function () {
      map.getTargetElement().classList.remove("spinner");
    });
    var source = new ol.source.Vector({
      wrapX: false,
    });
    map.addLayer(
      new ol.layer.Vector({
        source: source,
      })
    );

    function addRandomFeature() {
      var geom = new ol.geom.Point(ol.proj.fromLonLat([112.91, 28.21]));
      var feature = new ol.Feature(geom);
      source.addFeature(feature);
    }

    var duration = 1000;

    function flash(feature) {
      var start = new Date().getTime();
      //进行地图水波渲染
      var listenerKey = map.on("postcompose", animate);

      function animate(event) {
        //获取几何图形
        var vectorContext = event.vectorContext;
        //获取当前渲染帧状态
        var frameState = event.frameState;
        //添加一个OpenLayers.Geometry几何对象
        var flashGeom = feature.getGeometry().clone();
        //渲染帧状已占时间
        var elapsed = frameState.time - start;
        //已占比率
        var elapsedRatio = elapsed / duration;
        // radius半径为5结束为30
        var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
        //不透渐变消失
        var opacity = ol.easing.easeOut(1 - elapsedRatio);
        //Circle样式
        var style = new ol.style.Style({
          image: new ol.style.Circle({
            radius: radius,
            stroke: new ol.style.Stroke({
              color: "rgba(255, 0, 0, " + opacity + ")",
              width: 1 + opacity,
            }),
          }),
        });
        //给几何图形添加样式
        vectorContext.setStyle(style);
        //将几何体渲染到画布中
        vectorContext.drawGeometry(flashGeom);
        if (elapsed > duration) {
          start = frameState.time;
        }
        //请求地图渲染（在下一个动画帧处）
        map.render();
      }
    }
    //数据源添加图层
    source.on("addfeature", function (e) {
      flash(e.feature);
    });

    addRandomFeature();
  },
};
</script>
<template>
  <div>
    <div ref="map" class="map"></div>
    <label for="speed">
      speed:&nbsp;
      <input id="speed" type="range" min="10" max="999" step="10" value="60" />
    </label>
    <button id="start-animation">开始</button>
  </div>
</template>

<script>
export default {
  async mounted() {
    let {
      Feature,
      geom: { Point },
      format: { Polyline },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Icon, Stroke, Style },
      render: { getVectorContext },
    } = ol;

    const map = new Map({
      target: this.$refs.map,
      view: new View({
        center: [-5639523.95, -3501274.52],
        zoom: 10,
        minZoom: 2,
        maxZoom: 19,
      }),
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: "",
            url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunityENG/MapServer/tile/{z}/{y}/{x}",
            tileSize: 512,
          }),
        }),
      ],
    });
    let res = await this.$axios.get(
      this.$withBase("/data/polyline/route.json")
    );
    const polyline = res.data.routes[0].geometry;
    const route = new Polyline({
      factor: 1e6,
    }).readGeometry(polyline, {
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857",
    });

    const routeFeature = new Feature({
      type: "route",
      geometry: route,
    });
    const startMarker = new Feature({
      type: "icon",
      geometry: new Point(route.getFirstCoordinate()),
    });
    const endMarker = new Feature({
      type: "icon",
      geometry: new Point(route.getLastCoordinate()),
    });
    const position = startMarker.getGeometry().clone();
    const geoMarker = new Feature({
      type: "geoMarker",
      geometry: position,
    });

    const styles = {
      route: new Style({
        stroke: new Stroke({
          width: 6,
          color: [237, 212, 0, 0.8],
        }),
      }),
      icon: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: this.$withBase("/data/icon.png"),
        }),
      }),
      geoMarker: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: "black" }),
          stroke: new Stroke({
            color: "white",
            width: 2,
          }),
        }),
      }),
    };

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [routeFeature, geoMarker, startMarker, endMarker],
      }),
      style: function (feature) {
        return styles[feature.get("type")];
      },
    });

    map.addLayer(vectorLayer);

    const speedInput = document.getElementById("speed");
    const startButton = document.getElementById("start-animation");
    let animating = false;
    let distance = 0;
    let lastTime;

    function moveFeature(event) {
      const speed = Number(speedInput.value);
      const time = event.frameState.time;
      const elapsedTime = time - lastTime;
      distance = (distance + (speed * elapsedTime) / 1e6) % 2;
      lastTime = time;

      const currentCoordinate = route.getCoordinateAt(
        distance > 1 ? 2 - distance : distance
      );
      position.setCoordinates(currentCoordinate);
      const vectorContext = getVectorContext(event);
      vectorContext.setStyle(styles.geoMarker);
      vectorContext.drawGeometry(position);
      map.render();
    }

    function startAnimation() {
      animating = true;
      lastTime = Date.now();
      startButton.textContent = "停止动画";
      vectorLayer.on("postrender", moveFeature);
      geoMarker.setGeometry(null);
    }

    function stopAnimation() {
      animating = false;
      startButton.textContent = "开始动画";
      geoMarker.setGeometry(position);
      vectorLayer.un("postrender", moveFeature);
    }

    startButton.addEventListener("click", function () {
      if (animating) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });
  },
};
</script>
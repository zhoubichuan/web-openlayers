<template>
  <div>
    <div ref="map" class="map">
      <div ref="popup"></div>
    </div>
    <div ref="info"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      geom: { Point },
      Feature,
      Map,
      Overlay,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { Vector: VectorSource },
      style: { Circle, Fill, Style },
      proj: { useGeographic, fromLonLat },
    } = ol;
    const place = [108.522097, 37.272848];
    const point = new Point(place);
    const map = new Map({
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([108.522097, 37.272848]),
        zoom: 4,
        multiWorld: false,
      }),
      layers: [
        new VectorLayer({
          source: new VectorSource({
            url: "/data/100000_full.json",
            format: new GeoJSON(),
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [new Feature(point)],
          }),
          style: new Style({
            image: new Circle({
              radius: 9,
              fill: new Fill({ color: "red" }),
            }),
          }),
        }),
      ],
    });
    const element = this.$refs.popup;
    const popup = new Overlay({
      element: element,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });
    map.addOverlay(popup);
    function formatCoordinate(coordinate) {
      return `
        <table>
          <tbody>
            <tr><th>lon</th><td>${coordinate[0].toFixed(2)}</td></tr>
            <tr><th>lat</th><td>${coordinate[1].toFixed(2)}</td></tr>
          </tbody>
        </table>
      `;
    }
    const info = this.$refs.info;
    map.on("moveend", function () {
      const view = map.getView();
      const center = view.getCenter();
      info.innerHTML = formatCoordinate(center);
    });
    map.on("click", function (event) {
      const feature = map.getFeaturesAtPixel(event.pixel)[0];
      if (feature) {
        const coordinate = feature.getGeometry().getCoordinates();
        popup.setPosition([
          coordinate[0] + Math.round(event.coordinate[0] / 360) * 360,
          coordinate[1],
        ]);
        info.innerHTML = formatCoordinate(coordinate);
      }
    });
    map.on("pointermove", function (event) {
      if (map.hasFeatureAtPixel(event.pixel)) {
        map.getViewport().style.cursor = "pointer";
      } else {
        map.getViewport().style.cursor = "inherit";
      }
    });
  },
};
</script>
<template>
  <div>
    <div ref="map" class="map"></div>
    <label><input type="checkbox" ref="rotateWithView" /> 旋转视图</label>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      control: { OverviewMap, defaults: defaultControls },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      interaction: { DragRotateAndZoom, defaults: defaultInteractions },
    } = ol;
    const overviewMapControl = new OverviewMap({
      className: "ol-overviewmap ol-custom-overviewmap",
      layers: [
        new TileLayer({
          source: new OSM({
            url:
              "https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png" +
              "?apikey=Your API key from https://www.thunderforest.com/docs/apikeys/ here",
          }),
        }),
      ],
      collapseLabel: "\u00BB",
      label: "\u00AB",
      collapsed: false,
    });
    this.$refs.rotateWithView.addEventListener("change", function () {
      overviewMapControl.setRotateWithView(this.checked);
    });
    const map = new Map({
      controls: defaultControls().extend([overviewMapControl]),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [500000, 6000000],
        zoom: 7,
      }),
    });
  },
};
</script>
<style>
.map {
  width: 100%;
  height: 400px;
}
.map .ol-custom-overviewmap,
.map .ol-custom-overviewmap.ol-uncollapsible {
  bottom: auto;
  left: auto;
  right: 0;
  top: 0;
}
.map .ol-custom-overviewmap:not(.ol-collapsed) {
  border: 1px solid black;
}
.map .ol-custom-overviewmap .ol-overviewmap-map {
  border: none;
  width: 300px;
}
.map .ol-custom-overviewmap .ol-overviewmap-box {
  border: 2px solid red;
}
.map .ol-custom-overviewmap:not(.ol-collapsed) button {
  bottom: auto;
  left: auto;
  right: 1px;
  top: 1px;
}
.map .ol-rotate {
  top: 170px;
  right: 0;
}
</style>
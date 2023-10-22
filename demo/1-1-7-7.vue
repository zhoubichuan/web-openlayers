<template>
  <div>
    <h4>默认样式</h4>
    <div id="map1" class="map"></div>
    <h4>放大缩小按钮之间</h4>
    <div id="map2" class="map"></div>
    <h4>水平方向</h4>
    <div id="map3" class="map"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      control: { ZoomSlider },
    } = ol;
    function createMap(divId) {
      const source = new OSM();
      const layer = new TileLayer({
        source: source,
      });
      const map = new Map({
        layers: [layer],
        target: divId,
        view: new View({
          center: [12579156, 3274244],
          zoom: 12,
        }),
      });
      const zoomslider = new ZoomSlider();
      map.addControl(zoomslider);
      return map;
    }

    const map1 = createMap("map1");
    const map2 = createMap("map2");
    const map3 = createMap("map3");
  },
};
</script>
<style>
.map {
  width: 100%;
  height: 400px;
}
#map2 .ol-zoom .ol-zoom-out {
  margin-top: 200px;
}
#map2 .ol-zoomslider {
  background-color: transparent;
  top: calc(0.5em + 2px + 1px + 1.14 * 1.375em);
}
#map2 .ol-touch .ol-zoom .ol-zoom-out {
  margin-top: 212px;
}
#map2 .ol-touch .ol-zoomslider {
  top: 2.75em;
}
#map2 .ol-zoom-in.ol-has-tooltip:hover [role="tooltip"],
#map2 .ol-zoom-in.ol-has-tooltip:focus [role="tooltip"] {
  top: 3px;
}
#map2 .ol-zoom-out.ol-has-tooltip:hover [role="tooltip"],
#map2 .ol-zoom-out.ol-has-tooltip:focus [role="tooltip"] {
  top: 232px;
}
#map3 .ol-zoomslider {
  top: 8px;
  left: auto;
  right: 8px;
  background-color: rgba(255, 69, 0, 0.2);
  width: 200px;
  height: 15px;
  padding: 0;
  box-shadow: 0 0 5px rgb(255, 69, 0);
  border-radius: 7.5px;
}
#map3 .ol-zoomslider:hover {
  background-color: rgba(255, 69, 0, 0.3);
}
#map3 .ol-zoomslider-thumb {
  height: 15px;
  width: 15px;
  margin: 0;
  filter: none;
  background-color: rgba(255, 69, 0, 0.6);
  border-radius: 7.5px;
}
#map3 a.ol-zoomslider-handle:hover {
  background-color: rgba(255, 69, 0, 0.7);
}
</style>
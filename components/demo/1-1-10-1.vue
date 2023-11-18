<template>
  <div>
    <div ref="map" class="map"></div>
    <div style="display: none">
      <a
        class="overlay"
        id="vienna"
        target="_blank"
        href="https://en.wikipedia.org/wiki/Vienna"
        >Vienna</a
      >
      <div id="marker" title="Marker"></div>
      <div id="popup" title="Welcome to OpenLayers"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Overlay,
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      style: Style,
      proj: { fromLonLat, toLonLat },
      coordinate: { toStringHDMS },
    } = ol;
    const layer = new TileLayer({
      source: new OSM(),
    });
    const map = new Map({
      layers: [layer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    const pos = fromLonLat([16.3725, 48.208889]);
    const popup = new Overlay({
      element: document.getElementById("popup"),
    });
    map.addOverlay(popup);
    const marker = new Overlay({
      position: pos,
      positioning: "center-center",
      element: document.getElementById("marker"),
      stopEvent: false,
    });
    map.addOverlay(marker);
    const vienna = new Overlay({
      position: pos,
      element: document.getElementById("vienna"),
    });
    map.addOverlay(vienna);
    map.on("click", function (evt) {
      const element = popup.getElement();
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      $(element).popover("dispose");
      popup.setPosition(coordinate);
      $(element).popover({
        container: element,
        placement: "top",
        animation: false,
        html: true,
        content:
          "<p>The location you clicked was:</p><code>" + hdms + "</code>",
      });
      $(element).popover("show");
    });
  },
};
</script>
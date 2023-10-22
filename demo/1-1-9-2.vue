<template>
  <div>
    <div ref="map" class="map"></div>
    <div ref="popup" class="ol-popup">
      <a href="#" ref="popupcloser" class="ol-popup-closer"></a>
      <div ref="popupcontent"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Overlay,
      coordinate: { toStringHDMS },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ },
      proj: { toLonLat },
    } = ol;
    const container = this.$refs.popup;
    const content = this.$refs.popupcontent;
    const closer = this.$refs.popupcloser;
    const overlay = new Overlay({
      element: container,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    closer.onclick = function () {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    };
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
              mapkeys.maptiler,
            tileSize: 512,
          }),
        }),
      ],
      overlays: [overlay],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    map.on("singleclick", function (evt) {
      const coordinate = evt.coordinate;
      const hdms = toStringHDMS(toLonLat(coordinate));
      content.innerHTML = "<p>点击位置</p><code>" + hdms + "</code>";
      overlay.setPosition(coordinate);
    });
  },
};
</script>
<style>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>
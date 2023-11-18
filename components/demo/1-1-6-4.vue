<template>
  <div>
    <div ref="map" class="map"></div>
    <label>
      图层透明度
      <input
        ref="opacityinput"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value="1"
      />
      <span ref="opacityoutput"></span>
    </label>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { XYZ, OSM },
      style: Style,
      proj: { fromLonLat },
    } = ol;

    const imagery = new TileLayer({
      className: "ol-layer-imagery",
      source: new XYZ({
        attributions:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ',
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        maxZoom: 20,
        crossOrigin: "",
      }),
    });
    const osm = new TileLayer({
      source: new OSM(),
    });
    const map = new Map({
      layers: [imagery, osm],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    const opacityInput = this.$refs.opacityinput;
    const opacityOutput = this.$refs.opacityoutput;
    function update() {
      const opacity = parseFloat(opacityInput.value);
      osm.setOpacity(opacity);
      opacityOutput.innerText = opacity.toFixed(2);
    }
    opacityInput.addEventListener("input", update);
    opacityInput.addEventListener("change", update);
    update();
  },
};
</script>
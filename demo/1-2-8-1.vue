<template>
  <div>
    <div ref="map" class="map"></div>
    <input id="swipe" type="range" style="width: 100%" />
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ, OSM },
      style: Style,
      render: { getRenderPixel },
    } = ol;

    const osm = new TileLayer({
      source: new OSM({ wrapX: true }),
    });
    const imagery = new TileLayer({
      source: new XYZ({
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        attributions:
          '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 20,
      }),
    });
    const map = new Map({
      layers: [osm, imagery],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    const swipe = document.getElementById("swipe");
    imagery.on("prerender", function (event) {
      const gl = event.context;
      gl.enable(gl.SCISSOR_TEST);
      const mapSize = map.getSize();
      const bottomLeft = getRenderPixel(event, [0, mapSize[1]]);
      const topRight = getRenderPixel(event, [mapSize[0], 0]);

      const width = Math.round(
        (topRight[0] - bottomLeft[0]) * (swipe.value / 100)
      );
      const height = topRight[1] - bottomLeft[1];
      gl.scissor(bottomLeft[0], bottomLeft[1], width, height);
    });
    imagery.on("postrender", function (event) {
      const gl = event.context;
      gl.disable(gl.SCISSOR_TEST);
    });
    const listener = function () {
      map.render();
    };
    swipe.addEventListener("input", listener);
    swipe.addEventListener("change", listener);
  },
};
</script>
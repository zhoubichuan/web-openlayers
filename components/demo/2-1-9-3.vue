<template>
  <div>
    <div ref="map" class="map"></div>
    <label>
      Sea level
      <input ref="level" type="range" min="0" max="100" value="1" />
      +<span ref="output"></span> m
    </label>
    <br />
    Go to
    <a class="location" data-center="-122.3267,37.8377" data-zoom="11">旧金山</a
    >,
    <a class="location" data-center="-73.9338,40.6861" data-zoom="11">纽约</a>,
    <a class="location" data-center="72.9481,18.9929" data-zoom="11">孟买</a>,
    or
    <a class="location" data-center="120.831,31.160" data-zoom="9">上海</a>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { XYZ },
      proj: { fromLonLat },
    } = ol;

    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const elevation = [
      "+",
      -10000,
      [
        "*",
        0.1 * 255,
        [
          "+",
          ["*", 256 * 256, ["band", 1]],
          ["+", ["*", 256, ["band", 2]], ["band", 3]],
        ],
      ],
    ];
    const layer = new TileLayer({
      opacity: 0.6,
      source: new XYZ({
        url:
          "https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=" +
          mapkeys.maptiler,
        tileSize: 512,
        maxZoom: 12,
      }),
      style: {
        variables: {
          level: 0,
        },
        color: [
          "case",
          ["<=", elevation, ["var", "level"]],
          [139, 212, 255, 1],
          [139, 212, 255, 0],
        ],
      },
    });
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new XYZ({
            url:
              "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
              mapkeys.maptiler,
            attributions: attributions,
            tileSize: 512,
            maxZoom: 22,
          }),
        }),
        layer,
      ],
      view: new View({
        center: fromLonLat([-122.3267, 37.8377]),
        zoom: 11,
      }),
    });
    const control = this.$refs.level;
    const output = this.$refs.output;
    const listener = function () {
      output.innerText = control.value;
      layer.updateStyleVariables({ level: parseFloat(control.value) });
    };
    control.addEventListener("input", listener);
    control.addEventListener("change", listener);
    output.innerText = control.value;
    const locations = document.getElementsByClassName("location");
    for (let i = 0, ii = locations.length; i < ii; ++i) {
      locations[i].addEventListener("click", relocate);
    }
    function relocate(event) {
      const data = event.target.dataset;
      const view = map.getView();
      view.setCenter(fromLonLat(data.center.split(",").map(Number)));
      view.setZoom(Number(data.zoom));
    }
  },
};
</script>
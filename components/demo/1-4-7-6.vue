<template>
  <div>
    <div ref="map" class="map"></div>
    <table class="controls">
      <tr>
        <td><label for="vert">vertical exaggeration:</label></td>
        <td><input ref="vert" type="range" min="1" max="5" value="1" /></td>
        <td><span ref="vertOut"></span> x</td>
      </tr>
      <tr>
        <td><label for="sunEl">sun elevation:</label></td>
        <td><input ref="sunEl" type="range" min="0" max="90" value="45" /></td>
        <td><span ref="sunElOut"></span> °</td>
      </tr>
      <tr>
        <td><label for="sunAz">sun azimuth:</label></td>
        <td><input ref="sunAz" type="range" min="0" max="360" value="45" /></td>
        <td><span ref="sunAzOut"></span> °</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { WebGLTile: TileLayer },
      source: { OSM, XYZ },
    } = ol;
    const variables = {};

    function elevation(xOffset, yOffset) {
      return [
        "+",
        ["*", 256, ["band", 1, xOffset, yOffset]],
        [
          "+",
          ["*", 2 * 256, ["band", 2, xOffset, yOffset]],
          ["*", 3 * 256, ["band", 3, xOffset, yOffset]],
        ],
      ];
    }
    const dp = ["*", 2, ["resolution"]];
    const z0x = ["*", ["var", "vert"], elevation(-1, 0)];
    const z1x = ["*", ["var", "vert"], elevation(1, 0)];
    const dzdx = ["/", ["-", z1x, z0x], dp];
    const z0y = ["*", ["var", "vert"], elevation(0, -1)];
    const z1y = ["*", ["var", "vert"], elevation(0, 1)];
    const dzdy = ["/", ["-", z1y, z0y], dp];
    const slope = ["atan", ["^", ["+", ["^", dzdx, 2], ["^", dzdy, 2]], 0.5]];
    const aspect = ["clamp", ["atan", ["-", 0, dzdx], dzdy], -Math.PI, Math.PI];
    const sunEl = ["*", Math.PI / 180, ["var", "sunEl"]];
    const sunAz = ["*", Math.PI / 180, ["var", "sunAz"]];
    const cosIncidence = [
      "+",
      ["*", ["sin", sunEl], ["cos", slope]],
      [
        "*",
        ["*", ["cos", sunEl], ["sin", slope]],
        ["cos", ["-", sunAz, aspect]],
      ],
    ];
    const scaled = ["*", 255, cosIncidence];
    const shadedRelief = new TileLayer({
      opacity: 0.3,
      source: new XYZ({
        url: "https://{a-d}.tiles.mapbox.com/v3/aj.sf-dem/{z}/{x}/{y}.png",
      }),
      style: {
        variables: variables,
        color: ["color", scaled, scaled, scaled],
      },
    });
    const controlIds = ["vert", "sunEl", "sunAz"];
    controlIds.forEach(
      function (id) {
        const control = this.$refs[id];
        const output = this.$refs[id + "Out"];
        function updateValues() {
          output.innerText = control.value;
          variables[id] = Number(control.value);
        }
        updateValues();
        const listener = function () {
          updateValues();
          shadedRelief.updateStyleVariables(variables);
        };
        control.addEventListener("input", listener);
        control.addEventListener("change", listener);
      }.bind(this)
    );
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        shadedRelief,
      ],
      view: new View({
        extent: [-13675026, 4439648, -13580856, 4580292],
        center: [-13615645, 4497969],
        minZoom: 10,
        maxZoom: 16,
        zoom: 13,
      }),
    });
  },
};
</script>
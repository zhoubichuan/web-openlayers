<template>
  <div>
    <div ref="map" class="map"></div>
    <table>
      <tbody>
        <tr>
          <td>最小植被覆盖指数</td>
          <td>
            <input
              type="range"
              id="min-value-input"
              min="-1.0"
              max="-0.1"
              step="0.01"
            />
          </td>
          <td class="data" id="min-value-output"></td>
          <td><input type="color" id="min-color" /></td>
        </tr>
        <tr>
          <td>最大植被覆盖指数</td>
          <td>
            <input
              type="range"
              id="max-value-input"
              min="0.1"
              max="1.0"
              step="0.01"
            />
          </td>
          <td class="data" id="max-value-output"></td>
          <td><input type="color" id="max-color" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      layer: { WebGLTile: TileLayer },
      source: { GeoTIFF },
    } = ol;
    const segments = 10;
    const defaultMinColor = "#0300AD";
    const defaultMaxColor = "#00ff00";
    const defaultMinValue = -0.5;
    const defaultMaxValue = 0.7;
    const minColorInput = document.getElementById("min-color");
    minColorInput.value = defaultMinColor;
    const maxColorInput = document.getElementById("max-color");
    maxColorInput.value = defaultMaxColor;
    const minValueOutput = document.getElementById("min-value-output");
    const minValueInput = document.getElementById("min-value-input");
    minValueInput.value = defaultMinValue.toString();
    const maxValueOutput = document.getElementById("max-value-output");
    const maxValueInput = document.getElementById("max-value-input");
    maxValueInput.value = defaultMaxValue.toString();
    function getVariables() {
      const variables = {};
      const minColor = minColorInput.value;
      const maxColor = maxColorInput.value;
      const scale = chroma.scale([minColor, maxColor]).mode("lab");
      const minValue = parseFloat(minValueInput.value);
      const maxValue = parseFloat(maxValueInput.value);
      const delta = (maxValue - minValue) / segments;
      for (let i = 0; i <= segments; ++i) {
        const color = scale(i / segments).rgb();
        const value = minValue + i * delta;
        variables[`value${i}`] = value;
        variables[`red${i}`] = color[0];
        variables[`green${i}`] = color[1];
        variables[`blue${i}`] = color[2];
      }
      return variables;
    }
    function colors() {
      const stops = [];
      for (let i = 0; i <= segments; ++i) {
        stops[i * 2] = ["var", `value${i}`];
        const red = ["var", `red${i}`];
        const green = ["var", `green${i}`];
        const blue = ["var", `blue${i}`];
        stops[i * 2 + 1] = ["color", red, green, blue];
      }
      return stops;
    }
    const ndvi = [
      "/",
      ["-", ["band", 2], ["band", 1]],
      ["+", ["band", 2], ["band", 1]],
    ];
    const source = new GeoTIFF({
      sources: [
        {
          url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/2020/S2A_36QWD_20200701_0_L2A/B04.tif",
          max: 10000,
        },
        {
          url: "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/2020/S2A_36QWD_20200701_0_L2A/B08.tif",
          max: 10000,
        },
      ],
    });
    const layer = new TileLayer({
      style: {
        variables: getVariables(),
        color: ["interpolate", ["linear"], ndvi, ...colors()],
      },
      source: source,
    });
    function update() {
      layer.updateStyleVariables(getVariables());
      minValueOutput.innerText = parseFloat(minValueInput.value).toFixed(1);
      maxValueOutput.innerText = parseFloat(maxValueInput.value).toFixed(1);
    }
    minColorInput.addEventListener("input", update);
    maxColorInput.addEventListener("input", update);
    minValueInput.addEventListener("input", update);
    maxValueInput.addEventListener("input", update);
    update();
    const map = new Map({
      target: this.$refs.map,
      layers: [layer],
      view: source.getView(),
    });
  },
};
</script>
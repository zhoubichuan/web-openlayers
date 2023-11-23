<template>
  <div>
    <div ref="map" class="map"></div>
    <div class="controls">
      <label for="red">Red channel</label>
      <select id="red">
        <option value="1" selected>visible red</option>
        <option value="2">visible green</option>
        <option value="3">visible blue</option>
        <option value="4">near infrared</option>
      </select>
      <label
        >max
        <input type="range" id="redMax" value="3000" min="2000" max="5000" />
      </label>
      <label for="green">Green channel</label>
      <select id="green">
        <option value="1">visible red</option>
        <option value="2" selected>visible green</option>
        <option value="3">visible blue</option>
        <option value="4">near infrared</option>
      </select>
      <label
        >max
        <input type="range" id="greenMax" value="3000" min="2000" max="5000" />
      </label>
      <label for="blue">Blue channel</label>
      <select id="blue">
        <option value="1">visible red</option>
        <option value="2">visible green</option>
        <option value="3" selected>visible blue</option>
        <option value="4">near infrared</option>
      </select>
      <label
        >max
        <input type="range" id="blueMax" value="3000" min="2000" max="5000" />
      </label>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { GeoTIFF },
    } = ol;
    const channels = ["red", "green", "blue"];
    for (const channel of channels) {
      const selector = document.getElementById(channel);
      selector.addEventListener("change", update);

      const input = document.getElementById(`${channel}Max`);
      input.addEventListener("input", update);
    }
    function getVariables() {
      const variables = {};
      for (const channel of channels) {
        const selector = document.getElementById(channel);
        variables[channel] = parseInt(selector.value, 10);

        const inputId = `${channel}Max`;
        const input = document.getElementById(inputId);
        variables[inputId] = parseInt(input.value, 10);
      }
      return variables;
    }
    const layer = new TileLayer({
      style: {
        variables: getVariables(),
        color: [
          "array",
          ["/", ["band", ["var", "red"]], ["var", "redMax"]],
          ["/", ["band", ["var", "green"]], ["var", "greenMax"]],
          ["/", ["band", ["var", "blue"]], ["var", "blueMax"]],
          1,
        ],
      },
      source: new GeoTIFF({
        normalize: false,
        sources: [
          {
            url: "https://s2downloads.eox.at/demo/EOxCloudless/2020/rgbnir/s2cloudless2020-16bits_sinlge-file_z0-4.tif",
          },
        ],
      }),
    });
    function update() {
      layer.updateStyleVariables(getVariables());
    }
    const map = new Map({
      target: this.$refs.map,
      layers: [layer],
      view: new View({
        projection: "EPSG:4326",
        center: [12579156, 3274244],
        zoom: 2,
        maxZoom: 6,
      }),
    });
  },
};
</script>
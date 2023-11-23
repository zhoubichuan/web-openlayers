<template>
  <div>
    <div ref="map" class="map"></div>
    <div id="controls">
      <label>
        <input id="exposure" type="range" min="-0.5" max="0.5" step="0.01" />
        <br />exposure <span id="exposure-value"></span>
      </label>
      <label>
        <input id="contrast" type="range" min="-0.5" max="0.5" step="0.01" />
        <br />contrast <span id="contrast-value"></span>
      </label>
      <label>
        <input id="saturation" type="range" min="-0.5" max="0.5" step="0.01" />
        <br />saturation <span id="saturation-value"></span>
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
      layer: { WebGLTile: TileLayer },
      source: { XYZ },
    } = ol;
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    const variables = {
      exposure: 0,
      contrast: 0,
      saturation: 0,
    };

    const layer = new TileLayer({
      style: {
        exposure: ["var", "exposure"],
        contrast: ["var", "contrast"],
        saturation: ["var", "saturation"],
        variables: variables,
      },
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        maxZoom: 20,
      }),
    });

    const map = new Map({
      target: this.$refs.map,
      layers: [layer],
      view: new View({
        center: [12579156, 3274244],
        zoom: 0,
      }),
    });

    let variable;
    for (variable in variables) {
      const name = variable;
      const element = document.getElementById(name);
      const value = variables[name];
      element.value = value.toString();
      document.getElementById(name + "-value").innerText = value.toFixed(2);
      const listener = function (event) {
        const value = parseFloat(event.target.value);
        document.getElementById(name + "-value").innerText = value.toFixed(2);
        const updates = {};
        updates[name] = value;
        layer.updateStyleVariables(updates);
      };
      element.addEventListener("input", listener);
      element.addEventListener("change", listener);
    }
  },
};
</script>
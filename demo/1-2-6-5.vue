<template>
  <div>
    <div ref="map" class="map"></div>
    <select id="layer-select">
      <option value="normal.day" selected>Normal Day</option>
      <option value="normal.day.transit">Normal Day Transit</option>
      <option value="pedestrian.day">Pedestrian Day</option>
      <option value="terrain.day">Terrain Day</option>
      <option value="satellite.day">Satellite Day</option>
      <option value="hybrid.day">Hybrid Day</option>
    </select>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ },
    } = ol;
    const apiKey = "Your HERE Maps API key from https://developer.here.com/";
    const hereLayers = [
      {
        base: "base",
        type: "maptile",
        scheme: "normal.day",
        apiKey: apiKey,
      },
      {
        base: "base",
        type: "maptile",
        scheme: "normal.day.transit",
        apiKey: apiKey,
      },
      {
        base: "base",
        type: "maptile",
        scheme: "pedestrian.day",
        apiKey: apiKey,
      },
      {
        base: "aerial",
        type: "maptile",
        scheme: "terrain.day",
        apiKey: apiKey,
      },
      {
        base: "aerial",
        type: "maptile",
        scheme: "satellite.day",
        apiKey: apiKey,
      },
      {
        base: "aerial",
        type: "maptile",
        scheme: "hybrid.day",
        apiKey: apiKey,
      },
    ];
    const urlTpl =
      "https://{1-4}.{base}.maps.ls.hereapi.com" +
      "/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png" +
      "?apiKey={apiKey}";
    const layers = [];
    let i, ii;
    for (i = 0, ii = hereLayers.length; i < ii; ++i) {
      const layerDesc = hereLayers[i];
      layers.push(
        new TileLayer({
          visible: false,
          preload: Infinity,
          source: new XYZ({
            url: createUrl(urlTpl, layerDesc),
            attributions:
              "Map Tiles &copy; " +
              new Date().getFullYear() +
              " " +
              '<a href="https://developer.here.com/" target="_blank">HERE</a>',
          }),
        })
      );
    }

    const map = new Map({
      layers: layers,
      target: this.$refs.map,
      view: new View({
        center: [921371.9389, 6358337.7609],
        zoom: 10,
      }),
    });

    function createUrl(tpl, layerDesc) {
      return tpl
        .replace("{base}", layerDesc.base)
        .replace("{type}", layerDesc.type)
        .replace("{scheme}", layerDesc.scheme)
        .replace("{apiKey}", layerDesc.apiKey);
    }

    const select = document.getElementById("layer-select");
    function onChange() {
      const scheme = select.value;
      for (let i = 0, ii = layers.length; i < ii; ++i) {
        layers[i].setVisible(hereLayers[i].scheme === scheme);
      }
    }
    select.addEventListener("change", onChange);
    onChange();
  },
};
</script>
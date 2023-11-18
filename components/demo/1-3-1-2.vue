<template>
  <div>
    <div ref="map" class="map"></div>
    <select ref="layerselect">
      <option value="Aerial">鸟瞰图</option>
      <option value="AerialWithLabelsOnDemand" selected>带标签的鸟瞰图</option>
      <option value="RoadOnDemand">道路</option>
      <option value="CanvasDark">暗色道路</option>
      <option value="OrdnanceSurvey">测量图</option>
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
      source: { BingMaps },
    } = ol;
    const styles = [
      "RoadOnDemand",
      "Aerial",
      "AerialWithLabelsOnDemand",
      "CanvasDark",
      "OrdnanceSurvey",
    ];
    const layers = [];
    let i, ii;
    for (i = 0, ii = styles.length; i < ii; ++i) {
      layers.push(
        new TileLayer({
          visible: false,
          preload: Infinity,
          source: new BingMaps({
            key: mapkeys.BingMaps,
            imagerySet: styles[i],
          }),
        })
      );
    }
    const map = new Map({
      layers: layers,
      target: this.$refs.map,
      view: new View({
        center: [-6655.5402445057125, 6709968.258934638],
        zoom: 13,
      }),
    });
    const select = this.$refs.layerselect;
    function onChange() {
      const style = select.value;
      for (let i = 0, ii = layers.length; i < ii; ++i) {
        layers[i].setVisible(styles[i] === style);
      }
    }
    select.addEventListener("change", onChange);
    onChange();
  },
};
</script>
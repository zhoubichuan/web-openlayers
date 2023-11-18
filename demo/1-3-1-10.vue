<template>
  <div>
    <div ref="map" class="map"></div>
    <div class="controls">
      <select ref="zoomifyProtocol">
        <option value="zoomify">Zoomify</option>
        <option value="zoomifyretina">Zoomify Retina</option>
      </select>
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
      source: { Zoomify },
    } = ol;
    const imgWidth = 4000;
    const imgHeight = 3000;
    const zoomifyUrl = "https://ol-zoomify.surge.sh/zoomify/";
    const source = new Zoomify({
      url: zoomifyUrl,
      size: [imgWidth, imgHeight],
      crossOrigin: "anonymous",
      zDirection: -1,
    });
    const extent = source.getTileGrid().getExtent();
    const retinaPixelRatio = 2;
    const retinaSource = new Zoomify({
      url: zoomifyUrl,
      size: [imgWidth, imgHeight],
      crossOrigin: "anonymous",
      zDirection: -1,
      tilePixelRatio: retinaPixelRatio,
      tileSize: 256 / retinaPixelRatio,
    });
    const layer = new TileLayer({
      source: source,
    });
    const map = new Map({
      layers: [layer],
      target: this.$refs.map,
      view: new View({
        resolutions: layer.getSource().getTileGrid().getResolutions(),
        extent: extent,
        constrainOnlyCenter: true,
      }),
    });
    map.getView().fit(extent);
    this.$refs.zoomifyProtocol.addEventListener("change", function (event) {
      const value = event.currentTarget.value;
      if (value === "zoomify") {
        layer.setSource(source);
      } else if (value === "zoomifyretina") {
        layer.setSource(retinaSource);
      }
    });
  },
};
</script>
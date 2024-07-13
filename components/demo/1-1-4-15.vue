<template>
  <div>
    <div ref="map" class="map"></div>
    Legend:
    <div><img id="legend" /></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Image: ImageLayer },
      source: { XYZ, ImageWMS },
    } = ol;

    const wmsSource = new ImageWMS({
      url: "https://ahocevar.com/geoserver/wms",
      params: { LAYERS: "topp:states" },
      ratio: 1,
      serverType: "geoserver",
    });
    const updateLegend = function (resolution) {
      const graphicUrl = wmsSource.getLegendUrl(resolution);
      const img = document.getElementById("legend");
      img.src = graphicUrl;
    };
    const layers = [
    new TileLayer({
        source: new XYZ({
          url: `http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6`,
          crossOrigin: "anonymous", //跨域
        })
      }),
      new ImageLayer({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: wmsSource,
      }),
    ];
    const map = new Map({
      layers: layers,
      target: this.$refs.map,
      view: new View({
        center: [-10997148, 4569099],
        zoom: 4,
      }),
    });
    const resolution = map.getView().getResolution();
    updateLegend(resolution);
    map.getView().on("change:resolution", function (event) {
      const resolution = event.target.getResolution();
      updateLegend(resolution);
    });
  },
};
</script>
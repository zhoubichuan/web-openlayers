<template>
  <div>
    <div ref="map" class="map"></div>
    <div id="info">&nbsp;</div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { TileWMS },
    } = ol;

    const wmsSource = new TileWMS({
      url: "https://ahocevar.com/geoserver/wms",
      params: { LAYERS: "ne:ne", TILED: true },
      serverType: "geoserver",
      crossOrigin: "anonymous",
    });
    const wmsLayer = new TileLayer({
      source: wmsSource,
    });
    const view = new View({
      center: [12579156, 3274244],
      zoom: 1,
    });
    const map = new Map({
      layers: [wmsLayer],
      target: this.$refs.map,
      view: view,
    });
    map.on("singleclick", function (evt) {
      document.getElementById("info").innerHTML = "";
      const viewResolution = view.getResolution();
      const url = wmsSource.getFeatureInfoUrl(
        evt.coordinate,
        viewResolution,
        "EPSG:3857",
        { INFO_FORMAT: "text/html" }
      );
      if (url) {
        fetch(url)
          .then((response) => response.text())
          .then((html) => {
            document.getElementById("info").innerHTML = html;
          });
      }
    });
    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      const data = wmsLayer.getData(evt.pixel);
      const hit = data && data[3] > 0;
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });
  },
};
</script>
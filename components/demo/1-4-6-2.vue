<template>
  <div>
    <div class="wrapper">
      <div ref="map" class="map"></div>
    </div>
    <form class="form">
      <label for="format">页面大小 </label>
      <select id="format">
        <option value="a0">A0 (slow)</option>
        <option value="a1">A1</option>
        <option value="a2">A2</option>
        <option value="a3">A3</option>
        <option value="a4" selected>A4</option>
        <option value="a5">A5 (fast)</option>
      </select>
      <label for="resolution">分辨率 </label>
      <select id="resolution">
        <option value="72">72 dpi (fast)</option>
        <option value="150">150 dpi</option>
        <option value="200" selected>200 dpi</option>
        <option value="300">300 dpi (slow)</option>
      </select>
      <label for="scale">比例 </label>
      <select id="scale">
        <option value="500">1:500000</option>
        <option value="250" selected>1:250000</option>
        <option value="100">1:100000</option>
        <option value="50">1:50000</option>
        <option value="25">1:25000</option>
        <option value="10">1:10000</option>
      </select>
      <button id="export-pdf">导出 PDF</button>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { WMTSCapabilities },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: {
        WMTS: { optionsFromCapabilities },
      },
      control: { ScaleLine, defaults: defaultControls },
      proj: {
        getPointResolution,
        get: getProjection,
        proj4: { register },
      },
    } = ol;
    this.$proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
        "+x_0=400000 +y_0=-100000 +ellps=airy " +
        "+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 " +
        "+units=m +no_defs"
    );
    register(this.$proj4);
    const proj27700 = getProjection("EPSG:27700");
    proj27700.setExtent([0, 0, 700000, 1300000]);
    const raster = new TileLayer();
    const url =
      "https://tiles.arcgis.com/tiles/qHLhLQrcvEnxjtPr/arcgis/rest/services/OS_Open_Raster/MapServer/WMTS";
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (text) {
        const result = new WMTSCapabilities().read(text);
        const options = optionsFromCapabilities(result, {
          layer: "OS_Open_Raster",
        });
        options.attributions =
          "Contains OS data © Crown Copyright and database right " +
          new Date().getFullYear();
        options.crossOrigin = "";
        options.projection = proj27700;
        options.wrapX = false;
        raster.setSource(new ol.source.WMTS(options));
      });
    const map = new Map({
      layers: [raster],
      controls: defaultControls({
        attributionOptions: { collapsible: false },
      }),
      target: this.$refs.map,
      view: new View({
        center: [373500, 436500],
        projection: proj27700,
        zoom: 7,
      }),
    });
    const scaleLine = new ScaleLine({ bar: true, text: true, minWidth: 125 });
    map.addControl(scaleLine);
    const dims = {
      a0: [1189, 841],
      a1: [841, 594],
      a2: [594, 420],
      a3: [420, 297],
      a4: [297, 210],
      a5: [210, 148],
    };
    const exportOptions = {
      useCORS: true,
      ignoreElements: function (element) {
        const className = element.className || "";
        return !(
          className.indexOf("ol-control") === -1 ||
          className.indexOf("ol-scale") > -1 ||
          (className.indexOf("ol-attribution") > -1 &&
            className.indexOf("ol-uncollapsible"))
        );
      },
    };
    const exportButton = document.getElementById("export-pdf");
    exportButton.addEventListener(
      "click",
      function () {
        exportButton.disabled = true;
        document.body.style.cursor = "progress";
        const format = document.getElementById("format").value;
        const resolution = document.getElementById("resolution").value;
        const scale = document.getElementById("scale").value;
        const dim = dims[format];
        const width = Math.round((dim[0] * resolution) / 25.4);
        const height = Math.round((dim[1] * resolution) / 25.4);
        const viewResolution = map.getView().getResolution();
        const scaleResolution =
          scale /
          getPointResolution(
            map.getView().getProjection(),
            resolution / 25.4,
            map.getView().getCenter()
          );
        map.once("rendercomplete", function () {
          exportOptions.width = width;
          exportOptions.height = height;
          html2canvas(map.getViewport(), exportOptions).then(function (canvas) {
            const pdf = new jspdf.jsPDF("landscape", undefined, format);
            pdf.addImage(
              canvas.toDataURL("image/jpeg"),
              "JPEG",
              0,
              0,
              dim[0],
              dim[1]
            );
            pdf.save("map.pdf");
            scaleLine.setDpi();
            map.getTargetElement().style.width = "";
            map.getTargetElement().style.height = "";
            map.updateSize();
            map.getView().setResolution(viewResolution);
            exportButton.disabled = false;
            document.body.style.cursor = "auto";
          });
        });
        scaleLine.setDpi(resolution);
        map.getTargetElement().style.width = width + "px";
        map.getTargetElement().style.height = height + "px";
        map.updateSize();
        map.getView().setResolution(scaleResolution);
      },
      false
    );
  },
};
</script>
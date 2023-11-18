<template>
  <div>
    <div ref="map" class="map"></div>
    <div>
      <label
        ><input type="checkbox" ref="extractstyles" checked />从KML中提取样式
      </label>
    </div>
    <br />
    <div>
      <a ref="download" download></a>
      下载样品
      <button ref="gpx">GPX</button>
      &nbsp;
      <button ref="geojson">GeoJSON</button>
      &nbsp;
      <button ref="igc">IGC</button>
      &nbsp;
      <button ref="kml">KML</button>
      &nbsp;
      <button ref="topojson">TopoJSON</button>
    </div>
    <br />
    <div ref="info">&nbsp;</div>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      format: { GPX, GeoJSON, IGC, KML, TopoJSON },
      interaction: { DragAndDrop },
    } = ol;
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
              mapkeys.maptiler,
            maxZoom: 20,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    const extractStyles = this.$refs.extractstyles;
    let dragAndDropInteraction;
    function setInteraction() {
      if (dragAndDropInteraction) {
        map.removeInteraction(dragAndDropInteraction);
      }
      dragAndDropInteraction = new DragAndDrop({
        formatConstructors: [
          GPX,
          GeoJSON,
          IGC,
          new KML({ extractStyles: extractStyles.checked }),
          TopoJSON,
        ],
      });
      dragAndDropInteraction.on("addfeatures", function (event) {
        const vectorSource = new VectorSource({
          features: event.features,
        });
        map.addLayer(
          new VectorLayer({
            source: vectorSource,
          })
        );
        map.getView().fit(vectorSource.getExtent());
      });
      map.addInteraction(dragAndDropInteraction);
    }
    setInteraction();
    extractStyles.addEventListener("change", setInteraction);
    const displayFeatureInfo = function (pixel) {
      const features = [];
      map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
      });
      if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          info.push(features[i].get("name"));
        }
        document.getElementById("info").innerHTML = info.join(", ") || "&nbsp";
      } else {
        document.getElementById("info").innerHTML = "&nbsp;";
      }
    };
    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
    });
    map.on("click", function (evt) {
      displayFeatureInfo(evt.pixel);
    });
    const link = this.$refs.download;
    function download(fullpath, filename) {
      fetch(fullpath)
        .then(function (response) {
          return response.blob();
        })
        .then(function (blob) {
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
          } else {
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
          }
        });
    }
    this.$refs.gpx.addEventListener("click", function () {
      download(this.$withBase("/data/gpx/fells_loop.gpx"), "fells_loop.gpx");
    });
    this.$refs.geojson.addEventListener("click", function () {
      download(
        this.$withBase("/data/geojson/roads-seoul.geojson"),
        "roads-seoul.geojson"
      );
    });
    this.$refs.igc.addEventListener("click", function () {
      download(
        this.$withBase("/data/igc/Ulrich-Prinz.igc"),
        "Ulrich-Prinz.igc"
      );
    });
    this.$refs.kml.addEventListener("click", function () {
      download(this.$withBase("/data/kml/states.kml"), "states.kml");
    });
    this.$refs.topojson.addEventListener("click", function () {
      download(
        this.$withBase("/data/topojson/fr-departments.json"),
        "fr-departments.json"
      );
    });
  },
};
</script>
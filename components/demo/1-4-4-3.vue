<template>
  <div>
    <div ref="map" class="map"></div>
    <br />
    <div class="tileCoord">
      <a id="download" download></a>
      <span>Tile coordinate&nbsp;&nbsp;</span>
      <span>&nbsp;z: <input type="number" id="tileCoordZ" value="6" /></span>
      <span>&nbsp;x: <input type="number" id="tileCoordX" value="30" /></span>
      <span>&nbsp;y: <input type="number" id="tileCoordY" value="20" /></span>
      <span>&nbsp;&nbsp;</span>
      <button id="download-mvt">Download sample</button>
    </div>
    <br />
    <div id="info">&nbsp;</div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      format: { GPX, GeoJSON, IGC, KML, MVT, TopoJSON },
      Map,
      View,
      interaction: { DragAndDrop, defaults: defaultInteractions },
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      tilegrid: { createXYZ },
    } = ol;
    const tileCoordZ = document.getElementById("tileCoordZ");
    const tileCoordX = document.getElementById("tileCoordX");
    const tileCoordY = document.getElementById("tileCoordY");

    class customMVT extends MVT {
      constructor() {
        super({ featureClass: Feature });
      }
      readFeatures(source, options) {
        options.extent = createXYZ().getTileCoordExtent([
          parseInt(tileCoordZ.value),
          parseInt(tileCoordX.value),
          parseInt(tileCoordY.value),
        ]);
        return super.readFeatures(source, options);
      }
    }
    const dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [customMVT, GPX, GeoJSON, IGC, KML, TopoJSON],
    });

    const map = new Map({
      interactions: defaultInteractions().extend([dragAndDropInteraction]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
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

    const displayFeatureInfo = function (pixel) {
      const features = [];
      map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
      });
      if (features.length > 0) {
        const info = [];
        let i, ii;
        for (i = 0, ii = features.length; i < ii; ++i) {
          const description =
            features[i].get("name") ||
            features[i].get("_name") ||
            features[i].get("layer");
          if (description) {
            info.push(description);
          }
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

    const link = document.getElementById("download");

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

    document
      .getElementById("download-mvt")
      .addEventListener("click", function () {
        const fullpath =
          "https://basemaps.arcgis.com/v1/arcgis/rest/services/World_Basemap/VectorTileServer/tile/" +
          tileCoordZ.value +
          "/" +
          tileCoordY.value +
          "/" +
          tileCoordX.value +
          ".pbf";
        const filename =
          tileCoordZ.value +
          "-" +
          tileCoordX.value +
          "-" +
          tileCoordY.value +
          ".mvt";
        download(fullpath, filename);
      });
  },
};
</script>
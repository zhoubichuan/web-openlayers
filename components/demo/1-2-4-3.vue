<template>
  <div>
    <div ref="map" class="map"></div>
    <div ref="info">&nbsp;</div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { EsriJSON },
      Feature,
      Map,
      Point,
      View,
      tilegrid: { createXYZ },
      proj: { fromLonLat },
      loadingstrategy: { tile: tileStrategy },
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      style: { Fill, Stroke, Style },
    } = ol

    const serviceUrl =
      "https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/" +
      "Petroleum/KSFields/FeatureServer/"
    const layer = "0"
    const esrijsonFormat = new EsriJSON()
    const styleCache = {
      ABANDONED: new Style({
        fill: new Fill({
          color: "rgba(225, 225, 225, 255)",
        }),
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 255)",
          width: 0.4,
        }),
      }),
      GAS: new Style({
        fill: new Fill({
          color: "rgba(255, 0, 0, 255)",
        }),
        stroke: new Stroke({
          color: "rgba(110, 110, 110, 255)",
          width: 0.4,
        }),
      }),
      OIL: new Style({
        fill: new Fill({
          color: "rgba(56, 168, 0, 255)",
        }),
        stroke: new Stroke({
          color: "rgba(110, 110, 110, 255)",
          width: 0,
        }),
      }),
      OILGAS: new Style({
        fill: new Fill({
          color: "rgba(168, 112, 0, 255)",
        }),
        stroke: new Stroke({
          color: "rgba(110, 110, 110, 255)",
          width: 0.4,
        }),
      }),
    }
    const vectorSource = new VectorSource({
      loader: function (extent, resolution, projection, success, failure) {
        const url =
          serviceUrl +
          layer +
          "/query/?f=json&" +
          "returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=" +
          encodeURIComponent(
            '{"xmin":' +
              extent[0] +
              ',"ymin":' +
              extent[1] +
              ',"xmax":' +
              extent[2] +
              ',"ymax":' +
              extent[3] +
              ',"spatialReference":{"wkid":102100}}'
          ) +
          "&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*" +
          "&outSR=102100"
        // $.ajax({
        //   url: url,
        //   dataType: "jsonp",
        //   success: function (response) {
        //     if (response.error) {
        //       alert(
        //         response.error.message +
        //           "\n" +
        //           response.error.details.join("\n")
        //       )
        //       failure()
        //     } else {
        //       const features = esrijsonFormat.readFeatures(response, {
        //         featureProjection: projection,
        //       })
        //       if (features.length > 0) {
        //         vectorSource.addFeatures(features)
        //       }
        //       success(features)
        //     }
        //   },
        //   error: failure,
        // })
      },
      strategy: tileStrategy(
        createXYZ({
          tileSize: 512,
        })
      ),
    })
    const vector = new VectorLayer({
      source: vectorSource,
      style: function (feature) {
        const classify = feature.get("activeprod")
        return styleCache[classify]
      },
    })
    const raster = new TileLayer({
      source: new XYZ({
        attributions:
          'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
          'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url:
          "https://server.arcgisonline.com/ArcGIS/rest/services/" +
          "World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      }),
    })
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-97.6114, 38.8403]),
        zoom: 7,
      }),
    })
    const displayFeatureInfo = function (pixel) {
      const features = []
      map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature)
      })
      if (features.length > 0) {
        const info = []
        let i, ii
        for (i = 0, ii = features.length; i < ii; ++i) {
          info.push(features[i].get("field_name"))
        }
        this.$refs.info.innerHTML = info.join(", ") || "(unknown)"
        map.getTarget().style.cursor = "pointer"
      } else {
        this.$refs.info.innerHTML = "&nbsp;"
        map.getTarget().style.cursor = ""
      }
    }.bind(this)
    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return
      }
      const pixel = map.getEventPixel(evt.originalEvent)
      displayFeatureInfo(pixel)
    })
    map.on("click", function (evt) {
      displayFeatureInfo(evt.pixel)
    })
  },
}
</script>
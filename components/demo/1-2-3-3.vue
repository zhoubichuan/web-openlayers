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
      format: { GeoJSON },
      Map,
      View,
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      style: { Fill, Stroke, Style },
      extent: { getBottomLeft, getHeight, getWidth },
      render: { toContext },
    } = ol;

    const fill = new Fill();
    const stroke = new Stroke({
      color: "rgba(255,255,255,0.8)",
      width: 2,
    });
    const style = new Style({
      renderer: function (pixelCoordinates, state) {
        const context = state.context;
        const geometry = state.geometry.clone();
        geometry.setCoordinates(pixelCoordinates);
        const extent = geometry.getExtent();
        const width = getWidth(extent);
        const height = getHeight(extent);
        const flag = state.feature.get("flag");
        if (!flag || height < 1 || width < 1) {
          return;
        }
        context.save();
        const renderContext = toContext(context, {
          pixelRatio: 1,
        });
        renderContext.setFillStrokeStyle(fill, stroke);
        renderContext.drawGeometry(geometry);
        context.clip();
        const bottomLeft = getBottomLeft(extent);
        const left = bottomLeft[0];
        const bottom = bottomLeft[1];
        context.drawImage(flag, left, bottom, width, height);
        context.restore();
      },
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        url: "https://openlayersbook.github.io/openlayers_book_samples/assets/data/countries.geojson",
        format: new GeoJSON(),
      }),
      style: style,
    });
    vectorLayer.getSource().on("addfeature", function (event) {
      const feature = event.feature;
      const img = new Image();
      img.onload = function () {
        feature.set("flag", img);
      };
      img.src =
        "https://flagcdn.com/w320/" +
        feature.get("iso_a2").toLowerCase() +
        ".png";
    });

    new Map({
      layers: [vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1,
      }),
    });
  },
};
</script>
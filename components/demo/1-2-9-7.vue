<template>
  <div ref="map" class="map"><div id="popup"></div></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      Overlay,
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { TileJSON, Vector: VectorSource },
      style: { Icon, Style },
    } = ol;
    const iconFeature = new Feature({
      geometry: new Point([0, 0]),
      name: "Null Island",
      population: 4000,
      rainfall: 500,
    });
    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: "fraction",
        anchorYUnits: "pixels",
        src: this.$withBase("/data/icon.png"),
      }),
    });
    iconFeature.setStyle(iconStyle);
    const vectorSource = new VectorSource({
      features: [iconFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
    const rasterLayer = new TileLayer({
      source: new TileJSON({
        url: "https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1",
        crossOrigin: "",
      }),
    });
    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
      }),
    });
    const element = document.getElementById("popup");
    const popup = new Overlay({
      element: element,
      positioning: "bottom-center",
      stopEvent: false,
    });
    map.addOverlay(popup);
    map.on("click", function (evt) {
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature;
      });
      if (feature) {
        popup.setPosition(evt.coordinate);
        $(element).popover({
          placement: "top",
          html: true,
          content: feature.get("name"),
        });
        $(element).popover("show");
      } else {
        $(element).popover("dispose");
      }
    });
    map.on("pointermove", function (e) {
      const pixel = map.getEventPixel(e.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? "pointer" : "";
    });
    map.on("movestart", function () {
      $(element).popover("dispose");
    });
  },
};
</script>
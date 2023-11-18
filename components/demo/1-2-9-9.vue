<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { TileJSON, Vector: VectorSource },
      style: { Icon, Style },
      interaction: { Modify },
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
        url:
          "https://a.tiles.mapbox.com/v4/aj.1x1-degrees.json?secure=1&access_token=" +
          mapkeys.mapbox,
        crossOrigin: "anonymous",
      }),
    });
    const target = this.$refs.map;
    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: target,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
      }),
    });
    const modify = new Modify({
      hitDetection: vectorLayer,
      source: vectorSource,
    });
    modify.on(["modifystart", "modifyend"], function (evt) {
      target.style.cursor = evt.type === "modifystart" ? "grabbing" : "pointer";
    });
    const overlaySource = modify.getOverlay().getSource();
    overlaySource.on(["addfeature", "removefeature"], function (evt) {
      target.style.cursor = evt.type === "addfeature" ? "pointer" : "";
    });
    map.addInteraction(modify);
  },
};
</script>
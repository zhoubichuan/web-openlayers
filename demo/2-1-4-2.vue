<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
let {
  format: { KML },
  geom: { Polygon },
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { Stamen, Vector: VectorSource },
  style: { Fill, Icon, Stroke, Style },
  render: { toContext },
} = ol;
export default {
  mounted() {
    const symbol = [
      [0, 0],
      [4, 2],
      [6, 0],
      [10, 5],
      [6, 3],
      [4, 5],
      [0, 0],
    ];
    let scale;
    const scaleFunction = function (coordinate) {
      return [coordinate[0] * scale, coordinate[1] * scale];
    };
    const styleCache = {};
    const map = new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "toner",
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            url: this.$withBase("/data/kml/2012_Earthquakes_Mag5.kml"),
            format: new KML({
              extractStyles: false,
            }),
          }),
          style: function (feature) {
            const name = feature.get("name");
            const magnitude = parseFloat(name.substr(2));
            const size = parseInt(10 + 40 * (magnitude - 5), 10);
            scale = size / 10;
            let style = styleCache[size];
            if (!style) {
              const canvas = document.createElement("canvas");
              const vectorContext = toContext(canvas.getContext("2d"), {
                size: [size, size],
                pixelRatio: 1,
              });
              vectorContext.setStyle(
                new Style({
                  fill: new Fill({ color: "rgba(255, 153, 0, 0.4)" }),
                  stroke: new Stroke({
                    color: "rgba(255, 204, 0, 0.2)",
                    width: 2,
                  }),
                })
              );
              vectorContext.drawGeometry(
                new Polygon([symbol.map(scaleFunction)])
              );
              style = new Style({
                image: new Icon({
                  img: canvas,
                  imgSize: [size, size],
                  rotation: 1.2,
                }),
              });
              styleCache[size] = style;
            }
            return style;
          },
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
  },
};
</script>
  <style></style>
<template>
  <div>
    <div ref="map" class="map"></div>
    <div>
      <input type="checkbox" ref="interpolate" checked />
      <label for="interpolate">Interpolate</label>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Image: ImageLayer },
      source: { OSM, ImageStatic: Static },
      style: Style,
      proj: {
        transform,
        proj4: { register },
      },
      extent: { getCenter },
    } = ol;

    this.$proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
        "+x_0=400000 +y_0=-100000 +ellps=airy " +
        "+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 " +
        "+units=m +no_defs"
    );
    register(this.$proj4);

    const imageExtent = [0, 0, 700000, 1300000];
    const imageLayer = new ImageLayer();

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        imageLayer,
      ],
      target: this.$refs.map,
      view: new View({
        center: transform(getCenter(imageExtent), "EPSG:27700", "EPSG:3857"),
        zoom: 4,
      }),
    });

    const interpolate = this.$refs.interpolate;

    function setSource() {
      const source = new Static({
        url:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/" +
          "British_National_Grid.svg/2000px-British_National_Grid.svg.png",
        crossOrigin: "",
        projection: "EPSG:27700",
        imageExtent: imageExtent,
        interpolate: interpolate.checked,
      });
      imageLayer.setSource(source);
    }
    setSource();

    interpolate.addEventListener("change", setSource);
  },
};
</script>
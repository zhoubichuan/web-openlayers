<template>
  <div ref="map" class="map" @mapMounted="mapMounted"></div>
</template>

<script>
import "ol/ol.css";
let urls = [
  // "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  "http://t0.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
];
let mapInstance;
export default {
  name: "WebOpenlayers2",
  props: {
    view: {
      type: Object,
      default: () => ({
        center() {
          return [12579156, 3274244];
        },
        zoom: 12,
      }),
    },
    layer: {
      type: Array,
      default: () =>
        urls.map((item) => ({
          name: "Tile",
          source: {
            name: "XYZ",
            config() {
              return {
                url: item,
                wrapX: false,
              };
            },
          },
        })),
    },
  },
  mounted() {
    let { Map, View, extent, proj, tilegrid, layer, source } = ol;
    const projection = proj.get("EPSG:900913");
    const projectionExtent = projection.getExtent();
    const size = extent.getWidth(projectionExtent) / 256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for (let z = 0; z < 19; ++z) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }
    const tileGrid = new tilegrid.WMTS({
      origin: extent.getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds,
    });
    mapInstance = new Map({
      target: this.$refs.map,
      layers: this.layer.map(
        ({name,source}) =>
          new layer[name]({
            source: new source[source.name](
              item.source.config && item.source.config({ projection, tileGrid })
            ),
          })
      ),
      view: new View({
        ...this.view,
        center:
          typeof this.view === "function"
            ? this.view.center(proj)
            : this.view.center,
      }),
    });
  },
  methods: {
    mapMounted() {
      this.$emit("mapMounted", mapInstance);
    },
    getInstance() {
      return mapInstance;
    },
  },
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>


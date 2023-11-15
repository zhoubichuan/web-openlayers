<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { TopoJSON },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      style: { Fill, Stroke, Style },
    } = ol
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    const raster = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/maps/darkmatter/{z}/{x}/{y}.png?key=" +
          mapkeys.maptiler,
        tileSize: 512,
      }),
    })
    const style = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.6)",
      }),
      stroke: new Stroke({
        color: "#319FD3",
        width: 1,
      }),
    })
    const vector = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/topojson/world-110m.json"),
        format: new TopoJSON({
          layers: ["countries"],
        }),
        overlaps: false,
      }),
      style: style,
    })
    const map = new Map({
      layers: [
        raster,
         vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1,
      }),
    })
  },
}
</script>
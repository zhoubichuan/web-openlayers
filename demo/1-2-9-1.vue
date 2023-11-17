<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { Draw },
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Icon, Stroke, Style },
      proj: { get },
    } = ol
    const raster = new TileLayer({
      source: new OSM(),
    })
    const source = new VectorSource()
    let that = this
    const styleFunction = function (feature) {
      const geometry = feature.getGeometry()
      const styles = [
        new Style({
          stroke: new Stroke({
            color: "#ffcc33",
            width: 2,
          }),
        }),
      ]
      geometry.forEachSegment(function (start, end) {
        const dx = end[0] - start[0]
        const dy = end[1] - start[1]
        const rotation = Math.atan2(dy, dx)
        styles.push(
          new Style({
            geometry: new Point(end),
            image: new Icon({
              src: that.$withBase("/data/arrow.png"),
              anchor: [0.75, 0.5],
              rotateWithView: true,
              rotation: -rotation,
            }),
          })
        )
      })
      return styles
    }
    const vector = new VectorLayer({
      source: source,
      style: styleFunction,
    })
    const extent = get("EPSG:3857").getExtent().slice()
    extent[0] += extent[0]
    extent[2] += extent[2]
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [-11000000, 4600000],
        zoom: 4,
        extent,
      }),
    })
    map.addInteraction(
      new Draw({
        source: source,
        type: "LineString",
      })
    )
  },
}
</script>
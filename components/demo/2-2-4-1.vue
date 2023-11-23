<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Layer },
      source: { State: SourceState, Stamen },
      extent: { getCenter, getWidth },
      proj: { fromLonLat, toLonLat },
    } = ol
    class CanvasLayer extends Layer {
      constructor(options) {
        super(options)
        this.features = options.features
        this.svg = d3
          .select(document.createElement("div"))
          .append("svg")
          .style("position", "absolute")
        this.svg.append("path").datum(this.features).attr("class", "boundary")
      }
      getSourceState() {
        return SourceState.READY
      }
      render(frameState) {
        const width = frameState.size[0]
        const height = frameState.size[1]
        const projection = frameState.viewState.projection
        const d3Projection = d3.geoMercator().scale(1).translate([0, 0])
        let d3Path = d3.geoPath().projection(d3Projection)

        const pixelBounds = d3Path.bounds(this.features)
        const pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0]
        const pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1]

        const geoBounds = d3.geoBounds(this.features)
        const geoBoundsLeftBottom = fromLonLat(geoBounds[0], projection)
        const geoBoundsRightTop = fromLonLat(geoBounds[1], projection)
        let geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0]
        if (geoBoundsWidth < 0) {
          geoBoundsWidth += getWidth(projection.getExtent())
        }
        const geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1]

        const widthResolution = geoBoundsWidth / pixelBoundsWidth
        const heightResolution = geoBoundsHeight / pixelBoundsHeight
        const r = Math.max(widthResolution, heightResolution)
        const scale = r / frameState.viewState.resolution

        const center = toLonLat(getCenter(frameState.extent), projection)
        const angle = (-frameState.viewState.rotation * 180) / Math.PI

        d3Projection
          .scale(scale)
          .center(center)
          .translate([width / 2, height / 2])
          .angle(angle)

        d3Path = d3Path.projection(d3Projection)
        d3Path(this.features)

        this.svg.attr("width", width)
        this.svg.attr("height", height)

        this.svg.select("path").attr("d", d3Path)

        return this.svg.node()
      }
    }
    const map = new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "watercolor",
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-97, 38]),
        zoom: 4,
      }),
    })
    d3.json(this.$withBase("/data/topojson/us.json")).then(function (us) {
      const layer = new CanvasLayer({
        features: topojson.feature(us, us.objects.counties),
      })
      map.addLayer(layer)
    })
  },
}
</script>
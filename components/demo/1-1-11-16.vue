<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      geom: { LineString, Point, Polygon },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { TileJSON, Vector: VectorSource },
      style: { Fill, Icon, Stroke, Style },
      interaction: {
        Pointer: PointerInteraction,
        defaults: defaultInteractions,
      },
    } = ol
    class Drag extends PointerInteraction {
      constructor() {
        super({
          handleDownEvent: handleDownEvent,
          handleDragEvent: handleDragEvent,
          handleMoveEvent: handleMoveEvent,
          handleUpEvent: handleUpEvent,
        })
        this.coordinate_ = null
        this.cursor_ = "pointer"
        this.feature_ = null
        this.previousCursor_ = undefined
      }
    }
    function handleDownEvent(evt) {
      const map = evt.map
      const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
        return feature
      })
      if (feature) {
        this.coordinate_ = evt.coordinate
        this.feature_ = feature
      }
      return !!feature
    }
    function handleDragEvent(evt) {
      const deltaX = evt.coordinate[0] - this.coordinate_[0]
      const deltaY = evt.coordinate[1] - this.coordinate_[1]
      const geometry = this.feature_.getGeometry()
      geometry.translate(deltaX, deltaY)
      this.coordinate_[0] = evt.coordinate[0]
      this.coordinate_[1] = evt.coordinate[1]
    }
    function handleMoveEvent(evt) {
      if (this.cursor_) {
        const map = evt.map
        const feature = map.forEachFeatureAtPixel(
          evt.pixel,
          function (feature) {
            return feature
          }
        )
        const element = evt.map.getTargetElement()
        if (feature) {
          if (element.style.cursor != this.cursor_) {
            this.previousCursor_ = element.style.cursor
            element.style.cursor = this.cursor_
          }
        } else if (this.previousCursor_ !== undefined) {
          element.style.cursor = this.previousCursor_
          this.previousCursor_ = undefined
        }
      }
    }
    function handleUpEvent() {
      this.coordinate_ = null
      this.feature_ = null
      return false
    }
    const pointFeature = new Feature(new Point([0, 0]))
    const lineFeature = new Feature(
      new LineString([
        [-1e7, 1e6],
        [-1e6, 3e6],
      ])
    )
    const polygonFeature = new Feature(
      new Polygon([
        [
          [-3e6, -1e6],
          [-3e6, 1e6],
          [-1e6, 1e6],
          [-1e6, -1e6],
          [-3e6, -1e6],
        ],
      ])
    )
    const map = new Map({
      interactions: defaultInteractions().extend([new Drag()]),
      layers: [
        new TileLayer({
          source: new TileJSON({
            url:
              "https://a.tiles.mapbox.com/v4/aj.1x1-degrees.json?secure&access_token=" +
              mapkeys.mapbox,
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [pointFeature, lineFeature, polygonFeature],
          }),
          style: new Style({
            image: new Icon({
              anchor: [0.5, 46],
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              opacity: 0.95,
              src: this.$withBase("/data/icon.png"),
            }),
            stroke: new Stroke({
              width: 3,
              color: [255, 0, 0, 1],
            }),
            fill: new Fill({
              color: [0, 0, 255, 0.6],
            }),
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })
  },
}
</script>
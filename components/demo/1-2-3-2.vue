<template>
  <div>
    <div ref="map" class="map"></div>
    <form>
      <div class="form-group">
        <label for="distance" class="col-form-label">集群距离</label>
        <input
          id="distance"
          class="form-control-range"
          type="range"
          min="0"
          max="200"
          step="1"
          value="40"
        />
        <small class="form-text text-muted"> 要素聚集在一起的距离 </small>
      </div>
      <div class="form-group">
        <label for="min-distance" class="col-form-label">最小距离</label>
        <input
          id="min-distance"
          class="form-control-range"
          type="range"
          min="0"
          max="200"
          step="1"
          value="20"
        />
        <small class="form-text text-muted">
          簇之间的最小距离。不能大于配置的距离。
        </small>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      Map,
      geom: { Point },
      extent: { boundingExtent },
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { Cluster, OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style, Text },
    } = ol
    const distanceInput = document.getElementById("distance")
    const minDistanceInput = document.getElementById("min-distance")

    const count = 20000
    const features = new Array(count)
    const e = 4500000
    for (let i = 0; i < count; ++i) {
      const coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e]
      features[i] = new Feature(new Point(coordinates))
    }
    const source = new VectorSource({
      features: features,
    })

    const clusterSource = new Cluster({
      distance: parseInt(distanceInput.value, 10),
      minDistance: parseInt(minDistanceInput.value, 10),
      source: source,
    })

    const styleCache = {}
    const clusters = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        const size = feature.get("features").length
        let style = styleCache[size]
        if (!style) {
          style = new Style({
            image: new CircleStyle({
              radius: 10,
              stroke: new Stroke({
                color: "#fff",
              }),
              fill: new Fill({
                color: "#3399CC",
              }),
            }),
            text: new Text({
              text: size.toString(),
              fill: new Fill({
                color: "#fff",
              }),
            }),
          })
          styleCache[size] = style
        }
        return style
      },
    })

    const raster = new TileLayer({
      source: new OSM(),
    })

    const map = new Map({
      layers: [raster, clusters],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })

    const distanceHandler = function () {
      clusterSource.setDistance(parseInt(distanceInput.value, 10))
    }
    distanceInput.addEventListener("input", distanceHandler)
    distanceInput.addEventListener("change", distanceHandler)

    const minDistanceHandler = function () {
      clusterSource.setMinDistance(parseInt(minDistanceInput.value, 10))
    }
    minDistanceInput.addEventListener("input", minDistanceHandler)
    minDistanceInput.addEventListener("change", minDistanceHandler)

    map.on("click", (e) => {
      clusters.getFeatures(e.pixel).then((clickedFeatures) => {
        if (clickedFeatures.length) {
          const features = clickedFeatures[0].get("features")
          if (features.length > 1) {
            const extent = boundingExtent(
              features.map((r) => r.getGeometry().getCoordinates())
            )
            map
              .getView()
              .fit(extent, { duration: 1000, padding: [50, 50, 50, 50] })
          }
        }
      })
    })
  },
}
</script>
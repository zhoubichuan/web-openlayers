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
      layer: { VectorTile: VectorTileLayer },
      source: { VectorTile: VectorTileSource },
      style: { Fill, Stroke, Style },
      proj: { fromLonLat },
    } = ol

    const key = "Your Nextzen API key from https://developers.nextzen.org/"

    const roadStyleCache = {}
    const roadColor = {
      major_road: "#776",
      minor_road: "#ccb",
      highway: "#f39",
    }
    const buildingStyle = new Style({
      fill: new Fill({
        color: "#666",
        opacity: 0.4,
      }),
      stroke: new Stroke({
        color: "#444",
        width: 1,
      }),
    })
    const waterStyle = new Style({
      fill: new Fill({
        color: "#9db9e8",
      }),
    })
    const roadStyle = function (feature) {
      const kind = feature.get("kind")
      const railway = feature.get("railway")
      const sort_key = feature.get("sort_key")
      const styleKey = kind + "/" + railway + "/" + sort_key
      let style = roadStyleCache[styleKey]
      if (!style) {
        let color, width
        if (railway) {
          color = "#7de"
          width = 1
        } else {
          color = roadColor[kind]
          width = kind == "highway" ? 1.5 : 1
        }
        style = new Style({
          stroke: new Stroke({
            color: color,
            width: width,
          }),
          zIndex: sort_key,
        })
        roadStyleCache[styleKey] = style
      }
      return style
    }

    const map = new Map({
      layers: [
        new VectorTileLayer({
          source: new VectorTileSource({
            attributions:
              "&copy; OpenStreetMap contributors, Who’s On First, " +
              "Natural Earth, and openstreetmapdata.com",
            format: new TopoJSON({
              layerName: "layer",
              layers: ["water", "roads", "buildings"],
            }),
            maxZoom: 19,
            url:
              "https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=" +
              key,
          }),
          style: function (feature, resolution) {
            switch (feature.get("layer")) {
              case "water":
                return waterStyle
              case "roads":
                return roadStyle(feature)
              case "buildings":
                return resolution < 10 ? buildingStyle : null
              default:
                return null
            }
          },
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-74.0064, 40.7142]),
        maxZoom: 19,
        zoom: 15,
      }),
    })
  },
}
</script>
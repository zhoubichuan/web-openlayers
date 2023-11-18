<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      style: { Fill, Stroke, Style, Text },
      proj: { fromLonLat },
    } = ol

    const map = new Map({
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-100, 38.5]),
        zoom: 4,
      }),
    })

    const labelStyle = new Style({
      text: new Text({
        font: "12px Calibri,sans-serif",
        overflow: true,
        fill: new Fill({
          color: "#000",
        }),
        stroke: new Stroke({
          color: "#fff",
          width: 3,
        }),
      }),
    })
    const countryStyle = new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.6)",
      }),
      stroke: new Stroke({
        color: "#319FD3",
        width: 1,
      }),
    })
    const style = [countryStyle, labelStyle]

    const vectorLayer = new VectorLayer({
      background: "white",
      source: new VectorSource({
        url: "https://openlayers.org/data/vector/us-states.json",
        format: new GeoJSON(),
      }),
      style: function (feature) {
        const label = feature.get("name").split(" ").join("\n")
        labelStyle.getText().setText(label)
        return style
      },
      declutter: true,
    })

    map.addLayer(vectorLayer)
  },
}
</script>
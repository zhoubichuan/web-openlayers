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
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Vector: VectorSource },
      style: { Fill, Style, Text },
      extent: { getCenter },
    } = ol

    const style = new Style({
      text: new Text({
        font: 'bold 11px "Open Sans", "Arial Unicode MS", "sans-serif"',
        placement: "line",
        fill: new Fill({
          color: "white",
        }),
      }),
    })

    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

    const viewExtent = [1817379, 6139595, 1827851, 6143616]
    const map = new Map({
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
              mapkeys.maptiler,
            maxZoom: 20,
          }),
        }),
        new VectorLayer({
          declutter: true,
          source: new VectorSource({
            format: new GeoJSON(),
            url: this.$withBase("/data/geojson/vienna-streets.geojson"),
          }),
          style: function (feature) {
            style.getText().setText(feature.get("name"))
            return style
          },
        }),
      ],
      target: this.$refs.map,
      view: new View({
        extent: viewExtent,
        center: getCenter(viewExtent),
        zoom: 17,
        minZoom: 14,
      }),
    })
  },
}
</script>
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
      style: { Stroke, Style },
      tilegrid: { createXYZ },
      loadingstrategy: { tile },
      proj: { useGeographic },
    } = ol

    useGeographic()
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: function (extent) {
        return (
          "https://ahocevar.com/geoserver/wfs?service=WFS&" +
          "version=1.1.0&request=GetFeature&typename=osm:water_areas&" +
          "outputFormat=application/json&srsname=EPSG:4326&" +
          "bbox=" +
          extent.join(",") +
          ",EPSG:4326"
        )
      },
      strategy: tile(createXYZ({ tileSize: 512 })),
    })
    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "rgba(0, 0, 255, 1.0)",
          width: 2,
        }),
      }),
    })
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

    const raster = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        maxZoom: 20,
      }),
    })
    const map = new Map({
      layers: [
        raster, 
        vector],
      target: this.$refs.map,
      view: new View({
        center: [-80.0298, 43.4578],
        maxZoom: 19,
        zoom: 12,
      }),
    })
  },
}
</script>
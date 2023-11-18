<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { MVT },
      Map,
      View,
      layer: { VectorTile: VectorTileLayer },
      source: { VectorTile: VectorTileSource },
      style: { Fill, Icon, Stroke, Style, Text },
      proj: { fromLonLat },
    } = ol

    const map = new Map({
      layers: [
        new VectorTileLayer({
          declutter: true,
          source: new VectorTileSource({
            attributions:
              '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
              '© <a href="https://www.openstreetmap.org/copyright">' +
              "OpenStreetMap contributors</a>",
            format: new MVT(),
            url:
              "https://{a-d}.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/" +
              "{z}/{x}/{y}.vector.pbf?access_token=" +
              mapkeys.mapbox,
          }),
          style: createMapboxStreetsV6Style(Style, Fill, Stroke, Icon, Text),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
    })
  },
}
</script>
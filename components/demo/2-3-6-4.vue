<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      control: { FullScreen },
    } = ol
    // import olms from 'ol-mapbox-style';
    olms(
      "map",
      "https://api.maptiler.com/maps/topo/style.json?key=Get your own API key at https://www.maptiler.com/cloud/"
    ).then(function (map) {
      map.addControl(new FullScreen())
    })
  },
}
</script>
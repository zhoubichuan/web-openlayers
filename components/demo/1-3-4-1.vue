<template>
  <div ref="map" class="map"></div>
</template>
<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Image: ImageLayer },
      source: { ImageStatic: Static },
      extent: { getCenter },
      proj: { Projection },
    } = ol
    const extent = [0, 0, 1024, 968]
    const projection = new Projection({
      code: "xkcd-image",
      units: "pixels",
      extent: extent,
    })
    const map = new Map({
      layers: [
        new ImageLayer({
          source: new Static({
            attributions: '© <a href="https://xkcd.com/license.html">xkcd</a>',
            url: "https://imgs.xkcd.com/comics/online_communities.png",
            projection: projection,
            imageExtent: extent,
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 2,
        maxZoom: 8,
      }),
    })
  },
}
</script>
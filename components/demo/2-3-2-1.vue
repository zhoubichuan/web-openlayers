<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      control: { Attribution, defaults: defaultControls },
    } = ol
    const attribution = new Attribution({
      collapsible: false,
    })
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      controls: defaultControls({ attribution: false }).extend([attribution]),
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })
    function checkSize() {
      const small = map.getSize()[0] < 600
      attribution.setCollapsible(small)
      attribution.setCollapsed(small)
    }
    window.addEventListener("resize", checkSize)
    checkSize()
  },
}
</script>
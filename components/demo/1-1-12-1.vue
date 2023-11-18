<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { DoubleClickZoom, DragPan, MouseWheelZoom, defaults },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
    } = ol
    const map = new Map({
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
    })
    // 删除默认的双击事件
    const dblClickInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => {
        return interaction instanceof DoubleClickZoom
      })
    map.removeInteraction(dblClickInteraction)
    // 删除拖拽平移事件
    const dragPanInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => {
        return interaction instanceof DragPan
      })
    map.removeInteraction(dragPanInteraction)
    // 删除鼠标滚轮缩放事件
    const mouseWheelZoomInteraction = map
      .getInteractions()
      .getArray()
      .find((interaction) => {
        return interaction instanceof MouseWheelZoom
      })
    map.removeInteraction(mouseWheelZoomInteraction)
  },
}
</script>
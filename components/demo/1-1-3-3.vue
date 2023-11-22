<template>
  <WebOpenlayers2 ref="map" :view="view">
    <button @click="zoomOut">缩小地图</button>
    <button @click="zoomIn">放大地图</button>
  </WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
        center: [12579156, 3274244],
        zoom: 4,
      },
    };
  },
  methods: {
    zoomOut() {
      let map = this.refs.map.getInstance();
      const view = map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom - 1);
    },
    zoomIn() {
      let map = this.refs.map.getInstance();
      const view = map.getView();
      const zoom = view.getZoom();
      view.setZoom(zoom + 1);
    },
  },
};
</script>
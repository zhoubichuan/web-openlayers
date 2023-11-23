<template>
  <WebOLChina type="china" @moveend="moveend">
    <label>left: <input v-model="left" type="text" /></label>
    <label>right: <input v-model="right" type="text" /></label>
    <label>bottom: <input v-model="bottom" type="text" /></label>
    <label>top: <input v-model="top" type="text" /></label>
  </WebOLChina>
</template>
  
<script>
export default {
  data() {
    return {
      style: "",
      left: "",
      right: "",
      bottom: "",
      top: "",
    };
  },
  methods: {
    moveend({
      evt,
      ol: {
        extent: { getBottomLeft, getTopRight },
        proj: { toLonLat },
      },
    }) {
      function wrapLon(value) {
        const worlds = Math.floor((value + 180) / 360);
        return value * worlds * 360;
      }
      const map = evt.map;
      const extent = map.getView().calculateExtent(map.getSize());
      const bottomLeft = toLonLat(getBottomLeft(extent));
      const topRight = toLonLat(getTopRight(extent));
      this.left = wrapLon(bottomLeft[0]);
      this.bottom = bottomLeft[1];
      this.right = wrapLon(topRight[0]);
      this.top = topRight[1];
    },
  },
};
</script>
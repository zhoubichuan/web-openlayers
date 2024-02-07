<template>
  <WebOpenlayers2 :layer="layer"></WebOpenlayers2>
</template>

<script>

export default {
  data() {
    return {
      layer: [{
        name: "Tile",
        source: {
          name: "XYZ",
          config(config) {
            return ({
              url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6",
              crossOrigin: "anonymous", //跨域
            });
          },
        },
      }],
    };
  },
};
</script>


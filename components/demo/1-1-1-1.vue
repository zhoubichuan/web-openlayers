<template>
  <WebOpenlayers2 :layer="layer"></WebOpenlayers2>
</template>

<script>
let urls = [
  "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
];
export default {
  data() {
    return {
      layer: urls.map((item) => ({
        name: "Tile",
        source: {
          name: "XYZ",
          config(config) {
            return ({
              url: item,
              wrapX: false,
              ...config,
            });
          },
        },
      })),
    };
  },
};
</script>


<template>
  <WebOpenlayers2 :layer="layer"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      layer: [
        {
          name: "WebGLTile",
          source: {
            name: "OSM",
          },
        },
      ],
    };
  },
};
</script>


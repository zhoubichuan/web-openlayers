<template>
  <WebOpenlayers2 :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
        maxResolution: 20000,
        minResolution: 2000,
        maxZoom: 14,
        minZoom: 10,
        center: [12579156, 3274244],
        zoom: 12,
      },
    };
  },
};
</script>
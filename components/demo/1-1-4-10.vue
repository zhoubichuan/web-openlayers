<template>
  <WebOpenlayers2 :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
        constrainResolution: true,
        center: [12579156, 3274244],
        zoom: 12,
      },
    };
  },
};
</script>
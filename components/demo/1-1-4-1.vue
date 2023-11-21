<template>
  <WebOpenlayers2 :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
        constrainRotation: false,
        center: [12579156, 3274244],
        zoom: 4,
      },
    };
  },
};
</script>



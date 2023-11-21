<template>
  <WebOpenlayers2 :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
        extent: [-572513.341856, 5211017.966314, 916327.095083, 6636950.728974],
        center: [12579156, 3274244],
        zoom: 3,
      },
    };
  },
};
</script>
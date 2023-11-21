<template>
  <WebOpenlayers2 :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
        center: [12579156, 3274244],
        zoom: 7,
      },
    };
  },
};
</script>

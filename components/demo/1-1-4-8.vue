
<template>
  <WebOpenlayers2 :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      view: {
       center: fromLonLat([-116.18688965, 36.057944835]),
        zoom: 15,
        maxZoom: 18,
        constrainOnlyCenter: true,
      },
    };
  },
};
</script>
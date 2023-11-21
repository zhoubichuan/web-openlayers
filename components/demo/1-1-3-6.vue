
<template>
  <WebOpenlayers2  :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      layer: [
        {
          name: "TileLayer",
          source: {
            name: "XYZ",
            config() {
              return {
                url:
                  "https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=" +
                  mapkeys.maptiler,
                tilePixelRatio: 2,
              };
            },
          },
        },
      ],
      view: {
        center({ transform }) {
          return transform(
            [-116.18688965, 36.057944835],
            "EPSG:4326",
            "EPSG:3857"
          );
        },
        zoom: 12,
      },
    };
  },
};
</script>
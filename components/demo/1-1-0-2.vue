<template>
  <div class="wrapper">
    <div class="half">
      <h4>Road</h4>
      <WebOpenlayers2 :layer="layer1"></WebOpenlayers2>
    </div>
    <div class="half">
      <h4>Aerial</h4>
      <WebOpenlayers2 :layer="layer2"></WebOpenlayers2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layer1: [
        {
          name: "TileLayer",
          source: {
            name: "XYZ",
            config() {
              return {
                url:
                  "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
                  mapkeys.maptiler,
                tileSize: 512,
                maxZoom: 22,
              };
            },
          },
        },
      ],
      layer2: [
        {
          name: "TileLayer",
          source: {
            name: "XYZ",
            config() {
              return {
                url:
                  "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
                  mapkeys.maptiler,
                maxZoom: 20,
              };
            },
          },
        },
      ],
    };
  },
  mounted() {},
};
</script>
<style>
.wrapper {
  width: 100%;
  height: 100%;
}
</style>
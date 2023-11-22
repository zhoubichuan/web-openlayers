<template>
  <WebOpenlayers2 :layer="layer" :view="view"></WebOpenlayers2>
</template>

<script>
export default {
  data() {
    return {
      layer: [
        {
          name: "Tile",
            extent: [-13884991, 2870341, -7455066, 6338219],
          source: {
            name: "TileWMS",
            config() {
              return {
                url: "https://ahocevar.com/geoserver/wms",
                params: { LAYERS: "topp:states", TILED: true },
                serverType: "geoserver",
                transition: 0,
              };
            },
          },
        },
      ],
      view: {
        center: [-10997148, 4569099],
        zoom: 4,
      },
    };
  },
};
</script>


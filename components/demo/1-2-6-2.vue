<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      tilegrid: { TileGrid },
      Map,
      View,
      layer: { WebGLTile: WebGLTileLayer },
      source: { GeoTIFF, sourcesFromTileGrid },
    } = ol;
    const tileGrid = new TileGrid({
      extent: [-180, -90, 180, 90],
      resolutions: [
        0.703125, 0.3515625, 0.17578125, 8.7890625e-2, 4.39453125e-2,
      ],
      tileSizes: [
        [512, 256],
        [1024, 512],
        [2048, 1024],
        [4096, 2048],
        [4096, 4096],
      ],
    });

    const pyramid = new WebGLTileLayer({
      sources: sourcesFromTileGrid(
        tileGrid,
        ([z, x, y]) =>
          new GeoTIFF({
            sources: [
              {
                url: `https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/${z}/${y}/${x}.tif`,
              },
            ],
          })
      ),
    });

    const map = new Map({
      target: this.$refs.map,
      layers: [pyramid],
      view: new View({
        projection: "EPSG:4326",
        center: [12579156, 3274244],
        zoom: 0,
        showFullExtent: true,
      }),
    });
  },
};
</script>
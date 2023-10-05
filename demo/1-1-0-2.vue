<template>
  <div class="wrapper">
    <div class="half">
      <h4>Road</h4>
      <div id="roadMap" class="map"></div>
    </div>
    <div class="half">
      <h4>Aerial</h4>
      <div id="aerialMap" class="map"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { XYZ },
    } = ol;
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    const roadLayer = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
          mapkeys.maptiler,
        tileSize: 512,
        maxZoom: 22,
      }),
    });
    const aerialLayer = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        maxZoom: 20,
      }),
    });
    const view = new View({
      center: [-6655.5402445057125, 6709968.258934638],
      zoom: 13,
    });
    const map1 = new Map({
      target: "roadMap",
      layers: [roadLayer],
      view: view,
    });

    const map2 = new Map({
      target: "aerialMap",
      layers: [aerialLayer],
      view: view,
    });
  },
};
</script>
<style>
.wrapper {
  width: 100%;
  height: 400px;
}
</style>
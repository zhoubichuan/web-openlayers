<template>
  <div>
    <div ref="map" class="map"></div>
    <label>
      使用透明度过渡渲染
      <input ref="transition" type="checkbox" checked />
    </label>
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
    const url =
      "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
      mapkeys.maptiler;
    const withTransition = new TileLayer({
      source: new XYZ({ url: url, tileSize: 512, attributions: attributions }),
    });
    const withoutTransition = new TileLayer({
      source: new XYZ({
        url: url,
        transition: 0,
        tileSize: 512,
        attributions: attributions,
      }),
      visible: false,
    });
    const map = new Map({
      layers: [withTransition, withoutTransition],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
        maxZoom: 11,
      }),
    });
    this.$refs.transition.addEventListener("change", function (event) {
      const transition = event.target.checked;
      withTransition.setVisible(transition);
      withoutTransition.setVisible(!transition);
    });
  },
};
</script>
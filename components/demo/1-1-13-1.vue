<template>
  <div>
    <div ref="map" class="map"></div>
    <button class="switcher" value="0">一月</button>
    <button class="switcher" value="1">一月 (水深测量)</button>
    <button class="switcher" value="2">七月</button>
    <button class="switcher" value="3">七月 (水深测量)</button>
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

    const baseUrl = "https://{a-c}.tiles.mapbox.com/v4";
    const urls = [
      "/mapbox.blue-marble-topo-jan/{z}/{x}/{y}.png?access_token=",
      "/mapbox.blue-marble-topo-bathy-jan/{z}/{x}/{y}.png?access_token=",
      "/mapbox.blue-marble-topo-jul/{z}/{x}/{y}.png?access_token=",
      "/mapbox.blue-marble-topo-bathy-jul/{z}/{x}/{y}.png?access_token=",
    ];
    const source = new XYZ();
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: source,
        }),
      ],
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    function updateUrl(index) {
      source.setUrl(baseUrl + urls[index] + mapkeys.mapbox);
    }
    const buttons = document.getElementsByClassName("switcher");
    for (let i = 0, ii = buttons.length; i < ii; ++i) {
      const button = buttons[i];
      button.addEventListener(
        "click",
        updateUrl.bind(null, Number(button.value))
      );
    }
    updateUrl(0);
  },
};
</script>
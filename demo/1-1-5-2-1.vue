<template>
  <div>
    <div ref="map" class="map"></div>
    <button type="button" class="btn btn-default" id="India">印度</button>
    <button type="button" class="btn btn-default" id="Argentina">阿根廷</button>
    <button type="button" class="btn btn-default" id="Nigeria">尼日利亚</button>
    <button type="button" class="btn btn-default" id="Sweden">瑞典</button>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { TileJSON },
      style: Style,
      proj: { transformExtent },
    } = ol;

    function transform(extent) {
      return transformExtent(extent, "EPSG:4326", "EPSG:3857");
    }
    const extents = {
      India: transform([68.17665, 7.96553, 97.40256, 35.49401]),
      Argentina: transform([-73.41544, -55.25, -53.62835, -21.83231]),
      Nigeria: transform([2.6917, 4.24059, 14.57718, 13.86592]),
      Sweden: transform([11.02737, 55.36174, 23.90338, 69.10625]),
    };
    const base = new TileLayer({
      source: new TileJSON({
        url:
          "https://api.tiles.mapbox.com/v4/mapbox.world-light.json?secure&access_token=" +
          mapkeys.mapbox,
        crossOrigin: "anonymous",
      }),
    });
    const overlay = new TileLayer({
      extent: extents.India,
      source: new TileJSON({
        url:
          "https://api.tiles.mapbox.com/v4/mapbox.world-black.json?secure&access_token=" +
          mapkeys.mapbox,
        crossOrigin: "anonymous",
      }),
    });
    const map = new Map({
      layers: [base, overlay],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1,
      }),
    });
    for (const key in extents) {
      document.getElementById(key).onclick = function (event) {
        overlay.setExtent(extents[event.target.id]);
      };
    }
  },
};
</script>
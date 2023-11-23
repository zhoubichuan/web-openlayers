<template>
  <div>
    <div ref="map" class="map"></div>
    <ul>
      <li>α : <code ref="alpha"></code></li>
      <li>β : <code ref="beta"></code></li>
      <li>γ : <code ref="gamma"></code></li>
    </ul>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      math: { toRadians },
    } = ol;
    const view = new View({
      center: [12579156, 3274244],
      zoom: 2,
    });
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: view,
    });
    function el(id) {
      return this.$refs[id];
    }
    const gn = new GyroNorm();
    gn.init().then(function () {
      gn.start(function (event) {
        const center = view.getCenter();
        const resolution = view.getResolution();
        const alpha = toRadians(event.do.alpha);
        const beta = toRadians(event.do.beta);
        const gamma = toRadians(event.do.gamma);

        el("alpha").innerText = alpha + " [rad]";
        el("beta").innerText = beta + " [rad]";
        el("gamma").innerText = gamma + " [rad]";

        center[0] -= resolution * gamma * 25;
        center[1] += resolution * beta * 25;

        view.setCenter(center);
      });
    });
  },
};
</script>
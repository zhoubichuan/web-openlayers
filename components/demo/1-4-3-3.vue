<template>
  <div>
    <div ref="map" class="map"></div>
    <div role="group" aria-label="Animation controls">
      <button ref="play" type="button">播放</button>
      <button ref="pause" type="button">暂停</button>
      <span ref="info"></span>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      extent: { getCenter },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { Stamen, TileWMS },
      proj: { transformExtent },
    } = ol;
    function threeHoursAgo() {
      return new Date(Math.round(Date.now() / 3600000) * 3600000 - 3600000 * 3);
    }
    const extent = transformExtent(
      [-126, 24, -66, 50],
      "EPSG:4326",
      "EPSG:3857"
    );
    let startDate = threeHoursAgo();
    const frameRate = 0.5;
    let animationId = null;
    const layers = [
      new TileLayer({
        source: new Stamen({
          layer: "terrain",
        }),
      }),
      new TileLayer({
        extent: extent,
        source: new TileWMS({
          attributions: ["Iowa State University"],
          url: "https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi",
          params: { LAYERS: "nexrad-n0r-wmst" },
        }),
      }),
    ];
    const map = new Map({
      layers: layers,
      target: this.$refs.map,
      view: new View({
        center: getCenter(extent),
        zoom: 4,
      }),
    });
    let that = this;
    function updateInfo() {
      that.$refs.info.innerHTML = startDate.toISOString();
    }
    function setTime() {
      startDate.setMinutes(startDate.getMinutes() + 15);
      if (startDate > Date.now()) {
        startDate = threeHoursAgo();
      }
      layers[1].getSource().updateParams({ TIME: startDate.toISOString() });
      updateInfo();
    }
    setTime();
    const stop = function () {
      if (animationId !== null) {
        window.clearInterval(animationId);
        animationId = null;
      }
    };
    const play = function () {
      stop();
      animationId = window.setInterval(setTime, 1000 / frameRate);
    };
    this.$refs.play.addEventListener("click", play, false);
    this.$refs.pause.addEventListener("click", stop, false);
    updateInfo();
  },
};
</script>
<template>
  <div id="fullscreen" class="fullscreen">
    <div ref="map" class="map"></div>
    <div class="sidepanel">
      <span class="sidepanel-title">侧面板</span>
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
      source: { OSM },
      control: { FullScreen, defaults: defaultControls },
    } = ol
    const view = new View({
      center: [-9101767, 2822912],
      zoom: 14,
    })

    const map = new Map({
      controls: defaultControls().extend([
        new FullScreen({
          source: "fullscreen",
        }),
      ]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: view,
    })
  },
}
</script>
<style>
#fullscreen:-webkit-full-screen {
  height: 100%;
  margin: 0;
}
#fullscreen:-ms-fullscreen {
  height: 100%;
}

#fullscreen:fullscreen {
  height: 100%;
}

#fullscreen {
  margin-bottom: 10px;
  width: 100%;
  height: 100%;
}
#fullscreen {
  width: 100%;
  height: 300px;
}
#fullscreen .map .ol-rotate {
  top: 3em;
}

#fullscreen .map {
  width: 80%;
  height: 100%;
  float: left;
}

#fullscreen .sidepanel {
  background: #1f6b75;
  width: 20%;
  height: 100%;
  float: left;
}

#fullscreen .sidepanel-title {
  width: 100%;
  font-size: 3em;
  color: #ffffff;
  display: block;
  text-align: center;
}
</style>
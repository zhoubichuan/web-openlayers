<template>
  <div>
    <div ref="map" class="map"></div>
    <label>
      海平面上升高度：
      <input ref="slider" type="range" value="10" max="100" min="-1" />
    </label>
    <span ref="theinfo"></span>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      proj: { get: getProjection },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM, WMTS },
      extent: { getTopLeft, getWidth },
      tilegrid: { WMTS: WMTSTileGrid },
    } = ol;
    const projection = getProjection("EPSG:3857");
    const tileSizePixels = 256;
    const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels;
    const matrixIds = [];
    const resolutions = [];
    for (let i = 0; i <= 14; i++) {
      matrixIds[i] = i;
      resolutions[i] = tileSizeMtrs / Math.pow(2, i);
    }
    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projection.getExtent()),
      resolutions: resolutions,
      matrixIds: matrixIds,
    });
    const wmtsSource = new WMTS({
      url: "https://ts2.scalgo.com/olpatch/wmts?token=" + mapkeys.scalgo,
      layer: "SRTM_4_1:SRTM_4_1_flooded_sealevels",
      format: "image/png",
      matrixSet: "EPSG:3857",
      attributions: [
        '<a href="https://scalgo.com" target="_blank">SCALGO</a>',
        '<a href="https://cgiarcsi.community/data/' +
          'srtm-90m-digital-elevation-database-v4-1"' +
          ' target="_blank">CGIAR-CSI SRTM</a>',
      ],
      tileGrid: tileGrid,
      style: "default",
      dimensions: {
        threshold: 100,
      },
    });
    const map = new Map({
      target: this.$refs.map,
      view: new View({
        projection: projection,
        center: [12579156, 3274244],
        zoom: 6,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          opacity: 0.5,
          source: wmtsSource,
        }),
      ],
    });
    const slider = this.$refs.slider;
    const updateSourceDimension = function () {
      wmtsSource.updateDimensions({ threshold: slider.value });
      this.$refs.theinfo.innerHTML = slider.value + " 米";
    }.bind(this);
    slider.addEventListener("input", updateSourceDimension);
    slider.addEventListener("change", updateSourceDimension);
    updateSourceDimension();
  },
};
</script>
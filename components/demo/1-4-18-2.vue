<template>
  <div>
    <div ref="map" class="map"></div>
    <div>
      <label class="input-group">
        Threshold:
        <input id="threshold" type="range" min="1" max="50" value="20" />
        <span id="threshold-value"></span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer, Image: ImageLayer },
      source: { XYZ, Raster: RasterSource },
      proj: { fromLonLat },
    } = ol;
    function growRegion(inputs, data) {
      const image = inputs[0];
      let seed = data.pixel;
      const delta = parseInt(data.delta);
      if (!seed) {
        return image;
      }
      seed = seed.map(Math.round);
      const width = image.width;
      const height = image.height;
      const inputData = image.data;
      const outputData = new Uint8ClampedArray(inputData);
      const seedIdx = (seed[1] * width + seed[0]) * 4;
      const seedR = inputData[seedIdx];
      const seedG = inputData[seedIdx + 1];
      const seedB = inputData[seedIdx + 2];
      let edge = [seed];
      while (edge.length) {
        const newedge = [];
        for (let i = 0, ii = edge.length; i < ii; i++) {
          const next = next4Edges(edge[i]);
          for (let j = 0, jj = next.length; j < jj; j++) {
            const s = next[j][0];
            const t = next[j][1];
            if (s >= 0 && s < width && t >= 0 && t < height) {
              const ci = (t * width + s) * 4;
              const cr = inputData[ci];
              const cg = inputData[ci + 1];
              const cb = inputData[ci + 2];
              const ca = inputData[ci + 3];
              if (ca === 0) {
                continue;
              }
              if (
                Math.abs(seedR - cr) < delta &&
                Math.abs(seedG - cg) < delta &&
                Math.abs(seedB - cb) < delta
              ) {
                outputData[ci] = 255;
                outputData[ci + 1] = 0;
                outputData[ci + 2] = 0;
                outputData[ci + 3] = 255;
                newedge.push([s, t]);
              }
              inputData[ci + 3] = 0;
            }
          }
        }
        edge = newedge;
      }
      return { data: outputData, width: width, height: height };
    }
    function next4Edges(edge) {
      const x = edge[0];
      const y = edge[1];
      return [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];
    }
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const imagery = new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          "https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=" +
          mapkeys.maptiler,
        maxZoom: 20,
        crossOrigin: "",
      }),
    });
    const raster = new RasterSource({
      sources: [imagery.getSource()],
      operationType: "image",
      operation: growRegion,
      lib: {
        next4Edges: next4Edges,
      },
    });
    const rasterImage = new ImageLayer({
      opacity: 0.7,
      source: raster,
    });
    const map = new Map({
      layers: [imagery, rasterImage],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([-119.07, 47.65]),
        zoom: 11,
      }),
    });
    let coordinate;
    map.on("click", function (event) {
      coordinate = event.coordinate;
      raster.changed();
    });
    const thresholdControl = document.getElementById("threshold");
    raster.on("beforeoperations", function (event) {
      const data = event.data;
      data.delta = thresholdControl.value;
      if (coordinate) {
        data.pixel = map.getPixelFromCoordinate(coordinate);
      }
    });
    function updateControlValue() {
      document.getElementById("threshold-value").innerText =
        thresholdControl.value;
    }
    updateControlValue();
    const listener = function () {
      updateControlValue();
      raster.changed();
    };
    thresholdControl.addEventListener("input", listener);
    thresholdControl.addEventListener("change", listener);
  },
};
</script>
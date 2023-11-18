<template>
  <div>
    <div ref="map" class="map"></div>
    <form>
      <div id="status">
        显示 <span class="min-year"></span> 到
        <span class="max-year"></span>之间的范围
      </div>

      <label for="min-year">最低年份:</label>
      <input
        id="min-year"
        type="range"
        min="1850"
        max="2015"
        step="1"
        value="1850"
      />
      <label for="max-year">最高年份:</label>
      <input
        id="max-year"
        type="range"
        min="1850"
        max="2015"
        step="1"
        value="2015"
      />
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer, WebGLPoints: WebGLPointsLayer },
      source: { Stamen, Vector: VectorSource },
      proj: { fromLonLat },
    } = ol;
    const vectorSource = new VectorSource({
      attributions: "NASA",
    });
    const oldColor = "rgba(242,56,22,0.61)";
    const newColor = "#ffe52c";
    const period = 12;
    const animRatio = [
      "^",
      [
        "/",
        [
          "%",
          [
            "+",
            ["time"],
            ["interpolate", ["linear"], ["get", "year"], 1850, 0, 2015, period],
          ],
          period,
        ],
        period,
      ],
      0.5,
    ];
    const style = {
      variables: {
        minYear: 1850,
        maxYear: 2015,
      },
      filter: [
        "between",
        ["get", "year"],
        ["var", "minYear"],
        ["var", "maxYear"],
      ],
      symbol: {
        symbolType: "circle",
        size: [
          "*",
          ["interpolate", ["linear"], ["get", "mass"], 0, 8, 200000, 26],
          ["-", 1.75, ["*", animRatio, 0.75]],
        ],
        color: ["interpolate", ["linear"], animRatio, 0, newColor, 1, oldColor],
        opacity: ["-", 1.0, ["*", animRatio, 0.75]],
      },
    };
    const minYearInput = document.getElementById("min-year");
    const maxYearInput = document.getElementById("max-year");
    function updateMinYear() {
      style.variables.minYear = parseInt(minYearInput.value);
      updateStatusText();
    }
    function updateMaxYear() {
      style.variables.maxYear = parseInt(maxYearInput.value);
      updateStatusText();
    }
    function updateStatusText() {
      const div = document.getElementById("status");
      div.querySelector("span.min-year").textContent = minYearInput.value;
      div.querySelector("span.max-year").textContent = maxYearInput.value;
    }
    minYearInput.addEventListener("input", updateMinYear);
    minYearInput.addEventListener("change", updateMinYear);
    maxYearInput.addEventListener("input", updateMaxYear);
    maxYearInput.addEventListener("change", updateMaxYear);
    updateStatusText();
    const client = new XMLHttpRequest();
    client.open("GET", this.$withBase("/data/csv/meteorite_landings.csv"));
    client.onload = function () {
      const csv = client.responseText;
      const features = [];
      let prevIndex = csv.indexOf("\n") + 1;
      let curIndex;
      while ((curIndex = csv.indexOf("\n", prevIndex)) != -1) {
        const line = csv.substr(prevIndex, curIndex - prevIndex).split(",");
        prevIndex = curIndex + 1;
        const coords = fromLonLat([parseFloat(line[4]), parseFloat(line[3])]);
        if (isNaN(coords[0]) || isNaN(coords[1])) {
          continue;
        }
        features.push(
          new Feature({
            mass: parseFloat(line[1]) || 0,
            year: parseInt(line[2]) || 0,
            geometry: new Point(coords),
          })
        );
      }
      vectorSource.addFeatures(features);
    };
    client.send();
    const map = new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "toner",
          }),
        }),
        new WebGLPointsLayer({
          style: style,
          source: vectorSource,
          disableHitDetection: true,
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    function animate() {
      map.render();
      window.requestAnimationFrame(animate);
    }
    animate();
  },
};
</script>
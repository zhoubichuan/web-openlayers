<template>
  <div>
    <div ref="map" class="map"></div>
    <select id="units">
      <option value="degrees">度</option>
      <option value="imperial">英制英寸</option>
      <option value="us">美国英寸</option>
      <option value="nautical">海里</option>
      <option value="metric" selected>米</option>
    </select>

    <select id="type">
      <option value="scaleline">标线</option>
      <option value="scalebar">比例尺</option>
    </select>

    <select id="steps" style="display: none">
      <option value="2">2 steps</option>
      <option value="4" selected>4 steps</option>
      <option value="6">6 steps</option>
      <option value="8">8 steps</option>
    </select>

    <div id="showScaleTextDiv" style="display: none">
      <label
        ><input type="checkbox" id="showScaleText" checked />
        显示缩放文本</label
      >
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      control: { ScaleLine, defaults: defaultControls },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
    } = ol;

    const unitsSelect = document.getElementById("units");
    const typeSelect = document.getElementById("type");
    const stepsSelect = document.getElementById("steps");
    const scaleTextCheckbox = document.getElementById("showScaleText");
    const showScaleTextDiv = document.getElementById("showScaleTextDiv");

    let scaleType = "scaleline";
    let scaleBarSteps = 4;
    let scaleBarText = true;
    let control;

    function scaleControl() {
      if (scaleType === "scaleline") {
        control = new ScaleLine({
          units: unitsSelect.value,
        });
        return control;
      }
      control = new ScaleLine({
        units: unitsSelect.value,
        bar: true,
        steps: scaleBarSteps,
        text: scaleBarText,
        minWidth: 140,
      });
      return control;
    }
    const map = new Map({
      controls: defaultControls().extend([scaleControl()]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });

    function onChange() {
      control.setUnits(unitsSelect.value);
    }
    function onChangeType() {
      scaleType = typeSelect.value;
      if (typeSelect.value === "scalebar") {
        stepsSelect.style.display = "inline";
        showScaleTextDiv.style.display = "inline";
        map.removeControl(control);
        map.addControl(scaleControl());
      } else {
        stepsSelect.style.display = "none";
        showScaleTextDiv.style.display = "none";
        map.removeControl(control);
        map.addControl(scaleControl());
      }
    }
    function onChangeSteps() {
      scaleBarSteps = parseInt(stepsSelect.value, 10);
      map.removeControl(control);
      map.addControl(scaleControl());
    }
    function onChangeScaleText() {
      scaleBarText = scaleTextCheckbox.checked;
      map.removeControl(control);
      map.addControl(scaleControl());
    }
    unitsSelect.addEventListener("change", onChange);
    typeSelect.addEventListener("change", onChangeType);
    stepsSelect.addEventListener("change", onChangeSteps);
    scaleTextCheckbox.addEventListener("change", onChangeScaleText);
  },
};
</script>
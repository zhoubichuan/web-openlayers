<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">动作类型 &nbsp;</label>
      <select ref="type" class="form-control">
        <option value="click" selected>点击</option>
        <option value="singleclick">单击</option>
        <option value="pointermove">悬停</option>
        <option value="altclick">Alt+Click</option>
        <option value="none">无</option>
      </select>
      <span id="status">&nbsp;0 selected features</span>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      style: { Fill, Stroke, Style },
      interaction: { Select },
      events: {
        condition: { altKeyOnly, click, pointerMove },
      },
    } = ol;
    const style = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
    });
    const vector = new VectorLayer({
      source: new VectorSource({
        url: "https://openlayers.org/data/vector/ecoregions.json",
        format: new GeoJSON(),
      }),
      background: "white",
      style: function (feature) {
        const color = feature.get("COLOR") || "#eeeeee";
        style.getFill().setColor(color);
        return style;
      },
    });
    const map = new Map({
      layers: [vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    let select = null;
    const selected = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
      stroke: new Stroke({
        color: "rgba(255, 255, 255, 0.7)",
        width: 2,
      }),
    });
    function selectStyle(feature) {
      const color = feature.get("COLOR") || "#eeeeee";
      selected.getFill().setColor(color);
      return selected;
    }
    const selectSingleClick = new Select({ style: selectStyle });
    const selectClick = new Select({
      condition: click,
      style: selectStyle,
    });
    const selectPointerMove = new Select({
      condition: pointerMove,
      style: selectStyle,
    });
    const selectAltClick = new Select({
      style: selectStyle,
      condition: function (mapBrowserEvent) {
        return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
      },
    });
    const selectElement = this.$refs.type;
    const changeInteraction = function () {
      if (select !== null) {
        map.removeInteraction(select);
      }
      const value = selectElement.value;
      if (value == "singleclick") {
        select = selectSingleClick;
      } else if (value == "click") {
        select = selectClick;
      } else if (value == "pointermove") {
        select = selectPointerMove;
      } else if (value == "altclick") {
        select = selectAltClick;
      } else {
        select = null;
      }
      if (select !== null) {
        map.addInteraction(select);
        select.on("select", function (e) {
          document.getElementById("status").innerHTML =
            "&nbsp;" +
            e.target.getFeatures().getLength() +
            " selected features (last operation selected " +
            e.selected.length +
            " and deselected " +
            e.deselected.length +
            " features)";
        });
      }
    };
    selectElement.onchange = changeInteraction;
    changeInteraction();
  },
};
</script>
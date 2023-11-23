<template>
  <div>
    <div ref="map" class="map"></div>
    <select ref="mode">
      <option value="modify">选择要修改的特征</option>
      <option value="draw">画一个新的特征</option>
    </select>
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
      interaction: { Draw, Modify, Select, Snap },
      proj: { useGeographic },
    } = ol;
    useGeographic();

    const source = new VectorSource({
      url: "https://openlayers.org/data/vector/us-states.json",
      format: new GeoJSON(),
    });

    const map = new Map({
      target: this.$refs.map,
      layers: [
        new VectorLayer({
          background: "white",
          source: source,
        }),
      ],
      view: new View({
        center: [-100, 38.5],
        zoom: 4,
      }),
    });

    const select = new Select();

    const modify = new Modify({
      features: select.getFeatures(),
    });

    const draw = new Draw({
      type: "Polygon",
      source: source,
    });

    const snap = new Snap({
      source: source,
    });

    function removeInteractions() {
      map.removeInteraction(modify);
      map.removeInteraction(select);
      map.removeInteraction(draw);
      map.removeInteraction(select);
    }

    const mode = this.$refs.mode;
    function onChange() {
      removeInteractions();
      switch (mode.value) {
        case "draw": {
          map.addInteraction(draw);
          map.addInteraction(snap);
          break;
        }
        case "modify": {
          map.addInteraction(select);
          map.addInteraction(modify);
          map.addInteraction(snap);
          break;
        }
        default: {
          // pass
        }
      }
    }
    mode.addEventListener("change", onChange);
    onChange();
  },
};
</script>
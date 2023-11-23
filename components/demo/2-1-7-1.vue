<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">几何类型 &nbsp;</label>
      <select ref="type">
        <option value="Point">点</option>
        <option value="LineString">直线</option>
        <option value="Polygon">多边形</option>
        <option value="Circle">圆</option>
      </select>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
      interaction: { Draw, Modify, Snap },
      proj: { get },
    } = ol;
    const raster = new TileLayer({
      source: new OSM(),
    });
    const source = new VectorSource();
    const vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });
    const extent = get("EPSG:3857").getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
        extent,
      }),
    });
    map.addInteraction(new Modify({ source: source }));
    let draw, snap;
    const typeSelect = this.$refs.type;
    function addInteractions() {
      draw = new Draw({
        source: source,
        type: typeSelect.value,
      });
      draw.on("drawend", function (e) {
        const geometry = e.feature.getGeometry();
        const corrdinates = geometry.getCoordinates();
        console.log(corrdinates);
        // map.removeInteraction(draw)
        // map.removeInteraction(snap)
      });
      map.addInteraction(draw);
      snap = new Snap({ source: source });
      map.addInteraction(snap);
    }
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      map.removeInteraction(snap);
      addInteractions();
    };
    addInteractions();
  },
};
</script>
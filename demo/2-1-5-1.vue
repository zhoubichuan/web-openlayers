<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">测量方式 &nbsp;</label>
      <select ref="type">
        <option value="length">长度测量</option>
        <option value="area">面积测量</option>
      </select>
    </form>
  </div>
</template>
  
  <script>
let {
  interaction: { Draw },
  Overlay,
  geom: { LineString, Polygon },
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { OSM, Vector: VectorSource },
  style: { Circle: CircleStyle, Fill, Stroke, Style },
  sphere: { getArea, getLength },
  Observable: { unByKey },
} = ol;
export default {
  mounted() {
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
    let sketch;
    let helpTooltipElement;
    let helpTooltip;
    let measureTooltipElement;
    let measureTooltip;
    const continuePolygonMsg = "Click to continue drawing the polygon";
    const continueLineMsg = "Click to continue drawing the line";
    const pointerMoveHandler = function (evt) {
      if (evt.dragging) {
        return;
      }
      let helpMsg = "Click to start drawing";
      if (sketch) {
        const geom = sketch.getGeometry();
        if (geom instanceof Polygon) {
          helpMsg = continuePolygonMsg;
        } else if (geom instanceof LineString) {
          helpMsg = continueLineMsg;
        }
      }
      helpTooltipElement.innerHTML = helpMsg;
      helpTooltip.setPosition(evt.coordinate);
      helpTooltipElement.classList.remove("hidden");
    };
    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vector,
      ],
      target: this.$refs.map,
      view: new View({
        center: [-11000000, 4600000],
        zoom: 15,
      }),
    });
    map.on("pointermove", pointerMoveHandler);
    map.getViewport().addEventListener("mouseout", function () {
      helpTooltipElement.classList.add("hidden");
    });
    const typeSelect = this.$refs.type;
    let draw;
    const formatLength = function (line) {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + " " + "km";
      } else {
        output = Math.round(length * 100) / 100 + " " + "m";
      }
      return output;
    };
    const formatArea = function (polygon) {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output =
          Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
      } else {
        output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
      }
      return output;
    };
    function addInteraction() {
      const type = typeSelect.value == "area" ? "Polygon" : "LineString";
      draw = new Draw({
        source: source,
        type: type,
        style: new Style({
          fill: new Fill({
            color: "rgba(255, 255, 255, 0.2)",
          }),
          stroke: new Stroke({
            color: "rgba(0, 0, 0, 0.5)",
            lineDash: [10, 10],
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: "rgba(0, 0, 0, 0.7)",
            }),
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.2)",
            }),
          }),
        }),
      });
      map.addInteraction(draw);
      createMeasureTooltip();
      createHelpTooltip();
      let listener;
      draw.on("drawstart", function (evt) {
        sketch = evt.feature;
        let tooltipCoord = evt.coordinate;
        listener = sketch.getGeometry().on("change", function (evt) {
          const geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          measureTooltipElement.innerHTML = output;
          measureTooltip.setPosition(tooltipCoord);
        });
      });
      draw.on("drawend", function () {
        measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
        measureTooltip.setOffset([0, -7]);
        sketch = null;
        measureTooltipElement = null;
        createMeasureTooltip();
        unByKey(listener);
      });
    }
    function createHelpTooltip() {
      if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
      }
      helpTooltipElement = document.createElement("div");
      helpTooltipElement.className = "ol-tooltip hidden";
      helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: "center-left",
      });
      map.addOverlay(helpTooltip);
    }
    function createMeasureTooltip() {
      if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
      }
      measureTooltipElement = document.createElement("div");
      measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
      measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
        stopEvent: false,
        insertFirst: false,
      });
      map.addOverlay(measureTooltip);
    }
    typeSelect.onchange = function () {
      map.removeInteraction(draw);
      addInteraction();
    };
    addInteraction();
  },
};
</script>
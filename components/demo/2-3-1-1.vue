<template>
  <div>
    <div ref="map" class="map"></div>
    <div class="edit-form">
      <input id="refresh-points" type="button" value="Refresh" />
      <h2>Points</h2>
      <div class="edit-form-elem">
        <label for="points-text">Text: </label>
        <select id="points-text">
          <option value="hide">Hide</option>
          <option value="normal">Normal</option>
          <option value="shorten" selected="selected">Shorten</option>
          <option value="wrap">Wrap</option>
        </select>
        <br />
        <label for="points-maxreso" title="Max Resolution Denominator"
          >MaxReso.:
        </label>
        <select id="points-maxreso">
          <option value="38400">38,400</option>
          <option value="19200">19,200</option>
          <option value="9600">9,600</option>
          <option value="4800">4,800</option>
          <option value="2400">2,400</option>
          <option value="1200" selected="selected">1,200</option>
          <option value="600">600</option>
          <option value="300">300</option>
          <option value="150">150</option>
          <option value="75">75</option>
          <option value="32">32</option>
          <option value="16">16</option>
          <option value="8">8</option>
        </select>
        <br />
        <label for="points-align">Align: </label>
        <select id="points-align">
          <option value="center" selected="selected">Center</option>
          <option value="end">End</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="start">Start</option>
        </select>
        <br />
        <label for="points-baseline">Baseline: </label>
        <select id="points-baseline">
          <option value="alphabetic">Alphabetic</option>
          <option value="bottom">Bottom</option>
          <option value="hanging">Hanging</option>
          <option value="ideographic">Ideographic</option>
          <option value="middle" selected="selected">Middle</option>
          <option value="top">Top</option>
        </select>
        <br />
        <label for="points-rotation">Rotation: </label>
        <select id="points-rotation">
          <option value="0">0°</option>
          <option value="0.785398164">45°</option>
          <option value="1.570796327">90°</option>
        </select>
        <br />
        <label for="points-font">Font: </label>
        <select id="points-font">
          <option value="Arial" selected="selected">Arial</option>
          <option value="'Courier New'">Courier New</option>
          <option value="'Open Sans'">Open Sans</option>
          <option value="Verdana">Verdana</option>
        </select>
        <br />
        <label for="points-weight">Weight: </label>
        <select id="points-weight">
          <option value="bold">Bold</option>
          <option value="normal" selected="selected">Normal</option>
        </select>
        <br />
        <label for="points-placement">Placement: </label>
        <select disabled id="points-placement">
          <option value="line">Line</option>
          <option value="point" selected="selected">Point</option>
        </select>
        <br />
        <label for="points-maxangle">Max Angle: </label>
        <select disabled id="points-maxangle">
          <option value="0.7853981633974483" selected="selected">45°</option>
          <option value="2.0943951023931953">120°</option>
          <option value="6.283185307179586">360°</option>
        </select>
        <br />
        <label for="points-overflow">Exceed Len: </label>
        <select disabled id="points-overflow">
          <option value="true">True</option>
          <option value="false" selected="selected">False</option>
        </select>
        <br />
        <label for="points-size">Size: </label>
        <input type="text" value="12px" id="points-size" />
        <br />
        <label for="points-height">Line height: </label>
        <input type="text" value="1" id="points-height" />
        <br />
        <label for="points-offset-x">Offset X: </label>
        <input type="text" value="0" id="points-offset-x" />
        <br />
        <label for="points-offset-y">Offset Y: </label>
        <input type="text" value="0" id="points-offset-y" />
        <br />
        <label for="points-color">Color: </label>
        <input type="text" value="#aa3300" id="points-color" />
        <br />
        <label for="points-outline" title="Outline Color">O. Color: </label>
        <input type="text" value="#ffffff" id="points-outline" />
        <br />
        <label for="points-outline-width" title="Outline Width"
          >O. Width:
        </label>
        <input type="text" value="3" id="points-outline-width" />
      </div>
    </div>

    <div class="edit-form">
      <input id="refresh-lines" type="button" value="Refresh" />
      <h2>Lines</h2>
      <div class="edit-form-elem">
        <label for="lines-text">Text: </label>
        <select id="lines-text">
          <option value="hide">Hide</option>
          <option value="normal">Normal</option>
          <option value="shorten">Shorten</option>
          <option value="wrap" selected="selected">Wrap</option>
        </select>
        <br />
        <label for="lines-maxreso" title="Max Resolution Denominator"
          >MaxReso.:
        </label>
        <select id="lines-maxreso">
          <option value="38400">38,400</option>
          <option value="19200">19,200</option>
          <option value="9600">9,600</option>
          <option value="4800">4,800</option>
          <option value="2400">2,400</option>
          <option value="1200" selected="selected">1,200</option>
          <option value="600">600</option>
          <option value="300">300</option>
          <option value="150">150</option>
          <option value="75">75</option>
          <option value="32">32</option>
          <option value="16">16</option>
          <option value="8">8</option>
        </select>
        <br />
        <label for="lines-align">Align: </label>
        <select id="lines-align">
          <option value="" selected="selected"></option>
          <option value="center">Center</option>
          <option value="end">End</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="start">Start</option>
        </select>
        <br />
        <label for="lines-baseline">Baseline: </label>
        <select id="lines-baseline">
          <option value="alphabetic">Alphabetic</option>
          <option value="bottom">Bottom</option>
          <option value="hanging">Hanging</option>
          <option value="ideographic">Ideographic</option>
          <option value="middle" selected="selected">Middle</option>
          <option value="top">Top</option>
        </select>
        <br />
        <label for="lines-rotation">Rotation: </label>
        <select id="lines-rotation">
          <option value="0">0°</option>
          <option value="0.785398164">45°</option>
          <option value="1.570796327">90°</option>
        </select>
        <br />
        <label for="lines-font">Font: </label>
        <select id="lines-font">
          <option value="Arial">Arial</option>
          <option value="'Courier New'" selected="selected">Courier New</option>
          <option value="'Open Sans'">Open Sans</option>
          <option value="Verdana">Verdana</option>
        </select>
        <br />
        <label for="lines-weight">Weight: </label>
        <select id="lines-weight">
          <option value="bold" selected="selected">Bold</option>
          <option value="normal">Normal</option>
        </select>
        <br />
        <label for="lines-placement">Placement: </label>
        <select id="lines-placement">
          <option value="line">Line</option>
          <option value="point" selected="selected">Point</option>
        </select>
        <br />
        <label for="lines-maxangle">Max Angle: </label>
        <select id="lines-maxangle">
          <option value="0.7853981633974483" selected="selected">45°</option>
          <option value="2.0943951023931953">120°</option>
          <option value="6.283185307179586">360°</option>
        </select>
        <br />
        <label for="lines-overflow">Exceed Len: </label>
        <select id="lines-overflow">
          <option value="true">True</option>
          <option value="false" selected="selected">False</option>
        </select>
        <br />
        <label for="lines-size">Size: </label>
        <input type="text" value="12px" id="lines-size" />
        <br />
        <label for="lines-height">Line height: </label>
        <input type="text" value="1.2" id="lines-height" />
        <br />
        <label for="lines-offset-x">Offset X: </label>
        <input type="text" value="0" id="lines-offset-x" />
        <br />
        <label for="lines-offset-y">Offset Y: </label>
        <input type="text" value="0" id="lines-offset-y" />
        <br />
        <label for="lines-color">Color: </label>
        <input type="text" value="green" id="lines-color" />
        <br />
        <label for="lines-outline" title="Outline Color">O. Color: </label>
        <input type="text" value="#ffffff" id="lines-outline" />
        <br />
        <label for="lines-outline-width" title="Outline Width"
          >O. Width:
        </label>
        <input type="text" value="3" id="lines-outline-width" />
      </div>
    </div>

    <div class="edit-form">
      <input id="refresh-polygons" type="button" value="Refresh" />
      <h2>Polygons</h2>
      <div class="edit-form-elem">
        <label for="polygons-text">Text: </label>
        <select id="polygons-text">
          <option value="hide">Hide</option>
          <option value="normal" selected="selected">Normal</option>
          <option value="shorten">Shorten</option>
          <option value="wrap">Wrap</option>
        </select>
        <br />
        <label for="polygons-maxreso" title="Max Resolution Denominator"
          >MaxReso.:
        </label>
        <select id="polygons-maxreso">
          <option value="38400">38,400</option>
          <option value="19200">19,200</option>
          <option value="9600">9,600</option>
          <option value="4800">4,800</option>
          <option value="2400">2,400</option>
          <option value="1200" selected="selected">1,200</option>
          <option value="600">600</option>
          <option value="300">300</option>
          <option value="150">150</option>
          <option value="75">75</option>
          <option value="32">32</option>
          <option value="16">16</option>
          <option value="8">8</option>
        </select>
        <br />
        <label for="polygons-align">Align: </label>
        <select id="polygons-align">
          <option value="" selected="selected"></option>
          <option value="center">Center</option>
          <option value="end">End</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="start">Start</option>
        </select>
        <br />
        <label for="polygons-baseline">Baseline: </label>
        <select id="polygons-baseline">
          <option value="alphabetic">Alphabetic</option>
          <option value="bottom">Bottom</option>
          <option value="hanging">Hanging</option>
          <option value="ideographic">Ideographic</option>
          <option value="middle" selected="selected">Middle</option>
          <option value="top">Top</option>
        </select>
        <br />
        <label for="polygons-rotation">Rotation: </label>
        <select id="polygons-rotation">
          <option value="0">0°</option>
          <option value="0.785398164">45°</option>
          <option value="1.570796327">90°</option>
        </select>
        <br />
        <label for="polygons-font">Font: </label>
        <select id="polygons-font">
          <option value="Arial">Arial</option>
          <option value="'Courier New'">Courier New</option>
          <option value="'Open Sans'">Open Sans</option>
          <option value="Verdana" selected="selected">Verdana</option>
        </select>
        <br />
        <label for="polygons-weight">Weight: </label>
        <select id="polygons-weight">
          <option value="bold" selected="selected">Bold</option>
          <option value="normal">Normal</option>
        </select>
        <br />
        <label for="polygons-placement">Placement: </label>
        <select id="polygons-placement">
          <option value="line">Line</option>
          <option value="point" selected="selected">Point</option>
        </select>
        <br />
        <label for="polygons-maxangle">Max Angle: </label>
        <select id="polygons-maxangle">
          <option value="0.7853981633974483" selected="selected">45°</option>
          <option value="2.0943951023931953">120°</option>
          <option value="6.283185307179586">360°</option>
        </select>
        <br />
        <label for="polygons-overflow">Exceed Len: </label>
        <select id="polygons-overflow">
          <option value="true">True</option>
          <option value="false" selected="selected">False</option>
        </select>
        <br />
        <label for="polygons-size">Size: </label>
        <input type="text" value="10px" id="polygons-size" />
        <br />
        <label for="polygons-height">Line height: </label>
        <input type="text" value="1" id="polygons-height" />
        <br />
        <label for="polygons-offset-x">Offset X: </label>
        <input type="text" value="0" id="polygons-offset-x" />
        <br />
        <label for="polygons-offset-y">Offset Y: </label>
        <input type="text" value="0" id="polygons-offset-y" />
        <br />
        <label for="polygons-color">Color: </label>
        <input type="text" value="blue" id="polygons-color" />
        <br />
        <label for="polygons-outline" title="Outline Color">O. Color: </label>
        <input type="text" value="#ffffff" id="polygons-outline" />
        <br />
        <label for="polygons-outline-width" title="Outline Width"
          >O. Width:
        </label>
        <input type="text" value="3" id="polygons-outline-width" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style, Text },
    } = ol;

    let openSansAdded = false;

    const myDom = {
      points: {
        text: document.getElementById("points-text"),
        align: document.getElementById("points-align"),
        baseline: document.getElementById("points-baseline"),
        rotation: document.getElementById("points-rotation"),
        font: document.getElementById("points-font"),
        weight: document.getElementById("points-weight"),
        size: document.getElementById("points-size"),
        height: document.getElementById("points-height"),
        offsetX: document.getElementById("points-offset-x"),
        offsetY: document.getElementById("points-offset-y"),
        color: document.getElementById("points-color"),
        outline: document.getElementById("points-outline"),
        outlineWidth: document.getElementById("points-outline-width"),
        maxreso: document.getElementById("points-maxreso"),
      },
      lines: {
        text: document.getElementById("lines-text"),
        align: document.getElementById("lines-align"),
        baseline: document.getElementById("lines-baseline"),
        rotation: document.getElementById("lines-rotation"),
        font: document.getElementById("lines-font"),
        weight: document.getElementById("lines-weight"),
        placement: document.getElementById("lines-placement"),
        maxangle: document.getElementById("lines-maxangle"),
        overflow: document.getElementById("lines-overflow"),
        size: document.getElementById("lines-size"),
        height: document.getElementById("lines-height"),
        offsetX: document.getElementById("lines-offset-x"),
        offsetY: document.getElementById("lines-offset-y"),
        color: document.getElementById("lines-color"),
        outline: document.getElementById("lines-outline"),
        outlineWidth: document.getElementById("lines-outline-width"),
        maxreso: document.getElementById("lines-maxreso"),
      },
      polygons: {
        text: document.getElementById("polygons-text"),
        align: document.getElementById("polygons-align"),
        baseline: document.getElementById("polygons-baseline"),
        rotation: document.getElementById("polygons-rotation"),
        font: document.getElementById("polygons-font"),
        weight: document.getElementById("polygons-weight"),
        placement: document.getElementById("polygons-placement"),
        maxangle: document.getElementById("polygons-maxangle"),
        overflow: document.getElementById("polygons-overflow"),
        size: document.getElementById("polygons-size"),
        height: document.getElementById("polygons-height"),
        offsetX: document.getElementById("polygons-offset-x"),
        offsetY: document.getElementById("polygons-offset-y"),
        color: document.getElementById("polygons-color"),
        outline: document.getElementById("polygons-outline"),
        outlineWidth: document.getElementById("polygons-outline-width"),
        maxreso: document.getElementById("polygons-maxreso"),
      },
    };

    const getText = function (feature, resolution, dom) {
      const type = dom.text.value;
      const maxResolution = dom.maxreso.value;
      let text = feature.get("name");

      if (resolution > maxResolution) {
        text = "";
      } else if (type == "hide") {
        text = "";
      } else if (type == "shorten") {
        text = text.trunc(12);
      } else if (
        type == "wrap" &&
        (!dom.placement || dom.placement.value != "line")
      ) {
        text = stringDivider(text, 16, "\n");
      }

      return text;
    };

    const createTextStyle = function (feature, resolution, dom) {
      const align = dom.align.value;
      const baseline = dom.baseline.value;
      const size = dom.size.value;
      const height = dom.height.value;
      const offsetX = parseInt(dom.offsetX.value, 10);
      const offsetY = parseInt(dom.offsetY.value, 10);
      const weight = dom.weight.value;
      const placement = dom.placement ? dom.placement.value : undefined;
      const maxAngle = dom.maxangle
        ? parseFloat(dom.maxangle.value)
        : undefined;
      const overflow = dom.overflow ? dom.overflow.value == "true" : undefined;
      const rotation = parseFloat(dom.rotation.value);
      if (dom.font.value == "'Open Sans'" && !openSansAdded) {
        const openSans = document.createElement("link");
        openSans.href = "https://fonts.googleapis.com/css?family=Open+Sans";
        openSans.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(openSans);
        openSansAdded = true;
      }
      const font = weight + " " + size + "/" + height + " " + dom.font.value;
      const fillColor = dom.color.value;
      const outlineColor = dom.outline.value;
      const outlineWidth = parseInt(dom.outlineWidth.value, 10);

      return new Text({
        textAlign: align == "" ? undefined : align,
        textBaseline: baseline,
        font: font,
        text: getText(feature, resolution, dom),
        fill: new Fill({ color: fillColor }),
        stroke: new Stroke({ color: outlineColor, width: outlineWidth }),
        offsetX: offsetX,
        offsetY: offsetY,
        placement: placement,
        maxAngle: maxAngle,
        overflow: overflow,
        rotation: rotation,
      });
    };

    // Polygons
    function polygonStyleFunction(feature, resolution) {
      return new Style({
        stroke: new Stroke({
          color: "blue",
          width: 1,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
        text: createTextStyle(feature, resolution, myDom.polygons),
      });
    }

    const vectorPolygons = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/geojson/polygon-samples.geojson"),
        format: new GeoJSON(),
      }),
      style: polygonStyleFunction,
    });

    // Lines
    function lineStyleFunction(feature, resolution) {
      return new Style({
        stroke: new Stroke({
          color: "green",
          width: 2,
        }),
        text: createTextStyle(feature, resolution, myDom.lines),
      });
    }

    const vectorLines = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/geojson/line-samples.geojson"),
        format: new GeoJSON(),
      }),
      style: lineStyleFunction,
    });

    // Points
    function pointStyleFunction(feature, resolution) {
      return new Style({
        image: new CircleStyle({
          radius: 10,
          fill: new Fill({ color: "rgba(255, 0, 0, 0.1)" }),
          stroke: new Stroke({ color: "red", width: 1 }),
        }),
        text: createTextStyle(feature, resolution, myDom.points),
      });
    }

    const vectorPoints = new VectorLayer({
      source: new VectorSource({
        url: this.$withBase("/data/geojson/point-samples.geojson"),
        format: new GeoJSON(),
      }),
      style: pointStyleFunction,
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorPolygons,
        vectorLines,
        vectorPoints,
      ],
      target: this.$refs.map,
      view: new View({
        center: [-8161939, 6095025],
        zoom: 8,
      }),
    });

    document
      .getElementById("refresh-points")
      .addEventListener("click", function () {
        vectorPoints.setStyle(pointStyleFunction);
      });

    document
      .getElementById("refresh-lines")
      .addEventListener("click", function () {
        vectorLines.setStyle(lineStyleFunction);
      });

    document
      .getElementById("refresh-polygons")
      .addEventListener("click", function () {
        vectorPolygons.setStyle(polygonStyleFunction);
      });

    /**
     * @param {number} n The max number of characters to keep.
     * @return {string} Truncated string.
     */
    String.prototype.trunc =
      String.prototype.trunc ||
      function (n) {
        return this.length > n ? this.substr(0, n - 1) + "..." : this.substr(0);
      };

    // https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
    function stringDivider(str, width, spaceReplacer) {
      if (str.length > width) {
        let p = width;
        while (p > 0 && str[p] != " " && str[p] != "-") {
          p--;
        }
        if (p > 0) {
          let left;
          if (str.substring(p, p + 1) == "-") {
            left = str.substring(0, p + 1);
          } else {
            left = str.substring(0, p);
          }
          const right = str.substring(p + 1);
          return (
            left + spaceReplacer + stringDivider(right, width, spaceReplacer)
          );
        }
      }
      return str;
    }
  },
};
</script>
<style>
.edit-form {
  display: inline-block;
  margin: 5px;
  padding: 10px;
  border: 1px solid black;
  white-space: nowrap;
}
.edit-form h2 {
  font-size: 1.5em;
}
.edit-form input[type="button"] {
  float: right;
}
.edit-form-elem label {
  display: inline-block;
  width: 85px;
}
.edit-form-elem input[type="text"],
.edit-form-elem select {
  width: 130px;
}
</style>
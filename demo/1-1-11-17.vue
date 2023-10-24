<template>
  <div>
    <div ref="map" class="map"></div>
    <form ref="optionsform" autocomplete="off">
      <div class="radio">
        <label>
          <input
            type="radio"
            name="interaction"
            value="draw"
            ref="draw"
            checked
          />
          编辑 &nbsp;
        </label>
        <select name="drawtype" ref="drawtype">
          <option value="Point">点</option>
          <option value="LineString">直线</option>
          <option value="Polygon">多边形</option>
          <option value="Circle">圆</option>
        </select>
      </div>
      <div class="radio">
        <label>
          <input type="radio" name="interaction" value="modify" />
          查看 &nbsp;
        </label>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      interaction: { Draw, Modify, Select, Snap },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
    } = ol;

    const raster = new TileLayer({
      source: new OSM(),
    });

    const vector = new VectorLayer({
      source: new VectorSource(),
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
    const map = new Map({
      layers: [raster, vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
      }),
    });
    const ExampleModify = {
      init: function () {
        this.select = new Select();
        map.addInteraction(this.select);
        this.modify = new Modify({
          features: this.select.getFeatures(),
        });
        map.addInteraction(this.modify);
        this.setEvents();
      },
      setEvents: function () {
        const selectedFeatures = this.select.getFeatures();
        this.select.on("change:active", function () {
          selectedFeatures.forEach(function (each) {
            selectedFeatures.remove(each);
          });
        });
      },
      setActive: function (active) {
        this.select.setActive(active);
        this.modify.setActive(active);
      },
    };
    ExampleModify.init();
    const optionsForm = this.$refs.optionsform;
    const ExampleDraw = {
      init: function () {
        map.addInteraction(this.Point);
        this.Point.setActive(false);
        map.addInteraction(this.LineString);
        this.LineString.setActive(false);
        map.addInteraction(this.Polygon);
        this.Polygon.setActive(false);
        map.addInteraction(this.Circle);
        this.Circle.setActive(false);
      },
      Point: new Draw({
        source: vector.getSource(),
        type: "Point",
      }),
      LineString: new Draw({
        source: vector.getSource(),
        type: "LineString",
      }),
      Polygon: new Draw({
        source: vector.getSource(),
        type: "Polygon",
      }),
      Circle: new Draw({
        source: vector.getSource(),
        type: "Circle",
      }),
      activeDraw: null,
      setActive: function (active) {
        if (this.activeDraw) {
          this.activeDraw.setActive(false);
          this.activeDraw = null;
        }
        if (active) {
          const type = optionsForm.elements["drawtype"].value;
          this.activeDraw = this[type];
          this.activeDraw.setActive(true);
        }
      },
    };
    ExampleDraw.init();
    optionsForm.onchange = function (e) {
      const type = e.target.getAttribute("name");
      if (type == "draw-type") {
        ExampleModify.setActive(false);
        ExampleDraw.setActive(true);
        optionsForm.elements["interaction"].value = "draw";
      } else if (type == "interaction") {
        const interactionType = e.target.value;
        if (interactionType == "modify") {
          ExampleDraw.setActive(false);
          ExampleModify.setActive(true);
        } else if (interactionType == "draw") {
          ExampleDraw.setActive(true);
          ExampleModify.setActive(false);
        }
      }
    };
    ExampleDraw.setActive(true);
    ExampleModify.setActive(false);
    const snap = new Snap({
      source: vector.getSource(),
    });
    map.addInteraction(snap);
  },
};
</script>
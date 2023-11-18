<template>
  <div>
    <div ref="map" class="map"></div>
    <div>
      <span ref="status">尝试单击地图中的线:{{ text }}</span>
      <form class="form-inline">
        <label for="hitTolerance">选择特征的命中公差: &nbsp;</label>
        <select ref="hitTolerance" class="form-control">
          <option value="0" selected>0 像素</option>
          <option value="5">5 像素</option>
          <option value="10">10 像素</option>
        </select>
        &nbsp; Area: &nbsp;
        <canvas id="circle" style="vertical-align: middle" />
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  async mounted() {
    let {
      Feature,
      geom: { LineString },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { Stamen, Vector: VectorSource },
      style: { Stroke, Style },
    } = ol;
    // 获取轨迹点
    let res = await this.$axios({
      type: "get",
      url: this.$withBase("/data/1.json"),
    });
    const style = new Style({
      stroke: new Stroke({
        color: "red",
        width: 1,
      }),
    });
    const feature = new Feature(new LineString(res.data));
    const map = new Map({
      layers: [
        new TileLayer({
          source: new Stamen({
            layer: "watercolor",
          }),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [feature],
          }),
          style: style,
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [13451034.958002912, 3594986.8806004445],
        zoom: 15,
      }),
    });
    let hitTolerance;
    map.on("singleclick", function (e) {
      let hit = false;
      map.forEachFeatureAtPixel(
        e.pixel,
        function () {
          hit = true;
        },
        {
          hitTolerance: hitTolerance,
        }
      );
      if (hit) {
        style.getStroke().setColor("green");
        this.text = "A feature got hit!";
      } else {
        style.getStroke().setColor("black");
        this.text = "No feature got hit.";
      }
      feature.changed();
    });
    const circleCanvas = document.getElementById("circle");
    const changeHitTolerance = function () {
      hitTolerance = parseInt(this.$refs.hitTolerance.value, 10);
      const size = 2 * hitTolerance + 2;
      circleCanvas.width = size;
      circleCanvas.height = size;
      const ctx = circleCanvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath();
      ctx.arc(
        hitTolerance + 1,
        hitTolerance + 1,
        hitTolerance + 0.5,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
    };
    this.$refs.hitTolerance.onchange = changeHitTolerance;
    changeHitTolerance();
  },
};
</script>
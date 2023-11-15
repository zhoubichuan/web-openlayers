<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">选择数据源 &nbsp;</label>
      <select ref="select" v-model="selected">
        <option value="line-samples.geojson">线类型</option>
        <option value="all.geojson">所有类型</option>
        <option value="photovoltaic.json">绘制</option>
        <option value="point-samples.geojson">点类型</option>
        <option value="polygon-samples.geojson">绘制</option>
        <option value="roads-seoul.geojson">修改</option>
        <option value="switzerland.geojson">修改</option>
        <option value="vienna-streets.geojson">绘制</option>
        <option value="world-cities.geojson">修改</option>
      </select>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "",
    };
  },
  async mounted() {
    let {
      Feature,
      geom: { Circle },
      format: { GeoJSON },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
    } = ol;
    // 获取轨迹点
    let res = await this.$axios({
      type: "get",
      url: this.$withBase(
        `/data/geojson/${localStorage.geojson || "line-samples.geojson"}`
      ),
    });
    const geojsonObject = res.data;
    const image = new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({ color: "red", width: 1 }),
    });

    const styles = {
      Point: new Style({
        image: image,
      }),
      LineString: new Style({
        stroke: new Stroke({
          color: "green",
          width: 1,
        }),
      }),
      MultiLineString: new Style({
        stroke: new Stroke({
          color: "green",
          width: 1,
        }),
      }),
      MultiPoint: new Style({
        image: image,
      }),
      MultiPolygon: new Style({
        stroke: new Stroke({
          color: "yellow",
          width: 1,
        }),
        fill: new Fill({
          color: "rgba(255, 255, 0, 0.1)",
        }),
      }),
      Polygon: new Style({
        stroke: new Stroke({
          color: "blue",
          lineDash: [4],
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
      GeometryCollection: new Style({
        stroke: new Stroke({
          color: "magenta",
          width: 2,
        }),
        fill: new Fill({
          color: "magenta",
        }),
        image: new CircleStyle({
          radius: 10,
          fill: null,
          stroke: new Stroke({
            color: "magenta",
          }),
        }),
      }),
      Circle: new Style({
        stroke: new Stroke({
          color: "red",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(255,0,0,0.2)",
        }),
      }),
    };
    const styleFunction = function (feature) {
      return styles[feature.getGeometry().getType()];
    };
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject), // geojson --> feature
    });
    vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    this.$refs.select.addEventListener(
      "change",
      function getDataSource(e) {
        this.selected = localStorage.geojson = e.target.value;
      },
      false
    );
    this.selected = localStorage.geojson || "line-samples.geojson";
  },
};
</script>
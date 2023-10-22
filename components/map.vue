<template>
  <div class="wrap-map">
    <div ref="map" class="map"></div>
    <div class="data-select">
      <input v-model="dataUrl" />
      <button @click="handlerChangeData">切换数据</button>
    </div>
  </div>
</template>
  
  <script>
const labelRight = {
  position: "right",
};
export default {
  name: "WebMap",
  props: {
    config: {
      type: Function,
    },
    data: {
      type: [Array, Object],
      default: () => [],
    },
    params: {
      type: Object,
    },
    styles: {
      type: String,
      default: "height: 100%;width:800px;",
    },
    title: {
      type: [Array, Object],
      default: () => [
        {
          text: "统计数据",
          subtext: "单位：个",
        },
      ],
    },
    tooltip: {
      type: [Array, Object],
      default: () => [
        {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
      ],
    },
    grid: {
      type: [Array, Object],
      default: () => [
        {
          top: "250",
          bottom: 30,
        },
      ],
    },
    legend: {
      type: [Array, Object],
      default: () => [
        {
          orient: "vertical",
          left: "0%",
          top: "0%",
          bottom: "center",
          data: ["<10w", "10w-50w", "50w-100w", "100w-500w", ">500w"],
        },
      ],
    },
    xAxis: {
      type: [Array, Object],
      default: () => [
        {
          show: false,
        },
      ],
    },
    yAxis: {
      type: [Array, Object],
      default: () => [
        {
          show: false,
        },
      ],
    },
    series: {
      type: [Array, Object],
      default: () => [
        {
          type: "pie",
          radius: ["58%", "68%"],
        },
      ],
    },
  },
  data() {
    return {
      dataUrl: "",
      option: {
        title: this.titleTransform(this.title),
        tooltip: this.tooltip,
        grid: this.grid,
        legend: this.legend,
        series: this.series,
        mapInstance: "",
      },
    };
  },
  methods: {
    handlerChangeData() {
      this.$emit("changeData", this.dataUrl);
    },
    titleTransform({ text, subtext, ...others }) {
      let arr = [];
      let target = {};
      if (text) {
        target = {
          text: "{style1|}{style2|}{style3|}" + text,
          textStyle: {
            fontWeight: "800",
            color: "#333",
            fontSize: 18,
            rich: {
              style1: {
                height: 20,
                width: 4,
                backgroundColor: "#2d65f2",
              },
              style2: {
                height: 20,
                width: 4,
                backgroundColor: "#b2c2ff",
              },
              style3: {
                width: 10,
              },
            },
          },
          left: 0,
          top: 0,
          ...others,
        };
        arr.push(target);
      }
      if (subtext) {
        target = {
          subtext: "{style1|}" + subtext,
          subtextStyle: {
            align: "right",
            verticalAlign: "top",
            color: "#666",
            fontSize: "18",
            rich: {
              style1: {},
            },
          },
          right: 0,
          top: -10,
          ...others,
        };
      }
      arr.push(target);
      return arr;
    },
    mapGetOption(val) {
      if (!this.config) {
        return {
          ...this.option,
          title: this.option.title
            ? this.titleTransform(this.option.title)
            : [],
        };
      } else {
        let { title, ...option } = this.config(val, this.mapInstance);
        return {
          title: title ? this.titleTransform(title) : [],
          ...option,
        };
      }
    },
    mapSetOption(options) {
      this.mapInstance.setOption(options);
    },
    handlerClick(Map) {
      Map.getZr().on(
        "click",
        function (params) {
          var pixelPoint = [params.offsetX, params.offsetY];
          var dataPoint = Map.convertFromPixel({ geoIndex: 0 }, pixelPoint);
          this.$emit("click", Map);
        }.bind(this)
      );
    },
    handlerOutSideClick(Map) {
      Map.getZr().on(
        "click",
        function (params) {
          var pixelPoint = [params.offsetX, params.offsetY];
          var dataPoint = Map.convertFromPixel({ geoIndex: 0 }, pixelPoint);
          this.$emit("click", Map);
        }.bind(this)
      );
    },
    handlerResize(Map) {
      Map.getZr().on(
        "click",
        function (params) {
          var pixelPoint = [params.offsetX, params.offsetY];
          var dataPoint = Map.convertFromPixel({ geoIndex: 0 }, pixelPoint);
          this.$emit("click", Map);
        }.bind(this)
      );
    },
    handlerScaleMove(Map) {
      Map.getZr().on(
        "click",
        function (params) {
          var pixelPoint = [params.offsetX, params.offsetY];
          var dataPoint = Map.convertFromPixel({ geoIndex: 0 }, pixelPoint);
          this.$emit("click", Map);
        }.bind(this)
      );
    },
  },
  beforeCreate() {
    this.$emit("mapBeforeCreate", this.$echarts);
  },
  created() {
    this.option = this.mapGetOption(this.data);
    if (Array.isArray(this.option.geo)) {
      if (this.option.geo[0].map === "world") {
        this.$echarts.registerMap("world", this.$world);
        this.option.geo[0].nameMap = require("./nameMap").default;
      } else {
        this.$echarts.registerMap("china", this.$china);
      }
    } else {
      if (this.option.geo.map === "world") {
        this.$echarts.registerMap("world", this.$world);
        this.option.geo.nameMap = require("./nameMap").default;
      } else {
        this.$echarts.registerMap("china", this.$china);
      }
    }
    this.$emit("mapCreated", this.$echarts);
  },
  beforeMount() {
    this.$emit("mapBeforeMount", this.$echarts);
  },
  mounted() {
    this.mapInstance = this.$echarts.init(this.$refs.map);
    this.mapSetOption(this.option);
    this.$emit("echarts", this.mapInstance);
    this.handlerClick(this.mapInstance);
    this.handlerOutSideClick(this.mapInstance);
    this.handlerResize(this.mapInstance);
    this.handlerScaleMove(this.mapInstance);
  },
  beforeUpdate() {
    this.$emit("mapBeforeUpdate", this.$echarts);
  },
  updated() {
    this.$emit("mapUpdated", this.$echarts);
  },
  beforeDestroy() {
    this.$emit("mapBeforeDestroy", this.$echarts);
  },
  destroyed() {
    this.$emit("mapDestroyed", this.$echarts);
  },
  watch: {
    data: {
      handler(val) {
        if (!val.length || !this.mapInstance) return;
        this.mapSetOption(this.mapGetOption(val));
      },
      deep: true,
    },
    params: {
      handler(val) {
        if (!val.length || !this.mapInstance) return;
        this.mapSetOption(this.mapGetOption(val));
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap-map {
  height: 100%;
  width: 100%;
  position: relative;
  .map {
    height: 100%;
    width: 100%;
  }
  .data-select {
    position: absolute;
  }
}
</style>
<template>
  <div ref="line" style="height: 100%"></div>
</template>
  
  <script>
const labelRight = {
  position: "right",
};
export default {
  name: "WebLine",
  props: {
    config: {
      type: Function,
    },
    data: {
      type: [Array, Object],
      default: () => [],
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
          type: "value",
          position: "top",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
      ],
    },
    yAxis: {
      type: [Array, Object],
      default: () => [
        {
          type: "category",
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: [
            "ten",
            "nine",
            "eight",
            "seven",
            "six",
            "five",
            "four",
            "three",
            "two",
            "one",
          ],
        },
      ],
    },
    series: {
      type: [Array, Object],
      default: () => [
        {
          name: "Cost",
          type: "line",
          stack: "Total",
          label: {
            show: true,
            formatter: "{b}",
          },
          data: [
            { value: -0.07, label: labelRight },
            { value: -0.09, label: labelRight },
            0.2,
            0.44,
            { value: -0.23, label: labelRight },
            0.08,
            { value: -0.17, label: labelRight },
            0.47,
            { value: -0.36, label: labelRight },
            0.18,
          ],
        },
      ],
    },
  },
  data() {
    return {
      option: {
        title: this.title ? this.titleTransform(this.title) : [],
        tooltip: this.tooltip,
        grid: this.grid,
        legend: this.legend,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: this.series,
      },
      charts: null,
    };
  },
  methods: {
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
  },
  mounted() {
    this.charts = this.$echarts.init(this.$refs.line);
    if (!this.config) {
      this.charts.setOption(this.option);
    }
  },
  watch: {
    data: {
      handler(val) {
        let { title, ...option } = this.config(val);
        this.charts.setOption({
          title: title ? this.titleTransform(title) : [],
          ...option,
        });
      },
      deep: true,
    },
  },
};
</script>
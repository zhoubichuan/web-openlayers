<template>
  <div ref="bar" style="styles"></div>
</template>
  
  <script>
const labelRight = {
  position: "right",
};
export default {
  name: "WebPolar",
  props: {
    styles: {
      type: String,
      default: "height: 100%",
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
          top: 80,
          bottom: 30,
        },
      ],
    },
    angleAxis: {
      type: [Array, Object],
      default: () => [
      {
          max: 2,
          startAngle: 30,
          splitLine: {
            show: false,
          },
        }
      ],
    },
    radiusAxis: {
      type: [Array, Object],
      default: () => [
      {
          type: "category",
          data: ["v", "w", "x", "y", "z"],
          z: 10,
        }
      ],
    },
    polar: {
      type: [Array, Object],
      default: () => [
        {
  
        },
      ],
    },
    legend: {
      type: [Array, Object],
      default: () => [
        {
  
        },
      ],
    },
    series: {
      type: [Array, Object],
      default: () => [
        {
          name: "Cost",
          type: "bar",
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
        title: this.title,
        tooltip: this.tooltip,
        angleAxis:this.angleAxis,
        radiusAxis:this.radiusAxis,
        polar:this.polar,
        legend:this.legend,
        grid: this.grid,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: this.series,
      },
    };
  },
  mounted() {
    let charts = this.$echarts.init(this.$refs.bar);
    charts.setOption(this.option);
  },
};
</script>
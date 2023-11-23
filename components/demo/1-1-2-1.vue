
<template>
  <WebOLChina
    type="china"
    @singleclick="singleclick"
    @oLMounted="oLMounted"
  ></WebOLChina>
</template>
  
<script>
export default {
  data() {
    return {
      selected: [],
      style: "",
    };
  },
  methods: {
    oLMounted({ has, style: { Fill, Stroke, Style } }) {
      var canvas = document.createElement("canvas");
      var pixelRatio = has.DEVICE_PIXEL_RATIO;
      var context = canvas.getContext("2d");
      var grad = context.createLinearGradient(0, 0, 512 * pixelRatio, 0);
      grad.addColorStop(0, "rgba(66,99,232,1)");
      grad.addColorStop(1, "rgba(55,183,249,1)");
      this.style = new Style({
        fill: new Fill({
          color: grad,
        }),
        stroke: new Stroke({
          color: grad,
          width: 2,
        }),
      });
    },
    singleclick(f) {
      const selIndex = this.selected.indexOf(f);
      if (selIndex < 0) {
        this.selected.push(f);
        f.setStyle(this.style);
      } else {
        this.selected.splice(selIndex, 1);
        f.setStyle(undefined);
      }
    },
  },
};
</script>


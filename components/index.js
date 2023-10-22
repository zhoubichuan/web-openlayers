import custom from "./custom";
import effectScatter from "./effectScatter";
import gauge from "./gauge";
import heatmap from "./heatmap";
import parallel from "./parallel";
import pictorialBar from "./pictorialBar";
import radar from "./radar";
import themeRiver from "./themeRiver";
import treemap from "./treemap";
import bar from "./bar";
import boxplot from "./boxplot";
import sunburst from "./sunburst";
import graph from "./graph";
import line from "./line";
import pie from "./pie";
import pie3d from "./pie3d";
import scatter from "./scatter";
import tree from "./tree";
import polar from './polar'
import map from './map'
import candlestick from './candlestick'
let components = {
  custom,
  effectScatter,
  gauge,
  heatmap,
  parallel,
  pictorialBar,
  radar,
  themeRiver,
  treemap,
  boxplot,
  bar,
  sunburst,
  graph,
  line,
  pie,
  pie3d,
  scatter,
  tree,
  polar,
  map,
  candlestick
};
export default {
  install(Vue) {
    for (let key in components) {
      let item = components[key]
      Vue.component(item.name, item);
    }
  },
};

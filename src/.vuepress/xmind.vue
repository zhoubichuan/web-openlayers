<template>
  <div class="xmind">
    <div id="jsmind_container"></div>
  </div>
</template>

<script>
import * as jsMind from "./jsMind.js";

export default {
  name: "index",
  props: {
    key: {
      type: String,
      default: 'a',
    },
  },
  data() {
    return {
      mind: {
        a: {
          meta: {
            name: "openlayers mind",
            version: "1.0",
          },
          format: "node_tree",
          data: {
            id: "root",
            topic: "容器（Map）",
            children: [
              {
                id: "easy",
                topic: "地图视图（View）",
                direction: "right",
              },
              {
                id: "open",
                topic: "地图图层（Layer）",
                direction: "right",
                children: [
                  {
                    id: "open1",
                    topic: "数据源（Source）",
                  },
                  { id: "open2", topic: "图层样式（Style）" },
                  {
                    id: "open3",
                    topic: "图层要素（Feature）",
                  },
                ],
              },
              {
                id: "powerful",
                topic: "交互操作控件（Interactions）",
                direction: "right",
              },
              {
                id: "Overlays",
                topic: "叠加层（Overlays）",
                direction: "right",
              },
              {
                id: "Control",
                topic: "操作控件（Control）",
                direction: "right",
              },
            ],
          },
        },
      },
      // jsMind的选项，更多参数参见jsMind的文档
      // https://github.com/hizzgdev/jsmind/blob/master/docs/zh/index.md
      options: {
        container: "jsmind_container", //容器的ID
        editable: false, // 是否启用编辑
        theme: "primary", //主题

        //options的属性
        // editable : false,       // 是否启用编辑
        mode :'side',           // 显示模式========full - 子节点动态分布在根节点两侧 [默认值] side - 子节点只分布在根节点右侧
        support_html : true,    // 是否支持节点里的HTML元素
        view:{
            hmargin:100,        // 思维导图距容器外框的最小水平距离
            vmargin:50,         // 思维导图距容器外框的最小垂直距离
            line_width:1,       // 思维导图线条的粗细
            line_color:'#555'   // 思维导图线条的颜色
        },
        layout:{
            hspace:30,          // 节点之间的水平间距
            vspace:20,          // 节点之间的垂直间距
            pspace:13           // 节点与连接线之间的水平间距（用于容纳节点收缩/展开控制器）
        },
        shortcut:{
            enable:true,        // 是否启用快捷键
            handles:{},         // 命名的快捷键事件处理器
            mapping:{           // 快捷键映射
                addchild   : 45,    // <Insert>
                addbrother : 13,    // <Enter>
                editnode   : 113,   // <F2>
                delnode    : 46,    // <Delete>
                toggle     : 32,    // <Space>
                left       : 37,    // <Left>
                up         : 38,    // <Up>
                right      : 39,    // <Right>
                down       : 40,    // <Down>
            }
        },
      },
    };
  },
  mounted() {
    let jm = new jsMind(this.options);
    jm.show(this.mind[this.$props.key]);
    //jm.disable_edit();//禁止编制
    jm.expand_all(); //展开全部节点
    // jm.add_node(parent_node, nodeid, topic, data);//添加节点
  },
};
</script>

<style>
@import "./jsMind.scss";
</style>

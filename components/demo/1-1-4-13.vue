<template>
  <div class="map">
    <div style="margin-left:100px;position:absolute;z-index: 100;">
      <button ref="rotateleft" title="Rotate clockwise">↻</button>
      <button ref="rotateright" title="Rotate counterclockwise">↺</button>
      <button ref="pantolondon">平移到伦敦</button>
      <button ref="elastictomoscow">弹跳到莫斯科</button>
      <button ref="bouncetoistanbul">跳到伊斯坦布尔</button>
      <button ref="spintorome">旋转到罗马</button>
      <button ref="flytobern">飞往伯尔尼</button>
      <button ref="rotatearoundrome">绕罗马旋转</button>
      <button ref="tour">Take a tour</button>
    </div>
    <WebOpenlayers2  :layer="layer" :view="view" @mapView="mapView"></WebOpenlayers2>
  </div>
</template>

<script>
let viewInstance;
let urls = [
  // "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
  // "http://t0.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
];
export default {
  data() {
    return {
      layer: urls.map((item) => ({
        name: "Tile",
        source: {
          name: "XYZ",
          config(config) {
            return ({
              url: item,
              wrapX: false,
              ...config,
            });
          },
        },
      })),
      view: {
        center: [12579156, 3274244],
        zoom: 8,
      },
    };
  },
  methods: {
    mapView(view) {
      viewInstance = view;
    },
  },
  mounted() {
    let {
      easing: { easeIn, easeOut },
      proj: { fromLonLat },
    } = ol;
    const london = fromLonLat([-0.12755, 51.507222]);
    const moscow = fromLonLat([37.6178, 55.7517]);
    const istanbul = fromLonLat([28.9744, 41.0128]);
    const rome = fromLonLat([12.5, 41.9]);
    const bern = fromLonLat([7.4458, 46.95]);
    function bounce(t) {
      const s = 7.5625;
      const p = 2.75;
      let l;
      if (t < 1 / p) {
        l = s * t * t;
      } else {
        if (t < 2 / p) {
          t -= 1.5 / p;
          l = s * t * t + 0.75;
        } else {
          if (t < 2.5 / p) {
            t -= 2.25 / p;
            l = s * t * t + 0.9375;
          } else {
            t -= 2.625 / p;
            l = s * t * t + 0.984375;
          }
        }
      }
      return l;
    }
    function elastic(t) {
      return (
        Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
      );
    }
    let that = this;
    function onClick(id, callback) {
      that.$refs[id].addEventListener("click", callback);
    }
    onClick("rotateleft", function () {
      viewInstance.animate({
        rotation: viewInstance.getRotation() + Math.PI / 2,
      });
    });
    onClick("rotateright", function () {
      viewInstance.animate({
        rotation: viewInstance.getRotation() - Math.PI / 2,
      });
    });
    onClick("rotatearoundrome", function () {
      const rotation = viewInstance.getRotation();
      viewInstance.animate(
        {
          rotation: rotation + Math.PI,
          anchor: rome,
          easing: easeIn,
        },
        {
          rotation: rotation + 2 * Math.PI,
          anchor: rome,
          easing: easeOut,
        }
      );
    });
    onClick("pantolondon", function () {
      viewInstance.animate({
        center: london,
        duration: 2000,
      });
    });
    onClick("elastictomoscow", function () {
      viewInstance.animate({
        center: moscow,
        duration: 2000,
        easing: elastic,
      });
    });
    onClick("bouncetoistanbul", function () {
      viewInstance.animate({
        center: istanbul,
        duration: 2000,
        easing: bounce,
      });
    });
    onClick("spintorome", function () {
      const center = viewInstance.getCenter();
      viewInstance.animate(
        {
          center: [
            center[0] + (rome[0] - center[0]) / 2,
            center[1] + (rome[1] - center[1]) / 2,
          ],
          rotation: Math.PI,
          easing: easeIn,
        },
        {
          center: rome,
          rotation: 2 * Math.PI,
          easing: easeOut,
        }
      );
    });
    function flyTo(location, done) {
      const duration = 2000;
      const zoom = viewInstance.getZoom();
      let parts = 2;
      let called = false;
      function callback(complete) {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called = true;
          done(complete);
        }
      }
      viewInstance.animate(
        {
          center: location,
          duration: duration,
        },
        callback
      );
      viewInstance.animate(
        {
          zoom: zoom - 1,
          duration: duration / 2,
        },
        {
          zoom: zoom,
          duration: duration / 2,
        },
        callback
      );
    }
    onClick("flytobern", function () {
      flyTo(bern, function () {});
    });
    function tour() {
      const locations = [london, bern, rome, moscow, istanbul];
      let index = -1;
      function next(more) {
        if (more) {
          ++index;
          if (index < locations.length) {
            const delay = index === 0 ? 0 : 750;
            setTimeout(function () {
              flyTo(locations[index], next);
            }, delay);
          } else {
            alert("Tour complete");
          }
        } else {
          alert("Tour cancelled");
        }
      }
      next(true);
    }
    onClick("tour", tour);
  },
};
</script>
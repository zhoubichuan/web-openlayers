<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      Map,
      geom: { Point },
      proj: { fromLonLat },
      easing: { easeOut },
      render: { getVectorContext },
      Observable: unByKey,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Circle: CircleStyle, Stroke, Style },
    } = ol;
    const tileLayer = new TileLayer({
      source: new OSM({
        wrapX: false,
      }),
    });
    const source = new VectorSource({
      wrapX: false,
    });
    const vector = new VectorLayer({
      source: source,
    });
    const map = new Map({
      layers: [tileLayer, vector],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 1,
        multiWorld: true,
      }),
    });

    function addRandomFeature() {
      const x = Math.random() * 360 - 180;
      const y = Math.random() * 170 - 85;
      const geom = new Point(fromLonLat([x, y]));
      const feature = new Feature(geom);
      source.addFeature(feature);
    }

    const duration = 3000;
    function flash(feature) {
      const start = Date.now();
      const flashGeom = feature.getGeometry().clone();
      const listenerKey = tileLayer.on("postrender", animate);
      function animate(event) {
        const frameState = event.frameState;
        const elapsed = frameState.time - start;
        if (elapsed >= duration) {
          unByKey(listenerKey);
          return;
        }
        const vectorContext = getVectorContext(event);
        const elapsedRatio = elapsed / duration;
        const radius = easeOut(elapsedRatio) * 25 + 5;
        const opacity = easeOut(1 - elapsedRatio);
        const style = new Style({
          image: new CircleStyle({
            radius: radius,
            stroke: new Stroke({
              color: "rgba(255, 0, 0, " + opacity + ")",
              width: 0.25 + opacity,
            }),
          }),
        });
        vectorContext.setStyle(style);
        vectorContext.drawGeometry(flashGeom);
        map.render();
      }
    }
    source.on("addfeature", function (e) {
      flash(e.feature);
    });
    window.setInterval(addRandomFeature, 1000);
  },
};
</script>
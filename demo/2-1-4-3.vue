<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
let {
  interaction: { Select, defaults: defaultInteractions },
  Map,
  View,
  layer: { Tile: TileLayer, Vector: VectorLayer },
  source: { Cluster, Stamen, Vector: VectorSource },
  style: { Circle: CircleStyle, Fill, RegularShape, Stroke, Style, Text },
  format: { KML },
  extent: { createEmpty, extend, getHeight, getWidth },
} = ol;
export default {
  mounted() {
    const earthquakeFill = new Fill({
      color: "rgba(255, 153, 0, 0.8)",
    });
    const earthquakeStroke = new Stroke({
      color: "rgba(255, 204, 0, 0.2)",
      width: 1,
    });
    const textFill = new Fill({
      color: "#fff",
    });
    const textStroke = new Stroke({
      color: "rgba(0, 0, 0, 0.6)",
      width: 3,
    });
    const invisibleFill = new Fill({
      color: "rgba(255, 255, 255, 0.01)",
    });

    function createEarthquakeStyle(feature) {
      const name = feature.get("name");
      const magnitude = parseFloat(name.substr(2));
      const radius = 5 + 20 * (magnitude - 5);

      return new Style({
        geometry: feature.getGeometry(),
        image: new RegularShape({
          radius1: radius,
          radius2: 3,
          points: 5,
          angle: Math.PI,
          fill: earthquakeFill,
          stroke: earthquakeStroke,
        }),
      });
    }

    let maxFeatureCount;
    let vector = null;
    const calculateClusterInfo = function (resolution) {
      maxFeatureCount = 0;
      const features = vector.getSource().getFeatures();
      let feature, radius;
      for (let i = features.length - 1; i >= 0; --i) {
        feature = features[i];
        const originalFeatures = feature.get("features");
        const extent = createEmpty();
        let j, jj;
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
          extend(extent, originalFeatures[j].getGeometry().getExtent());
        }
        maxFeatureCount = Math.max(maxFeatureCount, jj);
        radius = (0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
        feature.set("radius", radius);
      }
    };

    let currentResolution;
    function styleFunction(feature, resolution) {
      if (resolution != currentResolution) {
        calculateClusterInfo(resolution);
        currentResolution = resolution;
      }
      let style;
      const size = feature.get("features").length;
      if (size > 1) {
        style = new Style({
          image: new CircleStyle({
            radius: feature.get("radius"),
            fill: new Fill({
              color: [255, 153, 0, Math.min(0.8, 0.4 + size / maxFeatureCount)],
            }),
          }),
          text: new Text({
            text: size.toString(),
            fill: textFill,
            stroke: textStroke,
          }),
        });
      } else {
        const originalFeature = feature.get("features")[0];
        style = createEarthquakeStyle(originalFeature);
      }
      return style;
    }

    function selectStyleFunction(feature) {
      const styles = [
        new Style({
          image: new CircleStyle({
            radius: feature.get("radius"),
            fill: invisibleFill,
          }),
        }),
      ];
      const originalFeatures = feature.get("features");
      let originalFeature;
      for (let i = originalFeatures.length - 1; i >= 0; --i) {
        originalFeature = originalFeatures[i];
        styles.push(createEarthquakeStyle(originalFeature));
      }
      return styles;
    }

    vector = new VectorLayer({
      source: new Cluster({
        distance: 40,
        source: new VectorSource({
          url: this.$withBase("/data/kml/2012_Earthquakes_Mag5.kml"),
          format: new KML({
            extractStyles: false,
          }),
        }),
      }),
      style: styleFunction,
    });

    const raster = new TileLayer({
      source: new Stamen({
        layer: "toner",
      }),
    });

    const map = new Map({
      layers: [raster, vector],
      interactions: defaultInteractions().extend([
        new Select({
          condition: function (evt) {
            return evt.type == "pointermove" || evt.type == "singleclick";
          },
          style: selectStyleFunction,
        }),
      ]),
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
  },
};
</script>
  <style></style>
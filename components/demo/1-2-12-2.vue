<template>
  <div ref="map" class="map"></div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      geom: { MultiPoint },
      Map,
      View,
      layer: { Vector: VectorLayer },
      source: { Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Stroke, Style },
    } = ol;
    const styles = [
      new Style({
        stroke: new Stroke({
          color: "blue",
          width: 3,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.1)",
        }),
      }),
      new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({
            color: "orange",
          }),
        }),
        geometry: function (feature) {
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
      }),
    ];
    const geojsonObject = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:3857",
        },
      },
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-5e6, 6e6],
                [-5e6, 8e6],
                [-3e6, 8e6],
                [-3e6, 6e6],
                [-5e6, 6e6],
              ],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-2e6, 6e6],
                [-2e6, 8e6],
                [0, 8e6],
                [0, 6e6],
                [-2e6, 6e6],
              ],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [1e6, 6e6],
                [1e6, 8e6],
                [3e6, 8e6],
                [3e6, 6e6],
                [1e6, 6e6],
              ],
            ],
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-2e6, -1e6],
                [-1e6, 1e6],
                [0, -1e6],
                [-2e6, -1e6],
              ],
            ],
          },
        },
      ],
    };
    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    const layer = new VectorLayer({
      source: source,
      style: styles,
    });
    const map = new Map({
      layers: [layer],
      target: this.$refs.map,
      view: new View({
        center: [0, 3000000],
        zoom: 2,
      }),
    });
  },
};
</script>
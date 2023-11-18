<template>
    <div ref="map" class="map"></div>
  </template>
  
  <script>
  export default {
    async mounted() {
      let {
        format: { GeoJSON },
        Map,
        View,
        layer: { VectorTile: VectorTileLayer },
        source: { VectorTile: VectorTileSource },
        style: { Fill, Style },
        proj: { Projection },
      } = ol;
      const replacer = function (key, value) {
        if (!value || !value.geometry) {
          return value;
        }
        let type;
        const rawType = value.type;
        let geometry = value.geometry;
        if (rawType === 1) {
          type = "MultiPoint";
          if (geometry.length == 1) {
            type = "Point";
            geometry = geometry[0];
          }
        } else if (rawType === 2) {
          type = "MultiLineString";
          if (geometry.length == 1) {
            type = "LineString";
            geometry = geometry[0];
          }
        } else if (rawType === 3) {
          type = "Polygon";
          if (geometry.length > 1) {
            type = "MultiPolygon";
            geometry = [geometry];
          }
        }
        return {
          type: "Feature",
          geometry: {
            type: type,
            coordinates: geometry,
          },
          properties: value.tags,
        };
      };
      const style = new Style({
        fill: new Fill({
          color: "#eeeeee",
        }),
      });
      const layer = new VectorTileLayer({
        background: "#1a2b39",
        style: function (feature) {
          const color = feature.get("COLOR") || "#eeeeee";
          style.getFill().setColor(color);
          return style;
        },
      });
      const map = new Map({
        layers: [layer],
        target: this.$refs.map,
        view: new View({
          center: [12579156, 3274244],
          zoom: 2,
        }),
      });
      const url = "https://openlayers.org/data/vector/ecoregions.json";
      let res = await this.$axios.get(url);
      const tileIndex = geojsonvt(res.data, {
        extent: 4096,
        debug: 1,
      });
      const format = new GeoJSON({
        dataProjection: new Projection({
          code: "TILE_PIXELS",
          units: "tile-pixels",
          extent: [0, 0, 4096, 4096],
        }),
      });
      const vectorSource = new VectorTileSource({
        tileUrlFunction: function (tileCoord) {
          return JSON.stringify(tileCoord);
        },
        tileLoadFunction: function (tile, url) {
          const tileCoord = JSON.parse(url);
          const data = tileIndex.getTile(
            tileCoord[0],
            tileCoord[1],
            tileCoord[2]
          );
          const geojson = JSON.stringify(
            {
              type: "FeatureCollection",
              features: data ? data.features : [],
            },
            replacer
          );
          const features = format.readFeatures(geojson, {
            extent: vectorSource.getTileGrid().getTileCoordExtent(tileCoord),
            featureProjection: map.getView().getProjection(),
          });
          tile.setFeatures(features);
        },
      });
      layer.setSource(vectorSource);
    },
  };
  </script>
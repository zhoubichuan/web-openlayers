<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="type">几何类型 &nbsp;</label>
      <select ref="type">
        <option value="Polygon">多边形</option>
        <option value="LineString">直线</option>
        <option value="None">无</option>
      </select>
    </form>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      Feature,
      interaction: { Draw, Snap },
      geom: { LineString },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Fill, Stroke, Style },
      format: { GeoJSON },
    } = ol;
    function length(a, b) {
      return Math.sqrt(
        (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
      );
    }
    function isOnSegment(c, a, b) {
      const lengthAc = length(a, c);
      const lengthAb = length(a, b);
      const dot =
        ((c[0] - a[0]) * (b[0] - a[0]) + (c[1] - a[1]) * (b[1] - a[1])) /
        lengthAb;
      return Math.abs(lengthAc - dot) < 1e-6 && lengthAc < lengthAb;
    }
    function mod(a, b) {
      return ((a % b) + b) % b;
    }
    function getPartialRingCoords(feature, startPoint, endPoint) {
      let polygon = feature.getGeometry();
      if (polygon.getType() === "MultiPolygon") {
        polygon = polygon.getPolygon(0);
      }
      const ringCoords = polygon.getLinearRing().getCoordinates();
      let i,
        pointA,
        pointB,
        startSegmentIndex = -1;
      for (i = 0; i < ringCoords.length; i++) {
        pointA = ringCoords[i];
        pointB = ringCoords[mod(i + 1, ringCoords.length)];
        if (isOnSegment(startPoint, pointA, pointB)) {
          startSegmentIndex = i;
          break;
        }
      }
      const cwCoordinates = [];
      let cwLength = 0;
      const ccwCoordinates = [];
      let ccwLength = 0;
      for (i = 0; i < ringCoords.length; i++) {
        pointA =
          i === 0
            ? startPoint
            : ringCoords[mod(i + startSegmentIndex, ringCoords.length)];
        pointB = ringCoords[mod(i + startSegmentIndex + 1, ringCoords.length)];
        cwCoordinates.push(pointA);
        if (isOnSegment(endPoint, pointA, pointB)) {
          cwCoordinates.push(endPoint);
          cwLength += length(pointA, endPoint);
          break;
        } else {
          cwLength += length(pointA, pointB);
        }
      }
      for (i = 0; i < ringCoords.length; i++) {
        pointA = ringCoords[mod(startSegmentIndex - i, ringCoords.length)];
        pointB =
          i === 0
            ? startPoint
            : ringCoords[mod(startSegmentIndex - i + 1, ringCoords.length)];
        ccwCoordinates.push(pointB);

        if (isOnSegment(endPoint, pointA, pointB)) {
          ccwCoordinates.push(endPoint);
          ccwLength += length(endPoint, pointB);
          break;
        } else {
          ccwLength += length(pointA, pointB);
        }
      }
      return ccwLength < cwLength ? ccwCoordinates : cwCoordinates;
    }
    const raster = new TileLayer({
      source: new OSM(),
    });
    const baseVector = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: "https://ahocevar.com/geoserver/wfs?service=wfs&request=getfeature&typename=topp:states&cql_filter=STATE_NAME='Idaho'&outputformat=application/json",
      }),
    });
    const drawVector = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          color: "rgba(100, 255, 0, 1)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(100, 255, 0, 0.3)",
        }),
      }),
    });
    const previewLine = new Feature({
      geometry: new LineString([]),
    });
    const previewVector = new VectorLayer({
      source: new VectorSource({
        features: [previewLine],
      }),
      style: new Style({
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)",
          width: 2,
        }),
      }),
    });
    const map = new Map({
      layers: [raster, baseVector, drawVector, previewVector],
      target: this.$refs.map,
      view: new View({
        center: [-12986427, 5678422],
        zoom: 5,
      }),
    });
    let drawInteraction, tracingFeature, startPoint, endPoint;
    let drawing = false;
    const getFeatureOptions = {
      hitTolerance: 10,
      layerFilter: (layer) => {
        return layer === baseVector;
      },
    };
    map.on("click", (event) => {
      if (!drawing) {
        return;
      }
      let hit = false;
      map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => {
          if (tracingFeature && feature !== tracingFeature) {
            return;
          }
          hit = true;
          const coord = map.getCoordinateFromPixel(event.pixel);
          if (feature === tracingFeature) {
            endPoint = tracingFeature.getGeometry().getClosestPoint(coord);
            const appendCoords = getPartialRingCoords(
              tracingFeature,
              startPoint,
              endPoint
            );
            drawInteraction.removeLastPoint();
            drawInteraction.appendCoordinates(appendCoords);
            tracingFeature = null;
          }
          tracingFeature = feature;
          startPoint = tracingFeature.getGeometry().getClosestPoint(coord);
        },
        getFeatureOptions
      );
      if (!hit) {
        previewLine.getGeometry().setCoordinates([]);
        tracingFeature = null;
      }
    });
    map.on("pointermove", (event) => {
      if (tracingFeature && drawing) {
        let coord = null;
        map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => {
            if (tracingFeature === feature) {
              coord = map.getCoordinateFromPixel(event.pixel);
            }
          },
          getFeatureOptions
        );
        let previewCoords = [];
        if (coord) {
          endPoint = tracingFeature.getGeometry().getClosestPoint(coord);
          previewCoords = getPartialRingCoords(
            tracingFeature,
            startPoint,
            endPoint
          );
        }
        previewLine.getGeometry().setCoordinates(previewCoords);
      }
    });
    const snapInteraction = new Snap({
      source: baseVector.getSource(),
    });
    const typeSelect = this.$refs.type;
    function addInteraction() {
      const value = typeSelect.value;
      if (value !== "None") {
        drawInteraction = new Draw({
          source: drawVector.getSource(),
          type: typeSelect.value,
        });
        drawInteraction.on("drawstart", () => {
          drawing = true;
        });
        drawInteraction.on("drawend", () => {
          drawing = false;
          previewLine.getGeometry().setCoordinates([]);
          tracingFeature = null;
        });
        map.addInteraction(drawInteraction);
        map.addInteraction(snapInteraction);
      }
    }
    typeSelect.onchange = function () {
      map.removeInteraction(drawInteraction);
      map.removeInteraction(snapInteraction);
      addInteraction();
    };
    addInteraction();
  },
};
</script>
<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      format: { GeoJSON },
      geom: { LineString, Point, Polygon },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { XYZ, Cluster, Vector: VectorSource },
      style: { Circle: CircleStyle, Fill, Icon, Stroke, Style, Text },
      proj: { fromLonLat },
      extent: { createEmpty, extend, getWidth },
    } = ol
    const circleDistanceMultiplier = 1
    const circleFootSeparation = 28
    const circleStartAngle = Math.PI / 2

    const convexHullFill = new Fill({
      color: "rgba(255, 153, 0, 0.4)",
    })
    const convexHullStroke = new Stroke({
      color: "rgba(204, 85, 0, 1)",
      width: 1.5,
    })
    const outerCircleFill = new Fill({
      color: "rgba(255, 153, 102, 0.3)",
    })
    const innerCircleFill = new Fill({
      color: "rgba(255, 165, 0, 0.7)",
    })
    const textFill = new Fill({
      color: "#fff",
    })
    const textStroke = new Stroke({
      color: "rgba(0, 0, 0, 0.6)",
      width: 3,
    })
    const innerCircle = new CircleStyle({
      radius: 14,
      fill: innerCircleFill,
    })
    const outerCircle = new CircleStyle({
      radius: 20,
      fill: outerCircleFill,
    })
    const darkIcon = new Icon({
      src: this.$withBase("/data/icons/emoticon-cool.svg"),
    })
    const lightIcon = new Icon({
      src: this.$withBase("/data/icons/emoticon-cool-outline.svg"),
    })
    function clusterMemberStyle(clusterMember) {
      return new Style({
        geometry: clusterMember.getGeometry(),
        image: clusterMember.get("LEISTUNG") > 5 ? darkIcon : lightIcon,
      })
    }
    let clickFeature, clickResolution
    function clusterCircleStyle(cluster, resolution) {
      if (cluster !== clickFeature || resolution !== clickResolution) {
        return
      }
      const clusterMembers = cluster.get("features")
      const centerCoordinates = cluster.getGeometry().getCoordinates()
      return generatePointsCircle(
        clusterMembers.length,
        cluster.getGeometry().getCoordinates(),
        resolution
      ).reduce((styles, coordinates, i) => {
        const point = new Point(coordinates)
        const line = new LineString([centerCoordinates, coordinates])
        styles.unshift(
          new Style({
            geometry: line,
            stroke: convexHullStroke,
          })
        )
        styles.push(
          clusterMemberStyle(
            new Feature({
              ...clusterMembers[i].getProperties(),
              geometry: point,
            })
          )
        )
        return styles
      }, [])
    }
    function generatePointsCircle(count, clusterCenter, resolution) {
      const circumference =
        circleDistanceMultiplier * circleFootSeparation * (2 + count)
      let legLength = circumference / (Math.PI * 2)
      const angleStep = (Math.PI * 2) / count
      const res = []
      let angle
      legLength = Math.max(legLength, 35) * resolution
      for (let i = 0; i < count; ++i) {
        angle = circleStartAngle + i * angleStep
        res.push([
          clusterCenter[0] + legLength * Math.cos(angle),
          clusterCenter[1] + legLength * Math.sin(angle),
        ])
      }

      return res
    }
    let hoverFeature
    function clusterHullStyle(cluster) {
      if (cluster !== hoverFeature) {
        return
      }
      const originalFeatures = cluster.get("features")
      const points = originalFeatures.map((feature) =>
        feature.getGeometry().getCoordinates()
      )
      return new Style({
        geometry: new Polygon([monotoneChainConvexHull(points)]),
        fill: convexHullFill,
        stroke: convexHullStroke,
      })
    }
    function clusterStyle(feature) {
      const size = feature.get("features").length
      if (size > 1) {
        return [
          new Style({
            image: outerCircle,
          }),
          new Style({
            image: innerCircle,
            text: new Text({
              text: size.toString(),
              fill: textFill,
              stroke: textStroke,
            }),
          }),
        ]
      } else {
        const originalFeature = feature.get("features")[0]
        return clusterMemberStyle(originalFeature)
      }
    }
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: this.$withBase("/data/geojson/photovoltaic.json"),
    })
    const clusterSource = new Cluster({
      attributions:
        'Data: <a href="https://www.data.gv.at/auftritte/?organisation=stadt-wien">Stadt Wien</a>',
      distance: 35,
      source: vectorSource,
    })
    const clusterHulls = new VectorLayer({
      source: clusterSource,
      style: clusterHullStyle,
    })
    const clusters = new VectorLayer({
      source: clusterSource,
      style: clusterStyle,
    })
    const clusterCircles = new VectorLayer({
      source: clusterSource,
      style: clusterCircleStyle,
    })
    const raster = new TileLayer({
      source: new XYZ({
        attributions:
          'Base map: <a target="_blank" href="https://basemap.at/">basemap.at</a>',
        url: "https://maps{1-4}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png",
      }),
    })
    const map = new Map({
      layers: [raster, clusterHulls, clusters, clusterCircles],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
        maxZoom: 19,
        extent: [
          ...fromLonLat([16.1793, 48.1124]),
          ...fromLonLat([16.5559, 48.313]),
        ],
        showFullExtent: true,
      }),
    })
    map.on("pointermove", (event) => {
      clusters.getFeatures(event.pixel).then((features) => {
        if (features[0] !== hoverFeature) {
          hoverFeature = features[0]
          clusterHulls.setStyle(clusterHullStyle)
          map.getTargetElement().style.cursor =
            hoverFeature && hoverFeature.get("features").length > 1
              ? "pointer"
              : ""
        }
      })
    })
    map.on("click", (event) => {
      clusters.getFeatures(event.pixel).then((features) => {
        if (features.length > 0) {
          const clusterMembers = features[0].get("features")
          if (clusterMembers.length > 1) {
            const extent = createEmpty()
            clusterMembers.forEach((feature) =>
              extend(extent, feature.getGeometry().getExtent())
            )
            const view = map.getView()
            const resolution = map.getView().getResolution()
            if (
              view.getZoom() === view.getMaxZoom() ||
              (getWidth(extent) < resolution && getWidth(extent) < resolution)
            ) {
              clickFeature = features[0]
              clickResolution = resolution
              clusterCircles.setStyle(clusterCircleStyle)
            } else {
              view.fit(extent, { duration: 500, padding: [50, 50, 50, 50] })
            }
          }
        }
      })
    })
  },
}
</script>
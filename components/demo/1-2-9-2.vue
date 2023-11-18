<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Feature,
      geom: { Point },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Fill, RegularShape, Stroke, Style },
      proj: { fromLonLat },
    } = ol

    const shaft = new RegularShape({
      points: 2,
      radius: 5,
      stroke: new Stroke({
        width: 2,
        color: "black",
      }),
      rotateWithView: true,
    })

    const head = new RegularShape({
      points: 3,
      radius: 5,
      fill: new Fill({
        color: "black",
      }),
      rotateWithView: true,
    })

    const styles = [new Style({ image: shaft }), new Style({ image: head })]

    const source = new VectorSource({
      attributions:
        'Weather data by <a href="https://openweathermap.org/current">OpenWeather</a>',
    })

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: source,
          style: function (feature) {
            const wind = feature.get("wind")
            // rotate arrow away from wind origin
            const angle = ((wind.deg - 180) * Math.PI) / 180
            const scale = wind.speed / 10
            shaft.setScale([1, scale])
            shaft.setRotation(angle)
            head.setDisplacement([
              0,
              head.getRadius() / 2 + shaft.getRadius() * scale,
            ])
            head.setRotation(angle)
            return styles
          },
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    })

    fetch(this.$withBase("/data/openweather/weather.json"))
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        const features = []
        data.list.forEach(function (report) {
          const feature = new Feature(
            new Point(fromLonLat([report.coord.lon, report.coord.lat]))
          )
          feature.setProperties(report)
          features.push(feature)
        })
        source.addFeatures(features)
        map.getView().fit(source.getExtent())
      })
  },
}
</script>
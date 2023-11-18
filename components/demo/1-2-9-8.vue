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
      source: { TileJSON, Vector: VectorSource },
      style: { Icon, Style },
      proj: { fromLonLat },
    } = ol
    const rome = new Feature({
      geometry: new Point(fromLonLat([12.5, 41.9])),
    })
    const london = new Feature({
      geometry: new Point(fromLonLat([-0.12755, 51.507222])),
    })
    const madrid = new Feature({
      geometry: new Point(fromLonLat([-3.683333, 40.4])),
    })
    const paris = new Feature({
      geometry: new Point(fromLonLat([2.353, 48.8566])),
    })
    const berlin = new Feature({
      geometry: new Point(fromLonLat([13.3884, 52.5169])),
    })
    rome.setStyle(
      new Style({
        image: new Icon({
          color: "#BADA55",
          crossOrigin: "anonymous",
          imgSize: [20, 20],
          src: this.$withBase("/data/square.svg"),
        }),
      })
    )
    london.setStyle(
      new Style({
        image: new Icon({
          color: "rgba(255, 0, 0, .5)",
          crossOrigin: "anonymous",
          src: this.$withBase("/data/bigdot.png"),
          scale: 0.2,
        }),
      })
    )
    madrid.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: "anonymous",
          src: this.$withBase("/data/bigdot.png"),
          scale: 0.2,
        }),
      })
    )
    paris.setStyle(
      new Style({
        image: new Icon({
          color: "#8959A8",
          crossOrigin: "anonymous",
          imgSize: [20, 20],
          src: this.$withBase("/data/dot.svg"),
        }),
      })
    )
    berlin.setStyle(
      new Style({
        image: new Icon({
          crossOrigin: "anonymous",
          imgSize: [20, 20],
          src: this.$withBase("/data/dot.svg"),
        }),
      })
    )
    const vectorSource = new VectorSource({
      features: [rome, london, madrid, paris, berlin],
    })
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    })
    const rasterLayer = new TileLayer({
      source: new TileJSON({
        url:
          "https://a.tiles.mapbox.com/v4/aj.1x1-degrees.json?secure=1&access_token=" +
          mapkeys.mapbox,
        crossOrigin: "anonymous",
      }),
    })
    const map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([2.896372, 44.6024]),
        zoom: 3,
      }),
    })
  },
}
</script>
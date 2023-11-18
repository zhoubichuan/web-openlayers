<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      control: { Control, defaults: defaultControls },
    } = ol
    class RotateNorthControl extends Control {
      constructor(opt_options) {
        const options = opt_options || {}
        const button = document.createElement("button")
        button.innerHTML = "N"
        const element = document.createElement("div")
        element.className = "rotate-north ol-unselectable ol-control"
        element.appendChild(button)
        super({
          element: element,
          target: options.target,
        })
        button.addEventListener(
          "click",
          this.handleRotateNorth.bind(this),
          false
        )
      }
      handleRotateNorth() {
        this.getMap().getView().setRotation(0)
      }
    }
    const map = new Map({
      controls: defaultControls().extend([new RotateNorthControl()]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 3,
        rotation: 1,
      }),
    })
  },
}
</script>
<style>
.rotate-north {
  top: 65px;
  left: 0.5em;
}
.ol-touch .rotate-north {
  top: 80px;
}
</style>
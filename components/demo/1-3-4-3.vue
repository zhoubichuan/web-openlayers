<template>
  <div class="wrapper">
    <div ref="map" class="map"></div>
    <div ref="progress"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Image: ImageLayer },
      source: { ImageWMS },
    } = ol
    function Progress(el) {
      this.el = el
      this.loading = 0
      this.loaded = 0
    }
    Progress.prototype.addLoading = function () {
      ++this.loading
      this.update()
    }
    Progress.prototype.addLoaded = function () {
      ++this.loaded
      this.update()
    }
    Progress.prototype.update = function () {
      const width = ((this.loaded / this.loading) * 100).toFixed(1) + "%"
      this.el.style.width = width
    }
    Progress.prototype.show = function () {
      this.el.style.visibility = "visible"
    }
    Progress.prototype.hide = function () {
      const style = this.el.style
      setTimeout(function () {
        style.visibility = "hidden"
        style.width = 0
      }, 250)
    }
    const progress = new Progress(this.$refs.progress)
    const source = new ImageWMS({
      url: "https://ahocevar.com/geoserver/wms",
      params: { LAYERS: "topp:states" },
      serverType: "geoserver",
    })
    source.on("imageloadstart", function () {
      progress.addLoading()
    })
    source.on(["imageloadend", "imageloaderror"], function () {
      progress.addLoaded()
    })
    const map = new Map({
      layers: [new ImageLayer({ source: source })],
      target: this.$refs.map,
      view: new View({
        center: [-10997148, 4569099],
        zoom: 4,
      }),
    })
    map.on("loadstart", function () {
      progress.show()
    })
    map.on("loadend", function () {
      progress.hide()
    })
  },
}
</script>
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
      layer: { Tile: TileLayer },
      source: { XYZ },
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
    const key = "get_your_own_D6rA4zTHduk6KOKTXzGB"
    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    const source = new XYZ({
      attributions: attributions,
      url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" + key,
      tileSize: 512,
    })
    source.on("tileloadstart", function () {
      progress.addLoading()
    })
    source.on(["tileloadend", "tileloaderror"], function () {
      progress.addLoaded()
    })
    const map = new Map({
      layers: [new TileLayer({ source: source })],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
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
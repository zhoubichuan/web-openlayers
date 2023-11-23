<template>
  <div>
    <div ref="map" class="map"></div>
    <label>
      海平面
      <input ref="level" type="range" min="0" max="100" value="1" />
      +<span ref="output"></span> m
    </label>
    <br />
    Go to
    <a class="location" data-center="-122.3267,37.8377" data-zoom="11">旧金山</a
    >,
    <a class="location" data-center="-73.9338,40.6861" data-zoom="11">纽约</a>,
    <a class="location" data-center="72.9481,18.9929" data-zoom="11">孟买</a>,
    or
    <a class="location" data-center="120.831,31.160" data-zoom="9">上海</a>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Image: ImageLayer },
      source: { XYZ, Raster: RasterSource },
      proj: { fromLonLat },
    } = ol;
    function flood(pixels, data) {
      const pixel = pixels[0];
      if (pixel[3]) {
        const height =
          -10000 + (pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]) * 0.1;
        if (height <= data.level) {
          pixel[0] = 134;
          pixel[1] = 203;
          pixel[2] = 249;
          pixel[3] = 255;
        } else {
          pixel[3] = 0;
        }
      }
      return pixel;
    }

    const attributions =
      '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
      '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';
    const elevation = new XYZ({
      url:
        "https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=" +
        mapkeys.maptiler,
      tileSize: 512,
      maxZoom: 12,
      crossOrigin: "",
      interpolate: false,
    });
    const raster = new RasterSource({
      sources: [elevation],
      operation: flood,
    });
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new XYZ({
            attributions: attributions,
            url:
              "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=" +
              mapkeys.maptiler,
            tileSize: 512,
            maxZoom: 22,
          }),
        }),
        new ImageLayer({
          opacity: 0.6,
          source: raster,
        }),
      ],
      view: new View({
        center: fromLonLat([-122.3267, 37.8377]),
        zoom: 11,
      }),
    });
    const control = this.$refs.level;
    const output = this.$refs.output;
    const listener = function () {
      output.innerText = control.value;
      raster.changed();
    };
    control.addEventListener("input", listener);
    control.addEventListener("change", listener);
    output.innerText = control.value;
    raster.on("beforeoperations", function (event) {
      event.data.level = control.value;
    });
    const locations = document.getElementsByClassName("location");
    for (let i = 0, ii = locations.length; i < ii; ++i) {
      locations[i].addEventListener("click", relocate);
    }
    function relocate(event) {
      const data = event.target.dataset;
      const view = map.getView();
      view.setCenter(fromLonLat(data.center.split(",").map(Number)));
      view.setZoom(Number(data.zoom));
    }
  },
};
</script>
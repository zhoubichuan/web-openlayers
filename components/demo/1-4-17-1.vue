<template>
  <div>
    <div ref="map" class="map"></div>
    <table class="controls">
      <tr>
        <td><label for="vert">vertical exaggeration:</label></td>
        <td><input ref="vert" type="range" min="1" max="5" value="1" /></td>
        <td><span ref="vertOut"></span> x</td>
      </tr>
      <tr>
        <td><label for="sunEl">sun elevation:</label></td>
        <td><input ref="sunEl" type="range" min="0" max="90" value="45" /></td>
        <td><span ref="sunElOut"></span> °</td>
      </tr>
      <tr>
        <td><label for="sunAz">sun azimuth:</label></td>
        <td><input ref="sunAz" type="range" min="0" max="360" value="45" /></td>
        <td><span ref="sunAzOut"></span> °</td>
      </tr>
    </table>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Image: ImageLayer },
      source: { OSM, Raster, XYZ },
    } = ol;
    function shade(inputs, data) {
      const elevationImage = inputs[0];
      const width = elevationImage.width;
      const height = elevationImage.height;
      const elevationData = elevationImage.data;
      const shadeData = new Uint8ClampedArray(elevationData.length);
      const dp = data.resolution * 2;
      const maxX = width - 1;
      const maxY = height - 1;
      const pixel = [0, 0, 0, 0];
      const twoPi = 2 * Math.PI;
      const halfPi = Math.PI / 2;
      const sunEl = (Math.PI * data.sunEl) / 180;
      const sunAz = (Math.PI * data.sunAz) / 180;
      const cosSunEl = Math.cos(sunEl);
      const sinSunEl = Math.sin(sunEl);
      let pixelX,
        pixelY,
        x0,
        x1,
        y0,
        y1,
        offset,
        z0,
        z1,
        dzdx,
        dzdy,
        slope,
        aspect,
        cosIncidence,
        scaled;
      function calculateElevation(pixel) {
        return pixel[0] + pixel[1] * 2 + pixel[2] * 3;
      }
      for (pixelY = 0; pixelY <= maxY; ++pixelY) {
        y0 = pixelY === 0 ? 0 : pixelY - 1;
        y1 = pixelY === maxY ? maxY : pixelY + 1;
        for (pixelX = 0; pixelX <= maxX; ++pixelX) {
          x0 = pixelX === 0 ? 0 : pixelX - 1;
          x1 = pixelX === maxX ? maxX : pixelX + 1;
          offset = (pixelY * width + x0) * 4;
          pixel[0] = elevationData[offset];
          pixel[1] = elevationData[offset + 1];
          pixel[2] = elevationData[offset + 2];
          pixel[3] = elevationData[offset + 3];
          z0 = data.vert * calculateElevation(pixel);
          offset = (pixelY * width + x1) * 4;
          pixel[0] = elevationData[offset];
          pixel[1] = elevationData[offset + 1];
          pixel[2] = elevationData[offset + 2];
          pixel[3] = elevationData[offset + 3];
          z1 = data.vert * calculateElevation(pixel);
          dzdx = (z1 - z0) / dp;
          offset = (y0 * width + pixelX) * 4;
          pixel[0] = elevationData[offset];
          pixel[1] = elevationData[offset + 1];
          pixel[2] = elevationData[offset + 2];
          pixel[3] = elevationData[offset + 3];
          z0 = data.vert * calculateElevation(pixel);
          offset = (y1 * width + pixelX) * 4;
          pixel[0] = elevationData[offset];
          pixel[1] = elevationData[offset + 1];
          pixel[2] = elevationData[offset + 2];
          pixel[3] = elevationData[offset + 3];
          z1 = data.vert * calculateElevation(pixel);
          dzdy = (z1 - z0) / dp;
          slope = Math.atan(Math.sqrt(dzdx * dzdx + dzdy * dzdy));
          aspect = Math.atan2(dzdy, -dzdx);
          if (aspect < 0) {
            aspect = halfPi - aspect;
          } else if (aspect > halfPi) {
            aspect = twoPi - aspect + halfPi;
          } else {
            aspect = halfPi - aspect;
          }
          cosIncidence =
            sinSunEl * Math.cos(slope) +
            cosSunEl * Math.sin(slope) * Math.cos(sunAz - aspect);
          offset = (pixelY * width + pixelX) * 4;
          scaled = 255 * cosIncidence;
          shadeData[offset] = scaled;
          shadeData[offset + 1] = scaled;
          shadeData[offset + 2] = scaled;
          shadeData[offset + 3] = elevationData[offset + 3];
        }
      }
      return { data: shadeData, width: width, height: height };
    }
    const elevation = new XYZ({
      url: "https://{a-d}.tiles.mapbox.com/v3/aj.sf-dem/{z}/{x}/{y}.png",
      crossOrigin: "anonymous",
    });
    const raster = new Raster({
      sources: [elevation],
      operationType: "image",
      operation: shade,
    });
    const map = new Map({
      target: this.$refs.map,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new ImageLayer({
          opacity: 0.3,
          source: raster,
        }),
      ],
      view: new View({
        extent: [-13675026, 4439648, -13580856, 4580292],
        center: [-13615645, 4497969],
        minZoom: 10,
        maxZoom: 16,
        zoom: 13,
      }),
    });
    const controlIds = ["vert", "sunEl", "sunAz"];
    const controls = {};
    controlIds.forEach(
      function (id) {
        const control = this.$refs[id];
        const output = this.$refs[id + "Out"];
        const listener = function () {
          output.innerText = control.value;
          raster.changed();
        };
        control.addEventListener("input", listener);
        control.addEventListener("change", listener);
        output.innerText = control.value;
        controls[id] = control;
      }.bind(this)
    );
    raster.on("beforeoperations", function (event) {
      const data = event.data;
      data.resolution = event.resolution;
      for (const id in controls) {
        data[id] = Number(controls[id].value);
      }
    });
  },
};
</script>
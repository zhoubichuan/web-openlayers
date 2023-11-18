<template>
    <div class="row-fluid">
      <div class="span12">
        <div>
          <div ref="map" class="map"></div>
        </div>
        <form class="form-horizontal">
          <label>
            显示大于
            <select ref="countryarea" class="form-control">
              <option value="0" default>0 ㎢</option>
              <option value="5000">5000 ㎢</option>
              <option value="10000">10000 ㎢</option>
              <option value="50000">50000 ㎢</option>
              <option value="100000">100000 ㎢</option>
            </select>
          </label>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    mounted() {
      let {
        Map,
        View,
        layer: { Tile: TileLayer },
        source: { CartoDB, OSM },
      } = ol;
      const mapConfig = {
        layers: [
          {
            type: "cartodb",
            options: {
              cartocss_version: "2.1.1",
              cartocss: "#layer { polygon-fill: #F00; }",
              sql: "select * from european_countries_e where area > 0",
            },
          },
        ],
      };
      const cartoDBSource = new CartoDB({
        account: "documentation",
        config: mapConfig,
      });
      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new TileLayer({
            source: cartoDBSource,
          }),
        ],
        target: this.$refs.map,
        view: new View({
          center: [12579156, 3274244],
          zoom: 2,
        }),
      });
      function setArea(n) {
        mapConfig.layers[0].options.sql =
          "select * from european_countries_e where area > " + n;
        cartoDBSource.setConfig(mapConfig);
      }
      this.$refs.countryarea.addEventListener("change", function () {
        setArea(this.value);
      });
    },
  };
  </script>
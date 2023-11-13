<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <label for="epsg-query">搜索投影:</label>
      <input
        type="text"
        ref="epsgquery"
        placeholder="4326, 27700, 3031, US National Atlas, Swiss, France, ..."
        class="form-control"
        size="50"
      />
      <button ref="epsgsearch" class="btn">搜索</button>
      <span ref="epsgresult"></span>
    </form>
    <form class="form-inline">
      <label for="render-edges">
        渲染重投影边:&nbsp;
        <input type="checkbox" ref="renderedges" />
      </label>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <label for="show-tiles">
        显示平铺坐标:&nbsp;
        <input type="checkbox" ref="showtiles" />
      </label>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <label for="show-graticule">
        显示分划:&nbsp;
        <input type="checkbox" ref="showgraticule" />
      </label>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      extent: { applyTransform },
      Map,
      View,
      layer: { Tile: TileLayer, Graticule },
      source: { OSM, Vector: VectorSource, TileDebug },
      style: { Stroke },
      proj: {
        get: getProjection,
        getTransform,
        proj4: { register },
      },
    } = ol;
    const osmSource = new OSM();
    const debugLayer = new TileLayer({
      source: new TileDebug({
        tileGrid: osmSource.getTileGrid(),
        projection: osmSource.getProjection(),
      }),
      visible: false,
    });
    const graticule = new Graticule({
      strokeStyle: new Stroke({
        color: "rgba(255,120,0,0.9)",
        width: 2,
        lineDash: [0.5, 4],
      }),
      showLabels: true,
      visible: false,
      wrapX: false,
    });
    const map = new Map({
      layers: [
        new TileLayer({
          source: osmSource,
        }),
        debugLayer,
        graticule,
      ],
      target: this.$refs.map,
      view: new View({
        projection: "EPSG:3857",
        center: [12579156, 3274244],
        zoom: 1,
      }),
    });
    const resultSpan = this.$refs.epsgresult;
    const renderEdgesCheckbox = this.$refs.renderedges;
    const showTilesCheckbox = this.$refs.showtiles;
    const showGraticuleCheckbox = this.$refs.showgraticule;
    function setProjection(code, name, proj4def, bbox) {
      if (
        code === null ||
        name === null ||
        proj4def === null ||
        bbox === null
      ) {
        resultSpan.innerHTML = "Nothing usable found, using EPSG:3857...";
        map.setView(
          new View({
            projection: "EPSG:3857",
            center: [12579156, 3274244],
            zoom: 1,
          })
        );
        return;
      }
      resultSpan.innerHTML = "(" + code + ") " + name;
      const newProjCode = "EPSG:" + code;
      this.$proj4.defs(newProjCode, proj4def);
      register(this.$proj4);
      const newProj = getProjection(newProjCode);
      const fromLonLat = getTransform("EPSG:4326", newProj);
      let worldExtent = [bbox[1], bbox[2], bbox[3], bbox[0]];
      newProj.setWorldExtent(worldExtent);
      if (bbox[1] > bbox[3]) {
        worldExtent = [bbox[1], bbox[2], bbox[3] + 360, bbox[0]];
      }
      const extent = applyTransform(worldExtent, fromLonLat, undefined, 8);
      newProj.setExtent(extent);
      const newView = new View({
        projection: newProj,
      });
      map.setView(newView);
      newView.fit(extent);
    }
    function search(query) {
      resultSpan.innerHTML = "Searching ...";
      fetch("https://epsg.io/?format=json&q=" + query)
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          const results = json["results"];
          if (results && results.length > 0) {
            for (let i = 0, ii = results.length; i < ii; i++) {
              const result = results[i];
              if (result) {
                const code = result["code"];
                const name = result["name"];
                const proj4def = result["proj4"];
                const bbox = result["bbox"];
                if (
                  code &&
                  code.length > 0 &&
                  proj4def &&
                  proj4def.length > 0 &&
                  bbox &&
                  bbox.length == 4
                ) {
                  setProjection(code, name, proj4def, bbox);
                  return;
                }
              }
            }
          }
          setProjection(null, null, null, null);
        });
    }
    this.$refs.epsgsearch.addEventListener("click", function (event) {
      search(this.$refs.epsgquery.value);
      event.preventDefault();
    });
    renderEdgesCheckbox.addEventListener("change", function () {
      osmSource.setRenderReprojectionEdges(renderEdgesCheckbox.checked);
    });
    showTilesCheckbox.addEventListener("change", function () {
      debugLayer.setVisible(showTilesCheckbox.checked);
    });
    showGraticuleCheckbox.addEventListener("change", function () {
      graticule.setVisible(showGraticuleCheckbox.checked);
    });
  },
};
</script>
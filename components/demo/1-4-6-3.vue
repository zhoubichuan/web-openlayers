<template>
  <div>
    <div ref="map" class="map"></div>
    <form class="form-inline">
      <div class="col-md-3">
        <label for="base-layer">底图:</label>
        <select id="base-layer">
          <option value="osm">OSM (EPSG:3857)</option>
          <option value="wms4326">WMS (EPSG:4326)</option>
        </select>
      </div>
      <div class="col-md-4">
        <label for="overlay-layer">重叠地图:</label>
        <select id="overlay-layer">
          <option value="bng">英国国家电网(EPSG:27700)</option>
          <option value="wms21781">Swisstopo WMS (EPSG:21781)</option>
          <option value="wmts3413">NASA Arctic WMTS (EPSG:3413)</option>
          <option value="states">United States (EPSG:3857)</option>
        </select>
      </div>
      <div class="col-md-5">
        <label for="view-projection">观察投影:</label>
        <select id="view-projection">
          <option value="EPSG:3857">Spherical Mercator (EPSG:3857)</option>
          <option value="EPSG:4326">WGS 84 (EPSG:4326)</option>
          <option value="ESRI:54009">Mollweide (ESRI:54009)</option>
          <option value="EPSG:27700">British National Grid (EPSG:27700)</option>
          <option value="EPSG:23032">ED50 / UTM zone 32N (EPSG:23032)</option>
          <option value="EPSG:2163">
            US National Atlas Equal Area (EPSG:2163)
          </option>
          <option value="EPSG:3413">
            NSIDC Polar Stereographic North (EPSG:3413)
          </option>
          <option value="EPSG:5479">RSRGD2000 / MSLC2000 (EPSG:5479)</option>
        </select>
      </div>
    </form>
    <form class="form-inline">
      <div class="col-md-auto">
        <label>
          渲染重投影边:&nbsp;
          <input type="checkbox" id="render-edges" />
        </label>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      tilegrid: { TileGrid },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: {
        WMTS: { optionsFromCapabilities },
        OSM,
        TileImage,
        TileWMS,
      },
      format: { WMTSCapabilities },
      proj: {
        get: getProjection,
        transformExtent,
        proj4: { register },
      },
      extent: { getCenter, getWidth },
    } = ol;
    this.$proj4.defs(
      "EPSG:27700",
      "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 " +
        "+x_0=400000 +y_0=-100000 +ellps=airy " +
        "+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 " +
        "+units=m +no_defs"
    );
    this.$proj4.defs(
      "EPSG:23032",
      "+proj=utm +zone=32 +ellps=intl " +
        "+towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs"
    );
    this.$proj4.defs(
      "EPSG:5479",
      "+proj=lcc +lat_1=-76.66666666666667 +lat_2=" +
        "-79.33333333333333 +lat_0=-78 +lon_0=163 +x_0=7000000 +y_0=5000000 " +
        "+ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
    );
    this.$proj4.defs(
      "EPSG:21781",
      "+proj=somerc +lat_0=46.95240555555556 " +
        "+lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel " +
        "+towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs"
    );
    this.$proj4.defs(
      "EPSG:3413",
      "+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 " +
        "+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs"
    );
    this.$proj4.defs(
      "EPSG:2163",
      "+proj=laea +lat_0=45 +lon_0=-100 +x_0=0 +y_0=0 " +
        "+a=6370997 +b=6370997 +units=m +no_defs"
    );
    this.$proj4.defs(
      "ESRI:54009",
      "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 " + "+units=m +no_defs"
    );
    register(this.$proj4);
    const proj27700 = getProjection("EPSG:27700");
    proj27700.setExtent([-650000, -150000, 1350000, 1450000]);
    const proj23032 = getProjection("EPSG:23032");
    proj23032.setExtent([-1206118.71, 4021309.92, 1295389.0, 8051813.28]);
    const proj5479 = getProjection("EPSG:5479");
    proj5479.setExtent([6825737.53, 4189159.8, 9633741.96, 5782472.71]);
    const proj21781 = getProjection("EPSG:21781");
    proj21781.setExtent([485071.54, 75346.36, 828515.78, 299941.84]);
    const proj3413 = getProjection("EPSG:3413");
    proj3413.setExtent([-4194304, -4194304, 4194304, 4194304]);
    const proj2163 = getProjection("EPSG:2163");
    proj2163.setExtent([
      -8040784.5135, -2577524.921, 3668901.4484, 4785105.1096,
    ]);
    const proj54009 = getProjection("ESRI:54009");
    proj54009.setExtent([-18e6, -9e6, 18e6, 9e6]);
    const layers = {};
    layers["osm"] = new TileLayer({
      source: new OSM(),
    });
    layers["wms4326"] = new TileLayer({
      source: new TileWMS({
        url: "https://ahocevar.com/geoserver/wms",
        crossOrigin: "",
        params: {
          LAYERS: "ne:NE1_HR_LC_SR_W_DR",
          TILED: true,
        },
        projection: "EPSG:4326",
      }),
    });
    layers["wms21781"] = new TileLayer({
      source: new TileWMS({
        attributions:
          '© <a href="https://shop.swisstopo.admin.ch/en/products/maps/national/lk1000"' +
          'target="_blank">Pixelmap 1:1000000 / geo.admin.ch</a>',
        crossOrigin: "anonymous",
        params: {
          LAYERS: "ch.swisstopo.pixelkarte-farbe-pk1000.noscale",
          FORMAT: "image/jpeg",
        },
        url: "https://wms.geo.admin.ch/",
        projection: "EPSG:21781",
      }),
    });
    const parser = new WMTSCapabilities();
    layers["wmts3413"] = new TileLayer();
    const urlA =
      "https://map1.vis.earthdata.nasa.gov/wmts-arctic/" +
      "wmts.cgi?SERVICE=WMTS&request=GetCapabilities";
    fetch(urlA)
      .then(function (response) {
        return response.text();
      })
      .then(function (text) {
        const result = parser.read(text);
        const options = optionsFromCapabilities(result, {
          layer: "OSM_Land_Mask",
          matrixSet: "EPSG3413_250m",
        });
        options.crossOrigin = "";
        options.projection = "EPSG:3413";
        options.wrapX = false;
        layers["wmts3413"].setSource(new ol.source.WMTS(options));
      });

    layers["bng"] = new TileLayer();
    const urlB =
      "https://tiles.arcgis.com/tiles/qHLhLQrcvEnxjtPr/arcgis/rest/services/OS_Open_Raster/MapServer/WMTS";
    fetch(urlB)
      .then(function (response) {
        return response.text();
      })
      .then(function (text) {
        const result = parser.read(text);
        const options = optionsFromCapabilities(result, {
          layer: "OS_Open_Raster",
        });
        options.attributions =
          "Contains OS data © Crown Copyright and database right " +
          new Date().getFullYear();
        options.crossOrigin = "";
        options.projection = "EPSG:27700";
        options.wrapX = false;
        layers["bng"].setSource(new ol.source.WMTS(options));
      });

    const startResolution =
      getWidth(getProjection("EPSG:3857").getExtent()) / 256;
    const resolutions = new Array(22);
    for (let i = 0, ii = resolutions.length; i < ii; ++i) {
      resolutions[i] = startResolution / Math.pow(2, i);
    }

    layers["states"] = new TileLayer({
      source: new TileWMS({
        url: "https://ahocevar.com/geoserver/wms",
        crossOrigin: "",
        params: { LAYERS: "topp:states" },
        serverType: "geoserver",
        tileGrid: new TileGrid({
          extent: [-13884991, 2870341, -7455066, 6338219],
          resolutions: resolutions,
          tileSize: [512, 256],
        }),
        projection: "EPSG:3857",
      }),
    });
    const map = new Map({
      layers: [layers["osm"], layers["bng"]],
      target: this.$refs.map,
      view: new View({
        projection: "EPSG:3857",
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    const baseLayerSelect = document.getElementById("base-layer");
    const overlayLayerSelect = document.getElementById("overlay-layer");
    const viewProjSelect = document.getElementById("view-projection");
    const renderEdgesCheckbox = document.getElementById("render-edges");
    let renderEdges = false;
    function updateViewProjection() {
      const newProj = getProjection(viewProjSelect.value);
      const newProjExtent = newProj.getExtent();
      const newView = new View({
        projection: newProj,
        center: getCenter(newProjExtent || [0, 0, 0, 0]),
        zoom: 0,
        extent: newProjExtent || undefined,
      });
      map.setView(newView);
      if (newProj.isGlobal()) {
        layers["bng"].setExtent(
          transformExtent(proj27700.getExtent(), proj27700, newProj, 2)
        );
      } else {
        layers["bng"].setExtent(undefined);
      }
    }
    viewProjSelect.addEventListener("change", updateViewProjection);
    updateViewProjection();
    const updateRenderEdgesOnLayer = function (layer) {
      if (layer instanceof TileLayer) {
        const source = layer.getSource();
        if (source instanceof TileImage) {
          source.setRenderReprojectionEdges(renderEdges);
        }
      }
    };
    baseLayerSelect.addEventListener("change", function () {
      const layer = layers[baseLayerSelect.value];
      if (layer) {
        layer.setOpacity(1);
        updateRenderEdgesOnLayer(layer);
        map.getLayers().setAt(0, layer);
      }
    });
    overlayLayerSelect.addEventListener("change", function () {
      const layer = layers[overlayLayerSelect.value];
      if (layer) {
        layer.setOpacity(0.7);
        updateRenderEdgesOnLayer(layer);
        map.getLayers().setAt(1, layer);
      }
    });
    renderEdgesCheckbox.addEventListener("change", function () {
      renderEdges = renderEdgesCheckbox.checked;
      map.getLayers().forEach(function (layer) {
        updateRenderEdgesOnLayer(layer);
      });
    });
  },
};
</script>
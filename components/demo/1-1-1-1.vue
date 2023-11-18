<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      extent: { getWidth, getTopLeft },
      proj: { get: getProjection },
      tilegrid: { WMTS: WMTSTileGrid },
      layer: { Tile: TileLayer },
      source: { WMTS },
    } = ol;
    const projection = getProjection("EPSG:900913");
    const projectionExtent = projection.getExtent();
    const size = getWidth(projectionExtent) / 256;
    const resolutions = new Array(19);
    const matrixIds = new Array(19);
    for (let z = 0; z < 19; ++z) {
      resolutions[z] = size / Math.pow(2, z);
      matrixIds[z] = z;
    }
    const tileGrid = new WMTSTileGrid({
      origin: getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds,
    });
    var TiandiMap_vec = new ol.layer.Tile({
      name: "天地图矢量图层",
      source: new ol.source.XYZ({
        url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
        wrapX: false,
      }),
    });
    var TiandiMap_cva = new ol.layer.Tile({
      name: "天地图矢量注记图层",
      source: new ol.source.XYZ({
        url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
        wrapX: false,
      }),
    });
    var TiandiMap_img = new ol.layer.Tile({
      name: "天地图影像图层",
      source: new ol.source.XYZ({
        url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
        wrapX: false,
      }),
    });
    var TiandiMap_cia = new ol.layer.Tile({
      name: "天地图影像注记图层",
      source: new ol.source.XYZ({
        url: "http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
        wrapX: false,
      }),
    });
    var TiandiMap_ter = new ol.layer.Tile({
      name: "天地图地形图层",
      source: new ol.source.XYZ({
        url: "http://t0.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
        wrapX: false,
      }),
    });
    var TiandiMap_cta = new ol.layer.Tile({
      name: "天地图地形注记图层",
      source: new ol.source.XYZ({
        url: "http://t0.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=d97ee4980a986e7d0c4f0a8c8f103a94",
        wrapX: false,
      }),
    });

    new Map({
      view: new View({
        center: [12579156, 3274244],
        zoom: 12,
      }),
      layers: [
        TiandiMap_vec,
        // TiandiMap_cva,
        // TiandiMap_img,
        // TiandiMap_cia,
        // TiandiMap_ter,
        // TiandiMap_cta,
      ],
      target: this.$refs.map,
    });
  },
};
</script>
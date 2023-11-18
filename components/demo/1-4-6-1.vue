<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  mounted() {
    let {
      tilegrid: { WMTS: WMTSTileGrid },
      Map,
      View,
      layer: { Tile: TileLayer, Vector: VectorLayer },
      source: { WMTS },
      proj: { fromLonLat, get: getProjection },
      extent: { getWidth },
    } = ol;
    const map = new Map({
      target: this.$refs.map,
      view: new View({
        zoom: 5,
        center: fromLonLat([5, 45]),
      }),
    });
    const resolutions = [];
    const matrixIds = [];
    const proj3857 = getProjection("EPSG:3857");
    const maxResolution = getWidth(proj3857.getExtent()) / 256;
    for (let i = 0; i < 20; i++) {
      matrixIds[i] = i.toString();
      resolutions[i] = maxResolution / Math.pow(2, i);
    }
    map.addLayer(
      new TileLayer({
        source: new WMTS({
          url: "https://wxs.ign.fr/choisirgeoportail/geoportail/wmts",
          layer: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
          matrixSet: "PM",
          format: "image/png",
          projection: "EPSG:3857",
          tileGrid: new WMTSTileGrid({
            origin: [-20037508, 20037508],
            resolutions: resolutions,
            matrixIds: matrixIds,
          }),
          style: "normal",
          attributions:
            '<a href="https://www.ign.fr/" target="_blank">' +
            '<img src="https://wxs.ign.fr/static/logos/IGN/IGN.gif" title="Institut national de l\'' +
            'information géographique et forestière" alt="IGN"></a>',
        }),
      })
    );
  },
};
</script>
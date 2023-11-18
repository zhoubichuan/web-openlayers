<template>
  <div>
    <div id="map" class="map"></div>
    <div style="display: none">
      <div id="country-info">
        <div id="country-name">&nbsp;</div>
        <img id="country-flag" />
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      Overlay,
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { TileJSON, UTFGrid },
    } = ol;

    const mapLayer = new TileLayer({
      source: new TileJSON({
        url:
          "https://api.tiles.mapbox.com/v4/mapbox.geography-class.json?secure&access_token=" +
          mapkeys.mapbox,
      }),
    });
    const gridSource = new UTFGrid({
      url:
        "https://api.tiles.mapbox.com/v4/mapbox.geography-class.json?secure&access_token=" +
        mapkeys.mapbox,
    });
    const gridLayer = new TileLayer({ source: gridSource });
    const view = new View({
      center: [12579156, 3274244],
      zoom: 1,
    });
    const mapElement = document.getElementById("map");
    const map = new Map({
      layers: [mapLayer, gridLayer],
      target: mapElement,
      view: view,
    });
    const infoElement = document.getElementById("country-info");
    const flagElement = document.getElementById("country-flag");
    const nameElement = document.getElementById("country-name");
    const infoOverlay = new Overlay({
      element: infoElement,
      offset: [15, 15],
      stopEvent: false,
    });
    map.addOverlay(infoOverlay);
    const displayCountryInfo = function (coordinate) {
      const viewResolution = view.getResolution();
      gridSource.forDataAtCoordinateAndResolution(
        coordinate,
        viewResolution,
        function (data) {
          mapElement.style.cursor = data ? "pointer" : "";
          if (data) {
            flagElement.src = "data:image/png;base64," + data["flag_png"];
            nameElement.innerHTML = data["admin"];
          }
          infoOverlay.setPosition(data ? coordinate : undefined);
        }
      );
    };
    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      const coordinate = map.getEventCoordinate(evt.originalEvent);
      displayCountryInfo(coordinate);
    });
    map.on("click", function (evt) {
      displayCountryInfo(evt.coordinate);
    });
  },
};
</script>
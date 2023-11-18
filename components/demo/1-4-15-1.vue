<template>
  <div>
    <div ref="map" class="map"></div>
    <div class="controls">
      <div id="iiif-notification">&nbsp;</div>
      <label for="imageInfoUrl">Enter <code>info.json</code> URL:</label>
      <input
        type="text"
        id="imageInfoUrl"
        value="https://iiif.ub.uni-leipzig.de/iiif/j2k/0000/0107/0000010732/00000072.jpx/info.json"
      />
      <button id="display">Display image</button>
    </div>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      format: { IIIFInfo },
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { IIIF },
    } = ol;

    const layer = new TileLayer(),
      map = new Map({
        layers: [layer],
        target: this.$refs.map,
      }),
      notifyDiv = document.getElementById("iiif-notification"),
      urlInput = document.getElementById("imageInfoUrl"),
      displayButton = document.getElementById("display");

    function refreshMap(imageInfoUrl) {
      fetch(imageInfoUrl)
        .then(function (response) {
          response
            .json()
            .then(function (imageInfo) {
              const options = new IIIFInfo(imageInfo).getTileSourceOptions();
              if (options === undefined || options.version === undefined) {
                notifyDiv.textContent =
                  "Data seems to be no valid IIIF image information.";
                return;
              }
              options.zDirection = -1;
              const iiifTileSource = new IIIF(options);
              layer.setSource(iiifTileSource);
              map.setView(
                new View({
                  resolutions: iiifTileSource.getTileGrid().getResolutions(),
                  extent: iiifTileSource.getTileGrid().getExtent(),
                  constrainOnlyCenter: true,
                })
              );
              map.getView().fit(iiifTileSource.getTileGrid().getExtent());
              notifyDiv.textContent = "";
            })
            .catch(function (body) {
              notifyDiv.textContent = "Could not read image info json. " + body;
            });
        })
        .catch(function () {
          notifyDiv.textContent = "Could not read data from URL.";
        });
    }

    displayButton.addEventListener("click", function () {
      refreshMap(urlInput.value);
    });

    refreshMap(urlInput.value);
  },
};
</script>
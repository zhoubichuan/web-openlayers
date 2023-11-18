<template>
  <div>
    <div ref="map" class="map"></div>
    <div id="layertree">
      <h5>单击下面的层节点以更改其属性</h5>
      <ul>
        <li>
          <span>OSM 图层</span>
          <fieldset id="layer0">
            <label class="checkbox" for="visible0">
              visible <input id="visible0" class="visible" type="checkbox" />
            </label>
            <label>
              opacity
              <input class="opacity" type="range" min="0" max="1" step="0.01" />
            </label>
          </fieldset>
        </li>
        <li>
          <span>图层组</span>
          <fieldset id="layer1">
            <label class="checkbox" for="visible1">
              visible <input id="visible1" class="visible" type="checkbox" />
            </label>
            <label>
              opacity
              <input class="opacity" type="range" min="0" max="1" step="0.01" />
            </label>
          </fieldset>
          <ul>
            <li>
              <span>粮食不安全图层</span>
              <fieldset id="layer10">
                <label class="checkbox" for="visible10">
                  visible
                  <input id="visible10" class="visible" type="checkbox" />
                </label>
                <label>
                  opacity
                  <input
                    class="opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </label>
              </fieldset>
            </li>
            <li>
              <span>世界边界图层</span>
              <fieldset id="layer11">
                <label class="checkbox" for="visible11">
                  visible
                  <input id="visible11" class="visible" type="checkbox" />
                </label>
                <label>
                  opacity
                  <input
                    class="opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                  />
                </label>
              </fieldset>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer, Group: LayerGroup },
      source: { OSM, TileJSON },
      proj: { fromLonLat },
    } = ol;

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new LayerGroup({
          layers: [
            new TileLayer({
              source: new TileJSON({
                url:
                  "https://api.tiles.mapbox.com/v4/mapbox.20110804-hoa-foodinsecurity-3month.json?secure&access_token=" +
                  mapkeys.mapbox,
                crossOrigin: "anonymous",
              }),
            }),
            new TileLayer({
              source: new TileJSON({
                url:
                  "https://api.tiles.mapbox.com/v4/mapbox.world-borders-light.json?secure&access_token=" +
                  mapkeys.mapbox,
                crossOrigin: "anonymous",
              }),
            }),
          ],
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([37.4057, 8.81566]),
        zoom: 4,
      }),
    });

    function bindInputs(layerid, layer) {
      const visibilityInput = $(layerid + " input.visible");
      visibilityInput.on("change", function () {
        layer.setVisible(this.checked);
      });
      visibilityInput.prop("checked", layer.getVisible());

      const opacityInput = $(layerid + " input.opacity");
      opacityInput.on("input change", function () {
        layer.setOpacity(parseFloat(this.value));
      });
      opacityInput.val(String(layer.getOpacity()));
    }
    function setup(id, group) {
      group.getLayers().forEach(function (layer, i) {
        const layerid = id + i;
        bindInputs(layerid, layer);
        if (layer instanceof LayerGroup) {
          setup(layerid, layer);
        }
      });
    }
    setup("#layer", map.getLayerGroup());

    $("#layertree li > span")
      .click(function () {
        $(this).siblings("fieldset").toggle();
      })
      .siblings("fieldset")
      .hide();
  },
};
</script>
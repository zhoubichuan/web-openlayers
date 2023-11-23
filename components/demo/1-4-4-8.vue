<template>
  <ol-map id="map" class="map"></ol-map>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
    } = ol;
    class OLComponent extends HTMLElement {
      constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "css/ol.css");
        this.shadow.appendChild(link);
        const style = document.createElement("style");
        style.innerText = `
          :host {
            display: block;
          }
        `;
        this.shadow.appendChild(style);
        const div = document.createElement("div");
        div.style.width = "100%";
        div.style.height = "100%";
        this.shadow.appendChild(div);
        this.map = new Map({
          target: div,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [12579156, 3274244],
            zoom: 2,
          }),
        });
      }
    }
    customElements.define("ol-map", OLComponent);
  },
};
</script>
<template>
  <div>
    <div ref="map" class="map"></div>
    <input id="external-map-button" type="button" value="Open external map" />
    <span id="blocker-notice" hidden
      >Could not open map in external window. If you are using a popup or ad
      blocker you may need to disable it for this example.</span
    >
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Tile: TileLayer },
      source: { OSM },
      proj: { fromLonLat },
      control: { Control, FullScreen, defaults: defaultControls },
    } = ol;
    class UnusableMask extends Control {
      constructor() {
        super({
          element: document.createElement("div"),
        });
        this.element.setAttribute("hidden", "hidden");
        this.element.className = "ol-mask";
        this.element.innerHTML = "<div>Map not usable</div>";
      }
    }

    const map = new Map({
      target: this.$refs.map,
      controls: defaultControls().extend([
        new FullScreen(),
        new UnusableMask(),
      ]),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4,
      }),
    });

    let mapWindow;
    function closeMapWindow() {
      if (mapWindow) {
        mapWindow.close();
        mapWindow = undefined;
      }
    }
    // Close external window in case the main page is closed or reloaded
    window.addEventListener("pagehide", closeMapWindow);

    const button = document.getElementById("external-map-button");

    function resetMapTarget() {
      localMapTarget.style.height = "";
      map.setTarget(localMapTarget);
      button.disabled = false;
    }

    function updateOverlay() {
      if (!mapWindow) {
        return;
      }
      const externalMapTarget = mapWindow.document.getElementById("map");
      if (!externalMapTarget) {
        return;
      }
      if (document.visibilityState === "visible") {
        // Show controls and enable keyboard input
        externalMapTarget.classList.remove("unusable");
        externalMapTarget.setAttribute("tabindex", "0");
        externalMapTarget.focus();
      } else {
        // Hide all controls and disable keyboard input
        externalMapTarget.removeAttribute("tabindex");
        externalMapTarget.classList.add("unusable");
      }
    }
    window.addEventListener("visibilitychange", updateOverlay);

    button.addEventListener("click", function () {
      const blockerNotice = document.getElementById("blocker-notice");
      blockerNotice.setAttribute("hidden", "hidden");
      button.disabled = true;

      // Reset button and map target in case window did not load or open
      let timeoutKey = setTimeout(function () {
        closeMapWindow();
        resetMapTarget();
        blockerNotice.removeAttribute("hidden");
        timeoutKey = undefined;
      }, 3000);

      mapWindow = window.open(
        "resources/external-map-map.html",
        "MapWindow",
        "toolbar=0,location=0,menubar=0,width=800,height=600"
      );
      mapWindow.addEventListener("DOMContentLoaded", function () {
        const externalMapTarget = mapWindow.document.getElementById("map");
        localMapTarget.style.height = "0px";
        map.setTarget(externalMapTarget);

        if (timeoutKey) {
          timeoutKey = clearTimeout(timeoutKey);
        }
        mapWindow.addEventListener("pagehide", function () {
          resetMapTarget();
          // Close window in case user does a page reload
          closeMapWindow();
        });

        updateOverlay();
      });
    });
  },
};
</script>
<template>
  <div ref="map" class="map">
    <pre id="info" class="info" />
  </div>
</template>

<script>
export default {
  mounted() {
    let {
      Map,
      View,
      layer: { Layer },
      source: { Source },
      control: { FullScreen },
      tilegrid: { createXYZ },
    } = ol;
    const worker = new Worker("./worker.js", { type: "module" });

    let container,
      transformContainer,
      canvas,
      rendering,
      workerFrameState,
      mainThreadFrameState;
    function updateContainerTransform() {
      if (workerFrameState) {
        const viewState = mainThreadFrameState.viewState;
        const renderedViewState = workerFrameState.viewState;
        const center = viewState.center;
        const resolution = viewState.resolution;
        const rotation = viewState.rotation;
        const renderedCenter = renderedViewState.center;
        const renderedResolution = renderedViewState.resolution;
        const renderedRotation = renderedViewState.rotation;
        const transform = create();
        if (!rotation) {
          compose(
            transform,
            (renderedCenter[0] - center[0]) / resolution,
            (center[1] - renderedCenter[1]) / resolution,
            renderedResolution / resolution,
            renderedResolution / resolution,
            rotation - renderedRotation,
            0,
            0
          );
        }
        transformContainer.style.transform = toTransformString(transform);
      }
    }
    const map = new Map({
      layers: [
        new Layer({
          render: function (frameState) {
            if (!container) {
              container = document.createElement("div");
              container.style.position = "absolute";
              container.style.width = "100%";
              container.style.height = "100%";
              transformContainer = document.createElement("div");
              transformContainer.style.position = "absolute";
              transformContainer.style.width = "100%";
              transformContainer.style.height = "100%";
              container.appendChild(transformContainer);
              canvas = document.createElement("canvas");
              canvas.style.position = "absolute";
              canvas.style.left = "0";
              canvas.style.transformOrigin = "top left";
              transformContainer.appendChild(canvas);
            }
            mainThreadFrameState = frameState;
            updateContainerTransform();
            if (!rendering) {
              rendering = true;
              worker.postMessage({
                action: "render",
                frameState: JSON.parse(stringify(frameState)),
              });
            } else {
              frameState.animate = true;
            }
            return container;
          },
          source: new Source({
            attributions: [
              '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
              '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
            ],
          }),
        }),
      ],
      target: this.$refs.map,
      view: new View({
        resolutions: createXYZ({ tileSize: 512 }).getResolutions(),
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });
    map.addControl(new FullScreen());

    map.on("pointermove", function (evt) {
      if (evt.dragging) {
        return;
      }
      const pixel = map.getEventPixel(evt.originalEvent);
      worker.postMessage({
        action: "requestFeatures",
        pixel: pixel,
      });
    });
    worker.addEventListener("message", (message) => {
      if (message.data.action === "loadImage") {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.addEventListener("load", function () {
          createImageBitmap(image, 0, 0, image.width, image.height).then(
            (imageBitmap) => {
              worker.postMessage(
                {
                  action: "imageLoaded",
                  image: imageBitmap,
                  src: message.data.src,
                },
                [imageBitmap]
              );
            }
          );
        });
        image.src = message.data.src;
      } else if (message.data.action === "getFeatures") {
        showInfo(message.data.features);
      } else if (message.data.action === "requestRender") {
        map.render();
      } else if (canvas && message.data.action === "rendered") {
        requestAnimationFrame(function () {
          const imageData = message.data.imageData;
          canvas.width = imageData.width;
          canvas.height = imageData.height;
          canvas.getContext("2d").drawImage(imageData, 0, 0);
          canvas.style.transform = message.data.transform;
          workerFrameState = message.data.frameState;
          updateContainerTransform();
        });
        rendering = false;
      }
    });
    const info = document.getElementById("info");
    function showInfo(propertiesFromFeatures) {
      if (propertiesFromFeatures.length == 0) {
        info.innerText = "";
        info.style.opacity = 0;
        return;
      }
      const properties = propertiesFromFeatures.map((e) =>
        Object.keys(e)
          .filter((key) => !key.includes(":"))
          .reduce(
            (newObj, currKey) => ((newObj[currKey] = e[currKey]), newObj),
            {}
          )
      );
      info.innerText = JSON.stringify(properties, null, 2);
      info.style.opacity = 1;
    }
  },
};
</script>
Heliosen.Cesium = (() => {
  let viewer = null;
  let Viewer = class extends Cesium.Viewer {
    constructor(container, props) {
      super(container, props);
    }
  };

  return {
    initViewer(containerId, opt) {
      const options = opt ? opt : {};
      viewer = new Viewer(containerId, options);
      const scene = viewer.scene;
      const camera = viewer.camera;
      const canvas = viewer.canvas;
      // aggregator= new Cesium.CameraEventAggregator(canvas);
    },
    getViewer() {
      return viewer;
    },
  };
})();

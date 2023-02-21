const Heliosen = (() => {
  return {
    // Cesium Viewer
    Cesium: {},
    // Storage
    Storage: {},
    init(callback) {
      if (typeof callback === "function") callback();
    },
    // Measurement
    measure: {},
    // 생성돈 Measuremet 객체정보 저장
    measureCollection: {
      component: {},
      distance: {},
      horizontal: {},
      vertical: {},
      height: {},
      area: {},
      point: {}
    },
    // Transform
    transform: {},
    map: "osm"
  };
})();

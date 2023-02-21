/**
 * Cesium.ClippingPlaneCollection
 * A set of Clipping Planes. 클리핑 평면의 세트
 * Clipping planes selectively disable rendering in a region on the outside of the specified list of ClippingPlane objs for a single gltf model, 3dTileset, or the globe.
 * 클리핑 평면은 하나의 gltf 모델, 3DTileset, 혹은 globe 객체에 대한 특정한 클리핑 평면 리스트의 바깥 지역의 렌더링이 불가능 하도록 한다.
 * In general the clipping planes' coordinates are relative to the object they're attached to, so a plane with distance set to 0 will clip through the center of the object.
 * 일반적으로 클리핑평면의 좌표는 그것이 붙어있는 객체에 상대적이다. 그렇기 때문에 거리가 0으로 세팅된 평면은 object의 중앙을 clipping 할 것이다.
 * For 3D Tiles, the root tile's transform is used to position the clipping planes. If a transform is not defined, the root tile's Cesium3DTile#boundingSphere is used instead.
 * 3D Tiles의 경우, 루트타일의 transform이 클리핑 평면의 위치로 사용된다. 만약 transform이 없다면, 대신 루트 타일의 BoundingSphere가 사용된다.
 */

Heliosen.clipping = (() => {
  let clipping = null;
  const Clipping = class {
    constructor(tileset, viewer) {
      this.tileset = tileset;
      this.viewer = viewer ? viewer : Heliosen.Cesium.getViewer();
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.targetY = 0.0;
      this.addedEntities = [];
      this.planeEntities = [];
      this.selectedPlane;
      this.clippingPlanes;
      this.init();
    }

    init() {
      console.log("Clipping Plane");
    }

    //# 현재 사용중인 ClippingPlane 이벤트 제거
    resetEvent() {
      // 기존에 추가된 Clipping Plane 제거
      if (this.tileset.clippingPlanes) this.tileset.clippingPlanes.removeAll();
      // 해당 평면에 추가된 Plane 제거
      this.viewer.entities.remove(this.planeEntities[0]);
      this.planeEntities = [];
    }

    //# ClippingPlane 이벤트 설정
    setEvent(id) {
      this.resetEvent();
      switch (id) {
        case "x_plane":
          this.setXAxisEvent(); // X축 ClippingPlane 생성
          break;
        case "y_plane":
          this.setYAxisEvent(); // Y축 ClippingPlane 생성
          break;
        case "z_plane":
          this.setZAxisEvent(); // Z축 ClippingPlane 생성
          break;
        case "reset":
          this.resetEvent();
          break;
      }
    }

    //# X축 ClippingPlane
    setXAxisEvent() {
      console.log("setXAxisEvent");
      let tileset = this.tileset;
      const viewer = this.viewer;
      const handler = this.handler;
      let targetY = this.targetY;
      let planeEntities = this.planeEntities;
      let selectedPlane = this.selectedPlane;
      let clippingPlanes = (this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [new Cesium.ClippingPlane(new Cesium.Cartesian3(-1.0, 0.0, 0.0), 0.0)],
        edgeWidth: 1.0,
      }));
      let clickedPosition;

      // Mouse Down Event
      handler.setInputAction((movement) => {
        console.log("XaxisMouseDown");

        // 마우스로 선택한 객체가 ClippingPlane인지 확인
        const pickedObject = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedObject)) return;
        if (!Cesium.defined(pickedObject.id)) return;
        if (!Cesium.defined(pickedObject.id.plane)) return;

        // 현재 선택한 좌표
        clickedPosition = viewer.scene.pickPosition(movement.position);

        // 선택한 ClippingPlane 컬러 변경
        selectedPlane = pickedObject.id.plane;
        selectedPlane.material = Cesium.Color.RED.withAlpha(0.2);
        selectedPlane.outlineColor = Cesium.Color.WHITE;

        // 카메라 고정
        viewer.scene.screenSpaceCameraController.enableInputs = false;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // Mouse Up Event
      handler.setInputAction(() => {
        if (!Cesium.defined(selectedPlane)) return;

        // 선택중이던 ClippingPlane 컬러 복구
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.2);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        selectedPlane = undefined; //release plane on mouse up

        // 카메라 고정 해제
        viewer.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // Mouse Move Event
      handler.setInputAction((movement) => {
        if (!Cesium.defined(selectedPlane)) return;

        // 마우스 이동 거리 계산
        let distance = Cesium.Cartesian2.distance(movement.startPosition, movement.endPosition);

        // 마우스 이동 벡터와 X축 벡터의 방향 확인 (dot > 0 ~ 같은 방향, dot < 0 ~ 반대 방향)
        const pos1 = viewer.scene.pickPosition(movement.startPosition);
        const pos2 = viewer.scene.pickPosition(movement.endPosition);
        const value = Cesium.Cartesian3.subtract(pos2, pos1, new Cesium.Cartesian3());
        const xAxisVector = Heliosen.clipping.getClipping().getAxisVectorByPosition(clickedPosition, 'x');
        const dot = Cesium.Cartesian3.dot(xAxisVector, value);
        if (dot<0) distance *= -1;

        // ClippingPlane 이동
        const scale = Heliosen.util.getCameraScale();
        targetY += distance * scale * 100;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // tileset에 ClippingPlane 추가하기
      tileset._clippingPlanes = this.clippingPlanes;
      const boundingSphere = tileset.boundingSphere;
      const radius = boundingSphere.radius;
      if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
        // Clipping Plane은 기본적으로 tileset의 root transform에 위치함
        // bounding sphere의 center로 클리핑플레인의 중심점을 맞춰줌
        var transformCenter = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3());
        var transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter);
        var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var height = boundingSphereCartographic.height - transformCartographic.height;
        clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, height));
      }

      for (let i = 0, len = clippingPlanes.length; i < len; ++i) {
        const plane = clippingPlanes.get(i);
        const planeEntity = viewer.entities.add({
          position: boundingSphere.center, // ClippingPlane 생성 위치 => tileset 중심점
          plane: {
            dimensions: new Cesium.Cartesian2(radius * 1.1, radius * 1.1), // ClippingPlane 크기
            material: Cesium.Color.WHITE.withAlpha(0.5), // ClippingPlane 컬러
            plane: new Cesium.CallbackProperty(() => { // targetY값을 통해 ClippingPlane의 위치를 바꿀 수 있도록 콜백함수 처리
              plane.distance = targetY;
              return plane;
            }, false),
            outline: true, // ClippingPlane 테두리 on
            outlineColor: Cesium.Color.WHITE, // ClippingPlane 테두리 컬러
          },
        });
        planeEntities.push(planeEntity);
      }
    }

    //# Y축 ClippingPlane
    setYAxisEvent() {
      console.log("setYAxisEvent");
      let tileset = this.tileset;
      const viewer = this.viewer;
      const handler = this.handler;
      let targetY = this.targetY;
      let planeEntities = this.planeEntities;
      let selectedPlane = this.selectedPlane;
      let clippingPlanes = (this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 1.0, 0.0), 0.0)],
        edgeWidth: 1.0,
      }));
      let clickedPosition;
      // Mouse Down Event
      handler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedObject)) return;
        if (!Cesium.defined(pickedObject.id)) return;
        if (!Cesium.defined(pickedObject.id.plane)) return;

        clickedPosition = viewer.scene.pickPosition(movement.position);
        selectedPlane = pickedObject.id.plane;
        selectedPlane.material = Cesium.Color.RED.withAlpha(0.2);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        viewer.scene.screenSpaceCameraController.enableInputs = false;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // Mouse Up Event
      handler.setInputAction(() => {
        if (!Cesium.defined(selectedPlane)) return;
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.2);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        selectedPlane = undefined;

        viewer.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // Mouse Move Event
      handler.setInputAction((movement) => {
        if (!Cesium.defined(selectedPlane)) return;
        
        let distance = Cesium.Cartesian2.distance(movement.startPosition, movement.endPosition);

        const pos1 = viewer.scene.pickPosition(movement.startPosition);
        const pos2 = viewer.scene.pickPosition(movement.endPosition);
        const value = Cesium.Cartesian3.subtract(pos2, pos1, new Cesium.Cartesian3());
        const yAxisVector = Heliosen.clipping.getClipping().getAxisVectorByPosition(clickedPosition, 'y');
        const dot = Cesium.Cartesian3.dot(yAxisVector, value);
        if (dot < 0) distance *= -1;

        const scale = Heliosen.util.getCameraScale();
        targetY -= distance * scale * 100;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // tileset에 ClippingPlane 추가
      tileset._clippingPlanes = this.clippingPlanes;
      const boundingSphere = tileset.boundingSphere;
      const radius = boundingSphere.radius;
      if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
        var transformCenter = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3());
        var transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter);
        var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var height = boundingSphereCartographic.height - transformCartographic.height;
        clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, height));
      }

      for (let i = 0, len = clippingPlanes.length; i < len; ++i) {
        const plane = clippingPlanes.get(i);
        const planeEntity = viewer.entities.add({
          position: boundingSphere.center,
          plane: {
            dimensions: new Cesium.Cartesian2(radius * 1.1, radius * 1.1),
            material: Cesium.Color.WHITE.withAlpha(0.5),
            plane: new Cesium.CallbackProperty(() => {
              plane.distance = targetY;
              return plane;
            }, false),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
          },
        });
        planeEntities.push(planeEntity);
      }
    }

    //# Z축 ClippingPlane
    setZAxisEvent() {
      console.log("setZAxisEvent");
      let tileset = this.tileset;
      const viewer = this.viewer;
      const handler = this.handler;
      let targetY = this.targetY;
      let planeEntities = this.planeEntities;
      let selectedPlane = this.selectedPlane;
      let clippingPlanes = (this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0)],
        edgeWidth: 1.0,
      }));
      let clickedPosition;

      // Mouse Down Event
      handler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedObject)) return;
        if (!Cesium.defined(pickedObject.id)) return;
        if (!Cesium.defined(pickedObject.id.plane)) return;

        clickedPosition = viewer.scene.pickPosition(movement.position);
        selectedPlane = pickedObject.id.plane;
        selectedPlane.material = Cesium.Color.RED.withAlpha(0.2);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        viewer.scene.screenSpaceCameraController.enableInputs = false;
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      // Mouse Up Event
      handler.setInputAction(() => {
        if (!Cesium.defined(selectedPlane)) return;
        selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.2);
        selectedPlane.outlineColor = Cesium.Color.WHITE;
        selectedPlane = undefined;

        viewer.scene.screenSpaceCameraController.enableInputs = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);

      // Mouse Move Event
      handler.setInputAction((movement) => {
        if (!Cesium.defined(selectedPlane)) return;

        let distance = Cesium.Cartesian2.distance(movement.startPosition, movement.endPosition);

        const pos1 = viewer.scene.pickPosition(movement.startPosition);
        const pos2 = viewer.scene.pickPosition(movement.endPosition);
        const value = Cesium.Cartesian3.subtract(pos2, pos1, new Cesium.Cartesian3());
        const xAxisVector = Heliosen.clipping.getClipping().getAxisVectorByPosition(clickedPosition, 'x');
        const dot = Cesium.Cartesian3.dot(xAxisVector, value);
        if (dot<0) distance *= -1;

        const scale = Heliosen.util.getCameraScale();
        targetY -= distance * scale * 100;
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      // tileset에 ClippingPlane 추가
      tileset._clippingPlanes = this.clippingPlanes;
      const boundingSphere = tileset.boundingSphere;
      const radius = boundingSphere.radius;
      if (!Cesium.Matrix4.equals(tileset.root.transform, Cesium.Matrix4.IDENTITY)) {
        var transformCenter = Cesium.Matrix4.getTranslation(tileset.root.transform, new Cesium.Cartesian3());
        var transformCartographic = Cesium.Cartographic.fromCartesian(transformCenter);
        var boundingSphereCartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
        var height = boundingSphereCartographic.height - transformCartographic.height;
        clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0.0, 0.0, height));
      }

      for (let i = 0, len = clippingPlanes.length; i < len; ++i) {
        const plane = clippingPlanes.get(i);
        const planeEntity = viewer.entities.add({
          position: boundingSphere.center,
          plane: {
            dimensions: new Cesium.Cartesian2(radius * 1.1, radius * 1.1),
            material: Cesium.Color.WHITE.withAlpha(0.5),
            plane: new Cesium.CallbackProperty(() => {
              plane.distance = targetY;
              return plane;
            }, false),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
          },
        });
        planeEntities.push(planeEntity);
      }
    }

    // plane 위치 수정
    createPlaneUpdateFunction(plane) {
      return function () {
        plane.distance = this.targetY;
        return plane;
      };
    }

    // position에서의 type(XYZ 축) Vector 반환
    getAxisVectorByPosition (position, type) {
      // type = x(east), y(north), z(up) vector
      if (!position) return;
      const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position); // NorthEastUp 변환
      const matrix3 = Cesium.Matrix4.getMatrix3(modelMatrix, new Cesium.Matrix3()); // XYZ 벡터 추출
      type = type.toLowerCase();
      switch(type) {
        case 'x':
          return  Cesium.Matrix3.getColumn(matrix3, 0, new Cesium.Cartesian3());       
        case 'y' :
          return  Cesium.Matrix3.getColumn(matrix3, 1, new Cesium.Cartesian3());
        case 'z' : 
          return  Cesium.Matrix3.getColumn(matrix3, 2, new Cesium.Cartesian3());
      }
    }
  };

  return {
    initClipping(tileset, viewer) {
      clipping = new Clipping(tileset, viewer);
    },
    getClipping() {
      return clipping;
    },
    setEvent(id) {
      clipping.setEvent(id);
    },
    setClippingPlaneEvent() {
      clipping.setClippingPlaneEvent();
    },
    resetEvent() {
      clipping.resetEvent();
    },
  };
})();

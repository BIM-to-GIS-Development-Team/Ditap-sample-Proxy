Heliosen.measure = (() => {
  let measure = null;
  const Measure = class {
    constructor(viewer) {
      this.viewer = viewer;
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
      this.aggregator = new Cesium.CameraEventAggregator(this.viewer.scene.canvas);
      this.currentType = null;
      this.createdEntities = []; // 생성된 Entities 담는 배열
      this.init();
    }

    init() {
      console.log("[To do] 객체 생성시 어떤 작업 진행할 것인지?");
    }

    //# Measurement 이벤트 제거
    resetEvent() {
      Object.keys(this.handler._inputEvents).forEach((key) => (this.handler._inputEvents[key] = null));
      $(".hsen-analysis-tool").removeClass("btn-info").addClass("btn-dark");
    }

    setEvent(id) {
      this.currentType = id;
      switch (id) {
        case "component":
          this.setComponentEvent(); // component
          break;
        case "distance":
          this.setDistanceEvent(); // distance
          break;
        case "horizontal":
          this.setHorizontalEvent(); // horizontal
          break;
        case "vertical":
          this.setVerticalEvent(); // vertical
          break;
        case "height":
          this.setHeightEvent(); // height
          break;
        case "area":
          this.setAreaEvent(); // area
          break;
        case "point":
          this.setPointEvent(); // point
          break;
        case "reset":
          this.setResetEvent(); // reset
          break;
        default:
          break;
      }
    }

    void() {
      const _handler = this.handler;
      const _viewer = this.viewer;
      // Left Click Action
      _handler.setInputAction((click) => {
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;

        // Move Action
        _viewer.clock.onTick.addEventListener(cbFunc);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        _viewer.clock.onTick.removeEventListener(cbFunc);
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Component 이벤트
    setComponentEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;

      let isFirst = true; // true - 첫 번째 점 || false - 두 번째 점

      // Left Click Action
      _handler.setInputAction((click) => {
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;

        if (isFirst) {
          // # CallbackProperty를 위해 Storage에 guid: position 저장
          const guid = Cesium.createGuid();

          const guid_start = guid + "_start";
          const guid_end = guid + "_end";
          const guid_mid = guid + "_mid";

          const guid_line_dist = guid + "_line_dist";
          const guid_line_hori = guid + "_line_hori";
          const guid_line_verti = guid + "_line_verti";
          const guid_line_right1 = guid + "_line_right1";
          const guid_line_right2 = guid + "_line_right2";

          const guid_label_dist = guid + "_label_dist";
          const guid_label_hori = guid + "_label_hori";
          const guid_label_verti = guid + "_label_verti";
          const guid_label_angle1 = guid + "_label_angle1";
          const guid_label_angle2 = guid + "_label_angle2";

          Storage.set(guid_start, null);
          Storage.set(guid_end, null);
          Storage.set(guid_mid, null);

          Storage.set(guid_line_dist, []);
          Storage.set(guid_line_hori, []);
          Storage.set(guid_line_verti, []);
          Storage.set(guid_line_right1, []);
          Storage.set(guid_line_right2, []);

          Storage.set(guid_label_dist, null);
          Storage.set(guid_label_hori, null);
          Storage.set(guid_label_verti, null);
          Storage.set(guid_label_angle1, null);
          Storage.set(guid_label_angle2, null);

          // # Entity 생성
          const COMPONENT_COLOR = Cesium.Color.BLUEVIOLET;
          const start = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_start), false), guid_start, COMPONENT_COLOR);
          const end = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_end), false), guid_end, COMPONENT_COLOR);
          const mid = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_mid), false), guid_mid, COMPONENT_COLOR);

          const line_dist = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line_dist), false), guid_line_dist, COMPONENT_COLOR);
          const line_hori = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line_hori), false), guid_line_hori, COMPONENT_COLOR);
          const line_verti = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line_verti), false), guid_line_verti, COMPONENT_COLOR);
          const line_right1 = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line_right1), false), guid_line_right1, COMPONENT_COLOR, 1);
          const line_right2 = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line_right2), false), guid_line_right2, COMPONENT_COLOR, 1);

          const label_dist = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label_dist), false), guid_label_dist, COMPONENT_COLOR);
          const label_hori = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label_hori), false), guid_label_hori, COMPONENT_COLOR);
          const label_verti = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label_verti), false), guid_label_verti, COMPONENT_COLOR);
          const label_angle1 = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label_angle1), false), guid_label_angle1, COMPONENT_COLOR);
          const label_angle2 = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label_angle2), false), guid_label_angle2, COMPONENT_COLOR);

          this.createdEntities.push(start);
          this.createdEntities.push(end);
          this.createdEntities.push(mid);

          this.createdEntities.push(line_dist);
          this.createdEntities.push(line_hori);
          this.createdEntities.push(line_verti);
          this.createdEntities.push(line_right1);
          this.createdEntities.push(line_right2);

          this.createdEntities.push(label_dist);
          this.createdEntities.push(label_hori);
          this.createdEntities.push(label_verti);
          this.createdEntities.push(label_angle1);
          this.createdEntities.push(label_angle2);

          // # 객체 및 정보 저장
          Heliosen.measureCollection.component = {
            guid,
            start,
            end,
            mid,
            line_dist,
            line_hori,
            line_verti,
            line_right1,
            line_right2,
            label_dist,
            label_hori,
            label_verti,
            label_angle1,
            label_angle2,
          };

          // # Start Point 위치 저장
          Storage.set(guid_start, pos);

          // # isFirst Update
          isFirst = false;

          // # Move Action 등록
          _viewer.clock.onTick.addEventListener(this.handleCompomentMovement);
        } else {
          // # isFirst Update
          isFirst = true;
          // # Move Action 제거
          _viewer.clock.onTick.removeEventListener(this.handleCompomentMovement);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        // # Move Action 제거
        _viewer.clock.onTick.removeEventListener(this.handleCompomentMovement);
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Distance 이벤트
    setDistanceEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;

      let isFirst = true; // true - 첫 번째 점 || false - 두 번째 점

      // # Left Click Action
      _handler.setInputAction((click) => {
        const pos = _viewer.scene.pickPosition(click.position);
        if (!pos) return;

        if (isFirst) {
          // # CallbackProperty를 위해 Storage에 guid: position 저장
          const guid = Cesium.createGuid();
          const guid_p1 = guid + "_p1";
          const guid_p2 = guid + "_p2";
          const guid_line = guid + "_line";
          const guid_label = guid + "_label";
          Storage.set(guid_p1, null);
          Storage.set(guid_p2, null);
          Storage.set(guid_line, []);
          Storage.set(guid_label, null);

          // # Entity 생성
          const point1 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p1), false), guid_p1);
          const point2 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p2), false), guid_p2);
          const line = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line), false), guid_line);
          const label = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label), false), guid_label, Cesium.Color.RED);

          this.createdEntities.push(point1);
          this.createdEntities.push(point2);
          this.createdEntities.push(line);
          this.createdEntities.push(label);

          // # 객체 및 정보 저장
          Heliosen.measureCollection.distance = {
            guid,
            point1,
            point2,
            line,
            label,
          };

          // # 첫번째 점 위치 저장
          Storage.set(guid_p1, pos);

          // # isFirst Update
          isFirst = false;

          // # Move Action 등록
          _viewer.clock.onTick.addEventListener(this.handleDistanceMovement);
        } else {
          const collection = Heliosen.measureCollection.distance;
          // # 두 번째 점 위치 & line 위치 업데이트
          const p1 = Storage.get(collection.guid + "_p1");
          const p2 = Storage.get(collection.guid + "_p2");
          //collection.label.position = Cesium.Cartesian3.midpoint(p1, p2, new Cesium.Cartesian3());
          collection.label.label.text = `길이 : ${Heliosen.measure.getMeasure().getDistance(p1, p2)}`;

          // # isFirst Update
          isFirst = true;

          // # Move Action 제거
          _viewer.clock.onTick.removeEventListener(this.handleDistanceMovement);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        // # Move Action 제거
        _viewer.clock.onTick.removeEventListener(this.handleDistanceMovement);
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Horizontal 이벤트
    setHorizontalEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;

      let isFirst = true;
      // Left Click Action
      _handler.setInputAction((click) => {
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;
        if (isFirst) {
          // # CallbackProperty를 위해 Storage에 guid: position 저장
          const guid = Cesium.createGuid();
          const guid_p1 = guid + "_p1";
          const guid_p2 = guid + "_p2";
          const guid_p3 = guid + "_p3";
          const guid_line = guid + "_line";
          const guid_line2 = guid + "_line2";
          const guid_label = guid + "_label";

          Storage.set(guid_p1, null);
          Storage.set(guid_p2, null);
          Storage.set(guid_p3, null);
          Storage.set(guid_line, []);
          Storage.set(guid_line2, []);
          Storage.set(guid_label, null);

          // # Entity 생성
          const HORIZONTAL_COLOR = Cesium.Color.MEDIUMBLUE;
          const p1 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p1), false), guid_p1, HORIZONTAL_COLOR);
          const p2 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p2), false), guid_p2, HORIZONTAL_COLOR);
          const p3 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p3), false), guid_p3, HORIZONTAL_COLOR.withAlpha(0.2));
          const line = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line), false), guid_line, HORIZONTAL_COLOR);
          const line2 = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line2), false), guid_line2, HORIZONTAL_COLOR.withAlpha(0.2));
          const label = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label), false), guid_label, HORIZONTAL_COLOR);
          this.createdEntities.push(p1);
          this.createdEntities.push(p2);
          this.createdEntities.push(p3);
          this.createdEntities.push(line);
          this.createdEntities.push(line2);
          this.createdEntities.push(label);

          // # 객체 및 정보 저장
          Heliosen.measureCollection.horizontal = {
            guid,
            p1,
            p2,
            p3,
            line,
            line2,
            label,
            // lastMousePosition: winPos,
          };

          // # Start Point 위치 저장
          Storage.set(guid_p1, pos);

          // # isFirst Update
          isFirst = false;

          // # Move Action 등록
          _viewer.clock.onTick.addEventListener(this.handleHorizontalMovement);
        } else {
          // # isFirst Update
          isFirst = true;
          // # lastMousPosition 제거
          Heliosen.measureCollection.horizontal.lastMousePosition = null;
          // # Move Action 제거
          _viewer.clock.onTick.removeEventListener(this.handleHorizontalMovement);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        // # lastMousPosition 제거
        Heliosen.measureCollection.horizontal.lastMousePosition = null;
        // # move action 제거
        _viewer.clock.onTick.removeEventListener(this.handleHorizontalMovement);
        // # evnet 제거
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Vertical 이벤트
    setVerticalEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;

      let isFirst = true;
      // Left Click Action
      _handler.setInputAction((click) => {
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;
        if (isFirst) {
          // # CallbackProperty를 위해 Storage에 guid: position 저장
          const guid = Cesium.createGuid();
          const guid_p1 = guid + "_p1";
          const guid_p2 = guid + "_p2";
          const guid_line = guid + "_line";
          const guid_label = guid + "_label";

          Storage.set(guid_p1, null);
          Storage.set(guid_p2, null);
          Storage.set(guid_line, []);
          Storage.set(guid_label, null);

          // # Entity 생성
          const VERTICAL_COLOR = Cesium.Color.GREEN;
          const p1 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p1), false), guid_p1, VERTICAL_COLOR);
          const p2 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p2), false), guid_p2, VERTICAL_COLOR);
          const line = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_line), false), guid_line, VERTICAL_COLOR);
          const label = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label), false), guid_label, VERTICAL_COLOR);
          this.createdEntities.push(p1);
          this.createdEntities.push(p2);
          this.createdEntities.push(line);
          this.createdEntities.push(label);

          // # 객체 및 정보 저장
          Heliosen.measureCollection.vertical = {
            guid,
            p1,
            p2,
            line,
            label,
            lastMousePosition: winPos,
          };

          // # Start Point 위치 저장
          Storage.set(guid_p1, pos);

          // # isFirst Update
          isFirst = false;

          // # Move Action 등록
          _viewer.clock.onTick.addEventListener(this.handleVerticalMovement);
        } else {
          // # isFirst Update
          isFirst = true;
          // # lastMousPosition 제거
          Heliosen.measureCollection.vertical.lastMousePosition = null;
          // # Move Action 제거
          _viewer.clock.onTick.removeEventListener(this.handleVerticalMovement);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        // # lastMousPosition 제거
        Heliosen.measureCollection.vertical.lastMousePosition = null;
        // # Move Action 제거
        _viewer.clock.onTick.removeEventListener(this.handleVerticalMovement);
        // # event 제거
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Height 이벤트
    setHeightEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;
      let flag = true;

      // Left Click Action
      _handler.setInputAction((click) => {
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;
        if (!flag) {
          _viewer.clock.onTick.removeEventListener(this.handleHeightMovement);
          flag = !flag;
          return;
        }

        // # CallbackProperty를 위해 Storage에 guid: position 저장
        const guid = Cesium.createGuid();
        const guid_p1 = guid + "_p1";
        const guid_label = guid + "_label";

        Storage.set(guid_p1, null);
        Storage.set(guid_label, null);

        // # Entity 생성
        const HEIGHT_COLOR = Cesium.Color.DARKSEAGREEN;
        const p1 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p1), false), guid_p1, HEIGHT_COLOR);
        const label = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label), false), guid_label, HEIGHT_COLOR);
        this.createdEntities.push(p1);
        this.createdEntities.push(label);

        // # 객체 및 정보 저장
        Heliosen.measureCollection.height = {
          guid,
          p1,
          label,
        };

        // # P1 위치 저장
        Storage.set(guid_p1, pos);

        // 라벨 업데이트
        const groundPosition = Heliosen.measure.getMeasure().getGroundPosition(pos);
        label.label.text = "지형높이 : ";
        label.label.text += Cesium.Cartographic.fromCartesian(pos).height.toFixed(2) + "m";
        label.label.text += "\n 지형으로부터의 포인트 높이 : ";
        label.label.text += Heliosen.measure.getMeasure().getDistance(pos, groundPosition);
        label.position = pos;

        // Move Action
        _viewer.clock.onTick.addEventListener(this.handleHeightMovement);
        flag = !flag;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        flag = true;
        _viewer.clock.onTick.removeEventListener(this.handleHeightMovement);
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Area 이벤트
    setAreaEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;
      let _dynArr = [];
      let isFirst = true;
      let rightClickCount = 0;

      // Left Click Action
      _handler.setInputAction((click) => {
        rightClickCount = 0;
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;
        _dynArr.push(pos);
        const AREA_COLOR = Cesium.Color.CORNFLOWERBLUE;
        if (isFirst) {
          _dynArr.push(pos);
          // # CallbackProperty를 위해 Storage에 guid: position 저장
          const guid = Cesium.createGuid();
          const guid_polygon = guid + "_polygon";
          const guid_polyline = guid + "_polyline";
          const guid_label = guid + "_label";
          Storage.set(guid_polygon, []);
          Storage.set(guid_polyline, []);
          Storage.set(guid_label, null);

          // # Entity 생성
          const polygon = Heliosen.util.addPolygon(new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(Storage.get(guid_polygon)), false), guid_polygon, AREA_COLOR.withAlpha(0.5));
          const polyline = Heliosen.util.addPolyline(new Cesium.CallbackProperty(() => Storage.get(guid_polyline), false), guid_polyline, AREA_COLOR);
          const label = Heliosen.util.addLabel(pos, Cesium.createGuid(), AREA_COLOR);
          const point = Heliosen.util.addPoint(pos, null, AREA_COLOR);
          this.createdEntities.push(polygon);
          this.createdEntities.push(polyline);
          this.createdEntities.push(label);
          this.createdEntities.push(point);

          // # 객체 및 정보 저장
          Heliosen.measureCollection.area = {
            guid,
            polygon,
            polyline,
            label,
            dynArr: _dynArr,
          };
          isFirst = false;
          // # Move Action 등록
          _viewer.clock.onTick.addEventListener(this.handleAreaMovement);
        } else {
          const point = Heliosen.util.addPoint(pos, null, AREA_COLOR);
          this.createdEntities.push(point);
        }

        // # 첫번째 점 위치 저장
        Storage.set(Heliosen.measureCollection.area.guid + "_polygon", _dynArr);
        Storage.set(Heliosen.measureCollection.area.guid + "_polyline", _dynArr);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        // 우클릭 두 번 하면 꺼지도록
        if (++rightClickCount === 2) {
          this.resetEvent();
          return;
        }

        // moving position 제거
        _dynArr.pop();
        Storage.set(Heliosen.measureCollection.area.guid + "_polygon", _dynArr.concat());
        Storage.set(Heliosen.measureCollection.area.guid + "_polyline", _dynArr.concat([_dynArr[0]]));

        // moving action 제거
        _viewer.clock.onTick.removeEventListener(this.handleAreaMovement);

        // 변수 초기화
        _dynArr = [];
        isFirst = true;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Point 이벤트
    setPointEvent() {
      const _handler = this.handler;
      const _viewer = this.viewer;
      let flag = true;

      // Left Click Action
      _handler.setInputAction((click) => {
        const winPos = click.position;
        const pos = _viewer.scene.pickPosition(winPos);
        if (!pos) return;

        if (!flag) {
          _viewer.clock.onTick.removeEventListener(this.handlePointMovement);
          flag = !flag;
          return;
        }

        // # CallbackProperty를 위해 Storage에 guid: position 저장
        const guid = Cesium.createGuid();
        const guid_p1 = guid + "_p1";
        const guid_label = guid + "_label";

        Storage.set(guid_p1, null);
        Storage.set(guid_label, null);

        // # Entity 생성
        const POINT_COLOR = Cesium.Color.GOLDENROD;
        const p1 = Heliosen.util.addPoint(new Cesium.CallbackProperty(() => Storage.get(guid_p1), false), guid_p1, POINT_COLOR);
        const label = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => Storage.get(guid_label), false), guid_label, POINT_COLOR, Cesium.HorizontalOrigin.LEFT);

        this.createdEntities.push(p1);
        this.createdEntities.push(label);
        // # 객체 및 정보 저장
        Heliosen.measureCollection.point = {
          guid,
          p1,
          label,
        };

        // # P1 위치 저장
        Storage.set(guid_p1, pos);

        // // 라벨 업데이트
        const carto = Cesium.Cartographic.fromCartesian(pos);
        // label.label.text = "lon,lat,height\n";
        // label.label.text += "(";
        // label.label.text += Cesium.Math.toDegrees(carto.longitude).toFixed(6);
        // label.label.text += ", " + Cesium.Math.toDegrees(carto.latitude).toFixed(6);
        // label.label.text += ", " + carto.height.toFixed(2) + "m";
        // label.label.text += ")";
        label.label.text = `경도 : ${Cesium.Math.toDegrees(carto.longitude).toFixed(6)}\n위도 : ${Cesium.Math.toDegrees(carto.latitude).toFixed(6)}\n높이 : ${carto.height.toFixed(2)}m`;
        label.position = pos;

        // Move Action
        _viewer.clock.onTick.addEventListener(this.handlePointMovement);
        flag = !flag;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Right Click Action
      _handler.setInputAction((click) => {
        flag = true;
        _viewer.clock.onTick.removeEventListener(this.handlePointMovement);
        this.resetEvent();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //# Reset 이벤트
    setResetEvent() {
      // 생성된 모든 객체 삭제하기
      this.createdEntities.forEach((entity) => this.viewer.entities.remove(entity));
      this.currentType = null;
    }

    // <--- Moving Handler --->
    //# Component Mouse Move Handler
    handleCompomentMovement() {
      const collection = Heliosen.measureCollection.component;
      const guid = collection.guid;
      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();
      const pos = _viewer.scene.pickPosition(_aggregator.currentMousePosition);
      if (!pos) return;
      // End Point 업데이트
      Storage.set(collection.guid + "_end", pos);

      const start = collection.start.position.getValue();
      const end = pos;
      const [upper, down, mid] = Heliosen.measure.getMeasure().getComponentPoints(start, end);

      // Mid point 업데이트
      Storage.set(guid + "_mid", mid);

      // 거리 계산
      const dist = parseFloat(Heliosen.measure.getMeasure().getDistance(upper, down));
      const distHorizontal = parseFloat(Heliosen.measure.getMeasure().getDistance(mid, upper));
      const distVertical = parseFloat(Heliosen.measure.getMeasure().getDistance(mid, down));

      //직각 Point 위치 계산
      let rightDist = distHorizontal > distVertical ? distVertical : distHorizontal;
      rightDist = rightDist < 0.1 ? 0.1 : rightDist * 0.1;
      const rightUp = Heliosen.measure.getMeasure().getDistancedPositionWithDirection(mid, upper, rightDist);
      const rightDown = Heliosen.measure.getMeasure().getDistancedPositionWithDirection(mid, down, rightDist);

      // vector from mid to down
      const midToDown = Cesium.Cartesian3.subtract(rightDown, mid, new Cesium.Cartesian3());
      const rightMid = Cesium.Cartesian3.add(rightUp, midToDown, new Cesium.Cartesian3());
      // 직각선 위치 업데이트
      Storage.set(guid + "_line_right1", [rightMid, rightUp]);
      Storage.set(guid + "_line_right2", [rightMid, rightDown]);

      // 연결 선 위치 업데이트
      Storage.set(guid + "_line_dist", [upper, down]);
      Storage.set(guid + "_line_hori", [upper, mid]);
      Storage.set(guid + "_line_verti", [mid, down]);

      // 라벨 텍스트 업데이트
      collection.label_dist.label.text = dist + "m";
      collection.label_hori.label.text = distHorizontal + "m";
      collection.label_verti.label.text = distVertical + "m";
      collection.label_angle1.label.text = Heliosen.measure.getMeasure().getAngle(mid, upper, down);
      collection.label_angle2.label.text = Heliosen.measure.getMeasure().getAngle(mid, down, upper);

      // 라벨 위치 업데이트
      Storage.set(guid + "_label_dist", Heliosen.measure.getMeasure().getMidpoint(upper, down));
      Storage.set(guid + "_label_hori", Heliosen.measure.getMeasure().getMidpoint(upper, mid));
      Storage.set(guid + "_label_verti", Heliosen.measure.getMeasure().getMidpoint(mid, down));
      Storage.set(guid + "_label_angle1", Heliosen.measure.getMeasure().getAbovePosition(upper, 1));
      Storage.set(guid + "_label_angle2", Heliosen.measure.getMeasure().getAbovePosition(down, 1));
    }

    //# Distance Mouse Move Handler
    handleDistanceMovement() {
      const collection = Heliosen.measureCollection.distance;
      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();
      const pos = _viewer.scene.pickPosition(_aggregator.currentMousePosition);
      if (!pos) return;
      Storage.set(collection.guid + "_p2", pos);
      const p1 = Storage.get(collection.guid + "_p1");
      const p2 = Storage.get(collection.guid + "_p2");
      Storage.set(collection.guid + "_line", [p1, p2]);
      // const mid = Heliosen.measure.getMeasure().getMidpoint(p1, p2);
      collection.label.position = Cesium.Cartesian3.midpoint(p1, p2, new Cesium.Cartesian3());
      collection.label.label.text = `길이 : ${Heliosen.measure.getMeasure().getDistance(p1, p2)}`;
    }

    //# Horizontal Mouse Move Handler
    handleHorizontalMovement() {
      const collection = Heliosen.measureCollection.horizontal;
      const guid = collection.guid;

      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();

      const currPos = _viewer.scene.pickPosition(_aggregator.currentMousePosition);
      if (!currPos) return;
      const currCarto = Cesium.Cartographic.fromCartesian(currPos);

      const startPos = Storage.get(guid + "_p1");
      const startCarto = Cesium.Cartographic.fromCartesian(startPos);

      // 만약 선택한 곳의 높이가 높으면 라인을 윗쪽에 맞춰서 설정해줘야함.
      let movePos, p3Pos;
      let linePos, line2Pos, labelPos;
      if (currCarto.height > startCarto.height) {
        // 선택한 곳 위치가 시작점보다 높을 때
        movePos = Cesium.Cartesian3.fromRadians(currCarto.longitude, currCarto.latitude, currCarto.height);
        p3Pos = Cesium.Cartesian3.fromRadians(startCarto.longitude, startCarto.latitude, currCarto.height);
        linePos = [p3Pos, movePos];
        line2Pos = [startPos, p3Pos];
        labelPos = Heliosen.measure.getMeasure().getMidpoint(p3Pos, movePos);
      } else {
        // 선택한 곳 위치가 시작점보다 낮을 때
        movePos = Cesium.Cartesian3.fromRadians(currCarto.longitude, currCarto.latitude, startCarto.height);
        p3Pos = currPos;
        linePos = [startPos, movePos];
        line2Pos = [movePos, p3Pos];
        labelPos = Heliosen.measure.getMeasure().getMidpoint(startPos, movePos);
      }

      // 포인트 위치 업데이트
      Storage.set(guid + "_p2", movePos);
      Storage.set(guid + "_p3", p3Pos);
      // 라인 - Horizontal Line
      Storage.set(guid + "_line", linePos);
      // 라인2 - 바닥점 연결
      Storage.set(guid + "_line2", line2Pos);
      // 라벨 업데이트
      Storage.set(guid + "_label", labelPos);
      collection.label.label.text = `수평길이 : ${Heliosen.measure.getMeasure().getDistance(startPos, movePos)}`;
    }

    //# Vertical Mouse Move Handler
    handleVerticalMovement() {
      const collection = Heliosen.measureCollection.vertical;
      const guid = collection.guid;

      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();
      const y = _aggregator.currentMousePosition.y;
      const startPos = Storage.get(guid + "_p1");
      const startCarto = Cesium.Cartographic.fromCartesian(startPos);

      let prev_y = collection.lastMousePosition.y;

      const minus = prev_y - y;
      const diff = startCarto.height + minus / 5;
      const movePos = Cesium.Cartesian3.fromRadians(startCarto.longitude, startCarto.latitude, diff);

      // 포인트 위치 업데이트
      Storage.set(guid + "_p2", movePos);
      // 라인 위치 업데이트
      Storage.set(guid + "_line", [startPos, movePos]);
      // 라벨 업데이트
      Storage.set(guid + "_label", Heliosen.measure.getMeasure().getMidpoint(startPos, movePos));
      collection.label.label.text = `세로길이 : ${Heliosen.measure.getMeasure().getDistance(startPos, movePos)}`;
    }

    //# Height Mouse Move Handler
    handleHeightMovement() {
      console.log("handleHeightMovement");
      const collection = Heliosen.measureCollection.height;
      const guid = collection.guid;

      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();
      const pos = _viewer.scene.pickPosition(_aggregator.currentMousePosition);
      if (!pos) return;
      const zVector = Heliosen.measure.getMeasure().getZVector(pos);
      const heightVec = Cesium.Cartesian3.multiplyByScalar(zVector, -3, new Cesium.Cartesian3());
      const heightPos = Cesium.Cartesian3.add(pos, heightVec, new Cesium.Cartesian3());
      const groundPosition = Heliosen.measure.getMeasure().getGroundPosition(pos);

      // 포인트 업데이트
      Storage.set(guid + "_p1", pos);

      // 라벨 업데이트
      collection.label.label.text = "지형높이 : ";
      collection.label.label.text += Cesium.Cartographic.fromCartesian(pos).height.toFixed(2) + "m";
      collection.label.label.text += "\n 지형으로부터의 포인트 높이: ";
      collection.label.label.text += Heliosen.measure.getMeasure().getDistance(pos, groundPosition); // 이 길이가 뭘까......
      collection.label.position = heightPos;
    }

    //# Area Mouse Move Handler
    handleAreaMovement() {
      const collection = Heliosen.measureCollection.area;
      const guid = collection.guid;
      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();

      const pos = _viewer.scene.pickPosition(_aggregator.currentMousePosition);
      if (!pos) return;

      collection.dynArr.pop();
      collection.dynArr.push(pos);

      // 라인 위치 업데이트
      Storage.set(guid + "_polygon", collection.dynArr);
      Storage.set(guid + "_polyline", collection.dynArr.concat([collection.dynArr[0]]));

      // 라벨 업데이트
      const area = Heliosen.measure.getMeasure().getPolygonArea(collection.dynArr);
      collection.label.position = Cesium.BoundingSphere.fromPoints(collection.dynArr).center;
      collection.label.label.text = `넓이 : ${area}m2`;
    }

    //# Point Mouse Move Handler
    handlePointMovement() {
      const collection = Heliosen.measureCollection.point;
      const guid = collection.guid;

      const _aggregator = Heliosen.measure.getAggregator();
      const _viewer = Heliosen.Cesium.getViewer();
      const pos = _viewer.scene.pickPosition(_aggregator.currentMousePosition);
      if (!pos) return;
      const zVector = Heliosen.measure.getMeasure().getZVector(pos);
      const heightVec = Cesium.Cartesian3.multiplyByScalar(zVector, -3, new Cesium.Cartesian3());
      const heightPos = Cesium.Cartesian3.add(pos, heightVec, new Cesium.Cartesian3());

      // 포인트 업데이트
      Storage.set(guid + "_p1", pos);

      // 라벨 업데이트
      const carto = Cesium.Cartographic.fromCartesian(pos);
      // collection.label.label.text = "lon,lat,height\n";
      // collection.label.label.text += "(";
      // collection.label.label.text += Cesium.Math.toDegrees(carto.longitude).toFixed(6);
      // collection.label.label.text += ", " + Cesium.Math.toDegrees(carto.latitude).toFixed(6);
      // collection.label.label.text += ", " + carto.height.toFixed(2);
      // collection.label.label.text += ")";
      collection.label.label.text = `경도 : ${Cesium.Math.toDegrees(carto.longitude).toFixed(6)}\n위도 : ${Cesium.Math.toDegrees(carto.latitude).toFixed(6)}\n높이 : ${carto.height.toFixed(2)}m`;
      collection.label.position = heightPos;
    }

    // <--- Calculation Function --->
    // point p ~ point q 사이의 중간점
    getMidpoint(p, q) {
      const scratch = new Cesium.Cartesian3();
      return Cesium.Cartesian3.lerp(p, q, 0.5, scratch);
    }

    getComponentPoints(p, q) {
      let upper, down, mid;
      const pCarto = Cesium.Cartographic.fromCartesian(p);
      const qCarto = Cesium.Cartographic.fromCartesian(q);
      if (pCarto.height < qCarto.height) {
        upper = q;
        down = p;
        let midCarto = new Cesium.Cartographic(pCarto.longitude, pCarto.latitude, qCarto.height);
        mid = Cesium.Cartesian3.fromRadians(midCarto.longitude, midCarto.latitude, midCarto.height);
      } else {
        upper = p;
        down = q;
        let midCarto = new Cesium.Cartographic(qCarto.longitude, qCarto.latitude, pCarto.height);
        mid = Cesium.Cartesian3.fromRadians(midCarto.longitude, midCarto.latitude, midCarto.height);
      }
      return [upper, down, mid];
    }

    // point p ~ point q 길이
    getDistance(p, q) {
      let scratch = new Cesium.Cartesian3();
      let distance = Cesium.Cartesian3.distance(p, q, scratch);

      return distance.toFixed(2) + "m";
    }

    // point p에서 Z Vector 방향으로 Ray를 쐈을 때 충돌하는 지점의 좌표 반환
    getGroundPosition(p) {
      const zVector = Heliosen.measure.getMeasure().getZVector(p);
      const ray = new Cesium.Ray(p, zVector);
      const viewer = Heliosen.Cesium.getViewer();
      const results = viewer.scene.drillPickFromRay(ray);

      if (results.length === 0) return p; // 들어온 포인트 그대로 돌려보내기
      const groundPosition = results[results.length - 1].position;
      return groundPosition;
    }

    //# point p에서 Z Vector 방향으로 height만큼 이돋한 좌표
    getAbovePosition(p, height = 3) {
      const scratch = new Cesium.Cartesian3();
      const zVector = Heliosen.measure.getMeasure().getZVector(p);
      const len = height * -1;

      const heightVec = Cesium.Cartesian3.multiplyByScalar(zVector, len, scratch);
      const abovePos = Cesium.Cartesian3.add(p, heightVec, scratch);

      return abovePos;
    }

    //# p에서 q방향으로 distance만큼 떨어진 위치 구함
    getDistancedPositionWithDirection(p, q, distance) {
      let vector = Cesium.Cartesian3.subtract(q, p, new Cesium.Cartesian3());
      vector = Cesium.Cartesian3.normalize(vector, vector);
      vector = Cesium.Cartesian3.multiplyByScalar(vector, distance, new Cesium.Cartesian3());
      return Cesium.Cartesian3.add(p, vector, new Cesium.Cartesian3());
    }

    //# point p에서 -height 방향 vector 반환
    getZVector(p) {
      let _p = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(p);
      _p.height += 1;
      _p = this.viewer.scene.globe.ellipsoid.cartographicToCartesian(_p);
      return Cesium.Cartesian3.subtract(p, _p, new Cesium.Cartesian3());
    }

    //# ∠pqr 각도 계산
    getAngle(p, q, r) {
      let vec1 = Cesium.Cartesian3.subtract(p, q, new Cesium.Cartesian3());
      vec1 = Cesium.Cartesian3.normalize(vec1, vec1);
      let vec2 = Cesium.Cartesian3.subtract(r, q, new Cesium.Cartesian3());
      vec2 = Cesium.Cartesian3.normalize(vec2, vec2);

      let dot = Cesium.Cartesian3.dot(vec1, vec2, new Cesium.Cartesian3());
      let theta = Math.acos(dot);

      return Cesium.Math.toDegrees(theta).toFixed(2) + "˚";
    }

    //# 폴리곤 영역 넓이 계산
    getPolygonArea(cartesians) {
      let totalArea = 0;
      if (cartesians.length < 3) return 0;

      const cartographics = [];
      /** 입력된 point가 시계방향인지 반시계방향인지 확인  */
      for (let i = 0, len = cartesians.length; i < len; i++) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesians[i]);
        cartographics.push(new Cesium.Cartesian2(cartographic.longitude, cartographic.latitude));
      }
      /** 시계방향이라면 reverse (why?) */
      if (Cesium.PolygonPipeline.computeWindingOrder2D(cartographics) === Cesium.WindingOrder.CLOCKWISE) {
        cartographics.reverse();
      }

      const triangles = Cesium.PolygonPipeline.triangulate(cartographics);
      for (let i = 0, len = triangles.length; i < len; i += 3) {
        const p = cartesians[triangles[i]];
        const q = cartesians[triangles[i + 1]];
        const r = cartesians[triangles[i + 2]];
        const area = Heliosen.measure.getMeasure().getTriangleArea(p, q, r);
        totalArea += area;
      }

      return totalArea.toFixed(2);
    }

    // pqr 삼각형 넓이 계산
    getTriangleArea(p, q, r) {
      let vec1 = Cesium.Cartesian3.subtract(q, p, new Cesium.Cartesian3());
      vec1 = Cesium.Cartesian3.normalize(vec1, vec1);
      let vec2 = Cesium.Cartesian3.subtract(r, p, new Cesium.Cartesian3());
      vec2 = Cesium.Cartesian3.normalize(vec2, vec2);
      let len1 = Cesium.Cartesian3.distance(p, q);
      let len2 = Cesium.Cartesian3.distance(p, r);

      let dot = Cesium.Cartesian3.dot(vec1, vec2, new Cesium.Cartesian3()); // cos
      let theta = Math.acos(dot);

      return len1 * len2 * Math.sin(theta) * 0.5;
    }
  };

  return {
    entities: [],
    currentTypeId: null,
    temp: {},
    initMeasure(viewer) {
      measure = new Measure(viewer);
    },
    getMeasure() {
      return measure;
    },
    getAggregator() {
      return measure.aggregator;
    },

    resetEvent() {
      measure.resetEvent();
    },

    setEvent(id) {
      measure.setEvent(id);
    },
  };
})();
Heliosen.util = (() => {
  
  return {
    changeMap(type) {
      let viewer = Heliosen.Cesium.getViewer();
      if (!viewer) return;
      if (Heliosen.map == type) return;

      let imagery;
      if (type == "osm") {
        imagery = new Cesium.OpenStreetMapImageryProvider({url : 'https://a.tile.openstreetmap.org/'});
      } else if (type == "ortho") {
        // imagery = new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://175.45.205.61:18080/geoserver_tif/gwc/service/wmts/rest/seoul:cloud_all/{style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}?format=image/png",
        //   layer: "seoul:cloud_all",
        //   style: "raster",
        //   tileMatrixSetID: "EPSG:4326_18",
        //   tilingScheme: new Cesium.GeographicTilingScheme(),
        //   maximumLevel: 18,
        // });
        imagery = new Cesium.UrlTemplateImageryProvider({
          url: `${location.origin}/Ditap/proxy/tileMap001.do?tilematrix={z}&tilerow={y}&tilecol={x}`,
          tilingScheme : new Cesium.GeographicTilingScheme(),
          maximumLevel: 18
        });
      } else {
        return;
      }

      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider( imagery );

      Heliosen.map = type;
    },

    getCameraHeight() {
      let viewer = Heliosen.Cesium.getViewer();
      if (!viewer) return;
      const cartesian = viewer.camera.position;
      const ctg = Cesium.Cartographic.fromCartesian(cartesian);
      return ctg.height;
    },

    setCameraHeight(value) {
      let viewer = Heliosen.Cesium.getViewer();
      if (!viewer) return;

      let origin = viewer.camera.position;
    
      let direction = viewer.camera.direction;
    
      let viewerRay = new Cesium.Ray(origin, direction);
      let ellipsoid = Cesium.Ellipsoid.WGS84;
      const intersection = Cesium.IntersectionTests.rayEllipsoid(
        viewerRay,
        ellipsoid
      );
      const point = Cesium.Ray.getPoint(viewerRay, intersection.start);
    
      const cartographic = Cesium.Cartographic.fromCartesian(point);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      console.log(lat, lon);
    
      //value값에 따라서 카메라의 높이와 각도 수정하기
      cartographic.height = value;
      let cartesian = Cesium.Cartographic.toCartesian(cartographic);
    
      viewer.camera.setView({
        destination: cartesian,
        orientation: {
          heading: Cesium.Math.toRadians(0.0),
          pitch: Cesium.Math.toRadians(-90.0),
        },
      });
    },

    getCameraScale() {
      let viewer = Heliosen.Cesium.getViewer();
      if (!viewer) return;
      const near = viewer.camera.frustum.near;
      const height = Cesium.Cartographic.fromCartesian(viewer.camera.position).height;
      
      return near / height;
    },

    addPoint(pos, guid, color, size) {
      let viewer = Heliosen.Cesium.getViewer();
      if (!viewer) return;
      return viewer.entities.add({
        id: guid || Cesium.createGuid(),
        position: pos,
        point: {
          color: color || Cesium.Color.RED,
          pixelSize: size || 15,
        },
      });
    },

    addPolyline(pos, guid, color, width) {
      let viewer = Heliosen.Cesium.getViewer();
      if (!viewer) return; //  if ( !viewer || !pos || !Array.isArray(pos) )  return
      return viewer.entities.add({
        id: guid || Cesium.createGuid(),
        polyline: {
          positions: pos,
          width: width || 5,
          material: color || Cesium.Color.RED
        },
      });
    },

    // addPolygon(pos, guid, color, clampToGround) {
    addPolygon(hierarchy, guid, color, clampToGround, material) {
      let viewer = Heliosen.Cesium.getViewer();
      const _color = color || Cesium.Color.RED.withAlpha(0.5);
      if (!viewer) return;
      return viewer.entities.add({
        id: guid || Cesium.createGuid(),
        polygon: {
          // hierarchy: new Cesium.PolygonHierarchy(pos),
          hierarchy: hierarchy,
          material: material || new Cesium.ColorMaterialProperty(_color),
          perPositionHeight: clampToGround || true,
        },
      });
    },

    addLabel(pos, guid, color=Cesium.Color.BLACK, horizontal=Cesium.HorizontalOrigin.CENTER, vertical=Cesium.VerticalOrigin.CENTER) {
      let viewer = Heliosen.Cesium.getViewer();
      return viewer.entities.add({
        id: guid || Cesium.createGuid(),
        position: pos,
        label: {
          font: "14px monospace",
          showBackground: true,
          horizontalOrigin: horizontal,
          verticalOrigin: vertical,
          pixelOffset: new Cesium.Cartesian2(20, -20),
          eyeOffset: new Cesium.Cartesian3(0, 0, -10),
          fillColor: Cesium.Color.WHITE,
          backgroundColor: color
        },
      });
    },

    addDepthFailPolyline(pos, guid, color, width, fabric) {
      let viewer = Heliosen.Cesium.getViewer();
      color = color || Cesium.Color.RED
      return viewer.scene.primitives.add(
        new Cesium.Primitive({
          //# geomtry 설정
          geometryInstances : new Cesium.GeometryInstance({
            id : guid || Cesium.createGuid(), //ID
            geometry: new Cesium.PolylineGeometry({ //position, width
              positions: pos,
              width : width || 5,
            })
          }),
          //# 입력된 geomretryInstances 생상 설정
          appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
              fabric: {
                type: fabric || "Color", //fabric 타입에 따라 polyline 모양이 바뀜
                uniforms: {
                  color: color
                }
              }
            }),
          }),
          //# 입력된 geometryInstance가 depthfail인 경우 Alpha 색상 적용
          depthFailAppearance : new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
              fabric: {
                type: fabric || "Color",
                uniforms: {
                  color: color.withAlpha(0.35)
                  //color: color
                }
              }
            }),
          }),
          asynchronous: false //비동기 해제
        })
      )
    },

    addCircle(position, radius, color, height) {
      let viewer = Heliosen.Cesium.getViewer();
      color = color || Cesium.Color.RED
      if (height) {
        return viewer.entities.add({
          id: Cesium.createGuid(),
          position: position,
          ellipse: {
            height: height,
            semiMinorAxis: radius,
            semiMajorAxis: radius,
            material: color
          }
        })
      } else {
        return viewer.entities.add({
          id: Cesium.createGuid(),
          position: position,
          ellipse: {
            semiMinorAxis: radius,
            semiMajorAxis: radius,
            material: color
          }
        })
      }
      
    }
  }
})();

<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="">
<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width4d5vice-width,45nitial-scale41.0" />
<!-- Cesium CSS -->
<link
	href="https://cesium.com/downloads/cesiumjs/releases/1.77/Build/Cesium/Widgets/widgets.css"
	rel="stylesheet" />
<!-- Bootstrap CSS -->
<link
	href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css"
	rel="stylesheet"
	integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x"
	crossorigin="anonymous" />
<link rel="stylesheet" type="text/css"
	href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
<!-- CSS -->
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/reset.css">
<link rel="stylesheet"
	href="${pageContext.request.contextPath}/css/main.css">
<!-- font -->

<title>다이탭</title>
</head>
<body>
	<div id="wrap">
		<div id="header_wrap">
			<div class="header">
				<h1>
					<img src="${pageContext.request.contextPath}/public/img/ditap3.png"
						alt="logo" />
				</h1>
			</div>
		</div>
		<div>
			<div class="tool tool_left">
				<ul>
					<li>
						<p class="tool_3d">
							<img src="${pageContext.request.contextPath}/public/img/search2.png"
								alt="search" />
						</p>
					</li>
				</ul>
			</div>
			<div class="tool">
				<div class="measurement-container">
					<button class="btn btn-primary analysis-header"
						style="cursor: default;">
						<span class="btn_img"><img
							src="${pageContext.request.contextPath}/public/img/measur.png"
							alt="Measurement" /></span><span>측정</span>
					</button>
					<div class="tool_btn_list">
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="component_distance_btn" data-type="component">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img1.png"
								alt="list_img" /></span> <span>컴포넌트</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="distance_btn" data-type="distance">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img2.png"
								alt="list_img" /></span> <span>길이</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="horizontal_btn" data-type="horizontal">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img3.png"
								alt="list_img" /></span> <span>수평</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="vertical_btn" data-type="vertical">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img4.png"
								alt="list_img" /></span> <span>세로길이</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="height_btn" data-type="height">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img5.png"
								alt="list_img" /></span> <span>높이</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="area_btn" data-type="area">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img6.png"
								alt="list_img" /></span> <span>넓이</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							id="point_btn" data-type="point">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img7.png"
								alt="list_img" /></span> <span>좌표</span>
						</button>
						<button class="btn btn-sm btn-dark measure_btn hsen-analysis-tool"
							data-type="reset">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img8.png"
								alt="list_img" /></span> <span>초기화</span>
						</button>
					</div>
				</div>
				<div class="transform-container">
					<button class="btn btn-primary analysis-header"
						style="cursor: default;">
						<span class="btn_img"><img
							src="${pageContext.request.contextPath}/public/img/refresh.png"
							alt="Transform" /></span><span>변환</span>
					</button>
					<div class="tool_btn_list tool_btn_list2">
						<button class="btn btn-sm btn-dark editor_btn hsen-analysis-tool"
							id="editor_translation_btn" data-type="translation">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img21.png"
								alt="list_img" /></span> <span>이동</span>
						</button>
						<button class="btn btn-sm btn-dark editor_btn hsen-analysis-tool"
							id="editor_rotation_btn" data-type="rotation">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img22.png"
								alt="list_img" /></span> <span>회전</span>
						</button>
						<button class="btn btn-sm btn-dark editor_btn hsen-analysis-tool"
							id="editor_scale_btn" data-type="scale">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img23.png"
								alt="list_img" /></span> <span>비율</span>
						</button>
					</div>
				</div>
				<div class="clipping-container">
					<button class="btn btn-primary analysis-header"
						style="cursor: default;">
						<span class="btn_img"><img
							src="${pageContext.request.contextPath}/public/img/clip.png"
							alt="Clipping" /></span><span>단면도</span>
					</button>
					<div class="tool_btn_list">
						<button
							class="btn btn-sm btn-dark clipping_btn hsen-analysis-tool"
							id="x_plane_btn" data-type="x_plane">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img31.png"
								alt="list_img" /></span> <span>X평면</span>
						</button>
						<button
							class="btn btn-sm btn-dark clipping_btn hsen-analysis-tool"
							id="y_plane_btn" data-type="y_plane">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img32.png"
								alt="list_img" /></span> <span>Y평면</span>
						</button>
						<button
							class="btn btn-sm btn-dark clipping_btn hsen-analysis-tool"
							id="z_plane_btn" data-type="z_plane">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img33.png"
								alt="list_img" /></span> <span>Z평면</span>
						</button>
						<button
							class="btn btn-sm btn-dark clipping_btn hsen-analysis-tool"
							data-type="reset">
							<span class="btn_img2"><img
								src="${pageContext.request.contextPath}/public/img/img8.png"
								alt="list_img" /></span> <span>초기화</span>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="tool tool_bottom">
			<div class="measurement-container">
				<button class="btn btn-primary analysis-header zoomStep" data-type="zoomIn"><span class="btn_img3"><img
							src="${pageContext.request.contextPath}/public/img/plus.png"
							alt="plus" /></span></button>
			</div>			
			<div class="measurement-container">
				<button class="btn btn-primary analysis-header zoomStep" data-type="zoomOut"><span class="btn_img3"><img
							src="${pageContext.request.contextPath}/public/img/minus.png"
							alt="minus" /></span></button>
			</div>
		</div>
		<!-- 플러스 마이너스  -->
		<div>
			<div class="map_btn" id="baseLayerPickerContainer" data-type="osm">
				<p class="map_img"><img src="${pageContext.request.contextPath}/public/img/osm.jpg" alt="일반 지도"/></p>
				<p class="map_title">일반지도</p>
			</div>
			<div class="map_btn" id="baseLayerPickerContainer2" data-type="ortho">
				<p class="map_img"><img src="${pageContext.request.contextPath}/public/img/ortho.jpg" alt="위성 지도"/></p>
				<p class="map_title">영상지도</p>
			</div>
		</div>
		<div id="cesiumContainer"></div>
	</div>
	<!-- CesiumJS-->
	<script
		src="https://cesium.com/downloads/cesiumjs/releases/1.95/Build/Cesium/Cesium.js"></script>
	<!-- Jquery-->
	<script src="${pageContext.request.contextPath}/js/jquery-3.5.1.min.js"></script>

	<!-- Index -->
	<script src="${pageContext.request.contextPath}/js/index.js"></script>
	<!-- Cesium Viewer -->
	<script src="${pageContext.request.contextPath}/js/cesium.js"></script>
	<!-- Storage -->
	<script src="${pageContext.request.contextPath}/js/storage.js"></script>
	<!-- Cesium Utility -->
	<script src="${pageContext.request.contextPath}//js/utils.js"></script>
	<!-- Measurement -->
	<script src="${pageContext.request.contextPath}/js/measure.js"></script>
	<!-- Transform -->
	<script src="${pageContext.request.contextPath}/js/transform.js"></script>
	<!-- Clipping -->
	<script src="${pageContext.request.contextPath}/js/clipping.js"></script>
	<!-- Event -->
	<script src="${pageContext.request.contextPath}/js/events.js"></script>

	<script>
        let viewer;
        $(() => {
            //# Cesium Api 인증키는 Cesium 회원가입 후 발급된 인증키 입력 => 생략 가능
            // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYTg3NmEwMC01OTllLTRkMGQtOGRhOS1iY2NiMjM3MTcyMDgiLCJpZCI6Mjg4OTYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTE2NjI4NTV9.7v-q3mLdhyMTEAyb41lyBjFBmgPhWeZLkkyT09SStC4";

			//# Cesium Viewer 생성
			Heliosen.init(() => {
                Heliosen.Cesium.initViewer(
                "cesiumContainer", // Cesium을 렌더링 하기 위한 <div> 태그의 ID
                { // Cesium Viewer 생성 옵션
                    imageryProvider: false,
					terrainProvider: false,
                    infoBox: true, // Cesium에서 렌더링된 객체 선택 시 나타나는 infobox 제거
                    baseLayerPicker: false, // Bing맵 제거를 위해 false 입력
                    selectionIndicator: true, // Cesium에서 렌더링된 객체 선택 시 나타나는 초록색 강조선 제거
					homeButton: false, // home 버튼
					vrButton: false, // vr 버튼
					navigationHelpButton: false, // 탐색 버튼 
					geocoder: false, // 지오코더 위젯 => 세션 소모, API 키 필요
					sceneModePicker: false // 2D <=> 3D 변환 버튼
                });
            });

            //# 생성한 Cesium Viewer 반환 : Cesium.Viewer
            viewer = Heliosen.Cesium.getViewer();
			
			//# 지구 색상
			viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString("#083959")

			//# 배경지도 추가
			const imagery = new Cesium.OpenStreetMapImageryProvider({url : 'https://a.tile.openstreetmap.org/'});
			viewer.imageryLayers.addImageryProvider( imagery );

			//# 지형 추가
			const terrain = new Cesium.CesiumTerrainProvider({url: "http://175.45.205.59:28082/tilesets/layer"});
			viewer.terrainProvider = terrain;

            //# 카메라 위치 underground 허용 옵션
            //viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;

			const tileset = new Cesium.Cesium3DTileset({
				url: "public/3dtileset/b3dm_susung/tileset.json",
            });
			tileset.readyPromise.then(function() {
				const ctg = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
				console.log("position", tileset.boundingSphere.center);
				console.log("경위도", Cesium.Math.toDegrees(ctg.longitude), Cesium.Math.toDegrees(ctg.latitude), ctg.height);
			});

            //# tileset 추가 => Cesium3DTileset 객체 생성 후 Viewer에 추가
//             viewer.scene.primitives.add( tileset );

            //# 카메라를 tileset에 향하도록 설정(tileset:Cesium.Cesium3DTileset)
//             viewer.zoomTo(tileset);
            
            //# inspector
            const inspector = viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);

            //# init Measurement(viewer:Cesium.Viewer) 
            Heliosen.measure.initMeasure(viewer);

            //# init Clipping(tileset:Cesium.Cesium3DTileset, viewer:Cesium.Viewer)
            Heliosen.clipping.initClipping(tileset, viewer);
            
            //# init Transform(viewer:Cesium.Viewer)
            Heliosen.transform.initTransform(viewer);

			  //# 돋보기 호버
			$(".tool_3d").mouseover(function(){
				$('.cesium-viewer-cesium3DTilesInspectorContainer').show();
			});
			$('.cesium-viewer-cesium3DTilesInspectorContainer').mouseleave(function(){
				$(this).hide();            	 
			});
			//# 하단 Ditap 로고
			const logo = $('<img>').prop({
				'src': '${pageContext.request.contextPath}/public/img/ditap.png'
			}).css({
				'padding-bottom': '5px'
			});
			$(".cesium-viewer-bottom").prepend(logo);
			
			//모델별 좌표 변수값
            //정류장            
            const subway_station = new Cesium.Cartesian3.fromDegrees(126.90155165017461, 37.453304722367406, 35.9029385);
            
            //유류고
            const oil = new Cesium.Cartesian3.fromDegrees(126.78801786367241, 37.26048146514058, 2.378986803392475);
            
            //충전소
            const car = new Cesium.Cartesian3.fromDegrees(126.78802831233659, 37.25991317863328, 3.1650000000000498);
            
          	//전주사옥
            const jeonju_lx = new Cesium.Cartesian3.fromDegrees(124.87057996133143, 32.57406223971515, 15.472520184326168);

			
			//좌표 설정
			const matrix = Cesium.Transforms.headingPitchRollToFixedFrame (
				oil, // 수성ifc
				new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0),0,0),
				Cesium.Ellipsoid.WGS84,
				Cesium.Transforms.localFrameToFixedFrameGenerator("south", "east")
			);
			
			//car
			const matrix1 = Cesium.Transforms.headingPitchRollToFixedFrame (
            		car, 
            		new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), 0, 0),
            		Cesium.Ellipsoid.WGS84,
            		Cesium.Transforms.localFrameToFixedFrameGenerator("south", "east")            		
            );
			
			//정류장
			const matrix2 = Cesium.Transforms.headingPitchRollToFixedFrame (
					subway_station, 
            		new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), 0, 0),
            		Cesium.Ellipsoid.WGS84,
            		Cesium.Transforms.localFrameToFixedFrameGenerator("south", "east")            		
            );
			
			//전주사옥
			const matrix3 = Cesium.Transforms.headingPitchRollToFixedFrame (
					jeonju_lx, 
            		new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), 0, 0),
            		Cesium.Ellipsoid.WGS84,
            		Cesium.Transforms.localFrameToFixedFrameGenerator("south", "east")            		
            );
			
			
			//# glb 추가
			const glb = Cesium.Model.fromGltf({
				url : "public/glb/6_oil_IFC4_Reference_View_glb/6_oil_IFC4_Reference_View.glb",
				modelMatrix : matrix
			});
			
			
			const glb1 = Cesium.Model.fromGltf({
            	url : "public/glb/6_car_IFC4_Reference_View_glb/6_car_IFC4_Reference_View.glb", // glb 모델 경로(현재 입력된 경로는 프로젝트 내에 있는 glb모델의 경로)
            	modelMatrix : matrix1,
            });
			
			const subway = Cesium.Model.fromGltf({
            	url : "public/glb/subway_station_ifc4_reference_view_glb/subway_station_ifc4_reference_view.glb", // glb 모델 경로(현재 입력된 경로는 프로젝트 내에 있는 glb모델의 경로)
            	modelMatrix : matrix2,
            });
			
			const jeonju = Cesium.Model.fromGltf({
            	url : "public/glb/jeouju_glb/jeouju.glb", // glb 모델 경로(현재 입력된 경로는 프로젝트 내에 있는 glb모델의 경로)
            	modelMatrix : matrix3,
            });
			
			
			const glbResult = viewer.scene.primitives.add(glb);
			const glbResult1 = viewer.scene.primitives.add(glb1);
			const glbResult2 = viewer.scene.primitives.add(subway);
			//const glbResult3 = viewer.scene.primitives.add(jeonju);
			
			//# 카메라 초기 배치
			/* viewer.camera.setView({
			    //destination : new Cesium.Cartesian3.fromDegrees(126.78802831233659,37.25991317863328,3.16500000002035),
			    destination : oil,
			    orientation: {
			        heading : Cesium.Math.toRadians(-40.0), // east, default value is 0.0 (north)
			        pitch : Cesium.Math.toRadians(-10.0),    // default value (looking down)
			        roll : 0.0                             // default value
			    }
			}); */
			
			
			viewer.camera.setView({
			    //destination : new Cesium.Cartesian3.fromDegrees(126.78802831233659,37.25991317863328,3.16500000002035),
			    destination : oil,
			    orientation: {
			        heading : Cesium.Math.toRadians(-40.0), // east, default value is 0.0 (north)
			        pitch : Cesium.Math.toRadians(-10.0),    // default value (looking down)
			        roll : 0.0                             // default value
			    }
			});
			
			//# 좌클릭
			const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas); // 핸들러 생성
			handler.setInputAction(function (event) {
				const pickObject = viewer.scene.pick(event.position); // 선택한 3D 모델
				if (Cesium.defined(pickObject) && pickObject.mesh && pickObject.node) {
					console.log(pickObject);
					console.log("node: " + pickObject.node.name);
					console.log("mesh: " + pickObject.mesh.name);
				}
			}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
			
			viewer.scene.globe.depthTestAgainstTerrain = false;

        });
    </script>
</body>
</html>


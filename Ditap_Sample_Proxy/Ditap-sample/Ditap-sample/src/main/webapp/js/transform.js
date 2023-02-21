Heliosen.transform = (() => {
	let transform = null;
	const TransformEntity = class {
		constructor(primitive) {
			this.tileset= primitive;
			this.position= primitive.boundingSphere.center;
			this.position_org= primitive.boundingSphere.center;
			this.translation= Cesium.Cartesian3.ZERO;
			this.rotation= new Cesium.HeadingPitchRoll(0,0,0);
			this.scale= new Cesium.Cartesian3(1,1,1);
			this.quaternion= Cesium.Quaternion.ZERO;
			this.axes= null;
			this.axes_scale= new Cesium.Cartesian3(1,1,1);
			this.label= null;
			this.label_text= '';
		}
	}

	const Transform = class {
	  constructor(viewer) {
		this.viewer = viewer;
		this.axes_handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		this.transform_handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		this.aggregator = new Cesium.CameraEventAggregator(this.viewer.scene.canvas);
		this.transform_entities = {};
		this.url = null;
		this.camera_height = this.viewer.camera.positionCartographic.height;
		this._axes = {
			hoverAxis : null,
			selectAxis : null,
			orgColor : null,
			hoverAxisColor : Cesium.Color.YELLOW,
			selectAxisColor : Cesium.Color.YELLOW
		}
		this.init();
	  }

	  init() {
		console.log("3DTiles Transform 시작");
	  }

	  //# Transform 이벤트 제거
	  resetEvent() {
		this.viewer.scene.screenSpaceCameraController.enableRotate = true; //# 카메라 회전 허용
		this.viewer.scene.globe.depthTestAgainstTerrain = true; //# Terrain Depth 설정
		let entity = this.transform_entities[this.url];

		//# XYZ AXIS 제거
		if (entity && entity.axes != null) {
			for (let axis of entity.axes) {
				this.viewer.scene.primitives.remove(axis);
			}
			entity.axes = null;
		}

		//# Transform events 제거
		if (entity && entity.label != null) {
			this.viewer.entities.remove(entity.label);
			entity.label != null;
		}

		//# 이벤트 제거
		Object.keys(this.axes_handler._inputEvents).forEach((key) => (this.axes_handler._inputEvents[key] = null));
		Object.keys(this.transform_handler._inputEvents).forEach((key) => (this.transform_handler._inputEvents[key] = null));
		$(".hsen-analysis-tool").removeClass("btn-info").addClass("btn-dark");
	  }
  
	  setEvent(type) {
		//# Transform Type 'translation', 'scale', 'rotation'
		this.type = type;
		this.setTransformEvent(type);
	  }

	  //# Transform Controller
	  createXYZAxis(position, type) {
		//# compute ENU vector
		const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position); //# NorthEastUp 변환
		const matrix3 = Cesium.Matrix4.getMatrix3(modelMatrix, new Cesium.Matrix3()); //# XYZ 벡터 추출
		const vector = [
			Cesium.Matrix3.getColumn(matrix3, 0, new Cesium.Cartesian3()),
			Cesium.Matrix3.getColumn(matrix3, 1, new Cesium.Cartesian3()),
			Cesium.Matrix3.getColumn(matrix3, 2, new Cesium.Cartesian3())
		]
		
		//# circle point position(= rotation UI)
		const computeCircle = (vector, position, radius) => {
			const positions = [];
			for (let i=0; i<=360; i+=9) {
				const radians = Cesium.Math.toRadians(i);
				const a = Cesium.Cartesian3.add(position, Cesium.Cartesian3.multiplyByScalar(vector[0], radius * Math.cos(radians), new Cesium.Cartesian3()), new Cesium.Cartesian3());
				const sum = Cesium.Cartesian3.add(a, Cesium.Cartesian3.multiplyByScalar(vector[1], -radius * Math.sin(radians), new Cesium.Cartesian3()), new Cesium.Cartesian3());
				
				positions.push(sum);
			}
			return positions;
		}	
		
		//X, Y, Z AXIS 세팅
		const x_axis = ['X_AXIS',
						type == 'translation' ? 
							[Cesium.Color.RED, 8, 'Color'] :
								(type == 'rotation' ? 
									[Cesium.Color.RED, 8, 'Color'] : 
										[Cesium.Color.RED, 24, 'PolylineArrow']),
						[vector[1], vector[2]],
						vector[0]
					]; //X_AXIS
		const y_axis = ['Y_AXIS', 
						type == 'translation' ? 
							[Cesium.Color.GREEN, 8, 'Color'] :
								(type == 'rotation' ? 
									[Cesium.Color.GREEN, 8, 'Color'] : 
										[Cesium.Color.GREEN, 24, 'PolylineArrow']),
						[vector[0], vector[2]],
						vector[1]
					]; //Y_AXIS
		const z_axis = ['Z_AXIS',
						type == 'translation' ? 
							[Cesium.Color.BLUE, 8, 'Color'] :
								(type == 'rotation' ? 
									[Cesium.Color.BLUE, 8, 'Color'] : 
										[Cesium.Color.BLUE, 24, 'PolylineArrow']),
						[vector[0], vector[1]],
						vector[2]
					]; //Z_AXIS

		let axis_list = [];
		for (const axis of [x_axis, y_axis, z_axis]) {
			let pos;
			if (type == 'translation' || type == 'scale') {
				pos = [
					position, 
					new Cesium.Cartesian3.add(
						position, 
						new Cesium.Cartesian3.multiplyByScalar(axis[3], 50, new Cesium.Cartesian3()), 
						new Cesium.Cartesian3())
				]
			} else {
				pos = computeCircle(axis[2], position, 50)		
			}

			axis_list.push(Heliosen.util.addDepthFailPolyline(
				pos,
				axis[0],
				axis[1][0],
				axis[1][1],
				axis[1][2]
			));
		}
		return axis_list;
		
	  }

	  //# Transform Value Label
	  createLabelText(type, value) {
		let text;
		switch(type) {
			case 'translation':
				value = Cesium.Cartographic.fromCartesian(value);
				text =  '   Lon : ' + Cesium.Math.toDegrees(value.longitude).toFixed(4) + '\n'+
						'   Lat : ' + Cesium.Math.toDegrees(value.latitude).toFixed(4) + '\n'+
						'Height : ' + value.height.toFixed(2)
				break;
			case 'scale':
				text =  'Scale X : ' + value.x.toFixed(2) + '\n' +
						'Scale Y : ' + value.y.toFixed(2) + '\n' +
						'Scale Z : ' + value.z.toFixed(2);
				break;
			case 'rotation':
				text =  'Heading : ' + (value.heading * 180 / Math.PI).toFixed(2) + '\n'+
						'  Pitch : ' + (value.pitch * 180 / Math.PI).toFixed(2) + '\n'+
						'   Roll : ' + (value.roll * 180 / Math.PI).toFixed(2);	
				break;
			default:
				break;
		}
		return text;
	  }

	  //# 선택한 3DTile에 Transform Editor 이벤트 적용 및 초기화
	  setTransformEvent(type) {
		const _handler = this.axes_handler;
		const _viewer = this.viewer;

		let label;
		let pickedFeature = null;
		_handler.setInputAction((move) => {

			//# 3DTile 선택
			pickedFeature = _viewer.scene.pick(move.position); //# 3DTile 선택
			if (Cesium.defined(pickedFeature) && pickedFeature.primitive instanceof Cesium.Cesium3DTileset) {
				
				const cameraTo3DTile = Cesium.Cartesian3.distance(pickedFeature.primitive.boundingSphere.center, _viewer.camera.position, new Cesium.Cartesian3()); //카메라 <-> 3DTile 거리
				const axes_scale_value = cameraTo3DTile/400; //카메라 <-> 3DTile 비율
				const axes_scale = axes_scale_value <= 1.0 ? new Cesium.Cartesian3(1,1,1) : new Cesium.Cartesian3(axes_scale_value, axes_scale_value, axes_scale_value); //카메라 <-> 3DTile 비율(Cartesian3)
				const url = pickedFeature.primitive._url; //# 선택한 3DTile의 URL

				//# 초기값 설정
				if (!(url in this.transform_entities)){
					//# Transform 처음 적용하는 3DTile인 경우 TransformEntity 생성
					this.transform_entities[url] = new TransformEntity(pickedFeature.primitive);
					this.transform_entities[url].axes_scale = axes_scale;
				} else {
					this.transform_entities[url].axes_scale = axes_scale;
				}

				//# 3DTile에 modelMatrix가 적용이 되어 있으면 원본 좌표 다시 계산
				if (!Cesium.Matrix4.equals(pickedFeature.primitive.modelMatrix, Cesium.Matrix4.IDENTITY)) {
					const inverse = Cesium.Matrix4.inverse(pickedFeature.primitive.modelMatrix, new Cesium.Matrix4());
					this.transform_entities[url].position_org = Cesium.Matrix4.multiplyByPoint(inverse, this.transform_entities[url].position, new Cesium.Cartesian3());
				}
			
				//#2. XYZ Axis 생성
				let axis_list;
				if (this.transform_entities[url].axes == null) {
					//# 기존 XYZ AXIS 제거
					if (this.url != null && this.url != url && this.transform_entities[this.url].axes) {
						for (let axis of this.transform_entities[this.url].axes) {
							_viewer.scene.primitives.remove(axis);
						}
						this.transform_entities[this.url].axes = null;
					}
					this.url = url;

					//# XYZ AXIS 생성 (중심점, transform type)
					axis_list = this.createXYZAxis(this.transform_entities[url].position_org, type);

					//# 선택한 3DTile Quaternion 추출
					let axis_quaternion;
					if (type == 'rotation' || type == 'scale') {
						axis_quaternion = this.transform_entities[url].quaternion;
					} else if (type == 'translation') {
						axis_quaternion = Cesium.Quaternion.ZERO;
					}
		
					//# XYZ AXIS에 3DTile의 Transform Value 설정
					for (let axis of axis_list) {
						axis.modelMatrix = Heliosen.transform.getTransform().computeMatrix(
							this.transform_entities[url].position_org, 
							this.transform_entities[url].translation, 
							axis_quaternion, 
							axes_scale
						);
					}

					//# 현재 사용중인 XYZ AXIS 설정
					this.transform_entities[url].axes = axis_list;

					//# XYZ AXIS 조절 callback
					_viewer.camera.changed.addEventListener(() => {
						this.camera_height = _viewer.camera.position;
					})
				}

				//# HOVER 이벤트
				_handler.setInputAction((move) => {
					const hoverObject = _viewer.scene.pick(move.endPosition);

					//# 초기화
					if (this._axes.hoverAxis && !this._axes.selectAxis) {
						this._axes.hoverAxis.appearance.material.uniforms.color
							= this._axes.orgColor;
						this._axes.hoverAxis.depthFailAppearance.material.uniforms.color
							= this._axes.orgColor.withAlpha(0.35);
						this._axes.hoverAxis = null;
						this._axes.orgColor = null;
					}
					
					//## MOUSE_MOVE_ON
					if (Cesium.defined(hoverObject) && this.transform_entities[url].axes.includes(hoverObject.primitive) && !this._axes.selectAxis) {
						//## MOSE_MOVE	
						this._axes.hoverAxis = hoverObject.primitive;

						// 원본 색상 복사
						this._axes.orgColor = Cesium.Color.clone(this._axes.hoverAxis.appearance.material.uniforms.color);

						// HOVER 색상 적용
						this._axes.hoverAxis.appearance.material.uniforms.color = this._axes.hoverAxisColor;
						this._axes.hoverAxis.depthFailAppearance.material.uniforms.color = this._axes.hoverAxisColor.withAlpha(0.35);

						//## MOUSE_DOWN
						let selectObject;
						_handler.setInputAction((down) => {
							selectObject = _viewer.scene.pick(down.position);
							if (Cesium.defined(selectObject) && this.transform_entities[url].axes.includes(selectObject.primitive)) {
								this._axes.selectAxis = selectObject.primitive;
								this._axes.hoverAxis.appearance.material.uniforms.color = this._axes.selectAxisColor;
								this._axes.hoverAxis.depthFailAppearance.material.uniforms.color = this._axes.selectAxisColor.withAlpha(0.35);
							}
							
						}, Cesium.ScreenSpaceEventType.LEFT_DOWN)

						//## MOUSE_UP
						_handler.setInputAction((up) => {
							if (Cesium.defined(selectObject) && this.transform_entities[url].axes.includes(selectObject.primitive) && this._axes ) {
								this._axes.selectAxis.appearance.material.uniforms.color
									= this._axes.hoverAxis ? this._axes.hoverAxisColor : this._axes.orgColor;
								this._axes.selectAxis.depthFailAppearance.material.uniforms.color
									= this._axes.hoverAxis ? this._axes.hoverAxisColor.withAlpha(0.35) : this._axes.orgColor.withAlpha(0.35);
								this._axes.orgColor
									= this._axes.hoverAxis ? this._axes.orgColor : null;
								this._axes.selectAxis = null;
							}
						}, Cesium.ScreenSpaceEventType.LEFT_UP)
					}

				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

				//# label 생성
				this.transform_entities[url].label = Heliosen.util.addLabel(new Cesium.CallbackProperty(() => this.transform_entities[url].position, false), 'transform_label');
				label = this.transform_entities[url].label;
				label.label.text = new Cesium.CallbackProperty(() => this.transform_entities[url].label_text, false);
				label.label.disableDepthTestDistance = Number.POSITIVE_INFINITY;
				label.label.pixelOffset = new Cesium.Cartesian2(-50, 25);
				label.label.eyeOffset = Cesium.Cartesian2.ZERO;
				label.label.horizontalOrigin =  Cesium.HorizontalOrigin.LEFT;
				label.label.font = "13px monospace";
				label.label.backgroundColor = new Cesium.Color(0.165, 0.165, 0.165, 0.5)

				label.label.scaleByDistance = new Cesium.NearFarScalar(0.6e2, 0.9, 8.0e6, 1);

				let label_value;
				switch(type) {
					case 'translation':
						label_value = this.transform_entities[url].position;
						break;
					case 'scale':
						label_value = this.transform_entities[url].scale;
						break;
					case 'rotation':
						label_value = this.transform_entities[url].rotation;
						break;
					default:
						break;
				}

				//# label 초기값 설정
				this.transform_entities[url].label_text = this.createLabelText(type, label_value);

				//#4. handle Transform(type = 'translation', 'scale', 'rotation')
				this.handleTransform(type, this.transform_entities[url]);
			}

		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		
		//# transform 종료(= MOUSE_RIGHT_CLICK)
		_handler.setInputAction((click) => {
			this.resetEvent();
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
	  }

	  //# Transform 행렬 계산
	  computeMatrix = (position, translation, rotation, scale) => {
		//# only translation
		if (Cesium.Quaternion.equals(rotation, Cesium.Quaternion.ZERO) && Cesium.Cartesian3.equals(scale, new Cesium.Cartesian3(1,1,1))) {
			return Cesium.Matrix4.fromTranslation(translation, new Cesium.Matrix4());
		}

		//# ENU -> ECEF convert value
		const toGlobal = Cesium.Transforms.eastNorthUpToFixedFrame(position); //1. 중심점 -> EastNorthUp Matrix4 변환
		const inverse = Cesium.Matrix4.inverse(toGlobal, new Cesium.Matrix4()); //2. Inverse 계산

		//# compute rotation matirx
		const quaternion_Matrix = Cesium.Matrix3.fromQuaternion(rotation, new Cesium.Matrix3());
		let rotation_Matrix = Cesium.Matrix4.fromRotationTranslation(quaternion_Matrix, Cesium.Cartesian3.ZERO, new Cesium.Matrix4());
		if (Cesium.Quaternion.equals(rotation, Cesium.Quaternion.ZERO)) rotation_Matrix = Cesium.Matrix4.IDENTITY;
		
		//# compute scale matrix
		const scale_Matrix = Cesium.Matrix4.fromScale(scale, new Cesium.Matrix4());

		//# combine matrix
		let matrix = Cesium.Matrix4.multiply(rotation_Matrix, scale_Matrix, new Cesium.Matrix4());
		
		//# compute transform
		let transform = Cesium.Matrix4.multiply(toGlobal, Cesium.Matrix4.multiply(matrix, inverse, new Cesium.Matrix4()), new Cesium.Matrix4());
		
		//# set translation
		transform[12] += translation.x;
		transform[13] += translation.y;
		transform[14] += translation.z;

		return transform;
	  }
	
	  //# Transform Handler
	  handleTransform(type, entity) {
      	const _viewer = Heliosen.Cesium.getViewer();
		const _handler = Heliosen.transform.getTransform().transform_handler;

		let position_org = entity.position_org; //# 3DTile 원본 중심점
		let position = entity.position; //# 3DTile 클릭한 당시 중심점

		_handler.setInputAction(function transformDown(down) {
			
			//# select UI
			const pickedFeature = _viewer.scene.pick(down.position);
			if (pickedFeature && pickedFeature.primitive instanceof Cesium.Primitive && (pickedFeature.id == 'X_AXIS' || pickedFeature.id == 'Y_AXIS' || pickedFeature.id == 'Z_AXIS')){
				_viewer.scene.screenSpaceCameraController.enableRotate = false;

				let first_window = down.position; //# 처음 클릭한 X_AXIS 위치
				let before_angle=0; //# 처음 각도
				
				//# XYZ vector
				const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
				const matrix3 = Cesium.Matrix4.getMatrix3(modelMatrix, new Cesium.Matrix3());
				const x_axis = Cesium.Matrix3.getColumn(matrix3, 0, new Cesium.Cartesian3());
				const y_axis = Cesium.Matrix3.getColumn(matrix3, 1, new Cesium.Cartesian3());
				const z_axis = Cesium.Matrix3.getColumn(matrix3, 2, new Cesium.Cartesian3());

				//# set vector
				let vector;
				switch (pickedFeature.id) {
					case 'X_AXIS':
						vector = (type=='rotation') ? [y_axis, z_axis, x_axis] : x_axis;
						break;
					case 'Y_AXIS':
						vector = (type=='rotation') ? [z_axis, x_axis, y_axis] : y_axis;
						break;
					case 'Z_AXIS':
						vector = (type=='rotation') ? [x_axis, y_axis, z_axis] : z_axis;
						break;
					default:
						break;
				}

				//# 3DTile transform event
				_handler.setInputAction(function transformMove(move) {
					//# 3DTile modelMatrix
					let model = entity.tileset.modelMatrix;

					//# Camera <-> 3DTile distance
					let camera_position = _viewer.camera.position;
					let cameraTo3DTile = Cesium.Cartesian3.distance(camera_position, entity.tileset.boundingSphere.center, new Cesium.Cartesian3());
					let scale = cameraTo3DTile/1000;	

					//# set mouse move distance
					let window_movement = Cesium.Cartesian2.distance(move.startPosition, move.endPosition, new Cesium.Cartesian2());
					let distance = window_movement * scale;
					
					//# compute 3DTile original position
					const inverse2 = Cesium.Matrix4.inverse(model, new Cesium.Matrix4());
					position_org = Cesium.Matrix4.multiplyByPoint(inverse2, entity.tileset.boundingSphere.center, new Cesium.Cartesian3());

					//# compute type value
					if (type == 'translation') {

						//# mouse vector
						const mouse_vector = Cesium.Cartesian2.subtract(move.endPosition, move.startPosition, new Cesium.Cartesian2());

						//# axis cartesian -> window vector
						let new_position = Cesium.Cartesian3.add(position, vector, new Cesium.Cartesian3());
						let first_window = _viewer.scene.cartesianToCanvasCoordinates(position);
						let second_window = _viewer.scene.cartesianToCanvasCoordinates(new_position);
						
						const axis_window_vector = Cesium.Cartesian2.subtract(second_window, first_window, new Cesium.Cartesian2());
						
						//# mouse vector * axis window vector
						const final = Cesium.Cartesian2.multiplyComponents(mouse_vector, axis_window_vector, new Cesium.Cartesian3());
						
						//# set direction
						distance *= (final.x + final.y)/Math.abs(final.x + final.y);
						
						//# compute translation value
						const sum = Cesium.Cartesian3.multiplyByScalar(vector, distance, new Cesium.Cartesian3());
						
						//# set translation value
						if (isNaN(sum.x) || isNaN(sum.y)|| isNaN(sum.z)) return;
						entity.translation = Cesium.Cartesian3.add(entity.translation, sum, new Cesium.Cartesian3());
						entity.position = Cesium.Cartesian3.add(entity.translation, position_org, new Cesium.Cartesian3());

						//# set trnasform label
						entity.label_text = Heliosen.transform.getTransform().createLabelText(type, entity.position);

					} else if (type == 'scale') {

						//# mouse vector
						const mouse = Cesium.Cartesian2.subtract(move.endPosition, move.startPosition, new Cesium.Cartesian2());

						//# axis cartesian -> window vector
						let new_position = Cesium.Cartesian3.add(position, vector, new Cesium.Cartesian3());
						let first_window = _viewer.scene.cartesianToCanvasCoordinates(position);
						let second_window = _viewer.scene.cartesianToCanvasCoordinates(new_position);

						const new_value = Cesium.Cartesian2.subtract(second_window, first_window, new Cesium.Cartesian2);
						
						//# mouse vector * axis window vector
						const final = Cesium.Cartesian2.multiplyComponents(mouse, new_value, new Cesium.Cartesian3());
						
						//# set direction
						distance *= (final.x + final.y)/Math.abs(final.x + final.y)*0.01;

						//# set scale value
						if (isNaN(distance)) return;
						let distanceToScale;
						switch (pickedFeature.id) {
							case 'X_AXIS':
								distanceToScale = new Cesium.Cartesian3(distance,0,0);
								break;
							case 'Y_AXIS':
								distanceToScale = new Cesium.Cartesian3(0,distance,0);
								break;
							case 'Z_AXIS':
								distanceToScale = new Cesium.Cartesian3(0,0,distance);
								break;
							default:
								break;
						}

						//# set transform label
						entity.scale = Cesium.Cartesian3.add(entity.scale, distanceToScale, new Cesium.Cartesian3());
						entity.label_text = Heliosen.transform.getTransform().createLabelText(type, entity.scale);

					} else {

						//# compute window angle direction
						const computeWindowDirection = (offset, forward, target) => {
							const forward_vector = Cesium.Cartesian2.subtract(forward, offset, new Cesium.Cartesian3());
							const target_vector = Cesium.Cartesian2.subtract(target, offset, new Cesium.Cartesian3());
							const up_vector = new Cesium.Cartesian3(0,0,1);

							const cross = Cesium.Cartesian3.cross(forward_vector, target_vector, new Cesium.Cartesian3());
							let dot = Cesium.Cartesian3.dot(up_vector, cross, new Cesium.Cartesian3());

							dot = dot/Math.abs(dot);

							return dot;
						}

						//# compute 3DTile direction
						const compute3DTileDirection = (scene, position, vector, matrix) => {
							let positions = [];
							
							//# Axes의 0°, 90° 좌표 -> window position 계산
							for (let i of [0,90]) {
								const radians = Cesium.Math.toRadians(i);
								const a = Cesium.Cartesian3.add(position, Cesium.Cartesian3.multiplyByScalar(vector[0], 50 * Math.cos(radians), new Cesium.Cartesian3()), new Cesium.Cartesian3());
								const sum = Cesium.Cartesian3.add(a, Cesium.Cartesian3.multiplyByScalar(vector[1], -50 * Math.sin(radians), new Cesium.Cartesian3()), new Cesium.Cartesian3());
								const model = Cesium.Matrix4.multiplyByPoint(matrix, sum, new Cesium.Cartesian3());
								
								positions.push(scene.cartesianToCanvasCoordinates(model));
							}

							const centerToWindow = scene.cartesianToCanvasCoordinates(position)
							
							let dot = computeWindowDirection(centerToWindow, positions[0], positions[1]);

							return dot;
						}

						//# compute mouse angle direction
						let centerToWindow = _viewer.scene.cartesianToCanvasCoordinates(position) //# 3DTile 중심점 window position
						let current_window = move.startPosition; //# 마우스 window position

						let forward_vector = Cesium.Cartesian2.subtract(first_window, centerToWindow, new Cesium.Cartesian2()); //# 처음 클릭한 위치의 window position <-> 3DTile 중심점 window position
						let target_vector = Cesium.Cartesian2.subtract(current_window, centerToWindow, new Cesium.Cartesian2()); //# 마우스 window position <-> 3DTile 중심점 window position

						distance = Cesium.Cartesian2.angleBetween(forward_vector, target_vector) - before_angle; //# 이전 각도 - 현재 각도

						before_angle = Cesium.Cartesian2.angleBetween(forward_vector, target_vector); //# 다음 각도 계산을 위해 설정
						
						let window_direction = computeWindowDirection(centerToWindow, first_window, current_window); //# 적용해야 하는 각도가 + or - 인지 계산

						//# undefined인 경우 무시
						if (isNaN(window_direction)) return;				
						distance *= window_direction;

						//# set 3DTile direction => 현재 3D 타일 [0, 90]의 좌 우 구분
						let tileset_direction = compute3DTileDirection(_viewer.scene, position, vector, Heliosen.transform.getTransform().computeMatrix(position, new Cesium.Cartesian3(0,0,0), entity.quaternion, entity.axes_scale));
						if (pickedFeature.id == 'X_AXIS') {
							tileset_direction *= -1;
						}

						//# undefined인 경우 무시
						if (isNaN(tileset_direction)) return;
						distance *= tileset_direction;

						//# set HeadingPitchRoll
						let hpr;
						if (pickedFeature.id == 'X_AXIS') {
							hpr = new Cesium.HeadingPitchRoll(0,0, distance);
						} else if (pickedFeature.id == 'Y_AXIS') {
							hpr = new Cesium.HeadingPitchRoll(0, distance, 0);
						} else if (pickedFeature.id == 'Z_AXIS') {
							hpr = new Cesium.HeadingPitchRoll(distance, 0, 0);
						}
						
						//# set quaternion
						if (entity.quaternion == Cesium.Quaternion.ZERO) {
							entity.quaternion = Cesium.Quaternion.fromHeadingPitchRoll(hpr);
						} else {
							entity.quaternion = Cesium.Quaternion.multiply(entity.quaternion, Cesium.Quaternion.fromHeadingPitchRoll(hpr), new Cesium.Quaternion());
						}

						entity.rotation = Cesium.HeadingPitchRoll.fromQuaternion(entity.quaternion, new Cesium.HeadingPitchRoll());

						//# set transform label
						entity.label_text = Heliosen.transform.getTransform().createLabelText(type, entity.rotation);
						
					}

					//# compute 3DTile transform matrix
					let transform = Heliosen.transform.getTransform().computeMatrix(position_org, entity.translation, entity.quaternion, entity.scale);
					
					//# set 3DTile transform matrix
					entity.tileset.modelMatrix = transform
					
					//# set XYZ AXIS transform
					transform = 
						type == 'translation'
							? Heliosen.transform.getTransform().computeMatrix(position_org, entity.translation, Cesium.Quaternion.ZERO, entity.axes_scale)
							: Heliosen.transform.getTransform().computeMatrix(position_org, entity.translation, entity.quaternion, entity.axes_scale)
					
					//# XYZ AXIS Transform
					for (let axis of entity.axes) {
						axis.modelMatrix = transform;
					}
					
				}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

				//# remove Transform Label
				_handler.setInputAction((up) => {
					_handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
					_viewer.scene.screenSpaceCameraController.enableRotate = true;
				}, Cesium.ScreenSpaceEventType.LEFT_UP)
			}
			
		}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

		//# 휠 조절에 따른 Transform Controller 크기 변화
		_handler.setInputAction((wheel) => {
			const camera_positon = _viewer.camera.position.clone(); //# 카메라 위치
			const cameraTo3DTile = Cesium.Cartesian3.distance(position, camera_positon, new Cesium.Cartesian3()); //카메라 <-> 3DTile 거리
			const axes_scale_value = cameraTo3DTile/400; //카메라 <-> 3DTile 비율
			const axes_scale = axes_scale_value <= 1.0 ? new Cesium.Cartesian3(1,1,1) : new Cesium.Cartesian3(axes_scale_value, axes_scale_value, axes_scale_value); //카메라 <-> 3DTile 비율(Cartesian3)
			entity.axes_scale = axes_scale;

			//# set XYZ AXIS Scale 
			let transform = 
			type == 'translation'  
					? Heliosen.transform.getTransform().computeMatrix(position_org, entity.translation, Cesium.Quaternion.ZERO, entity.axes_scale)
					: Heliosen.transform.getTransform().computeMatrix(position_org, entity.translation, entity.quaternion, entity.axes_scale)

			//# XYZ AXIS Transform
			for (let axis of entity.axes) {
				axis.modelMatrix = transform;
			}

		}, Cesium.ScreenSpaceEventType.WHEEL)

		//# 마우스 우클릭 시 Transform 이벤트 종료
		_handler.setInputAction((click) => {
			this.resetEvent();
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
	  }
  
	};
	return {
	  initTransform(viewer) {
		transform = new Transform(viewer);
	  },
	  getTransform() {
		return transform;
	  },
	  getAggregator() {
		return transform.aggregator;
	  },
  
	  resetEvent() {
		transform.resetEvent();
	  },
  
	  setEvent(id) {
		transform.setEvent(id);
	  },

	};
  })();
  
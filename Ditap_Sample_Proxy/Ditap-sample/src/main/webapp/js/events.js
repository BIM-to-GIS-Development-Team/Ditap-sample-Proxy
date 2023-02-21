// Event Setting
(() => {
  //# Measurement Event
  $(".measure_btn").on("click", function () {
    if (!$(this).data("type")) return;
    let measure = Heliosen.measure;
    let clipping = Heliosen.clipping;
    let transform = Heliosen.transform;
    let type = $(this).data("type");

    // # 이전 이벤트 삭제
    measure.resetEvent();
    clipping.resetEvent();
    transform.resetEvent();
    
    $(".hsen-analysis-tool")
    .removeClass("btn-info")
    .addClass("btn-dark");
    
    // # RESET이면 객체 삭제할 것인지 확인
    if (type === "reset") {
      if (!confirm("모든 객체를 지우겠습니까?")) return;
    } else {
      // # 이벤트 버튼에 CSS 추가
      $(this).removeClass("btn-dark").addClass("btn-info");
    }

    // # 현재 이벤트 등록 => component_distance, distance, horizontal, vertical, height, area, point, reset
    measure.setEvent(type);

    // # currentTypeId 설정
    measure.currentTypeId = type;
  });

  //# Clipping Event
  $(".clipping_btn").on("click", function () {
    if (!$(this).data("type")) return;
    let measure = Heliosen.measure;
    let clipping = Heliosen.clipping;
    let transform = Heliosen.transform;
    let type = $(this).data("type");

    // # reset
    clipping.resetEvent();
    transform.resetEvent();
    measure.resetEvent();

    $(".hsen-analysis-tool")
    .removeClass("btn-info")
    .addClass("btn-dark");
   
    // # RESET이면 객체 삭제할 것인지 확인
    if (type === "reset") {
      if (!confirm("모든 객체를 지우겠습니까?")) return;
    } else {
      // # 이벤트 버튼에 CSS 추가
      $(this).removeClass("btn-dark").addClass("btn-info");
    }
    
    // # 현재 이벤트 등록 => x_plane, y_plane, z_plane, reset
    clipping.setEvent(type);

    // # currentTypeId 설정
    clipping.currentTypeId = type;
  });

  //# Transform Event
  $(".editor_btn").on("click", function () {
    if (!$(this).data("type")) return;
    let measure = Heliosen.measure;
    let clipping = Heliosen.clipping;
    let transform = Heliosen.transform;
    let type = $(this).data("type");

    // # reset
    clipping.resetEvent();
    transform.resetEvent();
    measure.resetEvent();
    
    $(".hsen-analysis-tool")
    .removeClass("btn-info")
    .addClass("btn-dark");
    
    // # 이벤트 버튼에 CSS 추가
    $(this).removeClass("btn-dark").addClass("btn-info");

    // # 현재 이벤트 등록 => translation, rotation, scale
    transform.setEvent(type);
  });
  
  //# zoom Event
  $(document).on("click", ".zoomStep", function () {
    if (!$(this).data("type")) return;

    const type = $(this).data("type");
    const height = Heliosen.util.getCameraHeight();
    if (type == "zoomIn") {
      Heliosen.util.setCameraHeight(height * 0.9);
    } else if (type == "zoomOut") {
      Heliosen.util.setCameraHeight(height * 1.1);
    }

  });

  //# map Event
  $(".map_btn").on("click", function() {
    if (!$(this).data("type")) return;
    
    const type = $(this).data("type");

    Heliosen.util.changeMap(type);
  })
  
	$('.tool > div').mouseover(function(){
		$(this).css({
			'border-radius': '0'
		});
	});	
  
})();

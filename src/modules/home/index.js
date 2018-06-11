const homeController = ($scope, baseService, $window) => {
	$scope.ter_all = 0;
	$scope.ter_ok = 0;
	$scope.ter_noAct = 0;
	$scope.ter_offline = 0;
	$scope.ter_error = 0;
	$scope.closeThisTip = function (e) {
		$(e.currentTarget).parents('.userTip').remove();
	}

	$scope.initPage = function () {
		var map = new BMap.Map("allmap", {
			enableMapClick: false
		});
		var point = new BMap.Point(113.649644, 34.75661);
		var top_left_control = new BMap.ScaleControl({
			anchor: BMAP_ANCHOR_TOP_LEFT
		}); // 左上角，添加比例尺
		var top_left_navigation = new BMap.NavigationControl(); //左上角，添加默认缩放平移控件
		map.centerAndZoom(point, 5);
		map.enableScrollWheelZoom(true);
		map.addControl(top_left_control);
		map.addControl(top_left_navigation);
		baseService.getJson(baseService.api.terminal + 'getAllTerminalInfoForMap', {}, function (data) {
			$scope.ters = data;

			for (var i in $scope.ters) {
				var terArray = $scope.ters[i];
				var tPoint = new BMap.Point(i.split(',')[0], i.split(',')[1]);
				var marker = new BMap.Marker(tPoint); // 创建标注
				var content = [];
				content.push("<h5 style='margin:5px 0;'>地址：" + terArray[0].addr + "</h5>");
				var opts = {
					width: 250, // 信息窗口宽度
					title: "终端信息",
					padding: 5
				};

				function addClickHandler(content, marker) {
					marker.addEventListener("click", function (e) {
						openInfo(content, e)
					});
				}

				function openInfo(content, e) {
					var p = e.target;
					var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
					var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
					map.openInfoWindow(infoWindow, point); //开启信息窗口
				}
				for (var j = 0; j < terArray.length; j++) {
					var ter = terArray[j];
					content.push('<div class="infoWindow" style="border-top:1px solid #ddd;font-size:12px;line-height:18px;padding-top:5px;">')
					content.push('<div class="info-line"></div>编号：' + ter.no);
					content.push("<div>名称：" + ter.name + "</div>");

					$scope.ter_all = $scope.ter_all + 1;
					if (ter.status == 0) {
						content.push("<div>状态：未激活</div>");
						$scope.ter_noAct = $scope.ter_noAct + 1;

					} else if (ter.status == 1) {
						content.push("<div>状态：在线</div>");
						marker = new BMap.Marker(tPoint, {
							icon: new BMap.Icon("/static/img/zaixian.png", new BMap.Size(20, 25))
						});
						$scope.ter_ok = $scope.ter_ok + 1;
					} else if (ter.status == 2) {
						content.push("<div>状态：离线</div>");
						$scope.ter_offline = $scope.ter_offline + 1;
						marker = new BMap.Marker(tPoint, {
							icon: new BMap.Icon("/static/img/lixian.png", new BMap.Size(20, 25))
						});
					} else if (ter.status == 3) {
						content.push("<div>状态：异常</div>");
						$scope.ter_error = $scope.ter_error + 1;
						marker = new BMap.Marker(tPoint, {
							icon: new BMap.Icon("/static/img/yichang.png", new BMap.Size(20, 25))
						});

					}
					content.push('</div>')
					map.addOverlay(marker); // 将标注添加到地图中
					addClickHandler(content.join(''), marker);
				}

			}

		});
	}
	
	if (typeof (BMap) == 'undefined') {
		var script = document.createElement("script");
		script.src = "http://api.map.baidu.com/api?v=2.0&ak=hWot28fmyYXe1AMOfBfHoMMfSlnVnkeb&callback=baiduMapLoaded";
		document.body.appendChild(script);
		$window.baiduMapLoaded = function () {
			$scope.initPage();
		}
	} else {
		$scope.initPage();
	}
}

homeController.$inject = ['$scope', 'baseService', '$window'];

export default angular => {
	return angular.module('homeModule', []).controller('homeController', homeController);
}
const homeController = ($scope, baseService, $window) => {
	$scope.ter_all = 0;
		$scope.ter_ok = 0;
		$scope.ter_noAct = 0;
		$scope.ter_offline = 0;

		$scope.ter_error = 0;
		$scope.materialReport = [];
		baseService.getJson(baseService.api.apiUrl + 'api/auth/getMainPageReport',{},function(res){
			for(var j = 0; j < res.materialReport.length; j ++){
				var item = res.materialReport[j];
				if(item.type == 1){
					item.name = '视频';
					item.color = '#00a0e9';
					item.icon = 'icon-shipin-bendihua';
					$scope.materialReport.unshift(item);
				}else if(item.type == 0){
					item.name = '图片';
					item.color = '#faae30';
					item.icon = 'icon-tupian-bendihua';
					$scope.materialReport.push(item);
				}else if(item.type == 2){
					item.name = '音乐';
					item.color = '#7fbe25';
					item.icon = 'icon-yinpin-bendihua';
					$scope.materialReport.push(item);
				}else if(item.type == 3){
					item.name = '互动包';
					item.color = '#ff4040';
					item.icon = 'icon-hudongbao-bendihua';
					$scope.materialReport.push(item);
				}
			}
			for(var i = 0; i < res.terminalReport.length; i ++){
				if(res.terminalReport[i].status == 1){
					$scope.ter_ok = res.terminalReport[i].allCount;
				}else if(res.terminalReport[i].status == 2){
					$scope.ter_offline = res.terminalReport[i].allCount;
				}else if(res.terminalReport[i].status == 3){
					$scope.ter_error = res.terminalReport[i].allCount;
				}else if(res.terminalReport[i].status == 0){
					$scope.ter_noAct = res.terminalReport[i].allCount;
				}
				$scope.ter_all = $scope.ter_ok + $scope.ter_offline + $scope.ter_error + $scope.ter_noAct;
			}
		})
		$scope.materialStyle = function(color){
			return {
				color: color,
				border: '1px solid ' +  color
			}
		}
}

homeController.$inject = ['$scope', 'baseService', '$window'];

export default angular => {
	return angular.module('homeModule', []).controller('homeController', homeController);
}
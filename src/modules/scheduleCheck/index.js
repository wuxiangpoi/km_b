import style from './style.less';

const scheduleCheckController = ($scope, $rootScope,$filter, $stateParams, baseService, modalService,chartService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/programScheduleCheck/getProgramScheduleCheckPageList',function(data){
			$rootScope.programScheduleCheckCounts = data.recordsTotal;
		});
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.showSchedule = function (item,type) {
		baseService.showSchedule(item,type,chartService,function(){
			$scope.callServer($scope.tableState);

		});
	}
}

scheduleCheckController.$inject = ['$scope', '$rootScope','$filter', '$stateParams', 'baseService', 'modalService','chartService'];

export default angular => {
	return angular.module('scheduleCheckModule', []).controller('scheduleCheckController', scheduleCheckController);
}
import './style.less';

const programPlayDetailController = ($scope, $rootScope, baseService, $stateParams) => {
	$scope.displayed = [];
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.programName = $stateParams.name;
	$scope.sp.programId = $stateParams.id;
	$scope.sp.month = $stateParams.month;
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/programPlayMonthly/getProgramPlayMonthlyDetailsPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	
}

programPlayDetailController.$inject = ['$scope', '$rootScope', 'baseService', '$stateParams'];

export default angular => {
	return angular.module('programPlayDetailModule', []).controller('programPlayDetailController', programPlayDetailController);
}
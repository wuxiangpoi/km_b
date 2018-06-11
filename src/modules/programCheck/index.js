import style from './style.less';


const programCheckController = ($scope, $rootScope, $filter, $stateParams, baseService, modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.program + 'getCheckProgramList', function (data) {
			$rootScope.programCheckCounts = data.recordsTotal;
		});
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.showProgram = function (item,type) {
		item.pid = item.id;
		baseService.showProgram(item,type,() =>{
			$scope.callServer($scope.tableState);
		});
	}
}

programCheckController.$inject = ['$scope', '$rootScope', '$filter', '$stateParams', 'baseService', 'modalService'];

export default angular => {
	return angular.module('programCheckModule', []).controller('programCheckController', programCheckController);
}
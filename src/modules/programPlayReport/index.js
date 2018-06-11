import './style.less';

const programPlayReportController = ($scope, $rootScope, baseService,$stateParams, $filter) => {
	$scope.displayed = [];
	var day = new Date();
	$scope.year = day.getFullYear();
	$scope.month = $filter('fotmateDateNum')(day.getMonth() + 1);
	$scope.sp = {
		month: $scope.year + '' + $scope.month,
		oid: $rootScope.rootGroup.id,
		gid: ''
	};
	$scope.tableState = {};
	$scope.dateSel = $scope.year + '-' + $scope.month;

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		if ($stateParams.pos){
			if(!tableState.pagination.init){
				tableState.pagination = {};
				tableState.pagination.start = $stateParams.pos;
				tableState.pagination.init = true;
			}
		}
		baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/programPlayMonthly/getProgramPlayMonthlyPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.$on('emitGroupLeaf', function (e, group, leaf) {
		if ($scope.sp.oid != group.id || $scope.sp.gid != leaf.id) {
			$scope.currentGroup = group;
			$scope.sp.oid = group.id;
			$scope.sp.gid = leaf.id;
			$scope.initPage();
		}

	});
	$scope.$watch('dateSel',(n,o) => {
        if(n != o){
            $scope.year = n.split('-')[0].toString();
            $scope.month = n.split('-')[1].toString();
            $scope.sp.month = $scope.year + '' + $scope.month;
            $scope.initPage();
        }
        
	})
	$scope.showProgram = function (item) {
		item.pid = item.programId;
		baseService.showProgram(item);
	}
}

programPlayReportController.$inject = ['$scope', '$rootScope', 'baseService','$stateParams', '$filter'];

export default angular => {
	return angular.module('programPlayReportModule', []).controller('programPlayReportController', programPlayReportController);
}
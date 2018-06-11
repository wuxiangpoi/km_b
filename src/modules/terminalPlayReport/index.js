import './style.less';

const terminalPlayReportController = ($scope, $rootScope,baseService,$filter,modalService) => {
	$scope.displayed = [];
	$scope.terminalRootCitys = $filter('terminalRootCitys')();
	var day = new Date();
	$scope.year = day.getFullYear();
	$scope.month = $filter('fotmateDateNum')(day.getMonth() + 1);
	$scope.sp = {
		month: $scope.year + '' + $scope.month,
		oid: $rootScope.rootGroup.id,
		gid: ''
	};
	$scope.dateSel = $scope.year + '-' + $scope.month;
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.apiUrl + '/api/termialPlayMonthly/getTerminalPlayMonthlyPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.$watch('dateSel',(n,o) => {
        if(n != o){
            $scope.year = n.split('-')[0].toString();
            $scope.month = n.split('-')[1].toString();
            $scope.sp.month = $scope.year + '' + $scope.month;
            $scope.initPage();
        }
        
	})
	$scope.$on('emitGroupLeaf', function (e, group, leaf) {
		if ($scope.sp.oid != group.id || $scope.sp.gid != leaf.id) {
			$scope.currentGroup = group;
			$scope.sp.oid = group.id;
			$scope.sp.gid = leaf.id;
			$scope.initPage();
		}

	});
	$scope.showProgram = function(item){
		modalService.confirmDialog(720, '播放统计', item, '/static/tpl/terminal_play_daily_detail.html', function (ngDialog, vm) {
			
		}, function (vm) {
			vm.displayed = [];
			vm.sp = {};
			vm.sp.terminalId = item.terminalId;
			vm.sp.month = item.month;
			vm.tableState = {};
			vm.ids = [];
		   
			vm.callUrl = baseService.api.apiUrl + '/api/termialPlayMonthly/getTerminalPlayMonthlyDetailsPageList';
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, vm.callUrl);
			}
			vm.initTable = function () {
			   vm.callServer(vm.tableState);
			}
			
			vm.showProgram = function (item) {
				item.pid = item.programId;
				baseService.showProgram(item);
			}
		})
	}
}

terminalPlayReportController.$inject = ['$scope','$rootScope', 'baseService','$filter','modalService'];

export default angular => {
	return angular.module('terminalPlayReportModule', []).controller('terminalPlayReportController', terminalPlayReportController);
}
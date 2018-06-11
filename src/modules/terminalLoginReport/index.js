import './style.less';

const terminalLoginReportController = ($scope, $rootScope, baseService, $filter, modalService) => {
	$scope.displayed = [];
	$scope.terminalRootCitys = $filter('terminalRootCitys')();
	var day = new Date();
	$scope.year = day.getFullYear();
	$scope.month = $filter('fotmateDateNum')(day.getMonth() + 1);
	$scope.sp = {
		year: $scope.year,
		month: $scope.month,
		oid: $rootScope.rootGroup.id,
		gid: ''
	};
	$scope.sp.oid = $rootScope.rootGroup.id;
	$scope.sp.gid = '';
	$scope.dateSel = $scope.sp.year + '-' + $scope.sp.month;
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.termialRegReport + 'getTermialRegPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	baseService.getJson(baseService.api.role + 'getRoleList', {}, function (data) {
		$scope.roleOptions = [{
			name: '角色类型',
			val: ''
		}];
		for (let i = 0; i < data.length; i++) {
			$scope.roleOptions.push({
				name: data[i].name,
				val: data[i].id
			})
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
	$scope.roleStatusOptions = [{
			val: '',
			name: '账户状态'
		},
		{
			val: 1,
			name: '激活'
		},
		{
			val: 0,
			name: '禁用'
		}
	]
	$scope.$watch('dateSel', (n, o) => {
		if (n != o) {
			$scope.sp.year = n.split('-')[0].toString();
			$scope.sp.month = n.split('-')[1].toString();
			$scope.initPage();
		}

	})
	$scope.exportExcel = function () {
		let getExportQuery = () => {
			var q = '';
			for (var k in $scope.sp) {
				if ($scope.sp[k]) {
					q += "&" + k + "=" + $scope.sp[k];
				}
			}
			if (q) {
				q = "?" + q.substr(1);
			}
			return q;
		}
		modalService.confirm('导出表格', '确定将当前查询的所有的设备信息导出excel表格?', function (vm, ngDialog) {
			ngDialog.close()
			window.open(baseService.api.terminal + 'exportTerminal' +
				getExportQuery());
		})
	}
}

terminalLoginReportController.$inject = ['$scope', '$rootScope', 'baseService', '$filter', 'modalService'];

export default angular => {
	return angular.module('terminalLoginReportModule', []).controller('terminalLoginReportController', terminalLoginReportController);
}
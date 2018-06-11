import './style.less';
import {
    programCmdStatusOptions
} from '../../filter/options.js'

const programCommandController = ($scope, baseService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.programCmdStatusOptions = programCmdStatusOptions;
    $scope.programCmdTypeOptions = [
        {
            name: '类型',
            val: ''
        },
        {
            name: '节目',
            val: 22
        },
        {
            name: '排期',
            val: 24
        },
    ];
    $scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
        baseService.initTable($scope, tableState, baseService.api.programCmd + 'getProgramCmdPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
    
}

programCommandController.$inject = ['$scope', 'baseService'];

export default angular => {
    return angular.module('programCommandModule', []).controller('programCommandController', programCommandController);
}
import './style.less';
import {
    materialsTypeOptions
} from '../../filter/options.js'

const materialCheckController = ($rootScope, $scope, $filter, baseService, FileUploader) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.materialsTypeOptions = materialsTypeOptions;

    $scope.callServer = function (tableState, page) {
        if (baseService.isRealNum(page)) {
            $scope.tableState.pagination.start = page * $scope.sp.length;
        }
        baseService.initTable($scope, tableState, baseService.api.material + 'materialCheck_getMaterialCheckList', function (data) {
            $rootScope.materialCheckCounts = data.recordsTotal;
        });
    }
    $scope.initPage = function () {
        $scope.callServer($scope.tableState, 0)
    }
    $scope.showMaterial = function (item,type) {
        baseService.showMaterial(item, type,() => {
            $scope.callServer($scope.tableState);
        });
    }
}

materialCheckController.$inject = ['$rootScope', '$scope', '$filter', 'baseService', 'FileUploader'];

export default angular => {
    return angular.module('materialCheckModule', []).controller('materialCheckController', materialCheckController);
}
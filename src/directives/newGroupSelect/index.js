import template from './template.html'
import style from './style.less'

export default app => {
    app.directive('newGroupLeafSelect', ['baseService', '$rootScope', '$window', (baseService, $rootScope, $window) => {
        let link = ($scope, element, attrs) => {
            $scope.root_organizations = $rootScope.userData.root_organizations;
            $scope.currentGroup = $rootScope.rootGroup;
            $scope.currentLeaf = {};
            $scope.currentLeaf.id = '';
            $scope.groupLeafes = [];
            $scope.treeId = 'group_tree_' + Date.parse(new Date());
            $scope.showGroupSel = false;
            $scope.showLeaf = false;
            let bodyEl = angular.element($window.document.body);
            $scope.getLeafes = function (oid) {
                if (attrs.reqleafurl) {
                    $scope.showLeaf = true;
                    baseService.getJson(baseService.api.apiUrl + attrs.reqleafurl, {
                        oid: oid
                    }, function (data) {
                        $scope.groupLeafes = data;
                    })
                }

            }

            function getOrganizations() {
                var zNodes = [];

                if (attrs.initid) {
                    for (var i = 0; i < $scope.root_organizations.length; i++) {
                        zNodes.push({
                            id: $scope.root_organizations[i].id,
                            pId: $scope.root_organizations[i].pid,
                            name: $scope.root_organizations[i].name,
                            sort: $scope.root_organizations[i].sort
                        });
                        if ($scope.root_organizations[i].id == attrs.initid) {
                            $scope.currentGroup = $scope.root_organizations[i];
                        }
                    }
                } else {
                    for (var i = 0; i < $scope.root_organizations.length; i++) {
                        zNodes.push({
                            id: $scope.root_organizations[i].id,
                            pId: $scope.root_organizations[i].pid,
                            name: $scope.root_organizations[i].name,
                            sort: $scope.root_organizations[i].sort
                        });
                    }
                }

                return zNodes;
            }
            $scope.getLeafes($scope.currentGroup.id);

            $scope.ztreeSetting = {
                zNodes: getOrganizations(),
                isSort: false,
                isSet: false,
                isCheck: false,
                selectedNodes: []
            }

            $scope.$emit('emitGroupLeaf', $scope.currentGroup, $scope.currentLeaf);
            $scope.showGroup = function ($event) {
                $scope.showGroupSel = !$scope.showGroupSel;
            }
            bodyEl.on('click', (e) => {
                if ($(e.target).parents('#groupSelect').hasClass('groupSelect')) return;
                $scope.showGroupSel = false;
                $scope.$apply();
            })
            $scope.$on('leafClick', function (e, data, event) {
                $scope.showGroupSel = false;
                if ($scope.currentGroup.id != data.id) {
                    $scope.currentGroup = data;
                    $scope.currentLeaf = {};
                    $scope.currentLeaf.id = '';
                    $scope.$emit('emitGroupLeaf', $scope.currentGroup, $scope.currentLeaf);
                    $scope.getLeafes($scope.currentGroup.id);
                    $scope.$apply();
                }
            })
            $scope.leafClick = function ($event, item) {
                if (item.id != $scope.currentLeaf.id) {
                    $scope.currentLeaf = item;
                    $scope.$emit('emitGroupLeaf', $scope.currentGroup, $scope.currentLeaf);
                }
            }
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link
        }
    }])
};
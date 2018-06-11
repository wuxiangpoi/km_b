import './style.less';

const groupController = ($scope, $rootScope, baseService,modalService) => {
	$scope.root_organizations = $rootScope.userData.root_organizations;
	$scope.isSort = false;

	function getOrganizations() {
		var zNodes = [];
		for (var i = 0; i < $scope.root_organizations.length; i++) {
			zNodes.push({
				id: $scope.root_organizations[i].id,
				pId: $scope.root_organizations[i].pid,
				name: $scope.root_organizations[i].name,
				sort: $scope.root_organizations[i].sort
			});
		}
		return zNodes;
	}
	$scope.ztreeSetting = {
		zNodes: getOrganizations(),
		isSort: false,
		isSet: true,
		isCheck: false,
		selectedNodes: []
	}
	$scope.sort = function () {
		$scope.isSort = true;
		$scope.ztreeSetting = {
			zNodes: getOrganizations(),
			isSort: true,
			isSet: false,
			isCheck: false,
			selectedNodes: []
		}
	}
	$scope.cancelSort = function () {
		$scope.isSort = false;
		$scope.ztreeSetting = {
			zNodes: getOrganizations(),
			isSort: false,
			isSet: true,
			isCheck: false,
			selectedNodes: []
		}
	}
	$scope.sumbitSort = function () {
		var zTree = $.fn.zTree.getZTreeObj('groupSet');
		baseService.postData(baseService.api.organization + 'saveOrganizationSort', {
			sorts: JSON.stringify(zTree.getNodes()[0].children)
		}, function (res) {
			if (res) {
				$scope.root_organizations = $rootScope.userData.root_organizations = res;
				$scope.isSort = false;
				$scope.ztreeSetting = {
					zNodes: getOrganizations(),
					isSort: false,
					isSet: true,
					isCheck: false,
					selectedNodes: []
				}
			}

		})
	}
	$scope.$on('addNode', function (e, zTree, treeNode) {
		modalService.confirmDialog(540, '新建组织机构', {}, '/static/tpl/group_save.html', function (vm) {
			if (vm.modalForm.$valid) {
				baseService.saveForm(vm, baseService.api.organization + 'saveOrganization', {
					name: vm.name,
					pid: treeNode.id
				}, function (res) {
					if (res) {
						vm.closeThisDialog();
						$scope.root_organizations = $rootScope.userData.root_organizations = res;
						var newId = '';
						for (var i = 0; i < $scope.root_organizations.length; i++) {
							if ($scope.root_organizations[i].name == vm.name) {
								newId = $scope.root_organizations[i].id
							}
						}
						zTree.addNodes(treeNode, {
							pid: treeNode.id,
							name: vm.name,
							id: newId
						});
					}

				})
			} else {
				vm.isShowMessage = true;
			}
		})
	});
	$scope.$on('editNode', function (e, zTree, treeNode) {
		var oVal = '';
		for (var i = 0; i < $scope.root_organizations.length; i++) {
			if (treeNode.id == $scope.root_organizations[i].id) {
				oVal = $scope.root_organizations[i].name;
			}
		}
		if (treeNode.name == '') {
			treeNode.name = oVal;
			baseService.alert('组名不能为空，请重新输入！', 'warning', true, function () {
				zTree.editName(treeNode);
			})
		} else {
			if (treeNode.name == oVal) {
				return;
			}
			baseService.postData(baseService.api.organization + 'saveOrganization', {
				id: treeNode.id,
				name: treeNode.name
			}, function (res) {
				if (res) {
					$scope.root_organizations = $rootScope.userData.root_organizations = res;
				} else {
					treeNode.name = oVal;
					zTree.editName(treeNode);
				}
			})
		}
	});
	$scope.$on('delNode', function (e, zTree, treeNode) {
		modalService.confirm('删除', '确定删除该组织机构' + treeNode.name + ' ?', function (vm,ngDialog) {
			ngDialog.close();
			if (treeNode.isParent) {
                modalService.confirmAlert('删除组织机构', '该机构包含子机构，请先删除子机构再进行删除！', 'warning');
			} else {
				baseService.postData(baseService.api.organization + 'deleteOrganization', {
					id: treeNode.id
				}, function (res) {
					if (res) {
						$scope.root_organizations = $rootScope.userData.root_organizations = res;
						zTree.removeNode(treeNode);
						modalService.alert('删除成功', 'success', true);
					}
				})
			}
		})

	});
}

groupController.$inject = ['$scope', '$rootScope', 'baseService','modalService'];

export default angular => {
	return angular.module('groupModule', []).controller('groupController', groupController);
}
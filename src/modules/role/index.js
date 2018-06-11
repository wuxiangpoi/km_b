import './style.less';

const roleController = ($scope, baseService,modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.role + 'getRolePageList');
	}
	function getPerms(cb) {
		if ($scope.permList) {
			cb();
		} else {
			baseService.getJson(baseService.api.role + 'getPermsList', {}, function (data) {
				$scope.permList = data;
				cb();
			})
		}
	}

	function getpermList(fids) {
		var zNodes = [];
		if (fids && fids.length > 0) {
			var fidsArr = fids.split(',')
			for (var i = 0; i < $scope.permList.length; i++) {
				for (var j = 0; j < fidsArr.length; j++) {
					if (fidsArr[j] == $scope.permList[i].id) {
						zNodes.push({
							id: $scope.permList[i].id,
							pId: $scope.permList[i].pid,
							name: $scope.permList[i].name,
						});
					}
				}

			}
		} else {
			for (var i = 0; i < $scope.permList.length; i++) {
				zNodes.push({
					id: $scope.permList[i].id,
					pId: $scope.permList[i].pid,
					name: $scope.permList[i].name,
				});
			}
		}

		return zNodes;
	}
	$scope.checkPerms = function (item) {
		getPerms(function () {
			modalService.confirmDialog(540,'查看权限', {
				set: 1
			}, '/static/tpl/perms_set.html', function () {

			}, function (vm) {
				vm.zTreeSetting = {
					zNodes: getpermList(item.fids),
					isSort: false,
					isSet: false,
					isCheck: false,
					selectedNodes: []
				}
			})
		})

	};
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			name: item ? item.name : '',
			fids: item ? item.fids : '',
			remark: item ? item.remark : '',
		}
		modalService.confirmDialog(540,item ? '编辑角色' : '添加角色', postData, '/static/tpl/role_save.html', (vm) => {
			if (vm.modalForm.$valid) {
				if (vm.fids && vm.fids.length) {
					vm.data.fids = vm.fids.join(',');
					baseService.saveForm(vm,baseService.api.role + 'saveRole', vm.data, function (res) {
						if(res){
							vm.closeThisDialog();
							modalService.alert(item ? '修改成功' : '添加成功', 'success');
							$scope.callServer($scope.tableState,0);
						}
						
					})
				} else {
					modalService.alert('请先选择权限', 'warning');
				}
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			if(!vm.fids){
				vm.fids = item ? item.fids.split(',') : [];
			}
			vm.checkPerms = function () {
				getPerms(function () {
					modalService.confirmDialog(540,'权限设置', {
						set: 2
					}, '/static/tpl/perms_set.html', function (vm1) {
						var zTree = $.fn.zTree.getZTreeObj('modalZtree');
						var okNodes = zTree.getCheckedNodes(true);
						var fids = [];
						for (var i = 0; i < okNodes.length; i++) {
							fids.push(okNodes[i].id);
						}
						if (fids.length > 0) {
							vm1.closeThisDialog();
							vm.fids = fids;
						} else {
							modalService.alert('请先选择权限', 'warning');
						}
					}, function (vm1) {
						vm1.zTreeSetting = {
							zNodes: getpermList(),
							isSort: false,
							isSet: false,
							isCheck: true,
							selectedNodes: vm.fids
						}
					})
				})
			}
		})
	}

	$scope.del = function (item) {
		modalService.confirm('删除', '您确定删除角色：' + item.name + '?',
			function (vm) {
				baseService.saveForm(vm,baseService.api.role + 'deleteRole', {
					rid: item.id
				}, function (res) {
					if(res){
						vm.closeThisDialog();
						modalService.alert("删除成功", 'success');
						$scope.callServer($scope.tableState);
					}
					
				})
			})
	}
}

roleController.$inject = ['$scope', 'baseService','modalService'];

export default angular => {
	return angular.module('roleModule', []).controller('roleController', roleController);
}
import './style.less';

const auserController = ($scope, baseService,modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};

	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.installUser + 'getInstallUserPageList');
	}
	$scope.initPage = function(){
		$scope.callServer($scope.tableState, 0)
	}
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			phone: item ? item.phone : '',
			password: item ? item.password : '',
			name: item ? item.name : '',
			oid: item ? item.oid : ''
		}
		modalService.confirmDialog(540,item ? '编辑账号' : '添加账号', postData, '/static/tpl/auser_save.html', (vm) => {
			if (vm.modalForm.$valid) {
				var onData = {
					id: item ? item.id : '',
					phone: vm.data.phone,
					password: vm.data.password,
					name: vm.data.name,
					oid: vm.currentGroup.id
				}
				if (!item) {
					onData.password = baseService.md5_pwd(onData.password);
				}
				baseService.saveForm(vm,baseService.api.installUser + 'saveInstallUser', onData, (res) => {
					if(res){
						modalService.alert(item ? '编辑成功' : '添加成功', 'success');
						vm.closeThisDialog();
						$scope.callServer($scope.tableState);
					}
					
				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			vm.$on('emitGroupLeaf', function (e, group, leaf) {
				vm.currentGroup = group;
				vm.currentGroup.id = group.id;
			})
		})
	}
	$scope.resetPwd = function (item) {
		modalService.confirmDialog(540, '重置密码', {}, '/static/tpl/reset_password.html', function (vm) {
			if (vm.modalForm.$valid) {
				baseService.saveForm(vm,baseService.api.installUser + 'resetInstallUserPassword', {
					id: item.id,
					password: baseService.md5_pwd(vm.data.password)
				}, function (res) {
					if(res){
						vm.closeThisDialog();
						modalService.alert("操作成功", 'success');
					}
					
				});
			} else {
				vm.isShowMessage = true;
			}

		})
	}
	$scope.del = function (item) {
		modalService.confirm('删除', '您确定删除安装人员：' + item.name + '?', function (vm,ngDialog) {
			baseService.saveForm(vm,baseService.api.installUser + 'deleteInstallUser', {
				id: item.id
			}, function (res) {
				if(res){
					vm.closeThisDialog();
					modalService.alert("删除成功", 'success');
					$scope.callServer($scope.tableState);
				}
				
			});

		})
	}
}

auserController.$inject = ['$scope', 'baseService','modalService'];

export default angular => {
	return angular.module('auserModule', []).controller('auserController', auserController);
}
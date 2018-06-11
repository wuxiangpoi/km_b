import './style.less';

const userController = ($scope,$rootScope, baseService,modalService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.sp.oid = $rootScope.rootGroup.id;
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.user + 'getUserPageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.$on('emitGroupLeaf', function (e, group) {
		if ($scope.sp.oid != group.id) {
			$scope.sp.oid = group.id;
			$scope.initPage();
		}

	});
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
	$scope.save = (item) => {
		let postData = {
			id: item ? item.id : '',
			account: item ? item.account : '',
			password: item ? item.password : '',
			name: item ? item.name : '',
			role: item ? item.role : '',
			oid: item ? item.oid : ''
		}
		modalService.confirmDialog(540, item ? '编辑账号' : '添加账号', postData, '/static/tpl/user_save.html', (vm) => {
			if (vm.modalForm.$valid) {
				let onData = {
					id: item ? item.id : '',
					account: vm.data.account,
					password: vm.data.password,
					name: vm.data.name,
					role: vm.data.role,
					oid: vm.currentGroup.id
				}
				if (!item) {
					onData.password = baseService.md5_pwd(onData.password);
				}
				if (onData.role == 1) {
					onData.oid = '';
				}
				baseService.saveForm(vm, baseService.api.user + 'saveUser', onData, (res) => {
					if (res) {
						modalService.alert(item ? '编辑成功' : '添加成功', 'success');
						vm.closeThisDialog();
						$scope.callServer($scope.tableState);
					}

				})
			} else {
				vm.isShowMessage = true;
			}

		}, function (vm) {
			vm.roles = [];
			baseService.getJson(baseService.api.role + 'getRoleList', {}, function (data) {
				vm.roles = data;
			})
			vm.$on('emitGroupLeaf', function (e, group) {
				vm.currentGroup = group;
				vm.currentGroup.id = group.id;
			})
		})
	}
	$scope.changeStatus = function (item, index) {
		modalService.confirm(item.enabled == 0 ? '解禁账户' : '禁用账户', item.enabled == 0 ? '您确定解禁此账号：' + item.name : '您确定禁用此账号：' + item.name,
			(vm) => {
				let me = this;
				baseService.saveForm(vm,baseService.api.user + 'setUserEnable', {
					uid: item.id,
					enabled: item.enabled == 0 ? 1 : 0
				}, (res) => {
					if(res){
						modalService.alert('操作成功', 'success');
						vm.closeThisDialog();
						$scope.callServer($scope.tableState);
					}
					
				})
			})
	}
	$scope.resetPwd = function (item) {
		modalService.confirmDialog(540, '重置密码', {}, '/static/tpl/reset_password.html', function (vm) {
			if (vm.modalForm.$valid) {
				baseService.saveForm(vm,baseService.api.user + 'resetPwd', {
					uid: item.id,
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
}

userController.$inject = ['$scope','$rootScope', 'baseService','modalService'];

export default angular => {
	return angular.module('userModule', []).controller('userController', userController);
}
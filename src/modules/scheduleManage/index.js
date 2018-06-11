import style from './style.less';

import {
	scheduleStatusOptions,
	terminalStatusOptions
} from '../../filter/options';


const scheduleManageController = ($scope, $rootScope,$filter, $stateParams, baseService, modalService,chartService,$state) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.scheduleStatusOptions = scheduleStatusOptions;
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
		baseService.initTable($scope, tableState, baseService.api.programSchedule + 'getProgramSchedulePageList');
	}
	$scope.initPage = function () {
		$scope.callServer($scope.tableState, 0)
	}
	$scope.showSchedule = function (item) {
		baseService.showSchedule(item, 2,chartService);
	}
	$scope.submitCheck = function (item) {
		modalService.confirm('提交审核', '是否提交审核？', function (vm,ngDialog) {
			baseService.saveForm(vm,baseService.api.programSchedule + 'submitProgramScheduleById', {
				id: item.id
			}, function (res) {
				if(res){
					ngDialog.close();
					modalService.alert('提交成功', 'success');
					$scope.callServer($scope.tableState);
				}
				
			});
		})


	}
	$scope.edit = function (item) {
		$state.go('dashboard.scheduleCreate', {
			id: item.id
		});
	}
	$scope.saveAs = function (item,start) {
		$state.go('dashboard.scheduleCreate', {
			type: 'saveAs',
			 pos: start,
			 id: item.id
		});
	}
	$scope.del = function (item) {
		modalService.confirm('删除', "确定删除排期：" + item.name + "?", function (vm,ngDialog) {
			baseService.saveForm(vm,baseService.api.programSchedule + 'deleteProgramScheduleById', {
				id: item.id
			}, function (res) {
				if(res){
					ngDialog.close()
					modalService.alert("删除成功", 'success');
					$scope.callServer($scope.tableState);
				}
				
			});
		})
	}
	$scope.sendDown = function (item) {
		item.info = "(排期发布后，终端上的节目将会停播)";
		modalService.confirmDialog(720, '排期发布', item, '/static/tpl/terminal_schedule.html', function (vm,ngDialog) {
			var s = '';
			s = vm.ids.join(',');
			if (s.length) {
				modalService.confirm('节目操作', "确定在选中的终端上发布排期?", function (vm1,ngDialog) {
					baseService.saveForm(vm1,baseService.api.programSchedule + 'scheduleManage_sendCommand', {
							pid: item.id,
							type: 1, // 0停播  1 下发
							tids: s
						},
						function (res) {
							if(res){
								ngDialog.close();
								modalService.alert('下发成功', 'success');
							}
							
						});
				})
			} else {
				modalService.alert('请至少勾选一个设备再进行操作', 'warning', true);
			}
		}, function (vm) {
			vm.displayed = [];
			vm.sp = {};
			vm.ids = [];
			vm.currentGroup = $rootScope.rootGroup;
			vm.sp.oid = vm.currentGroup.id;
			vm.currentLeaf = {};
			vm.currentLeaf.id = '';
			vm.sp.gid = '';
			vm.tableState = {};
			vm.terminalResolutionOptions = $filter('terminalResolutionOptions')();
			vm.terminalStatusOptions = terminalStatusOptions;
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, baseService.api.programSchedule + 'scheduleManage_getAllOkTerminalList');
			}
			vm.initPage = function () {
				vm.tableState.pagination.start = 0;
				vm.callServer(vm.tableState);
			}
			vm.$on('emitGroupLeaf', function (e, group, leaf) {
				if (vm.sp.oid != group.id || vm.sp.gid != leaf.id) {
					vm.currentGroup = group;
					vm.sp.oid = group.id;
					vm.sp.gid = leaf.id;
					vm.callServer(vm.tableState);
				}

			});
			vm.checkAll = function ($event) {
				vm.ids = [];
				if ($($event.currentTarget).is(':checked')) {
					for (var i = 0; i < vm.displayed.length; i++) {
						vm.ids.push(vm.displayed[i].id)
					}
				} else {
					vm.ids = [];
				}
			}
			vm.checkThis = function (item, $event) {
				if ($($event.currentTarget).is(':checked')) {
					vm.ids.push(item.id);

				} else {
					vm.ids = baseService.removeAry(vm.ids, item.id);
				}
			}
			vm.showPlay = function (item) {
				baseService.showProgram(item);
			}
		})
	}
	$scope.sendCommandStopProgram = function (item) {
		modalService.confirmDialog(720, '播放管理', item, '/static/tpl/terminal_schedulePlay.html', function (vm,ngDialog) {
			var s = '';
			s = vm.ids.join(',');
			if (s.length) {
				modalService.confirm('节目操作', "确定在该设备上停播选中节目?", function (vm1,ngDialog) {
					baseService.saveForm(vm1,baseService.api.programSchedule + 'scheduleManage_sendCommand', {
							tids: s,
							type: 0, // 0停播  1 下发
							pid: item.id
						},
						function (res) {
							if(res){
								ngDialog.close();
								modalService.confirmAlert('信息提示', '操作成功', 'success', '终端命令执行成功后，将停播此排期，同时不显示在终端列表中~', '离线终端需上线后再执行命令，半小时内重复命令为您自动过滤')
							}
							
						});
				})
			} else {
				modalService.alert('请至少勾选一个终端再进行操作', 'warning', true);
			}
		}, function (vm) {
			vm.displayed = [];
			vm.sp = {};
			vm.ids = [];
			vm.currentGroup = $rootScope.rootGroup;
			vm.sp.oid = vm.currentGroup.id;
			vm.currentLeaf = {};
			vm.currentLeaf.id = '';
			vm.sp.gid = '';
			vm.tableState = {};
			vm.showType = 0;
			vm.sp.pid = item.id;
			vm.terminalResolutionOptions = $filter('terminalResolutionOptions')();
			vm.terminalStatusOptions = terminalStatusOptions;
			vm.callUrl = baseService.api.programSchedule + 'getProgramSchedulePlayPageByPid';
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, vm.callUrl);
			}
			vm.initTable = function () {
				vm.sp.status = '';
				vm.sp.resolution = '';
				switch (vm.showType) {
					case 0:
						vm.callUrl = baseService.api.programSchedule + 'getProgramSchedulePlayPageByPid';
						break;
					case 1:
						vm.callUrl = baseService.api.programSchedule + 'getProgramScheduleCommandPengdingPageByPid';
						break;
				}
				vm.currentGroup = $rootScope.rootGroup;
				vm.sp.oid = vm.currentGroup.id;
				vm.currentLeaf = {};
				vm.currentLeaf.id = '';
				vm.sp.gid = '';
				vm.callServer(vm.tableState);
			}
			vm.$on('emitGroupLeaf', function (e, group, leaf) {
				if (vm.sp.oid != group.id || vm.sp.gid != leaf.id) {
					vm.currentGroup = group;
					vm.sp.oid = group.id;
					vm.sp.gid = leaf.id;
					vm.callServer(vm.tableState);
				}

			});
			vm.checkAll = function ($event) {
				vm.ids = [];
				if ($($event.currentTarget).is(':checked')) {
					for (var i = 0; i < vm.displayed.length; i++) {
						vm.ids.push(vm.displayed[i].tid)
					}
				} else {
					vm.ids = [];
				}
			}
			vm.checkThis = function (item, $event) {
				if ($($event.currentTarget).is(':checked')) {
					vm.ids.push(item.tid);

				} else {
					vm.ids = baseService.removeAry(vm.ids, item.tid);
				}
			}
			vm.switchTab = function (type) {
				if (vm.showType != type) {
					vm.showType = type;
					vm.initTable();
				}

			}
		})
	}
}

scheduleManageController.$inject = ['$scope', '$rootScope','$filter', '$stateParams', 'baseService', 'modalService','chartService','$state'];

export default angular => {
	return angular.module('scheduleManageModule', []).controller('scheduleManageController', scheduleManageController);
}
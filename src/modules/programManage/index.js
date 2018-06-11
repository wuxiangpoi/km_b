import style from './style.less';

import {
	hasTerminalOptions,
	terminalStatusOptions
} from '../../filter/options';


const programManageController = ($scope, $rootScope, $filter, $state, baseService, modalService, leafService) => {
	$scope.displayed = [];
	$scope.sp = {};
	$scope.tableState = {};
	$scope.ids = [];
	$scope.leafes = [];
	$scope.sp.oid = $rootScope.rootGroup.id;
	$scope.currentLeaf = {};
	$scope.currentLeaf.id = '';
	$scope.sp.gid = '';
	$scope.getTerminalGroups = function (oid) {
		leafService.getLeafes(baseService.api.program + 'getProgramGroups', oid, function (data) {
			$scope.leafes = data;
		})
	}
	$scope.getTerminalGroups($scope.sp.oid);
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.program + 'getProgramList');
	}
	$scope.initPage = function () {
		$scope.ids = [];
		$scope.callServer($scope.tableState, 0)
	}
	$scope.rootProgramReslotions = $filter('rootProgramReslotions')();
	$scope.rootCheckStatusProgram = $filter('rootCheckStatusProgram')();
	$scope.hasTerminalOptions = hasTerminalOptions;
	$scope.checkAll = function ($event) {
		$scope.ids = [];
		if ($($event.currentTarget).is(':checked')) {
			for (var i = 0; i < $scope.displayed.length; i++) {
				$scope.ids.push($scope.displayed[i].id)

			}
		} else {
			$scope.ids = [];
		}
	}
	$scope.checkThis = function (item, $event) {
		if ($($event.currentTarget).is(':checked')) {
			$scope.ids.push(item.id);

		} else {
			$scope.ids = baseService.removeAry($scope.ids, item.id);
		}
	}
	$scope.$on('emitGroupLeaf', function (e, group) {
		if ($scope.sp.oid != group.id) {
			$scope.currentGroup = group;
			$scope.sp.oid = group.id;
			$scope.sp.gid = '';
			$scope.initPage();
			$scope.getTerminalGroups($scope.sp.oid);
		}

	});
	$scope.chooseLeaf = function (id, $event) {
		$scope.currentLeaf.id = id;
		$scope.sp.gid = id;
		$scope.initPage();
	}
	$scope.editLeaf = function (item, $event) {
		var parent = $($event.currentTarget).parents('.leafGroup');
		var leafName = $($event.currentTarget).parents('.leafGroup').children('.leafName');
		var editInput = $($event.currentTarget).parents('.leafGroup').children('.leafEdit').children('input');
		var oVal = editInput.val();
		parent.addClass('edit');
		editInput.focus();

		function edit() {
			var nVal = editInput.val();
			if (nVal == '' || nVal == oVal) {
				editInput.val(oVal);
				parent.removeClass('edit');
			} else {
				leafService.editLeaf(baseService.api.program + 'optGroupSave', {
					id: item.id,
					name: nVal,
					oid: $scope.sp.oid
				}, function () {
					parent.removeClass('edit');
					$scope.getTerminalGroups($scope.sp.oid);
				}, function () {
					leafName.text(oVal);
					editInput.val(oVal);
					parent.removeClass('edit');
				})
			}
		}
		editInput.blur(function () {
			edit();
		})
		editInput.bind("keydown", function (e) {
			// 兼容FF和IE和Opera    
			var theEvent = e || window.event;
			var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
			if (code == 13) {
				edit();
			}
		});
	}
	$scope.delLeaf = function (item) {
		leafService.delLeaf(baseService.api.program + 'optGroupDel', item, function () {
			$scope.getTerminalGroups($scope.sp.oid);
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.callServer($scope.tableState);
		})

	}
	$scope.setGroup = function () {
		var gids = $scope.ids.join(',');
		leafService.setGroup(baseService.api.program + 'setOrganization', gids, function () {
			$scope.getTerminalGroups($scope.sp.oid);
			$scope.initPage();
		})
	}
	$scope.addGroup = function () {
		leafService.addGroup(baseService.api.program + 'optGroupSave', $scope.sp.oid, function () {
			$scope.getTerminalGroups($scope.sp.oid);
		})
	}
	$scope.setGroup = function () {
		var gids = $scope.ids.join(',');
		leafService.setGroup(baseService.api.program + 'setOrganization', gids, function () {
			$scope.getTerminalGroups($scope.sp.oid);
			$scope.initPage();
		})
	}
	$scope.setLeaf = function () {
		var gids = $scope.ids.join(',');
		leafService.setLeaf(baseService.api.program + 'setGroupRelations', $scope.sp.oid, gids, $scope.leafes, function () {
			$scope.initPage();
		})
	}
	$scope.cancelLeaf = function () {
		var gids = $scope.ids.join(',');
		leafService.cancelLeaf(baseService.api.program + 'setGroupRelations', gids, $scope.currentLeaf, function () {
			$scope.initPage();
		})
	}
	$scope.showProgram = function (item) {
		item.pid = item.id;
		baseService.showProgram(item);
	}
	$scope.sendCommandStopProgram = function (item,index) {
		modalService.confirmDialog(720, '播放管理', item, "/static/tpl/terminal_list_modal.html", function (vm,ngDialog) {
			var s = vm.ids.join(',');
			if (s.length) {
				var postUrl = vm.programOrSchedule == 0?'/api/program/programManage_sendCommand':'/api/programSchedule/scheduleManage_sendCommand'
				var postData = {};
				if(vm.programOrSchedule == 0){
					postData = {
						tids: s,
						type: 0, // 0停播  1 下发
						pid: item.id,
						oid: item.oid,
						gid: item.gid
					};
				}else{
					postData = {
						tids: s,
						type: 0, // 0停播  1 下发
						pid: item.id
					};
				}
				baseService.saveForm(vm,baseService.api.apiUrl + postUrl, postData,
					function (res) {
						if(res){
							ngDialog.close();
							modalService.alert('操作成功', 'success');
						}
						
					});
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
			vm.sp.pid = item.id;
			vm.tableState = {};
			vm.showType = 0;
			vm.checkPerms = false;
			vm.programOrSchedule = 0;
			vm.terminalResolutionOptions = $filter('terminalResolutionOptions')();
			vm.terminalStatusOptions = terminalStatusOptions;
			vm.callUrl = baseService.api.program + 'getProgramPlayPageByPid';
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, vm.callUrl, function (result) {
					if(result.data[0]){
						if (!result.data[0].stype || result.data[0].stype == 0) {
							if ($rootScope.perms(436)) {
								vm.checkPerms = true;
							}
							vm.programOrSchedule = 0;
						} else {
							if ($rootScope.perms(445)) {
								vm.checkPerms = true;
							}
							vm.programOrSchedule = 1;
						}
					}
					if(vm.callUrl == baseService.api.program + 'getProgramPlayPageByPid'){
						$scope.displayed[index].playTers = result.recordsTotal;
					}
				});
			}
			vm.initPage = function () {
				vm.tableState.pagination.start = 0;
				vm.ids = [];
				vm.callServer(vm.tableState);
			}
			vm.initTable = function () {
				vm.sp.resolution = '';
				vm.sp.status = '';
				switch (vm.showType) {
					case 0:
						vm.callUrl = baseService.api.program + 'getProgramPlayPageByPid';
						break;
					case 1:
						vm.callUrl = baseService.api.program + 'getProgramCommandPengdingPageByPid';
						break;
				}
				vm.currentGroup = $rootScope.rootGroup;
				vm.sp.oid = vm.currentGroup.id;
				vm.currentLeaf = {};
				vm.currentLeaf.id = '';
				vm.sp.gid = '';
				vm.callServer(vm.tableState);
			}
			vm.switchTab = function (type) {
				if(vm.showType != type){
					vm.showType = type;
					vm.initTable();
				}						
				
			}
			vm.$on('emitGroupLeaf', function (e, group, leaf) {
				if (vm.sp.oid != group.id || vm.sp.gid != leaf.id) {
					vm.currentGroup = group;
					vm.sp.oid = group.id;
					vm.sp.gid = leaf.id;
					vm.initPage();
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
		})
	}
	$scope.sendDown = function (item) {
		modalService.confirmDialog(820, '发布', item, "/static/tpl/terminal_list_set_modal.html", function (vm, ngDialog) {
			var s = vm.ids.join(',');
			if (s.length) {
				if (vm.data.endDate > vm.data.startDate) {
					if (vm.showTip) {
						modalService.alert('请选择正确的播放时间段', 'warning', true);
					} else {
						baseService.saveForm(vm, baseService.api.program + 'programManage_sendCommand', {
							tids: s,
							type: 1,
							pid: item.id
						}, function (res) {
							if (res) {
								ngDialog.close();
								modalService.alert('发布成功', 'success');
								vm.callServer(vm.tableState);
							}


						})
					}

				} else {
					modalService.alert('请选择正确的播放日期', 'warning');
				}

			} else {
				modalService.alert('请至少勾选一个终端再进行操作', 'warning');
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
			vm.sp.pid = item.id;
			vm.tableState = {};

			vm.start_h = 0;
			vm.start_m = 0;
			vm.end_h = 24;
			vm.end_m = 0;
			vm.showTip = false;
			vm.selectH = [];
			vm.selectM = [];
			vm.terminalResolutionOptions = $filter('terminalResolutionOptions')();
			vm.terminalStatusOptions = terminalStatusOptions;
			var day = new Date();
			vm.today = day.getFullYear() + '-' + getMonthNum(day.getMonth() + 1) + getMonthNum(day.getDate());
			for (var i = 0; i < 25; i++) {
				vm.selectH.push({
					name: i + '时',
					value: i
				})
			}
			for (var i = 0; i < 60; i++) {
				vm.selectM.push({
					name: i + '分',
					value: i
				})
			}

			function getMonthNum(month) {
				if (month < 10) {
					return '0' + month.toString();
				} else {
					return month.toString();
				}
			}
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, baseService.api.program + 'programManage_getAllOkTerminalList');
			}
			vm.initPage = function () {
				vm.tableState.pagination.start = 0;
				vm.callServer(vm.tableState);
			}
			var now = new Date();
			var nowYear = now.getFullYear();
			var nowMonth = now.getMonth() + 1;
			var nowDate = now.getDate();
			vm.data.startDate = nowYear.toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
			vm.data.endDate = (nowYear + 1).toString() + getMonthNum(nowMonth) + getMonthNum(nowDate.toString());
			vm.formDate = function (n, o, attr) {
				vm.data[attr] = n._i.split('-').join('');
			}
			vm.checkTime = function () {
				if (vm.start_h == 24) {
					vm.start_m = 0;
				}
				if (vm.end_h == 24) {
					vm.end_m = 0;
				}
				if (parseFloat(vm.end_h + vm.end_m / 60) <= parseFloat(vm.start_h + vm.start_m / 60)) {
					vm.showTip = true;
				} else {
					vm.showTip = false;
				}
			}
			vm.$on('emitGroupLeaf', function (e, group, leaf) {
				if (vm.sp.oid != group.id || vm.sp.gid != leaf.id) {
					vm.currentGroup = group;
					vm.sp.oid = group.id;
					vm.sp.gid = leaf.id;
					vm.initPage();
				}

			});
			vm.checkAll = function ($event) {
				baseService.checkAll($event, vm);
			}
			vm.checkThis = function (item, $event) {
				baseService.checkThis(item, $event, vm);
			}
		})
	}
	$scope.submitCheck = function (item) {
		modalService.confirm('提交审核', '是否提交审核？', function (vm, ngDialog) {
			baseService.saveForm(vm, baseService.api.program + 'sumbmitCheck', {
				id: item.id
			}, (res) => {
				if (res) {
					ngDialog.close();
					modalService.alert('提交成功', 'success');
					$scope.callServer($scope.tableState);
				}

			});
		})


	}
	$scope.del = function (item) {
		modalService.confirm('删除', "确定删除节目：" + item.name + "?", function (vm, ngDialog) {
			baseService.saveForm(vm, baseService.api.program + 'deleteProgram', {
				id: item.id
			}, function (res) {
				if (res) {
					ngDialog.close()
					modalService.alert("删除成功", 'success');
					$scope.callServer($scope.tableState);
				}

			});
		})
	}
	$scope.saveEdit = function (item) {
		$state.go('dashboard.programEdit', {
			id: item.id
		});
	}
	$scope.saveAs = function (item) {
		$state.go('dashboard.programCopy', {
			id: item.id
		});
	}
}

programManageController.$inject = ['$scope', '$rootScope', '$filter', '$state', 'baseService', 'modalService', 'leafService'];

export default angular => {
	return angular.module('programManageModule', []).controller('programManageController', programManageController);
}
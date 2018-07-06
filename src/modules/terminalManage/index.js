import style from './style.less';

import {
	opOptions,
	terminalStatusOptions,
	cmdCodeOptions,
	hasProgramOptions
} from '../../filter/options';


const terminalManageController = ($scope, $rootScope, $stateParams, $filter, baseService, modalService, leafService, chartService) => {
	$scope.displayed = [];
	$scope.displayedEnabled = [];
	$scope.opOptions = opOptions;
	$scope.terminalResolutionOptions = $filter('terminalResolutionOptions')();
	$scope.terminalRootCitys = $filter('terminalRootCitys')();
	$scope.terminalStatusOptions = terminalStatusOptions;
	$scope.hasProgramOptions = hasProgramOptions;
	$scope.cmdCodeOptions = cmdCodeOptions;
	$scope.sp = {};
	$scope.tableState = {};
	$scope.ids = [];
	$scope.idsNormal = [];
	$scope.leafes = [];
	$scope.sp.oid = $rootScope.rootGroup.id;
	$scope.currentLeaf = {};
	$scope.currentLeaf.id = '';
	$scope.sp.gid = '';
	$scope.init_status = $stateParams.status;
	if ($stateParams.status) {
		$scope.sp.status = $stateParams.status;
	}
	$scope.getTerminalGroups = function (oid) {
		leafService.getLeafes(baseService.api.terminal + 'getTerminalGroups', oid, function (data) {
			$scope.leafes = data;
		})
	}
	$scope.getTerminalGroups($scope.sp.oid);
	$scope.callServer = function (tableState, page) {
		if (baseService.isRealNum(page)) {
			$scope.tableState.pagination.start = page * $scope.sp.length;
		}
		baseService.initTable($scope, tableState, baseService.api.terminal + 'getTerminalPageList', (res) => {
			for (var i = 0; i < res.data.length; i++) {
				if (res.data[i].status != 4) {
					$scope.displayedEnabled.push(res.data[i]);
				}
			}
		});
	}
	$scope.initPage = function () {
		$scope.ids = [];
		$scope.idsNormal = [];
		$scope.displayedEnabled = [];
		$scope.callServer($scope.tableState, 0);
	}
	$scope.$on('emitGroupLeaf', function (e, group) {
		if ($scope.sp.oid != group.id) {
			$scope.sp.oid = group.id;
			$scope.sp.gid = '';
			$scope.initPage();
			$scope.getTerminalGroups($scope.sp.oid);
		}

	});
	$scope.checkAll = function ($event) {
		$scope.ids = [];
		$scope.idsNormal = [];
		if ($($event.currentTarget).is(':checked')) {
			for (var i = 0; i < $scope.displayedEnabled.length; i++) {
				$scope.ids.push($scope.displayedEnabled[i].id);
				if ($scope.displayedEnabled[i].status == 1) {
					$scope.idsNormal.push($scope.displayedEnabled[i].id)
				}
			}
		} else {
			$scope.ids = [];
			$scope.idsNormal = [];
		}
	}
	$scope.checkThis = function (item, $event) {
		if ($($event.currentTarget).is(':checked')) {
			if (item.status != 4) {
				$scope.ids.push(item.id);
			}
			if (item.status == 1) {
				$scope.idsNormal.push(item.id);
			}
		} else {
			$scope.ids = baseService.removeAry($scope.ids, item.id);
			$scope.idsNormal = baseService.removeAry($scope.idsNormal, item.id);
		}
	}
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
	$scope.details = function (item) {
		baseService.getJson(baseService.api.terminal + 'getTerminalInfo', {
			tid: item.id
		}, function (data) {
			modalService.confirmDialog(580, '终端状态信息', data, 'static/tpl/terminal_details.html', function (vm, ngDialog) {
				vm.closeThisDialog();
			})
		});

	}
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
				leafService.editLeaf(baseService.api.terminal + 'optGroupSave', {
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
		leafService.delLeaf(baseService.api.terminal + 'optGroupDel', item, function () {
			$scope.getTerminalGroups($scope.sp.oid);
			$scope.currentLeaf = {};
			$scope.currentLeaf.id = '';
			$scope.sp.gid = '';
			$scope.callServer($scope.tableState);
		})

	}
	$scope.setGroup = function () {
		var gids = $scope.ids.join(',');
		leafService.setGroup(baseService.api.terminal + 'setOrganization', gids, function () {
			$scope.getTerminalGroups($scope.sp.oid);
			$scope.initPage();
		})
	}
	$scope.addGroup = function () {
		leafService.addGroup(baseService.api.terminal + 'optGroupSave', $scope.sp.oid, function () {
			$scope.getTerminalGroups($scope.sp.oid);
		})
	}
	$scope.setGroup = function () {
		var gids = $scope.ids.join(',');
		leafService.setGroup(baseService.api.terminal + 'setOrganization', gids, function () {
			$scope.getTerminalGroups($scope.sp.oid);
			$scope.initPage();
		})
	}
	$scope.setLeaf = function () {
		var gids = $scope.ids.join(',');
		leafService.setLeaf(baseService.api.terminal + 'setGroupRelations', $scope.sp.oid, gids, $scope.leafes, function () {
			$scope.initPage();
		})
	}
	$scope.cancelLeaf = function () {
		var gids = $scope.ids.join(',');
		leafService.cancelLeaf(baseService.api.terminal + 'setGroupRelations', gids, $scope.currentLeaf, function () {
			$scope.initPage();
		})
	}
	$scope.save = function (item) {
		let modalData = {
			name: item.name,
			no: item.no,
			id: item.id,
			city_no: item.city_no,
			remark: item.remark,
			cityName: '',
			addr: item.addr
		};
		modalService.confirmDialog(540, '编辑终端信息', modalData, '/static/tpl/terminal_save.html', (vm, ngDialog) => {
			if (vm.modalForm.$valid) {
				let formData = {
					name: baseService.trim(vm.data.name, 'g'),
					id: vm.data.id,
					city_no: vm.data.city_no,
					remark: vm.data.remark ? vm.data.remark : '',
					cityName: '',
					addr: vm.data.addr
				}
				baseService.saveForm(vm, baseService.api.terminal + 'modifyTerminalInfo', formData, (res) => {
					if (res) {
						$rootScope.userData.root_citys = res;
						vm.closeThisDialog();
						$scope.callServer($scope.tableState);
						modalService.alert(item ? '修改成功' : '添加成功', 'success');
					}
				})

			} else {
				vm.isShowMessage = true;
			}

		})
	}
	$scope.sendCommand = function (command) {
		var tids = $scope.idsNormal.join(',');

		switch (command) {
			case 2:
			case 3:
				var modalData = {
					command: command
				}
				if ($scope.idsNormal.length == 1) {
					var t = {};
					for (var i = 0; i < $scope.displayed.length; i++) {
						if ($scope.displayed[i].id == tids) {
							t = $scope.displayed[i];
						}
					}
					if (command == 3) {
						modalData.volumn = t.volumn;
					} else {
						if (t.workCron) {
							var st = t.workCron.split("/")[0];
							var et = t.workCron.split("/")[1];
							modalData.start_h = parseInt(st.split(" ")[2]);
							modalData.start_m = parseInt(st.split(" ")[1]);
							modalData.end_h = parseInt(et.split(" ")[2]);
							modalData.end_m = parseInt(et.split(" ")[1]);
							modalData.weeks = '1,2,3,4,5,6,7';
						}
					}
				}
				modalService.confirmDialog(450, $rootScope.getRootDicName('terminal_cmd', command), modalData, '/static/tpl/terminal_command.html', function (vm, ngDialog) {
					var postData = {
						tids: tids,
						command: command
					}
					if (command == 3) {
						if (vm.modalForm.$valid) {
							postData.volumn = vm.data.volumn;
							baseService.saveForm(vm, baseService.api.terminal + 'sendCommand', postData,
								(res) => {
									if (res) {
										ngDialog.close();
										modalService.alert('设置成功', 'success');
										$scope.initPage();
									}


								});
						} else {
							vm.isShowMessage = true;
						}

					} else {
						if (vm.modalForm.$valid && vm.data.end_h * 60 + vm.data.end_m >= vm.data.start_h * 60 + vm.data.start_m) {

							vm.isPosting = true;
							postData.start_h = vm.data.start_h;
							postData.start_m = vm.data.start_m;
							postData.end_h = vm.data.end_h;
							postData.end_m = vm.data.end_m;
							postData.week = '1,2,3,4,5,6,7';
							baseService.postData(baseService.api.terminal + 'sendCommand', postData,
								function (data) {
									ngDialog.close();
									modalService.alert('设置成功', 'success');
									$scope.callServer($scope.tableState);

								});
						} else {
							vm.isShowMessage = true;

						}
					}


				}, function (vm) {
					vm.selectH = [];
					vm.selectM = [];
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
					vm.checkTime = function () {
						if (vm.data.start_h == 24) {
							vm.data.start_m = 0;
						}
						if (vm.data.end_h == 24) {
							vm.data.end_m = 0;
						}

					}
				})
				break;
			case 4:
			case 7:
			case 8:
				modalService.confirm('终端操作', "确定对当前选中的设备执行命令：" + $rootScope.getRootDicName('terminal_cmd', command) + "?", function (vm, ngDialog) {
					baseService.saveForm(vm, baseService.api.terminal + 'sendCommand', {
							tids: tids,
							command: command
						},
						(res) => {
							if (res) {
								ngDialog.close()
								modalService.alert('命令执行成功后，可在终端详情中查看', 'success')
							}

						});
				})
				break;
		}
	}
	$scope.showPrograms = function (item, index) {
		item.info = "(同一终端上的节目与排期互斥)";
		modalService.confirmDialog(720, '播放管理', item, '/static/tpl/terminal_programPlay_list.html', function (vm, ngDialog) {
			var s = '';
			s = vm.ids.join(',');
			var typeTxt = vm.programOrSchedule == 0 ? '节目' : '排期';
			if (s.length) {
				modalService.confirm('节目操作', "确定在该设备上停播选中" + typeTxt + "?", function (vm1, ngDialog) {
					var postUrl = vm.programOrSchedule == 0 ? '/api/program/programManage_sendCommand_StopPlayByPids' : '/api/programSchedule/scheduleManage_sendCommand'
					var postData = {};
					if (vm.programOrSchedule == 0) {
						postData = {
							tid: item.id,
							type: 0, // 0停播  1 下发
							pids: s
						};
					} else {
						postData = {
							tids: item.id,
							type: 0, // 0停播  1 下发
							pid: s
						};
					}
					baseService.saveForm(vm1, baseService.api.apiUrl + postUrl, postData,
						function (res) {
							if (res) {
								ngDialog.close();
								modalService.alert('操作成功', 'success')
							}

						});
				})
			} else {
				modalService.alert('请至少勾选一个' + typeTxt + '再进行操作', 'warning');
			}
		}, function (vm) {
			vm.displayed = [];
			vm.sp = {};
			vm.sp.tid = item.id;
			vm.tableState = {};
			vm.ids = [];
			vm.showType = 0;
			vm.checkPerms = false;
			vm.programOrSchedule = 0;
			vm.callUrl = baseService.api.terminal + 'getTerminalProgramPlayPageByTid';
			vm.callServer = function (tableState) {
				baseService.initTable(vm, tableState, vm.callUrl, function (result) {
					if (result.data[0]) {
						if (!result.data[0].stype || result.data[0].stype == 0) {
							if ($rootScope.perms(217)) {
								vm.checkPerms = true;
							}
							if (vm.callUrl == baseService.api.terminal + 'getTerminalProgramPlayPageByTid') {
								$scope.displayed[index].programCounts = result.recordsTotal;
							}
							vm.programOrSchedule = 0;
						} else {
							if ($rootScope.perms(217)) {
								vm.checkPerms = true;
							}
							vm.programOrSchedule = 1;
							if (vm.callUrl == baseService.api.terminal + 'getTerminalProgramPlayPageByTid') {
								$scope.displayed[index].programCounts = result.data[0].programCounts;
							}
						}
					}

				});
			}
			vm.initTable = function () {
				switch (vm.showType) {
					case 0:
						vm.callUrl = baseService.api.terminal + 'getTerminalProgramPlayPageByTid';
						break;
					case 1:
						vm.callUrl = baseService.api.terminal + 'getTerminalProgramCommandPengdingPageByTid';
						break;
				}

				vm.callServer(vm.tableState);
			}
			vm.switchTab = function (type) {
				if (vm.showType != type) {
					vm.showType = type;
					vm.initTable();
				}

			}
			vm.checkAll = function ($event) {
				vm.ids = [];
				if ($($event.currentTarget).is(':checked')) {
					for (var i = 0; i < vm.displayed.length; i++) {
						vm.ids.push(vm.displayed[i].pid)
					}
				} else {
					vm.ids = [];
				}
			}
			vm.checkThis = function (item, $event) {
				if ($($event.currentTarget).is(':checked')) {
					vm.ids.push(item.pid);

				} else {
					vm.ids = baseService.removeAry(vm.ids, item.pid);
				}
			}
			vm.showProgramOrSchedule = function (item) {
				if (vm.showType == 1) {
					if (item.cmdCode == 24 || item.cmdCode == 25) {
						item.id = item.pid;
						baseService.showSchedule(item, 2, chartService);

					} else {
						item.pStatus = 1;
						baseService.showProgram(item);
					}
				} else {
					if (item.stype && item.stype == 1) {
						item.id = item.pid;
						baseService.showSchedule(item, 2, chartService);

					} else {
						item.pStatus = 1;
						baseService.showProgram(item);
					}
				}


			}
		})
	}
	$scope.dealAbnormal = function (item) {
		modalService.confirmDialog(540, '处理异常终端', item, '/static/tpl/dealAbnormal.html', function (vm, ngDialog) {
			baseService.saveForm(vm, baseService.api.terminal + 'sendCommand', {
					tids: item.id,
					command: 9
				},
				(res) => {
					if (res) {
						ngDialog.close();
						modalService.alert('处理成功', 'success');
						$scope.initPage();
					}

				});
		})
	}
}

terminalManageController.$inject = ['$scope', '$rootScope', '$stateParams', '$filter', 'baseService', 'modalService', 'leafService', 'chartService'];

export default angular => {
	return angular.module('terminalManageModule', []).controller('terminalManageController', terminalManageController);
}
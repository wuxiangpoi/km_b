import config from '../../configs/config'
import hex_md5 from '../libs/md5.js'

const baseService = (httpService, modalService, $rootScope, $state, programService) => {
    let apiUrl = config.host;
    return {
        api: {
            apiUrl: apiUrl,
            auth: apiUrl + '/api/auth/',
            group: apiUrl + '/api/group/',
            led: apiUrl + '/api/led/',
            ledPage: apiUrl + '/api/ledPage/',
            material: apiUrl + '/api/material/',
            program: apiUrl + '/api/program/',
            terminal: apiUrl + '/api/terminal/',
            program: apiUrl + '/api/program/',
            programCmd: apiUrl + '/api/programCmd/',
            terminalCmd: apiUrl + '/api/terminalCmd/',
            role: apiUrl + '/api/role/',
            user: apiUrl + '/api/user/',
            organization: apiUrl + '/api/organization/',
            terminalReport: apiUrl + '/api/terminalReport/',
            installUser: apiUrl + '/api/installUser/',
            schedule: apiUrl + '/api/schedule/',
            programSchedule: apiUrl + '/api/programSchedule/',
            termialRegReport: apiUrl + '/api/termialRegReport/'
        },
        md5_pwd(pwd) {
            var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7',
                '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'
            ];
            var enStr = hex_md5(pwd + "dmbd!@#$%^&*");
            var str = '';
            for (var i = 0; i < enStr.length; i++) {
                for (var j = 0; j < hexDigits.length; j++) {
                    if (hexDigits[j] == enStr.charAt(i)) {
                        j = j + 1;
                        str += hexDigits[j == hexDigits.length ? 0 : j];
                    }
                }
            }
            return str;

        },
        goToState(state, params) {
            $state.go(state, params)
        },
        isRealNum(val) {
            // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
            if (val === "" || val == null) {
                return false;
            }
            if (!isNaN(val)) {
                return true;
            } else {
                return false;
            }
        },
        initTable($scope, tableState, url, cb) {
            $scope.isLoading = true;
            $scope.tableState = tableState;
            var pagination = tableState.pagination;

            var start = pagination.start || 0;
            var num = $scope.sp.length;
            $scope.sp.start = start;
            this.getJson(url, $scope.sp, function (result) {
                $scope.displayed = result.data;
                num = num || $rootScope.paginationNumber[0];
                tableState.pagination.number = num;
                tableState.pagination.totalItemCount = result.recordsTotal;
                tableState.pagination.numberOfPages = Math.ceil(result.recordsTotal / num);
                $scope.isLoading = false;
                if (cb) {
                    cb(result);
                }
            })
        },
        getJson(url, requestData, cb) {
            let me = this;
            httpService.getJson(url, requestData)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 1) {
                        cb(data.content);
                    } else if (data.code == 2) {
                        me.goToState('login');
                    } else {
                        modalService.alert(data.message, 'warning');
                    }
                })
                .catch((err) => {
                    if (err) {
                        modalService.alert('网络或服务端异常', 'warning')
                    }
                })
        },
        postData(url, formData, cb) {
            let me = this;
            httpService.postData(url, formData)
                .then((res) => {
                    let data = res.data;
                    if (data.code == 1) {
                        if (data.content) {
                            cb(data.content);
                        } else {
                            cb(data)
                        }
                    } else if (data.code == 2) {
                        me.goToState('login');
                        return false;
                    } else {
                        modalService.alert(data.message, 'warning');
                        cb();
                        return false;
                    }
                })
                .catch((err) => {
                    if (err) {
                        modalService.alert('网络或服务端异常', 'warning')
                        if(cb){
                            cb();
                        }
                    }
                })
        },
        removeAry(aObj, val) {
            var nArr = [];
            for (var i = 0; i < aObj.length; i++) {
                if (aObj[i] != val) {
                    nArr.push(aObj[i]);
                }
            }
            return nArr;
        },
        removeAryId(aObj, val) {
            var nArr = [];
            for (var i = 0; i < aObj.length; i++) {
                if (aObj[i].id != val) {
                    nArr.push(aObj[i]);
                }
            }
            return nArr;
        },
        checkAll($event, vm) {
            vm.ids = [];
            if ($($event.currentTarget).is(':checked')) {
                for (var i = 0; i < vm.displayed.length; i++) {
                    vm.ids.push(vm.displayed[i].id)
                }
            } else {
                vm.ids = [];
            }
        },
        checkThis(item, $event, vm) {
            if ($($event.currentTarget).is(':checked')) {
                vm.ids.push(item.id);

            } else {
                vm.ids = this.removeAry(vm.ids, item.id);
            }
        },
        trim(str, is_global) {
            var result;
            result = str.replace(/(^\s+)|(\s+$)/g, "");
            if (is_global.toLowerCase() == "g") {
                result = result.replace(/\s/g, "");
            }
            return result;
        },
        saveForm(scope, url, formData, cb) {
            scope.isPosting = true;
            this.postData(url, formData, (res) => {
                scope.isPosting = false;
                cb(res);
            })
        },
        showMaterial(item, detailType, cb) {
            let me = this;
            item.detailType = detailType;
            item.nUrl = $rootScope.dmbdOSSImageUrlResizeFilter(item.path, 400);
            modalService.confirmDialog(720, detailType == 0 ? '素材详情' : '素材审核', item, '/static/tpl/material_detail.html', (vm, ngDialog, type) => {
                let status = '';
                if (type == 1) {
                    status = 3;
                } else {
                    status = 4;
                }
                modalService.confirm('素材审核', "确定" + (type == 1 ? "通过" : "不通过") + "素材：" + item.name + "?", function (vm, ngDialog) {
                    me.saveForm(vm, me.api.material + 'materialCheck_check', {
                        id: item.id,
                        status: status
                    }, (res) => {
                        if (res) {
                            ngDialog.close();
                            modalService.alert('操作成功', 'success');
                            cb();
                        }

                    });
                });
            }, (vm) => {
                vm.imgPreview = function (item) {
                    $rootScope.$broadcast('callImg', item, 1);
                }
            });

        },
        showProgram(item, detailType, cb) {
            let me = this;
            programService.getProgramById(item.pid, function (program) {
                program.detailType = detailType;
                modalService.confirmDialog(750, '节目预览', program, "/static/tpl/program_details.html", function (vm, ngDialog, type) {
                    let status, url;
                    if (item.status == 2) {
                        type == 1 ? status = 6 : status = 4;
                        url = me.api.program + 'check';
                    } else {
                        type == 1 ? status = 3 : status = 7;
                        url = me.api.program + 'checkFinal';
                    }
                    modalService.confirm('素材审核', "确定" + (type == 1 ? "通过" : "不通过") + "节目：" + item.name + "?", function (vm, ngDialog) {
                        me.saveForm(vm, url, {
                            id: item.id,
                            status: status
                        }, (res) => {
                            if (res) {
                                ngDialog.close();
                                modalService.alert('操作成功', 'success');
                                cb();
                            }

                        });
                    });
                }, function (vm) {
                    vm.program = program;
                    vm.programPreview = function (program) {
                        $rootScope.$broadcast('callImg', program, 2);
                    }
                });
            });

        },
        showSchedule(item, detailType, chartService, cb) {
            let me = this;
            this.postData(this.api.programSchedule + 'getProgramScheduleById', {
                id: item.id
            }, function (schedule) {
                schedule.detailType = detailType;
                modalService.confirmDialog(750, '排期详情', schedule, "/static/tpl/schedule_details.html", function (vm, ngDialog, type) {
                    modalService.confirm('排期审核', "确定" + (type == 1 ? "通过" : "不通过") + "排期：" + item.name + "?", function (vm, ngDialog) {
                        let status;
                        if (type == 1) {
                            status = 1;
                        } else {
                            status = 4;
                        }
                        me.saveForm(vm, me.api.apiUrl + '/api/programScheduleCheck/checkProgramSchedule', {
                            id: item.id,
                            status: status
                        }, function (res) {
                            if (res) {
                                ngDialog.close();
                                modalService.alert('操作成功', 'success');
                                cb();
                            }

                        });
                    });
                }, function (vm) {
                    vm.playList = [];
                    for (var i = 0; i < schedule.programs.length; i++) {
                        var chartItem = {
                            id: schedule.programs[i].id,
                            name: schedule.programs[i].name,
                            size: schedule.programs[i].size,
                            materials: schedule.programs[i].materials,
                            duration: schedule.programs[i].duration,
                            content: schedule.programs[i].content,
                            startDate: schedule.programs[i].startDate.toString(),
                            endDate: schedule.programs[i].endDate.toString(),
                            stype: schedule.programs[i].stype
                        };
                        if (schedule.programs[i].stype == 1) {
                            chartItem.startTime = schedule.programs[i].startTime;
                            chartItem.endTime = schedule.programs[i].endTime;
                            chartItem.plays = schedule.programs[i].plays;
                        }
                        vm.playList.push(chartItem);
                        var minLen = 12;
                        if (vm.playList.length > minLen) {
                            minLen = vm.playList.length;
                        }
                        vm.chartStyle = {
                            height: minLen * 30 + 30 + 'px',
                            width: '719px'
                        }
                    }
                    vm.showProgram = function (item) {
                        item.pid = item.id;
                        item.pStatus = 1;
                        me.showProgram(item);
                    }
                    vm.eoption = chartService.initChartSchedule(vm.playList, minLen);
                });
            })
        }
    };
}

baseService.$inject = ['httpService', 'modalService', '$rootScope', '$state', 'programService'];

export default app => {
    app.factory('baseService', baseService)
}
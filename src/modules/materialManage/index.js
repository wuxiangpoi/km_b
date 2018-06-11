import './style.less';
import {
    materialsTypeOptions
} from '../../filter/options.js'

const materialManageController = ($rootScope, $scope, $filter, baseService, modalService, FileUploader, leafService) => {
    $scope.displayed = [];
    $scope.sp = {};
    $scope.tableState = {};
    $scope.ids = [];
    $scope.idsNoSubmitCheck = [];
    $scope.materialsTypeOptions = materialsTypeOptions;
    $scope.materialOptions = $filter('rootCheckStatus')();
    $scope.leafes = [];
    $scope.sp.oid = $rootScope.rootGroup.id;
    $scope.currentLeaf = {};
    $scope.currentLeaf.id = '';
    $scope.sp.gid = '';
    $scope.getTerminalGroups = function (oid) {
        leafService.getLeafes(baseService.api.material + 'getMaterialGroups', oid, function (data) {
            $scope.leafes = data;
        })
    }
    $scope.getTerminalGroups($scope.sp.oid);
    $scope.checkAll = function ($event) {
        $scope.ids = [];
        $scope.idsNoSubmitCheck = [];
        if ($($event.currentTarget).is(':checked')) {
            for (var i = 0; i < $scope.displayed.length; i++) {
                $scope.ids.push($scope.displayed[i].id)
                if ($scope.displayed[i].status == 0) {
                    $scope.idsNoSubmitCheck.push($scope.displayed[i].id)
                }
            }
        } else {
            $scope.ids = [];
            $scope.idsNoSubmitCheck = [];
        }
    }
    $scope.checkThis = function (item, $event) {
        if ($($event.currentTarget).is(':checked')) {
            $scope.ids.push(item.id);
            if (item.status == 0) {
                $scope.idsNoSubmitCheck.push(item.id);
            }
        } else {
            $scope.ids = baseService.removeAry($scope.ids, item.id);
            $scope.idsNoSubmitCheck = baseService.removeAry($scope.idsNoSubmitCheck, item.id);
        }
    }
    $scope.callServer = function (tableState, page) {
        if (baseService.isRealNum(page)) {
            $scope.tableState.pagination.start = page * $scope.sp.length;
        }
        baseService.initTable($scope, tableState, baseService.api.material + 'getMaterialList');
    }
    $scope.initPage = function () {
        $scope.ids = [];
        $scope.callServer($scope.tableState, 0)
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
    $scope.showMaterial = function (item) {
        baseService.showMaterial(item, 0);
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
                leafService.editLeaf(baseService.api.material + 'optGroupSave', {
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
        leafService.delLeaf(baseService.api.material + 'optGroupDel', item, function () {
            $scope.getTerminalGroups($scope.sp.oid);
            $scope.currentLeaf = {};
            $scope.currentLeaf.id = '';
            $scope.sp.gid = '';
            $scope.callServer($scope.tableState);
        })

    }
    $scope.setGroup = function () {
        var gids = $scope.ids.join(',');
        leafService.setGroup(baseService.api.material + 'setOrganization', gids, function () {
            $scope.getTerminalGroups($scope.sp.oid);
            $scope.initPage();
        })
    }
    $scope.addGroup = function () {
        leafService.addGroup(baseService.api.material + 'optGroupSave', $scope.sp.oid, function () {
            $scope.getTerminalGroups($scope.sp.oid);
        })
    }
    $scope.setGroup = function () {
        var gids = $scope.ids.join(',');
        leafService.setGroup(baseService.api.material + 'setOrganization', gids, function () {
            $scope.getTerminalGroups($scope.sp.oid);
            $scope.initPage();
        })
    }
    $scope.setLeaf = function () {
        var gids = $scope.ids.join(',');
        leafService.setLeaf(baseService.api.material + 'setGroupRelations', $scope.sp.oid, gids, $scope.leafes, function () {
            $scope.initPage();
        })
    }
    $scope.cancelLeaf = function () {
        var gids = $scope.ids.join(',');
        leafService.cancelLeaf(baseService.api.material + 'setGroupRelations', gids, $scope.currentLeaf, function () {
            $scope.initPage();
        })
    }
    $scope.save = function () {
        modalService.confirmDialog(720, '添加素材', {
            showTip: true
        }, '/static/tpl/material_save.html', function (vm) {
            if (vm.uploader.queue.length) {
                var filenameArray = [];
                for (var i = 0; i < vm.uploader.queue.length; i++) {
                    filenameArray.push(vm.uploader.queue[i].file.desc);
                }
                baseService.saveForm(vm, baseService.api.material + 'addMaterial_checkUpload', {
                    filenameArray: JSON.stringify(filenameArray)
                }, function (res) {
                    if (res) {
                        if (res.length) {
                            for (var i = 0; i < res.length; i++) {
                                vm.uploader.queue[res[i].index].message = res[i].message;
                                vm.uploader.queue[res[i].index].oname = res[i].name;
                            }
                        } else {
                            vm.closeThisDialog();
                            $rootScope.$broadcast('callUploader', vm.uploader);
                        }

                    }
                })


            } else {
                modalService.alert('请先选择文件', 'warning');
            }
        }, function (vm) {

            vm.sp = {};
            vm.sp.oid = '';
            vm.currentGroup = $rootScope.rootGroup;
            vm.sp.oid = vm.currentGroup.id;
            vm.$on('emitGroupLeaf', function (e, group, leaf) {
                if (vm.sp.oid != group.id) {
                    vm.currentGroup = group;
                }

            });

            var uploader = vm.uploader = new FileUploader();

            // FILTERS

            vm.uploader.filters.push({
                name: 'customFilter',
                fn: function fn(item /*{File|FileLikeObject}*/ , options) {

                    if (this.queue.length >= 10) {
                        modalService.alert('上传队列达到最大值10个', 'warining', true);
                        return false;
                    }

                    var ctype = item.name.substr(item.name.lastIndexOf('.') + 1).toLowerCase();
                    var type = ',' + ctype + ',';
                    //var file_type = vm.data.type == '0' ? $rootScope.getRootDicNameStrs('image_format') : $rootScope.getRootDicNameStrs('video_format');
                    var imgfile_type = vm.imgfile_type = $rootScope.getRootDicNameStrs('image_format');
                    var videofile_type = vm.videofile_type = $rootScope.getRootDicNameStrs('video_format');
                    var audiofile_type = ',mp3,';
                    if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + videofile_type.toLowerCase() + ',').indexOf(type) != -1 || (',' + audiofile_type.toLowerCase() + ',').indexOf(type) != -1) {
                        if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1) {
                            if (item.size > 10 * 1024 * 1024) {
                                modalService.alert('不得上传大于10Mb的图片', 'warning');
                            } else {
                                return true;
                            }
                        } else if ((',' + audiofile_type.toLowerCase() + ',').indexOf(type) != -1) {
                            if (item.size > 10 * 1024 * 1024) {
                                modalService.alert('不得上传大于10Mb的音乐', 'warning');
                            } else {
                                return true;
                            }
                        } else {
                            if (item.size > 500 * 1024 * 1024) {
                                modalService.alert('不得上传大于500Mb的视频', 'warning');
                            } else {
                                return true;
                            }
                        }
                    } else {
                        modalService.confirmAlert('提示', '上传的文件格式平台暂时不支持，目前支持的图片格式是:' + imgfile_type + '，目前支持的视频格式是:' + videofile_type + '，目前支持的音频格式是:mp3', 'warning');
                        return false;
                    }
                }
            });

            vm.uploader.onAfterAddingFile = function (fileItem) {
                var fileName = fileItem.file.name.split('.');
                fileName.pop();
                fileItem.file.desc = fileName.join(',');
            };

            vm.uploader.onCompleteItem = function (fileItem, response, status, headers) {
                if (response) {
                    if (response.code != 1) {
                        fileItem.isSuccess = false;
                        fileItem.isError = true;
                        fileItem.errorMsg = response.message;
                    } else {
                        $scope.initPage();
                    }

                }
            };
        });
    };
    $scope.saveName = function (item) {
        var modalData = {
            name: item.name
        }
        modalService.confirmDialog(540, '编辑', modalData, '/static/tpl/material_saveName.html', function (vm) {
            if (vm.modalForm.$valid) {
                baseService.saveForm(vm, baseService.api.material + 'saveMaterial', {
                    id: item.id,
                    name: vm.data.name
                }, function (res) {
                    if (res) {
                        vm.closeThisDialog();
                        $scope.initPage();
                        modalService.alert(item ? '修改成功' : '添加成功', 'success');
                    }

                })

            } else {
                vm.isShowMessage = true;
            }
        });
    }
    $scope.submitCheck = (item) => {
        modalService.confirm('提交', '是否提交素材?', (vm, ngDialog) => {
            var s = '';
            if (item) {
                s = item.id;
            } else {
                s = $scope.idsNoSubmitCheck.length ? $scope.idsNoSubmitCheck.join(',') : ''
            }
            if (s == '') {
                ngDialog.close();
                modalService.alert('提交成功', 'success');
                $scope.ids = [];
                $scope.idsNoSubmitCheck = [];
            } else {
                baseService.saveForm(vm, baseService.api.material + 'sumbmitCheck', {
                    id: s
                }, (res) => {
                    if (res) {
                        modalService.alert('提交成功', 'success');
                        ngDialog.close();
                        $scope.callServer($scope.tableState, 0);
                        $scope.ids = [];
                        $scope.idsNoSubmitCheck = [];
                    }

                })
            }

        })
    }
    $scope.del = (item) => {
        modalService.confirm('删除素材', "确定删除素材：" + item.name + "?", (vm) => {
            baseService.saveForm(vm, baseService.api.material + 'delMaterial', {
                id: item.id
            }, (res) => {
                if (res) {
                    modalService.alert('删除成功', 'success');
                    vm.closeThisDialog();
                    $scope.callServer($scope.tableState, 0);
                }

            })
        })
    }
}

materialManageController.$inject = ['$rootScope', '$scope', '$filter', 'baseService', 'modalService', 'FileUploader', 'leafService'];

export default angular => {
    return angular.module('materialManageModule', []).controller('materialManageController', materialManageController);
}
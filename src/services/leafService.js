const leafService = (modalService, baseService) => {
    return {
        getLeafes: function (url, oid, cb) {
            baseService.getJson(url, {
                oid: oid
            }, function (data) {
                cb(data);
            })
        },
        addGroup: function (url, oid, cb) {
            modalService.confirmDialog(540, '添加分组', {}, '/static/tpl/group_add.html', function (vm, ngDialog) {
                if (vm.modalForm.$valid) {
                    baseService.saveForm(vm, url, {
                        oid: oid,
                        name: vm.name
                    }, (res) => {
                        if (res) {
                            ngDialog.close();
                            modalService.alert('添加成功','success');
                            cb();
                        }
                    })
                    vm.isPosting = true;
                } else {
                    vm.isShowMessage = true;
                }
            })
        },
        setGroup: function (url, ids, cb) {
            modalService.confirmDialog(540, '设置所属机构', {}, '/static/tpl/set_organization.html', function (vm,ngDialog) {
                vm.isPosting = true;
                baseService.saveForm(vm,url, {
                    oid: vm.oid,
                    ids: ids
                }, (res) => {
                    if (res) {
                        ngDialog.close();
                        modalService.alert('设置成功','success');
                        cb();
                    }
                });
            }, function (vm) {
                vm.$on('emitGroupLeaf', function (e, group, leaf) {
                    vm.oid = group.id;
                });
            });
        },
        setLeaf: function (url, oid, rids, leafes, cb) {
            var modalData = {
                leafes: leafes,
                isSet: true
            };
            if (leafes.length) {
                modalService.confirmDialog(450, '设置分组', modalData, '/static/tpl/set_leafes.html', function (vm,ngDialog) {
                    var gids = '';
                    var boxes = $("input[name='ckLeafes']");
                    boxes.each(function () {
                        if (this.checked) {
                            gids += "," + $(this).attr('value');
                        }

                    });
                    if (!gids) {
                        modalService.alert('请选择分组', 'warning', true);
                        return;
                    }
                    baseService.saveForm(vm,url, {
                        set: 1,
                        oid: oid,
                        gids: gids,
                        rids: rids
                    }, (res) => {
                        if (res) {
                            ngDialog.close();
                            modalService.alert('设置成功','success');
                            cb();
                        }
                    })
                })
            } else {
                modalService.alert('请先添加分组', 'warning');
            }

        },
        cancelLeaf: function (url, rids, currentLeaf, cb) {
            var modalData = {
                isSet: false,
                currentLeaf: currentLeaf
            };
            modalService.confirmDialog(450, '取消分组', modalData, '/static/tpl/set_leafes.html', function (vm,ngDialog) {
                var gids = '';
                var val = $("input[name='cancelLeafes']:checked").val();
                if (val == 1) {
                    gids = currentLeaf.id;
                }
                baseService.saveForm(vm,url, {
                    set: 0,
                    gids: gids,
                    rids: rids
                }, (res) => {
                    if(res){
                        ngDialog.close();
                        modalService.alert('设置成功','success');
                        cb();
                    }
                })
            })
        },
        delLeaf: function (url, item, cb) {
            modalService.confirm('删除分组', '确定删除分组：' + item.name + '?', function (vm,ngDialog) {
                baseService.saveForm(vm,url, {
                    id: item.id
                }, (res) => {
                    ngDialog.close();
                    if(res){
                        modalService.alert('删除成功', 'success');
                        cb();
                    }
                    
                })

            })
        },
        editLeaf: function (url, editData, cb, errCb) {
            baseService.postData(url, editData, (res) => {
                if(res){
                    cb();
                }else{
                    errCb();
                }
            })
        }
    };

}

leafService.$inject = ['modalService', 'baseService'];

export default app => {
    app.factory('leafService', leafService)
}
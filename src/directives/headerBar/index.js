import template from './template.html';
import './style.less';

let controller = ($scope,$rootScope, baseService, modalService) => {
    let postData = {
        password: '',
        newPassword: '',
        reNewPassword: ''
    }
    $scope.colorArr = ['#00a0e9', '#ffb039', '#ff4040'];
    baseService.getJson(baseService.api.auth + 'getUserMessage', {}, function (data) {
        $rootScope.userMessage = [];
        $rootScope.materialCheckCounts = data.materialCheckCounts
        $rootScope.programCheckCounts = data.programCheckCounts
        $rootScope.programScheduleCheckCounts = data.programScheduleCheckCounts
        if (data.materialCheckCounts && data.materialCheckCounts != 0) {
            $rootScope.userMessage.push({
                name: 'materialCheck',
                value: data.materialCheckCounts
            });
        }
        if (data.programCheckCounts && data.programCheckCounts != 0) {
            $rootScope.userMessage.push({
                name: 'programCheck',
                value: data.programCheckCounts
            });
        }
        if (data.programScheduleCheckCounts && data.programScheduleCheckCounts != 0) {
            $rootScope.userMessage.push({
                name: 'scheduleCheck',
                value: data.programScheduleCheckCounts
            });
        }
        $rootScope.domainMessage = data.domainMessage;
    })
    $scope.updatePwd = function () {
        modalService.confirmDialog(540, '修改密码', {}, 'static/tpl/update_password.html', function (vm, ngDialog) {
            if (vm.modalForm.$valid && vm.data.newPassword == vm.data.reNewPassword) {
                let updpostData = {
                    password: baseService.md5_pwd(vm.data.password),
                    newPassword: baseService.md5_pwd(vm.data.newPassword),
                    reNewPassword: baseService.md5_pwd(vm.data.reNewPassword)
                }
                baseService.saveForm(vm, baseService.api.auth + 'updatePwd', updpostData, (res) => {
                    if (res) {
                        ngDialog.close();
                        modalService.alert('修改成功', 'success');
                    }
                })
            } else {
                vm.isShowMessage = true;
            }
        })
    }
    $scope.updateLogo = function(){
        modalService.confirmDialog(540, '修改Logo', {
            info: '(支持jpg,png,jpeg,bmp格式的图片，不超过5M)'
        }, 'static/tpl/update_logo.html', function (vm, ngDialog) {
            vm.$broadcast('uploadImg',() => {});
        })
    }
    $scope.logout = function () {
        modalService.confirm('退出', '是否退出登录？', (vm) => {
            vm.isPosting = true;
            baseService.postData(baseService.api.auth + 'logout', {}, (res) => {
                vm.isPosting = false;
                if (res) {
                    vm.closeThisDialog();
                    baseService.goToState('login');
                }
            })
        })

    }
    $scope.toggleFullwidth = function () {
        $('body').toggleClass('mini-navbar');
    }
}
controller.$inject = ['$scope', '$rootScope','baseService', 'modalService'];

export default app => {
    app.directive('headerBar', () => {
        return {
            restrict: 'E',
            replace: true,
            template: template,
            controller: controller
        }
    })
};
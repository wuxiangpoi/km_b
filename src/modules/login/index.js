const loginController = ($scope, $rootScope, baseService) => {
    $scope.domain = '';
    $scope.account = '';
    $scope.password = '';
    $scope.isRemembered = true;
    $scope.isShowMessage = false;
    if ($.cookie('user_cookie') && $.cookie('user_cookie').length != 4) {
        let cookiesData = JSON.parse($.cookie('user_cookie'));
        $scope.domain = cookiesData.domain;
        $scope.account = cookiesData.account;
        $scope.password = cookiesData.password;
    }

    $scope.login = function () {
        if ($scope.loginForm.$valid) {
            let postData = {
                domain: $scope.domain,
                account: $scope.account,
                password: baseService.md5_pwd($scope.password)
            }
            baseService.saveForm($scope, baseService.api.auth + 'login', postData, (res) => {
                if (res) {
                    if ($scope.isRemembered) {
                        $.cookie('user_cookie', JSON.stringify({
                            domain: $scope.domain,
                            account: $scope.account,
                            password: $scope.password
                        }), {
                            expires: 30
                        });
                    } else {
                        $.cookie('user_cookie', null);
                    }
                    baseService.getJson(baseService.api.auth + 'getUserSrc', {},function (userData) {
                        $rootScope.userData = userData;
                        $rootScope.root_programReslotions = userData.root_programReslotions;
                        for (var i = 0; i < userData.root_organizations.length; i++) {
                            if (userData.root_organizations[i].pid == '') {
                                $rootScope.rootGroup = userData.root_organizations[i];
                            }
                        }
                        baseService.goToState('dashboard.home');                        
                    });
                }
            })
        } else {
            $scope.isShowMessage = true;
        }

    }

}

loginController.$inject = ['$scope', '$rootScope', 'baseService'];

export default angular => {
    return angular.module('loginModule', []).controller('loginController', loginController);
}
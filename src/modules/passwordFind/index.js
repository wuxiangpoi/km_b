import './style.less';

const passwordFindController = ($scope, baseService, modalService,$interval) => {
	$scope.step = 1;
	$scope.isSend = false;
	$scope.countdown = 60;
	$scope.data = {
		email: '',
		yanz: '',
		newPassword1: '',
		newPassword: ''
	}
	$scope.nextStep = function () {
		switch ($scope.step) {
			case 1:
				if ($scope.mailForm.$valid) {
					baseService.postData(baseService.api.apiUrl + '/client/user/checkResetPasswordCodeByEmail', {
						email: $scope.data.email,
						code: $scope.data.yanz
					}, function (res) {
						if (res) {
							$scope.step += 1;
						}
					})
				} else {
					$scope.isShowMessage = true;
				}
				break;
			case 2:
				if ($scope.psd_form.$valid && $scope.data.newPassword == $scope.data.newPassword1) {
					baseService.postData(baseService.api.apiUrl + '/client/user/resetAdminPasswordByEmail', {
						email: $scope.data.email,
						code: $scope.data.yanz,
						newPassword: baseService.md5_pwd($scope.data.newPassword)
					}, function (res) {
						if (res) {
							$scope.step += 1;
						}
					})
				} else {
					$scope.isShowMessage = true;
				}
				break;

		}
	}
	$scope.sendYz = function () {
		if ($scope.isSend) {
			return;
		} else {
			if ($scope.data.email != '') {
				var testEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (testEmail.test($scope.data.email)) {
					var countdownInter = $interval(function () {
						if ($scope.countdown <= 0) {
							$scope.isSend = false;
							$scope.countdown = 60;
							$interval.cancel(countdownInter);
						} else {
							$scope.countdown--;
						}
					}, 1000)

					baseService.getJson(baseService.api.apiUrl + '/client/user/getResetPasswordCode', {
						email: $scope.data.email
					}, function (res) {
						if (res) {
							$scope.isSend = true;
							countdownInter;
						}

					})
				} else {
					modalService.alert('请输入正确邮箱', 'warning', true);
				}

			} else {
				modalService.alert('请先输入邮箱', 'warning', true);
			}
		}
	}

}

passwordFindController.$inject = ['$scope', 'baseService', 'modalService','$interval'];

export default angular => {
	return angular.module('passwordFindModule', []).controller('passwordFindController', passwordFindController);
}
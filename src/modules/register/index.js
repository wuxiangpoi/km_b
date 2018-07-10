import './style.less';

const registerController = ($scope, baseService, modalService, $interval) => {
	$scope.step = 1;
	$scope.data = {
		name: '',
		contact: '',
		phone: '',
		email: ''
	}
	$scope.submit = function () {
		if ($scope.modalForm.$valid) {
			baseService.saveForm($scope, baseService.api.role + 'saveRole', $scope.data, function (res) {
				if (res) {
					$scope.step = 2;
				}
			})
		} else {
			$scope.isShowMessage = true;
		}
	}
	$scope.showAgreeMent = () => {
		modalService.confirmDialog(540, '快媒数字智能营销传播系统——用户协议', {
			set: 1,
			con: `本协议是使用快媒数字科技有限公司智能营销传播系统平台的用户（以下简称“用户”或“您”）与快媒数字科技有限公司（以下简称“快媒公司”）就本平台的使用等相关事宜所签订的协议，请用户详细阅读本协议，依据《中华人民共和国合同法》《中华人民共和国电信条例》《互联网信息服务管理办法》等相关法律法规的规定，本协议即构成合法有效、对双方具有约束力的法律文件。`
		}, '/static/tpl/text_only.html', (vm) => {

		})
	}
}

registerController.$inject = ['$scope', 'baseService', 'modalService', '$interval'];

export default angular => {
	return angular.module('registerModule', []).controller('registerController', registerController);
}
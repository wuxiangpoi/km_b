export default app => {
    app.directive('eChart', ['$window',($window) => {
        let controller = ($scope, element, attrs) => {
            var myChart = echarts.init(element[0]);
            $scope.$watch(attrs['eoption'], function () {
                var option = $scope.eoption;
                if (angular.isObject(option)) {

                    myChart.setOption(option);
                    $window.addEventListener('resize', function () {
                        myChart.resize();
                    })
                    myChart.resize();
                }
            }, true);
            attrs.$observe('eData', function () {
                var option = $scope.$eval(attrs.eData);
                if (angular.isObject(option)) {
                    myChart.setOption(option);
                    $window.addEventListener('resize', function () {
                        myChart.resize();
                    })
                    myChart.resize();
                }
            }, true);
            $scope.getDom = function () {
                return {
                    'height': element[0].style.height,
                    'width': element[0].offsetWidth
                };
            };
            $scope.$watch($scope.getDom, function () {
                myChart.resize();
            }, true);
        }

        return {
            restrict: 'AE',
            replace: true,
            scope: {
                eoption: '=',
                height: '@',
                width: '@'
            },
            link: controller
        };
    }])
};
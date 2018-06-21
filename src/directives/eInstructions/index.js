import template from './template.html'
import './style.less';

export default app => {
    app.directive('eInstructions', ['baseService', '$rootScope', (baseService, $rootScope) => {
        let link = ($scope, element, attrs) => {
            attrs.$observe('instructions', function () { //通过$observe监听attrs中绑定的option属性，可以通过ajax请求数据，动态更新图表。
                var option = attrs.instructions;

            }, true);
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link
        }
    }])
};
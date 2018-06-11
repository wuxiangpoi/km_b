import angular from 'angular';
import './style.less'

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state('help', {
            url: '/help',
            controller: function ($state) {
                if ($state.current.name == 'help') {
                    $state.go('help.guide')
                }
            },
            templateUrl: '/static/tpl/help.html',
        })
        .state('help.guide', {
            url: '/guide',
            templateUrl: '/static/tpl/guide.html',
        })
        .state('help.statement', {
            url: '/statement',
            templateUrl: '/static/tpl/statement.html',
        })
        .state('help.agreement', {
            url: '/agreement',
            templateUrl: '/static/tpl/agreement.html',
        })
        .state('help.partner', {
            url: '/partner',
            templateUrl: '/static/tpl/partner.html',
        })
        .state('help.aboutus', {
            url: '/aboutus',
            templateUrl: '/static/tpl/aboutus.html',
        })
    }])
}
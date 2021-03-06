import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalLoginReport',
            url: '/terminalLoginReport',
            template: require('./template.html'),
            info: '终端注册统计',
            controller: 'terminalLoginReportController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalLoginReportModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalLoginReportModule'
                            });
                            resolve(terminalLoginReportModule);
                        });
                    })
                }]
            }
        });
    }])
}
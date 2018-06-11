import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalPlayReport',
            url: '/terminalPlayReport',
            template: require('./template.html'),
            info: '终端播放统计',
            controller: 'terminalPlayReportController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalPlayReportModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalPlayReportModule'
                            });
                            resolve(terminalPlayReportModule);
                        });
                    })
                }]
            }
        });
    }])
}
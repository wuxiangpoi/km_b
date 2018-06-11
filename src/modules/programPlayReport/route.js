import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.programPlayReport',
            url: '/programPlayReport/{pos}',
            template: require('./template.html'),
            info: '终端播放统计',
            controller: 'programPlayReportController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let programPlayReportModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'programPlayReportModule'
                            });
                            resolve(programPlayReportModule);
                        });
                    })
                }]
            }
        });
    }])
}
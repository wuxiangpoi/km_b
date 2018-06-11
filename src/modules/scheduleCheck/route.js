import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.scheduleCheck',
            url: '/scheduleCheck',
            params: {
                "pos": null
            },
            info: '节目管理',
            template: require('./template.html'),
            controller: 'scheduleCheckController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let scheduleCheckModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'scheduleCheckModule'
                            });
                            resolve(scheduleCheckModule);
                        });
                    })
                }]
            }
        });
    }])
}
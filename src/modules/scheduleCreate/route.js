import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.scheduleCreate',
            url: '/scheduleCreate/{type}/{pos}/{id}',
            params: {
                "pos": null
            },
            info: '节目管理',
            template: require('./template.html'),
            controller: 'scheduleCreateController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let scheduleCreateModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'scheduleCreateModule'
                            });
                            resolve(scheduleCreateModule);
                        });
                    })
                }]
            }
        });
    }])
}
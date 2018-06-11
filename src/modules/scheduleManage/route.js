import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.scheduleManage',
            url: '/scheduleManage',
            params: {
                "pos": null
            },
            info: '节目管理',
            template: require('./template.html'),
            controller: 'scheduleManageController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let scheduleManageModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'scheduleManageModule'
                            });
                            resolve(scheduleManageModule);
                        });
                    })
                }]
            }
        });
    }])
}
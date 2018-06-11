import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.programManage',
            url: '/programManage',
            info: '节目管理',
            template: require('./template.html'),
            controller: 'programManageController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let programManageModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'programManageModule'
                            });
                            resolve(programManageModule);
                        });
                    })
                }]
            }
        });
    }])
}
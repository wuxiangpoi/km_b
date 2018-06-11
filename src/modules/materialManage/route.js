import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.materialManage',
            url: '/materialManage',
            template: require('./template.html'),
            info: '模板管理|素材管理',
            controller: 'materialManageController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let materialManageModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'materialManageModule'
                            });
                            resolve(materialManageModule);
                        });
                    })
                }]
            }
        });
    }])
}
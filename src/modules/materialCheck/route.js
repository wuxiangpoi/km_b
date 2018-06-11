import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.materialCheck',
            url: '/materialCheck',
            template: require('./template.html'),
            info: '模板管理|素材管理',
            controller: 'materialCheckController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let materialCheckModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'materialCheckModule'
                            });
                            resolve(materialCheckModule);
                        });
                    })
                }]
            }
        });
    }])
}
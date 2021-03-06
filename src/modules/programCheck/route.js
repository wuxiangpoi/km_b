import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.programCheck',
            url: '/programCheck',
            info: '节目管理',
            template: require('./template.html'),
            controller: 'programCheckController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let programCheckModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'programCheckModule'
                            });
                            resolve(programCheckModule);
                        });
                    })
                }]
            }
        });
    }])
}
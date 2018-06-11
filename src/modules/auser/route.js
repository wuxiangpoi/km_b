import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.auser',
            url: '/auser',
            template: require('./template.html'),
            info: '账户管理|账号管理',
            controller: 'auserController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let auserModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'auserModule'
                            });
                            resolve(auserModule);
                        });
                    })
                }]
            }
        });
    }])
}
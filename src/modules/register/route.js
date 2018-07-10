import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'register',
            url: '/register',
            template: require('./template.html'),
            info: '账户注册',
            controller: 'registerController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let registerModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'registerModule'
                            });
                            resolve(registerModule);
                        });
                    })
                }]
            }
        });
    }])
}
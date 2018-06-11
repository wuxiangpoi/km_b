import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'passwordFind',
            url: '/passwordFind',
            template: require('./template.html'),
            info: '账户管理|账号管理',
            controller: 'passwordFindController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let passwordFindModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'passwordFindModule'
                            });
                            resolve(passwordFindModule);
                        });
                    })
                }]
            }
        });
    }])
}
import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.program',
            url: '/program',
            info: '节目管理',
            template: require('./template.html'),
            controller: 'programController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let programModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'programModule'
                            });
                            resolve(programModule);
                        });
                    })
                }]
            }
        });
    }])
}
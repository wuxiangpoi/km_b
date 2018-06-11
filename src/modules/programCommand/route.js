import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.programCommand',
            url: '/programCommand',
            template: require('./template.html'),
            info: '操作日志',
            controller: 'programCommandController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let programCommandModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'programCommandModule'
                            });
                            resolve(programCommandModule);
                        });
                    })
                }]
            }
        });
    }])
}
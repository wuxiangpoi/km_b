import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.led',
            url: '/led',
            template: require('./template.html'),
            info: '操作日志',
            controller: 'ledController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let ledModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'ledModule'
                            });
                            resolve(ledModule);
                        });
                    })
                }]
            }
        });
    }])
}
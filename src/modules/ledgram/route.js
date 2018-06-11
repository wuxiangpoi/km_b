import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.ledgram',
            url: '/ledgram',
            template: require('./template.html'),
            info: '操作日志',
            controller: 'ledgramController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let ledgramModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'ledgramModule'
                            });
                            resolve(ledgramModule);
                        });
                    })
                }]
            }
        });
    }])
}
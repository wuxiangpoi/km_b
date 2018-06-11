import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalCommand',
            url: '/terminalCommand',
            template: require('./template.html'),
            info: '操作日志',
            controller: 'terminalcommandController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalcommandModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalcommandModule'
                            });
                            resolve(terminalcommandModule);
                        });
                    })
                }]
            }
        });
    }])
}
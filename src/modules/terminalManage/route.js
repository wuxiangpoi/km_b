import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.terminalManage',
            url: '/terminalManage',
            params: {
                "status": null
            },
            info: '终端管理',
            template: require('./template.html'),
            controller: 'terminalManageController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let terminalManageModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'terminalManageModule'
                            });
                            resolve(terminalManageModule);
                        });
                    })
                }]
            }
        });
    }])
}
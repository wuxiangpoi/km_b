import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.group',
            url: '/group',
            template: require('./template.html'),
            info: '组织机构',
            controller: 'groupController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let groupModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'groupModule'
                            });
                            resolve(groupModule);
                        });
                    })
                }]
            }
        });
    }])
}
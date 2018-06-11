import angular from 'angular';

export default app => {
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        
        $stateProvider.state({
            name: 'dashboard.programPlayDetail',
            url: '/programPlayDetail/{id}/{name}/{month}/{pos}',
            template: require('./template.html'),
            info: '终端播放统计',
            controller: 'programPlayDetailController',
            resolve: {
                '': ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q(resolve => {
                        require.ensure([], () => {
                            let programPlayDetailModule = require('./index.js').default(angular);
                            $ocLazyLoad.load({
                                name: 'programPlayDetailModule'
                            });
                            resolve(programPlayDetailModule);
                        });
                    })
                }]
            }
        });
    }])
}
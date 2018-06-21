import template from './template.html';
import style from './style.less';

let controller = ($rootScope, $scope, $state, baseService) => {
    $scope.collapseVar = '';
    $scope.state = '';
    $scope.ledShowPerms = function () {
        if ($rootScope.userData.ledShow != 0) {

            if ($rootScope.perms(71) || $rootScope.perms(72)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    $scope.menuList = [{
        name: '首页',
        auth: true,
        collapseVar: 0,
        state: 'dashboard.home',
        states: ['dashboard.home'],
        icon: 'iconfont icon-shouye'
    }, {
        name: '终端管理',
        auth: $rootScope.perms(21),
        collapseVar: 21,
        icon: 'iconfont icon-zhongduanguanli',
        state: 'dashboard.terminalManage',
        states: ['dashboard.terminalManage'],
    }, {
        name: '素材管理',
        auth: $rootScope.perms(41),
        collapseVar: 41,
        state: 'dashboard.materialManage',
        states: ['dashboard.materialManage'],
        icon: 'iconfont icon-neirongguanli'
    }, {
        name: '节目管理',
        auth: $rootScope.perms(43),
        collapseVar: 43,
        state: 'dashboard.programManage',
        states: ['dashboard.programManage'],
        icon: 'iconfont icon-jiemuguanli'
    }, {
        name: '排期管理',
        auth: $rootScope.perms(44),
        collapseVar: 44,
        state: 'dashboard.scheduleManage',
        states: ['dashboard.scheduleManage'],
        icon: 'iconfont icon-paiqiguanli'
    }, {
        name: '审核管理',
        auth: $rootScope.perms(5),
        collapseVar: 5,
        state: '',
        states: ['dashboard.materialCheck', 'dashboard.programCheck', 'dashboard.scheduleCheck'],
        icon: 'iconfont icon-shenheguanli',
        children: [{
                name: '素材审核',
                auth: $rootScope.perms(51),
                collapseVar: 5,
                state: 'dashboard.materialCheck',
                icon: ''
            },
            {
                name: '节目审核',
                auth: $rootScope.perms(53),
                collapseVar: 5,
                state: 'dashboard.programCheck',
                icon: ''
            },
            {
                name: '排期审核',
                auth: $rootScope.perms(54),
                collapseVar: 5,
                state: 'dashboard.scheduleCheck',
                icon: ''
            }
        ]
    }, {
        name: '账户管理',
        auth: $rootScope.perms(3),
        collapseVar: 3,
        state: '',
        states: ['dashboard.group', 'dashboard.user', 'dashboard.role', 'dashboard.auser'],
        icon: 'iconfont icon-zhanghuguanli',
        children: [{
                name: '组织机构',
                auth: $rootScope.perms(31),
                collapseVar: 3,
                state: 'dashboard.group',
                icon: ''
            }, {
                name: '账号管理',
                auth: $rootScope.perms(31),
                collapseVar: 3,
                state: 'dashboard.user',
                icon: ''
            },
            {
                name: '角色管理',
                auth: $rootScope.perms(32),
                collapseVar: 5,
                state: 'dashboard.role',
                icon: ''
            },
            {
                name: '安装人员',
                auth: $rootScope.perms(32),
                collapseVar: 5,
                state: 'dashboard.auser',
                icon: ''
            }
        ]
    }, {
        name: '数据统计',
        auth: $rootScope.perms(8),
        collapseVar: 8,
        state: '',
        states: ['dashboard.terminalLoginReport', 'dashboard.terminalPlayReport', 'dashboard.programPlayReport'],
        icon: 'iconfont icon-baobiaoguanli',
        children: [{
                name: '终端注册统计',
                auth: $rootScope.perms(81),
                collapseVar: 8,
                state: 'dashboard.terminalLoginReport',
                icon: ''
            }, {
                name: '终端播放统计',
                auth: $rootScope.perms(82),
                collapseVar: 8,
                state: 'dashboard.terminalPlayReport',
                icon: ''
            },
            {
                name: '节目播放统计',
                auth: $rootScope.perms(83),
                collapseVar: 8,
                state: 'dashboard.programPlayReport',
                icon: ''
            }
        ]
    }, {
        name: '日志记录',
        auth: $rootScope.perms(6),
        collapseVar: 6,
        state: '',
        states: ['dashboard.terminalCommand', 'dashboard.programCommand'],
        icon: 'icon iconfont icon-mobanguanli',
        children: [{
                name: '终端命令记录',
                auth: $rootScope.perms(61),
                collapseVar: 6,
                state: 'dashboard.terminalCommand',
                icon: ''
            },
            {
                name: '节目命令记录',
                auth: $rootScope.perms(62),
                collapseVar: 6,
                state: 'dashboard.programCommand',
                icon: ''
            }
        ]
    }, {
        name: '文字屏管理',
        auth: $scope.ledShowPerms(),
        collapseVar: 7,
        state: '',
        states: ['dashboard.led', 'dashboard.ledgram'],
        icon: 'icon iconfont icon-wenzipingguanliicon',
        children: [{
                name: '终端管理',
                auth: $rootScope.perms(71),
                collapseVar: 7,
                state: 'dashboard.led',
                icon: ''
            },
            {
                name: '内容管理',
                auth: $rootScope.perms(72),
                collapseVar: 7,
                state: 'dashboard.ledgram',
                icon: ''
            }
        ]
    }]

    $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
        $scope.state = toState.name;
        for (let i = 0; i < $scope.menuList.length; i++) {
            if ($scope.menuList[i].states.indexOf($scope.state) != -1) {
                $scope.collapseVar = $scope.menuList[i].collapseVar;
            }
        }
        if (toState.name == 'dashboard.templateAdd' || toState.name == 'dashboard.templateEdit' || toState.name == 'dashboard.programEdit' || toState.name == 'dashboard.programAdd' || toState.name == 'dashboard.programCopy') {
            $('body').addClass('mini-navbar');
        } else {
            if (fromState.name == 'dashboard.templateAdd' || fromState.name == 'dashboard.templateEdit' || fromState.name == 'dashboard.programEdit' || fromState.name == 'dashboard.programAdd' || fromState.name == 'dashboard.programCopy') {
                if ($('body').hasClass('mini-navbar')) {
                    $('body').removeClass('mini-navbar')
                }
            }
        }
    })
    $scope.progressBar = {
        width: $rootScope.userData.root_oss_percent + '%'
    }
    $scope.goToDetail = function (item) {
        baseService.goToState('dashboard.' + item.name)
        $scope.collapseVar = 5;
    }
    $scope.toggleMenu = (menu) => {
        if (menu.state != '') {
            baseService.goToState(menu.state);
        }
        if (menu.collapseVar == $scope.collapseVar)
            $scope.collapseVar = '';
        else {
            $scope.collapseVar = menu.collapseVar;
        }
    }
}
controller.$inject = ['$rootScope', '$scope', '$state', 'baseService'];

export default app => {
    app.directive('siderBar', () => {

        return {
            restrict: 'E',
            replace: true,
            template: template,
            controller: controller
        }
    })
};
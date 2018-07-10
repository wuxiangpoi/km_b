import login from './modules/login/route.js'
import help from './modules/help/route.js'
import register from './modules/register/route.js'
import passwordFind from './modules/passwordFind/route.js'
import errPage from './modules/errPage/route.js'
import dashboard from './modules/dashboard/route.js'
import home from './modules/home/route.js'
import terminalManage from './modules/terminalManage/route.js'
import programManage from './modules/programManage/route.js'
import scheduleManage from './modules/scheduleManage/route.js'
import scheduleCreate from './modules/scheduleCreate/route.js'
import materialCheck from './modules/materialCheck/route.js'
import programCheck from './modules/programCheck/route.js'
import scheduleCheck from './modules/scheduleCheck/route.js'
import group from './modules/group/route.js'
import user from './modules/user/route.js'
import role from './modules/role/route.js'
import auser from './modules/auser/route.js'
import terminalLoginReport from './modules/terminalLoginReport/route.js'
import terminalPlayReport from './modules/terminalPlayReport/route.js'
import programPlayReport from './modules/programPlayReport/route.js'
import programPlayDetail from './modules/programPlayDetail/route.js'
import materialManage from './modules/materialManage/route.js'
import terminalcommand from './modules/terminalcommand/route.js'
import programCommand from './modules/programCommand/route.js'
import led from './modules/led/route.js'
import ledgram from './modules/ledgram/route.js'

import programRouter from './modules/program/programRouter';
import templateRouter from './modules/template/templateRouter';


const states = [
    dashboard,
    help,
    register,
    passwordFind,
    login,
    errPage,
    home,
    terminalManage,
    programManage,
    scheduleManage,
    scheduleCreate,
    materialCheck,
    programCheck,
    scheduleCheck,
    group,
    user,
    role,
    auser,
    terminalLoginReport,
    terminalPlayReport,
    programPlayReport,
    programPlayDetail,
    materialManage,
    terminalcommand,
    programCommand,
    led,
    ledgram,
    
    programRouter,
    templateRouter
];

export default app => {
    states.forEach(state => {
        state(app);
    });
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', ($stateProvider, $urlRouterProvider, $controllerProvider) => {
        $urlRouterProvider.otherwise('/login');
    }]);
};
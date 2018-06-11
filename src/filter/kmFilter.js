import {terminalStatusOptions,scheduleStatusOptions,opOptions,programCmdStatusOptions} from './options';

export default app => {
    app.filter('secToTime',function(){
        return function(s){
            var t;
            if(s > -1){
                var hour = Math.floor(s/3600);
                var min = Math.floor(s/60) % 60;
                var sec = s % 60;
                if(hour < 10) {
                    t = '0'+ hour + ":";
                } else {
                    t = hour + ":";
                }
    
                if(min < 10){t += "0";}
                t += min + ":";
                if(sec < 10){t += "0";}
                t += sec.toFixed(0);
            }
            return t;
        }
            
    });
    app.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
    app.filter('fotmateDateNum', [function () {
        return function (num) {
            if (num < 10) {
                return '0' + num.toString();
            } else {
                return num.toString();
            }
        }
    }]);
    app.filter('getFirstorLastDay', [function () {
        return function (date,type) {
            var now = new Date(date);
            var year = now.getFullYear();
            var month = now.getMonth();
            var ft = new Date(year, month - 1, '01');
            ft.setDate(1);
            ft.setMonth(ft.getMonth() + 1);
            var dt = new Date(year, month - 1, '01');
            dt.setDate(1);
            dt.setMonth(dt.getMonth() + 2);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            if (type) {
                return ft;
            } else {
                return cdt;
            }
        }
    }]);
    app.filter('parseDayTime', [function () {
        return function (date) {
            return Date.parse(date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8));

        }
    }]);
    //OSS图片裁减
    app.filter('formateTime', ['$filter',function ($filter) {
        return function (date) {
            return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
        }
    }]);
    app.filter('formateDateTxt', function () {
        return function (date) {
            return date.substring(0, 4) + '年' + date.substring(4, 6) + '月' + date.substring(6, 8) + '日';

        }
    });
    app.filter('formateDate', function () {
        return function (date) {
            if (date) {
                return date.toString().substring(0, 4) + '-' + date.toString().substring(4, 6) + '-' + date.toString().substring(6, 8);
            } else {
                return ''
            }
        }
    });
    app.filter('formateMinate', function () {
        return function (date) {
            if (date) {
                return date.substring(0, 5);
            } else {
                return ''
            }
        }
    });
    //OSS图片裁减
    app.filter('play_url', ['$sce',function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    }]);
    app.filter('rootCheckStatus', ['$rootScope',function ($rootScope) {
        return function () {
            let rootCheckStatus = [{
                name: '素材状态',
                val: ''
            }];
            for(let i = 0; i < $rootScope.userData.root_checkStatus.length; i ++){
                rootCheckStatus.push({
                    name: $rootScope.userData.root_checkStatus[i].name,
                    val: $rootScope.userData.root_checkStatus[i].val
                })
            }
            return rootCheckStatus;
        }
    }]);
    app.filter('terminalRootCitys', ['$rootScope',function ($rootScope) {
        return function () {
            let terminalRootCitys = [{
                name: '所在城市',
                val: ''
            }];
            for(let i = 0; i < $rootScope.userData.root_citys.length; i ++){
                terminalRootCitys.push({
                    name: $rootScope.userData.root_citys[i].value,
                    val: $rootScope.userData.root_citys[i].key
                })
            }
            return terminalRootCitys;
        }
    }]);
    app.filter('rootCheckStatusProgram', ['$rootScope',function ($rootScope) {
        return function () {
            let rootCheckStatusProgram = [{
                name: '审核状态',
                val: ''
            }];
            for(let i = 0; i < $rootScope.userData.root_checkStatusProgram.length; i ++){
                rootCheckStatusProgram.push({
                    name: $rootScope.userData.root_checkStatusProgram[i].name,
                    val: $rootScope.userData.root_checkStatusProgram[i].val
                })
            }
            return rootCheckStatusProgram;
        }
    }]);
    app.filter('rootProgramReslotions', ['$rootScope',function ($rootScope) {
        return function () {
            let rootProgramReslotions = [{
                name: '节目分辨率',
                val: ''
            }];
            for(let i = 0; i < $rootScope.userData.root_programReslotions.length; i ++){
                rootProgramReslotions.push({
                    name: $rootScope.userData.root_programReslotions[i],
                    val: $rootScope.userData.root_programReslotions[i]
                })
            }
            return rootProgramReslotions;
        }
    }]);
    app.filter('terminalResolutionOptions', ['$rootScope',function ($rootScope) {
        return function () {
            let terminalResolution = [{
                name: '屏幕分辨率',
                val: ''
            }];
            for(let i = 0; i < $rootScope.userData.root_terminalReslotions.length; i ++){
                terminalResolution.push({
                    name: $rootScope.userData.root_terminalReslotions[i],
                    val: $rootScope.userData.root_terminalReslotions[i]
                })
            }
            return terminalResolution;
        }
    }]);
    app.filter('getOrganizations', ['$rootScope',function ($rootScope) {
        return function (oid) {
            var groups = $rootScope.userData.root_organizations;
            var cName = '';
            var finalName = [];

            function findParent(data) {
                if (data.pid == '') {
                    return finalName.reverse().push(cName);
                } else {

                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].id == data.pid) {
                            finalName.push(groups[i].name)
                            if (groups[i].pid == '') {
                                return finalName.reverse().push(cName);
                            } else {
                                findParent(groups[i]);
                            }
                        }
                    }
                }
            }
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].id == oid) {
                    cName = groups[i].name;
                    findParent(groups[i]);
                }
            }
            return finalName.join('>');
        }
    }]);
    app.filter('opOptionsTxt', function () {
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < opOptions.length; i++) {
                if (opOptions[i].val == status) {
                    statusTxt = opOptions[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('getCityName', function ($rootScope) {
        return function (cno) {
            let cName = '';
            for (var i in $rootScope.userData.root_citys) {
                if ($rootScope.userData.root_citys.hasOwnProperty(i)) {

                    if (cno == $rootScope.userData.root_citys[i].key) {
                        cName = $rootScope.userData.root_citys[i].value;
                    }

                }
            }
            return cName;
        }
    });
    app.filter('scheduleStatusTxt', function () {
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < scheduleStatusOptions.length; i++) {
                if (scheduleStatusOptions[i].val == status) {
                    statusTxt = scheduleStatusOptions[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('cmdCodeTxt', function () {
        var cmdCodeStatus = [{
                name: '节目下发',
                val: 21
            },
            {
                name: '节目停播',
                val: 22
            },
            {
                name: '排期下发',
                val: 24
            },
            {
                name: '排期停播',
                val: 25
            }

        ];
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < cmdCodeStatus.length; i++) {
                if (cmdCodeStatus[i].val == status) {
                    statusTxt = cmdCodeStatus[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('getProgramCmdCode', function () {
        return function (cmdCode) {
            var statusTxt = '';
            for (var i = 0; i < programCmdStatusOptions.length; i++) {
                if (programCmdStatusOptions[i].val == cmdCode) {
                    statusTxt = programCmdStatusOptions[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('programStatusTxt', function () {
        var programStatus = [{
                name: '待提交审核',
                val: 0,
                color: 'grey'
            },
            {
                name: '审核通过',
                val: 1,
                color: '#5cb85c'
            },
            {
                name: '内部初审中',
                val: 2,
                color: 'blue'
            },
            {
                name: '平台审核中',
                val: 3,
                color: 'blue'
            },
            {
                name: '内部审核不通过',
                val: 4,
                color: '#d9534f'
            },
            {
                name: '平台审核不通过',
                val: 5,
                color: '#d9534f'
            },
            {
                name: '内部终审中',
                val: 6,
                color: '#d9534f'
            },
            {
                name: '内部终审不通过',
                val: 7,
                color: 'grey'
            }

        ];
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < programStatus.length; i++) {
                if (programStatus[i].val == status) {
                    statusTxt = programStatus[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('materialStatusTxt', function () {
        var materialStatus = [{
                name: '待提交审核',
                val: 0,
                color: 'grey'
            },
            {
                name: '审核通过',
                val: 1,
                color: '#5cb85c'
            },
            {
                name: '内部审核中',
                val: 2,
                color: 'blue'
            },
            {
                name: '平台审核中',
                val: 3,
                color: 'blue'
            },
            {
                name: '内部审核不通过',
                val: 4,
                color: '#d9534f'
            },
            {
                name: '平台审核不通过',
                val: 5,
                color: '#d9534f'
            },
            {
                name: '转码失败',
                val: 6,
                color: '#d9534f'
            },
            {
                name: '转码中',
                val: 7,
                color: 'grey'
            }

        ];
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < materialStatus.length; i++) {
                if (materialStatus[i].val == status) {
                    statusTxt = materialStatus[i].name;
                }
            }
            return statusTxt;
        };
    });
    app.filter('terminalStatusTxt', () => {
        return function (status) {
            var statusTxt = '';
            for (var i = 0; i < terminalStatusOptions.length; i++) {
                if (terminalStatusOptions[i].val == status) {
                    statusTxt = terminalStatusOptions[i].name;
                }
            }
            return statusTxt;
        };
    }),
    //尺寸过滤器(文件体积，显示GB、MB、KB等)
    app.filter('dmbdResourceSizeFilter', function () {
        return function (size) {
            if (size < 1024) {
                return size + ' B';
            } else if (size < 1024 * 1024) {
                return (size / 1024).toFixed(2) + ' KB';
            } else if (size < 1024 * 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' MB';
            } else if (size < 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
            } else {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
            }
        };
    });

    function pading2(num) {
        return num < 10 ? '0' + num : num.toString(10);
    }

    //视频播放时长格式化过滤器
    app.filter('dmbdVideoTimeFormatFilter', function () {
        return function (seconds) {
            return pading2(Math.floor(seconds / 3600)) +
                ':' + pading2(Math.floor((seconds % 3600) / 60)) +
                ':' + pading2(seconds % 60);
        };
    });
}
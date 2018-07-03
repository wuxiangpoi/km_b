export let tempResolution = [{
    val: '',
    name: '屏幕分辨率'
},
{
    val: '1920*1080',
    name: '1920*1080'
},
{
    val: '1080*1920',
    name: '1080*1920'
},{
    val: '1366*768',
    name: '1366*768'
},
{
    val: '768*1366',
    name: '768*1366'
},{
    val: '1024*768',
    name: '1024*768'
},
{
    val: '768*1024',
    name: '768*1024'
}]
export let licenseOptions = [{
    val: '',
    name: '注册类型'
},
{
    val: 1,
    name: '有授权'
},
{
    val: 0,
    name: '无授权'
}
]
export let hasTerminalOptions = [{
    val: '',
    name: '发布状态'
},
{
    val: 1,
    name: '已发布'
},
{
    val: 0,
    name: '未发布'
}
]
export let hasProgramOptions = [{
        val: '',
        name: '节目状态'
    },
    {
        val: 1,
        name: '有节目'
    },
    {
        val: 0,
        name: '无节目'
    }
]
export let terminalStatusOptions = [{
        val: '',
        name: '终端状态'
    },
    {
        val: 1,
        name: '在线'
    },
    {
        val: 2,
        name: '离线'
    },
    {
        val: 3,
        name: '异常'
    }
]
export let opOptions = [{
        val: '',
        name: '系统类型'
    },
    {
        val: 1,
        name: 'android'
    },
    {
        val: 2,
        name: 'windows'
    },
]
export let materialsTypeOptions = [{
        val: '',
        name: '素材类型'
    },
    {
        val: 0,
        name: '图片'
    },
    {
        val: 1,
        name: '视频'
    },
    {
        val: 2,
        name: '音乐'
    },
    {
        val: 3,
        name: '互动包'
    }
]
export let sendStatusOptions = [{
        val: '',
        name: '下发状态'
    },
    {
        val: 0,
        name: '正在下发'
    },
    {
        val: 1,
        name: '下发成功'
    },
    {
        val: 2,
        name: '下发失败'
    }
]
export let programCmdStatusOptions = [{
    val: '',
    name: '命令状态'
},
{
    val: 3,
    name: '等待终端执行'
},
{
    val: 1,
    name: '下发成功'
},
{
    val: 2,
    name: '下发失败'
},
{
    val: 5,
    name: '正在下载'
},
{
    val: 4,
    name: '已取消'
}
]
export let cmdCodeOptions = [{
        val: '',
        name: '下发命令'
    },
    {
        val: 2,
        name: '工作时间设置',
        icon: 'fa fa-clock-o fa-fw'
    },
    {
        val: 3,
        name: '音量设置',
        icon: 'fa fa-volume-up fa-fw'
    },
    {
        val: 4,
        name: '远程重启',
        icon: 'fa fa-power-off fa-fw'
    },
    {
        val: 7,
        name: '终端截屏',
        icon: 'fa fa-camera fa-fw'
    },
    {
        val: 8,
        name: '获取终端信息',
        icon: 'fa fa-share fa-fw'
    }
]
export let materialTypeOptions = [{
        val: '',
        name: '审核类型'
    },
    {
        val: 0,
        name: '素材'
    },
    {
        val: 1,
        name: '节目'
    },
]
export let materialStatusOptions = [{
        val: '',
        name: '审核状态'
    },
    {
        val: 0,
        name: '待审核'
    },
    {
        val: 1,
        name: '审核通过'
    },
    {
        val: 5,
        name: '审核不通过'
    }
]
export let scheduleStatusOptions = [{
        val: '',
        name: '审核状态'
    },
    {
        name: '待提交审核',
        val: 0
    },
    {
        name: '审核通过',
        val: 1
    },
    {
        name: '审核中',
        val: 2
    },
    {
        name: '审核不通过',
        val: 4
    }
]
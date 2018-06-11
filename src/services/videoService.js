//转换播放时长
function transformDuration(durationStr) {
    var arr = durationStr.split(':');
    var arr2 = arr.map(function (item) {
        return window.parseInt(item, 10);
    });
    return arr2[0] * 3600 + arr2[1] * 60 + arr2[2];
}

function transformVideo(video) {
    return {
        ver: 1,
        path: video.path,
        name: video.name,
        duration: transformDuration(video.duration),
        size: video.size,
        bitrate: video.bitrate,
        mime: video.mime,
        ac: video.ac,
        vc: video.vc,
        width: video.width,
        height: video.height,
        createTime: video.createTime,
        url: video.url,
        snapshot: video.snapshot
    };
}

module.exports = function (app) {

    app.service('videoService', ['dmbdRest', function (dmbdRest) {

        this.converter = transformVideo;

        //获取列表
        this.getVideoList = function (data, success) {
            //var apiUrl = 'mock/video_list2.json';
            var apiUrl = '/api/material/getMaterialList4editor';
            return dmbdRest.get(apiUrl, {
                type: 1,
                oid: data.oid,
                gid: data.gid,
                search: data.search,
                start: data.pageSize * data.pageIndex,
                length: data.pageSize
            }, function (content) {
                var videos = content.data.map(function (video) {
                    return transformVideo(video);//转换数据为需要的格式
                });
                success(videos, content.recordsTotal);
            });
        };

    }]);

};
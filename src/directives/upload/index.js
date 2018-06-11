import template from './template.html';

import './style.less';

export default app => {
    app.directive('kmUpload', ['baseService', 'FileUploader','$rootScope', (baseService, FileUploader,$rootScope) => {
        let link = ($scope, element, attrs) => {
            $scope.isShow = false;
            $scope.isHide = false;
            $scope.uploader = new FileUploader();
            let beforeUpload = (item) => {
                var imgfile_type = $rootScope.getRootDicNameStrs('image_format');
                var videofile_type = $rootScope.getRootDicNameStrs('video_format');
                var host = '';
                var accessid = '';
                var policyBase64 = '';
                var signature = '';
                var callbackbody = '';
                var filename = '';
                var key = '';
                //	var	 expire = 0;
                var token = '';
                var ctype = item.file.name.substr(item.file.name.lastIndexOf('.') + 1).toLowerCase();
                var type = ',' + ctype + ',';
                var xType = '';
                if ((',' + imgfile_type.toLowerCase() + ',').indexOf(type) != -1) {
                    xType = 0;
                } else if ((',' + videofile_type.toLowerCase() + ',').indexOf(type) != -1) {
                    xType = 1;
                } else {
                    xType = 2;
                }
                baseService.postData(baseService.api.material + 'addMaterial_getOssSignature', {
                    type: xType
                }, function (obj) {
                    host = obj['host']
                    policyBase64 = obj['policy']
                    accessid = obj['accessid']
                    signature = obj['signature']
                    //	expire =obj['expire']
                    callbackbody = obj['callback']
                    key = obj['key']
                    token = obj['token']
                    //	$scope.uploader.url=host;
                    var filename = item.file.name;
                    if (item.file['desc']) {
                        filename = item.file.desc;
                    }
                    var new_multipart_params = {
                        'key': (key + item.file.name.substr(item.file.name.lastIndexOf('.'))),
                        'policy': policyBase64,
                        'OSSAccessKeyId': accessid,
                        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                        'callback': callbackbody,
                        'signature': signature,
                        'x:fname': filename,
                        'x:type': xType,
                        'x:gid': item.oid,
                        'x:opt': 0,
                        'x:token': token
                    };
                    item.formData = [new_multipart_params]; //上传前，添加描述文本
                    item.upload();
                });
            }
            $scope.isShowDialog = function (isShow) {
                $scope.isShow = isShow;
            }
            $scope.isHideDialog = function () {
                $scope.isHide = !$scope.isHide;
            }
            $scope.$on("callUploader", function (event, data) {
                $scope.uploader.queue = $scope.uploader.queue.concat(data.queue);
                $scope.isShow = true;
                for (let i = 0; i < data.queue.length; i++) {
                    let item = data.queue[i];
                    beforeUpload(item);
                }
            });
            $scope.removeItem = function (item, index, $event) {
                item.cancel();
                $scope.uploader.queue.splice(index, 1);
                $($event.currentTarget).parents('tr').remove();
            }
            $scope.uploader.onCompleteAll = function () {
                $scope.isShow = false;
            };
            $scope.upload = function (item) {
                beforeUpload(item);
            };
            $scope.uploadAll = function () {
                $scope.uploader.uploadAll();
            };
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link
        }
    }])
};
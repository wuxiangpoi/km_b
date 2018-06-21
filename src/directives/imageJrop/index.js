import template from './template.html';

import style from './style.less';

export default app => {
    app.directive('imageJrop', ['baseService', 'FileUploader', (baseService, FileUploader) => {
        let link = ($scope, element, attrs) => {
            $scope.uploader = new FileUploader();
            $scope.imgSrc = '';
            $scope.isJcrop = false;
            $scope.upload = false;
            //图片转换base64数据
            function base64data(file, clackFn) {
                if (file) {
                    var reader = new FileReader();
                    var params = $scope.$eval(file);
                    reader.onload = function (evt) {
                        clackFn(evt.target.result);
                    }
                    reader.readAsDataURL(file._file);
                } else { //兼容IE
                    modalService.alert('请切到高级浏览器,再进行图片上传', 'warning');
                }
            }

            function initCrop() {
                $('#jcropImg').cropper({
                    aspectRatio: 4 / 1,
                    viewMode: 2,
                    dragMode: 'move',
                    preview: '.imgPreview',
                    movable: true
                });
                $scope.isJcrop = true;
            }
            $scope.uploader.onAfterAddingFile = function (fileItem) {
                if($scope.upload){
                    baseService.postData(baseService.api.material + 'addMaterial_getOssSignature', {
                        type: 0
                    }, function (obj) {
                        var new_multipart_params = {
                            'key': (obj['key'] + item.file.name.substr(item.file.name.lastIndexOf('.'))),
                            'policy': obj['policy'],
                            'OSSAccessKeyId': obj['accessid'],
                            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                            'callback': obj['callback'],
                            'signature': obj['signature'],
                            'x:fname': filename,
                            'x:type': 0,
                            'x:gid': '',
                            'x:opt': 0,
                            'x:token': obj['token']
                        };
                        item.formData = [new_multipart_params]; //上传前，添加描述文本
                        //item.upload();
                    });
                }else{
                    base64data(fileItem, function (src) {
                        $scope.imgSrc = src;
                        $scope.uploader.queue = [];
                        $scope.$apply();
                        if ($scope.isJcrop) {
                            $('#jcropImg').cropper('destroy');
                            initCrop();
                        }else{
                            initCrop();
                        }
                    })
                }
                
            };
            $scope.$on('uploadImg',(e,data) => {
                let cas = $('#jcropImg').cropper('getCroppedCanvas');
                let base64url = cas.toDataURL('image/jpeg');
                cas.toBlob(function (blob) {
                    $scope.upload = true;
                    $scope.uploader.addToQueue(blob);
                })
            });
        }
        return {
            restrict: 'AE',
            replace: true,
            template: template,
            link: link
        }
    }])
};
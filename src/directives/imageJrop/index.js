import template from './template.html';

import style from './style.less';

export default app => {
    app.directive('imageJrop', ['baseService', 'FileUploader', (baseService, FileUploader) => {
        let link = ($scope, element, attrs) => {
            $scope.uploader = new FileUploader();
            $scope.imgSrc = '';
            $scope.isJcrop = false;
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
                console.log(fileItem._file)
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
            };
            $scope.$on('uploadImg',(e,data) => {
                let cas = $('#jcropImg').cropper('getCroppedCanvas');
                let base64url = cas.toDataURL('image/jpeg');
                cas.toBlob(function (e) {
                    $scope.uploader.addToQueue(e);
                    console.log(e);  //生成Blob的图片格式
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
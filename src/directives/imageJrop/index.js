import template from './template.html';

import style from './style.less';

export default app => {
    app.directive('imageJrop', ['baseService', 'FileUploader', (baseService, FileUploader) => {
        let link = ($scope, element, attrs) => {
            $scope.uploader = new FileUploader();
            $scope.imgSrc = '';
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
            $scope.uploader.onAfterAddingFile = function (fileItem) {
                base64data(fileItem,function(src){
                    $scope.imgSrc = src;
                    $scope.$apply();
                })
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
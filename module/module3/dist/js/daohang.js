var app = angular.module('myApp', [ ]);

app.controller('menu', function($scope, $http) {
 
    // 获取学科和课程数据
    $http.get(ip+"/DomainAPI/getDomainsBySubject").success(
        function(data) { 
            $scope.subjects = data;
            // console.log(data);
            var classSum = 0;
            // 切回导航页面时，读取现有课程并更新两个框的值
            for(i = 0; i < data.length; i++) {
                classSum = classSum + data[i].domains.length;
                if(data[i].subjectName == getCookie("NowSubject")) {
                    $scope.subject = data[i];
                    for(j = 0; j < data[i].domains.length; j++) {
                        if(data[i].domains[j].className == getCookie("NowClass")) {
                            $scope.domain = data[i].domains[j];
                        }
                    }
                }
            }
            $scope.subjectNum = data.length;
            $scope.classSum = classSum;
        }
    );

    $scope.change = function(){  
        //获取被选中的值  
        var chengeitem = $scope.domain.className;
        setCookie("NowClass", $scope.domain.className, "d1");
        setCookie("NowSubject", $scope.subject.subjectName, "d1");
    } 

})

$(document).ready(function(){
  
});
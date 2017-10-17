var app=angular.module('relationshipApp',[]);
app.controller("relationshipController",function($scope,$http){
    console.log('当前课程为：' + getCookie("NowClass"));
    $scope.NowClass = getCookie("NowClass");
});
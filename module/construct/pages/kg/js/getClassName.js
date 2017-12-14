var app=angular.module('kgApp',[]);
app.controller("kgController",function($scope,$http){
    console.log('当前课程为：' + getCookie("NowClass"));
    $scope.NowClass = getCookie("NowClass");
});
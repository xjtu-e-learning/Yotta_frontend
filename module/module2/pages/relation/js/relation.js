// 自适应程序
var zidingyi_height;
$(document).ready(function(){
 var header=$(".content-header").offset().top+$(".content-header").height()
 var footer=$(".main-footer").offset().top
 zidingyi_height=footer-header;
 // console.log(zidingyi_height);
 $("#relationClassDiv").css("height",zidingyi_height*0.1+"px");
 $("#relationInfoDiv").css("height",zidingyi_height*0.8+"px");
 $("#relationTreeDiv").css("height",zidingyi_height*0.8+"px");
})

var nowOperateClass;

var app=angular.module('myApp',[]);
app.controller('myCon',function($scope,$http){
    $http.get(ip+'/DependencyAPI/getDomain').success(function(response){
        $scope.subjects=response;
    });

    $scope.getDependence=function(){
        nowOperateClass=document.getElementById("nameofclass").value;

        $http({
            method:'GET',
            url:ip+"/DependencyAPI/getDependencyByDomain",
            params:{ClassName:nowOperateClass}
        }).then(function successCallback(response){
            $scope.dependences=response.data;
            $("#DependenceNum").text(nowOperateClass+"共有"+response.data.length+"条认知关系");
        }, function errorCallback(response){

        });

        $http({
            method:'GET',
            url:ip+"/DependencyAPI/getDomainTerm",
            params:{ClassName:nowOperateClass}
        }).then(function successCallback(response){
            $scope.topics=response.data;
        }, function errorCallback(response){

        });

        // $.ajax({
        //      type: "GET",
        //      url: ip+"/DependencyAPI/getDependencyByDomain",
        //      data: {ClassName:nowOperateClass},
        //      dataType: "json",
        //      async:false,
        //      success: function(data){
        //                  $scope.dependences=data;
        //                  $("#DependenceNum").text(nowOperateClass+"共有"+data.length+"条认知关系");
        //                  $scope.$apply();
        //               }
        //  });
        // $.ajax({
        //      type: "GET",
        //      url: ip+"/DependencyAPI/getDomainTerm",
        //      data: {ClassName:nowOperateClass},
        //      dataType: "json",
        //      async:false,
        //      success: function(data){
        //                  $scope.topics=data;
        //                  $scope.$apply();
        //               }
        //  });
    }

    $scope.deleteDependence=function(a,b){
        // console.log(a);
        // console.log(b);

        $http({
            method:'GET',
            url:ip+"/DependencyAPI/deleteDependence",
            params:{ClassName:nowOperateClass,StartID:a,EndID:b}
        }).then(function successCallback(response){
            alert(response.data.success);
            $scope.getDependence();
        }, function errorCallback(response){

        });

        // $.ajax({
        //      type: "GET",
        //      url: ip+"/DependencyAPI/deleteDependence",
        //      data: {ClassName:nowOperateClass,StartID:a,EndID:b},
        //      dataType: "json",
        //      async:false,
        //      success: function(data){
        //                  alert(data.success);
        //                   $scope.getDependence();
        //               }
        //  });
    }

    $scope.queryByKeyword=function(){

        $http({
            method:'GET',
            url:ip+"/DependencyAPI/getDependenceByKeyword",
            params:{ClassName:nowOperateClass,Keyword:$("input[name='chaxun']").val()}
        }).then(function successCallback(response){
            $scope.dependences=response.data;
        }, function errorCallback(response){

        });


        // $.ajax({
        //      type: "GET",
        //      url: ip+"/DependencyAPI/getDependenceByKeyword",
        //      data: {ClassName:nowOperateClass,Keyword:$("input[name='chaxun']").val()},
        //      dataType: "json",
        //      async:false,
        //      success: function(data){
        //         console.log(data);
        //         $scope.dependences=data;
        //               }
        //  });
    }

    $scope.addDependence=function(){

    var topic1=document.getElementById("Topic1").value;
    var topic2=document.getElementById("Topic2").value;

    $http({
            method:'GET',
            url:ip+"/DependencyAPI/createDependence",
            params:{ClassName:nowOperateClass,StartName:topic1,EndName:topic2}
        }).then(function successCallback(response){
            alert(response.data.success);
            $scope.getDependence();
        }, function errorCallback(response){

        });


    // $.ajax({
    //          type: "GET",
    //          url: ip+"/DependencyAPI/createDependence",
    //          data: {ClassName:nowOperateClass,StartName:topic1,EndName:topic2},
    //          dataType: "json",
    //          success: function(data){
    //             console.log(data);
    //                      alert(data.success);
    //                      $scope.getDependence();
    //                   }
    //      });
    

    }

});
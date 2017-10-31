// 自适应程序
var zidingyi_height
$(document).ready(function(){
           var header=$(".content-header").offset().top+$(".content-header").height()
            var footer=$(".main-footer").offset().top
           zidingyi_height=footer-header
           $("#div1").css("height",zidingyi_height*0.9+"px")
           $("#div2").css("height",zidingyi_height*0.9+"px")
           $("#div3").css("height",zidingyi_height*0.9+"px")
           $("#RightfacetTree").css("height",zidingyi_height*0.862+"px")
           console.log(zidingyi_height)
           console.log($("#div1").css("height"))

})


var app=angular.module('facetTreeApp',[]);
app.controller("facetTreeController",function($scope,$http){
    console.log('当前课程为：' + getCookie("NowClass"));
    $scope.NowClass = getCookie("NowClass");
    $http.get('http://'+ip+'/DomainTopicAPI/getDomainTopicAll?ClassName='+getCookie("NowClass")).success(function(response){
        $scope.topics=response;
        // $scope.fenmianshow(response[0].TermName);
        // $scope.Branch()
    });
    $scope.subjectName="字符串";
    $scope.treeFlag="trunk";
    $scope.fenmianshow=function(subjectName){
        console.log(subjectName);
        $scope.subjectName=subjectName;
        $.ajax({
                    type:"GET",
                    url:'http://'+ip+"/FacetAPI/getTopicFacet?ClassName="+getCookie("NowClass")+"&TermName="+subjectName,
                    data:{},
                    dataType:"json",
                    async:false,
                    success:function(data){
                        $scope.facets=data;
                        console.log(data);
                    }
                });

    }
    $scope.setBranch=function(){
         $scope.treeFlag="branch";
         $("#all-build-state").html("全部生成成功！");
    }
    $scope.BuildTrunkorBranch=function(){
        if($scope.treeFlag==="trunk"){
            ObtainTrunk($scope.subjectName);
        }
        else{
            $.ajax({
             type: "GET",
             url: 'http://'+ip+"/AssembleAPI/getTreeByTopic",
             data: {
                ClassName:getCookie("NowClass"),
                TermName:$scope.subjectName
             },
             dataType: "json",
             success: function(data){
                        DisplayBranch(data);
                     },
             error:function(XMLHttpRequest, textStatus, errorThrown){
                    //通常情况下textStatus和errorThrown只有其中一个包含信息
                    console.log(textStatus);
                    }
        });
        }
    }
    $scope.Branch=function(){
        $.ajax({
             type: "GET",
             url: 'http://'+ip+"/AssembleAPI/getTreeByTopic",
             data: {
                ClassName:getCookie("NowClass"),
                TermName:$scope.subjectName
             },
             dataType: "json",
             success: function(data){
                        DisplayBranch(data);
                     },
             error:function(XMLHttpRequest, textStatus, errorThrown){
                    //通常情况下textStatus和errorThrown只有其中一个包含信息
                    console.log(textStatus);
                    }
        });
    }
});

function important(div){
    $(".top").css("background","white");
    $(".top").css("color","black");
    console.log(div);
    div.style.background="#428bca";
    div.style.color="white";

var fenmian=document.getElementsByClassName("fenmian");
console.log(fenmian.length);
for(var i=0;i<fenmian.length;i++){
    var div=fenmian[i].getElementsByTagName("div");
console.log(div.length);
if(div.length==0){
    fenmian[i].style.display="none";
}
}
}


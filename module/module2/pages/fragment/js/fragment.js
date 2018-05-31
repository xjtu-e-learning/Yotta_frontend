// 自适应程序
var zidingyi_height;
$(document).ready(function(){
 var header=$(".content-header").offset().top+$(".content-header").height()
 var footer=$(".main-footer").offset().top
 zidingyi_height=footer-header;
 // console.log(zidingyi_height);
 $("#fragmentClassDiv").css("height",zidingyi_height*0.85+"px");
 $("#fragmentUnaddDiv").css("height",zidingyi_height*0.4+"px");
 $("#fragmentInfoDiv").css("height",zidingyi_height*0.4+"px");
})

var editor = new wangEditor('wang');
editor.config.uploadImgUrl = ip+'/SpiderAPI/createImageFragment';
editor.config.uploadImgFileName="imageContent";
editor.config.hideLinkImg = true;
editor.create();

var nowOperateClass;
var nowOperateTopic;
var nowOperateFacet1;
var nowOperateFacet2;

var modify_add_flag;
var now_modify_id;

var fragmentUrl;
var fragmentSource;

// var userinfo=getCookie('userinfo');
var username = getCookie('userinfo').slice(getCookie('userinfo').indexOf(':')+2,getCookie('userinfo').indexOf(',')-1);

function choosetype(){
    $("#fragmentModal").modal();
    modify_add_flag=0;
}

var app=angular.module('myApp',['ui.bootstrap','ngDraggable']);

app.controller('myCon',function($scope, $http, $sce){

    $http.get(ip+'/DomainAPI/getDomainManage').success(function(response){
        $scope.subjects=response;
        // console.log(nowOperateClass);
        $("#class_name").text(nowOperateClass);
        if(getCookie("NowFacetLayer")==1){
            $scope.getfacet1fragment(getCookie("NowClass"),getCookie("NowTopic"),getCookie("NowFacet"));

        }else if(getCookie("NowFacetLayer")==2){
            console.log(getCookie("NowFacet"));
            $scope.getfacet2fragment(getCookie("NowClass"),getCookie("NowTopic"),getCookie("NowFacet"));

        }else{
            $scope.getfacet3(getCookie("NowClass"),getCookie("NowTopic"),getCookie("NowFacet"));

        }
    });

    $http.get(ip+'/SpiderAPI/getFragment',{params:{"UserName":username}}).success(function(response){
        $scope.unaddfragments=response;
        $scope.getTopic(getCookie("NowClass"));
        for(var i=0;i<$scope.unaddfragments.length;i++){
            $scope.unaddfragments[i].FragmentContent=$sce.trustAsHtml($scope.unaddfragments[i].FragmentContent);
        }
    });

    $scope.isCollapsed = true;
    $scope.isCollapsedchildren = true;
    $scope.isCollapsedchildren2=true;

    $scope.getUnaddFragment=function(){
        $http.get(
            ip + '/SpiderAPI/getFragment',
            {
                params:{"UserName":username}
            }).success(function(response){
                $scope.unaddfragments = response;
                for(var i=0;i<$scope.unaddfragments.length;i++){
                    $scope.unaddfragments[i].FragmentContent=$sce.trustAsHtml($scope.unaddfragments[i].FragmentContent);
                }
            });  
    }


    $scope.dropFacetFragment=function(data,evt){
        // console.log(data.FragmentID);
        var str=$("#fragmenttopic").text();
        var arr=str.split(" ");
        if((arr.length!=3)||(arr[1]=="")||(arr[0]=="主题")){
            alert("添加无效");
        }
        else if(arr[0]=="一级分面"){
            $http({
                method:'GET',
                url:ip+"/SpiderAPI/addFacetFragment",
                params:{ClassName:nowOperateClass,TermName:nowOperateTopic,FacetName:arr[1],FacetLayer:1,FragmentID:data.FragmentID}
            }).then(function successCallback(response){
                alert("添加碎片成功");
                $scope.getfacet1fragment(nowOperateClass,nowOperateTopic,arr[1]);
                $scope.getUnaddFragment();
            }, function errorCallback(response){
                console.log(response);
                alert("添加碎片失败"); 
            });
        }
        else if(arr[0]=="二级分面"){
            $http({
                method:'GET',
                url:ip+"/SpiderAPI/addFacetFragment",
                params:{ClassName:nowOperateClass,TermName:nowOperateTopic,FacetName:arr[1],FacetLayer:2,FragmentID:data.FragmentID}
            }).then(function successCallback(response){
                alert("添加碎片成功");
                $scope.getfacet2fragment(nowOperateClass,nowOperateTopic,arr[1]);
                $scope.getUnaddFragment();
            }, function errorCallback(response){
                console.log(response);
                alert("添加碎片失败"); 
            });
        }
        else if(arr[0]=="三级分面"){
            $http({
                method:'GET',
                url:ip+"/SpiderAPI/addFacetFragment",
                params:{ClassName:nowOperateClass,TermName:nowOperateTopic,FacetName:arr[1],FacetLayer:3,FragmentID:data.FragmentID}
            }).then(function successCallback(response){
                alert("添加碎片成功");
                $scope.getfacet3(nowOperateClass,nowOperateTopic,arr[1]);
                $scope.getUnaddFragment();
            }, function errorCallback(response){
                console.log(response);
                alert("添加碎片失败"); 
            });
        }
        else{
            alert("添加无效");
        }
    }


    $scope.dragFragment = function(data, evt){
        // console.log("success");
    }

    $scope.addFrag = function(){

        fragmentUrl = document.getElementById("fragmentUrl").value;
        fragmentSource = document.getElementById("fragmentSource").value;

        var html = editor.$txt.html() + "";
        if(modify_add_flag == 0){
            console.log("addFragment");
            $http({
                method:'POST',
                url:ip+"/SpiderAPI/createFragment",
                data : $.param({
                    UserName: username,
                    FragmentContent: html,
                    FragmentUrl: fragmentUrl,
                    SourceName: fragmentSource,
                }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                alert("添加碎片成功");
                $scope.getUnaddFragment();
            }, function errorCallback(response){
                console.log(response);
                alert("添加碎片失败");
            });
        } else if(modify_add_flag == 1){
            console.log("modifyFragment_" + now_modify_id);
            $http({
                method:'POST',
                url:ip+"/SpiderAPI/updateFragment",
                data : $.param({
                    FragmentID: now_modify_id,
                    UserName: username,
                    FragmentContent: html,
                    FragmentUrl: fragmentUrl,
                    SourceName: fragmentSource,
                }),
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            }).then(function successCallback(response){
                alert("更新碎片成功");
                $scope.getUnaddFragment();
            }, function errorCallback(response){
                console.log(response);
                alert("更新碎片失败");
            });
        }

        
    }

    $scope.getInfo=function(){
        nowOperateClass = document.getElementById("nameofclass").value;
        $("#class_name").text(nowOperateClass);

        $http({
            method:'GET',
            url:ip+"/FacetAPI/getDomainInfo",
            params:{ClassName:nowOperateClass}
        }).then(function successCallback(response){
            $scope.classInfo=response.data;
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }



    $scope.getTopic=function(a){
        nowOperateClass=a;

        $http({
            method:'GET',
            url:ip+"/FacetAPI/getDomainInfo",
            params:{ClassName:nowOperateClass}
        }).then(function successCallback(response){
            $scope.classInfo=response.data;
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }


    $scope.gettopicfragment=function(a,b){
        nowOperateClass=a;
        nowOperateTopic=b;

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/getDomainTermFragment",
            params:{ClassName:a,TermName:b}
        }).then(function successCallback(response){
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].FragmentContent=$sce.trustAsHtml($scope.fragments[i].FragmentContent);
           }
           $("#fragmenttopic").text("主题 "+b+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }

    $scope.getfacet1fragment=function(a,b,c){
        nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet1=c;

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/getDomainTermFacet1Fragment",
            params:{ClassName:a,TermName:b,FacetName:c}
        }).then(function successCallback(response){
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].FragmentContent=$sce.trustAsHtml($scope.fragments[i].FragmentContent);
           }
           $("#fragmenttopic").text("一级分面 "+c+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }

    $scope.getfacet2fragment=function(a,b,c){
        nowOperateClass=a;
        nowOperateTopic=b;
        nowOperateFacet2=c;
        console.log(c);

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/getDomainTermFacet2Fragment",
            params:{ClassName:a,TermName:b,FacetName:c}
        }).then(function successCallback(response){
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].FragmentContent=$sce.trustAsHtml($scope.fragments[i].FragmentContent);
           }
           $("#fragmenttopic").text("二级分面 "+c+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }

    $scope.getfacet3=function(a,b,c){

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/getDomainTermFacet3Fragment",
            params:{ClassName:a,TermName:b,FacetName:c}
        }).then(function successCallback(response){
            $scope.fragments=response.data;
            for(var i=0;i<$scope.fragments.length;i++){
               $scope.fragments[i].FragmentContent=$sce.trustAsHtml($scope.fragments[i].FragmentContent);
           }
           $("#fragmenttopic").text("三级分面 "+c+" 下碎片");
           $("#topictree").text("主题 "+b+" 主题树");
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }

    $scope.modifyFragment = function(a){
        modify_add_flag=1;
        now_modify_id=a;
        $("#fragmentModal").modal();

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/getFragmentByID",
            params:{FragmentID:a}
        }).then(function successCallback(response){
            // console.log(response.data[0].FragmentContent);
            $("#wang").html(response.data[0].FragmentContent);
            $scope.fragmentUrlNg = response.data[0].FragmentUrl;
            $scope.fragmentSourceNg = response.data[0].SourceName;
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }

    $scope.deleteUnaddFragment=function(a){
        // console.log(a);

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/deleteUnaddFragment",
            params:{FragmentID:a}
        }).then(function successCallback(response){
            alert(response.data.success);
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }

    $scope.deleteFragment=function(a){

        $http({
            method:'GET',
            url:ip+"/SpiderAPI/deleteFragment",
            params:{FragmentID:a}
        }).then(function successCallback(response){
            $scope.getUnaddFragment();
            alert(response.data.success);
        }, function errorCallback(response){
            console.log(response);
            // alert("添加碎片失败");
        });
    }
});
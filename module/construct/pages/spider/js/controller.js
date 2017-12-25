// 自适应程序
var zidingyi_height
$(document).ready(function(){
           var header=$(".content-header").offset().top+$(".content-header").height()
            var footer=$(".main-footer").offset().top
           zidingyi_height=footer-header;
           // console.log(zidingyi_height);
           $("#guide").css("height",zidingyi_height*0.04+"px");
           $("#state").css("height",zidingyi_height*0.7+"px");
           $("#fragData").css("height",zidingyi_height*0.8+"px");
           $("#topic0").css("height",zidingyi_height*0.4+"px");
           // $("#fragDataContent").css("height",zidingyi_height*0.1+"px");
})

//根据所选主题从后台get碎片函数，主题多时需要时间长，提前执行下一函数会导致结果出错
//控制器，初始get所有主题，点击模态框的关闭时，通过上述函数get的碎片会绑定到前台
 var app=angular.module('myApp',[]);
 app.controller('myCon',function($scope,$http,$sce){

    console.log('当前课程为：' + getCookie("NowClass"));
    $scope.NowClass = getCookie("NowClass");

    $scope.getinfo=function(sourceName){
        $("#get").text("正在获取...");
        var num=0;//计算主题是否全选要用
        var checked_topics=[];
        var checked_topics1;
        quanju_imgnum=0;
        quanju_textnum=0;
        var topics=document.getElementsByName("subject");
        for(var j=0;j<topics.length;j++){
            if(topics[j].checked){
                checked_topics=checked_topics.concat(topics[j].value);
            }
        }

        checked_topicsArray=checked_topics.toString();
        // console.log(checked_topicsArray);

        // 根据是否选择数据源调用不同的api返回数据
        // console.log(sourceName);
        var url = ip + "/SpiderAPI/getFragmentByTopicArrayAndSource";
        var postData = $.param( {
            className:getCookie("NowClass"),
            topicNames:checked_topicsArray,
            sourceName:sourceName
        });
        if (typeof sourceName === "undefined") {
            // 没有选择数据源展示所有数据源的
            $("#fragmentSource").text("中文维基、知乎、百度知道、csdn");
            var url = ip + "/SpiderAPI/getFragmentByTopicArray";
            postData = $.param( {
                className:getCookie("NowClass"),
                topicNames:checked_topicsArray
            });
        }
        else{
            $("#fragmentSource").text(sourceName);
        }

        $.ajax({

            type: "POST",
            url: url,
            data: postData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},

            // type:"GET",
            // url:ip+'/SpiderAPI/getFragmentByTopicArray',
            // data:{className:getCookie("NowClass"),topicNames:checked_topicsArray},
            // dataType:"json",

            async:false,
            success:function(data){
                // console.log(data.length);
                $("#fragmentNum").text(data.length);
                $scope.fragments=data;
                for(var i=0;i<$scope.fragments.length;i++){
                    $scope.fragments[i].fragmentContent=$sce.trustAsHtml($scope.fragments[i].fragmentContent);
                }
            }
        });
        
        $("#get").text("确定");
    }

    $scope.getFragmentDetail=function(obj){
        // console.log(obj);
        $('#fragmentModel').modal('show');
        document.getElementById("fragmentModelContent").innerHTML=obj.fragmentContent;
    }
    
    $http.get(ip+'/DomainTopicAPI/getDomainTopicAll?ClassName='+getCookie("NowClass")).success(function(response){
        $scope.tops=response;
    });

    // 获取数据源
    $http.get(ip+'/SourceAPI/getSource').success(function(response){
        $scope.sources=response;
    });

 });
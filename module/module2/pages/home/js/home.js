// 自适应程序
var zidingyi_height;
$(document).ready(function(){
           var header=$(".content-header").height();
          var mainheader=$(".main-header").height();
          var footer=$(".main-footer").height();
          zidingyi_height=window.innerHeight-footer-header-mainheader;
           console.log(zidingyi_height);
           $("#classNumDiv").css("height",zidingyi_height*0.1+"px");
           $("#classInfoDiv").css("height",zidingyi_height*0.85+"px");
           $("#classAddDiv").css("height",zidingyi_height*0.2+"px");
           $("#classQueryDiv").css("height",zidingyi_height*0.54+"px");
           $("#Select_result").css("height",zidingyi_height*0.38+"px");
})





var app=angular.module('myApp',[]);
app.controller('myCon',function($scope,$http){
    $http.get(ip+'/DomainAPI/getDomainManage').success(function(response){
        $scope.kechengs=response;
    });
    $http.get(ip+'/DomainAPI/countClassNum').success(function(response){
        $('#ClassNum').text("系统中目前共有"+response.ClassNum+"门课程");
    });

    $scope.openModal=function(a){
        //console.log(a);
        nowOperateClass=a;
    }

 $scope.styleFuc=function(a){
    var length=(parseInt(a)/20).toFixed(2)+"%";
       // console.log(length);
        return {
            "width":length
        }
    }

    $scope.showClass=function(){
        $http({
            method:'GET',
            url:ip+"/DomainAPI/getDomainManage"
        }).then(function successCallback(response){
            //console.log(data);
            $scope.kechengs=response.data;
        }, function errorCallback(response){

        });
    
    }

    $scope.showNum=function(){
        $http({
            method:'GET',
            url:ip+"/DomainAPI/countClassNum"
        }).then(function successCallback(response){
            //console.log(response.data.ClassNum);
            $('#ClassNum').text("系统中目前共有"+response.data.ClassNum+"门课程");
        }, function errorCallback(data){

        });
    }

    $scope.tianjiaClass=function(){

    var newclass=$("#newclass").val();

    $http({
            method:'GET',
            url:ip+"/DomainAPI/createClass",
            params:{ClassName:$("input[name='ClassName']").val()}
        }).then(function successCallback(response){
            alert(response.data.success);
            $scope.showClass();
            $scope.showNum();
        }, function errorCallback(response){

        });
    console.log(newclass);

    }

    $scope.updataClassName=function(){
        $http({
            method:'GET',
            url:ip+"/DomainAPI/updateClassName",
            params:{ClassName:nowOperateClass,NewClassName:$("input[name='NewClassName']").val()}
        }).then(function successCallback(response){
            alert(response.data.success);
            $scope.showClass();
        }, function errorCallback(response){

        });
    }

    $scope.queryByKeyword=function(){
        $http({
            method:'GET',
            url:ip+"/DomainAPI/queryKeyword",
            params:{Keyword:$("input[name='KeyWord']").val()}
        }).then(function successCallback(response){
            var subjectArray=[];
            var topicArray=[];
            var facetArray=[];
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].Type=="Class"){

                    subjectArray.push(response.data[i]);
                }
                else if(response.data[i].Type=="Term"){
                    topicArray.push(response.data[i]);
                }
                else{
                    facetArray.push(response.data[i]);
                }
            }

            $scope.querysubjects=subjectArray;
            $scope.querytopics=topicArray;
            $scope.queryfacets=facetArray;
        }, function errorCallback(response){

        });
    }

    $scope.jumpClass=function(a){
       // console.log(a);
        var res=[];
        $http({
            method:'GET',
            url:ip+"/DomainAPI/getDomainManage"
        }).then(function successCallback(response){
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].ClassName==a){
                    res.push(response.data[i]);
                }
            }
            $scope.kechengs=res;
        }, function errorCallback(data){

        });

}

$scope.jumpTopic=function(a,b){
    setCookie("NowClass",a,"d900");
    setCookie("NowTopic",b,"d900");
    window.location="../topic/index.html";
}

$scope.jumpFacet=function(a,b,c,d){
    setCookie("NowClass",a,"d900");
    setCookie("NowTopic",b,"d900");
    setCookie("NowFacet",c,"d900");
    setCookie("NowFacetLayer",d,"d900");
    window.location="../facet/index.html";
}

    



    $scope.getDetailInfo=function(a){
        var nowOperateClass;
        var nowFirstFacetNum;
        var nowSecondFacetNum;
        var nowThirdFacetNum;
//        console.log(a);
        $http({
            method:'GET',
            url:ip+"/DomainAPI/getDomainManage"
        }).then(function successCallback(response){
           //console.log(response.data.length);
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].ClassName==a){
                    nowOperateClass=a;
                    nowFirstFacetNum=response.data[i].FirstFacetNum;
                    nowSecondFacetNum=response.data[i].SecondFacetNum;
                    nowThirdFacetNum=response.data[i].ThirdFacetNum;
                    
                    $("#"+a+"modal").modal();


                    var myChartFacet = echarts.init(document.getElementById(a+"FacetInfo"));

                    optionFacet = {

                        title : {
                            text:a+'各级分面统计结果',
                            x:'center'
                        },

                        color: ['steelblue'],
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            
                                type : 'shadow'        
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                        {
            //type : 'category',
            data : ['一级分面', '二级分面', '三级分面'],
            axisTick: {
                alignWithLabel: true
            }
        }
        ],
        yAxis : [
        {
            type : 'value',
            min:0
        }
        ],
        series : [
        {
            name:'数量',
            type:'bar',
            barWidth: '60%',
            data:[nowFirstFacetNum, nowSecondFacetNum,nowThirdFacetNum]
        }
        ]
    };
        // 使用刚指定的配置项和数据显示图表。
        myChartFacet.setOption(optionFacet);
                }
            }
        }, function errorCallback(response){

        });
    
}

    
});


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
 var app = angular.module('myApp',[]);
 app.controller('myCon',function($scope,$http,$sce){

    console.log('当前课程为：' + getCookie("NowClass"));
    $scope.NowClass = getCookie("NowClass");

    $scope.getinfo = function(sourceName) {
        $("#get").text("正在获取...");
        var num = 0;//计算主题是否全选要用
        var checked_topics = [];
        var checked_topics1;
        quanju_imgnum = 0;
        quanju_textnum = 0;
        var topics = document.getElementsByName("subject");
        for(var j = 0; j < topics.length; j++){
            if(topics[j].checked){
                checked_topics = checked_topics.concat(topics[j].value);
            }
        }

        checked_topicsArray = checked_topics.toString();
        // console.log(checked_topicsArray);

        // 根据是否选择数据源调用不同的api返回数据
        // console.log(sourceName);
        var url = ip + "/SpiderAPI/getFragmentByTopicArrayAndSource";
        var postData = $.param( {
            className:getCookie("NowClass"),
            topicNames:checked_topicsArray,
            sourceName:sourceName
        });
        // 词云图参数使用
        if (checked_topicsArray.length > 10) { // 设置显示的信息
          $scope.wordCloudInfo = "主题：" + checked_topicsArray.slice(0,10) + "...";
        } else {
          $scope.wordCloudInfo = "主题：" + checked_topicsArray;
        }
        var urlWord = ip + "/SpiderAPI/getWordcount";
        var postDataWord = $.param( {
            className:getCookie("NowClass"),
            topicNames:checked_topicsArray,
            sourceName:sourceName,
            hasSourceName:true
        });
        if (typeof sourceName === "undefined") {
            // 没有选择数据源展示所有数据源的
            $("#fragmentSource").text("中文维基、知乎、百度知道、csdn");
            var url = ip + "/SpiderAPI/getFragmentByTopicArray";
            postData = $.param( {
                className:getCookie("NowClass"),
                topicNames:checked_topicsArray
            });
            // 词云图参数使用
            postDataWord = $.param( {
                className:getCookie("NowClass"),
                topicNames:checked_topicsArray,
                sourceName:sourceName,
                hasSourceName:false
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
            async:false,
            success:function(data){
                // console.log(data.length);
                $("#fragmentNum").text(data.length);
                $scope.fragments=data;
                for(var i=0;i<$scope.fragments.length;i++){
                    $scope.fragments[i].fragmentContent = $sce.trustAsHtml($scope.fragments[i].fragmentContent);
                }
            }
        });

        // 词云图
        var chart = echarts.init(document.getElementById('cloudPic'));
        var keywords = {
            "visualMap": 22199,
        };
        // 词云图参数使用
        $.ajax({
            type: "POST",
            url: urlWord,
            data: postDataWord,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            async:false,
            success:function(data){
                keywords = data;
            }
        });
        var data = [];
        for (var name in keywords) {
          data.push({
              name: name,
              value: Math.sqrt(keywords[name])
          })
        }
        // console.log(keywords);
        var maskImage = new Image();
        var option = {
          series: [ {
              type: 'wordCloud',
              sizeRange: [10, 100],
              rotationRange: [-90, 90],
              rotationStep: 45,
              gridSize: 4,
              shape: 'pentagon',
              maskImage: maskImage,
              drawOutOfBound: false,
              textStyle: {
                  normal: {
                      color: function () {
                          return 'rgb(' + [
                              Math.round(Math.random() * 160),
                              Math.round(Math.random() * 160),
                              Math.round(Math.random() * 160)
                          ].join(',') + ')';
                      }
                  },
                  emphasis: {
                      color: 'red'
                  }
              },
              data: data.sort(function (a, b) {
                  return b.value  - a.value;
              })
          } ]
        };
        maskImage.onload = function () {
          option.series[0].maskImage
          chart.setOption(option);
        }
        maskImage.src = 'img/logo.png';
        window.onresize = function () {
          chart.resize();
        }
        


        $("#get").text("确定");
    }

    $scope.getFragmentDetail=function(obj){
        // console.log(obj);
        $('#fragmentModel').modal('show');
        document.getElementById("fragmentModelContent").innerHTML=obj.fragmentContent;
    }
    
    $http.get(ip+'/DomainTopicAPI/getDomainTopicAll?ClassName='+getCookie("NowClass")).success(function(response){
        $scope.tops = response;
        $scope.wordCloudInfo = "主题：" + $scope.tops[0].TermName;

        // 词云图：初始化页面时，显示该课程下第一个主题的词云图。Lucene Ik Analyzer进行分词和词频统计。
        var urlWord = ip + "/SpiderAPI/getWordcount";
        var postDataWord = $.param( {
            className: getCookie("NowClass"),
            topicNames: $scope.tops[0].TermName,
            sourceName: "",
            hasSourceName: false
        });
        var chart = echarts.init(document.getElementById('cloudPic'));
        var keywords = {
            "visualMap": 22199,
        };
        $.ajax({
            type: "POST",
            url: urlWord,
            data: postDataWord,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            async:false,
            success:function(data){
                keywords = data;
            }
        });
        var data = [];
        for (var name in keywords) {
          data.push({
              name: name,
              value: keywords[name]
          })
        }
        // console.log(keywords);
        var maskImage = new Image();
        var option = {
          series: [ {
              type: 'wordCloud',
              sizeRange: [10, 100],
              rotationRange: [-90, 90],
              rotationStep: 45,
              gridSize: 4,
              shape: 'pentagon',
              maskImage: maskImage,
              drawOutOfBound: false,
              textStyle: {
                  normal: {
                      color: function () {
                          return 'rgb(' + [
                              Math.round(Math.random() * 160),
                              Math.round(Math.random() * 160),
                              Math.round(Math.random() * 160)
                          ].join(',') + ')';
                      }
                  },
                  emphasis: {
                      color: 'red'
                  }
              },
              data: data.sort(function (a, b) {
                  return b.value  - a.value;
              })
          } ]
        };
        maskImage.onload = function () {
          option.series[0].maskImage
          chart.setOption(option);
        }
        maskImage.src = 'img/logo.png';
        window.onresize = function () {
          chart.resize();
        }

        // 碎片显示：默认加载时候显示第一个主题的碎片信息
        var url = ip + "/SpiderAPI/getFragmentByTopicArray";
        var postData = $.param( {
            className:getCookie("NowClass"),
            topicNames:$scope.tops[0].TermName
        });
        $.ajax({
            type: "POST",
            url: url,
            data: postData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            async:false,
            success:function(data){
                // console.log(data.length);
                $("#fragmentNum").text(data.length);
                $scope.fragments=data;
                for(var i=0;i<$scope.fragments.length;i++){
                    $scope.fragments[i].fragmentContent = $sce.trustAsHtml($scope.fragments[i].fragmentContent);
                }
            }
        });

    });

    // 获取数据源
    $http.get(ip+'/SourceAPI/getSource').success(function(response){
        $scope.sources=response;
    });

 });
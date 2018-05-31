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

    console.log('当前学科为：' + getCookie("NowSubject") + '，课程为：' + getCookie("NowClass"));
    $scope.NowSubject = getCookie("NowSubject");
    $scope.NowClass = getCookie("NowClass");


    /**
     * 根据课程，计算问题质量
     */
    $scope.getQuestionQuality = function() {

        // 根据课程，计算问题质量并写回数据库
        $http({
            url : ip + "/QuestionQualityAPI/getQuestionLabelByClass",
            method : 'post',
            data: {
                className: getCookie("NowClass")
            },
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            transformRequest: function(obj) {  
                var str = [];  
                for(var p in obj){  
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                }  
                return str.join("&");  
            }
        }).success(function(response) {
            alert("质量评估成功！");
        }).error(function(response){
            console.log('根据课程，计算问题标签，获取问题碎片api出错...');
            alert("质量评估失败！");
        });

    }

    /**
     * 根据课程，删除低质量问题
     */
    $scope.deleteLowQualityQuestion = function() {

        // 弹框确认
        if(confirm("确认删除吗")){
            // 根据课程，删除低质量问题
            $http({
                url : ip + "/QuestionQualityAPI/deleteQuestionsByClass",
                method : 'post',
                data: {
                    className: getCookie("NowClass")
                },
                headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {  
                    var str = [];  
                    for(var p in obj){  
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }  
                    return str.join("&");  
                }
            }).success(function(response) {
                alert(response.success);
            }).error(function(response){
                console.log('根据课程，删除低质量问题，获取问题碎片api出错...');
            });
        }

    }




    

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
        var url = ip + "/SpiderAPI/getFragmentQuestionByTopicArrayAndSource";
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
            $("#fragmentSource").text("中文维基、知乎、百度知道、csdn、人工、英文维基、Stackoverflow、Yahoo");
            var url = ip + "/SpiderAPI/getFragmentQuestionByTopicArray";
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
        } else{
            $("#fragmentSource").text(sourceName);
        }

        // 加载碎片信息
        $.ajax({
            type: "POST",
            url: url,
            data: postData,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            async:false,
            success:function(data){
                // console.log(data);
                $("#fragmentNum").text(data.length);
                $scope.fragments = data;
                for(var i = 0; i < $scope.fragments.length; i++){
                    $scope.fragments[i].fragmentContent = $sce.trustAsHtml($scope.fragments[i].fragmentContent);
                    // console.log($scope.fragments[i].sourceName);
                    if ($scope.fragments[i].sourceName === "Stackoverflow") {
                      $scope.fragments[i].sourceName = "SO";
                    }
                    console.log($scope.fragments[i].question_quality_label);
                    if ($scope.fragments[i].question_quality_label === null || $scope.fragments[i].question_quality_label === "") {
                      $scope.fragments[i].question_quality_label = "unknown";
                    }

                }
            }
        });
        $("#get").text("确定");


        var charts = [];
        // 加载词云图：初始化页面时，显示该课程下第一个主题的词云图。Lucene Ik Analyzer进行分词和词频统计。
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
              value: keywords[name] * 10
          })
        }
        // console.log(keywords);
        var maskImage = new Image();
        var option = {
          title: {
              text: $scope.wordCloudInfo,
              x: 'right',
              y: 'top',
              textStyle: {
                  color: '#000',
                  fontWeight: 'normal',
                  fontSize: 16
              },
          },
          series: [ {
              type: 'wordCloud',
              sizeRange: [10, 100],//最小文字——最大文字
              rotationRange: [-90, 90],//旋转角度区间
              rotationStep: 45,//旋转角度间隔
              // width: 440,//遮罩图片宽度
              // height: 220,//遮罩图片高度
              gridSize: 4, //字符间距
              shape: 'pentagon',
              maskImage: maskImage,//遮罩图片
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

        // 加载数据源统计
        var chart1 = echarts.init(document.getElementById('fragmentPic'));
        var results;
        var url1 = ip + "/SpiderAPI/getFragmentCountBySource";
        var postData1 = $.param( {
            className: getCookie("NowClass"),
            topicNames: checked_topicsArray,
        });
        $.ajax({
            type: "POST",
            url: url1,
            data: postData1,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            async:false,
            success:function(data){
                results = data;
                console.log(results);
            }
        });
        var data = results.echartObj1s;
        option1 = {
            backgroundColor: '#fff',
            title: {
                text: "碎片来源",
                subtext: "主题：" + checked_topicsArray.slice(0,3) + "...",
                x: 'center',
                y: 'center',
                textStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: 16
                },
                subtextStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: 12
                }
            },
            tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                // bottom: '0%',
                x: 'center',
                y: 'top',
                data: results.sources
            },
            toolbox:{
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ['line', 'bar']
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [{
                type: 'pie',
                selectedMode: 'single',
                radius: ['25%', '58%'],
                color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#deb140','#915872', '#3077b7', '#9a8169'],

                label: {
                    normal: {
                        position: 'inner',
                        formatter: '{c} ({d}%)',

                        textStyle: {
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: 12
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data
            }]
        };
        chart1.setOption(option1);

        charts.push(chart);  
        charts.push(chart1); 
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {  
            for(var i = 1; i < charts.length; i++) {  
                charts[i].resize();
            }  
        });
    }

    // 每个碎片的内容
    $scope.getFragmentDetail=function(obj){
        // console.log(obj);
        $('#fragmentModel').modal('show');
        document.getElementById("fragmentModelContent").innerHTML=obj.fragmentContent;
    }
    
    // 第一次加载时显示的数据
    $http.get(ip+'/DomainTopicAPI/getDomainTopicAll?ClassName='+getCookie("NowClass")).success(function(response){
        $scope.tops = response;
        $scope.wordCloudInfo = "主题：" + $scope.tops[0].TermName;
        var charts = [];

        // 加载词云图：初始化页面时，显示该课程下第一个主题的词云图。Lucene Ik Analyzer进行分词和词频统计。
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
              value: keywords[name] * 10
          })
        }
        // console.log(keywords);
        var maskImage = new Image();
        var option = {
          title: {
              text: '主题: ' + $scope.tops[0].TermName,
              x: 'right',
              y: 'top',
              textStyle: {
                  color: '#000',
                  fontWeight: 'normal',
                  fontSize: 16
              },
          },
          series: [ {
              type: 'wordCloud',
              sizeRange: [10, 100],//最小文字——最大文字
              rotationRange: [-90, 90],//旋转角度区间
              rotationStep: 45,//旋转角度间隔
              // width: 440,//遮罩图片宽度
              // height: 220,//遮罩图片高度
              gridSize: 4, //字符间距
              shape: 'pentagon',
              maskImage: maskImage,//遮罩图片
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

        // 加载数据源统计
        var chart1 = echarts.init(document.getElementById('fragmentPic'));
        var results;
        var url1 = ip + "/SpiderAPI/getFragmentCountBySource";
        var postData1 = $.param( {
            className: getCookie("NowClass"),
            topicNames: $scope.tops[0].TermName,
        });
        $.ajax({
            type: "POST",
            url: url1,
            data: postData1,
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            async:false,
            success:function(data){
                results = data;
                console.log(results);
            }
        });
        var data = results.echartObj1s;
        option1 = {
            backgroundColor: '#fff',
            title: {
                text: "碎片来源",
                subtext: '主题: ' + $scope.tops[0].TermName,
                x: 'center',
                y: 'center',
                textStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: 16
                },
                subtextStyle: {
                    color: '#000',
                    fontWeight: 'normal',
                    fontSize: 12
                }
            },
            tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                // bottom: '0%',
                x: 'center',
                y: 'top',
                data: results.sources
            },
            toolbox:{
                show: true,
                orient: 'vertical',
                x: 'right',
                y: 'center',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ['line', 'bar']
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [{
                type: 'pie',
                selectedMode: 'single',
                radius: ['25%', '58%'],
                color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#deb140','#915872', '#3077b7', '#9a8169'],

                label: {
                    normal: {
                        position: 'inner',
                        formatter: '{c} ({d}%)',

                        textStyle: {
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: 12
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: data
            }]
        };
        chart1.setOption(option1);

        charts.push(chart);  
        charts.push(chart1); 
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {  
            for(var i = 1; i < charts.length; i++) {  
                charts[i].resize();
            }  
        });

        // 碎片显示：默认加载时候显示第一个主题的碎片信息
        var url = ip + "/SpiderAPI/getFragmentQuestionByTopicArray";
        var postData = $.param( {
            className:getCookie("NowClass"),
            topicNames:$scope.tops[0].TermName
        });
        // var url = ip + "/SpiderAPI/getFragmentQuestionByTopicArrayAndSource";
        // var postData = $.param( {
        //     className:getCookie("NowClass"),
        //     topicNames:$scope.tops[0].TermName,
        //     sourceName:"中文维基"
        // });
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
                    // console.log($scope.fragments[i].sourceName);
                    if ($scope.fragments[i].sourceName === "Stackoverflow") {
                      $scope.fragments[i].sourceName = "SO";
                    }
                    console.log($scope.fragments[i].question_quality_label);
                    if ($scope.fragments[i].question_quality_label === null || $scope.fragments[i].question_quality_label === "") {
                      $scope.fragments[i].question_quality_label = "unknown";
                    }
                }
            }
        });

    });

    // 获取数据源
    $http.get(ip+'/SourceAPI/getSource').success(function(response){
        $scope.sources=response;
    });

 });
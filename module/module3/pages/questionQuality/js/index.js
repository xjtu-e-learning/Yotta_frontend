$(document).ready(function(){

    // 数据表格参数设置：是否分页、是否排序等
    $("#questionTable").DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });

    // angularjs控制
    var app = angular.module('app', []);
    app.controller('controller', function($scope, $http, $sce) {

        console.log('当前学科为：' + getCookie("NowSubject") + '，课程为：' + getCookie("NowClass"));
        $scope.NowSubject = getCookie("NowSubject");
        $scope.NowClass = getCookie("NowClass");

        /**
         * 页面加载时默认显示所有主题及其一级分面
         */
        $http({
            // http://202.117.54.39:8081/Yotta/FacetAPI/getDomainInfo?ClassName=Source_code_generation
            url : ip + "/FacetAPI/getDomainInfo?ClassName=" + $scope.NowClass,
            method : 'get'
        }).success(function(response) {
            $scope.topics = response;
            // 切回问题页面时，设置两个框的值
            for(i = 0; i < response.length; i++) {
                if(response[i].TermName == getCookie("topicName")) {
                    $scope.topic = response[i];
                    for(j = 0; j < response[i].Facet1.length; j++) {
                        if(response[i].Facet1[j].Facet1Name == getCookie("facetName")) {
                            $scope.facet = response[i].Facet1[j];
                        }
                    }
                }
            }
        }).error(function(response){
            console.log('获取主题及其一级分面api出错...');
        });

        /**
         * 页面加载时默认显示所有学科
         */
        $http({
            // http://202.117.54.39:8081/Yotta/SourceAPI/getSource
            url : ip + "/SourceAPI/getSourceByNote?Note=cqa",
            method : 'get'
        }).success(function(response) {
            $scope.sources = response;
            // 切回问题页面时，设置两个框的值
            for(i = 0; i < response.length; i++) {
                if(response[i].sourceName == getCookie("sourceName")) {
                    $scope.source = response[i];
                }
            }
        }).error(function(response){
            console.log('获取学科api出错...');
        });


        /**
         * 点击"问题"，跳转具体的问题页面
         */
        $scope.setFragmentCookie = function(question_id) {
            // console.log(question_id);
            setCookie("question_id", question_id, "h1");
        }

        /**
         * 点击每个问题的"x"按钮，删除该问题
         */
        $scope.deleteQuestionByID = function(question_id) {
            if(confirm("确认删除吗")){
                // alert("yes");
                $http({
                    url : ip + "/QuestionQualityAPI/deleteQuestionById?question_id=" + question_id,
                    method : 'get'
                }).success(function(response) {
                    alert(response.success);

                    /**
                     * 删除一个问题碎片后，刷新页面得到最新结果
                     */
                    if (getCookie("topicName") == "") {
                        // alert("请选择主题！");
                    } else if (getCookie("sourceName") == "") {
                        // 主题
                        getQuestionsByTopic(getCookie("topicName"));
                    } else {
                        // 主题 + 数据源
                        getQuestionsByTopicAndSource(getCookie("topicName"), getCookie("sourceName"));
                    }

                }).error(function(response){
                    alert("删除失败");
                    console.log('根据问题ID删除问题失败...');
                });

            }
            
        }
        



        /**
         * 每次刷新页面或者返回该页面时，根cookie信息读取显示问题数据，防止刚进入页面为空的情况
         */
        if (getCookie("topicName") == "") {
            // alert("请选择主题！");
        } else if (getCookie("sourceName") == "") {
            // 主题
            getQuestionsByTopic(getCookie("topicName"));
        } else {
            // 主题 + 数据源
            getQuestionsByTopicAndSource(getCookie("topicName"), getCookie("sourceName"));
        }



        

        /**
         * 点击"搜索"，显示某个主题、分面下的碎片
         */
        $scope.getQuestions = function(topicName, facetName, sourceName) {
            if (typeof topicName === "undefined") {
                alert("请选择主题！");
            } else if (typeof sourceName === "undefined") {
                // 主题
                getQuestionsByTopic(topicName);
            } else {
                // 主题 + 数据源
                getQuestionsByTopicAndSource(topicName, sourceName);
            }
        }

        /**
         * 根据主题，返回问题信息
         */
        function getQuestionsByTopic(topicName) {
            // 设置cookie
            setCookie("topicName", topicName, "h1");
            setCookie("sourceName", "", "h1");
            setCookie("facetName", "", "h1");
            // 根据主题，返回问题信息
            $http({
                url : ip + "/QuestionQualityAPI/getFragmentByTopic",
                method : 'post',
                data: {
                    className: $scope.NowClass,
                    topicName: topicName
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
                processQuestions(response);
                $scope.topicName = topicName;
            }).error(function(response){
                console.log('根据主题，获取问题碎片api出错...');
            });
        }

        /**
         * 根据主题和数据源，返回问题信息
         */
        function getQuestionsByTopicAndSource(topicName, sourceName) {
            // 设置cookie
            setCookie("topicName", topicName, "h1");
            setCookie("sourceName", sourceName, "h1");
            setCookie("facetName", "", "h1");
            // 根据主题、数据源查询
            $http({
                url : ip + "/QuestionQualityAPI/getFragmentByTopicAndSource",
                method : 'post',
                data: {
                    className: $scope.NowClass,
                    topicName: topicName,
                    sourceName: sourceName
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
                processQuestions(response);
                $scope.topicName = topicName;
            }).error(function(response){
                console.log('根据主题和数据源，获取问题碎片api出错...');
            });
        }

        /**
         * 处理得到的问题碎片集合
         * page_website_logo ：控制问题的网站logo
         * page_search_url ：控制点击问题的topic和facet的跳转搜索网页的链接
         * page_column_color ：控制问题显示栏目的颜色
         */
        function processQuestions(response) {
            // 返回问题集合为空
            if (response.length == 0) {
                alert("没有找到问题");
            }
            $scope.fragments = response;
            var highQualityCount = 0; // 高质量问题数量
            var lowQualityCount = 0; // 低质量问题数量
            for(var i = 0; i < $scope.fragments.length; i++){
                // 高低质量问题
                if ($scope.fragments[i].question_quality_label === "high") {
                    $scope.fragments[i].page_column_color = "box-success"; // 设置高质量问题栏目显示的颜色
                    highQualityCount++; // 计算高质量问题数量
                } else if ($scope.fragments[i].question_quality_label === "low") {
                    $scope.fragments[i].page_column_color = "box-warning";
                    lowQualityCount++;
                } else {
                    $scope.fragments[i].page_column_color = "";
                    $scope.fragments[i].question_quality_label = "unknown";
                }
                // // 处理问题标题中的链接
                // var title_html = $scope.fragments[i].question_title;
                // var title_html2 = title_html;
                // title_html = title_html.split("href=\"")[0] + 'href="https://stackoverflow.com' + title_html.split("href=\"")[1];
                // $scope.fragments[i].question_title = $sce.trustAsHtml(title_html);
                // 设置问题正文和最佳答案长度值
                $scope.fragments[i].question_body_pure = $scope.fragments[i].question_body_pure.substring(0, 200);
                $scope.fragments[i].question_best_answer_pure = $scope.fragments[i].question_best_answer_pure.substring(0, 300);
                if ($scope.fragments[i].page_website_logo === "fa fa-yahoo") {
                   $scope.fragments[i].asker_best_answer_rate = "Yahoo"; 
                } else if ($scope.fragments[i].page_website_logo === "fa fa-stack-overflow") {
                   $scope.fragments[i].asker_best_answer_rate = "Stackoverflow"; 
                }
            }

            $scope.fragmentCount = "问题数量：" + response.length + "，高质量问题：" + highQualityCount + "，低质量问题：" + lowQualityCount;

        }











        /**
         * 点击"质量评估"，计算问题标签并显示带标签的问题信息
         */
        $scope.getQuestionsQuality = function(topicName, facetName, sourceName) {
            if (typeof topicName === "undefined") {
                alert("请选择主题！");
            } else if (typeof sourceName === "undefined") {
                // 主题
                getQuestionsQualityByTopic(topicName);
            } else {
                // 主题 + 数据源
                getQuestionsQualityByTopicAndSource(topicName, sourceName);
            }
        }

        /**
         * 根据主题，计算问题标签，返回问题信息
         */
        function getQuestionsQualityByTopic(topicName) {
            // 设置cookie
            setCookie("topicName", topicName, "h1");
            setCookie("sourceName", "", "h1");
            setCookie("facetName", "", "h1");
            // 根据主题查询
            $http({
                url : ip + "/QuestionQualityAPI/getQuestionLabelByTopic",
                method : 'post',
                data: {
                    className: $scope.NowClass,
                    topicName: topicName
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
                processQuestionsQuality(response);
                alert("质量评估成功！");
            }).error(function(response){
                console.log('根据主题，计算问题标签，获取问题碎片api出错...');
                alert("质量评估失败！");
            });
        }

        /**
         * 根据主题和数据源，计算问题标签，返回问题信息
         */
        function getQuestionsQualityByTopicAndSource(topicName, sourceName) {
            // 设置cookie
            setCookie("topicName", topicName, "h1");
            setCookie("sourceName", sourceName, "h1");
            setCookie("facetName", "", "h1");
            // 根据主题、数据源查询
            $http({
                url : ip + "/QuestionQualityAPI/getQuestionLabelByTopicAndSource",
                method : 'post',
                data: {
                    className: $scope.NowClass,
                    topicName: topicName,
                    sourceName: sourceName
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
                processQuestionsQuality(response);
                alert("质量评估成功！");
            }).error(function(response){
                console.log('根据主题和数据源，计算问题标签，获取问题碎片api出错...');
                alert("质量评估失败！");
            });
        }

        /**
         * 处理得到的问题碎片集合：问题集合带标签
         * page_website_logo ：控制问题的网站logo
         * page_search_url ：控制点击问题的topic和facet的跳转搜索网页的链接
         * page_column_color ：控制问题显示栏目的颜色
         */
        function processQuestionsQuality(response) {
            // 返回问题集合为空
            if (response.length == 0) {
                alert("没有找到问题");
            }
            $scope.fragments = response;
            var highQualityCount = 0; // 高质量问题数量
            var lowQualityCount = 0; // 低质量问题数量
            for(var i = 0; i < $scope.fragments.length; i++){
                // 高低质量问题
                if ($scope.fragments[i].question_quality_label === "high") {
                    $scope.fragments[i].page_column_color = "box-success"; // 设置高质量问题栏目显示的颜色
                    highQualityCount++; // 计算高质量问题数量
                } else if ($scope.fragments[i].question_quality_label === "low") {
                    $scope.fragments[i].page_column_color = "box-warning";
                    lowQualityCount++;
                } else {
                    $scope.fragments[i].page_column_color = "";
                    $scope.fragments[i].question_quality_label = "unknown";
                }
                // 设置问题正文和最佳答案长度值
                $scope.fragments[i].question_body_pure = $scope.fragments[i].question_body_pure.substring(0, 200);
                $scope.fragments[i].question_best_answer_pure = $scope.fragments[i].question_best_answer_pure.substring(0, 300);
                if ($scope.fragments[i].page_website_logo === "fa fa-yahoo") {
                   $scope.fragments[i].asker_best_answer_rate = "Yahoo"; 
                } else if ($scope.fragments[i].page_website_logo === "fa fa-stack-overflow") {
                   $scope.fragments[i].asker_best_answer_rate = "Stackoverflow"; 
                }
            }

            $scope.fragmentCount = "问题数量：" + response.length + "，高质量问题：" + highQualityCount + "，低质量问题：" + lowQualityCount;

        }








        /**
         * 点击"碎片清洗"，删除低质量问题
         */
        $scope.deleteLowQualityQuestions = function(topicName, facetName, sourceName) {
            if (typeof topicName === "undefined") {
                alert("请选择主题！");
            } else if (typeof sourceName === "undefined") {
                // 主题
                if(confirm("确认删除吗")){
                    deleteLowQualityQuestionsByTopic(topicName);
                }
            } else {
                // 主题 + 数据源
                if(confirm("确认删除吗")){
                    deleteLowQualityQuestionsByTopicAndSource(topicName, sourceName);
                }
            }
        }

        /**
         * 根据主题，删除低质量问题
         */
        function deleteLowQualityQuestionsByTopic(topicName) {
            // 设置cookie
            setCookie("topicName", topicName, "h1");
            setCookie("sourceName", "", "h1");
            setCookie("facetName", "", "h1");
            // 根据主题，删除低质量问题
            $http({
                url : ip + "/QuestionQualityAPI/deleteQuestionsByTopic",
                method : 'post',
                data: {
                    className: $scope.NowClass,
                    topicName: topicName
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
                // 删除完显示碎片
                getQuestionsByTopic(topicName);
            }).error(function(response){
                console.log('根据主题，删除低质量问题，获取问题碎片api出错...');
            });
        }

        /**
         * 根据主题和数据源，删除低质量问题
         */
        function deleteLowQualityQuestionsByTopicAndSource(topicName, sourceName) {
            // 设置cookie
            setCookie("topicName", topicName, "h1");
            setCookie("sourceName", sourceName, "h1");
            setCookie("facetName", "", "h1");
            // 根据主题、数据源查询
            $http({
                url : ip + "/QuestionQualityAPI/deleteQuestionsByTopicAndSource",
                method : 'post',
                data: {
                    className: $scope.NowClass,
                    topicName: topicName,
                    sourceName: sourceName
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
                // 删除完显示碎片
                getQuestionsByTopicAndSource(topicName, sourceName);
            }).error(function(response){
                console.log('根据主题和数据源，删除低质量问题，获取问题碎片api出错...');
            });
        }



    // angular end
    });



// document ready end
});
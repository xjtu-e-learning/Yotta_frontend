$(document).ready(function(){

    // angularjs控制
    var app = angular.module('app', []);
    app.controller('controller', function($scope, $http, $sce) {

        /**
         * 显示点击的问题详情
         */
        $http({
            url : ip + "/QuestionQualityAPI/getQuestionById?questionId=" + getCookie("question_id"),
            method : 'get'
        }).success(function(response) {
            $scope.fragment = response[0];
            // console.log($scope.fragment);
            $scope.fragment.question_body = $sce.trustAsHtml($scope.fragment.question_body);
            $scope.fragment.question_best_answer = $sce.trustAsHtml($scope.fragment.question_best_answer);

            // 高低质量问题
            if ($scope.fragment.question_quality_label === "high") {
                $scope.fragment.page_column_color = "box-success"; // 设置高质量问题栏目显示的颜色
            } else if ($scope.fragment.question_quality_label === "low") {
                $scope.fragment.page_column_color = "box-warning";
            } else {
                $scope.fragment.page_column_color = "";
                $scope.fragment.question_quality_label = "unknown";
            }

            // 问题的数据源设置
            if ($scope.fragment.page_website_logo === "fa fa-yahoo") {
               $scope.fragment.asker_best_answer_rate = "Yahoo"; 
            } else if ($scope.fragment.page_website_logo === "fa fa-stack-overflow") {
               $scope.fragment.asker_best_answer_rate = "Stackoverflow"; 
            }

        }).error(function(response){
            console.log('获取问题碎片api出错...');
        });

    });


});
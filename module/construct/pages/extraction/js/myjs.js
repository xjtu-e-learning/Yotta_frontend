$(document).ready(function(){
    var topic;
    $.ajax({
        type :"GET",
        url :ip+"/DomainTopicAPI/getDomainTopicAll?ClassName="+getCookie("NowClass"),
        datatype :"json",
        async:false,
        success : function(data,status){
            topic = data;
            // console.log("topic个数："+topic.length);
        }
    });

    if (topic != null) {
        for(var i = 0; i < topic.length; i++){
            $("#li").append("<li class='list-group-item'>"+topic[i].TermName+"</li>");
        }
    }

    var ykapp = angular.module('classApp', []);
    ykapp.controller('classController', function($scope, $http) {
        console.log('当前课程为：' + getCookie("NowClass"));
        $scope.NowClass = getCookie("NowClass");
    });

})



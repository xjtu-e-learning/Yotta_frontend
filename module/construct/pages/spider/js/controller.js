// 自适应程序
var zidingyi_height
$(document).ready(function(){
           var header=$(".content-header").offset().top+$(".content-header").height()
            var footer=$(".main-footer").offset().top
           zidingyi_height=footer-header
})



//四个全局变量
//var quanju_img=[];
//var quanju_text=[];
var quanju_imgnum=0;
var quanju_textnum=0;
//根据所选主题从后台get碎片函数，主题多时需要时间长，提前执行下一函数会导致结果出错



//控制器，初始get所有主题，点击模态框的关闭时，通过上述函数get的碎片会绑定到前台
 var app=angular.module('myApp',[]);
 app.controller('myCon',function($scope,$http){

    console.log('当前课程为：' + getCookie("NowClass"));
    $scope.NowClass = getCookie("NowClass");

    $scope.getinfo=function(){
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
    $.ajax({
        type:"GET",
        url:'http://'+ip+'/SpiderAPI/getFragmentByTopicArray',
        data:{ClassName:getCookie("NowClass"),topicNames:checked_topicsArray},
        dataType:"json",
                //async:false,
                success:function(data){
                    console.log(data);
                }
            });



var fragment=[];
    for(var i=0;i<checked_topics.length;i++){
       $.ajax({
                type:"GET",
                url:'http://'+ip+"/SpiderAPI/getDomainTermFragment",
                data:{ClassName:getCookie("NowClass"),TermName:checked_topics[i]},
                dataType:"json",
                //async:false,
                success:function(data){
                    console.log(data);
                }
            }); 
    }
    // checked_topics1=checked_topics.toString();
    // $.ajax({
    //             type:"GET",
    //             url:'http://'+ip+'/SpiderAPI/getTextByTopicArray?className='+getCookie("NowClass")+"&topicNames="+checked_topics1,
    //             data:{},
    //             dataType:"json",
    //             async:false,
    //             success:function(data){
    //                 console.log(data);
    //                 $scope.fragment=data;
    //             }
    //         });
    // $.ajax({
    //             type:"GET",
    //             url:'http://'+ip+'/SpiderAPI/getImageByTopicArray?ClassName='+getCookie("NowClass")+"&topicNames="+checked_topics1,
    //             data:{},
    //             dataType:"json",
    //             async:false,
    //             success:function(data){
    //                 console.log(data);
    //                 $scope.wangzhi=data;
    //             }
    //         });
    // for(var i=0;i<checked_topics.length;i++){

    //         $.ajax({
    //             type:"GET",
    //             url:'http://'+ip+"/SpiderAPI/getCountByTopic?ClassName="+getCookie("NowClass")+"&TermName="+checked_topics[i],
    //             data:{},
    //             dataType:"json",
    //             success:function(data){
    //                 if(checked_topics.length==84){//全选直接规定总数
    //                     quanju_textnum=1410;
    //                     quanju_imgnum=152;
    //                 }
    //                 else{
    //                 quanju_textnum=quanju_textnum+data[0].number;
    //                 quanju_imgnum=quanju_imgnum+data[1].number;
    //             }
    //                 }
    //         });
        

    // }
    $("#get").text("确定");

}
    

     $http.get('http://'+ip+'/DomainTopicAPI/getDomainTopicAll?ClassName='+getCookie("NowClass")).success(function(response){
        $scope.tops=response;
    });
 });
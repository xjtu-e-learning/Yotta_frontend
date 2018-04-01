var SUBJECTNAME = ""; // 当前选择的主题
var ykapp = angular.module('subjectApp', []);
ykapp.controller('subjectController', function($scope, $http) {
    // 获取当前学科和课程
    $scope.NowSubject = getCookie("NowSubject");
    $scope.NowClass = getCookie("NowClass");
    console.log('当前学科为：' + getCookie("NowSubject") + '，课程为：' + getCookie("NowClass"));
    
    // 加载所有主题
    $http.get(ip+'/DomainTopicAPI/getDomainTopicAll?ClassName='+getCookie("NowClass")).success(function(response){
        $scope.Topics = response;
        var height=$("#rightDiv").height()-$('.box-header').height()-8;
        $("#facetedTreeDiv").css("height",height*0.93+"px")
        // 每次选择一门新的课程时，展示这门新的课程的第一个主题的分面树
        SUBJECTNAME = response[0].TermName;
        loadBranch();
    });

    // 提交所选主题，更新主题分面树
    $("button#subjectSubmit").click(function(){
        //获取被选中主题
        $("input.subjectRadio").each(function(index,value){
            if($(this).prop("checked")===true){
                SUBJECTNAME=$(this).val();   
                loadBranch(); //生成树枝
                $("#subjectModal").modal("hide");
            }
        });
    });

    // 加载主题分面树（无碎片）
    function loadBranch(){
        $.ajax({
            type: "POST",
            url: ip + "/AssembleAPI/getTreeByTopicForFragment",
            data: $.param( {
                ClassName:getCookie("NowClass"),
                TermName:SUBJECTNAME,
                HasFragment:false
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            success: function(data) {
                displayBranch(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //通常情况下textStatus和errorThrown只有其中一个包含信息
                alert(textStatus);
            }
        });
    }

    // 显示主题分面树（无碎片）
    function displayBranch(dataset){
        document.getElementById("facetedTreeDiv").innerHTML='';
        var datas = []; 
        multiple=1;
        datas.push(dataset);
        //分面树所占空间大小
        svg = d3.select("div#facetedTreeDiv")
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height","100%");
        //分面树的位置    
        var root_x=$("#facetedTreeDiv").width()/2;
        var root_y=$("#facetedTreeDiv").height()-30; //
        //$("svg").draggable();
        var seed = {x: root_x, y: root_y, name:dataset.name}; 
        var tree = buildBranch(dataset, seed, multiple);
        draw_tree(tree, seed, svg, multiple);
        //对分面树进行缩放
        $("div#facetedTreeDiv").bind('mousewheel', function(evt) {
            var temp = multiple;//判断是保持0.25或者1.25不变
            if( 0.3< multiple && multiple<1){
                multiple+=evt.originalEvent.wheelDelta/5000;
            }else if(multiple < 0.3){
                if(evt.originalEvent.wheelDelta>0){
                    multiple+=evt.originalEvent.wheelDelta/5000;
                }
            }else{
                if(evt.originalEvent.wheelDelta<0){
                    multiple+=evt.originalEvent.wheelDelta/5000;
                }
            }
            d3.selectAll("svg").remove(); //删除之前的svg
            svg = d3.select("div#facetedTreeDiv")
                        .append("svg")
                        .attr("width", w * multiple)
                        .attr("height", h * multiple);
            var seed0 = {x: root_x, y: root_y, name:dataset.name};
            var tree0 = buildBranch(dataset, seed0, multiple);
            draw_tree(tree0, seed0, svg, multiple);
        }); 
    }

    $scope.assembleTree = function() {
        // 点击装配按钮：左侧显示实例化主题分面树、右上显示主题碎片数量统计、右下显示碎片
        document.getElementById("facetedTreeDiv").innerHTML='';
        $("#fragmentDiv").empty();
        var fragmentNum = 0; // 碎片数量
        $.ajax({
            type: "POST",
            url: ip+"/AssembleAPI/getTreeByTopicForFragment",
            data: $.param( {
                ClassName:getCookie("NowClass"),
                TermName:SUBJECTNAME,
                HasFragment:true
            }),
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            success: function(dataset){
                /**
                 * 左侧显示实例化主题分面树
                 */
                multiple=1;
                //分面树所占空间大小
                svg = d3.select("div#facetedTreeDiv").append("svg").attr("width", "100%").attr("height","100%");
                //分面树根的位置   
                var root_x=$("#facetedTreeDiv").width()/2;
                var root_y=$("#facetedTreeDiv").height()-30; 
                var seed4 = {x: root_x, y: root_y, name:dataset.name}; 
                var tree4 = buildTree(dataset, seed4, multiple);
                draw_tree(tree4, seed4, svg, multiple); 
                //对分面树进行缩放
                $("div#facetedTreeDiv").bind('mousewheel', function(evt) {
                    var temp = multiple;//判断是保持0.25或者1.25不变
                    if( 0.3< multiple && multiple<1){
                        multiple+=evt.originalEvent.wheelDelta/5000;
                    }else if(multiple < 0.3){
                        if(evt.originalEvent.wheelDelta>0){
                            multiple+=evt.originalEvent.wheelDelta/5000;
                        }
                    }else{
                        if(evt.originalEvent.wheelDelta<0){
                            multiple+=evt.originalEvent.wheelDelta/5000;
                        }
                    }
                    d3.selectAll("svg").remove();
                    svg = d3.select("div#facetedTreeDiv")
                                .append("svg")
                                .attr("width", "100%")
                                .attr("height", "100%");
                    //分面树根的位置   
                    var root_x=$("#facetedTreeDiv").width()/2;
                    var root_y=$("#facetedTreeDiv").height()-30; 
                    var seed0 = {x: root_x, y: root_y, name:dataset.name};
                    var tree0 = buildTree(dataset, seed0, multiple);
                    draw_tree(tree0, seed0, svg, multiple);
                });
                /**
                 * 右下显示碎片
                 */
                $.each(dataset.children, function(index1,value1){  //进入一级分面 
                    $.each(value1.children, function(index2,value2){  //进入二级分面
                        if (value2.type==="branch"){
                            $.each(value2.children, function(index3,value3){  //遍历树叶
                                // 碎片api返回的api接口形式为：2017-10-28 15:29:02.0。需要去除最后的不用的时间字段
                                fragmentScratchTime = value3.scratchTime.split('.')[0];
                                appendFragment(value3.content, fragmentScratchTime);
                                fragmentNum++;
                            });
                        } else{
                            fragmentScratchTime = value2.scratchTime.split('.')[0];
                            appendFragment(value2.content, fragmentScratchTime);
                            fragmentNum++;
                        }
                    });
                    
                });
                /**
                 * 右上显示主题碎片数量统计
                 */
                document.getElementById("fragmentCount").innerHTML = fragmentNum; 
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert(textStatus);
            }
        });
    }

    // 添加碎片
    function appendFragment(content,time){
        var div2=d3.select("#fragmentDiv").append("div");
        div2.attr("class","box box-primary box-solid")
        div2.style("width","45%");
        div2.style("border","2px solid #428bca");
        div2.style("float","left");
        div2.style("margin","1%");
        var contentDiv=div2.append("div");
        contentDiv.attr("class","box-body");
        contentDiv.style("height","200px");
        contentDiv.style("overflow","hidden");
        contentDiv.html(content);
        var timeDiv=div2.append("div");
        timeDiv.attr("class","box-body");
        timeDiv.text(time);
    }

});

// 设置滚动条
$(document).ready(function(){
    //文本图片碎片栏滚动条设置
    $(".fragmentSlimscroll").slimScroll({
        width: 'auto', //可滚动区域宽度
        height: '500px', //可滚动区域高度
        size: '10px', //组件宽度
        color: '#000', //滚动条颜色
        position: 'right', //组件位置：left/right
        distance: '0px', //组件与侧边之间的距离
        start: 'top', //默认滚动位置：top/bottom
        opacity: .4, //滚动条透明度
        alwaysVisible: true, //是否 始终显示组件
        disableFadeOut: true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
        railVisible: true, //是否 显示轨道
        railColor: '#333', //轨道颜色
        railOpacity: .2, //轨道透明度
        railDraggable: true, //是否 滚动条可拖动
        railClass: 'slimScrollRail', //轨道div类名 
        barClass: 'slimScrollBar', //滚动条div类名
        wrapperClass: 'slimScrollDiv', //外包div类名
        allowPageScroll: false, //是否 使用滚轮到达顶端/底端时，滚动窗口
        wheelStep: 20, //滚轮滚动量
        touchScrollStep: 200, //滚动量当用户使用手势
        borderRadius: '7px', //滚动条圆角
        railBorderRadius: '7px' //轨道圆角
    });

    //主题单选框、分面复选框滚动条设置
    $(".model-slimscroll").slimScroll({
        width: 'auto', //可滚动区域宽度
        height: '200px', //可滚动区域高度
        size: '10px', //组件宽度
        color: '#000', //滚动条颜色
        position: 'right', //组件位置：left/right
        distance: '0px', //组件与侧边之间的距离
        start: 'top', //默认滚动位置：top/bottom
        opacity: .4, //滚动条透明度
        alwaysVisible: true, //是否 始终显示组件
        disableFadeOut: true, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
        railVisible: true, //是否 显示轨道
        railColor: '#333', //轨道颜色
        railOpacity: .2, //轨道透明度
        railDraggable: true, //是否 滚动条可拖动
        railClass: 'slimScrollRail', //轨道div类名 
        barClass: 'slimScrollBar', //滚动条div类名
        wrapperClass: 'slimScrollDiv', //外包div类名
        allowPageScroll: false, //是否 使用滚轮到达顶端/底端时，滚动窗口
        wheelStep: 20, //滚轮滚动量
        touchScrollStep: 200, //滚动量当用户使用手势
        borderRadius: '7px', //滚动条圆角
        railBorderRadius: '7px' //轨道圆角
    });
});
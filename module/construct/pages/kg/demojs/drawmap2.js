// var dep;
var layer = 1;
var graph;
var category = "";
var nodename = "";
var svg2;
var categories = [];
/*$(document).ready(function(){
    svg2 = d3.select("#mysvg2")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
});*/


//初始化界面
function init() {
    console.log("init")
    $(document).ready(function () {
        var xml;
        $.ajax({
                url: 'a1.xml',
                type: 'get',
                async: false,
                dataType: 'xml',
                data: {
                    param1: 'value1'
                },
            })
            .done(function (data) {
                console.log("success load xml");
                xml = data
                //console.log(xml);
            })
            .fail(function () {
                console.log("error");
            })


        var pd2 = 0;

        //画力关系图
        var dom = document.getElementById("echarts1");
        var myChart = echarts.init(dom);
        var app = {};
        var option = null;
        graph = echarts.dataTool.gexf.parse(xml);
        // console.log(graph);

        categories[0] = {
            name: '(Start)数据结构'
        };
        categories[1] = {
            name: '树'
        };
        categories[2] = {
            name: '数组'
        };
        categories[3] = {
            name: '正则图'
        };
        categories[4] = {
            name: '链表'
        };
        categories[5] = {
            name: '关联数组'
        };
        categories[6] = {
            name: '抽象资料'
        };

        // var sum = 0;
        myChart.on('click', function (params) {
            if (params.dataType == 'node') {
                // $.ajax({
                //     statusCode: {
                //         200: function () {
                //             console.log("success")
                //         }
                //     },
                //     type: "GET",
                //     url: 'http://' + ip + "/AssembleAPI/getTreeByTopicForFragment?ClassName=" + getCookie("NowClass") + "&TermName=" + params.name,
                //     data: {},
                //     dataType: "json",
                //     success: function (data) {
                //         d3.select("g.tree").remove();
                //         pd2 = 0;
                //         var seed4 = {
                //             x: 150,
                //             y: 450,
                //             name: data.name
                //         };
                //         var tree4 = buildTree(data, seed4, 0.8);
                //         draw_tree(tree4, seed4, svg2, 0.8);
                //     }
                // });

                //console.log(params)

                category = params.data.category;
                layer++;
                secondLayer(params.data.category);
            }
        });
        graph.nodes.forEach(function (node) {
            node.itemStyle = null;
            node.value = node.symbolSize;
            node.symbol = "path://M537.804,174.688c0-44.772-33.976-81.597-77.552-86.12c-12.23-32.981-43.882-56.534-81.128-56.534   c-16.304,0-31.499,4.59-44.514,12.422C319.808,17.949,291.513,0,258.991,0c-43.117,0-78.776,31.556-85.393,72.809   c-3.519-0.43-7.076-0.727-10.71-0.727c-47.822,0-86.598,38.767-86.598,86.598c0,2.343,0.172,4.638,0.354,6.933   c-24.25,15.348-40.392,42.333-40.392,73.153c0,27.244,12.604,51.513,32.273,67.387c-0.086,1.559-0.239,3.107-0.239,4.686   c0,47.822,38.767,86.598,86.598,86.598c14.334,0,27.817-3.538,39.723-9.696c16.495,11.848,40.115,26.67,51.551,23.715   c0,0,4.255,65.905,3.337,82.64c-1.75,31.843-11.303,67.291-18.025,95.979h104.117c0,0-15.348-63.954-16.018-85.307   c-0.669-21.354,6.675-60.675,6.675-60.675l36.118-37.36c13.903,9.505,30.695,14.908,48.807,14.908   c44.771,0,81.597-34.062,86.12-77.639c32.98-12.23,56.533-43.968,56.533-81.214c0-21.994-8.262-41.999-21.765-57.279   C535.71,195.926,537.804,185.561,537.804,174.688z M214.611,373.444c6.942-6.627,12.766-14.372,17.212-22.969l17.002,35.62   C248.816,386.096,239.569,390.179,214.611,373.444z M278.183,395.438c-8.798,1.597-23.782-25.494-34.416-47.517   c11.791,6.015,25.102,9.477,39.254,9.477c3.634,0,7.201-0.296,10.72-0.736C291.006,374.286,286.187,393.975,278.183,395.438z    M315.563,412.775c-20.35,5.651-8.167-36.501-2.334-60.904c4.218-1.568,8.301-3.413,12.183-5.604   c2.343,17.786,10.069,33.832,21.516,46.521C337.011,401.597,325.593,409.992,315.563,412.775z";
            node.symbolOffset = [0, '-100%'];
            node.label = {
                normal: {
                    show: node.symbolSize > 25
                }
            };
            node.category = node.attributes.modularity_class;
        });
        graph.links.forEach(function (link) {

        })
        option = {
            title: {
                text: '数据结构',
                subtext: 'Default layout',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            legend: [{
                // selectedMode: 'single',
                data: categories.map(function (a) {
                    return a.name;
                })
                /*
                                selected:{
                                    '抽象资料': false,
                                    '关联数组':false,
                                    '数组':false,
                                    '正则图':false,
                                    '树':false,
                                    '链表':false
                                }
                */
            }],
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',

            series: [{
                name: '数据结构',
                type: 'graph',
                layout: 'none',
                data: graph.nodes,
                links: graph.links,
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                categories: categories,
                roam: true,
                focusNodeAdjacency: true,
                label: {
                    normal: {
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                lineStyle: {
                    normal: {
                        curveness: 0.3
                    }
                }
            }]
        };
        myChart.setOption(option);
    })
}

function secondLayer(category) {
    var cluster = JSON.parse(JSON.stringify(graph));
    removeByCategory(cluster.nodes, category);
    removeLinks(cluster.links, cluster.nodes);
    // console.log(cluster)
    // console.log(graph)
    //画力关系图
    var dom = document.getElementById("echarts1");
    var myChart = echarts.init(dom);
    var app = {};
    var option = null;
    cluster.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.symbolSize = node.symbolSize * 1.5;
        node.value = node.symbolSize;
        node.symbol = "path://M537.804,174.688c0-44.772-33.976-81.597-77.552-86.12c-12.23-32.981-43.882-56.534-81.128-56.534   c-16.304,0-31.499,4.59-44.514,12.422C319.808,17.949,291.513,0,258.991,0c-43.117,0-78.776,31.556-85.393,72.809   c-3.519-0.43-7.076-0.727-10.71-0.727c-47.822,0-86.598,38.767-86.598,86.598c0,2.343,0.172,4.638,0.354,6.933   c-24.25,15.348-40.392,42.333-40.392,73.153c0,27.244,12.604,51.513,32.273,67.387c-0.086,1.559-0.239,3.107-0.239,4.686   c0,47.822,38.767,86.598,86.598,86.598c14.334,0,27.817-3.538,39.723-9.696c16.495,11.848,40.115,26.67,51.551,23.715   c0,0,4.255,65.905,3.337,82.64c-1.75,31.843-11.303,67.291-18.025,95.979h104.117c0,0-15.348-63.954-16.018-85.307   c-0.669-21.354,6.675-60.675,6.675-60.675l36.118-37.36c13.903,9.505,30.695,14.908,48.807,14.908   c44.771,0,81.597-34.062,86.12-77.639c32.98-12.23,56.533-43.968,56.533-81.214c0-21.994-8.262-41.999-21.765-57.279   C535.71,195.926,537.804,185.561,537.804,174.688z M214.611,373.444c6.942-6.627,12.766-14.372,17.212-22.969l17.002,35.62   C248.816,386.096,239.569,390.179,214.611,373.444z M278.183,395.438c-8.798,1.597-23.782-25.494-34.416-47.517   c11.791,6.015,25.102,9.477,39.254,9.477c3.634,0,7.201-0.296,10.72-0.736C291.006,374.286,286.187,393.975,278.183,395.438z    M315.563,412.775c-20.35,5.651-8.167-36.501-2.334-60.904c4.218-1.568,8.301-3.413,12.183-5.604   c2.343,17.786,10.069,33.832,21.516,46.521C337.011,401.597,325.593,409.992,315.563,412.775z";
        node.symbolOffset = [0, '-100%'];
        node.label = {
            normal: {
                show: node.symbolSize > 0
            }
        };
        node.category = node.attributes.modularity_class;
    });
    cluster.links.forEach(function (link) {

    })
    myChart.on('click', function (params) {
        if (params.dataType == 'node') {
            // console.log(params)
            // secondLayer(params.data.category);
            // category = params.data.category;
            // console.log(params.data.name)
            nodename = params.data.name;
            layer++;
            thirdLayer(nodename);
        }
    });
    option = {
        title: {
            text: categories[parseInt(category)].name,
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',

        series: [{
            name: category,
            type: 'graph',
            layout: 'none',
            data: cluster.nodes,
            links: cluster.links,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            //categories: categories,
            roam: true,
            focusNodeAdjacency: true,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'green' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'brown' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            },
            lineStyle: {
                normal: {
                    curveness: 0.3
                }
            }
        }]
    };
    myChart.setOption(option);
}

function thirdLayer(name) {
    //console.log(name)
    var cluster = JSON.parse(JSON.stringify(graph));
    //console.log(cluster)
    removeLinksBySelected(cluster.links, name);
    removeNodesBySelected(cluster.links, cluster.nodes);
    // console.log(cluster)
    // console.log(graph)
    //画力关系图
    var dom = document.getElementById("echarts1");
    var myChart = echarts.init(dom);
    var app = {};
    var option = null;
    var pd2 = 0;

    cluster.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.symbolSize = node.symbolSize * 1.5;
        node.value = node.symbolSize;
        node.symbol = "path://M537.804,174.688c0-44.772-33.976-81.597-77.552-86.12c-12.23-32.981-43.882-56.534-81.128-56.534   c-16.304,0-31.499,4.59-44.514,12.422C319.808,17.949,291.513,0,258.991,0c-43.117,0-78.776,31.556-85.393,72.809   c-3.519-0.43-7.076-0.727-10.71-0.727c-47.822,0-86.598,38.767-86.598,86.598c0,2.343,0.172,4.638,0.354,6.933   c-24.25,15.348-40.392,42.333-40.392,73.153c0,27.244,12.604,51.513,32.273,67.387c-0.086,1.559-0.239,3.107-0.239,4.686   c0,47.822,38.767,86.598,86.598,86.598c14.334,0,27.817-3.538,39.723-9.696c16.495,11.848,40.115,26.67,51.551,23.715   c0,0,4.255,65.905,3.337,82.64c-1.75,31.843-11.303,67.291-18.025,95.979h104.117c0,0-15.348-63.954-16.018-85.307   c-0.669-21.354,6.675-60.675,6.675-60.675l36.118-37.36c13.903,9.505,30.695,14.908,48.807,14.908   c44.771,0,81.597-34.062,86.12-77.639c32.98-12.23,56.533-43.968,56.533-81.214c0-21.994-8.262-41.999-21.765-57.279   C535.71,195.926,537.804,185.561,537.804,174.688z M214.611,373.444c6.942-6.627,12.766-14.372,17.212-22.969l17.002,35.62   C248.816,386.096,239.569,390.179,214.611,373.444z M278.183,395.438c-8.798,1.597-23.782-25.494-34.416-47.517   c11.791,6.015,25.102,9.477,39.254,9.477c3.634,0,7.201-0.296,10.72-0.736C291.006,374.286,286.187,393.975,278.183,395.438z    M315.563,412.775c-20.35,5.651-8.167-36.501-2.334-60.904c4.218-1.568,8.301-3.413,12.183-5.604   c2.343,17.786,10.069,33.832,21.516,46.521C337.011,401.597,325.593,409.992,315.563,412.775z";
        node.symbolOffset = [0, '-100%'];
        node.label = {
            normal: {
                show: node.symbolSize > 0
            }
        };
        node.category = node.attributes.modularity_class;
    });
    cluster.links.forEach(function (link) {

    })
    myChart.on('click', function (params) {
        if (params.dataType == 'node') {
            // console.log(params)
            // secondLayer(params.data.category);
            // category = params.data.category;
            $.ajax({
                statusCode: {
                    200: function () {
                        console.log("success")
                    }
                },
                type: "GET",
                url: 'http://' + ip + "/AssembleAPI/getTreeByTopicForFragment?ClassName=" + "数据结构" + "&TermName=" + params.name,
                data: {},
                dataType: "json",
                success: function (data) {
                    d3.selectAll("svg").remove();
                    svg2 = d3.select("div#mysvg2")
                                    .append("svg")
                                    .attr("width", "100%")
                                    .attr("height", "100%");
                    //pd2 = 0;
                    //分面树根的位置   
                    var root_x=$("#mysvg2").width()/2;
                    var root_y=$("#mysvg2").height()-30; //
                    var seed4 = {
                        x: root_x,
                        y: root_y,
                        name: data.name
                    };
                    var tree4 = buildTree(data, seed4, 0.8);
                    draw_tree(tree4, seed4, svg2, 0.8);
                    /*****************************************************/
                    //对分面树进行缩放
                    multiple = 1;
                    $(window).bind('mousewheel', function(evt) {
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
                        //if(multiple<0.25){return;}
                        d3.selectAll("svg").remove(); //删除之前的svg
                        svg = d3.select("div#mysvg2")
                                    .append("svg")
                                    .attr("width", "100%")
                                    .attr("height", "100%");
                        //$("svg").draggable();
                        var seed0 = {x: root_x, y: root_y, name:data.name};
                        var tree0 = buildTree(data, seed0, multiple);
                        draw_tree(tree0, seed0, svg, multiple);

                        //draw_road(multiple,svg);
                    }); 
                    /*****************************************************/ 
                }
            });
        }
    });
    option = {
        title: {
            text: nodename.toString(),
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',

        series: [{
            name: category,
            type: 'graph',
            layout: 'none',
            data: cluster.nodes,
            links: cluster.links,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            //categories: categories,
            roam: true,
            focusNodeAdjacency: true,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'green' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'brown' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    }
                }
            },
            lineStyle: {
                normal: {
                    curveness: 0.3
                }
            }
        }]
    };
    myChart.setOption(option);
}

function removeByCategory(arr, category) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].category != category) {
            arr.splice(i, 1);
            i--;
        }
    }
}

function removeLinks(arrLink, arrNode) {
    for (var i = 0; i < arrLink.length; i++) {
        var sourceflag = 0;
        var targetflag = 0;
        for (var j = 0; j < arrNode.length; j++) {
            if (arrLink[i].source == arrNode[j].name) {
                sourceflag = 1;
                break;
            }
        }
        if (sourceflag == 1) {
            for (var j = 0; j < arrNode.length; j++) {
                if (arrLink[i].target == arrNode[j].name) {
                    targetflag = 1;
                }
            }
        }
        if (targetflag != 1) {
            arrLink.splice(i, 1);
            i--;
        }
    }
}

function removeLinksBySelected(arrLink, name) {
    for (var i = 0; i < arrLink.length; i++) {
        if (arrLink[i].source != name && arrLink[i].target != name) {
            arrLink.splice(i, 1);
            i--;
        }
    }
}

function removeNodesBySelected(arrLink, arrNode) {
    //console.log(arrLink)
    //console.log(arrNode)
    for (var i = 0; i < arrNode.length; i++) {
        var flag = 0;
        for (var j = 0; j < arrLink.length; j++) {
            if (arrNode[i].name == arrLink[j].source || arrNode[i].name == arrLink[j].target) {
                flag = 1;
                break;
            }
        }
        if (flag == 0) {
            arrNode.splice(i, 1);
            i--;
        }
    }
}

$(document).ready(function () {
    $("#mydiv2").dblclick(function () {
        //init();
        if (layer > 1) {
            layer--;
        }
        if (layer == 1) {
            init()
        }
        if (layer == 2) {
            secondLayer(category);
        }
        if (layer == 3) {

        }
    });
})


init();
//所有主题碎片数据统计结果，需要从后台get信息
$(document).ready(function(){ 
    var myDate7=new Date();
    var myDate6=new Date(myDate7.getTime()-1*24*3600*1000);
    var myDate5=new Date(myDate7.getTime()-2*24*3600*1000);
    var myDate4=new Date(myDate7.getTime()-3*24*3600*1000);
    var myDate3=new Date(myDate7.getTime()-4*24*3600*1000);
    var myDate2=new Date(myDate7.getTime()-5*24*3600*1000);
    var myDate1=new Date(myDate7.getTime()-6*24*3600*1000);
    var shijian1=myDate1.toLocaleDateString();
    var shijian2=myDate2.toLocaleDateString();
    var shijian3=myDate3.toLocaleDateString();
    var shijian4=myDate4.toLocaleDateString();
    var shijian5=myDate5.toLocaleDateString();
    var shijian6=myDate6.toLocaleDateString();
    var shijian7=myDate7.toLocaleDateString();

 

var myChart = echarts.init(document.getElementById('pic0'));

       
// option = {
//     tooltip : {
//         trigger: 'axis'
//     },
//     color :['steelblue','#c3272b'],
//     legend: {
//         data:['文本','图片']
//     },
//     toolbox: {
//         show : true,
//         feature : {
//             mark : {show: true},
//             dataView : {show: true, readOnly: false},
//             magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
//             restore : {show: true},
//             saveAsImage : {show: true}
//         }
//     },
//     calculable : true,
//     xAxis : [
//         {
//             type : 'category',
//             boundaryGap : false,
//             data : [shijian1,shijian2,shijian3,shijian4,shijian5,shijian6,shijian7]
//         }
//     ],
//     yAxis : [
//         {
//             type : 'value'
//         }
//     ],
//     series : [
//         {
//             name:'文本',
//             type:'line',
//             stack: '总量',
//             itemStyle: {normal: {areaStyle: {type: 'default'}}},
//             data:[120, 132, 101, 134, 90, 230, 210]
//         },
//         {
//             name:'图片',
//             type:'line',
//             stack: '总量',
//             itemStyle: {normal: {areaStyle: {type: 'default'}}},
//             data:[20, 32, 11, 34, 20, 30, 18]
//         }
//     ]
// };
option = {
    tooltip : {
        trigger: 'axis'
    },
    color :['steelblue'],
    legend: {
        data:['碎片']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : [shijian1,shijian2,shijian3,shijian4,shijian5,shijian6,shijian7]
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'碎片',
            type:'line',
            stack: '总量',
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data:[120, 132, 101, 134, 90, 230, 210]
        }
    ]
};

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })
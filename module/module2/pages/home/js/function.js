$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: ip+"/DomainAPI/countClassNum",
        data: {},
        dataType: "json",
        success: function(data){
            // console.log(data.ClassNum);
            $('#ClassNum').text("系统中目前共有"+data.ClassNum+"门课程");
        }
    });
});

function jumpClass(){
    // console.log("success");
}

function tianjiaClass(){
    var newclass=$("#newclass").val();
    // console.log(newclass);

    $.ajax({
        type: "GET",
        url: ip+"/DomainAPI/createClass",
        data: {ClassName:$("input[name='ClassName']").val()},
        dataType: "json",
        success: function(data){
            // console.log(data);
            alert(data.success);
        }
    });
}

function updataClassName(){
    $.ajax({
        type: "GET",
        url: ip+"/DomainAPI/updateClassName",
        data: {ClassName:nowOperateClass,NewClassName:$("input[name='NewClassName']").val()},
        dataType: "json",
        async:false,
        success: function(data){
            // console.log(data);
            alert(data.success);
        }
    });
}




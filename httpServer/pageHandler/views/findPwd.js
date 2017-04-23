<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    var showTopInfo = function(){
        $("#topinfo").html("<a id='topinfousr' href='/#'>返回</a>")
    };
    showTopInfo();

    $("#find").click(function(){

        $("#message").text("");
        var UENAME = $.trim($("#UENAME").val());
        var MAIL = $.trim($("#MAIL").val());
        if(UENAME.length <= 0){
            $("#message").text("请输入用户名");
            return;
        }

        var sendData = {
            'UENAME':UENAME
            ,'MAIL':MAIL
        };

        $.ajax({
            'type':"post",
            'url':"/submit_find",
            'async':false,
            'dataType':"json",
            'data':JSON.stringify(sendData),
            success:function(result,textStatus){
                if(result.success){
                    $('#panel_find').empty();
                    var label = $('<label>密码已经发到你的邮箱</label>>');
                    $('#panel_find').append(label);
                }else{
                    $("#message").text(result.message);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    });

    $("#reset").click(function(){
        $("#UENAME").val("");
        $("#MAIL").val("");
        $("#message").text("");
    });
});
</script>

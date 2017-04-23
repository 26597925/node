<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
    var showTopInfo = function(){
        $("#topinfo").html("<a id='topinfousr' href='/#'>返回</a>")
    };
    showTopInfo();

    $("#login").click(function(){

        $("#message").text("");
        var UENAME = $.trim($("#UENAME").val());
        var PASSWORD = $.trim($("#PASSWORD").val());
        var PASSWORD2 =  $.trim($("#PASSWORD2").val());
        var UCNAME = $.trim($("#UCNAME").val());
        var PHONENUMBER = $.trim($("#PHONENUMBER").val());
        var ADDRESS = $.trim($("#ADDRESS").val());
        var ZIPCODE = $.trim($("#ZIPCODE").val());

        if(!(/^1(3|4|5|7|8)\d{9}$/.test(PHONENUMBER))){ 
            $("#message").text("手机号码有误，请重填");  
            return false; 
        } 
        if(UENAME.length <= 0){
            $("#message").text("请输入用户名");
            return;         
        }

        if(PASSWORD.length <= 0){
            $("#message").text("请输入密码");
            return;
        }

        if(PASSWORD2.length <= 0){
            $("#message").text("请再次输入密码");
            return;
        }

        if(PASSWORD!=PASSWORD2){
            $("#message").text("您两次输入的密码不一致");
            return;
        }
        if(UCNAME.length <= 0){
            $("#message").text("请输入中文名");
            return;
        }

        if(PHONENUMBER.length <= 0){
            $("#message").text("请输入电话号码");
            return;
        }

        if(ADDRESS.length <= 0){
            $("#message").text("请输入地址");
            return;
        }

        if(ZIPCODE.length <= 0){
            $("#message").text("请输入邮编");
            return;
        }

        var re= /^[1-9][0-9]{5}$/
        if(re.test(ZIPCODE)){
            $("#message").text("您输入的邮编不正确");
            return;
        }

        var sendData = {
            UENAME:UENAME
            ,PASSWORD:PASSWORD
            ,UCNAME:UCNAME
            ,PHONENUMBER:PHONENUMBER
            ,ADDRESS:ADDRESS
            ,ZIPCODE:ZIPCODE
        };

        $.ajax({
            type:"post",
            url:"/logup_submit",
            async:false,
            dataType:"json",
            data:JSON.stringify(sendData),
            success:function(result,textStatus){
                $("#message").text(result.message);
                if(result.success){
                    window.location.href = "/main";
                }else if(!result.success && result.data == "find password"){

                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    });

    $("#reset").click(function(){
        $("#UENAME").val("");
        $("#PASSWORD").val("");
        $("#PASSWORD2").val("");
        $("#UCNAME").val("");
        $("#PHONENUMBER").val("");
        $("#ADDRESS").val("");
        $("#ZIPCODE").val("");
        $("#message").text("");
    });
});
</script>

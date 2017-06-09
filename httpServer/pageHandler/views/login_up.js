<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript">
var showTopInfo = function(){
    $("#topinfo").html("<a id='topinfousr' href='/#'>返回</a>")
};

var loadImage2 =function ()
{
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('POST','/verifyCode',true);
    // Must include this line - specifies the response type we want
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function(e)
    {
        var arr = new Uint8Array(this.response);
        // Convert the int array to a binary string
        // We have to use apply() as we are converting an *array*
        // and String.fromCharCode() takes one or more single values, not
        // an array.
        var raw = String.fromCharCode.apply(null,arr);
        // This works!!!
        var b64=btoa(raw);
        var dataURL="data:image/jpeg;base64,"+b64;
        document.getElementById("image").src = dataURL;
    };

    xmlHTTP.send();
}

$(document).ready(function(){
    
    showTopInfo();
    loadImage2();
    $("#login").click(function(){
        $("#login").prop('disabled',true);
        $("#message").text("");
        var UENAME = $.trim($("#UENAME").val());
        var PASSWORD = $.trim($("#PASSWORD").val());
        var PASSWORD2 =  $.trim($("#PASSWORD2").val());
        var UCNAME = $.trim($("#UCNAME").val());
        var PHONENUMBER = $.trim($("#PHONENUMBER").val());
        var ADDRESS = $.trim($("#ADDRESS").val());
        //var ZIPCODE = $.trim($("#ZIPCODE").val());
        var EMAIL = $.trim($("#EMAIL").val());

        if(!(/^1(3|4|5|7|8)\d{9}$/.test(PHONENUMBER))){ 
            $("#message").text("手机号码有误，请重填");
            $("#login").prop('disabled',false);
            return false; 
        } 
        if(UENAME.length <= 0){
            $("#message").text("请输入用户名");
            $("#login").prop('disabled',false);
            return;         
        }

        if(PASSWORD.length <= 0){
            $("#message").text("请输入密码");
            $("#login").prop('disabled',false);
            return;
        }

        if(PASSWORD2.length <= 0){
            $("#message").text("请再次输入密码");
            $("#login").prop('disabled',false);
            return;
        }

        if(PASSWORD!=PASSWORD2){
            $("#message").text("您两次输入的密码不一致");
            $("#login").prop('disabled',false);
            return;
        }
        if(UCNAME.length <= 0){
            $("#message").text("请输入中文名");
            $("#login").prop('disabled',false);
            return;
        }

        if(PHONENUMBER.length <= 0){
            $("#message").text("请输入手机号码");
            $("#login").prop('disabled',false);
            return;
        }

        if(ADDRESS.length <= 0){
            $("#message").text("请输入地址");
            $("#login").prop('disabled',false);
            return;
        }

        // if(ZIPCODE.length <= 0){
        //     $("#message").text("请输入邮编");
        //     $("#login").prop('disabled',false);
        //     return;
        // }

        // var re= /^[0-9][0-9]{5}$/;
        // if(!re.test(ZIPCODE)){
        //     $("#message").text("您输入的邮编不正确");
        //     $("#login").prop('disabled',false);
        //     return;
        // }

        var reg = /^(?:[a-z\d]+[_\-\+\.]?)*[a-z\d]+@(?:([a-z\d]+\-?)*[a-z\d]+\.)+([a-z]{2,})+$/;
        if(!reg.test(EMAIL)){
            $("#message").text("您输入的邮箱不正确");
            $("#login").prop('disabled',false);
            return;
        }

        var verifyCode = $.trim($("#verifyCode").val());
        var sendData = {
            'UENAME':UENAME
            ,'PASSWORD':PASSWORD
            ,'UCNAME':UCNAME
            ,'PHONENUMBER':PHONENUMBER
            ,'ADDRESS':ADDRESS
            // ,'ZIPCODE':ZIPCODE
            ,'EMAIL':EMAIL
            ,'VERIFY':verifyCode
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
                    $("#message").empty();
                    $("#message").append($("<label>"+result.message+"</label>"));
                    var href = $('<a href="#">找回密码</a>');
                    href.click(function(event){
                        window.location.href =  "/findpassword";
                        event.preventDefault();
                    });
                    $('#message').append(href);
                    loadImage2();
                }else if(!result.success){
                    $("#message").empty();
                    $("#message").append($("<label>"+result.message+"</label>"));
                    loadImage2();
                }
                $("#login").prop('disabled',false);
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
        // $("#ZIPCODE").val("");
        $("#EMAIL").val("");
        $("#message").text("");
    });
});
</script>

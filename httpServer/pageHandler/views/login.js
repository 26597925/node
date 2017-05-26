<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript">
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

var loadImage = function () {
    // $('<img src="'+ path +'">').load(function() {
    //   $(this).width(width).height(height).appendTo(target);
    // });
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'arraybuffer';
    xhr.onload = function() {
        var blb = new Blob([xhr.response], {type: 'image/png'});
        var url = (window.URL || window.webkitURL).createObjectURL(blb);
        $('#image').src = url;
    }

    xhr.open('POST', '/verifyCode');
    xhr.send();
}
var showTopInfo = function(){
    $("#topinfo").html("<a id='topinfousr' href='/logup#'>注册</a>")
};
$(document).ready(function(){

    
    showTopInfo();
    loadImage2();

    $("#login").click(function(){
        $("#message").text("");
        var user = $.trim($("#username").val());
        if(user.length <= 0){
            $("#message").text("请输入用户名");
            return;         
        }        
        if($("#password").val().length <= 0){
            $("#message").text("请输入密码");
            return;
        }
        //var psw =  $().crypt({method:"sha1",source:$("#password").val()});
        var psw =  $("#password").val();
        var verifyCode = $.trim($("#verifyCode").val());
       // window.location.href = "/login?usr=" + user + "&psw=" + psw;
        $.ajax({
            type:"get",
            url:"/login?usr="+user + "&psw=" + psw+"&verify="+verifyCode,
            async:false,
            dataType:"json",
            success:function(data,textStatus){
                $("#message").text(data.message);
                if(data.success){
                    window.location.href = "/main";
                }else{
                    loadImage2();
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    });

    $("#findpsw").click(function(){
        window.location.href = "/findpassword";
    });

    $("#reset").click(function(){
        $("#username").val("");
        $("#password").val("");
        $("#message").text("");
    });

    $("#findpsw").click(function(){
        window.location.href="/findpassword";
    });
});
</script>

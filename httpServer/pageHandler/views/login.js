<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript">
  $(document).ready(function(){

    var showTopInfo = function(){
        // if(document.cookie){
        //     var usr;
        //     var cookies = document.cookie.split(";");
        //     for(var i = 0; i < cookies.length;i++){
        //         var kv = cookies[i].split("=");
        //         if(kv.length > 1 && $.trim(kv[0]) == "user"){
        //             usr = $.trim(kv[1]);
        //             break;
        //         }
        //     }
        //     if(usr){
        //         $("#topinfo").html("<a id='topinfousr' href='#'>" + usr + "</a>" +
        //             "<a id='topinfoexit' href='#'>退出</a>");
        //     }
        // }
        $("#topinfo").html("<a id='topinfousr' href='/logup#'>注册</a>")
    };
    showTopInfo();
    $("#login").click(function(){
        $("#message").text("");
        var user = $("#username").val();
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
       // window.location.href = "/login?usr=" + user + "&psw=" + psw;
        $.ajax({
            type:"get",
            url:"/login?usr="+user + "&psw=" + psw,
            async:false,
            dataType:"json",
            success:function(data,textStatus){
                $("#message").text(data.message);
                if(data.success){
                    window.location.href = "/main";
                }   
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    });

    $("#reset").click(function(){
        $("#username").val("");
        $("#password").val("");
        $("#message").text("");
    });

    $("#findpsw").click(function(){
        window.location.href="/users/guidereset";
    });
  });
</script>

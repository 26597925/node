<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script type="text/javascript">
    $(document).ready(function(){
        $("#mpswok").click(function(){
            reset();
        });
        $("#mpswcancel").click(function(){
            $("#username").val("");
            $("#userpsw").val("");
        });
    });
var reset = function(){
    var name = $("#username").val();
    var email = $("#userpsw").val();
    if(name.length <= 0){
        $("#mpswmessage").text("请输入用户名");
        return;
    }
    if(email.length <= 0){
        $("#mpswmessage").text("请输入邮箱");
        return;
    }
    name = $().crypt({method:"b64enc",source:name});
    email = $().crypt({method:"b64enc",source:email});
    $("#mpswmessage").text("正在发送...");
    $.ajax({
        "dataType": 'json',
        "contentType": "application/json; charset=utf-8",
        "type": "GET", 
        "url": "/users/reseta?" + "usr=" + name + "&email=" + email,
        "success":function (res,textStatus){
            if(res && res.result == "success"){
                $("#mpswmessage").text("找回密码链接已发送至您的邮箱，请查收!");
            }else if(res && res.result == "noauthority"){
                $("#mpswmessage").text("用户名或邮箱错误");
            }else{
                $("#mpswmessage").text("修改密码失败,请稍后重试");              
            }
        }
    });
};

</script>

<script language="javascript" type="text/javascript" src="/public/js/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.crypt.js"></script>
<script language="javascript" type="text/javascript" src="/public/js/jquery.jqplot.min.js"></script>
<script type="text/javascript">
  $(document).ready(function(){
     $("#login").click(function(){
        
        $("#message").text("");
        var UENAME = $("#UENAME").val();
        console.log(UENAME);
        var PASSWORD = $("#PASSWORD").val()
        var PASSWORD2 =  $("#PASSWORD2").val()
        var UCNAME = $("#UCNAME").val()
        var PHONENUMBER = $("#PHONENUMBER").val()
        var ADDRESS = $("#ADDRESS").val()
        var ZIPCODE = $("#ZIPCODE").val() 

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
        console.log(UENAME);
        var sendData = {
            UENAME:UENAME
            ,PASSWORD:PASSWORD
            ,UCNAME:UCNAME
            ,PHONENUMBER:PHONENUMBER
            ,ADDRESS:ADDRESS
            ,ZIPCODE:ZIPCODE
        };
        console.log(UENAME);
        $.ajax({
            type:"post",
            url:"/logup_submit",
            async:false,
            dataType:"json",
            data:sendData,
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

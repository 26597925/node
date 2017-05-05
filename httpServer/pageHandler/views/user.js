oojs$.ns("com.stock.user");
oojs$.com.stock.user=oojs$.createClass({
// GROUPID
// UENAME
// UCNAME
// PHONENUMBER
// PASSWORD
// ADDRESS
// ZIPCODE
// TYPEID
// EMAIL
    list_benchmark_head: [
        {
            ID:"UENAME",
            NAME:"用户名"
        }
        ,{
            ID:"UCNAME",
            NAME:"中文名"
        }
        ,{
            ID:"PASSWORD",
            NAME:"密码"
        }
        ,{
            ID:"PHONENUMBER",
            NAME:"电话"
        }
        ,{
            ID:"EMAIL",
            NAME:"邮箱"
        }
        ,{
            ID:"ADDRESS",
            NAME:"地址"
        }
        ,{
            ID:"ZIPCODE",
            NAME:"邮编"
        }
    ]//增加修改基准数据
    ,userInfo:[]
	,init:function(){

        var self = this;
        $( "#user_tabs" ).tabs();
        $( "#user_tabs_a1" ).click({"self":self},self.clk_user_tabs_a1);
        $( "#user_tabs_a2" ).click({"self":self},self.clk_user_tabs_a2);
        $( "#user_tabs_a3" ).click({"self":self},self.clk_user_tabs_a3);
        $( '#user' ).click(function(){
            self.clk_user_tabs_a1(self);
        });

	}

    ,clk_user_tabs_a1:function(self){
        console.log(self);
        self.loadUserInfo(function(){
            if(arguments.length==0){
                self.appendTB_userInfo();
            }else{
                console.log("error");
            }
        });
    }

    ,clk_user_tabs_a2:function(self){

    }

    ,clk_user_tabs_a3:function(self){

    }

    ,appendTB_userInfo:function(){
        var self = this;
        var item = {};
        for(var elm in self.userInfo[0]){
            item[elm] = {};
            item[elm]["ELEMENT"] = self.userInfo[0][elm];
        }

        $('#user_tabs_1').empty();
        var tb = $('<table></table>', {
            'class':"display dataTable"
        });
        tb.appendTo($('#user_tabs_1'));

        oojs$.appendTB_item_D2(tb, self.list_benchmark_head, item);
    }

    ,loadUserInfo:function(callback){
        var self = this;
        oojs$.httpGet("/getUserInfo",function(result,textStatus,token){
            if(result.success){
                console.log(result);
                self.userInfo = [];
                self.userInfo = result.data;
                if(callback){
                    callback()
                }
                
            }else{
                oojs$.showError(result.message);
                if(callback){
                    callback('error');
                }
            }
        });
    }
});

var user = new oojs$.com.stock.user();
oojs$.addEventListener("ready",function(){
    user.init();
});

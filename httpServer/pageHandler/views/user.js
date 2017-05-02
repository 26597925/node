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
	,init:function(){
		$( "#user_tabs" ).tabs();
        
	}
});

var user = new oojs$.com.stock.user();
oojs$.addEventListener("ready",function(){
    user.init();
});

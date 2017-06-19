oojs$.ns("com.stock.dictTrade");
oojs$.com.stock.dictTrade=oojs$.createClass({
    list_benchmark_head: [
        {
            ID:"TRADEID",
            NAME:"所属券商"
        }
        ,{
            ID:"ACCOUNTID",
            NAME:"券商帐号"
        }
        ,{
            ID:"PASSWORD",
            NAME:"券商密码"
        }
        ,{
            ID:"MAXBUY",
            NAME:"总额度"
        }
        ,{
            ID:"BUYCOUNT",
            NAME:"单日最大买入股数"
        }
        ,{
            ID:"BUYAMOUNT",
            NAME:"单次最大额度"
        }
        ,{
            ID:"CTRL",
            NAME:"操作"
        }
    ]//增加修改基准数据
	,dictTrade_list_body: []//券商列表数据
    ,is_load_tradelist:false
	,init:function(){
        var self = this;
		$( "#dictTrade_tabs" ).tabs();
        this.appendTB_add();
        $("#dictTrade").click(this.dictTrade_tab1_click);
        if(oojs$.getPanelID() == 0){
            if(self.dictTrade_list_body.length == 0){
                $( "#dictTrade_tabs" ).tabs({ 'selected': 1 });
            }
        }
	}
	,dictTrade_tab1_click:function(){
	    var self = dictTrade;
        dictTrade.load_userAccount(function(){
            self.appendTB_list();
        });
	}
    ,handler_trd_del:function(){
		var USERID = arguments[0];
    	var ACCOUNTID = arguments[1];
    	var TRADEID =  arguments[2];

        oojs$.showInfo("您确定删除帐号!",function(){
            var result = arguments[0];
            if( result == "yes" ){
                dictTrade.delete_userAccount( TRADEID,ACCOUNTID );
            }else if( result == "yes" ){
                return;
            }
        })
	}
    ,handler_trd_chg:function(){
        var USERID = arguments[0];
        var ACCOUNTID = arguments[1];
        var TRADEID =  arguments[2];
        // console.log(JSON.stringify(arguments));
        dictTrade.appendTB_modify( TRADEID,ACCOUNTID );
	}
    ,handler_trd_reset:function(event){
        event.data = null;
        dictTrade.appendTB_add();
    }
    ,handler_trd_add:function(event){
        dictTrade.sub_userAccount(dictTrade.list_benchmark_head,event.data,"add");
    }
    ,handler_trd_mdy:function(event){
        dictTrade.sub_userAccount(dictTrade.list_benchmark_head,event.data,"mdy");
    }
	,handler_trd_reback:function(event){
        dictTrade.appendTB_list();
    }
    
	,getRecord_dt_list : function(TRADEID,ACCOUNTID){
		if(this.dictTrade_list_body.length>0){
			for(var i = 0; i < this.dictTrade_list_body.length; i++){
				if(this.dictTrade_list_body[i]['TRADEID']==TRADEID && this.dictTrade_list_body[i]['ACCOUNTID']==ACCOUNTID){
					return this.dictTrade_list_body[i];
				}
			}
		}
	}
	,getRecord_dt_selectList : function(TRADEID){
		if(preload.TRADE.length>0){
			for(var i =0; i< preload.TRADE.length; i++){
				if( preload.TRADE[i]["ID"]==TRADEID ){
					return preload.TRADE[i]["NAME"];
				}
			}
		}
	}
	,delete_userAccount : function(){
		console.log('this.delete_userAccount',arguments);
		var sendData = {
	        TRADEID:arguments[0]
	        ,ACCOUNTID:arguments[1]
	    };
	    var self = this;
	    oojs$.httpPost_json("/delete_userAccount",sendData,function(result,textStatus,token){
            if(result.success){

                dictTrade.dictTrade_tab1_click();

            }
		});
	}
    ,appendTB_trade_body: function( tb, head, body ){
        var tr = null;
        for(var i = 0; i < head.length; i++){
            if(!body.hasOwnProperty( head[i]["ID"] )){
                continue;
            }
            tr = $('<tr></tr>').appendTo(tb);
            
            switch (head[i]["ID"]){
                case "TRADEID":
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).text(head[i]["NAME"]+":");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(body[ head[i]["ID"] ]);
                    break;
                case "ACCOUNTID":
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).text(head[i]["NAME"]+":");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(body[ head[i]["ID"] ]);
                    break;
                case "PASSWORD":
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).text(head[i]["NAME"]+":");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(body[ head[i]["ID"] ]);
                    break;
                case "MAXBUY":
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).text(head[i]["NAME"]+":");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(body[ head[i]["ID"] ]);
                    break;
                case "BUYCOUNT":


                    $('<td></td>',{ 'class':"td"}).appendTo(tr).text(head[i]["NAME"]+":");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(body[ head[i]["ID"] ]);
                    break;
                case "BUYAMOUNT":

                    $('<td></td>',{ 'class':"td"}).appendTo(tr).text(head[i]["NAME"]+":");
                    $('<td></td>',{ 'class':"td"}).appendTo(tr).append(body[ head[i]["ID"] ]);
                    break;
                // default:
                // 	$('<td></td>',{ 'class':"td"}).appendTo(tr);
                // 	$('<td></td>',{ 'class':"td"}).appendTo(tr);
                // 	break;;
            }
        }
        tr = $('<tr></tr>').appendTo(tb);
    }
	,sub_userAccount : function(head,body,type){
        var self = this;
		var sendData = {};
        for(var i = 0; i < head.length; i++){
            if(!body.hasOwnProperty( head[i]["ID"] )){
                continue;
            }

            switch (head[i]["ID"]){
                case "TRADEID":
                    sendData[head[i]["ID"]] = body[head[i]["ID"]].val();
                    if(String(sendData['TRADEID'])=="-1"){
                        oojs$.showError("请选择所属券商");
					}
                    break;
                case "ACCOUNTID":
                    sendData[head[i]["ID"]] = body[head[i]["ID"]].val();
                    if( String(sendData[head[i]["ID"]]).trim().length<3 ){
                        oojs$.showError("请输入正确的券商帐号");
                    }
                    break;
                case "PASSWORD":
                    sendData[head[i]["ID"]] = body[head[i]["ID"]].val();
                    if(String(sendData[head[i]["ID"]]).trim().length<3){
                        oojs$.showError("请输入正确的密码");
                    }
                    break;
                case "MAXBUY":
                    var div = body[head[i]["ID"]];
                    var input = div.find( "input" );
                    var select = div.find( "select" );
                    console.log('MAXBUY\n',input.val(),select.val());
                    if( 
                        !(/^\+?[0-9][0-9]*$/.test( parseInt(input.val()) ) ) 
                    ){
                        oojs$.showError("请输入正确的总额度数字");
                    }
                    sendData[head[i]["ID"]] = parseInt(input.val());
                    if(select.val() == 0){
                        sendData[head[i]["ID"]] = parseInt(sendData[head[i]["ID"]])*10000;
                    }
                    
                	
                    break;
                case "BUYCOUNT":
                    sendData[head[i]["ID"]] = body[head[i]["ID"]].val();
                    if(!(/^\+?[0-9][0-9]*$/.test(sendData[head[i]["ID"]]))){
                        oojs$.showError("请输入正确的单日最大买入股数数字");
                    }
                    break;
                case "BUYAMOUNT":
                    sendData[head[i]["ID"]] = body[head[i]["ID"]].find( "input" ).val();
                    if(!(/^\+?[0-9][0-9]*$/.test(sendData[head[i]["ID"]]))){
                        oojs$.showError("请输入正确的单次最大额度数字");
                    }
                    break;
            }
        }

        

		var url = "";
		if(type == "add"){
            url="/add_userAccount";
		}else if(type == "mdy"){
            url="/modify_userAccount";
		}

        oojs$.httpPost_json(url,sendData,function(result,textStatus,token){
            if(result.success){
            for(var i in body){
                body[i] = null;
                delete body[i];
            }
            body = null;
                dictTrade.dictTrade_tab1_click();
                $( "#dictTrade_tabs" ).tabs({ 'selected': 0 });
            }else{
                console.log("sub_userAccount result:",result.message);
                oojs$.showError(result.message);
            }
        });

	}

	, create_dictTrade_Select: function(optID){

		var select_trade = $('<select></select>',{

        });

		select_trade.append("<option value='-1'>请选择券商</option>");

        for(var sId = 0; sId < preload.TRADE.length; sId++)
        {

            select_trade.append("<option value='"
                +preload.TRADE[sId]["ID"]+"'>"+preload.TRADE[sId]["NAME"]+"</option>");
        }

        if(optID!=null){
            select_trade.val(optID);
		}

		return select_trade;

	}

	, appendTB_modify : function( TRADEID, ACCOUNTID ){

		var self = this;
		var record =  this.getRecord_dt_list(TRADEID,ACCOUNTID);

		console.log("appendTB_modify",JSON.stringify(record));

        $("#dictTrade_tabs_1").empty();
        var tb = $('<table></table>', {
            'style':"margin:0 auto;"
            ,'class':'dataTable cellspacing table'
        }).appendTo($('#dictTrade_tabs_1'));

        var  head, body;
        head = self.list_benchmark_head;
		//{"USERID":20000,"TRADEID":3,"ACCOUNTID":"5890000049","CANAME":"xiayangang","PASSWORD":"207623","MAXBUY":1000,"BUYCOUNT":0,"BUYAMOUNT":0}
        body = {
            "TRADEID":self.create_dictTrade_Select(record["TRADEID"]).prop("disabled",true)
            ,"ACCOUNTID":$('<input type="text" value="'+record["ACCOUNTID"]+'" ></input>').prop("disabled",true)
            ,"PASSWORD":$('<input type="text" value="'+record["PASSWORD"]+'"></input>')
            ,"MAXBUY":null
            ,"BUYCOUNT":$('<input type="text" value="'+record["BUYCOUNT"]+'" ></input><label style="color: red; font-size: 80%;">(*注：最大值99)</label>')
            ,"BUYAMOUNT":null
            // $('<input type="text" value="'+record["BUYAMOUNT"]+'" ></input>
            //     <label style="color: red; font-size: 80%;">(*注：最大值不超过总额度)</label>')
        };

        var value2 = parseInt(record["BUYAMOUNT"]);
        var input2 = $('<input type="text" value="'+record["BUYAMOUNT"]+'" ></input>');
        var select2 = $('<select><select>');
        (new oojs$.com.stock.component.RMB()).init(input2,select2,'元');
        var label2 = $('<label style="color: red; font-size: 80%;">(*注：最大值不超过总额度)</label>');
        var div2 = $('<div></div>');
        div2.append(input2);
        div2.append(select2);
        div2.append(label2);
        body['BUYAMOUNT']=div2;

        var value = parseInt(record["MAXBUY"]);
        var input = $('<input type="text" value="'+record["MAXBUY"]+'" ></input>');
        var select = $('<select><select>');
        (new oojs$.com.stock.component.RMB()).init(input,select,'元');
        var label = $('<label style="color: red; font-size: 80%;">(*注：最大值9999)</label>');
        var div = $('<div></div>');
        div.append(input);
        div.append(select);
        div.append(label);
        body['MAXBUY']=div;

        self.appendTB_trade_body ( tb, head, body );
        tr = $('<tr></tr>').appendTo(tb);
        var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);
        $('<input></input>',{type:"button", name:"",value:"提交"}).appendTo(td).click(
            body,
            self.handler_trd_mdy
        );;
        $('<input></input>',{type:"button", name:"",value:"返回"}).appendTo(td).click(
            body,
            this.handler_trd_reback
        );
	}

	,appendTB_add : function( TRADEID, ACCOUNTID ){
		var self = this;
        $("#dictTrade_tabs_2").empty();

        var tb = $('<table></table>', {
            'style':"margin:0 auto;"
            ,'class':'dataTable cellspacing table'
        }).appendTo($('#dictTrade_tabs_2'));

        var  head, body;
        head = self.list_benchmark_head;

        body = {
        	"TRADEID":self.create_dictTrade_Select("TRADEID_add")
			,"ACCOUNTID":$('<input type="text" value="" ></input>')
			,"PASSWORD":$('<input type="text" value=""></input>')
			,"MAXBUY":null
            ,"BUYCOUNT":$('<input type="text" value="2" ></input><label style="color: red; font-size: 80%;">(*注：最大值99)</label>')
			,"BUYAMOUNT":$('<input type="text" value="100" ></input><label style="color: red; font-size: 80%;">(*注：最大值不超过总额度)</label>')
        };

        var input2 = $('<input type="text" value="100" >');
        var select2 = $('<select><select>');
        (new oojs$.com.stock.component.RMB()).init(input2,select2,'万元');
        var label2 = $('<label style="color: red; font-size: 80%;">(*注：最大值不超过总额度)</label>');
        var div2 = $('<div></div>');
        div2.append(input2);
        div2.append(select2);
        div2.append(label2);
        body['BUYAMOUNT']=div2;


        var input = $('<input type="text" value="100" >');
        var select = $('<select><select>');
        (new oojs$.com.stock.component.RMB()).init(input,select,'万元',input2);
        var label = $('<label style="color: red; font-size: 80%;">(*注：最大值9999万元)</label>');
        var div = $('<div></div>');
        div.append(input);
        div.append(select);
        div.append(label);
        body['MAXBUY']=div;

        self.appendTB_trade_body ( tb, head, body );

		tr = $('<tr></tr>').appendTo(tb);
		var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);
        $('<input></input>',{type:"button",id:"user_account_add",name:"",value:"新增"}).appendTo(td);
		$('<input></input>',{type:"button",id:"user_account_reset",name:"",value:"重置"}).appendTo(td);

        $("#user_account_add").click(
            body,
			this.handler_trd_add
        );

        $("#user_account_reset").click(
            body,
			this.handler_trd_reset
        );
	}

	, appendTB_list : function(){
        var self = this;
        var panel,list_head,list_body;

        panel = $('#dictTrade_tabs_1');
        list_head = self.list_benchmark_head;
        list_body = [];

        for(var elm = 0; elm < this.dictTrade_list_body.length; elm++){
            list_body[elm] = {};
            list_body[elm]['TRADEID'] = {ELEMENT:this.getRecord_dt_selectList(this.dictTrade_list_body[elm]['TRADEID'])};
            list_body[elm]['ACCOUNTID'] = {ELEMENT:this.dictTrade_list_body[elm]['ACCOUNTID']};
            list_body[elm]['PASSWORD'] = {ELEMENT:oojs$.changeToStar(this.dictTrade_list_body[elm]['PASSWORD'])};
            list_body[elm]['MAXBUY'] = {ELEMENT:this.dictTrade_list_body[elm]['MAXBUY']};
            list_body[elm]['BUYCOUNT'] = {ELEMENT:this.dictTrade_list_body[elm]['BUYCOUNT']};
            list_body[elm]['BUYAMOUNT'] = {ELEMENT:this.dictTrade_list_body[elm]['BUYAMOUNT']};
            list_body[elm]['CTRL'] = {ELEMENT:$(
            	'<input type="button" name="12" value="删除" ' +
				'onclick="dictTrade.handler_trd_del('+
					this.dictTrade_list_body[elm]['USERID']+','+
					this.dictTrade_list_body[elm]['ACCOUNTID']+', '+
					this.dictTrade_list_body[elm]['TRADEID']+
				')"; >'
				+
                '<input type="button" name="12" value="修改"' +
				' onclick="dictTrade.handler_trd_chg('+
					this.dictTrade_list_body[elm]['USERID']+','+
					this.dictTrade_list_body[elm]['ACCOUNTID']+', '+
					this.dictTrade_list_body[elm]['TRADEID']+
				');" >'
			)};
		}
        
        oojs$.appendTB_list(panel,list_head,list_body);

	}

	,load_userAccount: function(callback,token){
		var self = this;
        oojs$.httpGet("/select_userAccount",function(result,textStatus,token){
			if(result.success){
                self.is_load_tradelist = true;
				self.dictTrade_list_body = [];
                console.log("trade\n","load_userAccount\n",JSON.stringify(result.data));
                self.dictTrade_list_body = result.data;
			}else{
                oojs$.showError(result.message);
			}
			if(callback){
                callback(token);
            }
        });
	}
});

var dictTrade = new oojs$.com.stock.dictTrade();
oojs$.addEventListener("ready",function(){
	dictTrade.init();
});

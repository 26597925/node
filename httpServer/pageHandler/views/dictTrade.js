oojs$.ns("com.stock.dictTrade");
oojs$.com.stock.dictTrade=oojs$.createClass({
	dictTrade_selectList: [ 
	//[id,label,title]
	//[id,label]
	]
	,dictTrade_list_head: ["id","所属的券商","券商的登录帐号","券商的登录密码","最大额度","最大数量","买入比例","拆分数","操作"]
	,dictTrade_list_body: [
	//"USERID","TRADEID","ACCOUNTID","PASSWORD","MAXBUY","BUYAMOUNT","BUYPERCENT","SPLITCOUNT"
	//btn[name,value,id+'_dict']
	]
	,dictTrade_record:null
	,dictTrade_selectElement: null
	,init:function(){
        // oojs$.showInfo("",function(){
        // 	console.log("showInfo",arguments)
        // });
        // oojs$.showError("",function(){
        //
        // });
		$( "#dictTrade_tabs" ).tabs();
		this.load_dictTrade();
        this.appendTB_add();
        $("#dictTrade").click(this.nvgTradeClick);
	}
	,nvgTradeClick:function(){
        dictTrade.load_dictTrade();
	}
    , dictTrade_clickHandler : function(){
        console.log(　'dictTrade_clickHandler id:',this.id,'name: ', this.name, 'value: ',this.value);
		//订阅
        if(this.type == "submit"){

            if(this.textContent == "删除"){
                var r = confirm("确定删除帐号!");
                if (r == true) {
                    dictTrade.delete_userAccount( this.value,this.id.replace("_dict","") );
                }

            }else if(this.textContent == "修改"){


                $('#dictTrade_list_body').hide();
                dictTrade.appendTB_modify(this.value, this.id.replace("_dict","") );

            }
        }else if(this.type == "button"){
            if(this.value == "新增"){
                var r = confirm("请检查信息填写是否正确");
                if (r == true) {
                    this.add_userAccount();
                }

                // console.log("select",$("#dictTrade_account").val());
                // console.log("select",$("#dictTrade_pwd").val());
                // console.log("select",dictTrade_selectElement.val());

            }else if(this.value == "提交"){
                dictTrade.modify_userAccount();
            }else if(this.value == "重置"){
                console.log(this.name)
                dictTrade.reset_dictTrade_Account();
            }else if(this.value == "返回"){
                dictTrade.init_addvalue();
                dictTrade.appendTB_list();
                $('#dictTrade_list_body').show();
            }
        }
    }
	, getRecord_dt_list : function(TRADEID,ACCOUNTID){
		if(this.dictTrade_list_body.length>0){
			for(var i = 0; i < this.dictTrade_list_body.length; i++){
				if(this.dictTrade_list_body[i]['TRADEID']==TRADEID && this.dictTrade_list_body[i]['ACCOUNTID']==ACCOUNTID){
					return this.dictTrade_list_body[i];
				}
			}
		}
	}
	, getRecord_dt_selectList : function(TRADEID){
		if(this.dictTrade_selectList.length>0){
			for(var i =0; i< this.dictTrade_selectList.length; i++){
				if( this.dictTrade_selectList[i][0]==TRADEID ){
					return this.dictTrade_selectList[i][1];
				}
			}
		}
	}
	, delete_userAccount : function(){
		console.log('this.delete_userAccount',arguments)
		var sendData = {
	        TRADEID:arguments[0]
	        ,ACCOUNTID:arguments[1]
	    };
	    var myself = this;
	    $.ajax({
	        type:"post",
	        url:"/delete_userAccount",
	        async:false,
	        dataType:"json",
	        data:sendData,
	        success:function(data,textStatus){
	            if(data.success){
	            	myself.load_userAccount(); 
	            }
	        },
	        beforeSend: function(xhr){
	            xhr.withCredentials = true;
	        }
	    });
	}

	, modify_userAccount : function(){
		
	    var sendData = {
	    	TRADEID:dictTrade_selectElement.val()
	        ,ACCOUNTID:$("#dictTrade_account").val()
	        ,PASSWORD:$("#dictTrade_pwd").val()
	        // ,PASSWORD:$("#dictTrade_pwd").val()
	        ,MAXBUY:$("#dictTrade_MAXBUY").val()
	        ,BUYAMOUNT:$("#dictTrade_BUYAMOUNT").val()
	        ,BUYPERCENT:$("#dictTrade_BUYPERCENT").val()
	        ,SPLITCOUNT:$("#dictTrade_SPLITCOUNT").val()
	    }
	    var myself = this;
	    $.ajax({
	        type:"post",
	        url:"/modify_userAccount",
	        async:false,
	        dataType:"json",
	        data:sendData,
	        success:function(data,textStatus){
	            
	            if(data.success){
	                myself.load_userAccount(); 
	            }
	        },
	        beforeSend: function(xhr){
	            xhr.withCredentials = true;
	        }
	    });
	}
	, add_userAccount : function(){
		console.log(arguments)

		var sendData = {
	        TRADEID:dictTrade_selectElement.val()
	        ,ACCOUNTID:$("#dictTrade_account").val()
	        ,PASSWORD:$("#dictTrade_pwd").val()
	        ,MAXBUY:$("#dictTrade_MAXBUY").val()
	        ,BUYAMOUNT:$("#dictTrade_BUYAMOUNT").val()
	        ,BUYPERCENT:$("#dictTrade_BUYPERCENT").val()
	        ,SPLITCOUNT:$("#dictTrade_SPLITCOUNT").val()
	    };
	    console.log("add_userAccount",JSON.stringify(sendData))
	    var  myself = this;
	    $.ajax({
	        type:"post",
	        url:"/add_userAccount",
	        async:false,
	        dataType:"json",
	        data:sendData,
	        success:function(data,textStatus){
	            if(data.success){
	            	myself.load_userAccount();
	            }
	        },
	        beforeSend: function(xhr){
	            xhr.withCredentials = true;
	        }
	    });
	}
	, reset_dictTrade_Account : function(){
		$("#dictTrade_account").val('');
		$("#dictTrade_pwd").val('');
		dictTrade_selectElement.val(0)
	}
	, init_addvalue : function(){
		$("#dictTrade_account").val(Math.ceil(2147483647*Math.random()));
		$("#dictTrade_pwd ").val('12345678');
		$("#dictTrade_MAXBUY").val(2147480000);
		$("#dictTrade_BUYAMOUNT").val(2147480000);
		$("#dictTrade_BUYPERCENT").val('0.5');
		$("#dictTrade_SPLITCOUNT").val('1');
	}
	, init_modifyvalue : function(record)
	{
		//"USERID","TRADEID","ACCOUNTID","PASSWORD","MAXBUY","BUYAMOUNT","BUYPERCENT","SPLITCOUNT"
		// $("#dictTrade_account").val(record['TRADEID']);
		this.dictTrade_selectElement.val(record['TRADEID'])
		$("#dictTrade_account").val(record['ACCOUNTID']);
		$("#dictTrade_pwd ").val(record['PASSWORD']);
		$("#dictTrade_MAXBUY").val(record['MAXBUY']);
		$("#dictTrade_BUYAMOUNT").val(record['BUYAMOUNT']);
		$("#dictTrade_BUYPERCENT").val(record['BUYPERCENT']);
		$("#dictTrade_SPLITCOUNT").val(record['SPLITCOUNT']);
	}
	, load_dictTrade : function(){
		this.init_addvalue();
		var myself = this;
		if(this.dictTrade_selectList.length==0){
			
			$.ajax({
		        type:"get",
		        url:"/select_dictTrade",
		        async:false,
		        dataType:"json",
		        success:function(data,textStatus){
		            if(data.success){
		            	myself.dictTrade_selectList = [];
		            	for(var i in data.data){
		            		myself.dictTrade_selectList.push([data.data[i]["ID"],data.data[i]["NAME"]]);
		            	}
                        $("#dict_trade_opt").append(myself.create_dictTrade_Select());
		            	myself.load_userAccount();
		            }
		        },
		        beforeSend: function(xhr){
		            xhr.withCredentials = true;
		        }
		    });
		}else{
			myself.load_userAccount();
		}
	}
	, create_dictTrade_Select: function(){
		
		this.dictTrade_selectElement = $('<select></select>',{
			id:'dictTrade_select'
		})

		for(var sId = 0; sId < this.dictTrade_selectList.length; sId++)
		{
			if( 3 <= this.dictTrade_selectList[sId].length )
			{
				if(this.dictTrade_selectList[sId][2])
				{
					this.dictTrade_selectElement.append("<option value='"
						+this.dictTrade_selectList[sId][0]
						+"' title='"+this.dictTrade_selectList[sId][2]+"'>"+this.dictTrade_selectList[sId][1]+"</option>");
				}else{
					this.dictTrade_selectElement.append("<option value='"
						+this.dictTrade_selectList[sId][0]+"'>"
						+this.dictTrade_selectList[sId][1]+"</option>");
				}
				
			}else if( 2 == this.dictTrade_selectList[sId].length )
			{
				this.dictTrade_selectElement.append("<option value='"
					+this.dictTrade_selectList[sId][0]+"'>"+this.dictTrade_selectList[sId][1]+"</option>");
			}
		}

		// this.dictTrade_selectElement.val("maxMem");
		return this.dictTrade_selectElement;
		// $("#dict_trade_opt").append(this.dictTrade_selectElement);
	}

	, appendTB_modify : function( TRADEID, ACCOUNTID ){
		//"USERID","TRADEID","ACCOUNTID","PASSWORD","MAXBUY","BUYAMOUNT","BUYPERCENT","SPLITCOUNT"
		var myself = this;
		var record =  this.getRecord_dt_list(TRADEID,ACCOUNTID);
		console.log("appendTB_modify",JSON.stringify(record));

        $("#dictTrade_tabs_1").empty();
        var tb = $('<table></table>', {
            'style':"margin:0 auto;"
            ,'class':'dataTable cellspacing table'
        }).appendTo($('#dictTrade_tabs_1'));

        var tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('所属的券商：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<div id="dictTrade_opt_modify" ></div>'));
        $("#dictTrade_opt_modify").append(myself.create_dictTrade_Select());
        tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('券商的登录帐号：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_account" value="" />'));

        tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('券商的登录密码：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_pwd" value="" />'));

        tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('最大额度：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_MAXBUY" value="" />'));
        tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('最大数量：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_BUYAMOUNT" value="" />'));

        tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('买入比例：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_BUYPERCENT" value="" />'));

        tr = $('<tr></tr>').appendTo(tb);
        $('<td></td>',{ class:"td"}).appendTo(tr).text('拆分数：');
        $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_SPLITCOUNT" value="" />'));

        tr = $('<tr></tr>').appendTo(tb);
        var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);
        $('<input></input>',{type:"button",id:"user_account_submit",name:"",value:"提交"}).appendTo(td);
        $('<input></input>',{type:"button",id:"user_account_back",name:"",value:"返回"}).appendTo(td);

        this.init_modifyvalue(record);

        $("#user_account_submit").click(
            this.dictTrade_clickHandler
        );

        $("#user_account_back").click(
            this.dictTrade_clickHandler
        );

	}
	, appendTB_add : function( TRADEID, ACCOUNTID ){
		var myself = this;
		$("#dictTrade_tabs_2").empty();
		var tb = $('<table></table>', {
			'style':"margin:0 auto;"
			,'class':'dataTable cellspacing table'
		}).appendTo($('#dictTrade_tabs_2'));
		
		var tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('所属的券商：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<div id="dictTrade_opt_add" ></div>'));
        $("#dictTrade_opt_add").append(myself.create_dictTrade_Select());

		tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('券商的登录帐号：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_account" value="" />'));

		tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('券商的登录密码：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_pwd" value="" />'));

		tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('最大额度：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_MAXBUY" value="" />'));

		tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('最大数量：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_BUYAMOUNT" value="" />'));

		tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('买入比例：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_BUYPERCENT" value="" />'));

		tr = $('<tr></tr>').appendTo(tb);
		$('<td></td>',{ class:"td"}).appendTo(tr).text('拆分数：');
		$('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="dictTrade_SPLITCOUNT" value="" />'));

		tr = $('<tr></tr>').appendTo(tb);
		var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);
		$('<input></input>',{type:"button",id:"user_account_add",name:"",value:"新增"}).appendTo(td);
		$('<input></input>',{type:"button",id:"user_account_reset",name:"",value:"重置"}).appendTo(td);

        this.init_addvalue();

        $("#user_account_add").click(
            this.dictTrade_clickHandler
        );

        $("#user_account_reset").click(
            this.dictTrade_clickHandler
        );
		//"USERID","TRADEID","ACCOUNTID","PASSWORD","MAXBUY","BUYAMOUNT","BUYPERCENT","SPLITCOUNT"
		
		
	}
	, appendTB_list : function(){
		$("#dictTrade_tabs_1").empty();
		var tb = $('<table></table>', {
			'id': "dictTrade_list_body_tb",
			'class':'display dataTable'
		}).appendTo($('#dictTrade_tabs_1'));

		var thead = $('<thead></thead>').appendTo(tb);
		var tr = $('<tr></tr>').appendTo(thead);
		
		for(var elm = 0; elm < this.dictTrade_list_head.length; elm++){
			var th = $('<th></th>',
			{class:"ui-state-default"
			}).appendTo(tr).text(this.dictTrade_list_head[elm]);
		}

		var tbody = $('<tbody></tbody>').appendTo(tb);
		
		for(var elm = 0; elm < this.dictTrade_list_body.length; elm++){
			var tr=null;
			if(elm%2==0){
				tr = $('<tr></tr>',{class:"odd"}).appendTo(tbody);
			}else{
				tr = $('<tr></tr>',{class:"even"}).appendTo(tbody);
			}

			$('<td></td>').appendTo(tr).text(elm);
			$('<td></td>').appendTo(tr).text(this.getRecord_dt_selectList(this.dictTrade_list_body[elm]['TRADEID']));
			$('<td></td>').appendTo(tr).text(this.dictTrade_list_body[elm]['ACCOUNTID']);
			$('<td></td>').appendTo(tr).text(this.dictTrade_list_body[elm]['PASSWORD']);
			$('<td></td>').appendTo(tr).text(this.dictTrade_list_body[elm]['MAXBUY']);
			$('<td></td>').appendTo(tr).text(this.dictTrade_list_body[elm]['BUYAMOUNT']);
			$('<td></td>').appendTo(tr).text(this.dictTrade_list_body[elm]['BUYPERCENT']);
			$('<td></td>').appendTo(tr).text(this.dictTrade_list_body[elm]['SPLITCOUNT']);
			var td = $('<td></td>').appendTo(tr);
			var button = $('<button></button>',{
						'id':this.dictTrade_list_body[elm]['ACCOUNTID']+"_dict",
					'name':this.dictTrade_list_body[elm]['USERID'],
					'value':this.dictTrade_list_body[elm]['TRADEID'],
					'text':'删除'
				}).click(this.dictTrade_clickHandler);
			td.append(button);
            td.append(" ");
			var button = $('<button></button>',{
					'id':this.dictTrade_list_body[elm]['ACCOUNTID']+"_dict",
					'name':this.dictTrade_list_body[elm]['USERID'],
					'value':this.dictTrade_list_body[elm]['TRADEID'],
					'text':'修改'
				}).click(this.dictTrade_clickHandler);
			td.append(button);
		}

		this.show_dictTrade_Page();
	}
	, show_dictTrade_Page : function(){
		$("#dict_trade_panel").show();
	}
	, load_userAccount : function(){
		var myself = this;
		$.ajax({
		    type:"get",
		    url:"/select_userAccount",
		    async:false,
		    dataType:"json",
		    success:function(data,textStatus){
		        
		        if(data.success){
		        	console.log(data.data);
		        	myself.dictTrade_list_body = [];
		        	for(var i=0; i<data.data.length; i++){
		        		myself.dictTrade_list_body.push(data.data[i]);
		        	}
		        }
		        myself.appendTB_list();
		    },
		    beforeSend: function(xhr){
		        xhr.withCredentials = true;
		    }
		});
		// var progressBar = document.getElementById("p"),
		// var client = new XMLHttpRequest();
		// client.open("GET", "select_userAccount");
		// client.setRequestHeader("Content-Type", "text/json;charset=UTF-8");
		// client.onprogress = function(pe) {
		// 	if(pe.lengthComputable) {
		//  		progressBar.max = pe.total
		//  		progressBar.value = pe.loaded
		// 	}
		// }
		// client.onloadend = function(pe) {
		// 	progressBar.value = pe.loaded
		// }
		// client.send()
	}
	,__ctor: function(){
		
	}
});

var dictTrade = new oojs$.com.stock.dictTrade();
oojs$.addEventListener("ready",function(){
	dictTrade.init();
});


oojs$.ns("com.stock.policy");
oojs$.com.stock.policy = oojs$.createClass(
{

	// USERID
    // POLICYID
    // POLICYPARAM
    // STARTTIME
    // ENDTIME
    // STOCKSET
    // ISTEST
    // STATUS
    // FALG
    // REMARK
    // SUBSCRBLE
    // PNAME
//DIRTYPE
	policy_list_head:[
		// 'USERID',
        'PNAME',
        'POLICYID',
        'POLICYPARAM',
        'STARTTIME',
        'ENDTIME',
        'STOCKSET',
        // 'ISTEST',
        'STATUS',
        // 'FALG',
        // 'REMARK',
        // 'SUBSCRBLE',
        'BUYPERCENT'
        ]

	,policy_list_body:[]

	,STOCKSET:"多个值，需要动态处理才能方便用户操作"

	,STOCKSET_TD1:null//td of table
	,STOCKSET_USERID:""
	,STOCKSET_POLICYID:""

	,init:function(){

        // oojs$.showInfo("",function(){
			// 	console.log("showInfo",arguments)
        // });
        // oojs$.showError("",function(){
        //
		// });


		$( "#policy_tabs" ).tabs();

    	$("#policy").click(this.nvgPolicyClick);

		this.load_Subscribe();

	}

	,nvgPolicyClick:function(){
		console.log("nvgClick");
		policy.load_Subscribe();
	}

	,clickHandler:function(){
    	console.log("clickHandler","type: ",this.type,"id: ",this.id,"name:",this.name,"value:",this.value,"textContent: ",this.conTent)

		if(this.type == "submit"){
			if(this.textContent == "修改股票"){
				policy.appendTB_changeSubscribe(this.id,this.name,this.value);
			}else if(this.textContent == "订阅"){
				policy.submit_sub
			}
		}else if(this.type == "button"){

            if(this.value == "新增"){
                var addStock = $("#addNewStock_txt").val().trim();
                // console.log('addStock',addStock,policy.STOCKSET);
                if(policy.STOCKSET.indexOf(addStock)<0){
                    if( !policy.STOCKSET || policy.STOCKSET!=""  ){
                        policy.STOCKSET = policy.STOCKSET+","+addStock;
                    }else{
                        policy.STOCKSET = addStock;
                    }
                    console.log("addNewStock_txt value:", policy.STOCKSET );
                    policy.rander_stockTD1();
                }

            }else if(this.value == "删除"){

                var stocks = policy.STOCKSET.split(",");
                var ck = null;
                var newStocks = []
                for(var i=0; i<stocks.length;i++){
                    if(!$("#"+stocks[i]+"_ck").is(':checked')){
                        newStocks.push(stocks[i])
                    }
                    // console.log(stocks[i]+":3:"+$("#"+stocks[i]+"_ck").is(':checked'));
                }
                // console.log(newStocks);
				for( var i=0; i<newStocks.length; i++ ){
					if(i==0){
                        policy.STOCKSET = newStocks[0];
					}else{
						policy.STOCKSET = policy.STOCKSET+","+newStocks[i];
					}
				}

                // console.log("policy.STOCKSET:",policy.STOCKSET);
                policy.rander_stockTD1();
            }else if(this.value == "提交"){
                policy.submitChange();
			}else if(this.value == "取消"){
				policy.cancelChange();
			}
        }
		//select_unsubscrible
	}
	,search_policyList_Item:function(USERID,POLICYID){
		console.log("search_policyList_Item",USERID,POLICYID);
    	for(var i = 0; i < this.policy_list_body.length; i++){
    		if(this.policy_list_body[i]['USERID']==USERID && this.policy_list_body[i]['POLICYID']==POLICYID){
    			return this.policy_list_body[i];
			}
		}
	}
	,appendTB_changeSubscribe:function(){
		var USERID = arguments[0], id = arguments[0]
		,POLICYID = arguments[1], name = arguments[1]
		,PRIMARY = arguments[2], value = arguments[2];

        console.log("search_policyList_Item",USERID,POLICYID);
		$('#policy_tabs_1').empty();

    	var item = this.search_policyList_Item(USERID,POLICYID);
    	if(!item){
    		return;
		}
		console.log("item:",item);
		var tb = $('<table></table>', {
			// 'style':"margin:0 auto;"
			// ,
			//'class':'dataTable cellspacing table'
			class:"display dataTable"
		}).appendTo($('#policy_tabs_1'));

    	var tr = null;
		for(var i = 0; i < this.policy_list_head.length; i++){
			if(i%2==0){
                tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
			}else{
                tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
			}


            if(this.policy_list_head[i] == "STOCKSET"){
                $('<td></td>',{ class:"td",rowspan:2}).appendTo(tr).text(this.policy_list_head[i]+": ");
			}else{
                $('<td></td>',{ class:"td"}).appendTo(tr).text(this.policy_list_head[i]+": ");
			}


            switch (this.policy_list_head[i]){
				case "POLICYID":
					console.log("case",this.policy_list_head[i]);
                    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i]]);

                    break;
                case 'POLICYPARAM':
                    console.log("case",this.policy_list_head[i]);
                    $('<td></td>',{ class:"td"}).appendTo(tr).text("？？");
                    break;
                case 'STARTTIME':

					var td =  $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="policy_startDate" class="datepicker"></input>'));

                    $("#policy_startDate").datepicker();

                    if(oojs$.matchYMD(item[this.policy_list_head[i]],2)){
                        $("#policy_startDate").datepicker('setDate',new Date(item[this.policy_list_head[i]]));
					}else{
                        $("#policy_startDate").datepicker('setDate',new Date());
					}

                    $("#policy_startDate").text($("#policy_startDate").datepicker('getDate'));


                    break;
                case 'ENDTIME':
                    console.log("case",this.policy_list_head[i]);
                    var td =  $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="policy_stopDate" class="datepicker"></input>'));

                    $("#policy_stopDate").datepicker();
                    if(oojs$.matchYMD(item[this.policy_list_head[i]],2)){
                    	$("#policy_stopDate").datepicker('setDate',new Date(item[this.policy_list_head[i]]));
                    }else{
                        $("#policy_stopDate").datepicker('setDate',new Date());
					}
                    $("#policy_stopDate").text($("#policy_stopDate").datepicker('getDate'));
                    break;
                case 'STOCKSET':
                    console.log("case",this.policy_list_head[i]);

                    this.STOCKSET = item[ this.policy_list_head[i] ];
                    this.STOCKSET = "123,234,3426"
                    console.log("case",'this.STOCKSET = "123,234,3426"');
                   	var td1 = $('<td></td>',{ class:"td"}).appendTo(tr);
                    if(i%2==0){
                        tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
                    }else{
                        tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
                    }
                    var td2 = $('<td></td>',{ class:"td"}).appendTo(tr);

                    this.appendCK_stockset(USERID,POLICYID,td1,td2);
                    break;
                case 'STATUS':
                    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i]]);
                    break;
                case 'PNAME':
                    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i]]);
                    break;
				case 'BUYPERCENT':
                    var input = $('<input></input>',{
                        id:USERID+"_"+POLICYID
                        ,name:"BUYPERCENT_input"
                    })
					input.val(item[this.policy_list_head[i]]);
                    console.log(""+item[this.policy_list_head[i]]);
                    $('<td></td>',{ class:"td"}).appendTo(tr).append(input);
                    break;
				default:
                    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i]]);
                    break;

			}
		}

		tr = $('<tr></tr>').appendTo(tb);
		var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);

		$('<input></input>',{type:"button",id:"policy_change_btn",name:"",value:"提交"}).appendTo(td);
		$("#policy_change_btn").click(
			this.clickHandler
		);

        $('<input></input>',{type:"button",id:"policy_changeBack_btn",name:"",value:"取消"}).appendTo(td);
        $("#policy_changeBack_btn").click(
            this.clickHandler
        );
	}

	,rander_stockTD1:function(){
        var myself = this;
        console.log("rander_stockTD1",this.STOCKSET);
        if(this.STOCKSET_TD1){
        	console.log("rander_stockTD2",this.STOCKSET);
        	this.STOCKSET_TD1.empty();
            var stocks = this.STOCKSET.split(",");
            for(var i = 0; i < stocks.length; i++){
                checkbox = $('<input></input>',{
                    'type':'checkbox'
                    ,'id':stocks[i]+"_ck"
                    ,'name':this.STOCKSET_USERID
                    ,'value':this.STOCKSET_POLICYID
                    // ,'checked':false
                }).appendTo(this.STOCKSET_TD1);

                label = $('<label></label>').appendTo(this.STOCKSET_TD1).text(stocks[i]);
                this.STOCKSET_TD1.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            }
            $('<input></input>',{type:"button",id:"del_stock_ck",name:"del_stock_btn",value:"删除"}).appendTo(this.STOCKSET_TD1).click(
                this.clickHandler
            );
		}

	}


	,appendCK_stockset:function(USERID,POLICYID,td1,td2){
        var myself = this;

		var checkbox = null;
		var label = null;
		this.STOCKSET_TD1 = td1;
		this.STOCKSET_USERID =USERID;
		this.STOCKSET_POLICYID =POLICYID;

        this.rander_stockTD1();

		var input = $('<input></input>',{
			id:"addNewStock_txt"
			,name:USERID+"_"+POLICYID
		}).text("");
		td2.append(input);
		$('<input></input>',{type:"button",id:"stock_changeAdd_btn",name:"",value:"新增"}).appendTo(td2).click(
			this.clickHandler
		);

	}

,load_Subscribe:function(){
	var myself = this;
    $.ajax({
			type:"post",
			url:"/select_subscrible",
			async:false,
			dataType:"json",
			success:function(result,textStatus){
				if(result.success){
					if(result.data == ""){
						console.log("load_Subscribe nothing")
					}else{
                        myself.policy_list_body = [];
                        myself.policy_list_body = result.data;
                        myself.appendTB_Subscribe();
					}
				}else{
					console.log("message",result.message);
				}
			},
			beforeSend: function(xhr){
				xhr.withCredentials = true;
			}
		});

	}

    ,load_Unsubscribe:function(){

	}

	,submitChange:function(){

        console.log("STOCKSET_USERID",this.STOCKSET_USERID);
        console.log("STOCKSET_POLICYID",this.STOCKSET_POLICYID);
        console.log("policy_startDate", $('#policy_startDate').datepicker("getDate") );
        console.log("policy_stopDate", $('#policy_stopDate').datepicker("getDate") );
        console.log("STOCKSET",this.STOCKSET);
        console.log("BUYPERCENT", $('#'+this.STOCKSET_USERID+"_"+this.STOCKSET_POLICYID).val() );
        // var fromdate = $("#fromdatepicker_onlineuser").datepicker("getDate");
        // var todate = $("#todatepicker_onlineuser").datepicker("getDate");
        // if(fromdate > todate){
        //     showLoadError("日期选择不正确");
        //     return;
        // }

        if ($.messager){
             	$.messager.defaults.ok = 'Ok';
             	$.messager.defaults.cancel = 'Cancel';
              }

		if($('#policy_startDate').datepicker("getDate")>$('#policy_stopDate').datepicker("getDate")){
			return console.log("日期选择不正确");
		}

        this.cancelChange();
	}

	,cancelChange:function(){
        this.STOCKSET="多个值，需要动态处理才能方便用户操作";
        this.STOCKSET_TD1=null;//td of table
        this.STOCKSET_USERID="";
        this.STOCKSET_POLICYID="";
        this.appendTB_Subscribe();
    }

	,appendTB_Subscribe:function(){
		var myself = this;
		$('#policy_tabs_1').empty();
			var tb = $('<table></table>', {
			'id': "policySubscribe_list_tb",
			'class':'display dataTable'
		}).appendTo($('#policy_tabs_1'));

		var thead = $('<thead></thead>').appendTo(tb);
		var tr = $('<tr></tr>').appendTo(thead);

		for(var elm = 0; elm < this.policy_list_head.length; elm++){
			var th = $('<th></th>',
			{
				class:"ui-state-default"
			}).appendTo(tr).text(this.policy_list_head[elm]);
		}

    	var th = $('<th></th>',
        {
            class:"ui-state-default"
        }).appendTo(tr).text("操作");

		var tbody = $('<tbody></tbody>').appendTo(tb);

    	console.log("policy_list_body",myself.policy_list_body);
		for(var elm = 0; elm < this.policy_list_body.length; elm++){
			var tr=null;
			if(elm%2==0){
				tr = $('<tr></tr>',{class:"odd"}).appendTo(tbody);
			}else{
				tr = $('<tr></tr>',{class:"even"}).appendTo(tbody);
			}

            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['USERID']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['PNAME']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['POLICYID']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['POLICYPARAM']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['STARTTIME']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['ENDTIME']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['STOCKSET']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['ISTEST']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['STATUS']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['FALG']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['REMARK']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['SUBSCRBLE']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['BUYPERCENT']);



			var td = $('<td></td>').appendTo(tr);
			var button = $('<button></button>',{
					'id':this.policy_list_body[elm]['USERID'],
					'name':this.policy_list_body[elm]['POLICYID'],
					'class':'searchButton',
					'value':this.policy_list_body[elm]['PRIMARY'],
					'text':'修改股票'
				}).click(this.clickHandler);
			td.append(button);
			td.append(" ");
            var button = $('<button></button>',{
                'id':this.policy_list_body[elm]['USERID'],
                // 'class':'btn btn-primary',
                'class':'searchButton',
                'name':this.policy_list_body[elm]['POLICYID'],
                'value':this.policy_list_body[elm]['PRIMARY'],
                'text':'订阅'
            }).click(this.clickHandler);
            td.append(button);

		}

	}

	,appendTB_Unsubscribe:function(){

	}

	,loadPolicyList:function(){

	}

	,
	__ctor: function(){
		
	}
});

var policy = new oojs$.com.stock.policy();
oojs$.addEventListener("ready",function(){
	policy.init();

});



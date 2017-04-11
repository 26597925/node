oojs$.ns("com.stock.policy");
oojs$.com.stock.policy = oojs$.createClass(
{


	policy_list_head: [
		// 'USERID',
		['PGROUPID','策略类型'],
        ['PNAME','策略名称'],
        ['DIRTYPE','交易类型'],
        // 'POLICYID',
        // ['POLICYPARAM','策略参数'],
        ['STARTTIME','开始时间'],
        ['ENDTIME','结束时间'],
        ['STOCKSET','自选股'],
        // 'ISTEST',
        // 'STATUS',
        // 'FALG',
        // 'REMARK',
        // 'SUBSCRBLE',
        ['PERCENT','交易比例']
	]

	,policy_list_body: []
    ,alreadySubscribe_body: []

	,STOCKSET: "多个值，需要动态处理才能方便用户操作"

	,STOCKSET_TD1:null//td of table
	,STOCKSET_USERID:""
	,STOCKSET_POLICYID:""

	,init:function(){


		$( "#policy_tabs" ).tabs();

        // $("#policy_tabs_1").css("");
        // $("#policy_tabs_1").class("")

    	$("#policy").click(this.nvgPolicyClick);

    	$("#policy_tabs_a1").click(this.nvgPolicyClick);

    	$("#policy_tabs_a2").click(this.tab2PolicyClick);

		// this.load_Subscribe();

	}

	,nvgPolicyClick:function(){
		console.log("nvgClick");
		policy.load_Subscribe();
	}

	,tab2PolicyClick:function(){
        console.log("tab2PolicyClick");
        policy.load_AlreadySubscribe();
    }

	,clickHandler:function(){
    	console.log("clickHandler","type: ",this.type,"id: ",this.id,"name:",this.name,"value:",this.value,"textContent: ",this.conTent)

		if(this.type == "submit"){
			if(this.textContent == "策略修改"){
			    if(this.value == "c1"){
                    policy.appendTB_changeSubscribe(this.id,this.name,this.value,1);
                }else if(this.value == "c2"){
                    policy.appendTB_changeSubscribe(this.id,this.name,this.value,2);
                }

			}else if(this.textContent == "订阅"){
				policy.update_subscrible(this.id,this.name,1);
			}else if(this.textContent == "取消订阅"){
                policy.update_unsubscrible(this.id,this.name);
			}
		}else if(this.type == "button"){

            if(this.value == "新增"){
                var addStock = $("#addNewStock_txt").val().trim();
                // console.log('addStock',addStock,policy.STOCKSET);
                if(policy.STOCKSET.indexOf(addStock)<0 && policy.valideStock(addStock)){
                    if( !policy.STOCKSET || policy.STOCKSET!=""  ){
                        policy.STOCKSET = policy.STOCKSET+","+addStock;
                    }else{
                        policy.STOCKSET = addStock;
                    }
                    console.log("addNewStock_txt value:", policy.STOCKSET );
                    policy.rander_stockTD1();
                }else{
                    oojs$.showError("自选股，数据不合法",function(){
                        console.log("policy clickHandler",arguments)
                    })
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
                if(this.name == 1){
                    policy.submitChange();
                }else if(this.name ==2){

                }

			}else if(this.value == "取消"){

                policy.cancelChange(this.name)
			}
        }
		//select_unsubscrible
	}

	,getDirtype:function(){
	    switch (arguments[0]){
            case 0:
                return "买入";
            case 1:
                return "卖出";
            case 2:
                return "融资买入";
            case 3:
                return "融券卖出";
            case 4:
                return "买券还券";
            case 5:
                return "卖券还款";
            case 6:
                return "现券还券";
        }
    }

    ,valideString:function(val){
        return (val.trim() === 'undefined' || val.trim() == "null" || val.length <= 0) ? "" : val;
    }

    ,valideStock:function(){
        if(arguments[0].match(/^[a-zA-Z0-9]{6}$/)){
            return true;
        }else{
            return false;
        }
    }


	,valideDate:function(){
        var obj = arguments[0];
        return obj["hh"]+":"+obj["mm"]+":"+obj["ss"];
        // var str_date = arguments[0];
        //
        // if(oojs$.matchYMD(str_date))
		// {
		// 	return str_date;
		// }else{
		// 	return oojs$.Format(new Date(),"yyyy-MM-dd");
		// }
	}


	,search_policyList_Item:function(USERID,POLICYID,list){

        for(var i = 0; i < list.length; i++){
            if( String(list[i]['USERID'])==String(USERID) &&  String(list[i]['POLICYID'])== String(POLICYID)){
                return list[i];
            }
        }

        return null;

	}



    ,appendTB_add_head: function( parentID, USERID, POLICYID ){
        var tb = $('<table></table>', {
            class:"display dataTable"
        });
        return tb;
    }

    ,appendTB_add_body: function( tb, item,USERID,POLICYID ){
        var tr = null;
        for(var i = 0; i < this.policy_list_head.length; i++){
            if(!item.hasOwnProperty(this.policy_list_head[i][0])){
                continue;
            }
            if(i%2==0){
                tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
            }else{
                tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
            }


            if(this.policy_list_head[i][0] == "STOCKSET"){
                $('<td></td>',{ class:"td",rowspan:2}).appendTo(tr).text(this.policy_list_head[i][1]+": ");
            }else{
                $('<td></td>',{ class:"td"}).appendTo(tr).text(this.policy_list_head[i][1]+": ");
            }


            switch (this.policy_list_head[i][0]){
                case "PGROUPID":
                    console.log("case",this.policy_list_head[i][0]);
                    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);

                    break;
                case "DIRTYPE":
                    $('<td></td>',{ class:"td"}).appendTo(tr).text( this.getDirtype(item[this.policy_list_head[i][0]]) );
                    break;
                // case "POLICYID":
                // 	console.log("case",this.policy_list_head[i]);
                //    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
                //
                //    break;
                // case 'POLICYPARAM':
                //     console.log("case",this.policy_list_head[i][0]);
                //     $('<td></td>',{ class:"td"}).appendTo(tr).text("？？");
                //     break;
                case 'STARTTIME':
                    var td =  $('<td></td>',{ class:"td"}).appendTo(tr);
                    // var td =  $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="policy_startDate" class="datepicker"></input>'));
                    //
                    // $("#policy_startDate").datepicker();
                    //
                    // if(oojs$.matchYMD(item[this.policy_list_head[i][0]],2)){
                    //     $("#policy_startDate").datepicker('setDate',new Date(item[this.policy_list_head[i][0]]));
                    // }else{
                    //     $("#policy_startDate").datepicker('setDate',new Date());
                    // }
                    //
                    // $("#policy_startDate").text($("#policy_startDate").datepicker('getDate'));
                    oojs$.generateHMDOption(td,"start_hh","start_mm","start_ss");

                    break;
                case 'ENDTIME':
                    console.log("case",this.policy_list_head[i][0]);
                    var td =  $('<td></td>',{ class:"td"}).appendTo(tr);
                    //.append($('<input type="text" id="policy_stopDate" class="datepicker"></input>'));
                    // $("#policy_stopDate").datepicker();
                    // if(oojs$.matchYMD(item[this.policy_list_head[i][0]],2)){
                    // 	$("#policy_stopDate").datepicker('setDate',new Date(item[this.policy_list_head[i][0]]));
                    // }else{
                    //     $("#policy_stopDate").datepicker('setDate',new Date());
                    // }
                    // $("#policy_stopDate").text($("#policy_stopDate").datepicker('getDate'));
                    oojs$.generateHMDOption(td,"stop_hh","stop_mm","stop_ss");
                    break;
                case 'STOCKSET':


                    this.STOCKSET = this.valideString(item[ this.policy_list_head[i][0] ]);

                    var td1 = $('<td></td>',{ class:"td"}).appendTo(tr);
                    if(i%2==0){
                        tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
                    }else{
                        tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
                    }
                    var td2 = $('<td></td>',{ class:"td"}).appendTo(tr);

                    this.appendCK_stockset(USERID,POLICYID,td1,td2);
                    break;
                // case 'STATUS':
                //     $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i]]);
                //     break;
                case 'PNAME':
                    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
                    break;
                case 'PERCENT':
                    var input = $('<input></input>',{
                        id:USERID+"_"+POLICYID
                        ,name:"PERCENT_input"
                    });
                    input.val(item[this.policy_list_head[i][0]]);

                    $('<td></td>',{ class:"td"}).appendTo(tr).append(input);
                    break;
                // default:
                //     $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
                //     break;

            }
        }

        tr = $('<tr></tr>').appendTo(tb);
    }

    ,appendTB_add_control: function( tb, id, type ){
        var tr = $('<tr></tr>').appendTo(tb);
        var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);

        $('<input></input>',{'type':"button",id:id+"_change_btn",name:type,value:"提交"}).appendTo(td);
        $("#policy_change_btn").click(
            this.clickHandler
        );

        $('<input></input>',{'type':"button",id:id+"_changeBack_btn",name:type,value:"取消"}).appendTo(td);
        $("#policy_changeBack_btn").click(
            this.clickHandler
        );

    }

	,appendTB_changeSubscribe: function(){
		var USERID = arguments[0], id = arguments[0]
		,POLICYID = arguments[1], name = arguments[1],
        type = arguments[3];

        console.log("search_policyList_Item",USERID,POLICYID,type);

        if( type == 1 ){
            $('#policy_tabs_1').empty();
        }else if( type == 2 ){
            $('#policy_tabs_2').empty();
        }


    	var item = null;
        if( type == 1 ){
            item = this.search_policyList_Item(USERID,POLICYID,this.policy_list_body);
        }else if( type == 2 ){
            item = this.search_policyList_Item(USERID,POLICYID,this.alreadySubscribe_body);
        }

    	if(!item){
    		return;
		}

		console.log("item:",item);

		var tb = this.appendTB_add_head();

		if(type == 1){
            tb.appendTo($('#policy_tabs_1'));
        }else if(type==2){
            tb.appendTo($('#policy_tabs_2'));
        }


        // var tr = null;
        //
		// for(var i = 0; i < this.policy_list_head.length; i++){
		// 	if(i%2==0){
         //        tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
		// 	}else{
         //        tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
		// 	}
        //
        //
         //    if(this.policy_list_head[i][0] == "STOCKSET"){
         //        $('<td></td>',{ class:"td",rowspan:2}).appendTo(tr).text(this.policy_list_head[i][1]+": ");
		// 	}else{
         //        $('<td></td>',{ class:"td"}).appendTo(tr).text(this.policy_list_head[i][1]+": ");
		// 	}
        //
        //
         //    switch (this.policy_list_head[i][0]){
         //        case "PGROUPID":
         //            console.log("case",this.policy_list_head[i][0]);
         //            $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
        //
         //            break;
         //        case "DIRTYPE":
         //           $('<td></td>',{ class:"td"}).appendTo(tr).text( this.getDirtype(item[this.policy_list_head[i][0]]) );
         //            break;
		// 		// case "POLICYID":
		// 		// 	console.log("case",this.policy_list_head[i]);
         //         //    $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
         //        //
         //         //    break;
         //        case 'POLICYPARAM':
         //            console.log("case",this.policy_list_head[i][0]);
         //            $('<td></td>',{ class:"td"}).appendTo(tr).text("？？");
         //            break;
         //        case 'STARTTIME':
         //            var td =  $('<td></td>',{ class:"td"}).appendTo(tr);
         //            // var td =  $('<td></td>',{ class:"td"}).appendTo(tr).append($('<input type="text" id="policy_startDate" class="datepicker"></input>'));
         //            //
         //            // $("#policy_startDate").datepicker();
         //            //
         //            // if(oojs$.matchYMD(item[this.policy_list_head[i][0]],2)){
         //            //     $("#policy_startDate").datepicker('setDate',new Date(item[this.policy_list_head[i][0]]));
         //            // }else{
         //            //     $("#policy_startDate").datepicker('setDate',new Date());
         //            // }
         //            //
         //            // $("#policy_startDate").text($("#policy_startDate").datepicker('getDate'));
         //            oojs$.generateHMDOption(td,"start_hh","start_mm","start_ss");
        //
         //            break;
         //        case 'ENDTIME':
         //            console.log("case",this.policy_list_head[i][0]);
         //            var td =  $('<td></td>',{ class:"td"}).appendTo(tr);
         //                //.append($('<input type="text" id="policy_stopDate" class="datepicker"></input>'));
         //            // $("#policy_stopDate").datepicker();
         //            // if(oojs$.matchYMD(item[this.policy_list_head[i][0]],2)){
         //            // 	$("#policy_stopDate").datepicker('setDate',new Date(item[this.policy_list_head[i][0]]));
         //            // }else{
         //            //     $("#policy_stopDate").datepicker('setDate',new Date());
         //            // }
         //            // $("#policy_stopDate").text($("#policy_stopDate").datepicker('getDate'));
         //            oojs$.generateHMDOption(td,"stop_hh","stop_mm","stop_ss");
         //            break;
         //        case 'STOCKSET':
        //
        //
         //            this.STOCKSET = this.valideString(item[ this.policy_list_head[i][0] ]);
        //
         //           	var td1 = $('<td></td>',{ class:"td"}).appendTo(tr);
         //            if(i%2==0){
         //                tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
         //            }else{
         //                tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
         //            }
         //            var td2 = $('<td></td>',{ class:"td"}).appendTo(tr);
        //
         //            this.appendCK_stockset(USERID,POLICYID,td1,td2);
         //            break;
         //        // case 'STATUS':
         //        //     $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i]]);
         //        //     break;
         //        case 'PNAME':
         //            $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
         //            break;
		// 		case 'PERCENT':
         //            var input = $('<input></input>',{
         //                id:USERID+"_"+POLICYID
         //                ,name:"PERCENT_input"
         //            })
		// 			input.val(item[this.policy_list_head[i][0]]);
        //
         //            $('<td></td>',{ class:"td"}).appendTo(tr).append(input);
         //            break;
		// 		default:
         //            $('<td></td>',{ class:"td"}).appendTo(tr).text(item[this.policy_list_head[i][0]]);
         //            break;
        //
		// 	}
		// };
        this.appendTB_add_body(tb,item,USERID,POLICYID);
        this.appendTB_add_control(tb,"policy",type);
        // tr = $('<tr></tr>').appendTo(tb);
        // var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);
        //
        // $('<input></input>',{'type':"button",id:"policy_change_btn",name:type,value:"提交"}).appendTo(td);
        // $("#policy_change_btn").click(
			// this.clickHandler
        // );
        //
        // $('<input></input>',{'type':"button",id:"policy_changeBack_btn",name:type,value:"取消"}).appendTo(td);
        // $("#policy_changeBack_btn").click(
        //     this.clickHandler
        // );
	}

	,rander_stockTD1:function(){
        var myself = this;
        var label = null;
        var checkbox = null;
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


    ,update_unsubscrible:function(USERID,POLICYID){
        var sendData = this.get_already_item(USERID,POLICYID);

        sendData['SUBSCRBLE']=0;
        console.log('update_unsubscrible',sendData);

        var myself = this;
        $.ajax({
            type:"post",
            url:"/update_subscrible",
            async:false,
            dataType:"json",
            data:sendData,
            success:function(data,textStatus){

                if(data.success){
                    console.log( "success!" );
                    myself.load_AlreadySubscribe();
                }else{

                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    }

	,update_subscrible:function(USERID,POLICYID,SUBSCRBLE,type){
        var sendData = this.get_policy_list_item(USERID,POLICYID);
        if(type == 2){
            sendData = this.get_already_item(USERID,POLICYID);
        }
        sendData['SUBSCRBLE']=1;
        if(SUBSCRBLE == 0){
            sendData['SUBSCRBLE']=0;
		}

        console.log('update_subscrible',sendData);

        var myself = this;
        $.ajax({
            type:"post",
            url:"/update_subscrible",
            async:false,
            dataType:"json",
            data:sendData,
            success:function(data,textStatus){

                if(data.success){
                    console.log( "success!" );
                    myself.cancelChange();
                }else{

				}
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
	}

	,get_policy_list_item:function(USERID,POLICYID){
		for( var i = 0; i < this.policy_list_body.length; i++ ){
			if( this.policy_list_body[i]["USERID"] == USERID
				&& this.policy_list_body[i]["POLICYID"] == POLICYID )
			{
				return this.policy_list_body[i];
			}
		}
	}

    ,get_already_item:function(USERID,POLICYID){
        for( var i = 0; i < this.alreadySubscribe_body.length; i++ ){
            if( this.alreadySubscribe_body[i]["USERID"] == USERID
                && this.alreadySubscribe_body[i]["POLICYID"] == POLICYID )
            {
                return this.alreadySubscribe_body[i];
            }
        }
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

                        oojs$.showError("没有数据");
					}else{
                        myself.policy_list_body = [];
                        myself.policy_list_body = result.data;
                        myself.appendTB_Subscribe();
					}
				}else{
                    oojs$.showError(result.message)
				}
			},
			beforeSend: function(xhr){
				xhr.withCredentials = true;
			}
		});

	}

    ,load_AlreadySubscribe:function(){
        var myself = this;
        $.ajax({
            type:"post",
            url:"/select_alreadySubscrible",
            async:false,
            dataType:"json",
            success:function(result,textStatus){
                if(result.success){
                	console.log("load_AlreadySubscribe",result.data);
                    myself.alreadySubscribe_body = [];
                    myself.alreadySubscribe_body = result.data;

                    myself.appendTB_alreadySubscribe()
                }else{
                    console.log("message",result.message);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });

	}

	,submitChange:function(type){

        var item = this.get_policy_list_item(this.STOCKSET_USERID,this.STOCKSET_POLICYID);
        if(type == 2){
            item = this.get_already_item(this.STOCKSET_USERID,this.STOCKSET_POLICYID);
        }
        item['STARTTIME'] ={hh:$('#start_hh').val(),"mm":$('#start_mm').val(),"ss":$('#start_ss').val()};
        //$('#policy_startDate').datepicker("getDate");
        item['ENDTIME'] = {hh:$('#stop_hh').val(),"mm":$('#stop_mm').val(),"ss":$('#stop_ss').val()};
        //$('#policy_stopDate').datepicker("getDate");
        item['STOCKSET'] = this.STOCKSET;
		item['PERCENT'] = $('#'+this.STOCKSET_USERID+"_"+this.STOCKSET_POLICYID).val();

        console.log("STOCKSET_USERID",this.STOCKSET_USERID);
        console.log("STOCKSET_POLICYID",this.STOCKSET_POLICYID);
        console.log("submitChange", item );

		if($('#policy_startDate').datepicker("getDate")>$('#policy_stopDate').datepicker("getDate")){
			return oojs$.showError("日期选择不正确");
		}
		var subscrible;
        if(type == 1){
		    subscrible = 0;
        }else if(type == 2){
            subscrible = 1;
        }
        this.update_subscrible(this.STOCKSET_USERID,this.STOCKSET_POLICYID,subscrible,type);
	}

	,cancelChange:function(type){
        this.STOCKSET="多个值，需要动态处理才能方便用户操作";
        this.STOCKSET_TD1=null;//td of table
        this.STOCKSET_USERID="";
        this.STOCKSET_POLICYID="";
        if(type == 1){
            this.load_Subscribe();
        }else if(type == 2){
            this.load_AlreadySubscribe();
        }

        // this.appendTB_Subscribe();
    }

    ,appendTB_alreadySubscribe:function(){
        var myself = this;
        $('#policy_tabs_2').empty();
        var tb = $('<table></table>', {
            'id': "policySubscribe_list_tb2",
            'class':'display dataTable'
        }).appendTo($('#policy_tabs_2'));

        var thead = $('<thead></thead>').appendTo(tb);
        var tr = $('<tr></tr>').appendTo(thead);

        for(var elm = 0; elm < this.policy_list_head.length; elm++){
            var th = $('<th></th>',
                {
                    class:"ui-state-default"
                }).appendTo(tr).text(this.policy_list_head[elm][1]);
        }

        var th = $('<th></th>',
            {
                class:"ui-state-default"
            }).appendTo(tr).text("操作");

        var tbody = $('<tbody></tbody>').appendTo(tb);

        console.log("alreadySubscribe_body",myself.alreadySubscribe_body);
        for(var elm = 0; elm < this.alreadySubscribe_body.length; elm++){
            var tr=null;
            if(elm%2==0){
                tr = $('<tr></tr>',{class:"odd"}).appendTo(tbody);
            }else{
                tr = $('<tr></tr>',{class:"even"}).appendTo(tbody);
            }

            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['USERID']);
            $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['PGROUPID']);
            $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['PNAME']);
            $("<td></td>").appendTo(tr).text( this.getDirtype(this.alreadySubscribe_body[elm]['DIRTYPE']));
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['POLICYID']);
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['POLICYPARAM']);

            $("<td></td>").appendTo(tr).text( this.valideDate(this.alreadySubscribe_body[elm]['STARTTIME']) );
            $("<td></td>").appendTo(tr).text( this.valideDate(this.alreadySubscribe_body[elm]['ENDTIME']) );

            $("<td></td>").appendTo(tr).text( this.valideString(this.alreadySubscribe_body[elm]['STOCKSET']));
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['ISTEST']);
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['STATUS']);
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['FALG']);
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['REMARK']);
            // $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['SUBSCRBLE']);
            $("<td></td>").appendTo(tr).text(this.alreadySubscribe_body[elm]['PERCENT']);


            var td = $('<td></td>').appendTo(tr);

            var button = $('<button></button>',{
                'id':this.alreadySubscribe_body[elm]['USERID'],
                'name':this.alreadySubscribe_body[elm]['POLICYID'],
                'value':"c2",
                'class':'searchButton',
                'text':'策略修改'
            }).click(this.clickHandler);
            td.append(button);
            td.append(" ");
            var button = $('<button></button>',{
                'id':this.alreadySubscribe_body[elm]['USERID'],

                'class':'searchButton',
                'name':this.alreadySubscribe_body[elm]['POLICYID'],
                'value':'',
                'text':'取消订阅'
            }).click(this.clickHandler);
            td.append(button);
        }
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
			}).appendTo(tr).text(this.policy_list_head[elm][1]);
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
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['PGROUPID']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['PNAME']);
            $("<td></td>").appendTo(tr).text( this.getDirtype(this.policy_list_body[elm]['DIRTYPE']));

            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['POLICYID']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['POLICYPARAM']);
            $("<td></td>").appendTo(tr).text( this.valideDate(this.policy_list_body[elm]['STARTTIME']) );
            $("<td></td>").appendTo(tr).text( this.valideDate(this.policy_list_body[elm]['ENDTIME']) );
            $("<td></td>").appendTo(tr).text( this.valideString(this.policy_list_body[elm]['STOCKSET']) );
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['ISTEST']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['STATUS']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['FALG']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['REMARK']);
            // $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['SUBSCRBLE']);
            $("<td></td>").appendTo(tr).text(this.policy_list_body[elm]['PERCENT']);



			var td = $('<td></td>').appendTo(tr);
			var button = $('<button></button>',{
					'id':this.policy_list_body[elm]['USERID'],
					'name':this.policy_list_body[elm]['POLICYID'],
					'class':'searchButton',
					'value':'c1',
					'text':'策略修改'
				}).click(this.clickHandler);
			td.append(button);
			td.append(" ");
            var button = $('<button></button>',{
                'id':this.policy_list_body[elm]['USERID'],

                'class':'searchButton',
                'name':this.policy_list_body[elm]['POLICYID'],
                'value':'',
                'text':'订阅'
            }).click(this.clickHandler);
            td.append(button);
		}
	}

    ,__ctor: function(){
		
	}
});

var policy = new oojs$.com.stock.policy();
oojs$.addEventListener("ready",function(){
	policy.init();
});



oojs$.ns("com.stock.order_period");
oojs$.com.stock.order_period = oojs$.createClass(
{
	list_benchmark_head: [
		{
            ID:'ACCOUNTID',
            NAME:"帐户"
        }
        ,
        {
            ID:"DIRTYPE",
            NAME:"交易类型"
        }
        ,{
            ID:'PNAME',
            NAME:"策略名称"
        }
        // ,{
        //     'ID':"STOCKSET",
        //     'NAME':"自选股"
        // }
        ,{
            'ID':"ONETHIRD",
            'NAME':"金额／数量" //三选一
        }
        // ,{
        //     'ID':"STATUS",
        //     'NAME':"状态"
        // }
        // ,{
        //     'ID':'DEALSTOCK',
        //     'NAME':"执行情况"//stockid
        // }
        ,{
            'ID':'ADDTIME',
            'NAME':"提交时间"
        }
        ,{
            'ID':'MODTIME',
            'NAME':"修改时间"
        }
        ,{
            'ID':'FROMID',
            'NAME':"来源"
        }
        ,{
            'ID':"CTRL",
            'NAME':"操作"
        }
    ]
    ,order_period_list: []
    ,preOerder_ctrl_div:null
    ,order_period_body_div:null
    ,order_select1:null
    ,order_select2:null
    ,order_select3:null
    ,select_title:null//顶部下拉框数据结构
    ,tb:null
    ,init:function(){
        $( "#order_period_tabs" ).tabs();
        $( "#order_period_tabs" ).tabs({ selected: 0 });
        // $("#order_period_tabs").tabs('select', 2);
        $("#order_period").click(this.order_period_tab1_clk);
        $("#order_period_tabs_a1").click(this.order_period_tab1_clk);
        $("#order_period_tabs_a2").click(this.order_period_tab2_clk);
        //order_period.order_period_tab1_clk();
    }

    ,order_period_tab1_clk:function(){
        order_period.load_order_period();
    }

    ,order_period_tab2_clk:function(event){
        preload.getStock();

        dictTrade.load_userAccount(function(){
            policy.load_subscribe(function () {
                console.log("order\n","load subscrible\n");

                order_period.appendTB_new_order_period();
                order_period.select_title = null;
                order_period.select_title = {};
                for(var i = 0; i < policy.policy_subscribe.length; i++ ){
                    order_period.parse2obj_DIRTYPE( order_period.select_title, policy.policy_subscribe[i] );
                }
                order_period.appendTB_order_period_slct();
                if(policy.policy_subscribe.length>0){
                    $(order_period.order_select1).val(parseInt(policy.policy_subscribe[0]['DIRTYPE']));
                    order_period.handler_dirtype({'data':{'value':parseInt(policy.policy_subscribe[0]['DIRTYPE'])}});
                    
                    $(order_period.order_select2).val( parseInt(policy.policy_subscribe[0]['PGROUPID']) );
                    order_period.handler_group({'data':{'value':parseInt(policy.policy_subscribe[0]['PGROUPID'])}});
                    console.log(parseInt(policy.policy_subscribe[0]['POLICYID']))
                    $(order_period.order_select3).val( policy.policy_subscribe[0]['USERID']+"_"+policy.policy_subscribe[0]['POLICYID'] ); 
                }
            })
        });
        
    }

    ,option_append: function(select,obj,filter){
        for(var elm in obj){

            select.append(
                "<option value='"
                +elm
                +"'>"+filter(elm)+"</option>"
            );
        }
    }
    ,appendTB_order_period_slct:function () {
        var self = this;
        self.option_append(self.order_select1, self.select_title, preload.getDirtype);
    }
    ,detail_period:null
    ,get_detail:function(){
        return this.detail_period;
    }
    ,order_period_btn_del:function(event){
        //删除
        var self = event.data.scope;
        var sendData = event.data.data;
        var _sendData = {};
        var  DIRTYPE=  sendData['DIRTYPE']['ORIGIN'];
        var STARTTIME = sendData['STARTTIME']["ELEMENT"];
        var ENDTIME = sendData['ENDTIME']["ELEMENT"];

        
        for(var elm in sendData){
            _sendData[elm] = sendData[elm]["ELEMENT"];
        }
        _sendData['DIRTYPE'] = DIRTYPE;
        _sendData['STARTTIME'] = STARTTIME;
        _sendData['ENDTIME'] = ENDTIME;
        if(String(_sendData['VISIBLE']) == "0"){
           _sendData['VISIBLE'] = "1";
        }else if(String(_sendData['VISIBLE']) == "1"){
            _sendData['VISIBLE'] = "0"
        }
        console.log("del",JSON.stringify(_sendData))
        oojs$.httpPost_json("/update_orderPeriod",[_sendData],function(result,textStatus,token){
            if(result 
                && result.hasOwnProperty('success')
                &&result.success){
                _sendData=null;
                if(event&&event.data){
                    if(event&&event.data&&event.data.data){
                        if(typeof(event.data.data)=='object'){
                            for(var ine in event.data.data){
                                event.data.data[ine]=null;
                                delete event.data.data[ine];
                            }
                        }
                        event.data.data = null;
                        event.data = null;
                    }
                    event.data = null;
                }
                
                $( "#order_period_tabs" ).tabs({ selected: 0 });
                order_period.order_period_tab1_clk();
            }else{
                oojs$.showError(result.message);
            }
        });
    }
    ,order_period_btn_detail:function(event){
        //订单详情
        var self = event.data.scope;
        self.detail_period = $.extend(true,{},event.data.data);
        console.log(JSON.stringify(event.data));
        shareObj.detailName = 'order_period';
        var p=window.open("detailOrder.html");
    }
    ,order_period_btn_chg:function(event){
        //修改
        var self = event.data.scope;
        self.detail = event.data.data;
        self.appendTB_modify_order(self.detail);
    }
    ,order_period_btn_switch:function(event){
        //启动／禁用
        var self = event.data.scope;
        var sendData = event.data.data;
        
        console.log("switch",JSON.stringify(sendData))

        var _sendData = {};

        var  DIRTYPE=  sendData['DIRTYPE']['ORIGIN'];
        var STARTTIME = sendData['STARTTIME']["ELEMENT"];
        var ENDTIME = sendData['ENDTIME']["ELEMENT"];

        for(var elm in sendData){
            _sendData[elm] = sendData[elm]["ELEMENT"];
        }
        _sendData['DIRTYPE'] = DIRTYPE;
        _sendData['STARTTIME'] = STARTTIME;
        _sendData['ENDTIME'] = ENDTIME;

        if(String(_sendData['FLAG_USER']) == "0"){
           _sendData['FLAG_USER'] = "1";
        }else if(String(_sendData['FLAG_USER']) == "1"){
            _sendData['FLAG_USER'] = "0"
        }
       
        console.log("switch",JSON.stringify(_sendData))
        oojs$.httpPost_json("/update_orderPeriod",[_sendData],function(result,textStatus,token){
                if(
                    result
                    &&result.hasOwnProperty('success')
                    &&result.success){
                    _sendData=null;
                    if(event&&event.data&&event.data.data){
                        if(typeof(event.data.data)=='object'){
                            for(var ine in event.data.data){
                                event.data.data[ine]=null;
                                delete event.data.data[ine];
                            }
                            event.data.data = null;
                        }
                        event.data = null;
                    }
                    $( "#order_period_tabs" ).tabs({ selected: 0 });
                    order_period.order_period_tab1_clk();
                }else{
                    oojs$.showError(result.message);
                }
            });
    }
    ,
    stockDetail:null
    ,
    get_stockDetail:function(){
        var self = this;
        return self.stockDetail;
    }
    ,
    stock:null
    ,
    order_period_btn_herf:function(event){
        //股票详情
        console.log(JSON.stringify(event.data.item))
        var self = event.data.scope;
        self.stockDetail = event.data.item;
        self.stock = event.data.stock;
        event.preventDefault();
        var p=window.open("detailStock.html");
    }
    ,order_period_btn_modifyreback:function(event){
        //返回
        order_period.load_order_period();
    }
    ,appendTB_modify_order:function(){
        var self = this;
        var drawitem_data = arguments[0];
        console.log('order_period appendTB_modify_order\n',JSON.stringify(drawitem_data));
        

        var STARTTIME = $('<div></div>');
        var start_component = new  oojs$.com.stock.component.hh_mm_ss();
        var start_s = oojs$.Format(new Date(drawitem_data['STARTTIME']['ELEMENT']),'yyyy-MM-dd-HH-mm-ss').split("-");
        var hh_mm_ss = {'hh':start_s[3],'mm':start_s[4],'ss':start_s[5]};
        start_component.init(STARTTIME,hh_mm_ss,'datepicker',new Date(drawitem_data['STARTTIME']['ELEMENT']));

        var ENDTIME = $('<div></div>');
        var end_component = new  oojs$.com.stock.component.hh_mm_ss();
        start_s = oojs$.Format(new Date(drawitem_data['ENDTIME']['ELEMENT']),'yyyy-MM-dd-HH-mm-ss').split("-");
        var hh_mm_ss = {'hh':start_s[3],'mm':start_s[4],'ss':start_s[5]};
        end_component.init(ENDTIME,hh_mm_ss,'datepicker',new Date(drawitem_data['ENDTIME']['ELEMENT']));


        var stockset = new oojs$.com.stock.component.stockset();
        var STOCKSET = {
            'ELEMENT':null
            ,'ELEMENT1':$('<div></div>')
            ,'ELEMENT2':$('<div></div>')
            ,'ROWSPAN':2
            ,'COMPONENT':stockset};
        stockset.init(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            drawitem_data["STOCKSET"]['ELEMENT']);
        if(drawitem_data['PGROUPID'] && !drawitem_data['PGROUPID'].hasOwnProperty('ELEMENT')){
            drawitem_data['PGROUPID'] = {
                'ELEMENT': preload.getPGroupItem(drawitem_data['PGROUPID']['ELEMENT'])["NAME"]
                ,'ORIGIN': drawitem_data['PGROUPID']['ELEMENT']
            };
        }
        if(drawitem_data['DIRTYPE'] && !drawitem_data['DIRTYPE'].hasOwnProperty('ELEMENT')){
            drawitem_data['DIRTYPE'] = {
                'ELEMENT': preload.getDirtype(drawitem_data['DIRTYPE']['ELEMENT'])
                ,'ORIGIN': drawitem_data['DIRTYPE']['ELEMENT']
            };
        }

        var jsonView = new oojs$.com.stock.JsonView();
        var divs = jsonView.init( drawitem_data["POLICYPARAM"]['ELEMENT'] );
        var JSONVIEW = {};
        for(var idx = 0; idx<divs.length; idx++){
            JSONVIEW["ELEMENT"+(idx+1)] = divs[idx];
        }
        JSONVIEW["COMPONENT"] = jsonView;
        JSONVIEW["ROWSPAN"] = divs.length;
        drawitem_data["POLICYPARAM"] = JSONVIEW;

        drawitem_data["STARTTIME"] ={'ELEMENT':STARTTIME,'COMPONENT':start_component};
        drawitem_data["ENDTIME"] = {'ELEMENT':ENDTIME,'COMPONENT':end_component};
        drawitem_data["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};

        var policyHead = policy.get_preOrder_head();
        var accountOBJ = {};
        accountOBJ["ELEMENT"] = drawitem_data['ACCOUNTID']['ELEMENT'];
        accountOBJ["COLUMN1"] = $('<div></div>');
        accountOBJ["COLUMN2"] = $('<div></div>');
        accountOBJ["COMPONENT"] = new oojs$.com.stock.component.accountset();
        accountOBJ["COMPONENT"].init(
            accountOBJ["COLUMN1"]
            ,accountOBJ["COLUMN2"]
            ,drawitem_data['ACCOUNTID']['ELEMENT']
            ,null
            ,null
            ,drawitem_data['BUYCOUNT']["ELEMENT"]
            ,drawitem_data['BUYAMOUNT']["ELEMENT"]
            ,drawitem_data['PERCENT']["ELEMENT"]
            ,true
            ,null//drawitem_data['ACCOUNTID']['ELEMENT']
        );
        var sendAccounts = [{'accountid':drawitem_data['ACCOUNTID']['ELEMENT']}];

        oojs$.httpPost_json('/capital',sendAccounts,function(result,textStatus,token){
            console.log(JSON.stringify(arguments));
            
            // result.data = '[{ "status": "200", "tradeid": "1", "accountid": "309219512983", "userid": "20000","account_muse": "1986.90","account_value": "6544.00","account_msum": "8530.90" }]';
            // result.success = true       
            
            // if(result
            //         &&result.hasOwnProperty('success')
            //         &&result.success){
                
                var capitals;
                try{
                    capitals= JSON.parse(result.data);
                }catch(err){
                    capitals = '';
                    console.log('order_period',err);
                }
                if(capitals && capitals.length>0 
                    && capitals[0].hasOwnProperty('status')
                    && capitals[0]['status'] == 200){
                    accountOBJ["COMPONENT"].addCapital(capitals[0]);
                }
                // else{
                //     oojs$.showError('您的资金验证出了问题!');
                // }
                self.appendTB_modifyorder_flush(policyHead,drawitem_data,[accountOBJ]);
            // }else{
            //     oojs$.showError('您的资金验证出了问题!');
            // }
        });
        
    }
    ,appendTB_modifyorder_flush:function(policy_head,policy_data,account_list){
        var self = this;

        var order_period_body_div =  $('#order_period_tabs_1').empty()

        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo(order_period_body_div);

        oojs$.appendTB_item_D2(tb,policy_head,policy_data);
        self.appendTB_accountHint(tb);
        // self.appendTB_account_body(tb, account_itemD2, dirtype);

        oojs$.appendTB_item_D2x(tb,account_list);


        var tr = $('<tr></tr>',{}).appendTo(tb);
        var td = $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr)
        $('<input></input>',{'type':"button",value:"提交"}).appendTo(td).click(
            {"policy_data":policy_data,"account_list":account_list,"type":"modify"}
            ,self.order_period_new_submit
            // 
        );

        $('<input></input>',{'type':"button",value:"取消"}).appendTo(td).click(
            self.order_period_btn_modifyreback
        );

    }
    ,appendTB_new_order_period:function(){
        var self = this;
        var container =$('#order_period_tabs_2');
        
        if(self.tb == null){
            self.tb = $('<table></table>', {
                'class':"display dataTable"
            });
        }else{
            self.tb.empty()
        }
        if(self.preOerder_ctrl_div==null){
            self.preOerder_ctrl_div = $('<div></div>');
            self.preOerder_ctrl_div.appendTo(container);
        }
        
        console.log('appendTB_new_order_period\n',JSON.stringify(policy.policy_subscribe[0]));
        
        self.appendTB_control(self.tb);

        if(policy.policy_subscribe.length>0){
            var event = {};
            event.data = {};
            event.data['USERID'] = policy.policy_subscribe[0]['USERID'];
            event.data['POLICYID'] = policy.policy_subscribe[0]['POLICYID'];
            self.handler_policy(event);
        }
    }

    ,appendTB_control:function(tb){
        var self = this;
        self.preOerder_ctrl_div.append(tb);
        var tr = $('<tr></tr>',{'class':"even"}).appendTo(tb);
        var td =$('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
        //1----------------------------
        td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        td.append($('<label></label>').text("交易类型:"));

        self.order_select1 = $('<select></select>',{
            id:'order_select1'
        });
        // self.order_select1.append(
        //     "<option  value='-1'>请选择交易类型</option>"
        // );
        // self.option_append(self.order_select1, self.select_title, policy.getDirtype);
        self.order_select1.change(self.handler_dirtype);
        td.append( self.order_select1 );
        //2----------------------------
        td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        td.append($('<label></label>').text("策略类型:"));

        self.order_select2 = $('<select></select>',{
            id:'order_select2'
        });
        // self.order_select2.append(
        //     "<option  value='-1'>请选择策略类型</option>"
        // );

        self.order_select2.prop("disabled", true);
        self.order_select2.change(self.handler_group);

        td.append( self.order_select2 );

        //3----------------------------
        td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        td.append($('<label></label>').text("策略名称:"));

        self.order_select3 = $('<select></select>',{
            id:'order_select3'
        });

        // self.order_select3.append(
        //     "<option value='-1'>请选择策略名称</option>"
        // );

        self.order_select3.change(null,self.handler_policy);
        self.order_select3.prop("disabled", true);
        td.append( self.order_select3 );
        
    }

    ,appendTB_accountHint:function(tb){
        var tr = $('<tr></tr>',{'class':"even"}).appendTo(tb);
        var td = $('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
        td.append($('<label></label>').text("请选择您帐户:"));
        var label = $('<label></label>',{

        }).text('(*注：只有选择了账户才能选择交易策略)');
        label.css({ 'color': 'red', 'font-size': '80%' });
        td.append(label);
    }

    ,appendTB_order_period:function(){
        var self = this;

        var panel,list_head,list_body;
        panel = $('#order_period_tabs_1');

        list_head = order_period.list_benchmark_head;//order_period_list;//self.list_benchmark_head;
        list_body = [];
        var list = null;
        list = this.order_period_list;

        var one_third = '';
        var btnName = '';
        var href = null;
        var hrefs = null;
        var div = null;
        var stocks = [];
        var status = '';
        for(var elm = 0; elm < list.length; elm++){
            list_body[elm] = {};
            for(var  inner in  list[elm]){
                list_body[elm][inner] = {'ELEMENT': list[elm][inner]};
            }

            list_body[elm]['PGROUPID'] = {
                'ELEMENT':String( preload.getPGroupItem(list[elm]['PGROUPID'])['NAME']),
                'ORIGIN':list[elm]['PGROUPID'] 
            };
            // getFrom
            list_body[elm]['STOCKSET'] = {
                'ELEMENT':String( oojs$.valideString(list[elm]['STOCKSET'])),
                'ORIGIN':list[elm]['STOCKSET'] 
            };

            list_body[elm]['DIRTYPE']= {
                'ELEMENT': preload.getDirtype(list[elm]['DIRTYPE']),
                'ORIGIN':list[elm]['DIRTYPE']};

            if(""+list[elm]['DEALSTOCK']&& (""+list[elm]['DEALSTOCK']).length>5 ){
                stocks = (list[elm]['DEALSTOCK']).split(",");
                div = $('<div></div>');
                for(var jj=0;jj<stocks.length;jj++){
                    href = $('<a href="#"></a>').text(stocks[jj]).click(
                        {'item':list_body[elm],'stock':stocks[jj],'scope':self},
                        self.order_period_btn_herf
                    );
                    div.append(href)
                    div.append($('<br />'));
                }
                
                list_body[elm]['DEALSTOCK'] ={'ELEMENT': div,'ORIGIN':list[elm]['DEALSTOCK']};
            }

            status = list[elm]['STATUS'];
            list_body[elm]['STATUS'] = {'ELEMENT':preload.getExecute(list[elm]['STATUS']),'ORIGIN': status };
            //<a id="sign_up" class="sign_new">Sign up</a>
            one_third = '';
            if(parseInt(list[elm]['BUYCOUNT'])>0){
                one_third = parseInt(list[elm]['BUYCOUNT'])+"股";
            }else if(parseInt(list[elm]['BUYAMOUNT'])>0){
                one_third = parseInt(list[elm]['BUYAMOUNT'])+"¥";
            }else if(Number(list[elm]['PERCENT'])>0){
                one_third = Number(list[elm]['PERCENT']);//+"％";
            }
            list_body[elm]['ONETHIRD'] = {'ELEMENT':one_third};
            list_body[elm]['POLICYID'] = {'ELEMENT':list[elm]['POLICYID']};//{ELEMENT:preload.getPGroupItem(list[elm]['POLICYID'])};
            list_body[elm]['FROMID'] = {'ELEMENT':preload.getFrom(list[elm]['FROMID'])};
            

            var div = $('<div></div>');
            $('<input></input>',{type:"button",value:"详情"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_period.order_period_btn_detail
            );

            // if((status == "3"||status == "4")&&stockCount == 1){
            //     $('<input></input>',{type:"button",value:"修改"}).appendTo(div).prop('disabled',true);
            // }else {//if(status == "0"||status == "1")
                $('<input></input>',{type:"button",value:"修改"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_period.order_period_btn_chg
                );
            // }
            btnName = "X";
            if(parseInt(list_body[elm]['FLAG_USER']['ELEMENT']) == 1){
                btnName = '✓'
            }

            $('<input></input>',{type:"button",value:btnName}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_period.order_period_btn_switch
            );

            $('<input></input>',{type:"button",value:"删除"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_period.order_period_btn_del
            );

            list_body[elm]['CTRL'] = {ELEMENT:div};
        }
        oojs$.appendTB_list(panel,list_head,list_body);
    }

    ,load_order_period:function(){
        var self = this;
        var sendData = {};

        oojs$.httpPost_json("/select_orderPeriod",sendData,function(result,textStatus,token){
            if(result
                    &&result.hasOwnProperty('success')
                    &&result.success){
                self.order_period_list = [];
                self.order_period_list = result.data;
                self.appendTB_order_period();
            }else{
                oojs$.showError(result.message);
            }
        });
    }

    //顶部下拉框数据结构
        /**
         *
         * @param obj select_title
         * @param appendObj, scribleObj
         */
    ,parse2obj_DIRTYPE:function(obj,appendObj){
        var self = this;
        if( !obj.hasOwnProperty( appendObj['DIRTYPE'] ) ){
            obj[appendObj['DIRTYPE']] = {};
        }
        self.parse2obj_PGROUPID( obj[appendObj['DIRTYPE']], appendObj );
    }

    ,parse2obj_PGROUPID:function(obj,appendObj){
        var self = this;
        if( !obj.hasOwnProperty( appendObj['PGROUPID'] ) ){
            obj[appendObj['PGROUPID']]  = [];
        }

        obj[appendObj['PGROUPID']].push({
            "POLICYID":appendObj["POLICYID"]
            ,"PNAME":appendObj["PNAME"]/*+(appendObj["USERID"]+""=="0"?"":"(自定义)")*/
            ,"USERID":appendObj["USERID"]
        });

    }

    ,handler_dirtype: function(event){
        var self = order_period;
        self.order_select2.empty();
        self.order_select3.empty();
        self.order_select2.prop("disabled", false);
        self.order_select3.prop("disabled", true);
        // self.order_select2.append(
        //     "<option  value='-1'>请选择策略类型</option>"
        // );

        var value = -1
        if(event.data != null
            && event.data.hasOwnProperty('value')){
            value = event.data.value;
        }else{
            value = this.value;
        }
        
        self.option_append(self.order_select2,self.select_title[value],function(pp){
            return preload.getPGroupItem(pp)["NAME"];
        });

        self.handler_group();
    }

    ,handler_group: function(event){
        var self = order_period;
        self.order_select3.empty();
        self.order_select3.prop("disabled", false);
        // self.order_select3.append(
        //     "<option value='-1'>请选择策略名称</option>"
        // );
        
        var tempArr = self.select_title[ self.order_select1.val()][self.order_select2.val()];
        var event ={};
        event.data = {};
        for( var i = 0; i < tempArr.length; i++ ){
            if(i==0){
                event.data['USERID'] = tempArr[i]['USERID'];
                event.data['POLICYID'] =  tempArr[i]['POLICYID'];
            }
            self.order_select3.append(
                "<option value='"
                +tempArr[i]['USERID']+"_"+tempArr[i]['POLICYID']
                +"'>"+tempArr[i]["PNAME"]+"</option>"
            );
        }

        self.handler_policy(event);
    }
    ,handler_policy: function(event){
        // console.log(">>>>>>>>>>",
        // self.order_select1.val(),
        // self.order_select2.val(),
        // this.value,$(this).find("option:selected").text() );
        var USERID = '';
        var POLICYID = '';
        var self = order_period;
        if(event.data == null){
            var obj = $(this).find("option:selected");
            var name = obj.text();
            var key_value = obj.val().split("_");
            USERID = key_value[0];
            POLICYID = key_value[1];
        }else{
            USERID = event.data['USERID'];
            POLICYID = event.data['POLICYID'];
        }
        //period------------------------

        var item = policy.search_policyList_Item(USERID,POLICYID,policy.policy_subscribe);
        var PERCENT = item['PERCENT'];
        var drawitem_data = {};
        for(var elm in item){
            drawitem_data[elm] = {ELEMENT:item[elm]};
        }
        var STARTTIME = $('<div></div>');
        
        var start_component = new  oojs$.com.stock.component.hh_mm_ss();
        start_component.init(STARTTIME,item["STARTTIME"],'datepicker');

        var ENDTIME = $('<div></div>');
        var end_component = new  oojs$.com.stock.component.hh_mm_ss();
        end_component.init(ENDTIME,item["ENDTIME"],'datepicker');

        var stockset = new oojs$.com.stock.component.stockset();
        var STOCKSET = {
            'ELEMENT':null
            ,'ELEMENT1':$('<div></div>')
            ,'ELEMENT2':$('<div></div>')
            ,'ROWSPAN':2
            ,'COMPONENT':stockset};
        stockset.init(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            item["STOCKSET"]);

        drawitem_data['PGROUPID'] = {
            'ELEMENT': preload.getPGroupItem(drawitem_data['PGROUPID']['ELEMENT'])["NAME"]
            ,'ORIGIN': drawitem_data['PGROUPID']['ELEMENT']
        };
        drawitem_data['DIRTYPE'] = {
            'ELEMENT': preload.getDirtype(drawitem_data['DIRTYPE']['ELEMENT'])
            ,'ORIGIN': drawitem_data['DIRTYPE']['ELEMENT']
        };

        var jsonView = new oojs$.com.stock.JsonView();
        var divs = jsonView.init( item["POLICYPARAM"] );
        var JSONVIEW = {};
        for(var idx = 0; idx<divs.length; idx++){
            JSONVIEW["ELEMENT"+(idx+1)] = divs[idx];
        }
        JSONVIEW["COMPONENT"] = jsonView;
        JSONVIEW["ROWSPAN"] = divs.length;
        drawitem_data["POLICYPARAM"] = JSONVIEW;

        drawitem_data["STARTTIME"] ={'ELEMENT':STARTTIME,'COMPONENT':start_component};
        drawitem_data["ENDTIME"] = {'ELEMENT':ENDTIME,'COMPONENT':end_component};
        drawitem_data["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};

        var policyHead = policy.get_preOrder_head();

        dictTrade.load_userAccount(function(){
            var trade_list = [];
            var index = 0;
            var item_account = null;
            console.log("同时请求账号中的数据");
            
            var sendAccounts = [];
            for(var elm in dictTrade.dictTrade_list_body){
                item_account = dictTrade.dictTrade_list_body[elm];
                sendAccounts.push({"accountid":item_account['ACCOUNTID']});
                trade_list[index] = {};
                
                trade_list[index]["ELEMENT"] = item_account;
                trade_list[index]["COLUMN1"] = $('<div></div>');
                trade_list[index]["COLUMN2"] = $('<div></div>');
                trade_list[index]["COMPONENT"] = new oojs$.com.stock.component.accountset();
                 
                trade_list[index]["COMPONENT"].init(
                    trade_list[index]["COLUMN1"]
                    ,trade_list[index]["COLUMN2"]
                    ,item_account['ACCOUNTID']
                    ,item['DIRTYPE']
                    ,preload.getTradeItem(item_account['TRADEID'])["BORROW"]
                    ,item_account['BUYCOUNT']
                    ,item_account['BUYAMOUNT']
                    ,PERCENT//item_account['PERCENT']
                    ,true
                    ,item_account
                );
                index++;
            }

            console.log("order_period trade_list ",JSON.stringify(trade_list));
            if(sendAccounts.length>0){
                console.log("trade_list",JSON.stringify(trade_list));
                oojs$.httpPost_json('/capital',sendAccounts,function(result,textStatus,token){
                    console.log(JSON.stringify(arguments));
                    
                    // result.data = '[{ "status": "200", "tradeid": "1", "accountid": "309219512983", "userid": "20000","account_muse": "1986.90","account_value": "6544.00","account_msum": "8530.90" }]';
                    // result.success = true;       
                    
                    // if(result
                    // &&result.hasOwnProperty('success')
                    // &&result.success){
                        var capitals;
                        try{
                            capitals= JSON.parse(result.data);
                        }catch(err){
                            capitals = '';
                            console.log('order_period',err);
                        }

                        if(capitals){
                            for(var i = 0; i < trade_list.length; i++){
                                for(var elm in capitals){
                                    var item_capital = capitals[elm];
                                    if(String(trade_list[i]["ELEMENT"]['ACCOUNTID']) == String(item_capital.accountid) ){
                                        if(String(item_capital.status) != "200"){
                                            // oojs$.showError("您的账号："+item_capital.accountid+"资金验证存在问题");
                                            // return;
                                            continue;
                                        }
                                        trade_list[i]["COMPONENT"].addCapital(item_capital);
                                    }
                                }
                            }
                            self.appendTB_neworder_flush(policyHead,drawitem_data,trade_list);
                        }else{
                            // oojs$.showError("您的资金验证存在问题  code 3");
                            self.appendTB_neworder_flush(policyHead,drawitem_data,trade_list);
                        }
                    // }else{
                    //     oojs$.showError("您的资金验证存在问题  code 2");
                    // }
                });
            }else{
                oojs$.showError("您还没有添加账号 code 1");
            }

        })
    }
    ,appendTB_neworder_flush:function(policy_head,policy_data,account_list){
        var self = this;

        if(self.order_period_body_div == null){
            self.order_period_body_div = $('<div id="order_period_body_div"></div>');
            self.order_period_body_div.appendTo($('#order_period_tabs_2'));
        }

        self.order_period_body_div.empty();

        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo(self.order_period_body_div);

        oojs$.appendTB_item_D2(tb,policy_head,policy_data);
        self.appendTB_accountHint(tb);

        oojs$.appendTB_item_D2x(tb,account_list);


        var tr = $('<tr></tr>',{}).appendTo(tb);
        var td = $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr)
        $('<input></input>',{'type':"button",value:"提交"}).appendTo(td).click(
            {"policy_data":policy_data,"account_list":account_list}
            ,self.order_period_new_submit
            // 
        );
    }
    ,order_period_new_submit:function(event){
        var policy_data = event.data['policy_data'];
        var account_list = event.data['account_list'];
        var type = "add"
        if(event.data.hasOwnProperty("type")){
            type = event.data['type']
        }

        var policy_data_new = {};
        console.log("policy_data",JSON.stringify(policy_data));
        
        for(var elm in policy_data){
            if(policy_data[elm] && policy_data[elm].hasOwnProperty("COMPONENT")
                &&policy_data[elm].hasOwnProperty('ELEMENT')){
                policy_data_new[elm] = policy_data[elm]['COMPONENT'].val();
            }else if(policy_data[elm] && policy_data[elm].hasOwnProperty('ELEMENT')){
                policy_data_new[elm] = policy_data[elm]['ELEMENT'];
            }
        }

        policy_data_new['PGROUPID']=policy_data['PGROUPID']['ORIGIN'];
        policy_data_new['DIRTYPE']=policy_data['DIRTYPE']['ORIGIN'];
        policy_data_new['POLICYPARAM'] = policy_data['POLICYPARAM']['COMPONENT'].val();

        
        console.log("policy_data\n",JSON.stringify(policy_data_new));
        console.log("account_list\n",JSON.stringify(account_list));
        var account_result = [];
        var index = 0;
        var COMPONENT_ACCOUNTSET = null;
        for(var i =0; i< account_list.length;i++){
            if(account_list[i]["COMPONENT"]){
                COMPONENT_ACCOUNTSET = account_list[i]["COMPONENT"].val();
                if(COMPONENT_ACCOUNTSET==null ){
                    return ; 
                }//accountset返回的null的情况
            }
            if(account_list[i]["COMPONENT"] && account_list[i]["COMPONENT"].val()['CHECKED']){
                account_result[index] = {};
                for(var elm in account_list[i]["ELEMENT"]){
                    account_result[index][elm] = account_list[i]["ELEMENT"][elm];
                }
                
                for( var elm in  COMPONENT_ACCOUNTSET ){
                    if(typeof(COMPONENT_ACCOUNTSET[elm]) == 'object'){
                        continue
                    }
                    account_result[index][elm] = COMPONENT_ACCOUNTSET[elm];
                }
                index++;
            }
        }
        
        if(account_result.length ==0){
            oojs$.showError("请添加账户");
            return;
        }
        console.log('account_list',JSON.stringify(account_result));

        var sentStruct = {
            'ROWID':null
            ,'ORDERID':null
            ,'PGROUPID':null
            ,'ACCOUNTID':null
            ,'TRADEID':null
            ,'POLICYID':null
            ,'PNAME':null
            ,'POLICYPARAM':null
            ,'DIRTYPE':null
            ,'STOCKSET':null
            ,'STARTTIME':null
            ,'ENDTIME':null
            ,'ISTEST':null
            ,'BUYCOUNT':null
            ,'BUYAMOUNT':null
            ,'PERCENT':null
            ,'FLAG_USER':null
            ,'VISIBLE':null
        }

        var sendData = [];
        for( var i = 0; i < account_result.length; i++ ){
            sendData[i] = {};
            //account_result[i]
            for(var elm in sentStruct){
                //policy_data
                //account_result
                if(policy_data_new.hasOwnProperty(elm)){
                    sendData[i][elm] = policy_data_new[elm];
                }
                if(account_result[i] && account_result[i].hasOwnProperty(elm)){
                    if(type == "modify" && elm == 'DIRTYPE'){
                        continue;
                    }
                    sendData[i][elm] = account_result[i][elm];
                }
            }
        }

        console.log("sendData",JSON.stringify(sendData));
        
        if(type == "add"){
            oojs$.httpPost_json("/insert_orderPeriod",sendData,function(result,textStatus,token){
                if(result
                    &&result.hasOwnProperty('success')
                    &&result.success){
                    $( "#order_period_tabs" ).tabs({ selected: 0 });
                    order_period.order_period_tab1_clk();
                }else{
                    oojs$.showError(result.message);
                }
            });
        }else if(type == "modify"){
            oojs$.httpPost_json("/update_orderPeriod",sendData,function(result,textStatus,token){
                if(result
                    &&result.hasOwnProperty('success')
                    &&result.success){
                    
                    $( "#order_period_tabs" ).tabs({ selected: 0 });
                    order_period.order_period_tab1_clk();
                }else{
                    oojs$.showError(result.message);
                }
            });
        }
    }
});
var order_period = new oojs$.com.stock.order_period();
oojs$.addEventListener("ready",function(){
    order_period.init();
});
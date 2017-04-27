oojs$.ns("com.stock.order_today");
oojs$.com.stock.order_today = oojs$.createClass(
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
        ,{
            'ID':"STATUS",
            'NAME':"状态"
        }
        ,{
            'ID':'DEALSTOCK',
            'NAME':"执行情况"//stockid
        }
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
    ,select_tradetype:[
        {id:"BUYCOUNT",name:"交易股数"}
        ,{id:"BUYAMOUNT",name:"交易金额"}
        ,{id:"PERCENT",name:"交易比例"}
    ]//帐户用
    ,order_today_list: []
    ,preOerder_ctrl_div:null
    ,order_today_body_div:null
    ,order_select1:null
    ,order_select2:null
    ,order_select3:null
    ,select_title:null//顶部下拉框数据结构
    ,init:function(){
        $( "#order_today_tabs" ).tabs();
        $( "#order_today_tabs" ).tabs({ selected: 0 });
        // $("#order_today_tabs").tabs('select', 2);
        $("#order_today").click(this.order_today_tab1_clk);
        $("#order_today_tabs_a1").click(this.order_today_tab1_clk);
        $("#order_today_tabs_a2").click(this.order_today_tab2_clk);
        order_today.order_today_tab1_clk();
    }

    ,order_today_tab1_clk:function(){
        order_today.load_order_today();
    }

    ,order_today_tab2_clk:function(event){

        dictTrade.load_userAccount(function(){
            policy.load_subscribe(function () {
                console.log("order\n","load subscrible\n");

                order_today.appendTB_new_order_today();
                order_today.select_title = null;
                order_today.select_title = {};
                for(var i = 0; i < policy.policy_subscribe.length; i++ ){
                    order_today.parse2obj_DIRTYPE( order_today.select_title, policy.policy_subscribe[i] );
                }
                order_today.appendTB_order_today_slct();
                if(policy.policy_subscribe.length>0){
                    $(order_today.order_select1).val(parseInt(policy.policy_subscribe[0]['DIRTYPE']));
                    order_today.handler_dirtype({'data':{'value':parseInt(policy.policy_subscribe[0]['DIRTYPE'])}});
                    
                    $(order_today.order_select2).val( parseInt(policy.policy_subscribe[0]['PGROUPID']) );
                    order_today.handler_group({'data':{'value':parseInt(policy.policy_subscribe[0]['PGROUPID'])}});
                    console.log(parseInt(policy.policy_subscribe[0]['POLICYID']))
                    $(order_today.order_select3).val( policy.policy_subscribe[0]['USERID']+"_"+policy.policy_subscribe[0]['POLICYID'] );
                    
                    
                }
                
            })
        });
        preload.getStock();
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

    ,appendTB_order_today_slct:function () {
        var self = this;
        self.option_append(self.order_select1, self.select_title, preload.getDirtype);
    }
    ,detail:null
    ,get_detail:function(){
        return this.detail;
    }
    ,order_today_btn_detail:function(event){
        //订单详情
        var self = event.data.scope;
        self.detail = event.data.data;
        console.log(JSON.stringify(event.data));
        var p=window.open("detailOrder.html");
    }
    ,order_today_btn_chg:function(event){
        //修改
        var self = event.data.scope;
        self.detail = event.data.data;
        self.appendTB_modify_order(self.detail);
    }
    ,order_today_btn_switch:function(event){
        //启动／禁用
        var self = event.data.scope;
        var sendData = event.data.data;
        // self.appendTB_modify_order(self.detail);
        console.log("switch",JSON.stringify(sendData))
        sendData['DIRTYPE']["ELEMENT"] =  sendData['DIRTYPE']['ORIGIN'];
        sendData['STARTTIME']["ELEMENT"] = oojs$.toHMSOBJ(sendData['STARTTIME']["ELEMENT"]);
        sendData['ENDTIME']["ELEMENT"] = oojs$.toHMSOBJ(sendData['ENDTIME']["ELEMENT"])

        for(var elm in sendData){
            sendData[elm] = sendData[elm]["ELEMENT"];
        }
        if(String(sendData['FLAG_USER']) == "0"){
           sendData['FLAG_USER'] = "1";
        }
        if(String(sendData['FLAG_USER']) == "1"){
            sendData['FLAG_USER'] = "0"
        }
        sendData['ADDTIME']=null;
        sendData['MODTIME']=null;
        sendData['ONETHIRD']=null;
        sendData['CTRL']=null;
        delete sendData['ADDTIME'];
        delete sendData['MODTIME'];
        delete sendData['ONETHIRD'];
        delete sendData['CTRL'];
        console.log("switch",JSON.stringify(sendData))
        oojs$.httpPost_json("/update_ordertoday",[sendData],function(result,textStatus,token){
                if(result.success){
                    // if( type == 1){
                    //     policy.policy_tab1_click();
                    // }else if( type == 2){
                    //     policy.policy_tab2_click();
                    // }
                    $( "#order_today_tabs" ).tabs({ selected: 0 });
                    order_today.order_today_tab1_clk();
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
    order_today_btn_herf:function(event){
        //股票详情
        console.log(JSON.stringify(event.data.item))
        var self = event.data.scope;
        self.stockDetail = event.data.item;
        self.stock = event.data.stock;
        event.preventDefault();
        var p=window.open("detailStock.html");
    }
    ,order_today_btn_modifyreback:function(event){
        //返回
        order_today.load_order_today();
    }
    ,appendTB_modify_order:function(){
        var self = this;
        var drawitem_data = arguments[0];
        console.log('appendTB_modify_order\n',JSON.stringify(drawitem_data));
        var STARTTIME = $('<div></div>');
        var start_component = new  oojs$.com.stock.component.hh_mm_ss();
        start_component.init(STARTTIME,oojs$.toHMSOBJ(drawitem_data['STARTTIME']['ELEMENT']));

        var ENDTIME = $('<div></div>');
        var end_component = new  oojs$.com.stock.component.hh_mm_ss();
        end_component.init(ENDTIME,oojs$.toHMSOBJ(drawitem_data["ENDTIME"]['ELEMENT']));


        var stockset = new oojs$.com.stock.component.stockset();
        var STOCKSET = {
            'ELEMENT':null
            ,'ELEMENT1':$('<div></div>')
            ,'ELEMENT2':$('<div></div>')
            ,'ROWSPAN':2
            ,'COMPONENT':stockset};
        stockset.appendCK_stockset(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            drawitem_data["STOCKSET"]['ELEMENT']);

        drawitem_data["STARTTIME"] ={'ELEMENT':STARTTIME,'COMPONENT':start_component};
        drawitem_data["ENDTIME"] = {'ELEMENT':ENDTIME,'COMPONENT':end_component};
        drawitem_data["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};

        var policyHead = policy.get_preOrder_head();
        var accountOBJ = {};
        accountOBJ["ELEMENT"] = drawitem_data['ACCOUNTID']['ELEMENT'];
        accountOBJ["COLUMN1"] = $('<div></div>');
        accountOBJ["COLUMN2"] = $('<div></div>');
        accountOBJ["COMPONENT"] = new oojs$.com.stock.component.acountset();
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
        );

        self.appendTB_modifyorder_flush(policyHead,drawitem_data,[accountOBJ]);
    }
    ,appendTB_modifyorder_flush:function(policy_head,policy_data,account_list){
        var self = this;

        var order_today_body_div =  $('#order_today_tabs_1').empty()

        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo(order_today_body_div);

        oojs$.appendTB_item_D2(tb,policy_head,policy_data);
        self.appendTB_accountHint(tb);
        // self.appendTB_account_body(tb, account_itemD2, dirtype);

        oojs$.appendTB_item_D2x(tb,account_list);


        var tr = $('<tr></tr>',{}).appendTo(tb);
        var td = $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr)
        $('<input></input>',{'type':"button",value:"提交"}).appendTo(td).click(
            {"policy_data":policy_data,"account_list":account_list,"type":"modify"}
            ,self.order_today_new_submit
            // 
        );

        $('<input></input>',{'type':"button",value:"取消"}).appendTo(td).click(
            self.order_today_btn_modifyreback
        );

    }
    ,appendTB_new_order_today:function(){
        var self = this;
        var container =$('#order_today_tabs_2');
        // container.empty();
        var tb = null;
        if(self.preOerder_ctrl_div==null){
            self.preOerder_ctrl_div = $('<div id="preOerder_ctrl_div"></div>');
            self.preOerder_ctrl_div.appendTo(container);
            tb = $('<table></table>', {
                'class':"display dataTable"
            });
        }

        tb.empty();
        console.log('appendTB_new_order_today\n',JSON.stringify(policy.policy_subscribe[0]));
        
        self.appendTB_control(tb);

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
        self.order_select1.append(
            "<option  value='-1'>请选择交易类型</option>"
        );
        // self.option_append(self.order_select1, self.select_title, policy.getDirtype);
        self.order_select1.change(self.handler_dirtype);
        td.append( self.order_select1 );
        //2----------------------------
        td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        td.append($('<label></label>').text("策略类型:"));

        self.order_select2 = $('<select></select>',{
            id:'order_select2'
        });
        self.order_select2.append(
            "<option  value='-1'>请选择策略类型</option>"
        );

        self.order_select2.prop("disabled", true);
        self.order_select2.change(self.handler_group);

        td.append( self.order_select2 );

        //3----------------------------
        td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        td.append($('<label></label>').text("策略名称:"));

        self.order_select3 = $('<select></select>',{
            id:'order_select3'
        });

        self.order_select3.append(
            "<option value='-1'>请选择策略名称</option>"
        );

        self.order_select3.change(null,self.handler_policy);
        self.order_select3.prop("disabled", true);
        td.append( self.order_select3 );
        
    }

    // ,appendTB_neworder_body:function(policy_head, policy_item, account_itemD2){
    //     var self = this;

    //     if(self.order_today_body_div == null){
    //         self.order_today_body_div = $('<div id="order_today_body_div"></div>');
    //         self.order_today_body_div.appendTo($('#order_today_tabs_2'));
    //     }

    //     self.order_today_body_div.empty();

    //     var tb = $('<table></table>', {
    //         'class':"display dataTable"
    //     }).appendTo(self.order_today_body_div);

    //     var dirtype = policy_item['DIRTYPE']['ELEMENT'];
    //     delete policy_item['DIRTYPE'];
    //     oojs$.appendTB_item_D2(tb,policy_head,policy_item);
    //     self.appendTB_accountHint(tb);
    //     self.appendTB_account_body(tb, account_itemD2, dirtype);

    // }

    ,appendTB_accountHint:function(tb){
        var tr = $('<tr></tr>',{'class':"even"}).appendTo(tb);
        var td = $('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
        td.append($('<label></label>').text("请选择您帐户:"));
        var label = $('<label></label>',{

        }).text('(*注：只有选择了账户才能选择交易策略)');
        label.css({ 'color': 'red', 'font-size': '80%' });
        td.append(label);
    }



    ,appendTB_order_today:function(){
        var self = this;

        var panel,list_head,list_body;
        panel = $('#order_today_tabs_1');

        list_head = order_today.list_benchmark_head;//order_today_list;//self.list_benchmark_head;
        list_body = [];
        var list = null;
        list = this.order_today_list;

       
        var one_third = '';
        var btnName = '';
        var href = null;
        var hrefs = null;
        var div = null;
        var stocks = [];
        for(var elm = 0; elm < list.length; elm++){
            list_body[elm] = {};
            for(var  inner in  list[elm]){
                list_body[elm][inner] = {ELEMENT: list[elm][inner]};
            }
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
                        self.order_today_btn_herf
                    );
                    div.append(href)
                    div.append($('<br />'));
                }
                
                list_body[elm]['DEALSTOCK'] ={'ELEMENT': div,'COMPONENT':list[elm]['DEALSTOCK'],'ORIGIN':list[elm]['DEALSTOCK']};
            }
            //<a id="sign_up" class="sign_new">Sign up</a>
            
            if(parseInt(list[elm]['BUYCOUNT'])>0){
                one_third = parseInt(list[elm]['BUYCOUNT'])+"股";
            }else if(parseInt(list[elm]['BUYAMOUNT'])>0){
                one_third = parseInt(list[elm]['BUYAMOUNT'])+"¥";
            }else if(parseInt(list[elm]['PERCENT'])>0){
                one_third = parseInt(list[elm]['PERCENT'])+"％";
            }
            list_body[elm]['ONETHIRD'] = {'ELEMENT':one_third};
            list_body[elm]['POLICYID'] = {'ELEMENT':list[elm]['POLICYID']};//{ELEMENT:preload.getPGroupItem(list[elm]['POLICYID'])};
            list_body[elm]['FROMID'] = {'ELEMENT':preload.getFrom(list[elm]['DIRTYPE'])};
            

            var div = $('<div></div>');
            $('<input></input>',{type:"button",value:"详情"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_today.order_today_btn_detail
            );

            $('<input></input>',{type:"button",value:"修改"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_today.order_today_btn_chg
            );

            btnName = "X";
            if(parseInt(list_body[elm]['FLAG_USER']['ELEMENT']) == 1){
                btnName = '✓'
            }

            $('<input></input>',{type:"button",value:btnName}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_today.order_today_btn_switch
            );

            list_body[elm]['CTRL'] = {ELEMENT:div};
        }
        oojs$.appendTB_list(panel,list_head,list_body);
    }

    ,load_order_today:function(){
        var self = this;
        var sendData = {};

        oojs$.httpPost_json("/select_preorder",sendData,function(result,textStatus,token){
            if(result.success){

                
                self.order_today_list = [];
                self.order_today_list = result.data;
                self.appendTB_order_today();
            }else{
                oojs$.showError(result.message);
            }
        });
    }

    ,append_select_tradetype: function(){
        var self = this;
        var select = $('<select></select>',{
            // id:'order_select2'
        });

        select.prop( "disabled", true );

        select.append(
            "<option value='-1'>请选择交易策略</option>"
        );

        for(var i = 0; i < self.select_tradetype.length; i++){
            select.append(
                "<option value='"
                +self.select_tradetype[i]['id']
                +"'>"
                +self.select_tradetype[i]['name']+"</option>"
            );
        }
        return select;
    }

    ,appendTB_account_body:function( tb, item, dirtype){
        var self = this;
        var item_D2 = [];
        var div_col1 = null;
        var div_col2 = null;
        var checkbox = null;
        var label_name = null;
        var label_value = null;
        var select_trade = null;
        var select_dirtype = null;
        var input = null;

        for(var i = 0; i < item.length; i++ ){
            item_D2[i] = {};
            item_D2[i].ACCOUNTID = item[i]['ACCOUNTID'];

            div_col1 = $('<div></div>');
            div_col2 = $('<div></div>');
            //column1
            checkbox = $('<input></input>',{
                'type':'checkbox'
            }).change(
                // {}
                // self.handler_ck
            );
            checkbox.prop("disabled", true );
            div_col1.append(checkbox);
            label_name = $('<label></label>').text('帐户：');
            div_col1.append(label_name);
            //column2
            label_value = $('<label></label>').text(item[i]['ACCOUNTID']);
            div_col2.append(label_value);

            var borrow = 1;
            var newdirtype = 0;
            if(dirtype == 0){//买入
                if(borrow == 0){
                    newdirtype = 0;
                }else if(borrow == 1){
                    //委托种类
                    select_dirtype = $('<select></select>');
                    select_dirtype.append(
                        "<option value='0'>普通</option>"
                    );
                    select_dirtype.append(
                        "<option value='2'>融资买入</option>"
                    );
                    select_dirtype.prop("disabled", true );
                    div_col2.append(select_dirtype);
                }
            }else if(dirtype == 1){//卖出
                if(borrow == 0){
                    newdirtype = 1;
                }else if(borrow == 1){
                    //委托种类
                    select_dirtype = $('<select></select>');
                    select_dirtype.append(
                        "<option value='1'>普通</option>"
                    );
                    select_dirtype.append(
                        "<option value='5'>卖券还款</option>"
                    );
                    select_dirtype.prop("disabled", true );
                    div_col2.append(select_dirtype);
                }
            }else if(dirtype == 9){//撤单
                //??
            }


            select_trade = self.append_select_tradetype();
            select_trade.change(
                // {}
                // self.handler_ck
            );
            div_col2.append(select_trade);
            input = $('<input></input>',{type:'text'});
            input.prop("disabled", true );
            div_col2.append(input);

            item_D2[i]["COLUMN1"] = div_col1;
            item_D2[i]["COLUMN2"] = div_col2;
        }

        oojs$.appendTB_item_D2x(tb,item_D2);
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
            ,"PNAME":appendObj["PNAME"]+(appendObj["USERID"]+""=="0"?"":"(自定义)")
            ,"USERID":appendObj["USERID"]
        });

    }

    ,handler_dirtype: function(event){
        var self = order_today;
        self.order_select2.empty();
        self.order_select3.empty();
        self.order_select2.prop("disabled", false);
        self.order_select3.prop("disabled", true);
        self.order_select2.append(
            "<option  value='-1'>请选择策略类型</option>"
        );

        var value = -1
        if(event.data != null){
            value = event.data.value;
        }else{
            value = this.value;
        }
        
        self.option_append(self.order_select2,self.select_title[value],function(pp){
            return policy.find_item_policyGID(pp)["NAME"];
        });

        self.order_select3.append(
            "<option value='-1'>请选择策略名称</option>"
        );
    }

    ,handler_group: function(event){
        var self = order_today;
        self.order_select3.empty();
        self.order_select3.prop("disabled", false);
        self.order_select3.append(
            "<option value='-1'>请选择策略名称</option>"
        );
        // var value = -1
        // if(event.data != null){
        //     value = event.data.value;
        // }else{
        //     value = self.order_select2.val();
        // }
        var tempArr = self.select_title[ self.order_select1.val()][self.order_select2.val()];
        
        for( var i = 0; i < tempArr.length; i++ ){
            self.order_select3.append(
                "<option value='"
                +tempArr[i]['USERID']+"_"+tempArr[i]['POLICYID']
                +"'>"+tempArr[i]["PNAME"]+"</option>"
            );
        }

    }
    ,handler_policy: function(event){
        // console.log(">>>>>>>>>>",
        // self.order_select1.val(),
        // self.order_select2.val(),
        // this.value,$(this).find("option:selected").text() );
        var USERID = '';
        var POLICYID = '';
        var self = order_today;
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
        //------------------------

        var item = policy.search_policyList_Item(USERID,POLICYID,policy.policy_subscribe);
        var drawitem_data = {};
        for(var elm in item){
            drawitem_data[elm] = {ELEMENT:item[elm]};
        }
        var STARTTIME = $('<div></div>');
        var start_component = new  oojs$.com.stock.component.hh_mm_ss();
        start_component.init(STARTTIME,item["STARTTIME"]);

        var ENDTIME = $('<div></div>');
        var end_component = new  oojs$.com.stock.component.hh_mm_ss();
        end_component.init(ENDTIME,item["ENDTIME"]);


        var stockset = new oojs$.com.stock.component.stockset();
        var STOCKSET = {
            'ELEMENT':null
            ,'ELEMENT1':$('<div></div>')
            ,'ELEMENT2':$('<div></div>')
            ,'ROWSPAN':2
            ,'COMPONENT':stockset};
        stockset.appendCK_stockset(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            item["STOCKSET"]);

        drawitem_data["STARTTIME"] ={'ELEMENT':STARTTIME,'COMPONENT':start_component};
        drawitem_data["ENDTIME"] = {'ELEMENT':ENDTIME,'COMPONENT':end_component};
        drawitem_data["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};

        var policyHead = policy.get_preOrder_head();

        dictTrade.load_userAccount(function(){
            var trade_list = [];
            var index = 0;
            var item_account = null;
            for(var elm in dictTrade.dictTrade_list_body){
                item_account = dictTrade.dictTrade_list_body[elm];
                trade_list[index] = {};
                
                trade_list[index]["ELEMENT"] = item_account;
                trade_list[index]["COLUMN1"] = $('<div></div>');
                trade_list[index]["COLUMN2"] = $('<div></div>');
                trade_list[index]["COMPONENT"] = new oojs$.com.stock.component.acountset();
                ////div1, div2, ACCOUNTID, DIRTYPE, BORROW, BUYCOUNT, BUYAMOUNT, PERCENT, CHECKED)
                
                trade_list[index]["COMPONENT"].init(
                    trade_list[index]["COLUMN1"]
                    ,trade_list[index]["COLUMN2"]
                    ,item_account['ACCOUNTID']
                    ,item['DIRTYPE']
                    ,preload.getTradeItem(item_account['TRADEID'])["BORROW"]
                    ,item_account['BUYCOUNT']
                    ,item_account['BUYAMOUNT']
                    ,item_account['PERCENT']
                    ,true
                );
            }
            console.log("trade_list",JSON.stringify(trade_list));
            self.appendTB_neworder_flush(policyHead,drawitem_data,trade_list);
        })
    }
    ,appendTB_neworder_flush:function(policy_head,policy_data,account_list){
        var self = this;

        if(self.order_today_body_div == null){
            self.order_today_body_div = $('<div id="order_today_body_div"></div>');
            self.order_today_body_div.appendTo($('#order_today_tabs_2'));
        }

        self.order_today_body_div.empty();

        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo(self.order_today_body_div);

        oojs$.appendTB_item_D2(tb,policy_head,policy_data);
        self.appendTB_accountHint(tb);
        // self.appendTB_account_body(tb, account_itemD2, dirtype);

        oojs$.appendTB_item_D2x(tb,account_list);


        var tr = $('<tr></tr>',{}).appendTo(tb);
        var td = $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr)
        $('<input></input>',{'type':"button",value:"提交"}).appendTo(td).click(
            {"policy_data":policy_data,"account_list":account_list}
            ,self.order_today_new_submit
            // 
        );

        // $('<input></input>',{'type':"button",value:"取消"}).appendTo(td).click(
        //     drawitem_data,
        //     self.policy_item_reback
        // );


    }
    ,order_today_new_submit:function(event){
        var policy_data = event.data['policy_data'];
        var account_list = event.data['account_list'];
        var type = "add"
        if(event.data.hasOwnProperty("type")){
            type = event.data['type']
        }
        console.log("policy_data",JSON.stringify(policy_data));
        if(type == 'modify'){
            policy_data['DIRTYPE']['ELEMENT'] = policy_data['DIRTYPE']['ORIGIN'];
        }
        for(var elm in policy_data){
            if(policy_data[elm] && policy_data[elm].hasOwnProperty("COMPONENT")
                &&policy_data[elm].hasOwnProperty('ELEMENT')){
                policy_data[elm] = policy_data[elm]['COMPONENT'].val();
            }else if(policy_data[elm] && policy_data[elm].hasOwnProperty('ELEMENT')){
                policy_data[elm] = policy_data[elm]['ELEMENT'];
            }
        }
        console.log("policy_data",JSON.stringify(policy_data));

        var account_result = []
        for(var i =0; i< account_list.length;i++){
            
            if(account_list[i]["COMPONENT"] && account_list[i]["COMPONENT"].val()['CHECKED']){
                account_result[i] = {};

                for(var elm in account_list[i]["ELEMENT"]){
                    account_result[i][elm] = account_list[i]["ELEMENT"][elm];
                }

                for( var elm in  account_list[i]["COMPONENT"].val() ){
                    account_result[i][elm] = account_list[i]["COMPONENT"][elm];
                }
            }
        }
        console.log('account_list',JSON.stringify(account_result));
        
        
        var sentStruct = {
            'ROWID':null
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
        }

        var sendData = [];
        for( var i = 0; i < account_result.length; i++ ){
            sendData[i] = {};
            //account_result[i]
            for(var elm in sentStruct){
                //policy_data
                //account_result
                if(policy_data.hasOwnProperty(elm)){
                    sendData[i][elm] = policy_data[elm];
                }
                if(account_result[i].hasOwnProperty(elm)){
                    if(type == "modify" && elm == 'DIRTYPE'){
                        continue;
                    }
                    sendData[i][elm] = account_result[i][elm];
                }
            }
        }

        console.log("sendData",JSON.stringify(sendData));
        if(type == "add"){
            oojs$.httpPost_json("/insert_preorder",sendData,function(result,textStatus,token){
                if(result.success){
                    $( "#order_today_tabs" ).tabs({ selected: 0 });
                    order_today.order_today_tab1_clk();
                }else{
                    oojs$.showError(result.message);
                }
            });
        }else if(type == "modify"){
            oojs$.httpPost_json("/update_ordertoday",sendData,function(result,textStatus,token){
                if(result.success){
                    // if( type == 1){
                    //     policy.policy_tab1_click();
                    // }else if( type == 2){
                    //     policy.policy_tab2_click();
                    // }
                    $( "#order_today_tabs" ).tabs({ selected: 0 });
                    order_today.order_today_tab1_clk();
                }else{
                    oojs$.showError(result.message);
                }
            });
        }
    }

});

var order_today = new oojs$.com.stock.order_today();
oojs$.addEventListener("ready",function(){
    order_today.init();
});
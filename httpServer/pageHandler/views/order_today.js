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
    ,order_today_list: []
    ,preOerder_ctrl_div:null
    ,order_today_body_div:null
    ,order_select1:null
    ,order_select2:null
    ,order_select3:null
    ,select_title:null//顶部下拉框数据结构
    ,status:'init'
    ,tb:null
    ,action:''
    ,stock_market:''
    ,origin:''
    ,init:function(){
        var self = this;
        $( "#order_today_tabs" ).tabs();
        $( "#order_today_tabs" ).tabs({ selected: 0 });
        // $("#order_today_tabs").tabs('select', 2);
        $("#order_today").click(this.order_today_tab1_clk);
        $("#order_today_tabs_a1").click(this.order_today_tab1_clk);
        $("#order_today_tabs_a2").click(this.order_today_tab2_clk);
        
        preload.getStock(function(){
            if(oojs$.getPanelID() == 2){
                if(self.action == 'order_new'){
                    $( "#order_today_tabs" ).tabs({ 'selected': 1 });
                    order_today.order_today_tab2_clk();
                }else{
                    order_today.order_today_tab1_clk();
                }
                
            }
        });
        oojs$.addEventListener('order_today',self.handler_ordtoday);
    }
    //action new_data
    ,handler_ordtoday:function(dt){
        /*** action
        client  <-->    server
        null    <-->    new_data
        list    <-->    list

        dt{type,action,data}
        */
        console.log('order_today dt:',dt);
        var self = order_today;
        switch(dt.action){
            case "new_data":
                if(oojs$.getPanelID() == 2){
                    console.log("sendWSMessage list")
                    oojs$.sendWSMessage({'type':'order_today','action':'list','data':''});
                }
                break;
            case "list":
                console.log('order_today list:',dt.data)
                self.order_today_list = dt.data.data;
                if(self.order_today_list.length != 0 ){
                    self.appendTB_order_today();
                }
                break;
        }
    }

    ,order_today_tab1_clk:function(){
        var self = order_today;
        order_today.load_order_today();
    }

    ,order_today_tab2_clk:function(event){
        var self = order_today;
        dictTrade.load_userAccount(function(){
            if(dictTrade.dictTrade_list_body.length == 0 && self.status == "init"){
                self.status = "notinit";
                $('#accordion').accordion({'active':0});
                oojs$.dispatch("ready");
            }else if(dictTrade.dictTrade_list_body.length > 0 ){
                policy.load_subscribe(function () {
                    console.log("order\n","load subscrible\n");
                    self.status = "notinit";
                    if(policy.policy_subscribe.length == 0){
                        $('#accordion').accordion({'active':1});
                        oojs$.dispatch("ready");
                    }else{
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
                            $(order_today.order_select3).val( policy.policy_subscribe[0]['USERID']+"_"+policy.policy_subscribe[0]['POLICYID'] ); 
                        }
                    }
                })
            }  
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
        console.log('order_today_btn_detail',JSON.stringify(event.data));
        shareObj.detailName = 'order_today';
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
        }else if(String(sendData['FLAG_USER']) == "1"){
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
        drawitem_data['PGROUPID']['ORIGIN'] = drawitem_data['PGROUPID']['ELEMENT'];
        drawitem_data['PGROUPID']['ELEMENT'] = preload.getPGroupItem(drawitem_data['PGROUPID']['ELEMENT'])["NAME"]
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
        stockset.init(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            drawitem_data["STOCKSET"]['ELEMENT']);

        drawitem_data['PGROUPID'] = {'ELEMENT': preload.getPGroupItem(drawitem_data['PGROUPID']['ELEMENT'])["NAME"]};
        drawitem_data['DIRTYPE'] = {'ELEMENT': preload.getDirtype(drawitem_data['DIRTYPE']['ELEMENT'])};

        var select= $('<select ></select>',{
            style:"height:25px;width:80px;-webkit-appearance: none;"
        });
        oojs$.generateSelect(select, drawitem_data['POLICYPARAM']['ELEMENT']);
        drawitem_data['POLICYPARAM'] = {'ELEMENT': select,'element':drawitem_data['POLICYPARAM']['ELEMENT']};
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
            ,null
        );
        var sendAccounts = [{'accountid':drawitem_data['ACCOUNTID']['ELEMENT']}];
        
        oojs$.httpPost_json('/capital',sendAccounts,function(result,textStatus,token){
            console.log(JSON.stringify(arguments));
            if(result.success){//CAPITAL.account_muse
                var capitals;
                try{
                    //result.data = '[{ "status": "200", "tradeid": "1", "accountid": "309219512983", "userid": "20000","account_muse": "1986.90","account_value": "6544.00","account_msum": "8530.90" }]';
                    capitals = JSON.parse(result.data);
                }catch(err){
                    capitals = '';
                    console.log('order_today',err);
                    oojs$.showError('您的资金验证出了问题!');
                }
                if(capitals && capitals.length>0 
                    && capitals[0].hasOwnProperty('status')
                    && capitals[0]['status'] == 200){
                    accountOBJ["COMPONENT"].addCapital(capitals[0])
                    self.appendTB_modifyorder_flush(policyHead,drawitem_data,[accountOBJ]);

                }else{
                    oojs$.showError('您的资金验证出了问题!');
                }
            }else{
                oojs$.showError('您的资金验证出了问题!');
            }
        });
        
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
        //container.empty();
        if(self.tb != null){
            self.tb.empty();
        }else{
            self.tb = $('<table></table>', {
            'class':"display dataTable"
        });
        }
        
        if(self.preOerder_ctrl_div==null){
            self.preOerder_ctrl_div = $('<div></div>');
            self.preOerder_ctrl_div.appendTo(container);
            
        }
        
        
        console.log('appendTB_new_order_today\n',JSON.stringify(policy.policy_subscribe[0]));
        
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

        self.order_select3.change({'from':'appendTB_control'},self.handler_policy);
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
        var status = '';
        for(var elm = 0; elm < list.length; elm++){
            list_body[elm] = {};
            for(var  inner in  list[elm]){
                list_body[elm][inner] = {'ELEMENT': list[elm][inner]};
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
            status = list[elm]['STATUS'];
            list_body[elm]['STATUS'] = {'ELEMENT':preload.getExecute(list[elm]['STATUS']),'ORIGIN': status };
            //<a id="sign_up" class="sign_new">Sign up</a>
            one_third = '';
            if(parseInt(list[elm]['BUYCOUNT'])>0){
                one_third = parseInt(list[elm]['BUYCOUNT'])+"股";
            }else if(parseInt(list[elm]['BUYAMOUNT'])>0){
                one_third = parseInt(list[elm]['BUYAMOUNT'])+"¥";
            }else if(Number(list[elm]['PERCENT'])>0){
                one_third = Number(list[elm]['PERCENT'])+"％";
            }
            list_body[elm]['ONETHIRD'] = {'ELEMENT':one_third};
            list_body[elm]['POLICYID'] = {'ELEMENT':list[elm]['POLICYID']};//{ELEMENT:preload.getPGroupItem(list[elm]['POLICYID'])};
            list_body[elm]['FROMID'] = {'ELEMENT':preload.getFrom(list[elm]['DIRTYPE'])};
            

            var div = $('<div></div>');
            $('<input></input>',{type:"button",value:"详情"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_today.order_today_btn_detail
            );
             if(status == "3"||status == "4"){
                $('<input></input>',{type:"button",value:"修改"}).appendTo(div).prop('disabled',true);
            }else {//if(status == "0"||status == "1")
                $('<input></input>',{type:"button",value:"修改"}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_today.order_today_btn_chg
                );
            }
            

            btnName = "X";
            if(parseInt(list_body[elm]['FLAG_USER']['ELEMENT']) == 1){
                btnName = '✓'
            }

            $('<input></input>',{type:"button",value:btnName}).appendTo(div).click(
                {'data':list_body[elm],'scope':self},
                order_today.order_today_btn_switch
            );

            list_body[elm]['CTRL'] = {'ELEMENT':div};
        }
        oojs$.appendTB_list(panel,list_head,list_body);
    }

    ,load_order_today:function(){
        var self = this;
        var sendData = {};
        //oojs$.sendWSMessage({'type':'order_today','action':'list','data':''});
        oojs$.httpPost_json("/select_preorder",sendData,function(result,textStatus,token){
            if(result.success){
                self.order_today_list = [];
                self.order_today_list = result.data;
                if(self.order_today_list.length == 0 && self.status == 'init' ){
                    $('#order_today_tabs').tabs({ 'selected': 1 });
                    self.order_today_tab2_clk();
                }else{
                    self.appendTB_order_today();
                }
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
            ,"PNAME":appendObj["PNAME"]+appendObj["USERID"]
            ,"USERID":appendObj["USERID"]
        });

    }

    ,handler_dirtype: function(event){
        var self = order_today;
        self.order_select2.empty();
        self.order_select3.empty();
        self.order_select2.prop("disabled", false);
        self.order_select3.prop("disabled", true);
        // self.order_select2.append(
        //     "<option  value='-1'>请选择策略类型</option>"
        // );

        var value = -1;
        if(event.data != null){
            value = event.data.value;
        }else{
            value = this.value;
        }
        
        self.option_append(self.order_select2,self.select_title[value],function(pp){
            return preload.getPGroupItem(pp)["NAME"];
        });

        // self.order_select3.append(
        //     "<option value='-1'>请选择策略名称</option>"
        // );
    }

    ,handler_group: function(event){
        var self = order_today;
        self.order_select3.empty();
        self.order_select3.prop("disabled", false);
        // self.order_select3.append(
        //     "<option value='-1'>请选择策略名称</option>"
        // );
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
        // console.log("order_today >>>>>>>>>>",
        // self.order_select1.val(),
        // self.order_select2.val(),
        // this.value,$(this).find("option:selected").text() );
        var USERID = '';
        var POLICYID = '';
        var self = order_today;
        var from = '';
        if(event.data != null && event.data.hasOwnProperty('from') ){
            from = event.data.from;
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
        if(self.stock_market != '' && self.origin == 'market'){
           item['STOCKSET'] += (','+self.stock_market);
        }
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
        stockset.init(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            item["STOCKSET"]);

        drawitem_data['PGROUPID'] = {'ELEMENT': preload.getPGroupItem(drawitem_data['PGROUPID']['ELEMENT'])["NAME"]};
        drawitem_data['DIRTYPE'] = {'ELEMENT': preload.getDirtype(drawitem_data['DIRTYPE']['ELEMENT'])};

        var select= $('<select ></select>',{
            style:"height:25px;width:80px;-webkit-appearance: none;"
        });
        oojs$.generateSelect(select, drawitem_data['POLICYPARAM']['ELEMENT']);
        drawitem_data['POLICYPARAM'] = {'ELEMENT': select, 'element':drawitem_data['POLICYPARAM']['ELEMENT']};
        drawitem_data["STARTTIME"] = {'ELEMENT':STARTTIME,'COMPONENT':start_component};
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
                sendAccounts.push({"accountid":item_account['ACCOUNTID']})
                trade_list[index] = {};
                
                trade_list[index]["ELEMENT"] = item_account;
                trade_list[index]["COLUMN1"] = $('<div></div>');
                trade_list[index]["COLUMN2"] = $('<div></div>');
                trade_list[index]["COMPONENT"] = new oojs$.com.stock.component.accountset();
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
                    ,item_account
                );
                index++;
            }

            if(sendAccounts.length>0){
                console.log("trade_list",JSON.stringify(trade_list));
                //if(from == ''){
                    
                oojs$.httpPost_json('/capital',sendAccounts,function(result,textStatus,token){
                    console.log(JSON.stringify(arguments));
                    if(result.success){
                        var capitals;
                        try{
                            //result.data = '[{ "status": "200", "tradeid": "1", "accountid": "309219512983", "userid": "20000","account_muse": "1986.90","account_value": "6544.00","account_msum": "8530.90" }]';
                            capitals= JSON.parse(result.data);
                        }catch(err){
                            capitals = '';
                            console.log('order_today',err);
                        }
                        
                        if(capitals){
                            for(var i = 0; i < trade_list.length; i++){
                                for(var elm in capitals){
                                    var item_capital = capitals[elm];
                                    if(String(trade_list[i]["ELEMENT"]['ACCOUNTID']) == String(item_capital.accountid) ){
                                        if(String(item_capital.status) != "200"){
                                            oojs$.showError("您的账号："+item_capital.accountid+"资金验证存在问题");
                                            return;
                                        }
                                        trade_list[i]["COMPONENT"].addCapital(item_capital);
                                    }
                                }
                            }
                            self.appendTB_neworder_flush(policyHead,drawitem_data,trade_list);
                        }else{
                            oojs$.showError("您的资金验证存在问题 code data 604");
                        }
                    }else{
                        oojs$.showError("您的资金验证存在问题 code url 404");
                    }
                });
//
                // }else if(from == ''){
                //     self.appendTB_neworder_flush(policyHead, drawitem_data, trade_list);
                // }

            }else{
                oojs$.showError("您还没有添加账号");
            }

            
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

        var used = policy_data['POLICYPARAM']['ELEMENT'].val();
        policy_data['POLICYPARAM']=policy_data['POLICYPARAM']['element'];
        policy_data['POLICYPARAM']['used'] = used;

        for(var elm in policy_data){
            if(policy_data[elm] && policy_data[elm].hasOwnProperty("COMPONENT")
                &&policy_data[elm].hasOwnProperty('ELEMENT')){
                policy_data[elm] = policy_data[elm]['COMPONENT'].val();
            }else if(policy_data[elm] && policy_data[elm].hasOwnProperty('ELEMENT')){
                policy_data[elm] = policy_data[elm]['ELEMENT'];
            }
        }

        console.log("policy_data\n",JSON.stringify(policy_data));
        console.log("account_list\n",JSON.stringify(account_list));
        var account_result = []
        for(var i =0; i< account_list.length;i++){
            
            if(account_list[i]["COMPONENT"] && account_list[i]["COMPONENT"].val()['CHECKED']){
                account_result[i] = {};

                for(var elm in account_list[i]["ELEMENT"]){
                    account_result[i][elm] = account_list[i]["ELEMENT"][elm];
                }
                if(!account_list[i]["COMPONENT"].val() ){return; }//accountset返回的null的情况
                for( var elm in  account_list[i]["COMPONENT"].val() ){
                    account_result[i][elm] = account_list[i]["COMPONENT"][elm];
                }
            }
        }

        if(account_result.length ==0){
            //oojs$.showError("请添加账户");
            return;
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
    console.log('order ready',JSON.stringify(arguments));
    //{'type':'showPanel','action':'order_new','origin':'market','data':param}
    if(typeof(arguments[0]) == 'object'){
        var obj = arguments[0];
        if(obj.hasOwnProperty('type') 
            && obj.hasOwnProperty('action')
            && obj.hasOwnProperty('data')){
            switch(obj['type']){
                case 'showPanel':
                    order_today.action = obj['action'];
                    order_today.stock_market = obj['data'];
                    order_today.origin = obj['origin'];
                    break;
            }
        }else{
            order_today.action = '';
            order_today.stock_market = '';
            order_today.origin = '';
        }
    }
    //order ready {"0":"order_new","1":"603788"}
    order_today.init();
});
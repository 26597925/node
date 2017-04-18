oojs$.ns("com.stock.preOrder");
oojs$.com.stock.preOrder = oojs$.createClass(
{

//     ROWID
//
//     ORDERID
//     USERID
//     ACCOUNTID   stockid
//     POLICYID
//     TRADEID
//
//     POLICYPARAM
//     DIRTYPE
//     STOCKSET
//     ISTEST
//     BUYCOUNT
//     BUYAMOUNT
//     PERCENT
//     STATUS
//     FLAG
//     ADDTIME
//     FROMID

    list_benchmark_head: [

        // {
        //     ID:"PNAME",
        //     NAME:"策略名称"
        // }
        // ,
        {
            ID:"DIRTYPE",
            NAME:"交易类型"
        }
        ,{
            ID:'ACCOUNTID',
            NAME:"帐户"
        }
        ,{
            ID:'TRADEID',
            NAME:"券商"
        }

        // ,{
        //     ID:"STARTTIME",
        //     NAME:"开始时间"
        // }
        // ,{
        //     ID:"ENDTIME",
        //     NAME:"结束时间"
        // }
        ,{
            ID:"STOCKSET",
            NAME:"自选股"
        }
        ,{
            ID:"PERCENT",
            NAME:"交易比例"
        }
        ,{
            ID:"STATUS",
            NAME:"状态"
        }
        ,{
            ID:"ONETHIRD",
            NAME:"金额／数量" //三选一
        }
        ,{
            ID:'STOCKID',
            NAME:"执行情况"//stockid
        }
        ,{
            NAME:"提交时间"
        }
        ,{
            NAME:"修改时间"
        }
        ,{
            ID:"CTRL",
            NAME:"操作"
        }
    ]

    ,select_tradetype:[
        {id:"BUYCOUNT",name:"交易股数"}
        ,{id:"BUYAMOUNT",name:"交易金额"}
        ,{id:"PERCENT",name:"交易比例"}
    ]//帐户用
    ,preOrder_list: []
    ,new_div_ctrl:null
    ,new_div_body:null
    ,order_select1:null
    ,order_select2:null
    ,order_select3:null

    ,init:function(){
        $("#preOrder_tabs").tabs();
        $("#preOrder").click(this.preOrder_tab1_clk);
        $("#preOrder_tabs_a1").click(this.preOrder_tab1_clk);
        $("#preOrder_tabs_a2").click(this.preOrder_tab2_clk);
        this.preOrder_tab1_clk();
    }

    ,preOrder_tab1_clk:function(){
        preOrder.load_preorder();
    }

    ,preOrder_tab2_clk:function(){

        preOrder.load_alreadySubscrible();
        // preOrder.appendTB_new_preOrder();
    }
    ,preOrder_btn_tail:function(){}
    ,preOrder_btn_chg:function(){}
    ,preOrder_btn_unsubscrible:function(){}

    ,load_alreadySubscrible:function(){
        preOrder.appendTB_new_preOrder();
    }
    ,appendTB_new_preOrder:function(){
        var self = this;
        self.console("appendTB_preOrder_slct");
        var container =$('#preOrder_tabs_2');


        if(self.new_div_ctrl==null){
            var tb = $('<table></table>', {
                'class':"display dataTable"
            });
            self.new_div_ctrl = $('<div id="new_div_ctrl"></div>');
            self.new_div_ctrl.appendTo(container);

            self.new_div_ctrl.append(tb);
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

            self.order_select3.change(self.handler_policy);
            self.order_select3.prop("disabled", true);

            td.append( self.order_select3 );

        }



        if(self.new_div_body==null){
            self.new_div_body = $('<div id="new_div_body"></div>');
            self.new_div_body.appendTo(container);
            var tb = $('<table></table>', {
                'class':"display dataTable"
            });
            self.new_div_body.append(tb);

            var list_head = policy.list_benchmark_head;
            var drawitem_data = null;
            drawitem_data = {};

            //drawitem_data["PGROUPID"] ={ELEMENT:self.find_item_policyGID(item["PGROUPID"])['NAME'],element:item["PGROUPID"]};
            //drawitem_data["DIRTYPE"] ={ELEMENT:self.getDirtype(item["DIRTYPE"]),element:item["DIRTYPE"]};

            var STARTTIME = $('<div></div>');
            oojs$.generateHMDOption(STARTTIME);
            var kids = STARTTIME.find( "select" );
            var hh = parseInt(0);
            var mm = parseInt(0);
            var ss = parseInt(0);
            $(kids[0]).val(hh<=9?"0"+hh:hh);
            $(kids[1]).val(mm<=9?"0"+mm:mm);
            $(kids[2]).val(ss<=9?"0"+ss:ss);

            var ENDTIME = $('<div></div>');
            oojs$.generateHMDOption(ENDTIME);
            var kids = ENDTIME.find( "select" );
            var hh = parseInt(0);
            var mm = parseInt(0);
            var ss = parseInt(0);
            $(kids[0]).val(hh<=9?"0"+hh:hh);
            $(kids[1]).val(mm<=9?"0"+mm:mm);
            $(kids[2]).val(ss<=9?"0"+ss:ss);

            drawitem_data["STARTTIME"] ={ELEMENT:STARTTIME};
            drawitem_data["ENDTIME"] = {ELEMENT:ENDTIME};
            drawitem_data["STOCKSET"] = {ELEMENT:''};//STOCKSET;//{ELEMENT:STOCKSET};
            //drawitem_data["PERCENT"] = {ELEMENT:$('<input type="text" value="'+item["PERCENT"]+'" ></input><label style="color: red; font-size: 80%;">(*注：比例范围0-1，最多保留小数点后两位)</label>')}
            //drawitem_data["CTRL"] = {ELEMENT:CTRL,COLSPAN:2};
            oojs$.appendTB_item_D2(tb,list_head,drawitem_data);

            // self.appendTB_accountHint(tb);

            var itemD2_count = [{
                'USERID': -1,
                'TRADEID': -1,
                'ACCOUNTID': "1234567890",
                'CANAME': "",
                'PASSWORD': "",
                'MAXBUY': 0,
                'BUYCOUNT': 0,
                'BUYAMOUNT': 0,
                'PERCENT': 0,
                'SPLITCOUNT': 0
            }];

            self.appendTB_account_body(tb, itemD2_count, 0);

        }



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



    ,appendTB_preOrder:function(){
        var self = this;

        var panel,list_head,list_body;
        panel = $('#preOrder_tabs_1');

        list_head = preOrder.list_benchmark_head;//preOrder_list;//self.list_benchmark_head;
        list_body = [];
        var list = null;
        list = this.preOrder_list;

        var btnName = "禁用";
        for(var elm = 0; elm < list.length; elm++){
            list_body[elm] = {};
            for(var  inner in  list[elm]){
                list_body[elm][inner] = {ELEMENT: list[elm][inner]};
            }

            // list_body[elm]['PGROUPID'] = {ELEMENT: self.find_item_policyGID(list[elm]['PGROUPID'])["NAME"]};
            // list_body[elm]['PNAME'] = {ELEMENT: list[elm]['PNAME']};
            // list_body[elm]['DIRTYPE'] = {ELEMENT: self.getDirtype(list[elm]['DIRTYPE'])};
            // list_body[elm]['STARTTIME'] = {ELEMENT: self.valideDate(list[elm]['STARTTIME'])};
            // list_body[elm]['ENDTIME'] = {ELEMENT: self.valideDate(list[elm]['ENDTIME'])};
            // list_body[elm]['STOCKSET'] = {ELEMENT: oojs$.valideString(list[elm]['STOCKSET'])};
            // list_body[elm]['PERCENT'] = {ELEMENT: list[elm]['PERCENT']};
            list_body[elm]['STOCKSET'] = {ELEMENT:String( oojs$.valideString(list[elm]['STOCKSET']) ) };
            list_body[elm]['DIRTYPE']= {ELEMENT: preload.getDirtype(list[elm]['DIRTYPE'])};
            list_body[elm]['ONETHIRD'] = {ELEMENT:"10 ¥"};
            list_body[elm]['STOCKID'] = {ELEMENT:"test"};//执行情况
            var div = $('<div></div>');
            $('<input></input>',{type:"button",value:"详情"}).appendTo(div).click(
                list_body[elm],
                preOrder.preOrder_btn_tail
            );

            $('<input></input>',{type:"button",value:"修改"}).appendTo(div).click(
                list_body[elm],
                preOrder.preOrder_btn_chg
            );

            btnName = "禁用";
            if(list_body[elm]['FLAG'] == 1){
                btnName='启动'
            }

            $('<input></input>',{type:"button",value:btnName}).appendTo(div).click(
                list[elm],
                preOrder.preOrder_btn_unsubscrible
            );

            list_body[elm]['CTRL'] = {ELEMENT:div};
        }
        oojs$.appendTB_list(panel,list_head,list_body);
    }

    ,load_preorder:function(){
        //select_preorder
        var self = this;
        var sendData = {};

        oojs$.httpPost_json("/select_preorder",sendData,function(result,textStatus,token){
            if(result.success){

                self.preOrder_list = [];
                self.preOrder_list = result.data;
                self.appendTB_preOrder();
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
            label_value = $('<label></label>').text(item[i]['ACCOUNTID'])
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

        oojs$.appendTB_item_D2x(tb,item_D2)
    }






        //------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    ,select_title:null

    // ,td_first: null
    ,tb: null
    //,subscribe_body: []

    ,account_body: []
    ,alreadySubscribe_body:[]
    ,tb_div1:null
    ,tb_div2:null
    ,acount_ctls:null


    ,console:function(){
        var logs = ["preOrder"];
        console.log(JSON.stringify(logs.concat(arguments)));
    }



    ,tab2PreOrderClick:function(){
        preOrder.load_userPolicyGID();
    }


    ,appendTB_add_control: function( tb, id, p_name ){
        var tr = $('<tr></tr>').appendTo(tb);
        var td =$('<td></td>',{ colspan:"2",align:"center",valign:"bottom"}).appendTo(tr);

        $('<input></input>',{'type':"button",id:id+"_order_btn",name:p_name,value:"提交"}).appendTo(td).click(
            this.handler_click
        );

        // $('<input></input>',{'type':"button",id:id+"_orderBack_btn",name:p_name,value:"取消"}).appendTo(td).click(
        //     this.handler_click
        // );

    }

    ,find_item_acount_ctls: function(TRADEID,ACCOUNTID){
        for( var i = 0; i < this.acount_ctls.length; i++ ){
            if(String(this.acount_ctls[i]["TRADEID"]) == String(TRADEID)
                && String(this.acount_ctls[i]["ACCOUNTID"]) == String(ACCOUNTID)){
                return this.acount_ctls[i];
            }
        }

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

    ,handler_dirtype: function(){
        var self = preOrder;
        self.order_select2.empty();
        self.order_select3.empty();
        self.order_select2.prop("disabled", false);
        self.order_select3.prop("disabled", true);
        self.order_select2.append(
            "<option  value='-1'>请选择策略类型</option>"
        );
        self.option_append(self.order_select2,self.select_title[this.value],function(pp){
            return policy.find_item_policyGID(pp)["NAME"];
        });

        self.order_select3.append(
            "<option value='-1'>请选择策略名称</option>"
        );



    }

    ,handler_group: function(){
        var self = preOrder;
        self.order_select3.empty();
        self.order_select3.prop("disabled", false);
        self.order_select3.append(
            "<option value='-1'>请选择策略名称</option>"
        );
        var tempArr = self.select_title[ self.order_select1.val()][self.order_select2.val()];


        for( var i = 0; i < tempArr.length; i++ ){
            self.order_select3.append(
                "<option value='"
                +tempArr[i]['USERID']+"_"+tempArr[i]['POLICYID']
                +"'>"+tempArr[i]["PNAME"]+"</option>"
            );
        }



    }

    ,handler_policy: function(){
        var self = preOrder;
        console.log(">>>>>>>>>>",
            self.order_select1.val(),
            self.order_select2.val(),
            this.value,$(this).find("option:selected").text() );

        var self = preOrder;
        var obj = $(this).find("option:selected");
        var name = obj.text();
        var key_value = obj.val().split("_");
        var USERID = key_value[0];
        var POLICYID = key_value[1];

        //------------------------
        var item = null;
        item = policy.search_policyList_Item(USERID,POLICYID,self.alreadySubscribe_body);
        self.appendTB_Rdiv_tb2(item);
    }







    ,handler_click:function(){
        console.log(this.id,this.type);
        if(this.type == "button"){

            if(this.value == "新增"){
                var addStock = $("#addNewStock_txt").val().trim();

                if(policy.STOCKSET.indexOf(addStock)<0 && policy.valideStock(addStock)){
                    if( !policy.STOCKSET || policy.STOCKSET!=""  ){
                        policy.STOCKSET = policy.STOCKSET+","+addStock;
                    }else{
                        policy.STOCKSET = addStock;
                    }
                    console.log("addNewStock_txt value:", policy.STOCKSET );
                    // policy.rander_stockTD1();
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

                policy.rander_stockTD1();

            }else if(this.value == "提交"){
                console.log(this.id,this.name);
                preOrder.submitOrder(this.id.split("_")[0],this.name);

            }
            // else if(this.value == "取消"){
            //     // policy.cancelChange(this.name);
            // }
        }
    }

    ,submitOrder: function(){
        var self = this;
        var USERID = arguments[0];
        var POLICYID = arguments[1];

        var item = null;
        item = policy.search_policyList_Item(USERID,POLICYID,self.alreadySubscribe_body);

        item['STARTTIME'] ={hh:$('#start_hh').val(),"mm":$('#start_mm').val(),"ss":$('#start_ss').val()};
        item['ENDTIME'] = {hh:$('#stop_hh').val(),"mm":$('#stop_mm').val(),"ss":$('#stop_ss').val()};
        item['STOCKSET'] = policy.STOCKSET;
        // item['PERCENT'] = $('#'+USERID+"_"+POLICYID).val();

        console.log("STOCKSET_USERID",USERID);
        console.log("STOCKSET_POLICYID",POLICYID);
        console.log("submitChange", JSON.stringify(item) );

        console.log(self.select_tradetype);

        var sendData = [];
        var tempArr = [];
        var tempItem = null;
        for(var i = 0; i < self.acount_ctls.length; i++ ){
            tempItem = {};
            for(elm in item){
                tempItem[elm] =  item[elm];
            }
            tempItem['ACCOUNTID'] = self.acount_ctls[i]['ACCOUNTID'];
            tempItem['TRADEID'] = self.acount_ctls[i]['TRADEID'];
            tempItem['BUYCOUNT'] = "";
            tempItem['BUYAMOUNT'] = "";
            tempItem['PERCENT'] = "";
            tempItem[self.acount_ctls[i]['select'].val()]=self.acount_ctls[i]['input'].val();
            sendData.push(tempItem);
            //console.log(self.acount_ctls[i]['TRADEID'],self.acount_ctls[i]['ACCOUNTID'],self.acount_ctls[i]['select'].val(),self.acount_ctls[i]['input'].val());
        }

        console.log("submitChange2", JSON.stringify(sendData) );

        oojs$.httpPost_json("/insert_preorder",sendData,function(result,textStatus,token){
            if(result.success){
                console.log( "success!" );
                // myself.cancelChange();
            }else{
                oojs$.showError(result.message);
                // console.log( JSON.stringify(result) );
                // alert(JSON.stringify(result.count));
                // self.submitOrder(USERID,POLICYID);

            }
        });

    }

    ,handler_ck:function(){
        // ,'name':dictTrade.dictTrade_list_body[i]['TRADEID']
        //     ,'value':dictTrade.dictTrade_list_body[i]['ACCOUNTID']
        var self = preOrder;
        preOrder.console("handler_ck","name:",this.name,"value:",this.value,"checked:",this.checked);
    // {TRADEID:['TRADEID'],ACCOUNTID: ['ACCOUNTID'],"select":select,'input':input});
        var item = self.find_item_acount_ctls(this.name,this.value);
        if(this.checked){
            item["select"].prop("disabled",false);
            item["input"].prop("disabled",false);
        }else{
            item["select"].val(-1);
            item["input"].val();
            item["select"].prop("disabled",true);
            item["input"].prop("disabled",true);
        }

    }



    ,load_userPolicyGID:function(){
        var self = this;

        oojs$.httpGet("/select_userPolicyGID",function(result,textStatus,token){

            if(result.success){
                preOrder.console("load_userPolicyGID",result.data);

                self.alreadySubscribe_body = null;
                self.alreadySubscribe_body = result.data;


                self.select_title = {};
                for(var i = 0; i < self.alreadySubscribe_body.length; i++ ){
                    self.parse2obj_DIRTYPE(self.select_title,self.alreadySubscribe_body[i]);
                }


                preOrder.console("load_userPolicyGID",JSON.stringify(self.select_title) );
                self.order_select1 = null;
                self.order_select2 = null;
                if(self.tb_div2){
                    self.tb_div2.empty();
                }
                self.appendTB_preOrder_slct();
            }else{
                oojs$.showError(result.message);
            }

        });

    }

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

});

var preOrder = new oojs$.com.stock.preOrder();
oojs$.addEventListener("ready",function(){
    preOrder.init();
});
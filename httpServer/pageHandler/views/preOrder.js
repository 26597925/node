oojs$.ns("com.stock.preOrder");
oojs$.com.stock.preOrder = oojs$.createClass(
{
   select_title:null
    ,order_select1:null
    ,order_select2:null
    ,order_select3:null
    ,td_first: null
    ,tb: null
    //,subscribe_body: []
    ,select_tradetype:[{id:"BUYCOUNT",name:"交易股数"},{id:"BUYAMOUNT",name:"交易金额"},{id:"PERCENT",name:"交易比例"}]//帐户用
    ,account_body: []
    ,alreadySubscribe_body:[]
    ,tb_div1:null
    ,tb_div2:null
    ,acount_ctls:null
    ,init:function(){
        $("#preOrder_tabs").tabs();
        $("#preOrder").click(this.nvgPreOrderClick);
        $("#preOrder_tabs_a1").click(this.nvgPreOrderClick);
        $("#preOrder_tabs_a2").click(this.tab2PreOrderClick);
        this.nvgPreOrderClick();
    }

    ,console:function(){
        var logs = ["preOrder"];
        console.log(JSON.stringify(logs.concat(arguments)));
    }

    ,nvgPreOrderClick:function(){

        preOrder.console('nvgPolicyClick');

        preOrder.load_userPolicyGID();

    }

    ,tab2PreOrderClick:function(){

    }



    ,appendTB_add_head: function( parentID, USERID, POLICYID ){
        var tb = $('<table></table>', {
            class:"display dataTable"
        });
        return tb;
    }

    ,appendTB_add_body: function( tb, item ){

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



    ,appendTB_preOrder_slct: function(){
        var self = this;
        self.console("appendTB_preOrder_slct");
        var container =$('#preOrder_tabs_1');
        if(self.tb_div1==null){
            self.tb_div1 = $('<div id="tb_div1"></div>');
            self.tb_div1.appendTo(container);
        }

        if(self.tb_div2==null){
            self.tb_div2 = $('<div id="tb_div2"></div>');
            self.tb_div2.appendTo(container);
        }

        if(self.order_select1 == null){
            self.tb_div1.empty();
            var tb = self.appendTB_add_head();
            self.tb_div1.append(tb);
            var tr = $('<tr></tr>',{class:"even"}).appendTo(tb);

            // self.td_first =$('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
            // self.td_first =$('<td></td>',{ class:"td"}).appendTo(tr);
            var td =$('<td></td>',{ class:"td"}).appendTo(tr);
            //1-----------------------------

            // self.td_first.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            // self.td_first.append($('<label></label>').text("交易类型:"));
            td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            td.append($('<label></label>').text("交易类型:"));

            td =$('<td></td>',{ class:"td"}).appendTo(tr);
            self.order_select1 = $('<select></select>',{
                id:'order_select1'
            });

            self.order_select1.append(
                "<option  value='-1'>请选择交易类型</option>"
            );

            self.option_append(self.order_select1, self.select_title, policy.getDirtype);

            self.order_select1.change(self.handler_dirtype);

            // self.td_first.append( self.order_select1 );
            td.append( self.order_select1 );
            //2----------------------------
            tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
            td =$('<td></td>',{ class:"td"}).appendTo(tr);
            // self.td_first.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            // self.td_first.append($('<label></label>').text("策略类型:"));
            td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            td.append($('<label></label>').text("策略类型:"));

            td =$('<td></td>',{ class:"td"}).appendTo(tr);
            self.order_select2 = $('<select></select>',{
                id:'order_select2'
            });

            self.order_select2.append(
                "<option  value='-1'>请选择策略类型</option>"
            );

            self.order_select2.prop("disabled", true);
            self.order_select2.change(self.handler_group);


            // self.td_first.append( self.order_select2 );
            td.append( self.order_select2 );
            //3----------------------------
            tr = $('<tr></tr>',{class:"even"}).appendTo(tb);
            td =$('<td></td>',{ class:"td"}).appendTo(tr);

            // self.td_first.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            // self.td_first.append($('<label></label>').text("策略名称:"));
            td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            td.append($('<label></label>').text("策略名称:"));

            td =$('<td></td>',{ class:"td"}).appendTo(tr);
            self.order_select3 = $('<select></select>',{
                id:'order_select3'
            });

            self.order_select3.append(
                "<option value='-1'>请选择策略名称</option>"
            );

            self.order_select3.change(self.handler_policy);
            self.order_select3.prop("disabled", true);

            // self.td_first.append( self.order_select3 );
            td.append( self.order_select3 );
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

        // console.log(">>>>>>>>>>",this.value,$(this).find("option:selected").text() );

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
        self.tb_div2.empty();
        self.acount_ctls = null;
        self.acount_ctls = [];
        self.tb = null;

        self.tb = self.appendTB_add_head();
        self.tb_div2.append(self.tb);

        var item = null;
        item = policy.search_policyList_Item(USERID,POLICYID,self.alreadySubscribe_body);

        var obj = {};
        for(var elm in item){
            if(!(String(elm) == "PERCENT" || String(elm) == "PGROUPID" || String(elm) == "DIRTYPE" ||String(elm) == "PNAME")){
                obj[elm] = item[elm];
            }
        }

        // obj["PGROUPID"] = policy.find_item_policyGID(obj["PGROUPID"])['NAME'];
        console.log("item:",item);
        policy.appendTB_add_body(self.tb,obj,USERID,POLICYID);

        self.appendTB_account_body(USERID,POLICYID);
        self.appendTB_add_control(self.tb, USERID, POLICYID);
    }



    ,appendTB_account_body:function(){
        var self = this;
        var checkbox = null;

        var tr = $('<tr></tr>',{class:"even"}).appendTo(self.tb);
        var td = $('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
        td.append($('<label></label>').text("请选择您帐户:"));
        var label = $('<label></label>',{

        }).text('(*注：只有选择了账户才能选择交易策略)');
        label.css({ 'color': 'red', 'font-size': '80%' });
        td.append(label);

        self.console("dictTrade_selectList",dictTrade.dictTrade_selectList);
        self.console("dictTrade_list_body",dictTrade.dictTrade_list_body);

        for(var i = 0; i < dictTrade.dictTrade_list_body.length; i++ ){
            var tr = $('<tr></tr>',{class:"even"}).appendTo(self.tb);
            if( i%2 == 0 ){
                var tr = $('<tr></tr>',{class:"odd"}).appendTo(self.tb);
            }

            td = $('<td></td>',{ class:"td"}).appendTo(tr);
            checkbox = $('<input></input>',{
                'type':'checkbox'
                // ,'id':dictTrade.dictTrade_list_body[i]+"_od_ck"
                ,'name':dictTrade.dictTrade_list_body[i]['TRADEID']
                ,'value':dictTrade.dictTrade_list_body[i]['ACCOUNTID']
            }).change(self.handler_ck);
            td.append(checkbox);

            td.append($('<label></label>').text('帐户：'));
            td =$('<td></td>',{ class:"td"}).appendTo(tr);
            td.append($('<label></label>').text(dictTrade.dictTrade_list_body[i]['ACCOUNTID']));
            td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            var select = self.append_select_tradetype();
            td.append( select );

            var input = $('<input></input>',{type:'text'});
            input.prop("disabled", true );
            td.append($("<span>&nbsp;&nbsp;</span>"));
            td.append(input);
            self.acount_ctls.push({TRADEID:dictTrade.dictTrade_list_body[i]['TRADEID'],
                ACCOUNTID:dictTrade.dictTrade_list_body[i]['ACCOUNTID'],
                "select":select,'input':input,'checkbox':checkbox});

        }


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
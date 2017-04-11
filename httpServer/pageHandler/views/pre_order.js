oojs$.ns("com.stock.preOrder");
oojs$.com.stock.preOrder = oojs$.createClass(
{
    policyGID:[]
    ,obj_select:null
    ,order_select1:null
    ,order_select2:null
    ,td_first: null
    ,tb: null
    //,subscribe_body: []
    ,select_tradetype:[{id:"BUYCOUNT",name:"买入多少股"},{id:"BUYAMOUNT",name:"买入金额"},{id:"PERCENT",name:"交易比例"}]
    ,account_body: []
    ,alreadySubscribe_body:[]
    ,tb_div1:null
    ,tb_div2:null
    ,acount_ctls:null
    ,init:function(){
        $("#pre_order").click(this.nvgPolicyClick);
        this.nvgPolicyClick();
    }

    ,console:function(){
        var logs = ["preOrder"];
        console.log(JSON.stringify(logs.concat(arguments)));
    }

    ,nvgPolicyClick:function(){
        // preOrder.console("nvgClick",this.caller);
        // var myName = arguments.callee.toString();
        // myName = myName.substr('function '.length);
        // myName = myName.substr(0, myName.indexOf('('));
        preOrder.console('nvgPolicyClick');
        preOrder.load_policyGID();
        // preOrder.append_orderForm($('#pre_order_container'));

    }

    ,appendTB_add_head: function( parentID, USERID, POLICYID ){
        var tb = $('<table></table>', {
            class:"display dataTable"
        });
        return tb;
    }

    ,appendTB_add_body: function( tb, item ){

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
    ,find_item_acount_ctls: function(TRADEID,ACCOUNTID){
        for( var i = 0; i < this.acount_ctls.length; i++ ){
            if(String(this.acount_ctls[i]["TRADEID"]) == String(TRADEID)
                && String(this.acount_ctls[i]["ACCOUNTID"]) == String(ACCOUNTID)){
                return this.acount_ctls[i];
            }
        }

    }

    ,find_item_policyGID: function(id){
        for( var i = 0; i < this.policyGID.length; i++ ){
            if(String(this.policyGID[i]["ID"]) == String(id)){
                return this.policyGID[i];
            }
        }
        oojs$.showError("databases no this field:"+id);
        return null;
    }

    ,find_item_alreadySubscribe: function(id){
        //alreadySubscribe_body

    }

    ,appendTB_preOrder_slct1: function(){

        var self = this;
        self.console("appendTB_preOrder_slct1");
        var container =$('#pre_order_container');

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
            var tr = $('<tr></tr>',{class:"odd"}).appendTo(tb);
            self.td_first =$('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);

            self.td_first.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            self.td_first.append($('<label></label>').text("策略类型:"));

            self.order_select1 = $('<select></select>',{
                id:'order_select1'
            });

            var item_policy = null;
            var options = [];
            for(var elm in self.obj_select){
                item_policy = self.find_item_policyGID(elm);
                if(item_policy){
                    console.log( "options.push.length:" );
                    options.push(item_policy);
                }
            }
            console.log("options.length:"+options.length);

            self.order_select1.append(
                "<option  value='-1'>请选择策略类型</option>"
            );

            for( var i = 0; i < options.length; i++ ){
                self.order_select1.append(
                    "<option value='"
                    +options[i]['ID']
                    +"'>"+options[i]['NAME']+"</option>"
                );
            }

            self.order_select1.change(function() {
                var name = $("#order_select1 option:selected").text();
                console.log("appendTB_preOrder_slct2",this.value,name);
                preOrder.appendTB_preOrder_slct2(this.value,name);
            });

            self.td_first.append( self.order_select1 );
        }

    }

    ,appendTB_preOrder_slct2: function(){
        var self = this;
        var value = arguments[0];
        var name = arguments[1];
        console.log("appendTB_preOrder_slct2",value,name);
        var options = [];
        options = self.obj_select[value];

        if(self.order_select2 == null){
            self.td_first.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            self.td_first.append($('<label></label>').text("策略名称:"));

            self.order_select2 = $('<select></select>',{
                id:'order_select2'
            });

            self.order_select2.append(
                "<option value='-1'>请选择策略名称</option>"
            );

            for( var i = 0; i < options.length; i++ ){
                self.order_select2.append(
                    "<option value='"
                    +options[i]['USERID']+"_"+options[i]['POLICYID']
                    +"'>"+options[i]['PNAME']+"</option>"
                );
            }

            self.order_select2.change(self.handler_select2);
            self.td_first.append( self.order_select2 );
        }else{
            self.order_select2.empty();

            self.order_select2.append(
                "<option value='-1'>请选择策略名称</option>"
            );

            for( var i = 0; i < options.length; i++ ){
                self.order_select2.append(
                    "<option value='"
                    +options[i]['USERID']+"_"+options[i]['POLICYID']
                    +"'>"+options[i]['PNAME']+"</option>"
                );
            }
        }
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

            var input = $('<input></input>',{type:'text',title:"ajlsd"});
            input.prop("disabled", true );
            td.append($("<span>&nbsp;&nbsp;</span>"));
            td.append(input);
            self.acount_ctls.push({TRADEID:dictTrade.dictTrade_list_body[i]['TRADEID'],ACCOUNTID:dictTrade.dictTrade_list_body[i]['ACCOUNTID'],"select":select,'input':input});

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
            item["select"].prop("disabled",true);
            item["input"].prop("disabled",true);
        }

    }

    ,handler_select2:function(){
        var self = preOrder;
        var obj = $("#order_select2 option:selected");
        var name = obj.text();
        var key_value = obj.val().split("_");
        var USERID = key_value[0];
        var POLICYID = key_value[1];
        self.console("id:",this.id,"value",obj.val(),"name:",name);

        self.tb_div2.empty();
        self.acount_ctls = null;
        self.acount_ctls = [];
        self.tb = null;
        self.tb = self.appendTB_add_head();
        self.tb_div2.append(self.tb);

        var item = null;
        item = policy.search_policyList_Item(USERID,POLICYID,self.alreadySubscribe_body);
        console.log("item:",item);
        var obj = {};
        for(var elm in item){
            if(String(elm) != "PERCENT"){
                obj[elm] = item[elm];
            }
        }

        obj["PGROUPID"] = self.find_item_policyGID(obj["PGROUPID"])['NAME'];
        console.log("item:",item);
        policy.appendTB_add_body(self.tb,obj,USERID,POLICYID);


        self.appendTB_account_body(USERID,POLICYID);

    }



    ,load_policyGID:function(){
        var myself = this;
        $.ajax({
            type:"get",
            url:"/select_policyGID",
            async:false,
            dataType:"json",
            success:function(result,textStatus){
                if(result.success){

                    myself.policyGID = [];
                    myself.policyGID = result.data;

                    preOrder.console("load_policyGID",myself.policyGID);

                    preOrder.load_userPolicyGID()
                }else{
                    oojs$.showError(result.message);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    }

    ,load_userPolicyGID:function(){
        var self = this;
        $.ajax({
            type:"get",
            url:"/select_userPolicyGID",
            async:false,
            dataType:"json",
            success:function(result,textStatus){
                if(result.success){

                    preOrder.console("load_userPolicyGID",result.data);

                    self.alreadySubscribe_body = null;
                    self.alreadySubscribe_body = result.data;


                    self.obj_select = {};
                    for(var i = 0; i < self.alreadySubscribe_body.length; i++ ){
                        if(self.obj_select.hasOwnProperty(self.alreadySubscribe_body[i]['PGROUPID']) ){
                            self.obj_select[self.alreadySubscribe_body[i]['PGROUPID']].push({
                                "POLICYID":self.alreadySubscribe_body[i]["POLICYID"]
                                ,"PNAME":self.alreadySubscribe_body[i]["PNAME"]+(self.alreadySubscribe_body[i]["USERID"]+""=="0"?"(系统定义)":"(自定义)")
                                ,"USERID":self.alreadySubscribe_body[i]["USERID"]
                            });
                        }else{
                            self.obj_select[self.alreadySubscribe_body[i]['PGROUPID']] = [];
                            self.obj_select[self.alreadySubscribe_body[i]['PGROUPID']].push({
                                "POLICYID":self.alreadySubscribe_body[i]["POLICYID"]
                                ,"PNAME":self.alreadySubscribe_body[i]["PNAME"]+(self.alreadySubscribe_body[i]["USERID"]+""=="0"?"(系统定义)":"(自定义)")
                                ,"USERID":self.alreadySubscribe_body[i]["USERID"]
                            });

                        }
                    }
                    preOrder.console("load_userPolicyGID",JSON.stringify(self.obj_select) );
                    self.order_select1 = null;
                    self.order_select2 = null;
                    if(self.tb_div2){
                        self.tb_div2.empty();
                    }
                    self.appendTB_preOrder_slct1();
                }else{
                    oojs$.showError(result.message);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    }

    ,load_preorder:function(){
        var myself = this;
        $.ajax({
            type:"post",
            url:"/select_preorder",
            async:false,
            dataType:"json",
            success:function(result,textStatus){
                if(result.success){
                    console.log("load_AlreadySubscribe",result.data);
                    myself.subscribe_body = [];
                    myself.account_body = [];
                    //myself.account_body
                    preOrder.console("message",result.message);
                    //myself.appendTB_alreadySubscribe()
                }else{
                    console.log("message",result.message);
                }
            },
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            }
        });
    }
});

var preOrder = new oojs$.com.stock.preOrder();
oojs$.addEventListener("ready",function(){
    preOrder.init();
});
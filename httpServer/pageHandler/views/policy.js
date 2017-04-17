oojs$.ns("com.stock.policy");
oojs$.com.stock.policy = oojs$.createClass(
{

    policyGID:[]
    ,policy_unsubscribe: []
    ,policy_subscribe: []
    ,item_Subscribe:null
    ,item_Unsubscribe:null
    ,item_stockset1:''
    ,item_stockset2:''
    ,list_benchmark_head: [
        {
            ID:"PGROUPID",
            NAME:"策略类型"
        }
        ,{
            ID:"PNAME",
            NAME:"策略名称"
        }
        ,{
            ID:"DIRTYPE",
            NAME:"交易类型"
        }
        ,{
            ID:"STARTTIME",
            NAME:"开始时间"
        }
        ,{
            ID:"ENDTIME",
            NAME:"结束时间"
        }
        ,{
            ID:"STOCKSET",
            NAME:"自选股"
        }
        ,{
            ID:"PERCENT",
            NAME:"交易比例"
        }
        // ,{
        //     ID:"",
        //     NAME:""
        // }
        ,{
            ID:"CTRL",
            NAME:"操作"
        }
    ]
    ,getDirtype:function(){
        switch (parseInt(arguments[0])){
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
            case 9:
                return "撤单";
        }
    }
    ,valideDate:function(){
        var obj = arguments[0];
        return obj["hh"]+":"+obj["mm"]+":"+obj["ss"];
    }
    ,valideStock:function(){
        if(arguments[0].match(/^[a-zA-Z0-9]{6}$/)){
            return true;
        }else{
            return false;
        }
    }
    ,find_item_policyGID: function(id){
        for( var i = 0; i < this.policyGID.length; i++ ){
            if(String(this.policyGID[i]["ID"]) == String(id)){
                return this.policyGID[i];
            }
        }
        oojs$.showError("order databases no this field:"+id);
        return null;
    }
    ,search_policyList_Item:function(USERID,POLICYID,list){

        for(var i = 0; i < list.length; i++){
            if( String(list[i]['USERID'])==String(USERID) &&  String(list[i]['POLICYID'])== String(POLICYID)){
                return list[i];
            }
        }

        return null;
    }
    ,init:function(){
        $( "#policy_tabs" ).tabs();
        $("#policy").click(this.nvgPolicyClick);
        $("#policy_tabs_a1").click(this.nvgPolicyClick);
        $("#policy_tabs_a2").click(this.tab2PolicyClick);
        this.load_policyGID();
    }
    ,nvgPolicyClick:function(){
        policy.load_unsubscribe();
    }
    ,tab2PolicyClick:function(){
        policy.load_subscribe();
    }
    ,load_unsubscribe:function(){
        var self = this;

        oojs$.httpGet("/select_subscrible",function(result,textStatus,token){
            if(result.success){

                self.policy_unsubscribe = [];
                self.policy_unsubscribe = result.data;
                self.appendTB_subscribe(1);
            }else{
                oojs$.showError(result.message);
            }
        });
    }
    ,appendTB_subscribe:function(type){
        var self = this;
        var panel,list_head,list_body;
        if(type == 1){
            panel = $('#policy_tabs_1');
        }else if(type ==2){
            panel = $('#policy_tabs_2');
        }

        list_head = self.list_benchmark_head;
        list_body = [];
        var list = null;
        if(type == 1){
            list = this.policy_unsubscribe;
        }else if(type ==2){
            list = this.policy_subscribe;
        }

        for(var elm = 0; elm < list.length; elm++){
            list_body[elm] = {};
            for(var  inner in  list[elm]){
                list_body[elm][inner] = {ELEMENT: list[elm][inner]};
            }

            list_body[elm]['PGROUPID'] = {ELEMENT: self.find_item_policyGID(list[elm]['PGROUPID'])["NAME"]};
            list_body[elm]['PNAME'] = {ELEMENT: list[elm]['PNAME']};
            list_body[elm]['DIRTYPE'] = {ELEMENT: self.getDirtype(list[elm]['DIRTYPE'])};
            list_body[elm]['STARTTIME'] = {ELEMENT: self.valideDate(list[elm]['STARTTIME'])};
            list_body[elm]['ENDTIME'] = {ELEMENT: self.valideDate(list[elm]['ENDTIME'])};
            list_body[elm]['STOCKSET'] = {ELEMENT: oojs$.valideString(list[elm]['STOCKSET'])};
            list_body[elm]['PERCENT'] = {ELEMENT: list[elm]['PERCENT']};
            list[elm]['type'] = list_body[elm]['type'] = type;
            var div = $('<div></div>');

            $('<input></input>',{type:"button",value:"策略修改"}).appendTo(div).click(
                list[elm],
                policy.policy_btn_chg

            );
            if(type == 1){
                $('<input></input>',{type:"button",value:"订阅"}).appendTo(div).click(
                    list[elm],
                    policy.policy_btn_subscrible
                );
            }else if(type ==2){
                $('<input></input>',{type:"button",value:"取消订阅"}).appendTo(div).click(
                    list[elm],
                    policy.policy_btn_unsubscrible
                );
            }

            list_body[elm]['CTRL'] = {ELEMENT:div};
        }

        oojs$.appendTB_list(panel,list_head,list_body);
    }



    ,appendCK_stockset:function(div1,div2,data,token){
        if(data == "null"){
            data = "";
        }
        data = String(data).trim();
        div1.empty();
        div2.empty();
        console.log("stockset data",data);
        if(token == 1){
            policy.item_stockset1 = data;
        }else if(token == 2){
            policy.item_stockset2 = data;
        }

        var div_ck = $('<div></div>');
        div1.append(div_ck);

        policy.rangeChk(div_ck,token);

        $('<input></input>',{type:"button",value:"删除"}).appendTo(div1).click(
            {"div1":div1,"div2":div2,"div_ck":div_ck,data:data,token:token},
            policy.delCKBtnFun
        );

        var input = $('<input></input>',{}).text("");
        div2.append(input);

        $('<input></input>',{type:"button",id:"stock_changeAdd_btn",name:"",value:"新增"}).appendTo(div2).click(
            {"div1":div1,"div2":div2,"div_ck":div_ck,"input":input,'data':data,token:token},
            policy.addCKBtnFun
        );
    }

    ,policy_btn_chg: function(event){
        var item = event.data;
        policy.appendTB_changeSubscribe(item);
    }
    ,policy_btn_subscrible: function(event){
        var item = event.data;
        item['SUBSCRBLE']=1;
        policy.update_subscrible(item,item['type']);
    }
    ,policy_btn_unsubscrible: function(event){
        var item = event.data;
        item['SUBSCRBLE']=0;
        policy.update_subscrible(item,item['type']);

    }
    ,delCKBtnFun: function(event){
        var kids1 = event.data['div_ck'].find( "input" );
        var token = event.data['token'];
        var data = "";
        var isselect = false;
        for(var i =0; i < kids1.length; i++){
            if(!$(kids1[i]).is(':checked')){
                isselect = true;
                data += $(kids1[i]).val()+",";
            }
        }
        if(isselect){
            data = data.substr(0,data.length-1);
        }
        if(token == 1){
            policy.item_stockset1 = data;
        }else if(token == 2){
            policy.item_stockset2 = data;
        }

        policy.rangeChk(event.data['div_ck'],token);
    }

    ,addCKBtnFun: function(event){
        var inputval = event.data['input'].val();
        var token = event.data['token'];
        event.data['input'].val('');
        inputval = inputval.trim();
        if(inputval.length < 3){
            oojs$.showError("输入的数据有误");
            return;
        }
        var data ;
        if(token == 1){
            data = policy.item_stockset1;
        }else if(token == 2){
            data = policy.item_stockset2;
        }

        data = String(data).trim();
        if( inputval.length > 1){
            if(data.length>1){
                data += ","+inputval
            }else{
                data +=  inputval
            }
        }

        if(token == 1){
            policy.item_stockset1 = data;
        }else if(token == 2){
            policy.item_stockset2 = data;
        }

        policy.rangeChk(event.data['div_ck'],token);

    }
    ,rangeChk: function(div_ck,token){
        div_ck.empty();
        var label = null;
        var checkbox = null;
        var data = '';
        if(token == 1){
            data = policy.item_stockset1;
        }else if(token == 2){
            data = policy.item_stockset2;
        }

        if(data.indexOf(",") == 0){
            data = data.substr(1);
        }

        if(data[data.length-1]==","){
            data = data.substr(0,data.length-1);
        }


        if( data.length > 0 ){
            var datas = data.split(",");

            if(datas.length == 1 &&  datas[0] == ""){
                //null
            }else{
                for(var i = 0; i < datas.length; i++){
                    checkbox = $('<input></input>',{
                        'style':'width:10px',
                        'type':'checkbox',
                        'value':datas[i]
                    }).appendTo(div_ck);

                    $('<label></label>').appendTo(div_ck).text(datas[i]);
                    div_ck.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
                }
            }
        }
    }

    ,drawIterm :function(item){
        var list_head = self.list_benchmark_head;

        var STARTTIME = $('<div></div>');
        oojs$.generateHMDOption(STARTTIME);
        var kids = STARTTIME.find( "select" );
        var hh = parseInt(item["STARTTIME"]["hh"]);
        var mm = parseInt(item["STARTTIME"]["mm"]);
        var ss = parseInt(item["STARTTIME"]["ss"]);
        $(kids[0]).val(hh<=9?"0"+hh:hh);
        $(kids[1]).val(mm<=9?"0"+mm:mm);
        $(kids[2]).val(ss<=9?"0"+ss:ss);

        var ENDTIME = $('<div></div>');
        oojs$.generateHMDOption(ENDTIME);
        var kids = ENDTIME.find( "select" );
        var hh = parseInt(item["ENDTIME"]["hh"]);
        var mm = parseInt(item["ENDTIME"]["mm"]);
        var ss = parseInt(item["ENDTIME"]["ss"]);
        $(kids[0]).val(hh<=9?"0"+hh:hh);
        $(kids[1]).val(mm<=9?"0"+mm:mm);
        $(kids[2]).val(ss<=9?"0"+ss:ss);

        var STOCKSET = {ELEMENT1:$('<div></div>'),ELEMENT2:$('<div></div>'),ROWSPAN:2};
        self.appendCK_stockset(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            item["STOCKSET"],
            type);

        var CTRL = $('<div></div>');
        for(var elm in self.item_Unsubscribe){
            self.item_Unsubscribe[elm] = null;
            delete self.item_Unsubscribe[elm];
        }
        self.item_Unsubscribe = null;
        self.item_Unsubscribe = {};

        for(var elm in item){
            self.item_Unsubscribe[elm] = {ELEMENT:item[elm]};
        }

        self.item_Unsubscribe["PGROUPID"] ={ELEMENT:self.find_item_policyGID(item["PGROUPID"])['NAME'],element:item["PGROUPID"]};
        self.item_Unsubscribe["DIRTYPE"] ={ELEMENT:self.getDirtype(item["DIRTYPE"]),element:item["DIRTYPE"]};

        self.item_Unsubscribe["STARTTIME"] ={ELEMENT:STARTTIME};
        self.item_Unsubscribe["ENDTIME"] = {ELEMENT:ENDTIME};
        self.item_Unsubscribe["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};
        self.item_Unsubscribe["PERCENT"] = {ELEMENT:$('<input type="text" value="'+item["PERCENT"]+'" ></input><label style="color: red; font-size: 80%;">(*注：比例范围0-1，最多保留小数点后两位)</label>')}
        self.item_Unsubscribe["CTRL"] = {ELEMENT:CTRL,COLSPAN:2};
        self.item_Unsubscribe['type'] = 1;

        $('<input></input>',{'type':"button",name:type,value:"提交"}).appendTo(CTRL).click(
            self.item_Unsubscribe,
            self.policy_item_update
        );


        $('<input></input>',{'type':"button",name:type,value:"取消"}).appendTo(CTRL).click(
            self.item_Unsubscribe,
            self.policy_item_reback
        );
        oojs$.appendTB_item_D2(tb,list_head,self.item_Unsubscribe);
    }
    ,appendTB_changeSubscribe: function(){
        var self = this;

        var item = arguments[0];
        var type = item['type'];
        console.log("item:",item);

        var tb = $('<table></table>', {
            class:"display dataTable"
        });

        if(type == 1){
            $('#policy_tabs_1').empty();
            tb.appendTo($('#policy_tabs_1'));
        }else if(type==2){
            $('#policy_tabs_2').empty();
            tb.appendTo($('#policy_tabs_2'));
        }

        var list_head = self.list_benchmark_head;

        var STARTTIME = $('<div></div>');
        oojs$.generateHMDOption(STARTTIME);
        var kids = STARTTIME.find( "select" );
        var hh = parseInt(item["STARTTIME"]["hh"]);
        var mm = parseInt(item["STARTTIME"]["mm"]);
        var ss = parseInt(item["STARTTIME"]["ss"]);
        $(kids[0]).val(hh<=9?"0"+hh:hh);
        $(kids[1]).val(mm<=9?"0"+mm:mm);
        $(kids[2]).val(ss<=9?"0"+ss:ss);

        var ENDTIME = $('<div></div>');
        oojs$.generateHMDOption(ENDTIME);
        var kids = ENDTIME.find( "select" );
        var hh = parseInt(item["ENDTIME"]["hh"]);
        var mm = parseInt(item["ENDTIME"]["mm"]);
        var ss = parseInt(item["ENDTIME"]["ss"]);
        $(kids[0]).val(hh<=9?"0"+hh:hh);
        $(kids[1]).val(mm<=9?"0"+mm:mm);
        $(kids[2]).val(ss<=9?"0"+ss:ss);

        var STOCKSET = {ELEMENT1:$('<div></div>'),ELEMENT2:$('<div></div>'),ROWSPAN:2};

        self.appendCK_stockset(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            item["STOCKSET"],
            type);

        var CTRL = $('<div></div>');


        if(type == 1){
            for(var elm in self.item_Unsubscribe){
                self.item_Unsubscribe[elm] = null;
                delete self.item_Unsubscribe[elm];
            }
            self.item_Unsubscribe = null;
            self.item_Unsubscribe = {};
            for(var elm in item){
                self.item_Unsubscribe[elm] = {ELEMENT:item[elm]};
            }

            self.item_Unsubscribe["PGROUPID"] ={ELEMENT:self.find_item_policyGID(item["PGROUPID"])['NAME'],element:item["PGROUPID"]};
            self.item_Unsubscribe["DIRTYPE"] ={ELEMENT:self.getDirtype(item["DIRTYPE"]),element:item["DIRTYPE"]};

            self.item_Unsubscribe["STARTTIME"] ={ELEMENT:STARTTIME};
            self.item_Unsubscribe["ENDTIME"] = {ELEMENT:ENDTIME};
            self.item_Unsubscribe["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};
            self.item_Unsubscribe["PERCENT"] = {ELEMENT:$('<input type="text" value="'+item["PERCENT"]+'" ></input><label style="color: red; font-size: 80%;">(*注：比例范围0-1，最多保留小数点后两位)</label>')}
            self.item_Unsubscribe["CTRL"] = {ELEMENT:CTRL,COLSPAN:2};
            self.item_Unsubscribe['type'] = 1;

            $('<input></input>',{'type':"button",name:type,value:"提交"}).appendTo(CTRL).click(
                self.item_Unsubscribe,
                self.policy_item_update
            );


            $('<input></input>',{'type':"button",name:type,value:"取消"}).appendTo(CTRL).click(
                self.item_Unsubscribe,
                self.policy_item_reback
            );
            oojs$.appendTB_item_D2(tb,list_head,self.item_Unsubscribe);
        }else if(type==2){
            for(var elm in self.item_Subscribe){
                self.item_Subscribe[elm] = null;
                delete self.item_Subscribe[elm];
            }
            self.item_Subscribe = null;
            self.item_Subscribe = {};
            for(var elm in item){
                self.item_Subscribe[elm] =   {ELEMENT:item[elm]};;
            }

            self.item_Subscribe["PGROUPID"] ={ELEMENT:self.find_item_policyGID(item["PGROUPID"])['NAME'],element:item["PGROUPID"]};
            self.item_Subscribe["DIRTYPE"] ={ELEMENT:self.getDirtype(item["DIRTYPE"]),element:item["DIRTYPE"]};

            self.item_Subscribe["STARTTIME"] ={ELEMENT:STARTTIME};
            self.item_Subscribe["ENDTIME"] = {ELEMENT:ENDTIME};
            self.item_Subscribe["STOCKSET"] = STOCKSET;// {ELEMENT:STOCKSET};
            self.item_Subscribe["PERCENT"] = {ELEMENT:$('<input type="text" value="'+item["PERCENT"]+'" ></input><label style="color: red; font-size: 80%;">(*注：比例范围0-1，最多保留小数点后两位)</label>')}
            self.item_Subscribe["CTRL"] = {ELEMENT:CTRL,COLSPAN:2};
            self.item_Subscribe['type'] = 2;

            $('<input></input>',{'type':"button",name:type,value:"提交"}).appendTo(CTRL).click(
                self.item_Subscribe,
                self.policy_item_update
            );


            $('<input></input>',{'type':"button",name:type,value:"取消"}).appendTo(CTRL).click(
                self.item_Subscribe,
                self.policy_item_reback
            );

            oojs$.appendTB_item_D2(tb,list_head,self.item_Subscribe);
        }


    }




    ,load_policyGID:function(){
        var  self = this;

        oojs$.httpGet("/select_policyGID",function(result,textStatus,token){

            if(result.success){
                self.policyGID = [];
                self.policyGID = result.data;
            }else{
                oojs$.showError(result.message);
            }

        });

    }

    ,load_subscribe:function(){
        var self = this;

        oojs$.httpGet("/select_alreadySubscrible",function(result,textStatus,token){
            if(result.success){
                console.log("load_subscribe",result.data);
                self.policy_subscribe = [];
                self.policy_subscribe = result.data;
                self.appendTB_subscribe(2)
            }else{
                oojs$.showError(result.message);
            }
        });

    }
    ,policy_item_reback:function(event){
        if(event.data.type == 1){
            policy.load_unsubscribe();
        }else if(event.data.type == 2){
            policy.load_subscribe();
        }
    }

    ,policy_item_update:function(event){
        var sendData = {};
        var kids = event.data['STARTTIME']['ELEMENT'].find( "select" );
        var STARTTIME = {hh:$(kids[0]).val(),"mm":$(kids[1]).val(),"ss":$(kids[2]).val()};

        kids = event.data['ENDTIME']['ELEMENT'].find( "select" );
        var ENDTIME ={hh:$(kids[0]).val(),"mm":$(kids[1]).val(),"ss":$(kids[2]).val()};

        var PERCENT = event.data['PERCENT']['ELEMENT'].val();
        var DIRTYPE = event.data['DIRTYPE']['element'];
        var PGROUPID = event.data['PGROUPID']['element'];
        var token = event.data['type'];
        for(var elm in event.data){
            if(
                elm =="STARTTIME"
                || elm == "ENDTIME"
                || elm == "STOCKSET"
                || elm == "PERCENT"
                || elm == "CTRL"
                || elm == "guid"
                || elm == "MODTIME"
                || elm == "PGROUPID"
                || elm == "DIRTYPE"
                // || elm == "ENDTIME"

            ){
                switch(elm){
                    case "STARTTIME":
                        sendData[elm] = STARTTIME;
                        break;
                    case "ENDTIME":
                        sendData[elm] = ENDTIME;
                        break;
                    case "STOCKSET":
                        if(token == 1){
                            sendData[elm] = policy.item_stockset1;
                        }else if(token == 2){
                            sendData[elm] = policy.item_stockset2;
                        }

                        break;

                    case "PERCENT":
                        sendData[elm] = PERCENT;
                        break;
                    case "PGROUPID":
                        sendData[elm] = PGROUPID;
                        break;
                    case "DIRTYPE":
                        sendData[elm] = DIRTYPE;
                        break;
                    default:
                        break;
                }
            }else{
                if(event.data[elm].hasOwnProperty('ELEMENT')){
                    sendData[elm] = event.data[elm]['ELEMENT'];
                }else{
                    sendData[elm] = event.data[elm];
                }
                
            }

        }
        console.log("update_subscrible",JSON.stringify(sendData));
        policy.update_subscrible(sendData, sendData['type']);

    }

    ,update_subscrible:function(sendData, type){

        oojs$.httpPost_json("/update_subscrible",sendData,function(result,textStatus,token){
            if(result.success){
                console.log( "subscrible success!",type );
                if( type == 1){
                    policy.load_unsubscribe();
                }else if( type == 2){
                    policy.load_subscribe();
                }
            }else{
                oojs$.showError(result.message);
            }
        });
    }
});

var policy = new oojs$.com.stock.policy();
oojs$.addEventListener("ready",function(){
	policy.init();
});



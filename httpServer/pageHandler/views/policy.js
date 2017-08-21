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
    ,is_load_subscribe:false
    ,list_benchmark_head: [
        {
            ID:"PGROUPID",
            NAME:"策略类型:"
        }
        ,{
            ID:"PNAME",
            NAME:"策略名称:"
        }
        ,{
            ID:"DIRTYPE",
            NAME:"交易类型:"
        }
        ,{
            ID:"POLICYPARAM",
            NAME:"参数信息:"//use for POLICYPARAM when add new order
        }
        ,{
            ID:"STARTTIME",
            NAME:"开始时间:"
        }
        ,{
            ID:"ENDTIME",
            NAME:"结束时间:"
        }
        ,{
            ID:"STOCKSET",
            NAME:"自选股:"
        }
        ,{
            ID:"PERCENT",
            NAME:"交易比例:"
        }
        // ,{
        //     ID:"",
        //     NAME:""
        // }
        ,{
            ID:"CTRL",
            NAME:"操作:"
        }
    ]
    ,valideDate:function(){
        var obj = arguments[0];
        return obj["hh"]+":"+obj["mm"]+":"+obj["ss"];
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
        $("#policy").click(this.policy_tab1_click);
        $("#policy_tabs_a1").click(this.policy_tab1_click);
        $("#policy_tabs_a2").click(this.policy_tab2_click);
        if(oojs$.getPanelID() == 1){
            policy.policy_tab1_click();
        }
    }
    ,policy_tab1_click:function(){
        policy.load_unsubscribe(function () {
            policy.appendTB_subscribe(1);
        });
    }
    ,policy_tab2_click:function(){
        policy.load_subscribe(function () {
            policy.appendTB_subscribe(2);
        });
        preload.getStock();
    }
    ,load_unsubscribe:function(callback){
        var self = this;

        oojs$.httpGet("/select_subscrible",function(result,textStatus,token){
            if(result && result.success){

                self.policy_unsubscribe = [];
                self.policy_unsubscribe = result.data;
                if(callback){
                    callback();
                }

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

        list_head = [];
        for(var idx = 0; idx<self.list_benchmark_head.length; idx++){
            if(self.list_benchmark_head[idx]["ID"]!="POLICYPARAM"){
                list_head.push(self.list_benchmark_head[idx])
            }
        }

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

            list_body[elm]['PGROUPID'] = {'ELEMENT': preload.getPGroupItem(list[elm]['PGROUPID'])["NAME"]};
            list_body[elm]['PNAME'] = {'ELEMENT': list[elm]['PNAME']};
            list_body[elm]['DIRTYPE'] = {'ELEMENT': preload.getDirtype(list[elm]['DIRTYPE'])};

            // list_body[elm]['POLICYPARAM'] = {'ELEMENT': list[elm]['POLICYPARAM']['title']};
            list_body[elm]['STARTTIME'] = {'ELEMENT': self.valideDate(list[elm]['STARTTIME'])};
            list_body[elm]['ENDTIME'] = {'ELEMENT': self.valideDate(list[elm]['ENDTIME'])};
            list_body[elm]['STOCKSET'] = {'ELEMENT': oojs$.valideString(list[elm]['STOCKSET'])};
            list_body[elm]['PERCENT'] = {'ELEMENT': list[elm]['PERCENT']};
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
        if(data.indexOf(inputval)>=0){
            oojs$.showError(inputval+"已经存在");
            return;
        }
        if( inputval.length > 1){

            if(data.length>1){
                data += ","+inputval
            }else{
                data +=  inputval
            }
        }else{
            oojs$.showError("数据有误请核查");
            return;
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

    ,get_preOrder_head: function()
    {
        var self = this;
        var list_head = [];
        for(var i = 0; i < self.list_benchmark_head.length; i++){
            list_head[i] = {};

            if( //self.list_benchmark_head[i]['ID']   == "DIRTYPE"
                //|| self.list_benchmark_head[i]['ID']   == "PGROUPID"
                //|| self.list_benchmark_head[i]['ID']   == "PNAME"
                //|| 
                self.list_benchmark_head[i]['ID']   == "CTRL"
                || self.list_benchmark_head[i]['ID']   == "PERCENT"
            ){
                continue;
            }
            list_head[i]['ID'] = self.list_benchmark_head[i]["ID"];
            list_head[i]['NAME'] = self.list_benchmark_head[i]["NAME"];

        }
        return list_head;
    }

    ,drawItem: function(tb, item){
        var self = this;

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
        

        var CTRL = $('<div></div>');

        var drawitem_data = null;
        drawitem_data = {};

        for(var elm in item){
            drawitem_data[elm] = {'ELEMENT':item[elm]};
        }

        drawitem_data["PGROUPID"] ={'ELEMENT':preload.getPGroupItem(item["PGROUPID"])['NAME'],element:item["PGROUPID"]};
        drawitem_data["DIRTYPE"] ={'ELEMENT':preload.getDirtype(item["DIRTYPE"]),element:item["DIRTYPE"]};
        
        var jsonView = new oojs$.com.stock.JsonView();
        var divs = jsonView.init( item["POLICYPARAM"] );
        var JSONVIEW = {};
        for(var idx = 0; idx<divs.length; idx++){
            JSONVIEW["ELEMENT"+(idx+1)] = divs[idx];
        }
        JSONVIEW["COMPONENT"] = jsonView;
        JSONVIEW["ROWSPAN"] = divs.length;
        drawitem_data["POLICYPARAM"] = JSONVIEW;//{'ELEMENT':select,element:item["POLICYPARAM"]};
        
        drawitem_data["STARTTIME"] ={'ELEMENT':STARTTIME};
        drawitem_data["ENDTIME"] = {'ELEMENT':ENDTIME};
        drawitem_data["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};
        drawitem_data["PERCENT"] = {'ELEMENT':$('<input type="text" value="'+item["PERCENT"]+'" ></input><label style="color: red; font-size: 80%;">(*注：比例范围0-1，最多保留小数点后两位)</label>')}
        drawitem_data["CTRL"] = {'ELEMENT':CTRL,COLSPAN:2};

        $('<input></input>',{'type':"button",value:"提交"}).appendTo(CTRL).click(
            drawitem_data,
            self.policy_item_update
        );

        $('<input></input>',{'type':"button",value:"取消"}).appendTo(CTRL).click(
            drawitem_data,
            self.policy_item_reback
        );

        oojs$.appendTB_item_D2(tb,list_head,drawitem_data);
    }

    ,appendTB_changeSubscribe: function(){
        var self = this;

        var item = arguments[0];
        var type = item['type'];
        console.log("item:",JSON.stringify(item));

        var tb = $('<table></table>', {
            'class':"display dataTable"
        });

        if(type == 1){
            $('#policy_tabs_1').empty();
            tb.appendTo($('#policy_tabs_1'));
            // item['type'] = 1;
        }else if(type==2){
            $('#policy_tabs_2').empty();
            tb.appendTo($('#policy_tabs_2'));
            // item['type'] = 2;
        }
        policy.drawItem(tb,item);

    }

    ,load_subscribe:function(callback){
        var self = this;

        oojs$.httpGet("/select_alreadySubscrible",function(result,textStatus,token){
            if(result && result.success){
                self.is_load_subscribe = true;
                console.log("load_subscribe",JSON.stringify(result.data));
                self.policy_subscribe = [];
                self.policy_subscribe = result.data;
                if(callback){
                    callback();
                }
            }else{
                oojs$.showError(result.message);
            }
        });

    }
    ,policy_item_reback:function(event){
        if(event.data.type == 1 || event.data.type.ELEMENT == 1){
            policy.policy_tab1_click();
        }else if(event.data.type == 2 || event.data.type.ELEMENT == 2){
            policy.policy_tab2_click();
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
        console.log("COMPONENT",event.data['POLICYPARAM']['COMPONENT']);
        var POLICYPARAM =  event.data['POLICYPARAM']['COMPONENT'].val();
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
                || elm == "POLICYPARAM"

            ){
                switch(elm){
                    case "POLICYPARAM":
                        sendData[elm] = POLICYPARAM;
                        break;
                    case "STARTTIME":
                        sendData[elm] = STARTTIME;
                        break;
                    case "ENDTIME":
                        sendData[elm] = ENDTIME;
                        break;
                    case "STOCKSET":
                        sendData[elm] = event.data["STOCKSET"]["COMPONENT"].val();
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
        
        if(!regular.checkFloat(PERCENT)){
            oojs$.showError("交易比例非法");
            return;
        }
        // if(sendData["STOCKSET"] == "" || sendData["STOCKSET"].length<5){
        //     oojs$.showError("请输入自选股");
        //     return;
        // }
        console.log("update_subscrible",JSON.stringify(sendData));
        policy.update_subscrible(sendData, sendData['type']);
    }

    ,update_subscrible:function(sendData, type){

        oojs$.httpPost_json("/update_subscrible",sendData,function(result,textStatus,token){
            if(result
                    &&result.hasOwnProperty('success')
                    &&result.success){
                console.log( "subscrible success!",type );
                if( type == 1){
                    policy.policy_tab1_click();
                }else if( type == 2){
                    policy.policy_tab2_click();
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

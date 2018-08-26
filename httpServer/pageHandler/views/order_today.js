// dir//买入卖出标志:0买入|1卖出|9撤单
oojs$.ns("com.stock.order");
oojs$.com.stock.order = oojs$.createClass(
{
	list_benchmark_head: [
        // {
        //     ID:'ACCOUNTID',
        //     NAME:"帐户"
        // }
        // ,
        {
            ID:'ORDERID',
            NAME:"订单"
        }
        ,
        {
            ID:'LABLE',
            NAME:"自定义标签"
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
        // ,{
        //     'ID':"ONETHIRD",
        //     'NAME':"金额／数量" //三选一
        // }
        
        // ,{
        //     'ID':"STATUS",
        //     'NAME':"状态"
        // }

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
        /*
        ,{
            'ID':'FROMID',
            'NAME':"来源"
        }
        */
        ,{
            'ID':"CTRL",
            'NAME':"操作"
        }
    ]
    //聚合条件，以orderid为键值，下列策略及相近的数据聚合
    ,merge_if:[
	    'ORDERID',
	    'USERID',
	    'PNAME',
	    'PGROUPID',
	    'POLICYID',
	    'POLICYPARAM',
	    'DIRTYPE',
	    'STARTTIME',
	    'ENDTIME',
	    'ADDTIME',
	    'MODTIME',
	    'STOCKSET',
	    'FLAG_USER',
	    'VISIBLE',
        'LABLE'
	    //,
	    //'STATUS',
	    //'FLAG',
	    //'SUBSCRBLE',
	    //'PERCENT',
	    //'PRICES'
        //FROMID
    ]
    //一键卖出,撤单条件，请求爬虫数据
    ,ontime_cdtion: {
            'DIRTYPE':[
            '0',//买入
            '1',//卖出
            '9'//撤单
        ],
        'PGROUPID':['5'],//实时
        'POLICYID':[
            '1003',//一键卖出
            '1004',//一键撤单
            '1005'//一键买入
        ]
    }
    ,order_ontime:{
        order_cancel:false,
        order_send:false
    }
    ,instance:null
    ,order_list: []
    ,nvg:null				//左侧导航
    ,panel:null				//总面板
    ,tabs1:null				//1st标签
    ,tabs2:null				//2cdbiaoqian
    ,panel1:null			//1st面板
    ,panel2:null			//2cd面板
    ,panel_detail:null      //鼠标滑过出现的面板
    ,order_ctl_div:null		//订单下拉框div
    ,select_title:null		//订单顶部下拉框数据结构
    ,tb:null				//下拉框选择后，显示的数据
    ,order_select1:null
    ,order_select2:null
    ,order_select3:null
    ,status:'init'			//是否第一次打开该页面
    ,action:''				//ws action字段
    ,stock_market:''		//ws 股票代码
    ,origin:''				//ws 订单源
    ,TYPE_NEW: 'new'
    ,TYPE_MDF: 'modify'
    ,TYPE_DTL: 'detail'
    ,capitals: []           //缓存资金数据变量
    ,stockset_slct:null     //撤单，股票下拉框
    ,accoutset_callback:null//撤单，账号是否选择回调函数
    


	,init:function(){
		var self = this;
        $('#'+self.tabs).tabs();
        $('#'+self.tabs).tabs({ selected: 0 });
        
        $('#'+self.nvg).click({"scope":self},self.order_tab1_clk);
        $('#'+self.tabs1).click({"scope":self},self.order_tab1_clk);
        $('#'+self.tabs2).click({"scope":self},self.order_tab2_clk);
        
        if("order_today" == self.instance){
        preload.getStock(function(){
            if(oojs$.getPanelID() == 2){
                if(self.action == 'order_new'){
                    $('#'+self.tabs).tabs({ 'selected': 1 });
                    self.order_tab2_clk({"data":{"scope":self}});
                }else{
                    self.order_tab1_clk({"data":{"scope":self}});
                }
            }
        });
        }
        oojs$.addEventListener('order_today',self.handler_ordtoday);
        // oojs$.addEventListener('order_period',self.handler_period);
        // oojs$.addEventListener('order_tomorrow',self.handler_tomorrow);
	}

    ,handler_ordtoday:function(dt){
        /*** action
        client  <-->    server
        null    <-->    new_data
        list    <-->    list

        dt{type,action,data}
        */
        console.log('order dt:',dt);
        var self = order_today;
        switch(dt.action){
            case "new_data":
                if(oojs$.getPanelID() == 2){
                    console.log("sendWSMessage list")
                    oojs$.sendWSMessage({'type':'order_today','action':'list','data':''});
                }
                break;
            case "list":
                // console.log('order_today list:',dt.data)
                
                self.order_list = [];
                self.order_list = dt.data.data;
                self.handler_scrollHint();
                if(self.order_list.length != 0 ){
                    self.appendTB_order_list();
                }
                break;
        }
    }
    ,handler_scrollHint:function(){
        var self = this;
        var stock = {};
        var tmp_arr;
        if(self.order_list && self.order_list.length>0){
            for( var idx = 0; idx < self.order_list.length; idx++ ){
                if( self.order_list[idx].hasOwnProperty('DEALSTOCK') && self.order_list[idx]['DEALSTOCK'] ){
                    tmp_arr = self.order_list[idx]['DEALSTOCK'].split(",");
                    if(tmp_arr && tmp_arr.length > 0 ){
                        for(var idx_sun = 0; idx_sun < tmp_arr.length; idx_sun++ ){
                            stock[tmp_arr[idx_sun]] = null;
                        }
                    }
                }
            }
        }
        var msg = "股票 "
        for(var elm in stock){
            msg += elm+" "
        }
        msg += "已处理，细节请看详情"
        $('#scrollingtext').empty();
        $('#scrollingtext').append( msg );
    }
    //event handler
	,order_tab1_clk:function(event){
        var self = event.data.scope;
        self.load_order();
    }
    ,order_tab2_clk:function(event){
        
        var self = event.data.scope;

        dictTrade.load_userAccount(function(){
            if(dictTrade.dictTrade_list_body.length == 0 && self.status == "init"){
                //首次调用，如果券商没有数据，直接进入券商
                self.status = "notinit";
                $('#accordion').accordion({'active':0});
                oojs$.dispatch("ready");
            }else if(dictTrade.dictTrade_list_body.length > 0 ){
            	//通知策略加载数据
                policy.load_subscribe(function () {
                    console.log("order\n","load subscrible\n");
                    self.status = "notinit";
                    if(policy.policy_subscribe.length == 0){
                        $('#accordion').accordion({'active':1});
                        oojs$.dispatch("ready");
                         //首次调用，如果策略没有数据，直接进入策略
                    }else{

                    	//构建dirtype买卖，gid(抄底，实时)，策略树形结构
                        self.select_title = null;
                        self.select_title = {};
                        for(var i = 0; i < policy.policy_subscribe.length; i++ ){
                            self.parse2obj_DIRTYPE( self.select_title, policy.policy_subscribe[i] );
                        }
                        self.init_order({
                        	'data':{
	                        	'scope':self,
	                        	'from':'init',
	                        	'DIRTYPE':parseInt(policy.policy_subscribe[0]['DIRTYPE']),
	                        	'PGROUPID':parseInt(policy.policy_subscribe[0]['PGROUPID']),
	                        	'USERID_POLICYID':policy.policy_subscribe[0]['USERID']+"_"+policy.policy_subscribe[0]['POLICYID'], 
	                        	'type':self.TYPE_NEW, 
	                        	'data':null
                        	}
                        });

                    }
                })
            }
        });
    }
    
    ,load_order:function(){
        var self = this;
        var sendData = {};
        
        if(self.instance == "order_today"){
            oojs$.httpPost_json("/select_preorder",sendData,function(result,textStatus,token){
                if(result
                        &&result.hasOwnProperty('success')
                        &&result.success){
                    self.order_list = [];
                    self.order_list = result.data;
                    if(self.order_list.length == 0 && self.status == 'init' ){
                        $('#'+self.tabs).tabs({ 'selected': 1 });
                        self.order_tab2_clk({'data':{'scope':self}});
                    }else{
                        self.appendTB_order_list();
                    }
                }else if(result){
                    oojs$.showError(result.message);
                }
            });
        }else if(self.instance == "order_period"){
            oojs$.httpPost_json("/select_orderPeriod",sendData,function(result,textStatus,token){
                if(result
                        &&result.hasOwnProperty('success')
                        &&result.success){
                    self.order_list = [];
                    self.order_list = result.data;
                    self.appendTB_order_list();
                }else if(result){
                    oojs$.showError(result.message);
                }
            });
        }else if(self.instance == "order_tomorrow"){
            oojs$.httpPost_json("/select_orderTomorrow",sendData,function(result,textStatus,token){
                if(result
                        &&result.hasOwnProperty('success')
                        &&result.success){
                    self.order_list = [];
                    self.order_list = result.data;
                    self.appendTB_order_list();
                }else  if(result){
                    oojs$.showError(result.message);
                }
            });
        }

    }

    //添加列表appendTB_order_list
    ,appendTB_order_list: function(){
    	var self = this;
    	$('#'+self.panel1).empty();
        var panel,list_head,list_body;
        panel = $('#'+self.panel1);

        list_head = self.list_benchmark_head;
        list_body = [];
        var list = null;
        list = self.order_list;
       
        list = self.orderId_filter(list,'ORDERID',self.merge_if);

        var one_third = '';
        var btnName = '';
        var forbid = '';
        var del = '';
        var href = null;
        var hrefs = null;
        var div = null;
        var stocks = [];
        var status = '';

        for(var elm = 0; elm < list.length; elm++){
        	list_body[elm] = {};
            for(var  inner in  list[elm]){
                list_body[elm][inner] = {
                	'ELEMENT': list[elm][inner],
                	'ORIGIN': list[elm][inner] 
                };
                if(self.merge_if.indexOf(inner)>=0 ){
                	if( inner == 'PGROUPID' ){
                		list_body[elm][inner]['ELEMENT'] = String( preload.getPGroupItem(list_body[elm][inner]['ORIGIN'])['NAME']);
                	}

                	if( inner == 'STOCKSET' ){
						list_body[elm][inner]['ELEMENT'] = String( oojs$.valideString(list_body[elm][inner]['ORIGIN']));
                	}

                	if( inner == 'DIRTYPE' ){
                		list_body[elm][inner]['ELEMENT'] = preload.getDirtype(list_body[elm][inner]['ORIGIN']);
                	}

                	if( inner == 'DEALSTOCK' ){
						var stockCount = 0;
	                    if( list_body[elm][inner]['ORIGIN'] && (list_body[elm][inner]['ORIGIN']).length>5 ){
	                        stocks = list_body[elm][inner]['ORIGIN'].split(",");
	                        div = $('<div></div>');
	                        for(var jj=0; jj < stocks.length; jj++){
	                            href = $('<a href="#"></a>').text(stocks[jj]).click(
	                                {'item':list_body[elm],'stock':stocks[jj],'scope':self},
	                                self.order_btn_herf
	                            );

	                            div.append(href)
	                            div.append($('<br />'));
	                            stockCount++;
	                        }
	                        
	                        list_body[elm][inner]['ELEMENT'] =  div;
	                    }
                	}

                	if( inner == 'STATUS' ){
                		status = list_body[elm][inner]['ORIGIN'];
                    	list_body[elm][inner]['ELEMENT'] = preload.getExecute(list_body[elm][inner]['ORIGIN']);
                	}

                	if( inner == 'FROMID' ){
                		list_body[elm][inner]['ELEMENT'] = preload.getFrom(list_body[elm][inner]['ORIGIN']);
                	}
                	
	            }else{
                    if( inner == 'DEALSTOCK' ){

                        list_body[elm][inner]['ELEMENT']=$('<a href="#">信息</a>')//$('<input></input>',{type:"button",value:"信息"})//
                        ;
                    }
	            }
            }
            // console.log("list item:",JSON.stringify(list_body[elm]))
            //完成情况信息提示
            if(null != list_body[elm]['DEALSTOCK']['ELEMENT'] ){

                
                //如果都完成变成绿色，如果部分完成变成红色,仅限于判断NULL
                var isRed = false;
                var isAll = true;

                if("object" == typeof(list_body[elm]['DEALSTOCK']['ORIGIN']) ){
                    for( var dealObj in list_body[elm]['DEALSTOCK']['ORIGIN'] ){
                        if(list_body[elm]['DEALSTOCK']['ORIGIN'][dealObj] != null){
                            isRed = true;
                        }
                        if(list_body[elm]['DEALSTOCK']['ORIGIN'][dealObj] == null){
                            isAll = false;
                        }
                    }
                }
                if(isRed && isAll){
                    list_body[elm]['DEALSTOCK']['ELEMENT'].css("color","#ec39e2");
                }else if(isRed){
                    list_body[elm]['DEALSTOCK']['ELEMENT'].css("color","red");
                }

            list_body[elm]['DEALSTOCK']['ELEMENT']
            .mouseenter({
                'scope':self, 
                'data':list_body[elm]
            },self.detail_enter)
            .mouseout({'scope':self},self.detail_out);
            }
            var div = $('<div></div>');

            $('<input></input>',{type:"button",value:"详情"}).appendTo(div).click(
                {'scope':self,
                	'from':'detail',
                	'DIRTYPE':list_body[elm]['DIRTYPE']['ORIGIN'],
                	'PGROUPID':list_body[elm]['PGROUPID']['ORIGIN'],
                	'USERID_POLICYID':list_body[elm]['USERID']['ORIGIN']+"_"+list_body[elm]['POLICYID']['ORIGIN'], 
                	'type':self.TYPE_DTL, 
                	'data':list_body[elm]
                	},
                	self.init_order
            );

            // if((status == "3"||status == "4")&&stockCount == 1){
            //     $('<input></input>',{type:"button",value:"修改"}).appendTo(div).prop('disabled',true);
            // }else {//if(status == "0"||status == "1")
                $('<input></input>',{type:"button",value:"修改"}).appendTo(div).click(
                	{'scope':self,
                	'from':'chg',
                	'DIRTYPE':list_body[elm]['DIRTYPE']['ORIGIN'],
                	'PGROUPID':list_body[elm]['PGROUPID']['ORIGIN'],
                	'USERID_POLICYID':list_body[elm]['USERID']['ORIGIN']+"_"+list_body[elm]['POLICYID']['ORIGIN'], 
                	'type':self.TYPE_MDF, 
                	'data':list_body[elm]
                	},
                	self.init_order
                );
            // }

            btnName = "X";
            forbid = 1;
            if(list_body[elm]['FLAG_USER'] && parseInt(list_body[elm]['FLAG_USER']['ELEMENT']) == 1){
                btnName = '✓';
                forbid = 0;
            }

            $('<input></input>',{type:"button",value:btnName}).appendTo(div).click(
                {'scope':self,
                	'from':'forbid',
                	'attach':forbid,
                	'DIRTYPE':list_body[elm]['DIRTYPE']['ORIGIN'],
                	'PGROUPID':list_body[elm]['PGROUPID']['ORIGIN'],
                	'USERID_POLICYID':list_body[elm]['USERID']['ORIGIN']+"_"+list_body[elm]['POLICYID']['ORIGIN'], 
                	'type':self.TYPE_MDF, 
                	'data':list_body[elm]
                	},
                	self.init_order
            );

            $('<input></input>',{type:"button",value:"删除"}).appendTo(div).click(
                {'scope':self,
                	'from':'del',
                	//'attach':0,
                	'DIRTYPE':list_body[elm]['DIRTYPE']['ORIGIN'],
                	'PGROUPID':list_body[elm]['PGROUPID']['ORIGIN'],
                	'USERID_POLICYID':list_body[elm]['USERID']['ORIGIN']+"_"+list_body[elm]['POLICYID']['ORIGIN'], 
                	'type':self.TYPE_MDF, 
                	'data':list_body[elm]
                	},
                	self.init_order
            );

            list_body[elm]['CTRL'] = {'ELEMENT':div};

        }

        oojs$.appendTB_list(panel,list_head,list_body);
    }
    ,isRegistSelect:false
    //初始化订单
    ,init_order: function(event){
        var self = event.data.scope;
        var DIRTYPE = event.data.DIRTYPE;
        var PGROUPID = event.data.PGROUPID; 
        var USERID_POLICYID = event.data.USERID_POLICYID; 
        var type = event.data.type; 
        var data = event.data.data;
        var from = event.data.from;
        var attach = event.data.hasOwnProperty('attach')?event.data.attach:null;
        if( type == self.TYPE_NEW ){
            var opt_1st=null;

            if(null == DIRTYPE){
                oojs$.showError('显示控件存在问题, code:'+DIRTYPE);
            }
            
            if( null != self.order_select1 ){
                self.order_select1.empty();
            }
            if( null == self.order_select1 ){
            self.order_select1 = $('<select></select>',{});}
            self.appendOption_select1();
            self.order_select1.prop('disabled',true);
            self.order_select1.val( DIRTYPE );
            
            if( null != self.order_select2 ){
                self.order_select2.empty();
            }
            if( null == self.order_select2){
            self.order_select2 = $('<select></select>',{});}
            opt_1st = self.appendOption_select2( DIRTYPE );
            if(null == PGROUPID){
                PGROUPID = opt_1st;
            }
            self.order_select2.prop('disabled',true);
            self.order_select2.val(PGROUPID);

            if( null != self.order_select3 ){
                self.order_select3.empty();
            }
            if( null == self.order_select3){
            self.order_select3 = $('<select></select>',{});}
            opt_1st = self.appendOption_select3( DIRTYPE, PGROUPID );
            if( null == USERID_POLICYID ){
                USERID_POLICYID = opt_1st;
            }
            self.order_select3.prop('disabled',true);
            self.order_select3.val(USERID_POLICYID);
            
            
            if(self.isRegistSelect == false){
                console.log("add self.order_select3.change");
                self.isRegistSelect = true;
                self.order_select1.change({'scope':self, 'type':type, 'data':data}, self.handler_dirtype);
                self.order_select2.change({'scope':self, 'type':type, 'data':data}, self.handler_group);
                self.order_select3.change({'scope':self, 'type':type, 'data':data, 'from':'policy'}, self.handler_policy);
            }
            self.order_select1.prop('disabled',false);
            self.order_select2.prop('disabled',false);
            self.order_select3.prop('disabled',false);
        }

        //|| self.select_title[DIRTYPE][PGROUPID].length==1|| 'group' == from
        // if(!('dirtype' == from ) ){
            self.handler_policy({'data':{ 
                'scope':self, 
                'USERID_POLICYID':USERID_POLICYID, 
                'from':from,
                'type':type,
                'attach':attach, 
                'data':data }});
        // }
    }
    //处理策略
    ,handler_policy: function(event){
        var self = event.data.scope;
        var type = event.data.type;
        var from = event.data.from;
        var attach = event.data['attach'];
        
        var USERID = '';
        var POLICYID = '';
        var USERID_POLICYID = '';

        if( event.data.hasOwnProperty('USERID_POLICYID') ){
            USERID_POLICYID = event.data['USERID_POLICYID'];
        }else{
            USERID_POLICYID = this.value;
        }

        // var obj = $(this).find("option:selected");
        // var name = obj.text();
        var key_value = USERID_POLICYID.split("_");
        USERID = key_value[0];
        POLICYID = key_value[1];

        var trade_list = [];
        var policy_data = {};
        var item = null;

        //及时卖出dirtype:1 groupid:2 policyid:1002，请求爬虫数据
        var ontimeSend_slct = {
            'DIRTYPE':'0',
            'PGROUPID':'0',
            'POLICYID':'0'
        }


        if(type == self.TYPE_NEW){

            item = policy.search_policyList_Item(USERID, POLICYID, policy.policy_subscribe);
            //及时卖出处理
            ontimeSend_slct.POLICYID = item['POLICYID'];
            ontimeSend_slct.PGROUPID = item['PGROUPID'];
            ontimeSend_slct.DIRTYPE = item['DIRTYPE'];
            

            for(var elm in item){
                policy_data[elm] = {
                    'ELEMENT': item[elm],
                    'ORIGIN': item[elm]
                };
                if('STARTTIME' == elm || 'ENDTIME' == elm){
                    if(self.instance == "order_tomorrow" ){
                        policy_data[elm]['datepicker'] = 'tomorrow';
                        policy_data[elm]['DATE'] = null;
                    }else if(self.instance == "order_period"){
                        policy_data[elm]['datepicker'] = 'datepicker';
                        if('ENDTIME' == elm){
                            var  date = new Date();
                            date.setFullYear(date.getFullYear()+1);
                            date.setHours(9);
                            date.setMinutes(0);
                            date.setSeconds(0);
                            policy_data[elm]['DATE'] = date;
                        }else{
                            policy_data[elm]['DATE'] = null;
                        }

                    }else if(self.instance == "order_today"){
                        policy_data[elm]['datepicker'] = null;
                        policy_data[elm]['DATE'] = null;
                    }
                }
            }
            
        }else if( type == self.TYPE_MDF || type == self.TYPE_DTL){
            var item_order = event.data.data;
            ontimeSend_slct.POLICYID = item_order['POLICYID']['ORIGIN'];
            ontimeSend_slct.PGROUPID = item_order['PGROUPID']['ORIGIN'];
            ontimeSend_slct.DIRTYPE = item_order['DIRTYPE']['ORIGIN'];

            //policy_data 存有订单的所有数据
            var ymd = null;
            for(var elm in item_order){
                //oojs$.toHMSOBJ(policy_data['STARTTIME']['ELEMENT'])
                if('STARTTIME' == elm || 'ENDTIME' == elm){
                    policy_data[elm] = {
                        'ORIGIN': item_order[elm]['ORIGIN']
                    }

                    if(self.instance == "order_tomorrow" || self.instance == "order_period"){
                        ymd = oojs$.Format(new Date(item_order[elm]['ORIGIN']),'yyyy-MM-dd-HH-mm-ss').split("-");
                        policy_data[elm]['ELEMENT'] = {'hh':ymd[3], 'mm':ymd[4], 'ss':ymd[5]};
                        policy_data[elm]['datepicker'] = 'datepicker';
                        if(self.instance == "order_tomorrow"){
                            policy_data[elm]['datepicker'] = 'tomorrow';
                        }
                        policy_data[elm]['DATE'] = new Date(item_order[elm]['ORIGIN']);
                    }else if(self.instance == "order_today"){
                        policy_data[elm]['ELEMENT'] = oojs$.toHMSOBJ(item_order[elm]['ORIGIN'])
                        policy_data[elm]['datepicker'] = null;
                        policy_data[elm]['DATE'] = null;
                    }
                }else{
                    policy_data[elm] = {
                        'ELEMENT': item_order[elm]['ELEMENT'],
                        'ORIGIN': item_order[elm]['ORIGIN']
                    }
                }
            }
        }

        var enable = null;
        if(self.TYPE_DTL == type){
            enable = 0;
        }
        var count_right = 0;
        for(var elm in ontimeSend_slct){
            if( self.ontime_cdtion[elm].indexOf( String(ontimeSend_slct[elm]) ) >= 0 ){
                count_right++;
            }   
        }
        if(count_right == 3){
            policy_data['ONTIMESEND'] = {'ELEMENT':true,'ORIGIN':true};
        }else{
            policy_data['ONTIMESEND'] = {'ELEMENT':false,'ORIGIN':false};
        }
        
        var STARTTIME = $('<div></div>');
        var start_component = new  oojs$.com.stock.component.hh_mm_ss();
        start_component.init(STARTTIME, 
            policy_data["STARTTIME"]['ELEMENT'], 
            policy_data["STARTTIME"]['datepicker'], 
            policy_data["STARTTIME"]['DATE'],
            enable);
        
        var ENDTIME = $('<div></div>');
        var end_component = new  oojs$.com.stock.component.hh_mm_ss();
        end_component.init(ENDTIME, 
            policy_data["ENDTIME"]['ELEMENT'], 
            policy_data["ENDTIME"]['datepicker'], 
            policy_data["ENDTIME"]['DATE'],
            enable);
        
        var stockset = new oojs$.com.stock.component.stockset();
        var STOCKSET = {
            'ELEMENT':null
            ,'ELEMENT1':$('<div></div>')
            ,'ELEMENT2':$('<div></div>')
            ,'ROWSPAN':2
            ,'ORIGIN':policy_data["STOCKSET"]['ORIGIN']
            ,'COMPONENT':stockset};
        stockset.init(
            STOCKSET['ELEMENT1'],
            STOCKSET['ELEMENT2'],
            policy_data["STOCKSET"]['ORIGIN'],
            (policy_data.hasOwnProperty('ONTIMESEND') && policy_data['ONTIMESEND']['ORIGIN'])?1:0,
            enable
            );
        
        policy_data['PGROUPID']['ELEMENT'] = 
        preload.getPGroupItem(policy_data['PGROUPID']['ORIGIN'])["NAME"];

        policy_data['DIRTYPE']['ELEMENT'] = 
        preload.getDirtype(policy_data['DIRTYPE']['ORIGIN']);

        var jsonView = new oojs$.com.stock.JsonView();
        
        if( String(policy_data['DIRTYPE']['ORIGIN']) == '9' ){
            enable = 0;//如果及时卖出
        }

        var divs = jsonView.init( policy_data["POLICYPARAM"]['ORIGIN'], enable );
        var JSONVIEW = {};
        for(var idx = 0; idx<divs.length; idx++){
            JSONVIEW["ELEMENT"+(idx+1)] = divs[idx];
        }
        JSONVIEW["COMPONENT"] = jsonView;
        JSONVIEW["ROWSPAN"] = divs.length;
        policy_data["POLICYPARAM"] = JSONVIEW;

        policy_data["STARTTIME"]['ELEMENT'] = STARTTIME;
        policy_data["STARTTIME"]['COMPONENT'] = start_component;
        policy_data["ENDTIME"]['ELEMENT'] = ENDTIME;
        policy_data["ENDTIME"]['COMPONENT'] = end_component;

        policy_data["STOCKSET"] = STOCKSET;//{ELEMENT:STOCKSET};

        if(!policy_data.hasOwnProperty('LABLE')){
            policy_data["LABLE"]={'ELEMENT':null,'COMPONENT':null};
        }
        var txt = $('<input></input>',{'type':"text"});
        policy_data["LABLE"]['ELEMENT'] = $('<div></div>').append(txt);
        policy_data["LABLE"]['COMPONENT'] = txt;
        policy_data["LABLE"]['COMPONENT'].val(policy_data["LABLE"]['ORIGIN']==null?"":policy_data["LABLE"]['ORIGIN']);

        if( type == self.TYPE_NEW ){
            if( !('dirtype' == from || 'group' == from || 'policy' == from) ){
                //不是下拉框触发，需要加载数据
                dictTrade.load_userAccount(function(){
                    self.parseTrade_list(policy_data, dictTrade.dictTrade_list_body,  type, from);
                })
            }else{
                //下拉框触发，不用再加载数据
                self.parseTrade_list(policy_data, dictTrade.dictTrade_list_body,  type, from);
            }
            
        }else if(type == self.TYPE_MDF || type == self.TYPE_DTL){
            //依据merge_if，把合并的数据从policy_data裁开到 dictTrade_list_body
            var dictTrade_list_body = [];
            for(var elm in policy_data){
                if(self.merge_if.indexOf(elm)>=0 || elm == "CTRL"){
                    continue;
                }else{
                    for(var idx = 0; idx < policy_data[elm]['ORIGIN'].length; idx++ ){
                        if( null == dictTrade_list_body[idx] ){
                            dictTrade_list_body[idx] = {};
                        }
                        dictTrade_list_body[idx][elm] = policy_data[elm]['ORIGIN'][idx];
                    }
                }
            }
            self.parseTrade_list(policy_data, dictTrade_list_body, type, from, attach);
        }
    }
    //解析券商列表
    ,parseTrade_list: function( policy_data, dictTrade_list_body,  type, from, attach ){
        var self = this;
        var trade_list = [];
        var index = 0;
        var item_account = null;
        
        var sendAccounts = [];
        var PERCENT = '';
        var CHECKED = 1;
        var tmp_trade = null;
        var isCancelOrder_ontime = false;
        self.order_ontime ={
            'order_cancel':false,
            'order_send':false
        }

        if( self.accoutset_callback != null ){
            for(var elm in self.accoutset_callback){
                self.accoutset_callback[elm] = null;
                delete self.accoutset_callback[elm]
            }
            self.accoutset_callback = null;
        }
        //判断是否是实时，撤单，是：添加回调事件
        if(type == self.TYPE_NEW 
            && policy_data['DIRTYPE']['ORIGIN'] == '9' 
            && policy_data['PGROUPID']['ORIGIN'] ==  '5'
            && policy_data['POLICYID']['ORIGIN'] ==  '1004'  ){
            if( self.accoutset_callback == null ){
                self.accoutset_callback = {};
                self.order_ontime['order_cancel'] = true;
            }
        }

        if(type == self.TYPE_NEW 
            && policy_data['DIRTYPE']['ORIGIN'] == '1'
            && policy_data['PGROUPID']['ORIGIN'] ==  '5'
            && policy_data['POLICYID']['ORIGIN'] == '1003' ){
            if( self.accoutset_callback == null ){
                self.accoutset_callback = {};
                self.order_ontime['order_send'] = true;
            }
        }


        for( var elm in dictTrade_list_body ){
            item_account = dictTrade_list_body[elm];
            sendAccounts.push({"accountid":item_account['ACCOUNTID']});
            tmp_trade = trade_list[index] = {};
            
            trade_list[index]["ELEMENT"] = item_account;
            trade_list[index]["COLUMN1"] = $('<div></div>');
            trade_list[index]["COLUMN2"] = $('<div></div>');
            //账号设置
            trade_list[index]["COMPONENT"] = new oojs$.com.stock.component.accountset();

            //if( isCancelOrder_ontime ){
            if( self.order_ontime['order_cancel'] || self.order_ontime['order_send']){
                self.accoutset_callback[item_account['ACCOUNTID']] = function(param){
                    //console.log("check arguments:", JSON.stringify(param) );
                    self.handler_cancel_select({'data':{
                        'scope':self,
                        'ACCOUNTID':param.ACCOUNTID,
                        'CHECKED':param.CHECKED
                    }});
                }
            }

            ////div1, div2, ACCOUNTID, DIRTYPE, BORROW, BUYCOUNT, BUYAMOUNT, PERCENT, CHECKED)
            //
            if(type == self.TYPE_NEW){
                PERCENT = policy_data["PERCENT"]['ORIGIN']
            }else if(type == self.TYPE_MDF){
                PERCENT = item_account['PERCENT']
            }else{
                PERCENT = item_account['PERCENT']
            }


            if(item_account.hasOwnProperty('CHECKED')
                ){
                 CHECKED = item_account['CHECKED'] == null?'1':item_account['CHECKED']
            }
            //div1, div2, ACCOUNTID, DIRTYPE, BORROW, BUYCOUNT, BUYAMOUNT, PERCENT, CHECKED, ACCOUNT, enable, evt_chk_f
            //账号赋值
            trade_list[index]["COMPONENT"].init(
                trade_list[index]["COLUMN1"]
                ,trade_list[index]["COLUMN2"]
                ,item_account['ACCOUNTID']
                ,policy_data['DIRTYPE']['ORIGIN']
                ,preload.getTradeItem(item_account['TRADEID'])["BORROW"]
                ,item_account['BUYCOUNT']
                ,item_account['BUYAMOUNT']
                ,PERCENT//item_account['PERCENT']
                ,CHECKED
                ,item_account
                ,null
                ,(self.order_ontime!=null && (self.order_ontime['order_cancel'] || self.order_ontime['order_send']))?self.accoutset_callback[item_account['ACCOUNTID']]:null//是否勾选回调函数
            );
            //详情处理
            if( type == self.TYPE_DTL ){
                index++;
                trade_list[index]={"COLUMN1":"状态","COLUMN2": preload.getExecute( tmp_trade['ELEMENT']['STATUS'] )};
                index++;
                trade_list[index]={"COLUMN1":"执行情况","COLUMN2":tmp_trade['ELEMENT']['DEALSTOCK']};
                index++;
                trade_list[index]={"COLUMN1":"来源","COLUMN2":preload.getFrom(tmp_trade['ELEMENT']['FROMID'])};
                index++;
                trade_list[index]={"COLUMN1":" ","COLUMN2":" "};
            }
            index++;
        }

        var policyHead = self.get_policy_head(); 
        if('forbid' == from || 'del' == from){
            //禁用和删除的处理
            //{'scope':self,"policy_data":policy_data,"trade_list":trade_list, "type":type}
            self.order_submit( {'data':{
                'scope':self,
                'policy_data': policy_data, 
                'trade_list':trade_list, 
                'from':from,
                'attach':attach,
                'type': type
            }} );
        }else{
            if(sendAccounts.length>0){
                console.log("trade_list",JSON.stringify(trade_list));
                //self.capitalVerify( policyHead, policy_data, sendAccounts, trade_list, type, from, isCancelOrder_ontime ); 
                self.capitalVerify( policyHead, policy_data, sendAccounts, trade_list, type, from ); 
            }else{
                oojs$.showError("您还没有添加账号");
            }
        }
    }
    //资金验证 drawitem_data , sendAccounts, trade_list, type
    ,capitalVerify:function( policyHead, policy_data, sendAccounts, trade_list, type, from ){
        var self = this;

        if(  !(type == self.TYPE_DTL) ||!('dirtype' == from || 'group' == from || 'policy' == from ) || self.capitals.length == 0 || (self.order_ontime['order_cancel'] || self.order_ontime['order_send']) ){
            //不是下拉框触发,或者资金为空，需要加载数据
            oojs$.httpPost_json('/capital',sendAccounts,function(result,textStatus,token){
                console.log(JSON.stringify(arguments));
                var capitals = [];
                try{
                    capitals = result.data;
                }catch(err){
                    capitals = [];
                    console.log('order',err);
                }
                if(capitals == ""){
                    capitals = [];
                    // capitals = [
                    // { "status": "200",  "accountid": "0880003093040", "account_muse": "99988.88",   "stock_position": "902897,932276", "cancel_orders": "002898,732277"}, 
                    // { "status": "200",  "accountid": "09824056843",   "account_muse": "69018.21",   "stock_position": "802897,832276", "cancel_orders": "" }
                    // ];
                }
                self.capitals = capitals;
                self.parseCapital(trade_list,capitals);
                if( self.order_ontime['order_cancel'] || self.order_ontime['order_send']){
                    self.resetStockset( policy_data );
                }
                self.draw_order( policyHead, policy_data, trade_list, type );
               
            });
        }else{
            //下拉框触发，不用再加载数据
            self.parseCapital(trade_list, self.capitals);
            self.draw_order( policyHead, policy_data, trade_list, type );
        }
 		
    }
    //解析资金
    ,parseCapital: function(trade_list, capitals){
        if(capitals.length>0){
            for(var i = 0; i < trade_list.length; i++){
                for(var elm in capitals){
                    var item_capital = capitals[elm];
                    if(trade_list[i]["ELEMENT"] && String(trade_list[i]["ELEMENT"]['ACCOUNTID']) == String(item_capital.accountid) ){
                        if(String(item_capital.status) != "200"){
                            continue;
                        }else{
                            trade_list[i]["COMPONENT"].addCapital(item_capital);
                        }
                    }
                }
            }
        }
    }
    ,resetStockset:function(policy_data){
        //判断是否一键撤销，是自选股改为请求该账号下具有撤单的股票的下拉框形式展示
        var self = this;
        
        delete policy_data["STOCKSET"]['ELEMENT1'];
        delete policy_data["STOCKSET"]['ELEMENT2'];
        delete policy_data["STOCKSET"]['ROWSPAN'];
        self.stockset_slct = $('<select ></select>',{
            style:"height:25px;width:100px;"//-webkit-appearance: none;-moz-appearance: none;-o-appearance: none;"
        });
        policy_data["STOCKSET"]['ELEMENT'] = $('<div></div>');
        policy_data["STOCKSET"]['COMPONENT'] = new oojs$.com.stock.component.stockset_ontime();
        policy_data["STOCKSET"]['COMPONENT'].init(
            policy_data["STOCKSET"]['ELEMENT'], 
            self.stockset_slct);

        self.parse_cancelStock();
        policy_data["STOCKSET"]['COMPONENT'].assign(self.stockset_slct.val());
        
    }
    //绘制订单 account_list
    ,draw_order: function(policy_head, policy_data, trade_list, type){
    	var self = this;

    	var order_body_div = null;
    	if(type == self.TYPE_NEW){
    		//订单下拉框
    		if(self.order_ctl_div==null){
	            self.order_ctl_div = $('<div></div>');
	            self.order_ctl_div.appendTo($('#'+self.panel2));
	            
	            self.tb = $('<table></table>', {
		            'class':"display dataTable"
		        }).appendTo(self.order_ctl_div);
		       
	            var tr = $('<tr></tr>',{'class':"even"}).appendTo(self.tb);
        		var td =$('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
        		td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        		td.append($('<label></label>').text("交易类型:"));
        		td.append( self.order_select1 );
        		td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        		td.append($('<label></label>').text("策略类型:"));
        		td.append( self.order_select2 );
        		td.append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
        		td.append($('<label></label>').text("策略名称:"));
        		td.append( self.order_select3 );
	        }
	        //订单内容
    		if(self.order_body_div == null){
                
                self.order_body_div = $('<div ></div>');
                self.order_body_div.appendTo($('#'+self.panel2));
               
            }

            self.order_body_div.empty();
            order_body_div = self.order_body_div;
    	}else if( type == self.TYPE_MDF || type == self.TYPE_DTL ){
    		order_body_div = $('#'+self.panel1).empty();
    	}
    	

        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo(order_body_div);

        oojs$.appendTB_item_D2(tb,policy_head,policy_data);
        self.appendTB_accountHint(tb, trade_list);
        // self.appendTB_account_body(tb, account_itemD2, dirtype);

        oojs$.appendTB_item_D2x(tb,trade_list);

        var tr = $('<tr></tr>',{}).appendTo(tb);
        var td = $('<td></td>',{ 'colspan':"2",'align':"center",'valign':"bottom"}).appendTo(tr);
        //按钮处理
        if(self.TYPE_MDF == type && policy_data['ONTIMESEND']['ORIGIN'] || self.TYPE_DTL == type){
            //实时处理 与 详情
            // $('<input></input>',{'type':"button",value:"提交"}).appendTo(td).click(
            //     {'scope':self,"policy_data":policy_data,"trade_list":trade_list, "type":type}
            //     ,self.order_submit
            // );
        }else{
            $('<input></input>',{'type':"button",value:"提交"}).appendTo(td).click(
                {'scope':self,"policy_data":policy_data,"trade_list":trade_list, "type":type}
                ,self.order_submit
            );
        }

        if( self.TYPE_MDF == type || self.TYPE_DTL == type ){
            $('<input></input>',{'type':"button",value:"取消"}).appendTo(td).click(
                 {'scope':self},
                self.order_btn_modifyreback
            );
        }
    }
    //策略类型，下来框触发
    ,handler_dirtype: function(event){
        var self = event.data.scope;
        var DIRTYPE = this.value;
        self.init_order(
        	{'data':{'scope':self,
        	'from':'dirtype',
        	'DIRTYPE':DIRTYPE,
        	'PGROUPID':null,
        	'USERID_POLICYID':null, 
        	'type':event.data.type, 
        	'data':event.data.data}
        });
    }
    //分组交易类型，下拉框触发
    ,handler_group: function(event){
        var self = event.data.scope;
        self.init_order(
        	{'data':{'scope':self,
        	'from':'group',
        	'DIRTYPE':self.order_select1.val(),
        	'PGROUPID':self.order_select2.val(),
        	'USERID_POLICYID':null, 
        	'type':event.data.type, 
        	'data':event.data.data}
        }); 
    }

    ,handler_cancel_select: function( event ){
        var self = event.data.scope;
        var ACCOUNTID = event.data.ACCOUNTID;
        var CHECKED = event.data.CHECKED;

        //{ "status": "200", "tradeid": "29", "accountid": "880003092753", "userid": "20036", "account_muse": "99988.88", "account_value": "0.00", "account_msum": "99988.88", "stock_position": "", "cancel_orders": "002898,732277", "shanghai_code": "A112160495", "shenzhen_code": "0232992772", "account_name": "???", "details": "queryAccount,request=\\/account\\/detail?rdm=2088,accountid=880003092753,userid=20036,canuse=1,clientid=43,jypasswd.len=6" }, 
        for(var elm in self.capitals){
            if(self.capitals[elm]['accountid'] == ACCOUNTID ){
                self.capitals[elm]['CHECKED'] = CHECKED;
            }
        }
        //console.log('self_capitals',self.capitals);
        self.parse_cancelStock();

    }

    ,parse_cancelStock: function(){
        var self = this;
        var stock = {};
        var tmp_arr;
        //// || 
        var index_name = 'cancel_orders';

        if(self.order_ontime['order_cancel']){
            index_name = 'cancel_orders';
        }else if(self.order_ontime['order_send']){
            index_name = 'stock_position';
        }
        
        for(var elm in self.capitals){
            if( self.capitals[elm].hasOwnProperty("CHECKED") &&  self.capitals[elm]['CHECKED'] == false ){

            }else{
                if( self.capitals[elm][index_name].length >= 6 ){
                    tmp_arr = self.capitals[elm][index_name].split(",");
                    if( tmp_arr.length > 0 ){
                        for(var idx = 0; idx < tmp_arr.length; idx++ ){
                            stock[tmp_arr[idx]] = null;
                        }
                    }
                }
            }
        }
        //console.log('stock:::::',JSON.stringify(stock));
        if(self.stockset_slct!=null){
            self.stockset_slct.empty();
            for( var elm in stock ){
                self.stockset_slct.append(
                    "<option value='"
                    +elm
                    +"'>"
                    +elm+"</option>"
                );
            }
            console.log("select:::::",self.stockset_slct.val());
        }
        
    }
    //策略解析为对象
    ,parse2obj_DIRTYPE: function(obj, appendObj){
        var self = this;
        if( !obj.hasOwnProperty( appendObj['DIRTYPE'] ) ){
            obj[appendObj['DIRTYPE']] = {};
        }
        self.parse2obj_PGROUPID( obj[appendObj['DIRTYPE']], appendObj );
    }
    //交易解析为对象
    ,parse2obj_PGROUPID: function(obj, appendObj){
        var self = this;
        if( !obj.hasOwnProperty( appendObj['PGROUPID'] ) ){
            obj[appendObj['PGROUPID']]  = [];
        }
        
        obj[appendObj['PGROUPID']].push({
            "POLICYID":appendObj["POLICYID"]
            ,"PNAME":appendObj["PNAME"]
            ,"USERID":appendObj["USERID"]
        });
    }
    //策略部分交易类型
    ,appendOption_select1: function () {
        var self = this;
        return self.option_append(self.order_select1, self.select_title, preload.getDirtype);
    }
    ///策略部分
    ,appendOption_select2: function (DIRTYPE) {
        var self = this;
        return self.option_append(self.order_select2,self.select_title[DIRTYPE],function(pp){
            return preload.getPGroupItem(pp)["NAME"];
        });
    }
    ///策略部分下拉框控件
    ,appendOption_select3: function (DIRTYPE, PGROUPID) {
        var self = this;
        var options = self.select_title[DIRTYPE][PGROUPID];
        for(var idx=0;idx < options.length;idx++){
        	self.order_select3.append(
			    "<option value='"
			    +options[idx]['USERID']+"_"+options[idx]['POLICYID']
			    +"'>"+options[idx]["PNAME"]+"</option>"
			);
        }
        return options[0]['USERID']+"_"+options[0]['POLICYID'];
    }

    ,option_append: function(select,obj,filter){
    	var firstElm=null;
        for(var elm in obj){
        	if(firstElm==null){
        		firstElm = elm;
        	}
            select.append(
                "<option value='"
                +elm
                +"'>"+filter(elm)+"</option>"
            );
        }
        return elm;
    }

    
    ,get_policy_head:function(){
        var policyHead_arr;
        policyHead_arr = policy.get_preOrder_head();
        var hasLABLE = false;
        for(var idx_head = 0; idx_head < policyHead_arr.length; idx_head++ ){
            if(policyHead_arr[idx_head].hasOwnProperty('LABLE')){
                hasLABLE = true;
            }
        }
        if(!hasLABLE){
            policyHead_arr.push({
            'ID':'LABLE',
            'NAME':"自定义标签"
            })
        }
        return policyHead_arr;
    }
    //过滤器合并统一策略，多个账号的操作
    ,orderId_filter:function(list, label, merge_if){
        var self = this;

        var list_cp = [];
        var root_obj = {};
        //ORDERID分类
        for(var idx = 0; idx < list.length; idx++){
            if(list[idx].hasOwnProperty(label)){
                if(root_obj.hasOwnProperty(list[idx][label])){
                    root_obj[list[idx][label]].push(list[idx])
                }else{
                    root_obj[list[idx][label]]=[];
                    root_obj[list[idx][label]].push(list[idx]);
                }
            }
        }
        //merge_if的元素合并
        var tmp_obj = null;
        var one_record = null;
        for(var indx in root_obj){
            var item_obj = {};
            for(var idx = 0; idx < root_obj[indx].length; idx++){
                one_record = root_obj[indx][idx];
                for(var param in one_record){
                    if(merge_if.indexOf(param)>=0){
                        item_obj[param] = one_record[param];
                    }else{
                        if(!item_obj.hasOwnProperty(param)){
                           item_obj[param] = [];
                        }
                        item_obj[param].push(one_record[param]);
                    }
                }
            }
            list_cp.push(item_obj);
        }

        // console.log('orderId_filter',list_cp);
        return list_cp;
    }
    //排版中提示信息
    ,appendTB_accountHint:function(tb, trade_list){
	    var self = this;
        var tr = $('<tr></tr>',{'class':"even"}).appendTo(tb);
        var td = $('<td></td>',{ colspan:"2",align:"left",valign:"bottom"}).appendTo(tr);
        td.append($('<label></label>').text("请选择您帐户:"));
        var label = $('<label></label>',{

        }).text('(*注：只有选择了账户才能选择交易策略)');
        label.css({ 'color': 'red', 'font-size': '80%' });
        td.append(label);
        //全选复选框按钮
        td.append($('<label></label>').text("  是否全选:"));
        //全选复选框☑默认全选️
        var checkall = $('<input></input>',{
            'type':'checkbox'
            ,'name':"checkall"
        }).change(
            {'trade_list':trade_list},
            self.allcheck_change
        ).prop("checked",true);

        td.append(checkall);

    }
    //全选或全不选操作触发的事件
    ,allcheck_change:function(event){
	    var trade_list = event.data.trade_list;
        if ($(this).is(':checked')) {

            for(var i = 0; i < trade_list.length; i++){
                trade_list[i]["COMPONENT"].CHECK.prop("checked",true);
                trade_list[i]["COMPONENT"].ck_change({"data":{"scope":trade_list[i]["COMPONENT"]}});
            }
        }else{

            for(var i = 0; i < trade_list.length; i++){
                trade_list[i]["COMPONENT"].CHECK.prop("checked",false);
                trade_list[i]["COMPONENT"].ck_change({"data":{"scope":trade_list[i]["COMPONENT"]}});
            }
        }
    }

    //修改返回按钮触发
    ,order_btn_modifyreback:function(event){
        //返回
        var self = event.data.scope;
        self.appendTB_order_list();
    }

    ,data_detail:null
    ,first_enter:false
    //详情入口
    ,detail_enter:function( event ){
        var self = event.data.scope;
        
        if( self.panel_detail != null ){
            self.data_detail = $.extend(true,{},event.data.data);
            
            // $('#'+self.panel_detail).css({'top':$(this).top+$(this).height(),'left':$(this).offset().left});
            var childPos = $(this).offset();//event.target.offset();//$(this).position();//
            var parentPos = $(this).parent().offset();//event.target.parent().offset();//
            
            // $('#debug').text( "left: " + childPos.left+",p_left:"+parentPos.left + ", top: " + childPos.top );
            var html_tmp = '未知';
            if( null != self.data_detail && self.data_detail['DEALSTOCK']['ORIGIN'].length >0 ){
                html_tmp='';
                // for(var idx = 0; idx < self.data_detail['DEALSTOCK']['ORIGIN'].length; idx++ ){
                    html_tmp += self.data_detail['DEALSTOCK']['ORIGIN']+'<br />';
                // }
            }
            if(!self.first_enter){
                self.first_enter = true;
                console.log("enter",html_tmp)//JSON.stringify(self.data_detail));
            }
            $('#'+self.panel_detail).empty();
            $('#'+self.panel_detail).append(html_tmp);
            // var detail_item = $.extend(true,{},self.detail_item)
            
            $('#'+self.panel_detail).css({
                'position': 'fixed',
                'top':childPos.top+$(this).height(),//120,//parentPos.top-childPos.top,//
                'left':childPos.left//380//parentPos.left-childPos.left
                });
                //{'top':$(this).parent().offset().top+$(this).height(),'left':$(this).offset().left});
            $('#'+self.panel_detail).show();
        }
    }

    ,detail_out:function( event ){
        var self = event.data.scope;
        self.data_detail = null;
        self.first_enter = false;
        if( self.panel_detail != null ){
            $('#'+self.panel_detail).hide();
        }
    }

    ,order_submit:function(event){
        var self = event.data.scope;

        var policy_data = event.data['policy_data'];
        var trade_list = event.data['trade_list'];

        var type = "new"
        if(event.data.hasOwnProperty("type")){
            type = event.data['type']
        }

        var policy_data_new = {};
        
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
        
        //策略中判断 stockset ，股校验限制
        //'type':
        //'0' 允许空
        //'1' 不允许为空
        //'2' 只允许一只股
        var policy_stockset_doc = '';
        if(policy_data_new['POLICYPARAM'].hasOwnProperty('stockset')
            && policy_data_new['POLICYPARAM']['stockset'].hasOwnProperty('type') ){
            policy_stockset_doc =  policy_data_new['POLICYPARAM']['stockset']['type'];
        }


        console.log("policy_data\n",JSON.stringify(policy_data_new));
        console.log("account_list\n",JSON.stringify(trade_list));

        var account_result = [];
        var index = 0;
        var COMPONENT_ACCOUNTSET = null;
        for(var idx = 0; idx < trade_list.length; idx++){

            if( trade_list[idx]["COMPONENT"] 
                && trade_list[idx]["COMPONENT"].val() 
                && !trade_list[idx]["COMPONENT"].val()['CHECKED']
                && type == self.TYPE_NEW
                ){//如果下单，不勾选的不作为数据发送
                continue;
            }

            if( trade_list[idx]["COMPONENT"]){
                COMPONENT_ACCOUNTSET = trade_list[idx]["COMPONENT"].val();
                if(COMPONENT_ACCOUNTSET==null ){
                    return ; 
                }//accountset返回的null的情况
            }
            
            account_result[index] = {};
                
            for(var elm in trade_list[idx]["ELEMENT"]){
                account_result[index][elm] = trade_list[idx]["ELEMENT"][elm];
            }
            
            for( var elm in  COMPONENT_ACCOUNTSET ){
                if(typeof(COMPONENT_ACCOUNTSET[elm]) == 'object'){
                    continue
                }
                account_result[index][elm] = COMPONENT_ACCOUNTSET[elm];
            }

            if( trade_list[idx]["COMPONENT"] 
                && trade_list[idx]["COMPONENT"].val() 
                && trade_list[idx]["COMPONENT"].val()['CHECKED']
                ){
                
                account_result[index]['CHECKED'] = 1;
                
            }else{
                account_result[index]['CHECKED'] = 0;
            }

            index++;
        }
        
        if(account_result.length == 0){
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
            ,'LABLE':null
            ,'CHECKED':null
            ,'ONTIMESEND':null
            ,'CANAME':null
        }

        //TRADEID
        //ISTEST
        // var specialField = [
        //     'FLAG_USER'
        //     ,'VISIBLE'
        //     ,'ROWID'
        //     ,'TRADEID'
        //     ,'ISTEST'
        // ];
        var sendData = [];
        for( var i = 0; i < account_result.length; i++ ){
            sendData[i] = {};
            for(var elm in sentStruct){
                //policy_data
                //account_result
                if(policy_data_new.hasOwnProperty(elm)){
                    sendData[i][elm] = policy_data_new[elm];
                }
                
                if(account_result[i] && account_result[i].hasOwnProperty(elm)){
                    sendData[i][elm] = account_result[i][elm];
                }

                if( elm == 'STOCKSET' && policy_stockset_doc != '' && type == self.TYPE_NEW ){
                    if( policy_stockset_doc == '0' ){
                        //允许空
                    }else if( policy_stockset_doc == '1' ){
                        //不允许为空
                        if(sendData[i][elm] == ''){
                            oojs$.showError("该策略不允许股票为空");
                            return;
                        }
                    }else if( policy_stockset_doc == '2' ){
                        //只允许一只股
                        //为空，或者有逗号的都不允许通过
                        if(sendData[i][elm] == '' || sendData[i][elm].indexOf(',')!= -1 ){
                            oojs$.showError("该策略只允许股票为1股");
                            return;
                        }
                    }
                }
            }
            if(event.data.hasOwnProperty('from')
            	&&event.data.from == 'forbid'
            ){
            	sendData[i]['FLAG_USER'] = event.data.attach;
            }
            if(event.data.hasOwnProperty('from')
            	&&event.data.from == 'del'
            ){
            	sendData[i]['VISIBLE'] = 0;
            }
        }

        console.log("order sendData",JSON.stringify(sendData));
        
        if(self.instance == "order_today"){
            if(type == self.TYPE_NEW){
                oojs$.httpPost_json("/insert_preorder",sendData,function(result,textStatus,token){
                    if(result
                        &&result.hasOwnProperty('success')
                        &&result.success){

                        $( "#"+self.tabs ).tabs({ selected: 0 });
                        self.order_tab1_clk({"data":{"scope":self,"param":'6'}});

                    }else if(result){
                        oojs$.showError(result.message);
                    }
                });
            }else if(type == self.TYPE_MDF){
                oojs$.httpPost_json("/update_ordertoday",sendData,function(result,textStatus,token){
                    if(result
                        &&result.hasOwnProperty('success')
                        &&result.success){
                        
                        $( "#"+self.tabs ).tabs({ selected: 0 });
                        self.order_tab1_clk({"data":{"scope":self}});

                    }else if(result){
                        oojs$.showError(result.message);
                    }
                });
            }
        }else if(self.instance == "order_period"){
        	if(type == self.TYPE_NEW){
        		oojs$.httpPost_json("/insert_orderPeriod",sendData,function(result,textStatus,token){
	                if(result
	                    &&result.hasOwnProperty('success')
	                    &&result.success){
	                    $( "#"+self.tabs ).tabs({ selected: 0 });
	                    self.order_tab1_clk({"data":{"scope":self}});
	                }else if(result){
	                    oojs$.showError(result.message);
	                }
	            });
        	}else if(type == self.TYPE_MDF){
        		oojs$.httpPost_json("/update_orderPeriod",sendData,function(result,textStatus,token){
	                if(result
	                    &&result.hasOwnProperty('success')
	                    &&result.success){
	                    
	                    $( "#"+self.tabs ).tabs({ selected: 0 });
	                    self.order_tab1_clk({"data":{"scope":self}});
	                }else if(result){
	                    oojs$.showError(result.message);
	                }
	            });
        	}
        }else if(self.instance == "order_tomorrow"){
        	if(type == self.TYPE_NEW){
        		oojs$.httpPost_json("/insert_orderTomorrow",sendData,function(result,textStatus,token){
	                if(result
	                    &&result.hasOwnProperty('success')
	                    &&result.success){
	                    $( "#"+self.tabs ).tabs({ selected: 0 });
	                    self.order_tab1_clk({"data":{"scope":self}});
	                }else if(result){
	                    oojs$.showError(result.message);
	                }
	            });
        	}else if(type == self.TYPE_MDF){
        		oojs$.httpPost_json("/update_orderTomorrow",sendData,function(result,textStatus,token){
	                if(result
	                    &&result.hasOwnProperty('success')
	                    &&result.success){
	                    
	                    $( "#"+self.tabs ).tabs({ selected: 0 });
	                    self.order_tab1_clk({"data":{"scope":self}});
	                }else if(result){
	                    oojs$.showError(result.message);
	                }
	            });
        	}
        }

    }
    ,__ctor:function(){
        var self = this;
        if(arguments[0].hasOwnProperty('instance')){
            self.instance = arguments[0]['instance'];
        }
        if(arguments[0].hasOwnProperty('nvg')){
            self.nvg = arguments[0]['nvg'];
        }
        if(arguments[0].hasOwnProperty('tabs')){
            self.tabs = arguments[0]['tabs'];
        }
        if(arguments[0].hasOwnProperty('tabs1')){
            self.tabs1 = arguments[0]['tabs1'];
        }
        if(arguments[0].hasOwnProperty('tabs2')){
            self.tabs2 = arguments[0]['tabs2'];
        }
        if(arguments[0].hasOwnProperty('panel1')){
            self.panel1 = arguments[0]['panel1'];
        }
        if(arguments[0].hasOwnProperty('panel2')){
            self.panel2 = arguments[0]['panel2'];
        }
        if(arguments[0].hasOwnProperty('panel_detail')){
            self.panel_detail = arguments[0]['panel_detail'];
        }
    }
});

var order_today = new oojs$.com.stock.order({
    "instance":"order_today"
    ,'nvg':'order_today'
    ,'tabs':'order_today_tabs'
    ,'tabs1':'order_today_tabs_a1'
    ,'tabs2':'order_today_tabs_a2'
    ,'panel1':'order_today_tabs_1'
    ,'panel2':'order_today_tabs_2'
    ,'panel_detail':'todayDetail'
});

oojs$.addEventListener("ready",function(){
    console.log('order ready',JSON.stringify(arguments));
    //{'type':'showPanel','action':'order_new','origin':'market','data':param}
    if(typeof(arguments[0]) == 'object'){
    	//来源ws协议
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

    }else{
    	order_today.init();
    }
  
});
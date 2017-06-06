oojs$.ns("com.stock.market");
oojs$.com.stock.market = oojs$.createClass(
{
    list_benchmark_head: []
    ,timestamp: []
    ,stock: {}
    ,title: []
    ,data: []
    ,page_total:0
    ,page_current:0
    ,page_pgct:0
    ,ws:null
    ,tableOptions: {
      "bJQueryUI": true,
      //'bProcessing': true,
      "bFilter": false,
      "bInfo": false,
      'bPaginate':false,
      "iDisplayLength": 24,
      "aLengthMenu": [[24, 48, -1], [24, 48, "全部"]],
      "oLanguage": {
          "sLengthMenu": "显示 _MENU_ 条记录",             
          "sZeroRecords": "没有检索到数据",
          "sInfo": "当前数据为从第 _START_ 到第 _END_ 条数据；总共有 _TOTAL_ 条记录",
          "sInfoEmtpy": "没有数据",
          "sProcessing": "正在加载数据...",
          "oPaginate": {
              "sFirst": "首页",
              "sPrevious": "前页",
              "sNext": "后页",
              "sLast": "尾页"
          }
      },
      "sDom": '<"wrapper"flipt>',
      "sPaginationType": "full_numbers"
    }
    ,table:null
    ,dataTable:null

    ,init:function(){
      $('#market_tb_paginate').hide();

      var self = this;
      $('#market').click({'scope':self},self.market_tab1_clk);
      oojs$.addEventListener('market',self.handler_market,self);
      self.addClickEvent();

    }
    
    ,handler_market:function(result){
      //console.log(JSON.stringify(result))
      var self = this;
      if(result 
        && result.hasOwnProperty('data') 
        && result['data'] ){
        var data = result['data'];


        if( data.hasOwnProperty('title')
          && data['title'] 
          && data['title'].length > 0
          && self.list_benchmark_head.length==0
        ){
          self.list_benchmark_head = data['title'];
          var name = self.list_benchmark_head[0];
          self.list_benchmark_head[0] = self.list_benchmark_head[1];
          self.list_benchmark_head[1] = name;
          self.appendTB_market();
        }

        if(data.hasOwnProperty('timestamp')
          && data['timestamp'] 
          && data.hasOwnProperty('stock')
          && data['stock']
          && data.hasOwnProperty('code')
          && data['code']
          && data.hasOwnProperty('stock_total')
          && data['stock_total']
          && data.hasOwnProperty('stock_pgct')
          && data['stock_pgct']
        ){
          
          self.data = [];
          self.page_total = data['stock_total'];
          self.page_pgct = data['stock_pgct'];
          var tmp_detail = [];
          var name = '';
          var sss = '';
          for(var i = 0; i <  data['code'].length; i++){
            tmp_detail = data['stock'][data['timestamp'][1]][data['code'][i]];

            if(tmp_detail && tmp_detail.length>2){
              name = tmp_detail[0];
              
              tmp_detail[0] = "<a href='#' onclick='market.click_stock(\""+tmp_detail[1]+"\");'>"+tmp_detail[1]+"</a>";
              tmp_detail[1] = name;
              sss = tmp_detail[5];
              if(sss){
                tmp_detail[5] = /*sss.substr(0,4)+'-'+*/sss.substr(4,2)+'-'+sss.substr(6,2)+
                ' '+sss.substr(8,2)+':'+sss.substr(10,2)+':'+sss.substr(12,2);
              }else{
                tmp_detail[5] = '-';
              }

              self.data.push(tmp_detail);
            }else{
              tmp_detail = [];
              for(var ii = 0; ii < self.list_benchmark_head.length; ii++){
                if(ii==0){
                  tmp_detail[ii]=data['code'][i];
                }else{
                  tmp_detail[ii]='-'
                }
              }
              self.data.push(tmp_detail);
            }
          }
          
          if(self.dataTable && self.data.length>0){
            self.dataTable.fnClearTable();
            self.dataTable.fnAddData(self.data);

            $('#market_tb_paginate').show();
            self.handler_paginate();
          }
        }

      }
    }

    ,forward_dictTrade:function(param){
      console.log(param);
      if(param == 'yes'){
        $('#accordion').accordion({'active':0});
        oojs$.dispatch("ready", {'type':'showPanel','action':'dictTrade_new','origin':'market'});
      }
    }

    ,forward_policy:function(param){
      console.log(param);
      if(param == 'yes'){
        $('#accordion').accordion({'active':1});
        oojs$.dispatch("ready", {'type':'showPanel','action':'policy_list','origin':'market'});
      }
    }

    ,click_stock:function(param){
      
      if( dictTrade.is_load_tradelist && policy.is_load_subscribe ){
        if( dictTrade.dictTrade_list_body.length == 0 ){
          oojs$.showInfo("您还没有设置账户，是否现在设置账户?",market.forward_dictTrade);
        }else if(policy.policy_subscribe.length == 0){
          oojs$.showInfo("您还没有订阅策略，是否现在订阅策略?",market.forward_policy);
        }else{
          $('#accordion').accordion({'active':2});
          oojs$.dispatch("ready", {'type':'showPanel','action':'order_new','origin':'market','data':param});
        }
      }else{
        dictTrade.load_userAccount(function(){
          policy.load_subscribe(function () {
            if( dictTrade.dictTrade_list_body.length == 0 ){
              oojs$.showInfo("您还没有设置账户，是否现在设置账户?",market.forward_dictTrade);
            }else if(policy.policy_subscribe.length == 0){
              oojs$.showInfo("您还没有订阅策略，是否现在订阅策略?",market.forward_policy);
            }else{
              $('#accordion').accordion({'active':2});
              oojs$.dispatch("ready", {'type':'showPanel','action':'order_new','origin':'market','data':param});
            }
          })
        })
      }
      
    }

    ,market_tab1_clk:function(evt){
    }
    
    ,market_tab2_clk:function(event){
    }

    ,appendTB_market:function(){
      var self = this;
      if(self.table == null){
        self.table = $('#market_tb');
        var thead = $('<thead></thead>'),tr= $('<tr></tr>'),th;
        self.table.append(thead);
        thead.append(tr);
        for( var i = 0; i < self.list_benchmark_head.length; i++ ){
          th = $('<th>'+self.list_benchmark_head[i]+'</th>')
          tr.append(th);
        }
        self.dataTable = $('#market_tb').dataTable( self.tableOptions );
      }

    }
    //page_pgct
    ,lastEvt: null
    ,click_href:function(evt){
      var self = evt['data']['scope'];
      if(evt !== self.lastEvt){
        self.lastEvt = evt;
      }else{
        return;
      }
      var page_G_total = Math.floor(self.page_total/self.page_pgct);
      var baseNum = Math.floor(self.page_current/5)*5
      switch($(this).attr('id')){
        case 'market_tb_0':
          self.page_current = baseNum+0;
          break;
        case 'market_tb_1':
          self.page_current = baseNum+1;
          break;
        case 'market_tb_2':
          self.page_current = baseNum+2;
          break;
        case 'market_tb_3':
          self.page_current = baseNum+3;
          break;
        case 'market_tb_4':
          self.page_current = baseNum+4;
          break;
        case 'market_tb_first':
          self.page_current = 0;
          break;
        case 'market_tb_previous':
          if(self.page_current-5>=0){
            self.page_current -= 5;
          }
          break;
        case 'market_tb_next':
        
          if(baseNum+5 <= page_G_total){
            self.page_current += 5;
            if(self.page_current>=page_G_total){
              self.page_current=page_G_total;
            }
          }
          
          break;
        case 'market_tb_last':
          self.page_current = page_G_total;
          break;
      }

      self.handler_paginate();
      self.ws_submit();
      return true;
    }
    ,lastSubmit:0
    ,ws_submit: function(){
      var self = this;
      if(self.lastSubmit != self.page_current){
        self.lastSubmit = self.page_current;
        oojs$.sendWSMessage({'type':'market','action':'paginate','data':self.page_current});
      }
    }

    ,handler_paginate:function(){
      var self = this;
      var baseNum = Math.floor(self.page_current/5)*5;
      //var basecursor = baseNum*self.page_pgct;
      var page_G_total = Math.floor(self.page_total/self.page_pgct);
      if(self.page_current <= 4 ){
        $('#market_tb_first').addClass('ui-state-disabled');
        $('#market_tb_previous').addClass('ui-state-disabled');
      }else{
        $('#market_tb_first').removeClass('ui-state-disabled');
        $('#market_tb_previous').removeClass('ui-state-disabled');
      }

      if(page_G_total-baseNum<5){
        $('#market_tb_last').addClass('ui-state-disabled');
        $('#market_tb_next').addClass('ui-state-disabled');
      }else{
        $('#market_tb_last').removeClass('ui-state-disabled');
        $('#market_tb_next').removeClass('ui-state-disabled');
      }

      for(var i=0;i<5;i++){

        if((baseNum+i)>page_G_total){
          $('#market_tb_'+i).addClass('ui-state-disabled');
          $('#market_tb_'+i).hide();
        }else{
          $('#market_tb_'+i).removeClass('ui-state-disabled');
          $('#market_tb_'+i).show();
        }

        $('#market_tb_'+i).empty();
        $('#market_tb_'+i).append( String(baseNum+i) );
      }

      $('#market_tb_'+(self.page_current%5)).addClass('ui-state-disabled');   
    }

    ,addClickEvent: function(){
      var self = this;
      $('#market_tb_0').click({'scope':self},self.click_href);
      $('#market_tb_1').click({'scope':self},self.click_href);
      $('#market_tb_2').click({'scope':self},self.click_href);
      $('#market_tb_3').click({'scope':self},self.click_href);
      $('#market_tb_4').click({'scope':self},self.click_href);
      
      $('#market_tb_first').click({'scope':self},self.click_href);
      $('#market_tb_previous').click({'scope':self},self.click_href);
      $('#market_tb_next').click({'scope':self},self.click_href);
      $('#market_tb_last').click({'scope':self},self.click_href);
    }
});

var market = new oojs$.com.stock.market();
oojs$.addEventListener("ready",function(){
    market.init();
});
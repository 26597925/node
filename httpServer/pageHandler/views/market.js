oojs$.ns("com.stock.market");
oojs$.com.stock.market = oojs$.createClass(
{
    list_benchmark_head: []
    ,timestamp: []
    ,stock: {}
    ,title: []
    ,data: []
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
    // ,tableOptions: {
    //     "fnInitComplete": function () {
    //         var that = this;
    //         this.$('td').click( function () {
    //             console.log(this);
    //         })
    //     }
    // }
    ,table:null
    ,dataTable:null
    ,init:function(){
        var self = this;
        $('#market').click({'scope':self},self.market_tab1_clk);
        // $('#dictTrade').click({'scope':self},self.close_socket);
        // $('#policy').click({'scope':self},self.close_socket);
        // $('#order_today').click({'scope':self},self.close_socket);
        // $('#order_period').click({'scope':self},self.close_socket);
        // $('#user').click({'scope':self},self.close_socket);
        
        this.market_tab1_clk();
        oojs$.addEventListener('market',self.handler_market,self);
        
    }
    
    ,handler_market(result){
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
            console.log('============title===========');
            self.appendTB_market();
        }

        if(data.hasOwnProperty('timestamp')
          && data['timestamp'] 
          && data.hasOwnProperty('stock')
          && data['stock']
          && data.hasOwnProperty('code')
          && data['code']
        ){
            self.data = [];
            var tmp_detail = [];

            for(var i = 0; i <  data['code'].length; i++){
              tmp_detail = data['stock'][data['timestamp'][1]][data['code'][i]]
              if(tmp_detail && tmp_detail.length>0){
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
            console.log(JSON.stringify(self.data));
            if(self.dataTable){
              self.dataTable.fnClearTable();
              self.dataTable.fnAddData(self.data);
            }
        }
      }
      
    }

    // ,testClick:function(){
    //     
    //     self.table.fnClearTable();
    //     self.table.fnAddData(self.data1);
    //     oojs$.sendWSMessage({'type':'order_today','action':'list','data':'111'});
    // }
    
    ,market_tab1_clk:function(evt){
        //var self = market;
        // var 
        // if(self.table == null){
        //     self.table = $('#market_tb').dataTable( tableOptionsForOnlineUsers );
        // }
        // self.table.fnClearTable();
        // self.table.fnAddData(self.data);
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
        //self.table.fnClearTable();
      }

    }
});

var market = new oojs$.com.stock.market();
oojs$.addEventListener("ready",function(){
    market.init();
});
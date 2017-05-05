oojs$.ns("com.stock.market");
oojs$.com.stock.market = oojs$.createClass(
{
    list_benchmark_head: [
    ]
    
    ,ws:null
    ,init:function(){
        var self = this;
        $('#market').click(self.market_tab1_clk);
        $('#dictTrade').click(self.close_socket);
        $('#policy').click(self.close_socket);
        $('#order_today').click(self.close_socket);
        $('#order_period').click(self.close_socket);
        $('#user').click(self.close_socket);
    }
    ,close_socket:function(){
        var self = this;
        if(self.ws!=null){
            self.ws.close();
            self.ws = null;
        }
    }
    ,market_tab1_clk:function(){
        $('#aaa').dataTable();
        market.load_market();
    }
    ,market_tab2_clk:function(event){

    }
    ,appendTB_market:function(){
        var self = this;
        oojs$.appendTB_list(panel,list_head,list_body);
    }

    ,load_market:function(){
        var self = this;
        var sendData = {};
        var host = window.document.location.host.replace(/:.*/, '');
        // self.ws = new WebSocket('ws://' + host + ':20080');
        // selfws.onmessage = function (event) {
        //     console.log(JSON.stringify(event.data));
        // };
    }
});

var market = new oojs$.com.stock.market();
oojs$.addEventListener("ready",function(){
    market.init();
});
oojs$.ns("com.stock.market");
oojs$.com.stock.market = oojs$.createClass(
{
    list_benchmark_head: [
    ]
    ,data: [
        [
          "<a href='#' onclick='market.click(1);'>Tiger Nixon</a>",
          $('<button>ccc</button>'),
          "Edinburgh",
          "5421",
          "2011/04/25",
          "$320,800"
        ],
        [
          "<a href='#' onclick='market.click(2);'>Garrett Winters</a>",
          "Accountant",
          "Tokyo",
          "8422",
          "2011/07/25",
          "$170,750"
        ],
        [
          "<a href='#' onclick='market.click(3);'>Ashton Cox</a>",
          "Junior Technical Author",
          "San Francisco",
          "1562",
          "2009/01/12",
          "$86,000"
        ],
        [
          "<a href='#' onclick='market.click(4);'>Cedric Kelly</a>",
          "Senior Javascript Developer",
          "Edinburgh",
          "6224",
          "2012/03/29",
          "$433,060"
        ],
        [
          "Airi Satou",
          "Accountant",
          "Tokyo",
          "5407",
          "2008/11/28",
          "$162,700"
        ]]
    ,data1: [
        [
          "Brielle Williamson",
          "Integration Specialist",
          "New York",
          "4804",
          "2012/12/02",
          "$372,000"
        ],
        [
          "Herrod Chandler",
          "Sales Assistant",
          "San Francisco",
          "9608",
          "2012/08/06",
          "$137,500"
        ]
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
        
        this.market_tab1_clk();
        $('#testbtn').click(self.testClick);
        var send = [{"accountid":"309219512983"},{"accountid":"309219249819"}];
        oojs$.httpPost_json('/capital',send,function(){
            console.log(JSON.stringify(arguments));
        });
    }
    ,testClick:function(){
        var self = market;
        self.table.fnClearTable();
        self.table.fnAddData(self.data1);
    }
    ,click:function(){
        console.log(JSON.stringify(arguments));
    }
    ,close_socket:function(){
        var self = this;
        if(self.ws!=null){
            self.ws.close();
            self.ws = null;
        }
    }
    ,market_tab1_clk:function(){
        var self = market;

        var tableOptionsForOnlineUsers = {
            "bJQueryUI": true,
            "bFilter": false,
            "bInfo": false,
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
        };

        // if(!self.dt_onlineuser){
        //     self.dt_onlineuser = $("#dt_onlineuser").dataTable(tableOptionsForOnlineUsers);
        // }

        // self.dt_onlineuser.fnClearTable(); 

        // self.dt_onlineuser.fnAddData([[1,2,3],[1,2,3],[1,2,3]]);

        

        // $('#aaa').dataTable();
        // market.load_market();
        
        // $('#example tbody').on( 'click', 'button', function () {
        //     var data = table.row( $(this).parents('tr') ).data();
        //     alert( data[0] +"'s salary is: "+ data[ 5 ] );
        // } );
        // {
        //     // "ajax": "data/arrays.txt",
        //     "columnDefs": [ {
        //         "targets": -1,
        //         "data": null,
        //         "defaultContent": "<button>Click!</button>"
        //     } ]
        // } 
        if(self.table == null){
            var tableOptions = {
                "fnInitComplete": function () {
                    var that = this;
                    this.$('td').click( function () {
                        console.log(this);
                    })
                }
                // "columns":[{
                //     "targets": -1,
                //     "data": null,
                //     // visible: false,
                //     "defaultContent": "<button>Click!</button>"
                // }]
                // "columnDefs": [ {
                //     "targets": -1,
                //     "data": null,
                //     // visible: false,
                //     "defaultContent": "<button>Click!</button>"
                // } ]
            };
            //tableOptions//tableOptions
            self.table = $('#example').dataTable( tableOptionsForOnlineUsers );
            // $('#example tbody').click(function(){
            //     $(this);
            // });
        }
        self.table.fnClearTable();
        self.table.fnAddData(self.data);

        
    }
    ,dt_onlineuser:null
    ,table:null
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
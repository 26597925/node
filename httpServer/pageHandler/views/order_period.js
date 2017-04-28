oojs$.ns("com.stock.order_period");
oojs$.com.stock.order_period = oojs$.createClass(
{
    list_benchmark_head: [
        {
            ID:'ACCOUNTID',
            NAME:"帐户"
        }
        ,
        {
            ID:"DIRTYPE",
            NAME:"交易类型"
        }
        ,{
            ID:'POLICYID',
            NAME:"策略名称"
        }
        // ,{
        //     'ID':"STOCKSET",
        //     'NAME':"自选股"
        // }
        ,{
            'ID':"ONETHIRD",
            'NAME':"金额／数量" //三选一
        }
        ,{
            'ID':"STATUS",
            'NAME':"状态"
        }
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
        ,{
            'ID':'FROMID',
            'NAME':"来源"
        }
        ,{
            'ID':"CTRL",
            'NAME':"操作"
        }
    ]
    ,test:function(){
      $( function() {
        var availableTags = [
          {
            label: "aardvark_哈对方考虑",
            value: "aardvark"
          },
          {
            label: "<b>apple</b>",
            value: "apple"
          },
          {
            label: "<i>atom</i>",
            value: "atom"
          }
        ];
            // var availableTags = [
            //   "ActionScript",
            //   "AppleScript",
            //   "Asp",
            //   "BASIC",
            //   "C",
            //   "C++",
            //   "Clojure",
            //   "COBOL",
            //   "ColdFusion",
            //   "Erlang",
            //   "Fortran",
            //   "Groovy",
            //   "Haskell",
            //   "Java",
            //   "JavaScript",
            //   "Lisp",
            //   "Perl",
            //   "PHP",
            //   "Python",
            //   "Ruby",
            //   "Scala",
            //   "Scheme"
            // ];
            $( "#tags" ).autocomplete({
              source: availableTags
            });
          } );


        var stockset = new oojs$.com.stock.component.stockset();
        stockset.init($('#t1'),$('#t2'),'123,456');



        var hh_mm_ss = new  oojs$.com.stock.component.hh_mm_ss();
        hh_mm_ss.init($('#t3'),{ hh:0, mm:1, ss:2 });

        var acountset = new oojs$.com.stock.component.acountset();
        acountset.init($('#t4'),$('#t5'),123456,'1',1,0,1,0,true);
        var acountset1 = new oojs$.com.stock.component.acountset();
        acountset1.init($('#t6'),$('#t7'),654321,0,1,0,1,0);
        var acountset2 = new oojs$.com.stock.component.acountset();
        acountset2.init($('#t8'),$('#t9'),'qwerty',9,0,0,1,0,true);

        $('#order_period_tabs_a2').click(function(){
            console.log(stockset.val());
            console.log(hh_mm_ss.val());
            console.log(acountset.val());
            console.log(acountset1.val());
            console.log(acountset2.val());
        });

    }
    ,init:function(){
      var self = this;
        // $("#order_period_tabs").tabs();
        // $("#order_period").click(this.order_period_tab1_clk);
        // $("#order_period_tabs_a1").click(this.order_period_tab1_clk);
        // $("#order_period_tabs_a2").click(this.order_period_tab2_clk);
        //  order_period.order_period_tab1_clk();
        self.test();
    }
    ,order_period_tab1_clk:function(){
        // order_today.load_order_today();
    }
    

});

var order_period = new oojs$.com.stock.order_period();
oojs$.addEventListener("ready",function(){
    order_period.init();
});
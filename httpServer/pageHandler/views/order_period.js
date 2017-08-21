var order_period = new oojs$.com.stock.order({
    "instance":"order_period"
    ,'nvg':'order_period'
    ,'tabs':'order_period_tabs'
    ,'tabs1':'order_period_tabs_a1'
    ,'tabs2':'order_period_tabs_a2'
    ,'panel1':'order_period_tabs_1'
    ,'panel2':'order_period_tabs_2'
});

oojs$.addEventListener("ready",function(){
    order_period.init();
});
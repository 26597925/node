var order_tomorrow = new oojs$.com.stock.order({
    "instance":"order_tomorrow"
    ,'nvg':'order_tomorrow'
    ,'tabs':'order_tomorrow_tabs'
    ,'tabs1':'order_tomorrow_tabs_a1'
    ,'tabs2':'order_tomorrow_tabs_a2'
    ,'panel1':'order_tomorrow_tabs_1'
    ,'panel2':'order_tomorrow_tabs_2'
});

oojs$.addEventListener("ready",function(){
    order_tomorrow.init();
});
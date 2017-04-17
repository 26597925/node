oojs$.ns("com.stock.orderList");
oojs$.com.stock.orderList = oojs$.createClass(
{
    init:function(){
        $("#orderList_tabs").tabs();
        this.nvgPolicyClick();
    }

    ,console:function(){
        var logs = ["preOrder"];
        console.log(JSON.stringify(logs.concat(arguments)));
    }

    ,nvgPolicyClick:function(){

        var tb = $('<table></table>', {
            class:"display dataTable"
        }).appendTo($('#orderList_tabs_1'));
        var list_head = [{ID:"COL1",NAME:"策略类型"},{ID:"COL2",NAME:"策略类型"},{ID:"COL3",NAME:"策略类型"}];
        var list_body = {
            "COL1":{ ELEMENT:"value1" },
            "COL2":{ ELEMENT:"value2" },
            "COL3":{ ELEMENT:"left",ELEMENT1:'right-up',ELEMENT2:'right-down',ROWSPAN:2},
            //"COL3":{ MENT:"left",ELEMENT1:'right-up'},ELEMENT2:'right-mid',ELEMENT3:'right-down',ROWSPAN:3},
            "COL4":{ ELEMENT:"only one cell",COLSPAN:2}
        };
        oojs$.appendTB_item_D2(tb,list_head,list_body);

    }



});

var orderList = new oojs$.com.stock.orderList();
oojs$.addEventListener("ready",function(){
    orderList.init();
});
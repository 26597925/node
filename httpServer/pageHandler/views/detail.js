oojs$.ns("com.stock.order_detail");
oojs$.com.stock.order_detail = oojs$.createClass(
{
    // ROWID
    // USERID
    // TRADEID
    // ISTEST
    // STATUS
    // FLAG
    list_benchmark_head: [
        {
            ID:'ORDERID',
            NAME:"订单号"
        }
        ,
        {
            ID:'PGROUPID',
            NAME:"策略类型"
        }
        ,
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
        ,{
            ID:'POLICYPARAM',
            NAME:"POLICYPARAM"
        }
        ,{
            'ID':"STOCKSET",
            'NAME':"自选股"
        }
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
            'ID':'STARTTIME',
            'NAME':"开始时间"
        }
        ,{
            'ID':'ENDTIME',
            'NAME':"结束时间"
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
        // ,{
        //     'ID':"CTRL",
        //     'NAME':"操作"
        // }
    ]
    ,init:function(){
        var self = this;
        console.log("window.opener:",window.opener.order_today);
        var detail_item= window.opener.order_today.get_detail();
        var preload = window.opener.preload;
        // console.log("detail",JSON.stringify(detail_item));
        self.appendTB_item(detail_item,preload)
    }
    ,appendTB_item:function(detail_item,preload){
        var self = this;
        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo( $('#detail_panel') );
        detail_item['PGROUPID']['ELEMENT'] = preload.getPGroupItem(detail_item['PGROUPID']['ELEMENT'])['NAME'];
        detail_item['STARTTIME']['ELEMENT'] = oojs$.toHMS(detail_item['STARTTIME']['ELEMENT']);
        detail_item['ENDTIME']['ELEMENT'] = oojs$.toHMS(detail_item['ENDTIME']['ELEMENT']);
        oojs$.appendTB_item_D2(tb,self.list_benchmark_head,detail_item);
    }

});


var order_detail=null;
oojs$.addEventListener("ready",function(){
    order_detail = new oojs$.com.stock.order_detail();
    order_detail.init();
});



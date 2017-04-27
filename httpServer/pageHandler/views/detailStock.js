oojs$.ns("com.stock.order_detail");
oojs$.com.stock.order_detail = oojs$.createClass(
{
    list_benchmark_head: [
        {
            ID:'ACCOUNTID',
            NAME:"帐户"
        }
        ,
        {
            ID:'DIRTYPE',
            NAME:"交易类型"
        }
        ,
        {
            ID:'PNAME',
            NAME:"策略名称"
        }
        ,
        {
            ID:'TRADEID',
            NAME:"券商帐号"
        }
        ,
        {
            ID:'STOCKID',
            NAME:"股票代码"
        }
        ,
        {
            ID:"PRICE",
            NAME:"成交价格"
        }
        ,
        {
            ID:'QUANTITY',
            NAME:" 成交数量"
        }
        ,
        {
            'ID':"STOCKSET",
            'NAME':"委托方式"
        }
        ,
        {
            'ID':"WEITUOID",
            'NAME':"委托编号" //三选一
        }
        ,
        {
            'ID':"DETAIL",
            'NAME':"状态"
        }
        ,
        {
            'ID':'ERRORINFO',
            'NAME':"错误信息"//stockid
        }
        ,
        {
            'ID':'LOGTIME',
            'NAME':"成交时间"
        }
    ]
    ,
    detail_item:null
    ,
    detailStock:null
    ,
    init:function(){
        var self = this;
        try{
            if(self.detail_item == null){
                var stockDetail = window.opener.order_today.get_stockDetail();
                self.detail_item = {};
                for(var elm in stockDetail){
                    if(stockDetail.hasOwnProperty(elm) && stockDetail[elm] ){
                        self.detail_item[elm] = stockDetail[elm];
                    }
                    
                }
                self.detailStock = window.opener.order_today.stock;
                preload.PGROUP = window.opener.preload.PGROUP;
                preload.TRADE = window.opener.preload.TRADE;
            }
            self.loadTradeDetail();
        }catch(err){console.log(err)}
    }
    ,
    loadTradeDetail: function(){
        var self = this;
        var sendData = {};
        console.log(JSON.stringify(self.detail_item));
        sendData['POLICYID'] = self.detail_item['POLICYID']['ELEMENT'];
        sendData['STOCKID'] = self.detailStock;//self.detail_item['STOCKID']['ELEMENT'];
        sendData['DIRTYPE'] = self.detail_item['DIRTYPE']['ORIGIN'];
        sendData['USERID'] = self.detail_item['USERID']['ELEMENT'];
        sendData['ACCOUNTID'] = self.detail_item['ACCOUNTID']['ELEMENT'];
        // sendData['TRADEID'] = self.detail_item['TRADEID']['ELEMENT'];
        // sendData['ORDERID'] = self.detail_item['ORDERID']['ELEMENT'];
        console.log("sendData\n",JSON.stringify(sendData));
       
        
        
        oojs$.httpPost_json("/select_tradeDetail",sendData,function(result,textStatus,token){
            self.detailStock = result.data;
            self.appendTB_item();
        });
        
    }
    ,
    appendTB_item:function(){
        var self = this;
        var detail_stock = self.detailStock;
        if(detail_stock && detail_stock.length>0){
        console.log("appendTB_item\n",JSON.stringify(detail_stock));
        var item = {};
       
        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo( $('#panel_detailStock') );

        for(var elm in detail_stock[0]){
            item[elm] = {};
            item[elm]["ELEMENT"] = detail_stock[0][elm]
        }
        item['DIRTYPE']['ELEMENT'] = preload.getDirtype(item['DIRTYPE']['ELEMENT']);
        
        item['LOGTIME']['ELEMENT'] = oojs$.Format(new Date(item['LOGTIME']['ELEMENT']),"yyyy-MM-dd HH:mm:ss");
        // item['PGROUPID']['ELEMENT'] = preload.getPGroupItem(item['PGROUPID']['ELEMENT'])['NAME'];
        // item['STARTTIME']['ELEMENT'] = oojs$.toHMS(item['STARTTIME']['ELEMENT']);
        // item['ENDTIME']['ELEMENT'] = oojs$.toHMS(item['ENDTIME']['ELEMENT']);
        // item['DEALSTOCK']['ELEMENT'] = item['DEALSTOCK']['ORIGIN'];
        oojs$.appendTB_item_D2(tb,self.list_benchmark_head,item);
        }
    }

});


var order_detail=null;
oojs$.addEventListener("ready",function(){
    order_detail = new oojs$.com.stock.order_detail();
    order_detail.init();
});



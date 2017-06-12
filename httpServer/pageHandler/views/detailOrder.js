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
            ID:'PNAME',
            NAME:"策略名称"
        }
        ,{
            ID:'POLICYPARAM',
            NAME:"子策略类型"
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
    ,detail_item:null
    ,detail_item_deepcp:null
    ,originName:''
    ,getParentParam:function(param){
        console.log("detailstock getParentParam",param);
    }
    ,init:function(){

        var self = this;
        self.originName = '';
        if( window.opener.hasOwnProperty('shareObj') 
            && window.opener.shareObj
            && window.opener.shareObj.detailName
        ){
            self.originName = window.opener.shareObj.detailName;
        }

        if(self.originName == 'order_today'){
            self.detail_item= window.opener.order_today.get_detail();
        }else if(self.originName == 'order_period'){
            self.detail_item= window.opener.order_period.get_detail();
        }

        preload.PGROUP = window.opener.preload.PGROUP;
        preload.TRADE = window.opener.preload.TRADE;
        
        self.appendTB_item();
    }
    ,appendTB_item:function(){
        var self = this;
        var detail_item = $.extend(true,{},self.detail_item)
        
        var tb = $('<table></table>', {
            'class':"display dataTable"
        }).appendTo( $('#detail_panel') );

        if(detail_item['PGROUPID'] 
            && !detail_item['PGROUPID'].hasOwnProperty('ELEMENT') 
        ){
            var PGROUPID = detail_item['PGROUPID']
            detail_item['PGROUPID'] ={};
            detail_item['PGROUPID']['ELEMENT'] = PGROUPID;
        }
        if(detail_item.hasOwnProperty('PGROUPID') 
            && detail_item['PGROUPID'] 
            && detail_item['PGROUPID'].hasOwnProperty('ELEMENT')
        ){
            detail_item['PGROUPID']['ELEMENT'] = preload.getPGroupItem(detail_item['PGROUPID']['ELEMENT'])['NAME'];    
        }
//--
        if(detail_item['POLICYPARAM'] && !detail_item['POLICYPARAM'].hasOwnProperty('ELEMENT')){
            var POLICYPARAM = detail_item['POLICYPARAM'];
            detail_item['POLICYPARAM'] = {};
            detail_item['POLICYPARAM']['ELEMENT'] =  POLICYPARAM;
        }
        if(detail_item.hasOwnProperty('POLICYPARAM') 
            && detail_item['POLICYPARAM']
            && detail_item['POLICYPARAM'].hasOwnProperty('ELEMENT')
        ){
            detail_item['POLICYPARAM']['ELEMENT'] = oojs$.fetch_paramName(detail_item['POLICYPARAM']['ELEMENT'])
        }
//--  
        if(detail_item['STARTTIME'] 
            && !detail_item['STARTTIME'].hasOwnProperty('ELEMENT') 
        ){
            var STARTTIME = detail_item['STARTTIME'];
            detail_item['STARTTIME'] = {};
            detail_item['STARTTIME']['ELEMENT'] =  STARTTIME;
        }
        if(detail_item.hasOwnProperty('STARTTIME') 
            && detail_item['STARTTIME']
            && detail_item['STARTTIME'].hasOwnProperty('ELEMENT')
        ){
            if(self.originName == 'order_today'){
                detail_item['STARTTIME']['ELEMENT'] = oojs$.toHMS(detail_item['STARTTIME']['ELEMENT']);
            }else if(self.originName == 'order_period'){
                detail_item['STARTTIME']['ELEMENT'] = detail_item['STARTTIME']['ELEMENT'];
            }
        }
//--
        if(detail_item['ENDTIME'] 
            && !detail_item['ENDTIME'].hasOwnProperty('ELEMENT') 
        ){
            var STARTTIME = detail_item['ENDTIME'];
            detail_item['ENDTIME'] = {};
            detail_item['ENDTIME']['ELEMENT'] =  STARTTIME;
        }
        if(detail_item.hasOwnProperty('ENDTIME') 
            && detail_item['ENDTIME']
            && detail_item['ENDTIME'].hasOwnProperty('ELEMENT')
        ){
            if(self.originName == 'order_today'){
                detail_item['ENDTIME']['ELEMENT'] = oojs$.toHMS(detail_item['ENDTIME']['ELEMENT']);
            }else if(self.originName == 'order_period'){
                detail_item['ENDTIME']['ELEMENT'] = detail_item['ENDTIME']['ELEMENT'];
            }
        }

        if(detail_item.hasOwnProperty('STOCKSET')
            && detail_item['STOCKSET']
            && detail_item['STOCKSET'].hasOwnProperty('ELEMENT')
        ){
            var stock = (detail_item['STOCKSET']['ELEMENT']);
            var stocks = stock.split(',');
            detail_item['STOCKSET']['ELEMENT'] = $('<div></div>');
            for(var i = 0; i < stocks.length; i++){
                if(i!=0&&i%5==0){
                    detail_item['STOCKSET']['ELEMENT'].append('<br />');
                }
                detail_item['STOCKSET']['ELEMENT'].append(stocks[i]);
                detail_item['STOCKSET']['ELEMENT'].append($("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"));
            }
        }
//--
        detail_item['DEALSTOCK']['ELEMENT'] = detail_item['DEALSTOCK']['ORIGIN'];
        console.log('detail_item',detail_item)
        oojs$.appendTB_item_D2(tb,self.list_benchmark_head,detail_item);
    }

});


var order_detail= new oojs$.com.stock.order_detail();;
oojs$.addEventListener("ready",function(){
    order_detail.init();
});



/**
 * Created by zhouma on 2017/5/19.
 */
this.STOCKCODE = 0;
this.STOCKDOWN = 1;
this.STOCKDATA = 2;

// this.STOCKSCODE = 3;
// this.DOWNLOAD = 4;
// this.STOCKDATA = 5;

var stock = function(){
    this.type = '';
    this.action = '';
    this.data = {};
};





exports.stock = stock;


this.WSS_ORDERTODAY = 'order_today';
this.WSS_ORDERPERIOD = 'order_peroid';
this.WSS_MARKET = 'market';

var entity_wss = function(){
    this.type = '';
    this.action = '';
    this.data = {};
};

exports.entity_wss = entity_wss;


// this.id = null;
// if(this.id == null){
//     this.id = "bean stock";
//     for(var elm in this){
//         console.log(typeof this[elm]);
//     }
// }
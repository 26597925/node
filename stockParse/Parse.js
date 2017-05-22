/**
 * Created by zhouma on 2017/5/15.
 */
const http = require('http');
const util = require('util');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const BufferHelper = require('bufferhelper');

const bean = require(path.join(__dirname,'..','bean','bean_entity'));

//const cheerio = require('cheerio');

//http://hq.sinajs.cn/list=sh601003,sz300104,sh601001,sh601002,sz000002
//http://qt.gtimg.cn/q=sz000858


// 0：”大秦铁路”，股票名字；
// 1：”27.55″，今日开盘价；
// 2：”27.25″，昨日收盘价；
// 3：”26.91″，当前价格；
// 4：”27.55″，今日最高价；
// 5：”26.20″，今日最低价；
// 6：”26.91″，竞买价，即“买一”报价；
// 7：”26.92″，竞卖价，即“卖一”报价；
// 8：”22114263″，成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百；
// 9：”589824680″，成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万；
// 10：”4695″，“买一”申请4695股，即47手；
// 11：”26.91″，“买一”报价；
// 12：”57590″，“买二”
// 13：”26.90″，“买二”
// 14：”14700″，“买三”
// 15：”26.89″，“买三”
// 16：”14300″，“买四”
// 17：”26.88″，“买四”
// 18：”15100″，“买五”
// 19：”26.87″，“买五”
// 20：”3100″，“卖一”申报3100股，即31手；
// 21：”26.92″，“卖一”报价
// (22, 23), (24, 25), (26,27), (28, 29)分别为“卖二”至“卖四的情况”
// 30：”2008-01-11″，日期；
// 31：”15:05:32″，时间；
//{'id':0,'name':'股票名字','value':''}

// 获取盘口分析：
// http://qt.gtimg.cn/q=s_pksz000858
//     v_s_pksz000858="0.196~0.258~0.221~0.325";
// 0: 买盘大单
// 1: 买盘小单
// 2: 卖盘大单
// 3: 卖盘小单
//
// http://qt.gtimg.cn/q=s_sz000858
//     v_s_sz000858="51~五 粮 液~000858~27.78~0.18~0.65~417909~116339~~1054.52";
// 0: 未知
// 1: 名字
// 2: 代码
// 3: 当前价格
// 4: 涨跌
// 5: 涨跌%
// 6: 成交量（手）
// 7: 成交额（万）
// 8:
// 9: 总市值

// var sina_structor = [
//     {'id':0,'name':'股票名字','value':''},
//     {'id':1,'name':'今日开盘价','value':''},
//     {'id':2,'name':'昨日收盘价','value':''},
//     {'id':3,'name':'当前价格','value':''},
//     {'id':4,'name':'今日最高价','value':''},
//     {'id':5,'name':'今日最低价','value':''},
//     {'id':6,'name':'竞买价','value':''},
//     {'id':7,'name':'竞卖价','value':''},
//     {'id':8,'name':'成交的股票数','value':''},
//     {'id':9,'name':'成交金额','value':''},
//     {'id':10,'name':'买一申请4695股','value':''},
//     {'id':11,'name':'买一报价','value':''},
//     {'id':12,'name':'买二','value':''},
//     {'id':13,'name':'买二','value':''},
//     {'id':14,'name':'买三','value':''},
//     {'id':15,'name':'买三','value':''},
//     {'id':16,'name':'买四','value':''},
//     {'id':17,'name':'买四','value':''},
//     {'id':18,'name':'买五','value':''},
//     {'id':19,'name':'买五','value':''},
//     {'id':20,'name':'卖一申报3100股','value':''},
//     {'id':21,'name':'卖一报价','value':''},
//     {'id':22,'name':'卖二','value':''},
//     {'id':23,'name':'卖二','value':''},
//     {'id':24,'name':'卖三','value':''},
//     {'id':25,'name':'卖三','value':''},
//     {'id':26,'name':'卖四','value':''},
//     {'id':27,'name':'卖四','value':''},
//     {'id':28,'name':'卖五','value':''},
//     {'id':29,'name':'卖五','value':''},
//     {'id':30,'name':'日期','value':''},
//     {'id':31,'name':'时间','value':''}
// ];
//以分钟为单位，访问6秒
var tx_structor =[
    //{'id':0,'name':'未知','value':''},
    {'id':1,'name':'名字','value':''},
    {'id':2,'name':'代码','value':''},
    {'id':3,'name':'当前价格','value':''},
    {'id':4,'name':'昨收','value':''},
    //{'id':5,'name':'今开','value':''},
    {'id':6,'name':'成交量(手)','value':''},
    // {'id':7,'name':'外盘','value':''},
    // {'id':8,'name':'内盘','value':''},
    // {'id':9,'name':'买一','value':''},
    // {'id':10,'name':'买一量(手)','value':''},
    // {'id':11,'name':'买二','value':''},
    // {'id':12,'name':'买二量(手)','value':''},
    // {'id':13,'name':'买三','value':''},
    // {'id':14,'name':'买三量(手)','value':''},
    // {'id':15,'name':'买四','value':''},
    // {'id':16,'name':'买四量(手)','value':''},
    // {'id':17,'name':'买五','value':''},
    // {'id':18,'name':'买五量(手)','value':''},
    // {'id':19,'name':'卖一','value':''},
    // {'id':20,'name':'卖一量(手)','value':''},
    // {'id':21,'name':'卖二','value':''},
    // {'id':22,'name':'卖二量(手)','value':''},
    // {'id':23,'name':'卖三','value':''},
    // {'id':24,'name':'卖三量(手)','value':''},
    // {'id':25,'name':'卖四','value':''},
    // {'id':26,'name':'卖四量(手)','value':''},
    // {'id':27,'name':'卖五','value':''},
    // {'id':28,'name':'卖五(手)','value':''},
    // {'id':29,'name':'最近逐笔成交','value':''},
    {'id':30,'name':'时间','value':''},
    {'id':31,'name':'涨跌','value':''},
    {'id':32,'name':'涨跌%','value':''},
    // {'id':33,'name':'最高','value':''},
    // {'id':34,'name':'最低','value':''},
    // {'id':35,'name':'价格/成交量(手)/成交额','value':''},
    {'id':36,'name':'成交量(手)','value':''},
    {'id':37,'name':'成交额(万)','value':''},
    {'id':38,'name':'换手率','value':''},
    // {'id':39,'name':'市盈率','value':''},
    // {'id':40,'name':'','value':''},
    // {'id':41,'name':'最高','value':''},
    // {'id':42,'name':'最低','value':''},
    // {'id':43,'name':'振幅','value':''},
    {'id':44,'name':'流通市值','value':''},
    // {'id':45,'name':'总市值','value':''},
    // {'id':46,'name':'市净率','value':''},
    // {'id':47,'name':'涨停价','value':''},
    // {'id':48,'name':'跌停价','value':''},
    {'id':49,'name':'量比','value':''}

];

var getStockInfo = function(param,callback){
    if(typeof param == 'string'){
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
    };
    var options ={
        hostname: 'qt.gtimg.cn',
        port: 80,
        //path: '/q=sz000001,sz000002,sz000004,sz000005,sz000006,sz000007',
        path: '/q='+param,
        method: 'GET',
        headers: headers
    };

    http.get(options,function(res){
        //console.log(JSON.stringify(res.headers));
        var bufferHelper = new BufferHelper();
        res.on("data",function(chunk){
            bufferHelper.concat(chunk);
        });
        res.on("end",function(){

            if(callback){
                var html = iconv.decode(bufferHelper.toBuffer(),'GBK');//gb2312
                callback(html);

            }

        });
    }).on("error",function(err){
        if(callback){
            callback(null);
        }
        console.log("error>>>",err);
    });
    }
};

this.param = [];

process.on('message', function(msg) {
    switch(msg.type){
        case bean.STOCKCODE:
            this.param = [];
            var count = 0;
            var tmpParam = '';
            var addcomma = false;

            for(var i=0;i<msg.data.length;i++){

                if( !( i==0 || !addcomma) ){
                    tmpParam +=',';
                }

                if(parseInt(msg.data[i].code)>=600000){
                    tmpParam += 'sh'+msg.data[i].code;
                }else{
                    tmpParam += 'sz'+msg.data[i].code;
                }
                addcomma = true;
                count++;
                if(count == 60 || (i+1)==msg.data.length){
                    count = 0;
                    addcomma = false;
                    this.param.push(tmpParam);
                    tmpParam = '';
                }
            }

            //fs.appendFileSync(path.join(__dirname,'..','other','path.txt'),process.env.id+": \n"+JSON.stringify(this.param)+"\n\n" );
            //console.log('parse code', process.env.id,this.param.length);
            break;
        case bean.STOCKDOWN:
            var time =  msg.data.timestamp;
            //console.log('parse code',process.env.id,this.param.substr(0,20));
            var count = this.param.length;

            var self = this;
            var intervalId = setInterval(function(self){
                --count;
                if(count<0){
                    //console.log('parse clear ',time);
                    clearInterval(intervalId);
                    return;
                }
                //console.log('prase count', count,self.param[count].substr(0,20) );
                new getStockInfo(self.param[count],function(){
                    if(arguments[0]){
                        new parseStocks( time, arguments[0] );
                        //console.log('parse get data:',time, arguments[0].substr(0,50) );
                    }else{
                        new parseStocksNull( time );
                        console.log('parse get data:',time, 'error');
                    }
                });

            },50,self);
            break;

    }
});
//v_sz300104="51~乐视网~300104~0.00~30.68~0.00~0~0~0~0.00~0~0.00~0~0.00~0~0.00~0~0.00~0~0.00~0~0.00~0~0.00~0~0.00~0~0.00~0~~20170517150133~0.00~0.00~0.00~0.00~0.00/0/0~0~0~0.00~108.35~S~0.00~0.00~0.00~390.38~611.98~0.00~33.75~27.61~0.00";
var self = this;
var parseStocks = function(timestamp,data){

    var lines = data.split("\n");
    var reg = /^v_(.*)=/g;
    var reg2 = /\"(.*)\"/g;
    var fields = [];
    var field_eq1 ='';
    var field_eq2 ='';
    var param = [];
    var sendDate = new bean.stock();
    sendDate.type = bean.STOCKDATA;
    sendDate.action = process.env.id;
    sendDate.data[timestamp] = [];
    var item = {};

    for(var i = 0; i < lines.length ; i++){
        if(lines[i].length>3){
            fields = lines[i].split('=');
            field_eq1 = fields[0];
            try{
            field_eq2 = fields[1]
                .replace(';','')
                .replace(/\"/g,"");

            param = field_eq2.split('~');
            item = {};
            for(var j = 0; j < tx_structor.length; j++){
                item[tx_structor[j].name] = param[tx_structor[j].id];
            }
            sendDate.data[timestamp].push(item);
            }catch(err){
                console.log("lines",lines[i],self.param,process.env.id);
            }
        }
    }

    process.send(sendDate);
    timestamp=null;
    data=null;
};


var parseStocksNull = function( timestamp ){
    var sendDate = new bean.stock();
    sendDate.type = bean.STOCKDATA;
    sendDate.action = process.env.id;
    sendDate.data[timestamp] = [];
    process.send(sendDate);
};

//process.send({'type':"timely_share",'value':'aaaa'});
//console.log('child',process.env);

// if(process && process.env && process.env.hasOwnProperty('id') && process.env.id == 0){
//     process.exit();
// }


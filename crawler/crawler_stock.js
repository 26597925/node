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
const descrip = require(path.join(__dirname,'..','bean','des_stock'));
//const cheerio = require('cheerio');


//以分钟为单位，访问6秒

var getStockInfo = function(param,callback){
	
	if(typeof param == 'string'){
	var headers = {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
	};
	//http:qt.gtimg.cn/q=sz000001,sz000002,sz000004,sz000005,sz000006,sz000007
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
		console.log("error>>>",'/q='+param,err);
	});
	}
};

this.param = [];

process.on('message', function(msg) {
	// console.log('parse code STOCKCODE', process.env.id);
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

			break;
		case bean.STOCKDOWN:

			var time =  msg.data.timestamp;
			//console.log('parse code',process.env.id,this.param.substr(0,20));
			var count = this.param.length;

			var self = this;
			var intervalId = setInterval(function(self){
				--count;
				if(count<0){

					clearInterval(intervalId);
					return;
				}
				//console.log('stock url ', process.env.id, count, self.param[count] );
				new getStockInfo(self.param[count],function(){
					if(arguments[0]){
						new parseStocks( time, arguments[0] );
					}else{
						new parseStocksNull( time );
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
	sendDate.data[timestamp] = {};

	var stockID = '';
	try{
		for(var i = 0; i < lines.length ; i++){
			if(lines[i].length>3){
				fields = lines[i].split('=');
				field_eq1 = fields[0];

				field_eq2 = fields[1]
					.replace(';','')
					.replace(/\"/g,"");

				param = field_eq2.split('~');

				stockID = param[2];//股票代码

				sendDate.data[timestamp][stockID] = [];
				for(var j = 0; j < descrip.tx_structor.length; j++){
					sendDate.data[timestamp][stockID].push(param[descrip.tx_structor[j].id]);
				}
			}
		}
	}catch(err){
		console.log("lines",lines[i],self.param,process.env.id);
	}

	process.send(sendDate);
	timestamp=null;
	data=null;
};

var parseOntimeStocks = function( data ){
	if(null == data){return null}
	var lines = data.split("\n");
	var reg = /^v_(.*)=/g;
	var reg2 = /\"(.*)\"/g;
	var fields = [];
	var field_eq1 ='';
	var field_eq2 ='';
	var param = [];
	var result = {};
	var stockID = '';
	try{
		for(var i = 0; i < lines.length ; i++){
			if(lines[i].length>3){
				fields = lines[i].split('=');
				field_eq1 = fields[0];
				
				field_eq2 = fields[1]
					.replace(';','')
					.replace(/\"/g,"");
				
				param = field_eq2.split('~');
				stockID = param[2];//股票代码
				result[stockID] = [];
				
				for(var j = 0; j < descrip.tx_structor_ontime.length; j++){
					result[stockID].push(param[descrip.tx_structor_ontime[j].id]);
				}
			}
		}
	}catch(err){
		console.log("crawler parseOntimeStocks parse lines err");
	}
	
	return result;
};

var parseStocksNull = function( timestamp ){
	var sendDate = new bean.stock();
	sendDate.type = bean.STOCKDATA;
	sendDate.action = process.env.id;
	sendDate.data[timestamp] = {};
	process.send(sendDate);
};

var addPrefix = function(data){
	var count = 0;
	var tmpParam = '';
	var addcomma = false;
	for(var i=0;i<data.length;i++){
		
		if( !( i==0 || !addcomma) ){
			tmpParam +=',';
		}
		
		if(parseInt(data[i])>=600000){
			tmpParam += 'sh'+data[i];
		}else{
			tmpParam += 'sz'+data[i];
		}
		
		addcomma = true;
		count++;
		
		if(count == 60 || (i+1) == data.length){
			count = 0;
			addcomma = false;
		}
	}
	
	return tmpParam;
};


//start 每天9点15，更新爬虫记录
var intervalId = null;
var startEverydayDrawler = function(){
	if(null == intervalId){
		setInterval(function(){
		
		},200);
	}
};

exports.parseOntimeStocks = parseOntimeStocks;
exports.getStockInfo = getStockInfo;
exports.addPrefix = addPrefix;

//process.send({'type':"timely_share",'value':'aaaa'});
//console.log('child',process.env);

// if(process && process.env && process.env.hasOwnProperty('id') && process.env.id == 0){
//	 process.exit();
// }


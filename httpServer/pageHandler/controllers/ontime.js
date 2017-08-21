const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const policy = require('./policy.js');
const user_account = require('./user_account.js');
const cfg_httpserver = require(path.join(__dirname, "..", "..", "..", "Config_HttpServer.js"));
const descrip = require(path.join(__dirname, "..", "..", "..", 'bean','des_stock.js'));
const crawler = require(path.join(__dirname, "..", "..", "..", 'crawler','crawler_stock.js'));

this.title_stock = descrip.tx_title_ontime();
var ontime = this;

exports.ontime_send = function(){
	this.alias = path.basename(__filename);
	var self = this;
	var result = {'success':true,'data':''};
	
};

exports.ontime_getStock = function(){
	var self = this;
	//console.log(self.alias)
	self.alias = path.basename(__filename);
	
	var result = {'success':true,'data':''};
	var stocks = self.req.post.stocks;
	stocks = crawler.addPrefix(stocks);
	crawler.getStockInfo(stocks,function(result_back){
		if(result_back==null){
			result = {'success':false,'message':path.basename(__filename).replace('.js','')+' 请求失败，重新加载'};
			self.responseDirect(200,"text/json",JSON.stringify(result));
		}else{
			result.data = {
				'stocks':crawler.parseOntimeStocks(result_back),
				'title':ontime.title_stock
			};
			self.responseDirect(200,"text/json",JSON.stringify(result));
		}
	});
};


var http_post=function(){
	var result = JSON.stringify(arguments[0]) ;
	result = result.replace("\\","");
	
	console.log(unit_date.getTime(), path.basename(__filename), "http_post", result);
	var options = {};
	
	for(var elm in cfg_httpserver.order){
		options[elm] = cfg_httpserver.order[elm];
	}
	
	options.path = options.path+"?rdm="+Math.ceil(Math.random()*10000);
	
	console.log(unit_date.getTime(), path.basename(__filename), "http_post", options);
	
	var req = http.request(options, function(res) {
		console.log(unit_date.getTime(),'Status: ' + res.statusCode);
		console.log(unit_date.getTime(),'Headers: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (body) {
			console.log(unit_date.getTime(),'Body: ' + body);
		});
	});
	
	req.on('error', function(e) {
		console.log(unit_date.getTime(),'problem with request: ' + e.message);
	});
	
	req.write(result);
	req.end();
};

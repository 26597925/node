var path = require("path");
var schedule = require("node-schedule");
var config = require(path.join(__dirname,"config.js"));
var insertES = require(path.join(__dirname,"es","insertES.js"));
var http_get = require(path.join(__dirname,"httprequest","http_get.js"));

exports.main = function(){
	this._delegate_can_run = true;
	this._stock_can_run = false;

	if(!this.init){
		this.init = function(){
			http_get.delegateType.offsetday = insertES.insertES_delegateType.offsetday = 1;
			http_get.stock.offsetday = insertES.insertES_stock.offsetday = 1;
			console.log(path.basename(__filename),"main","init")
		}
		this.init();
	}

	this.http_get_result=function(result,param,callback){
		insertES.insertES_delegateType.insertdata(result,param,callback);
	}

	this.http_get_result_stock=function(result,param,callback){
		insertES.insertES_stock.insertdata(result,param,callback);
	}


	if(this._delegate_can_run){
		http_get.delegateType.main(this.http_get_result);
	}
	
	if(this._stock_can_run){
		http_get.stock.main(this.http_get_result_stock);
	}
	
}

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 0;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){
　　　this.main();
});

// var localip = require('local-ip');
// var interface = 'wlan0';
 
// localip(interface, function(err, res) {
//   if (err) {
//     throw new Error('I have no idea what my local ip is.');
//   }
//   console.log('My local ip address on ' + interface + ' is ' + res);
// });

this.main();
// this.main();
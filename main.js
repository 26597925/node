var path = require("path");
var schedule = require("node-schedule");
var config = require(path.join(__dirname,"config.js"));
var insertES = require(path.join(__dirname,"es","insertES.js"));
var http_get = require(path.join(__dirname,"httprequest","http_get.js"));
var unit_date = require(path.join(__dirname,"js_unit","unit_date.js"));

exports.main = function(){
	this._delegate_can_run = false;
	this._stock_can_run = false;

	if(!this.init){
		this.init = function(){
			http_get.delegateType.offsetday = insertES.insertES_delegateType.offsetday = 1;
			http_get.stock.offsetday = insertES.insertES_stock.offsetday = 0;
			console.log(path.basename(__filename),"main","init")
		}
		this.init();
	}

	this.http_get_result=function(result,param,callback){
		insertES.insertES_delegateType.insertdata(result,param,callback);
	}

	this.http_get_result_stock=function(result){
		insertES.insertES_stock.insertdata(result);
	}


	if(this._delegate_can_run){
		http_get.delegateType.main(this.http_get_result);
	}
	
	// if(this._stock_can_run){
	// 	http_get.stock.main(this.http_get_result_stock);
	// }

	
}

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 0;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){
// 　　　this.main();
	console.log("test");
});

// var localip = require('local-ip');
// var interface = 'wlan0';
 
// localip(interface, function(err, res) {
//   if (err) {
//     throw new Error('I have no idea what my local ip is.');
//   }
//   console.log('My local ip address on ' + interface + ' is ' + res);
// });

// this.main();

// http://10.130.211.60:8001/stock_data/2016-11-10-00.data
// var index = 0;
// <html>
// <head><title>404 Not Found</title></head>
// <body bgcolor="white">
// <center><h1>404 Not Found</h1></center>
// <hr><center>nginx/1.0.15</center>
// </body>
// </html>


var offsetday = 0; // start 2016-09-01 2017-03-12
var subOffday = 0; // 0-47
var date = new Date("2016-09-01 00:00:00");
var date2 = new Date("2017-03-12 00:00:00");


var addNewDate = function(){
	var pre = '';
	if(subOffday<48){
		pre = unit_date.Format(date,"yyyy-MM-dd")
			+"-"
			+(subOffday<=9?("0"+subOffday):subOffday);
	}else{
		pre = unit_date.Format(date,"yyyy-MM-dd");
	}
	
	subOffday++;
	if(subOffday == 49){
		subOffday = 0;
		offsetday++;
		console.log(offsetday);
		date.setDate(date.getDate()+1);
	}

	if(date.getTime() - date2.getTime()>0){
		return null;
	}

	return "http://10.130.211.60:8001/stock_data/"+pre+".data";
}

// var callnext = function(id){
// 	if(judge && getindex - id == 0 ){
// 		insertES.insertES_stock.insertIndex = 0;
// 	}
// }

var getindex = 0;
var esindex = 0;
var judge = false;

insertES.insertES_stock.insertdataOk = function(id){

	if(judge && id == getindex){
		console.log(path.basename(__filename),"index",getindex);
		judge = false;
		insertES.insertES_stock.insertIndex = 0;
		readline(addNewDate());
	}
}

var readline = function(url){
	if(!url){
		return;
	}
	
	config.main.info("readline:",subOffday,offsetday,url);
	console.log("readline:",subOffday,offsetday,url);

	http_get.request_readline(url,function(result){
		if(result.indexOf("readline >> close") == 0){
			console.log(path.basename(__filename),">>","readline >> close");
			getindex = 0;
			esindex = 0;
			judge = true;
			// readline(addNewDate());
			// insertES.insertES_stock.totalIndex = getindex;
		}else{
			getindex++;
			insertES.insertES_stock.insertdata(result);
		}

	});
}


readline(addNewDate());

var path = require("path");
var schedule = require("node-schedule");
var config = require(path.join(__dirname,"config.js"));
var insertES = require(path.join(__dirname,"es","insertES_readline.js"));
var http_get = require(path.join(__dirname,"httprequest","http_get.js"));
var unit_date = require(path.join(__dirname,"js_unit","unit_date.js"));

var main = function(){
	var _self = this;
	_self.offsetday = 0; // start 2016-09-01 2017-03-12
	_self.subOffday = 0; // 0-47
	_self.date = new  Date("2016-09-01 00:00:00");
	// _self.date = new  Date("2016-12-01 00:00:00");
	_self.date2 = new Date("2017-03-12 00:00:00");
	_self.getindex = 0;
	_self.esindex = 0;
	_self.judge = false;
	
	_self.addNewdate = function(){
		debugger;
		var pre = unit_date.Format(_self.date,"yyyy-MM-dd");
		if(_self.subOffday<48){
			pre = pre
				+"-"
				+(_self.subOffday<=9?("0"+_self.subOffday):_self.subOffday);
		}
		
		_self.subOffday++;
		if(_self.subOffday == 49){
			_self.subOffday = 0;
			_self.offsetday++;
			_self.date.setDate(_self.date.getDate()+1);
		}

		if(_self.date.getTime() - _self.date2.getTime()>0){
			return null;
		}

		return "http://10.130.211.60:8001/stock_data/"+pre+".data";
	}


	_self.insertdataOk = function(){
		
		if(_self.judge && _self.esindex == _self.getindex){
			
			_self.judge = false;
			_self.getindex = 0;
			_self.esindex = 0;
			_self.readline(_self.addNewdate(),unit_date.Format(_self.date,"yyyy-MM-dd"));
		}
	}

	_self.readline = function(url,param2){
		if(!url){
			return;
		}
		debugger;
		config.main.info("readline:",_self.subOffday,_self.offsetday,url);
		console.log("readline:",_self.subOffday,_self.offsetday,url);

		http_get.request_readline(url,function(result){
			if(result.indexOf("readline >> close") == 0){
				debugger;
				console.log(path.basename(__filename),">>","readline >> close");
				_self.getindex = 0;
				_self.esindex = 0;
				_self.judge = true;
				_self.insertdataOk();
				
			}else{
				_self.getindex++;

				insertES.insertES_stock.insertdata(result,param2);
			}

		});
	}
	_self.readline(_self.addNewdate(),unit_date.Format(_self.date,"yyyy-MM-dd"));
}

exports.main = new main();


var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 0;
rule.minute = 0;

var j = schedule.scheduleJob(rule, function(){
// 　　　this.main();
	console.log(">>>");
});

var http = require('http');
var url = require('url');
//exports MD----------------------------------------------
function http_get_request_MD(){
	
	//declear----------------------------------------------
	var self = this;
	self.offsetday = 6;//偏移的天数
	self.iterate_id = 0;
	self.iterate_list = [];
	//date format----------------------------------------------
	Date.prototype.Format = function(fmt) { // author: meizz
		var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
		// 毫秒
		};
		if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
		.substr(4 - RegExp.$1.length));
		for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt))
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
		: (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return fmt;
	}

	//function----------------------------------------------

	self.request_one_url = function(url,callback){
		
		http.get(url,function(res){
			// console.log("Got response: " + res.statusCode);
	  		// console.log('HEADERS: ' + JSON.stringify(res.headers));
			var result="";
			res.setEncoding("utf8");
			res.on("data",function(chunk){
				result += chunk;
			});
			res.on("end",function(){
				callback(result,res.headers);
			});
		}).on("error",function(err){
			callback("error>>>"+err.message);
		})
	}
	
	self.iterate_callback = function(result){
		if(result.indexOf("error>>>")==0){

		}else{
			console.log(result.split("\n")[0].substr(0,200));
		}

		self.iterate_id++;
		if(self.iterate_id==2){
			return 0;
		}else{
			self.iterate_request_list()
		}
	}

	self.rebuildurl=function(param){
		var parse_suffix = param.split("\t")[0];
		var date = new Date();
		date.setDate(date.getDate()-self.offsetday);
		var yMd =date.Format("yyyy-MM-dd");
		//http://106.39.244.172:443/2017-02-20-000001
		console.log("http://106.39.244.172:443/"+yMd+"-"+parse_suffix);
		return "http://106.39.244.172:443/"+yMd+"-"+parse_suffix;
	}
	
	self.iterate_request_list=function(){
		self.request_one_url(self.rebuildurl( self.iterate_list[self.iterate_id]),self.iterate_callback);		
	}

	self.main=function(){
		self.request_one_url("http://111.206.211.60/code.txt",function(result){
			if(result.indexOf("error>>>")==0){
			}else{
				self.iterate_list = result.split("\n");
				self.iterate_request_list();
			}
		})
	}

	self.test=function(){
		// var date = new Date("2016-1-1");
		var date = new Date();
		date.setDate(date.getDate()-1);
		var yMd =date.Format("yyyy-MM-dd");
		console.log(yMd);
	}

	self.test2=function(){
		// self.request_one_url("http://111.206.211.60/code.txt",function(result){
		// 	console.log(result.substring(20000,20200));
		// })
		// self.request_one_url("http://106.39.244.172:443/2017-02-20-300566",function(result){
		// 	console.log(result.substring(0,100));
		// })
		self.request_one_url("http://106.39.244.172:443/2017-02-20-600000",function(result,head){
			if(result.indexOf("404 Not Found")>=0){
				console.log("not found");
			}
		})
	}
}

exports.http_get_request_MD = http_get_request_MD;

//test---------------------------------

var http_requestJS = require('./httprequest.js');
var http_request =new http_requestJS.http_get_request_MD();
// http_request.test();
http_request.test2();
// http_request.main();
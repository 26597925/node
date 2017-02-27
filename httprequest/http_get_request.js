var http = require('http');
var url = require('url');
var log4js = require('log4js');
var unit_date = require("./../js_unit/unit_date.js");
var config = require("./../config.js");
//exports MD----------------------------------------------
var http_get_request=function (){
	var logger = log4js.getLogger("httprequest");
	logger.info("aaaaa");
	//declear----------------------------------------------
	var self = this;
	self.offsetday = 0;//偏移的天数
	self.iterate_id = 0;
	self.iterate_list = [];
	self.g_callback = null;
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
				callback(result,url);
			});
		}).on("error",function(err){
			callback("error>>>"+err.message,url);
		})
	}
	
	self.iterate_callback = function(result,url){
		if(result.indexOf("error>>>")==0){
			config.httprequest.error(url+"\n"+result);
		}if(result.indexOf("404 Not Found")>=0){
			config.httprequest.error(url+"\n"+"404 Not Found");
		} else{
			if(self.g_callback){
				self.g_callback(result);
			}
		}

		self.iterate_id++;
		if(self.iterate_id==2){
			return 0;
		}else{
			self.iterate_request_list();
		}
	}

	self.rebuildurl=function(param){
		var parse_suffix = param.split("\t")[0];
		var date = new Date();
		date.setDate(date.getDate()-self.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		//http://106.39.244.172:443/2017-02-20-000001
		console.log("http://106.39.244.172:443/"+yMd+"-"+parse_suffix);
		return "http://106.39.244.172:443/"+yMd+"-"+parse_suffix;
	}
	
	self.iterate_request_list=function(){
		self.request_one_url(self.rebuildurl( self.iterate_list[self.iterate_id]),self.iterate_callback);		
	}

	self.main=function(callback){
		self.g_callback = callback;
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
		self.rebuildurl("aa");
		
	}

	self.test2=function(callback){
		// self.request_one_url("http://111.206.211.60/code.txt",function(result){
		// 	console.log(result.substring(20000,20200));
		// })
		self.request_one_url("http://106.39.244.172:443/2017-02-20-300566",function(result){
			callback(result);
			// console.log(result.substring(0,100));
		})
		// self.request_one_url("http://106.39.244.172:443/2017-02-20-600000",function(result,head){
		// 	if(result.indexOf("404 Not Found")>=0){
		// 		console.log("not found");
		// 	}
		// })
	}
}
module.exports = new http_get_request();

//test---------------------------------
// var http_requestJS = require('./httprequest.js');
// var http_request =new http_requestJS.http_get_request_MD();
// http_request.test();
// http_request.test2();
// http_request.main();

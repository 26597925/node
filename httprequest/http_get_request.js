var http = require('http');
var url = require('url');
var log4js = require('log4js');
var unit_date = require("./../js_unit/unit_date.js");
var unit_string = require("./../js_unit/unit_string.js");
var config = require("./../config.js");
//exports MD----------------------------------------------
var http_get_request=function (){
	//declear----------------------------------------------
	var self = this;
	self.offsetday = 1;//偏移的天数,0为今天，1为昨天
	self.iterate_id = 0;
	self.iterate_list = [];
	self.g_callback = null;
	//function----------------------------------------------
	self.request_one_url = function(url,callback,param){

		if( (unit_string.trim(url)).length < 4 ){
			callback("error>>>"+err.message,url);
		}else{
			config.httprequest.info("url:",url);
			console.log("url:",url);
			http.get(url,function(res){
				// console.log("Got response: " + res.statusCode);
		  		// console.log('HEADERS: ' + JSON.stringify(res.headers));
				var result="";
				res.setEncoding("utf8");
				res.on("data",function(chunk){
					result += chunk;
				});
				res.on("end",function(){
					if(param){
						callback(result,url,param);
					}else{
						callback(result,url);
					}
					
				});
			}).on("error",function(err){
				callback("error>>>"+JSON.stringify(err.message),url);
			})
		}
	}
	
	self.iterate_callback = function(result,url,param){
		if(result.indexOf("error>>>")==0){
			config.httprequest.error(url+"\n"+result);
			self.callNextUrl();
		}if(result.indexOf("404 Not Found")>=0){
			config.httprequest.error(url+"\n"+"404 Not Found");
			self.callNextUrl();
		} else{
			if(self.g_callback){
				self.g_callback(result,param,self.callNextUrl);
			}
		}
	}

	self.callNextUrl = function(){
		self.iterate_id++;
		if(self.iterate_id　>= self.iterate_list.length){
			config.httprequest.info("\n>>>>>>>>>>>>>>>>>>over\n");
			
		}else{
			self.iterate_request_list();
		}
	}

	self.rebuildurl=function(){
		var parse_suffix;
		// debugger;
		while(self.iterate_id < self.iterate_list.length)
		{
			parse_suffix = self.iterate_list[self.iterate_id].split("\t")[0];
			if(parse_suffix.indexOf("6")==0){
				self.iterate_id++;
				continue;
			}else{
				break;
			}
		}
		
		var date = new Date();
		date.setDate(date.getDate()-self.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		//http://106.39.244.172:443/2017-02-20-000001

		// console.log("http://106.39.244.172:443/"+yMd+"-"+parse_suffix);
		return {url:"http://106.39.244.172:443/"+yMd+"-"+parse_suffix,name:parse_suffix};
	}
	
	self.iterate_request_list=function(){
		var urlparse = self.rebuildurl( );
		if(urlparse && urlparse.url){
			
			self.request_one_url(urlparse.url,self.iterate_callback,urlparse.name);
		}
	}

	self.init=function(){
		self.iterate_id = 0;
		self.iterate_list = [];
		self.g_callback = null;
	}

	self.main=function(callback){
		config.httprequest.info("\n>>>>>>>>>>>>>>>>>>main\n");
		self.init();
		self.g_callback = callback;
		
		self.request_one_url("http://111.206.211.60/code.txt",function(result){
			if(result.indexOf("error>>>")==0){
				config.httprequest.error("http://111.206.211.60/code.txt+\n"+result);
			}else{
				self.iterate_list = result.split("\n");
				self.iterate_request_list();
			}
		})
	}

	self.test=function(){
		// var date = new Date("2016-1-1");
		var date = new Date();
		date.setDate(date.getDate()-self.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		console.log(yMd);
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
// var http_request = require('./http_get_request.js');
// http_request.test();
// http_request.test2();
// http_request.main();

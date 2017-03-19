var readline = require("readline");
var http = require('http');
var url = require('url');
var path = require("path");
var unit_date = require(path.join(__dirname,"..","js_unit","unit_date.js"));
var unit_string = require(path.join(__dirname,"..","js_unit","unit_string.js"));
var config = require(path.join(__dirname,"..","config.js"));


exports.request_readline = function (url,callback){
	// this.objReadline = null;
	var _myself = this;
	http.get(url,function(res){
		res.setEncoding("utf8");
		_myself.objReadline = readline.createInterface({  
		    input: res,
		    output: null
		});

		_myself.objReadline.on('line', (line)=>{
			debugger;
			_myself.objReadline.pause();
			callback(line);
		});  

		_myself.objReadline.on('close', ()=>{ 
			callback("readline >> close"); 
		}); 
	});
}

var request_one_url = function(url,callback,param){
	
	var self = this
		,result = ""
		,dataLen = 0
		,countNum = 0
		,i = 0;
	
	if( (unit_string.trim(url)).length < 4 ){
		callback("error>>>"+err.message,url);
	}else{
		config.httprequest.info("url:",url);
		http.get(url,function(res){
			// console.log("Got response: " + res.statusCode);
	  		// console.log('HEADERS: ' + JSON.stringify(res.headers));
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

var delegateType = function(){
	var self = this;
	self.offsetday = 0;//偏移的天数,0为今天，1为昨天
	self.iterate_id = 0;
	self.iterate_list = [];
	self.g_callback = null;

	self.init=function(){
		self.iterate_id = 0;
		self.iterate_list = [];
		self.g_callback = null;
	}

	self.main=function(callback){
		config.httprequest.info( "\n>>>>>>>>>>>>>>>>>>main"+unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss") );
		self.init();
		self.g_callback = callback;
		
		request_one_url("http://111.206.211.60/code.txt",function(result){
			if(result.indexOf("error>>>")==0){
				config.httprequest.error("http://111.206.211.60/code.txt+\n"+result);
			}else{
				self.iterate_list = result.split("\n");
				self.iterate_request_list();
				
			}
		})
	}
	
	self.callNextUrl = function(){
		self.iterate_id++;
		if(self.iterate_id　>= self.iterate_list.length){
			config.httprequest.info("\n>>>>>>>>>>>>>>>>>>over",unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss"));
		}else{
			self.iterate_request_list();
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
				// console.log(path.basename(__filename),"iterate_callback",url);
				self.g_callback(result,param,self.callNextUrl);
			}
		}
	}

	self.iterate_request_list=function(){
		var urlparse = self.rebuildurl( );
		
		if(urlparse && urlparse.url){
			request_one_url(urlparse.url,self.iterate_callback,urlparse.name);
		}
	}

	self.rebuildurl=function(){
		var parse_suffix;
		
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
		return {url:"http://106.39.244.172:443/"+yMd+"-"+parse_suffix,name:parse_suffix};
	}

	self.test=function(){
		// var date = new Date("2016-1-1");
		var date = new Date();
		date.setDate(date.getDate()-self.offsetday);
		var yMd =unit_date.Format(date,"yyyy-MM-dd");
		
		console.log(path.basename(__filename),"test",yMd);
		
		return "test";
	}

}

var stock = function(){
	var self = this;
	// self.offsetday = 0;//偏移的天数,0为今天，1为昨天
	// self.iterate_id = 0;
	// self.iterate_list = [];
	// self.g_callback = null;

	// self.init=function(){
	// 	self.iterate_id = 0;
	// 	self.iterate_list = [];
	// 	self.g_callback = null;
	// }

	// self.main=function(callback){
	// 	config.httprequest.info( "\n>>>>>>>>>>>>>>>>>>main",unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss") );
	// 	self.init();
	// 	self.g_callback = callback;
		
	// 	request_one_url("http://10.130.211.60:8001/stock_data/file.list",function(result){
	// 		if(result.indexOf("error>>>")>=0){
	// 			config.httprequest.error("http://10.130.211.60:8001/stock_data/file.list\n"+result);
	// 		}else{
	// 			self.iterate_list = result.split("\n");
	// 			// console.log(path.basename(__filename),"main",result.substring(0,200));
	// 			self.iterate_request_list();
				
	// 		}
	// 	},null,false)
	// }

	// self.rebuildurl=function(){
	// 	var parse_suffix;
	// 	// var date = new Date();
	// 	// date.setDate(date.getDate()-self.offsetday);
	// 	// var yMd =unit_date.Format(date,"yyyy-MM-dd");
	// 	//"http://10.130.211.60:8001/stock_data/$file"
	// 	return {url:"http://10.130.211.60:8001/stock_data/"+self.iterate_list[self.iterate_id],name:self.iterate_list[self.iterate_id]};
	// }

	// self.callNextUrl = function(){
	// 	debugger;
	// 	self.iterate_id++;
	// 	if(self.iterate_id　>= self.iterate_list.length){
	// 		config.httprequest.info("\n>>>>>>>>>>>>>>>>>>over",unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss"));
	// 	}else{
	// 		self.iterate_request_list();
	// 	}
	// }

	// self.iterate_callback = function(result,url,yMd){
		
	// 	if(result.indexOf("error>>>")==0){
	// 		config.httprequest.error(url+"\n"+result);
	// 		self.callNextUrl();
	// 	}else if(result.indexOf("404 Not Found")>=0){
	// 		config.httprequest.error(url+"\n"+"404 Not Found");
	// 		self.callNextUrl();
	// 	}else if(result.indexOf("readline >> close")>=0){
	// 		self.callNextUrl();
	// 	}else{
	// 		if(self.g_callback){
	// 			self.g_callback(result,yMd);
	// 		}
	// 	}
	// }

	// self.iterate_request_list=function(){
	// 	var urlparse = self.rebuildurl( );
	// 	if(urlparse && urlparse.url){
	// 		request_readline(urlparse.url,self.iterate_callback);
	// 	}
	// }

	self.test = function(){
		self.g_callback = function(){
			console.log("g_callback: "+arguments.length+" "+arguments[0]);
			arguments[2]("test");
		}
		self.iterate_callback("1","1","1");
		self.iterate_callback("2","2","2");
		self.iterate_callback("3","3","3","end");

		// var date = new Date("2016-1-1");
		// var date = new Date();
		// date.setDate(date.getDate()-self.offsetday);
		// var yMd =unit_date.Format(date,"yyyy-MM-dd");
		// console.log(path.basename(__filename),yMd);
		return "test";
	}
	// self.test();
}

exports.delegateType = new delegateType();
exports.stock = new stock();

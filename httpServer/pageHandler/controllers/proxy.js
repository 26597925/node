const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
//const localIP = require(path.join(__dirname,"..","..","..",'localIP'));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const cfg_httpserver = require(path.join(__dirname, "..", "..", "..", "Config_HttpServer.js"));
const mail = require(path.join(__dirname,  "..", "..", "mailer.js"));
const localIP = require(path.join(__dirname,"..", "..", "..", 'localIP'));

var ip = localIP.localIP;
var stock_load = false;

exports.stocks = function(){
	var self = this;
	var uID = sessions.get_uID(self.req);
	var result = {'success':true,'data':''};

	var stocks = self.getStocks();

    if(stock_load){
      result = {'success':false,'data':''};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }

	if(stocks.data == null){
    //request
    proxy_stock(function(_result){
      if(_result != null){
        self.setStocks(_result);
        result.data = _result;
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }else{
        result.data = [];
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }
    });
  }else if(unit_date.Format(stocks.date,"yyyy-MM-dd") != unit_date.Format(new Date(),"yyyy-MM-dd")){
	    //request
    proxy_stock(function(_result){
      if(_result != null){
        self.setStocks(_result);
        result.data = _result;
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }else{
        result.data = [];
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }
    });
  }else{
    // self.stocks.data;
    result.data = stocks.data;
    self.responseDirect(200,"text/json",JSON.stringify(result));
  }
};


exports.capital = function(){
  var self = this;
  var uID = sessions.get_uID(self.req);
  var result = {'success':true,'data':''};
  
  if(self.req.post){
    proxy_capitals(self.req.post, function(){
      if(arguments.length ==1){
        result.data = arguments[0];
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }else{
	      
        result.message = "请求失败 code：001 proxy";
        result.success = false;
        self.responseDirect(200,"text/json",JSON.stringify(result));
        
      }

    });
    
  }else{
      result.message = "请求失败 code：003 proxy";
      result.success = false;
      self.responseDirect(200,"text/json",JSON.stringify(result));
  }

};

var proxy_stock = function(callback){
  stock_load = true;
  var url = cfg_httpserver.stockServer.url+"?rdm="+Math.ceil(Math.random()*10000);
  console.log(unit_date.getTime(),"proxy proxy_stock",url);
  http.get(url,function(res){
    // console.log(unit_date.getTime(),"content-type",res.headers['content-type'] );
    var result="";
    res.setEncoding("utf8");
    res.on("data",function(chunk){
      result += chunk;
    });
    res.on("end",function(){
      stock_load = false;
      if(callback){
        callback(result);
      }
    });
  }).on("error",function(err){
	  if( String(ip) == cfg_httpserver.ip ){
		  mail.ServerError('mazhou_654452588@qq.com', cfg_httpserver.stockServer.url+'</ br>');
	  }
    if(callback){
      callback(null);
    }
    stock_load = false;
    console.log(unit_date.getTime(),"error>>>",err);
  })
};



var proxy_capitals = function(sendData,callback){
  var result = JSON.stringify(sendData) ;
  console.log(unit_date.getTime(), path.basename(__filename), "http_post",JSON.stringify( result) ) ;
	
	var options = {};
	
	for(var elm in cfg_httpserver.capitals){
		options[elm] = cfg_httpserver.capitals[elm];
	}
	var my_path = options.path;
	options.path = options.path+"?rdm="+Math.ceil(Math.random()*10000);
	
	console.log(unit_date.getTime(), path.basename(__filename), "proxy_capitals http_post", options);
	
	var req = http.request(options, function(res) {
  // var req = http.request(cfg_httpserver.capitals, function(res) {
    console.log(unit_date.getTime(),'proxy_capitals Status: ' + res.statusCode);
    //console.log(unit_date.getTime(),'Headers: ' + JSON.stringify(res.headers));
    if(res.statusCode == 200){
	    res.setEncoding('utf8');
	    res.on('data', function (body) {
		    console.log(unit_date.getTime(),'Body: ', body,typeof body);
		    if(callback){
			    callback( body);
		    }
	    });
    }else{
	    if( String(ip) == cfg_httpserver.ip ){
		    options.path = my_path;
		    console.log("mail",String(res.statusCode)+' </ br>'+JSON.stringify(options)+'</ br>'+result);
	      mail.ServerError('mazhou_654452588@qq.com', String(res.statusCode)+' </ br>'+JSON.stringify(options)+'</ br>'+result);
	    }
	    if(callback){
		    callback();
	    }
    }
  });


  req.on('error', function(e) {
    console.log(unit_date.getTime(),'problem with request: ' + e.message);//problem with request: Parse Error
    if(e.message!='Parse Error' ){
      if(callback){
        callback();
      }
    }
	    
  });

  req.write(result);
  req.end();
};
//web server used
exports.stock_load = proxy_stock;
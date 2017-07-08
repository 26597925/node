const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
//const localIP = require(path.join(__dirname,"..","..","..",'localIP'));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const cfg_httpserver = require(path.join(__dirname, "..", "..", "..", "Config_HttpServer.js"));

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
  var url = cfg_httpserver.stockServer.url;
  console.log("proxy proxy_stock",url);
  http.get(url,function(res){
    // console.log("content-type",res.headers['content-type'] );
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
    if(callback){
      callback(null);
    }
    stock_load = false;
    console.log("error>>>",err);
  })
};



var proxy_capitals = function(sendData,callback){
  var result = JSON.stringify(sendData) ;
  console.log( path.basename(__filename), "http_post",JSON.stringify( result) ) ;
  
  var req = http.request(cfg_httpserver.capitals, function(res) {
    console.log('Status: ' + res.statusCode);
    //console.log('Headers: ' + JSON.stringify(res.headers));
    if(res.statusCode == 200){
	    res.setEncoding('utf8');
	    res.on('data', function (body) {
		    console.log('Body: ' + body);
		    if(callback){
			    callback(body);
		    }
	    });
    }else{
	    if(callback){
		    callback();
	    }
    }
  });


  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);//problem with request: Parse Error
    if(e.message!='Parse Error' ){
      if(callback){
        callback();
      }
    }
	    
  });

  req.write(result);
  req.end();
};

exports.stock_load = proxy_stock;
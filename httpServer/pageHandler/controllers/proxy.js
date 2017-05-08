const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
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
    console.log(">>>>\n",unit_date.Format(stocks.date,"yyyy-MM-dd") != unit_date.Format(new Date(),"yyyy-MM-dd"));
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
        if( self.req.post.hasOwnProperty("accountid")){
            proxy_capital(self.req.post["accountid"],function(){
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
            result.message = "请求失败 code：002 proxy";
            result.success = false;
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }else{
        result.message = "请求失败 code：003 proxy";
        result.success = false;
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }

};

//http://111.206.209.27:8080/account/detail?accountid=309219512983资金提示
var proxy_capital = function(accountid,callback){
    var url = 'http://111.206.209.27:8080/account/detail?accountid='+accountid;
    //{ "status": "200", "tradeid": "1", "accountid": "309219512983", "userid": "20000",
    // "account_muse": "1986.90", //可用
    // "account_value": "6544.00", //总市值
    // "account_msum": "8530.90" } //总资产
    http.get(url,function(res){
        // console.log("content-type",res.headers['content-type'] );
        var result="";
        res.setEncoding("utf8");
        res.on("data",function(chunk){
            result += chunk;
        });
        res.on("end",function(){
            if(callback){
                callback(result);
            }
        });
    }).on("error",function(err){
        console.log("error>>>",err);
        callback("error>>>"+JSON.stringify(err.message),url);
    })
};

var proxy_stock = function(callback){
    stock_load = true;
    var url = 'http://111.206.211.60/code.json';
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



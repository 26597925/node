const http = require('http');
const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));

exports.select_userAccount = function(){
	
	var self = this;
	// var usr = arguments[0]["usr"] || null;
    // var psw = arguments[0]["psw"] || null;
    console.log("arguments",arguments)
	var ID = sessions.get_uID(self.req);
	var result = {'success':true,'data':''};
	
	var sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID`, `CANAME` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
	// sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    db.query(sql,function(){
       if(arguments.length==1){
            result['data'] = arguments[0];
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }else{
            result = {'success':false,'message':'数据查询有问题，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    })
};

exports.modify_userAccount = function(){
    debugger;
    var self = this;
    var ID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    if(self.req.post){
        if( self.req.post["tradeid"]
            &&self.req.post["accountid"]
            &&self.req.post["password"]
        ){
            console.log('modify_userAccount',JSON.stringify(self.req.post));
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }
    // var usr = arguments[0]["usr"] || null;
    // var psw = arguments[0]["psw"] || null;
    // console.log("arguments",arguments)
    // var ID = sessions.get_uID(self.req);
    // var result = {'success':true,'data':''};
    
    // var sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID`, `CANAME` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    // // sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    // db.query(sql,function(){
    //    if(arguments.length==1){
    //         result['data'] = arguments[0];
    //         self.responseDirect(200,"text/json",JSON.stringify(result));
    //     }else{
    //         result = {'success':false,'message':'数据查询有问题，请联系管理员'};
    //         self.responseDirect(200,"text/json",JSON.stringify(result));
    //     }
    // })
};

exports.delete_userAccount = function(){
    
    var self = this;
    var ID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    if(self.req.post){
        if( self.req.post["tradeid"]
            &&self.req.post["accountid"]
            // &&self.req.post["password"]
        ){
            console.log('delete_userAccount',JSON.stringify(self.req.post));
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }
    // // var usr = arguments[0]["usr"] || null;
    // // var psw = arguments[0]["psw"] || null;
    // console.log("arguments",arguments)
    // var ID = sessions.get_uID(self.req);
    // var result = {'success':true,'data':''};
    
    // var sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID`, `CANAME` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    // // sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    // db.query(sql,function(){
    //    if(arguments.length==1){
    //         result['data'] = arguments[0];
    //         self.responseDirect(200,"text/json",JSON.stringify(result));
    //     }else{
    //         result = {'success':false,'message':'数据查询有问题，请联系管理员'};
    //         self.responseDirect(200,"text/json",JSON.stringify(result));
    //     }
    // })
};

exports.add_userAccount = function(){
    
    var self = this;
    var ID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    if(self.req.post){
        if( self.req.post["tradeid"]
            &&self.req.post["accountid"]
            &&self.req.post["password"]
        ){
            console.log('add_userAccount',JSON.stringify(self.req.post));
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }
    // console.log("arguments",arguments)
    
    
    // var sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID`, `CANAME` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    // // sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID` FROM `winners`.`tb_user_account` where USERID='"+ID+"'";
    // db.query(sql,function(){
    //    if(arguments.length==1){
    //         result['data'] = arguments[0];
    //         self.responseDirect(200,"text/json",JSON.stringify(result));
    //     }else{
    //         result = {'success':false,'message':'数据查询有问题，请联系管理员'};
    //         self.responseDirect(200,"text/json",JSON.stringify(result));
    //     }
    // })
};

var http_get=function(url,callback,param){
    http.get(url,function(res){
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

//http://106.39.244.172:8080/account/gddm?tradeid=4&accountid=10500998&password=1111111
//{ "status": 200, "tradeid": 2, "accountid": "5890000049", "shanghai_code": "A738685727", "shenzhen_code": "0125561330", "account_name": "夏彦刚", "detail": "successful" }
//{ "status": 403, "tradeid": 4, "accountid": "10500998", "shanghai_code": "", "shenzhen_code": "", "account_name": "", "detail": "连接交易服务器失败, 请尝试其它交易服务器。" }


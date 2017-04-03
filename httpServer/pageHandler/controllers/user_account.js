const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.select_userAccount = function(){
	
	var self = this;
    // console.log("arguments",arguments)
	var ID = sessions.get_uID(self.req);
    // ID=10000;//test
	var result = {'success':true,'data':''};
	var sql = "select `tb_capital_conf`.`USERID`,`tb_user_account`.`TRADEID`, `tb_capital_conf`.`ACCOUNTID`, `CANAME`, `PASSWORD`, `MAXBUY`, `BUYAMOUNT`, `BUYPERCENT`, `SPLITCOUNT` from `tb_capital_conf` "
    +"inner join `tb_user_account` on `tb_capital_conf`.`ACCOUNTID`=`tb_user_account`.`ACCOUNTID`"
    sql += " and `tb_capital_conf`.`USERID`='"+ID+"' and `VISIBLE` = '1'";
	// var sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID`, `CANAME`,`PASSWORD` FROM `tb_user_account` where USERID='"+ID+"'";
	// sql = "SELECT `USERID`, `TRADEID`, `ACCOUNTID` FROM `tb_user_account` where USERID='"+ID+"'";
    db.query(sql,function(){
        console.log("arguments", arguments,arguments.length);
        if(arguments.length==1){
            result['data'] = arguments[0];
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }else{
            result = {'success':false,'message':'数据查询空值或错误，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    })
};

exports.modify_userAccount = function(){
    debugger;
    var self = this;
    var ID = sessions.get_uID(self.req);
    ID=10000;//test
    var result = {'success':true,'data':''};
    if(self.req.post){
        if( self.req.post["TRADEID"]
            &&self.req.post["ACCOUNTID"]
            &&self.req.post["PASSWORD"]
        ){
            console.log('modify_userAccount',JSON.stringify(self.req.post));
            
            //UPDATE `tb_capital_conf` SET `MAXBUY` = '10000', `BUYAMOUNT` = '1', `BUYPERCENT` = '0.5', `SPLITCOUNT` = '9' WHERE `tb_capital_conf`.`ACCOUNTID` = '5890000049';
            //UPDATE `tb_user_account` SET `ACCOUNTID` = '1050099800', `PASSWORD` = '62279200', `CANAME` = '老秋' WHERE `tb_user_account`.`TRADEID` = 4 AND `tb_user_account`.`ACCOUNTID` = '10500998';
            //TRADEID ACCOUNTID PASSWORD MAXBUY BUYAMOUNT BUYPERCENT SPLITCOUNT

            var sql1 = "UPDATE `tb_capital_conf` SET "
            +"`MAXBUY` = '"+self.req.post["MAXBUY"]+"', "
            +"`BUYAMOUNT` = '"+self.req.post["BUYAMOUNT"]+"', "
            +"`BUYPERCENT` = '"+self.req.post["BUYPERCENT"]+"', "
            +"`SPLITCOUNT` = '"+self.req.post["SPLITCOUNT"]+"' WHERE `tb_capital_conf`.`ACCOUNTID` = '"+self.req.post["ACCOUNTID"]+"';";
            var sql2 = "UPDATE `tb_user_account` SET "
            // +"`ACCOUNTID` = '"+self.req.post["ACCOUNTID"]+"', "
            +"`PASSWORD` = '"+self.req.post["PASSWORD"]+"' "
            +"WHERE `tb_user_account`.`TRADEID` = "+ID+" AND `tb_user_account`.`ACCOUNTID` = '"+self.req.post["ACCOUNTID"]+"';"
            try{
                db.transaction(sql1,sql2,function(){
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                });
            }catch(err){
                console.log(JSON.stringify(err));
                result = {'success':false,'message':'非法请求数据，请联系管理员'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
            
        }else{
            result = {'success':false,'message':'非法请求数据，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
        
    }
    
};

exports.delete_userAccount = function(){
    
    var self = this;
    var ID = sessions.get_uID(self.req);

    var result = {'success':true,'data':''};
    
    if(self.req.post){
        if( self.req.post["TRADEID"]
            &&self.req.post["ACCOUNTID"]
            // &&self.req.post["password"]
        ){
            
            var sql = "UPDATE `tb_user_account` SET `VISIBLE` = '0' WHERE `tb_user_account`.`TRADEID` = "+self.req.post["tradeid"]+" AND `tb_user_account`.`ACCOUNTID` = '"+self.req.post["accountid"]+"';";
            db.query(sql,function(){
                if(arguments.length==1){
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }else{
                    result = {'success':false,'message':'数据查询有问题，请联系管理员'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }
            })
           
        }else{
            result = {'success':false,'message':'非法请求数据，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }
    
};

exports.add_userAccount = function(){
    
    // TRADEID:dictTrade_selectElement.val()
    // ,ACCOUNTID:$("#dictTrade_account").val()
    // ,PASSWORD:$("#dictTrade_pwd").val()
    // ,MAXBUY:$("#dictTrade_MAXBUY")
    // ,BUYAMOUNT:$("#dictTrade_BUYAMOUNT")
    // ,BUYPERCENT:$("#dictTrade_BUYPERCENT")
    // ,SPLITCOUNT:$("#dictTrade_SPLITCOUNT")

    var self = this;
    
    var result = {'success':true,'data':''};
    if(self.req.post){
        if( self.req.post["TRADEID"]
            &&self.req.post["ACCOUNTID"]
            &&self.req.post["PASSWORD"]
            &&self.req.post["MAXBUY"]
            &&self.req.post["BUYAMOUNT"]
            &&self.req.post["BUYPERCENT"]
            &&self.req.post["SPLITCOUNT"]
        ){
            console.log('add_userAccount',JSON.stringify(self.req.post));
            
            // var param = "tradeid="+self.req.post["TRADEID"]+"&accountid="+self.req.post["ACCOUNTID"]+"&password="+self.req.post["PASSWORD"]+"";
            // http_get("http://106.39.244.172:8080/account/gddm?"+param,
            // function(result,url){
                
                var result = JSON.parse('{ "status": 200, "tradeid": 2, "accountid": "5890000249", "shanghai_code": "A738685727", "shenzhen_code": "0125561330", "account_name": "夏彦刚", "detail": "successful" }');
                if(result['status'] == 200){
                    insert_userAccount(self,result);
                }else if(result['status'] == 403){
                    result = {'success':false,'message':'该用户不存在!'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }else{
                    result = {'success':false,'message':'没有定义这样的数据类型'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }

                //{ "status": 200, "tradeid": 2, "accountid": "5890000049", "shanghai_code": "A738685727", "shenzhen_code": "0125561330", "account_name": "夏彦刚", "detail": "successful" }
                //{ "status": 403, "tradeid": 4, "accountid": "10500998", "shanghai_code": "", "shenzhen_code": "", "account_name": "", "detail": "连接交易服务器失败, 请尝试其它交易服务器。" }

            // });            
        }
    }
    // console.log("arguments",arguments)
    // var sql =
    // INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, `CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `CANUSAGE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
    // (20000, 1, '301719804403', '289187', 'ÕÅÂ¶', 'A113947213', '0171338378', 1, '2017-02-14 05:28:12', '0000-00-00 00:00:00', NULL)
    //INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, `CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `CANUSAGE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES ('20000', '4', '390100060686', '341911', '老夏', 'A572339544', '0208582535', '1', '2017-03-23 00:00:00', '2017-03-23 00:00:00', 'test');
    //INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, `CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `CANUSAGE`, `MODTIME`, `REMARK`) VALUES ('20000', '0', '390100060687', '341912', '老夏', 'A572339544', '0208582535', '1', '2017-03-23 00:00:00', 'test')
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

// insert_userAccount(self,self.req.post,result)
var insert_userAccount = function(context,account_result){
    var post = context.req.post;
    
    var ID = sessions.get_uID(context.req);

    var result = {'success':true,'data':''};
    
    // account_result['status']
    // account_result['detail']

//     INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, `CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `CANUSAGE`, `VISIBLE`, `ADDTIME`, `MODTIME`, `REMARK`)
// VALUES
//     (20000,1,'309219249819','243167','Íõ¾ê','A720722620','0156011732',1,1,'2017-03-21 21:43:45','0000-00-00 00:00:00',NULL)
    var sql1 = "INSERT INTO `tb_user_account` (`USERID`, `TRADEID`, `ACCOUNTID`, `PASSWORD`, "
        +"`CANAME`, `EXCHGID_SH`, `EXCHGID_SZ`, `MODTIME`) ";
    sql1 +="VALUES ";
    sql1 +="("
        +ID+","
        +account_result['tradeid']+",'"
        +account_result['accountid']+"','"
        +post["PASSWORD"]+"','"
        +account_result['account_name']+"','"
        +account_result['shanghai_code']+"','"
        +account_result['shenzhen_code']+"','"
        +unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")+"')";

    var sql2 = "INSERT INTO `tb_capital_conf` ("
        +"`ACCOUNTID`, `USERID`, `MAXBUY`, `BUYAMOUNT`, `BUYPERCENT`, `SPLITCOUNT`)";
    sql2 += "VALUES";
    sql2 +="('"
        +account_result['accountid']+"',"
        +ID+","
        +post["MAXBUY"]+","
        +post["BUYAMOUNT"]+","+post["BUYPERCENT"]+","+
        +post["SPLITCOUNT"]+")";
    try{
        db.transaction(sql1,sql2,function(){
            context.responseDirect(200,"text/json",JSON.stringify(result));
        }); 
    }catch(err){
        console.log("catch",err);
        result = {'success':false,'message':'操作数据库异常'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }
}

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


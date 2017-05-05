const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.select_userAccount = function(){
	
	var self = this;

	var uID = sessions.get_uID(self.req);
    // ID=10000;//test
	var result = {'success':true,'data':''};
    var sql = "select" +
        " `tb_capital_conf`.`USERID`," +
        " `tb_user_account`.`TRADEID`," +
        " `tb_capital_conf`.`ACCOUNTID`," +
        " `CANAME`," +
        " `PASSWORD`," +
        " `MAXBUY`," +
        " `BUYCOUNT`," +
        " `BUYAMOUNT`," +
        " `PERCENT`," +
        " `SPLITCOUNT`" +
        " from " +
        " `tb_capital_conf`" +
        " inner join " +
        "`tb_user_account`" +
        " on" +
        " `tb_capital_conf`.`ACCOUNTID`=`tb_user_account`.`ACCOUNTID`" +
        " and " +
        " `tb_capital_conf`.`USERID`='%s'" +
        " and `VISIBLE` = '1'";
    sql = util.format(sql,uID);

    db.query(sql,function(){
        console.log(path.basename(__filename).replace('.js',''),"select_userAccount", arguments);
        if(arguments.length==1){
            result['data'] = arguments[0];
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }else if(arguments.length==0){
            result['data'] = [];
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
        else{
            result = {'success':false,'message':'数据查询空值或错误，请联系管理员'};
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
        if( self.req.post.hasOwnProperty("TRADEID")
            &&self.req.post.hasOwnProperty("ACCOUNTID")
            &&self.req.post.hasOwnProperty("PASSWORD")
        ){
            console.log(path.basename(__filename).replace('.js',''),'modify_userAccount',JSON.stringify(self.req.post));
            
            //UPDATE `tb_capital_conf` SET `MAXBUY` = '10000', `BUYAMOUNT` = '1', `PERCENT` = '0.5', `SPLITCOUNT` = '9' WHERE `tb_capital_conf`.`ACCOUNTID` = '5890000049';
            //UPDATE `tb_user_account` SET `ACCOUNTID` = '1050099800', `PASSWORD` = '62279200', `CANAME` = '老秋' WHERE `tb_user_account`.`TRADEID` = 4 AND `tb_user_account`.`ACCOUNTID` = '10500998';
            //TRADEID ACCOUNTID PASSWORD MAXBUY BUYAMOUNT PERCENT SPLITCOUNT
            var sql1 = "UPDATE `tb_capital_conf` SET " +
                // "`ACCOUNTID` = '%s', " +
                // "`USERID` = '%s', " +
                " `MAXBUY` = '%s', " +
                " `BUYCOUNT` = '%s', " +
                " `BUYAMOUNT` = '%s', " +
                " `PERCENT` = '%s', " +
                " `SPLITCOUNT` = '%s', " +
                // "`ADDTIME` = '%s', " +
                " `MODTIME` = '%s' " +
                " WHERE " +
                " `ACCOUNTID` = '%s'";
            sql1 = util.format(sql1,
                self.req.post["MAXBUY"]
                ,self.req.post["BUYCOUNT"]
                ,self.req.post["BUYAMOUNT"]
                ,self.req.post["PERCENT"]
                ,self.req.post["SPLITCOUNT"]

                ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
                ,self.req.post["ACCOUNTID"]
            );

            var sql2 = "UPDATE `tb_user_account` SET " +
                // "`USERID` = '%s', " +
                // "`TRADEID` = '%s', " +
                // "`ACCOUNTID` = '%s', " +
                " `PASSWORD` = '%s'" +
                // ", " +
                // "`CANAME` = '%s', " +
                // "`EXCHGID_SH` = '%s', " +
                // "`EXCHGID_SZ` = '%s', " +
                // "`CANUSAGE` = '%s', " +
                // "`VISIBLE` = '%s', " +
                // "`ADDTIME` = '%s', " +
                // "`MODTIME` = '%s' " +
                " WHERE " +
                " `TRADEID` = %s " +
                " AND " +
                " `ACCOUNTID` = '%s'";
            sql2 = util.format(sql2,
                self.req.post["PASSWORD"]
                ,self.req.post["TRADEID"]
                ,self.req.post["ACCOUNTID"]
            );


            try{
                db.transaction(sql1,sql2,function(){
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                });
            }catch(err){
                console.log(path.basename(__filename).replace('.js',''),'modify_userAccount',JSON.stringify(err));
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
        if( self.req.post.hasOwnProperty("TRADEID")
            &&self.req.post.hasOwnProperty("ACCOUNTID")
        ){
            var sql = "UPDATE `tb_user_account` SET `VISIBLE` = '0' WHERE  `TRADEID` = %s AND  `ACCOUNTID` = '%s'";
            sql = util.format(sql,self.req.post["TRADEID"],self.req.post["ACCOUNTID"]);
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

    var self = this;
    var result = {'success':true,'data':''};
    if(self.req.post){
        if( self.req.post.hasOwnProperty("TRADEID")
            &&self.req.post.hasOwnProperty("ACCOUNTID")
            &&self.req.post.hasOwnProperty("PASSWORD")
            &&self.req.post.hasOwnProperty("MAXBUY")
            &&self.req.post.hasOwnProperty("BUYCOUNT")
            &&self.req.post.hasOwnProperty("BUYAMOUNT")
            &&self.req.post.hasOwnProperty("PERCENT")
            &&self.req.post.hasOwnProperty("SPLITCOUNT")
        ){
            console.log(path.basename(__filename).replace('.js',''),'add_userAccount',JSON.stringify(self.req.post));
            
            var param = "tradeid="+self.req.post["TRADEID"]+"&accountid="+self.req.post["ACCOUNTID"]+"&password="+self.req.post["PASSWORD"]+"";
            //"http://106.39.244.172:8080/account/gddm?"+param,
            var url = "http://111.206.209.27:8080/account/gddm?"+param;

            console.log(path.basename(__filename).replace('.js',''),'param',url);
            http_get(url,function(hresult,url){
                    debugger;
                    try{
                        hresult = JSON.parse(hresult);
                        if(hresult['status'] == 200){
                            insert_userAccount(self,hresult);
                        }else if(hresult['status'] == 403){
                            result = {'success':false,'message':hresult['detail']};
                            self.responseDirect(200,"text/json",JSON.stringify(result));
                        }else{
                            result = {'success':false,'message':'未知状态!'};
                            self.responseDirect(200,"text/json",JSON.stringify(result));
                        }
                    }catch(err ){
                        result = {'success':false,'message':'非本域访问!'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }
                    // var result = JSON.parse('{ "status": 200, "tradeid": 2, "accountid": "5890000249", "shanghai_code": "A738685727", "shenzhen_code": "0125561330", "account_name": "夏彦刚", "detail": "successful" }');
                    //{ "status": 200, "tradeid": 2, "accountid": "5890000049", "shanghai_code": "A738685727", "shenzhen_code": "0125561330", "account_name": "夏彦刚", "detail": "successful" }
                    //{ "status": 403, "tradeid": 4, "accountid": "10500998", "shanghai_code": "", "shenzhen_code": "", "account_name": "", "detail": "连接交易服务器失败, 请尝试其它交易服务器。" }

            });
        }else{
            result = {'success':false,'message':'请求数据参数错误'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }else{
        result = {'success':false,'message':'请求数据类型错误'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }

};

// insert_userAccount(self,self.req.post,result)
var insert_userAccount = function(context,account_result){
    var self = context;
    var post = context.req.post;
    var ID = sessions.get_uID(context.req);
    var result = {'success':true,'data':''};
    var sql = "SELECT `TRADEID`, `ACCOUNTID` FROM `tb_user_account` WHERE `TRADEID` = %s AND `ACCOUNTID` = '%s'";
    sql = util.format(sql,account_result['tradeid'],account_result['accountid']);
    // sql = "SELECT `ACCOUNTID` FROM `tb_capital_conf` WHERE `ACCOUNTID` = '%s'";
    // sql = util.format(sql,account_result['accountid']);
    db.query(sql,function(){
        if(arguments.length == 0){

            var sql1 = "INSERT INTO `tb_user_account` (" +
                "`USERID`, `TRADEID`, `ACCOUNTID`, " +
                "`PASSWORD`, `CANAME`, `EXCHGID_SH`, " +
                "`EXCHGID_SZ`, `MODTIME`" +
                ") VALUES (" +
                "%s,%s,'%s'," +
                "'%s','%s','%s'," +
                "'%s','%s'" +
                ")";

            sql1 = util.format(sql1,
                ID, account_result['tradeid'], account_result['accountid']
                ,post["PASSWORD"], account_result['account_name'], account_result['shanghai_code']
                ,account_result['shenzhen_code'], unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
            );

            // INSERT INTO `tb_capital_conf` (`ACCOUNTID`, `USERID`, `MAXBUY`, `BUYCOUNT`, `BUYAMOUNT`, `PERCENT`, `SPLITCOUNT`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
            // ('301719804403', 20000, 0, 0, 0, 0.4, 1, '2017-02-23 01:11:14', '2017-02-23 09:10:06', ''),

            var sql2 = "INSERT INTO `tb_capital_conf` (" +
                " `ACCOUNTID`," +
                " `USERID`," +
                " `MAXBUY`, " +
                " `BUYCOUNT`," +
                " `BUYAMOUNT`," +
                " `PERCENT`, " +
                " `SPLITCOUNT`, " +
                // "`ADDTIME`, " +
                "`MODTIME`" +
                // ", " +
                // "`REMARK`" +
                ") VALUES(" +
                "'%s'," +
                " %s," +
                " %s, " +
                " %s," +
                " %s," +
                " %s, " +
                " %s, " +
                "'%s'" +
                // ", " +
                // "''" +
                ")";

            sql2 = util.format(sql2,
                account_result['accountid']
                ,ID
                ,post["MAXBUY"]
                ,post["BUYAMOUNT"]
                ,post["BUYAMOUNT"]
                ,post["PERCENT"]
                ,post["SPLITCOUNT"]
                ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
            );
            console.log("db.transaction",sql1,sql2);
            try{
                db.transaction(sql1,sql2,function(){
                    context.responseDirect(200,"text/json",JSON.stringify(result));
                });
            }catch(err){
                console.log(path.basename(__filename).replace('.js',''),"catch",err);
                result = {'success':false,'message':'操作数据库异常'+path.basename(__filename).replace('.js','')};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }

        }else{
            result = {'success':false,'message':'该帐号已经存在，如有问题请联系管理员'+path.basename(__filename).replace('.js','')};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    });
};

var http_get=function(url,callback,param){
    http.get(url,function(res){
        // console.log("content-type",res.headers['content-type'] );
        var result="";
        res.setEncoding("utf8");
        // res.setEncoding("gbk");
        res.on("data",function(chunk){
            result += chunk;
        });
        res.on("end",function(){
            console.log("老夏接口",JSON.stringify(result));
            if(param){
                callback(result,url,param);
            }else{
                callback(result,url);
            }

        });
    }).on("error",function(err){
        console.log("error>>>",err);
        callback("error>>>"+JSON.stringify(err.message),url);

    })
};

//http://106.39.244.172:8080/account/gddm?tradeid=4&accountid=10500998&password=1111111


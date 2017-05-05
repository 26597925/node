const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));


var add_newUser = function(context){
    var self = context;
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        if( self.req.post["UENAME"]
            &&self.req.post["UCNAME"]
            &&self.req.post["PHONENUMBER"]
            &&self.req.post["PASSWORD"]
            &&self.req.post["ADDRESS"]
            &&self.req.post["ZIPCODE"]
            // &&this.req.post.hasOwnProperty("")
            ){

            //INSERT INTO `tb_user_basic` (`USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `ONLINE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES ('0', '0', 'test3', '测试3', '15801278254', '111111', 'zvxvc', 'qweqwe', '0', '0', NULL, '0', CURRENT_TIMESTAMP, '0000-00-00 00:00:00.000000', 'sdasdsda');
            
            var sql = "INSERT INTO `tb_user_basic` "
            +"( `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`,`MODTIME`)"
            +" VALUES ( '"+self.req.post["UENAME"]+"', '"
                +self.req.post["UCNAME"]+"', '"
                +self.req.post["PHONENUMBER"]+"', '"
                +self.req.post["PASSWORD"]+"', '"
                +self.req.post["ADDRESS"]+"', '"
                +self.req.post["ZIPCODE"]+"', '"
                +unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")+"')";
            db.query(sql,function(){

                if(arguments.length==1){
                    var sql2 = "select USERID from tb_user_basic where `PHONENUMBER` = '"+self.req.post["PHONENUMBER"]+"' and `PASSWORD` = '"+self.req.post["PASSWORD"]+"'";
                    db.query(sql2,function(){
                        if(arguments.length==1){
                            updateUserLoginTime(arguments[0][0]["USERID"],self);
                         }else{
                            result = {'success':false,'message':'数据存在问题，请联系管理员 code:2'};
                            self.responseDirect(200,"text/json",JSON.stringify(result));
                        }
                    });
                }else if(arguments.length==0){
                    result = {'success':false,'data':"find password",'message':'数据存在问题，请联系管理员 code:0'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }else{
                    result = {'success':false,'message':'数据存在问题，请联系管理员 code:1'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }
            })
        }else{
            result = {'success':false,'message':'数据非法1'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }
};

exports.logup_submit = function(){
    var self = this;
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `tb_user_basic` where `UENAME`='%s'";
            // " and `PASSWORD`='%s'";
        sql = util.format(sql,this.req.post["UENAME"]);//,this;
        db.query(sql,function(){
            
            if(arguments.length==0){
                add_newUser(self);
            }else if(arguments.length==1){
                if(arguments[0]["PASSWORD"] == self.req.post["PASSWORD"]  ){
                    result = {'success':true,'message':'登录成功'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }else{
                    result = {'success':false,'data':"find password",'message':'该用户注册过logup code:0'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }

            }else{
                result = {'success':false,'message':'数据查询有问题，请联系管理员 code:0001'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        })
        
    }else{
        result = {'success':false,'message':'数据非法 code:0000'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }
};



exports.exit = function(){
    var self = this;
    var ip =  getIp(this.req);
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    sessions.destory(self.req,self.res);
    insert_exit_log_login(uID,ip);
    self.responseDirect(200,"text/json",JSON.stringify(result));
};

var getIp = function(req){
    debugger;
    var ip = '';
    if(req.hasOwnProperty("headers")
        && req.headers.hasOwnProperty('x-forwarded-for')){
        ip = req.headers['x-forwarded-for']
    }else{
        if(req.hasOwnProperty('connection') && req.connection.hasOwnProperty('remoteAddress')){
            ip = req.connection.remoteAddress;
        }else if(req.hasOwnProperty('socket') && req.socket.hasOwnProperty('remoteAddress')){
            ip = req.socket.remoteAddress;
        }else if(req.hasOwnProperty('connection') && req.connection.hasOwnProperty('socket')
            && req.connection.socket.hasOwnProperty('remoteAddress')){
            ip = req.connection.socket.remoteAddress;
        }
    }
    return ip;
};

exports.login = function(args){

	var self = this;
    var ip =  getIp(this.req);
    var usr = args["usr"] || null;
    var psw = args["psw"] || null;
    // SELECT `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, 
    //`PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `MODTIME`, 
    //`ONLINE`, `ADDTIME`, `MODTIME`, `REMARK` FROM `tb_user_basic`
    
    if(usr && psw){
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `tb_user_basic` where `UENAME`='"+usr+"' and `PASSWORD`='"+psw+"'";
        var result = {'success':true,'message':'登录成功'};
        db.query(sql,function(){
            if( arguments.length==1 ){
                insert_tb_log_login(arguments[0][0]['USERID'],ip);
                updateUserLoginTime(arguments[0][0]['USERID'],self);
            }else{
                result = {'success':false,'message':'用户名或密码错误，请重新登录'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        });

	}else{
		self.handler404(self.req,self.res);
	}
};

var insert_tb_log_login = function(USERID,IPADDRESS){
    var sql = "INSERT INTO `tb_log_login` (" +
        " `USERID`," +
        // " `LOGOUT`," +
        " `IPADDRESS`" +
        ") VALUES ( " +
        "'%s', " +
        // "'%s', " +
        "'%s')";
    sql = util.format(sql, USERID, IPADDRESS);
    db.query(sql);
};
var insert_exit_log_login = function(USERID,IPADDRESS){
    var sql = "INSERT INTO `tb_log_login` (" +
        " `USERID`," +
        " `LOGOUT`," +
        " `IPADDRESS`" +
        ") VALUES ( " +
        "'%s', " +
        "'%s', " +
        "'%s')";
    sql = util.format(sql, USERID, unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss"),IPADDRESS);
    db.query(sql);
};

var updateUserLoginTime = function(USERID,context){
    console.log(path.basename(__filename).replace('.js',''),'updateUserLoginTime');
    var self = null;
    if(context){self = context;}
    var req = self.req;
    var res = self.res;
    var SID;
    if( self.hasOwnProperty("alias") && self.alias == "heart" )
    {
        SID = sessions.updateSID(self.SID);
    }else{
        SID = sessions.createSID();
    }

    sessions.setCookie(req,res,SID,USERID);
    var sql2 = "UPDATE `tb_user_basic` SET `LASTLOGIN` = '"+SID+"' WHERE `tb_user_basic`.`USERID` = "+USERID+" ";

    var result = {'success':true,'message':'登录成功'};
    db.query(sql2,function(){
        console.log("updateUserLoginTime",arguments);
        if(arguments.length==1){
            self.responseDirect(200,'text/json',JSON.stringify(result));
        }else{
            result = {'success':false,'message':'用户已经过期，请重新登录'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    });

};

exports.updateLoginTime = function(USERID){
    updateUserLoginTime(USERID,this);
};

exports.getUserInfo = function(USERID){
    var self = this;
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};

    var sql = "SELECT " +
        // " `GROUPID`" +
        // "," +
        " `UENAME`" +
        ", `UCNAME`" +
        ", `PHONENUMBER`" +
        ", `PASSWORD`" +
        ", `ADDRESS`" +
        ", `ZIPCODE`" +
        // ", `TYPEID`" +
        // ", `STATUS`" +
        // ", `LASTLOGIN`" +
        // ", `SESSIONID`" +
        ", `ONLINE`" +
        // ", `ADDTIME`" +
        // ", `MODTIME`" +
        ", `EMAIL`" +
        // ", `REMARK`" +
        // ", `INVOKE`" +
        " FROM  `tb_user_basic` WHERE USERID='%s'";
    sql = util.format(sql,uID);//,this;
    db.query(sql,function () {
       if(arguments.length  == 1){
           result.data = arguments[0];
           self.responseDirect(200,"text/json",JSON.stringify(result));
       }else{
           result = {'success':false,'message':'数据库异常'};
           self.responseDirect(200,"text/json",JSON.stringify(result));
       }
    });
};
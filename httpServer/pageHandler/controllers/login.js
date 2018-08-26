const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const verifyCode = require(path.join(__dirname,"verifyCode.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const getIP = require('ipware')().get_ip;
const md5 = require('md5');

var add_newUser = function(context){
    var self = context;
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        if( self.req.post["UENAME"]
            &&self.req.post["UCNAME"]
            &&self.req.post["PHONENUMBER"]
            &&self.req.post["PASSWORD"]
            &&self.req.post["ADDRESS"]
            ){

            var PASSWORD = md5(self.req.post["PASSWORD"])
            
            var sql = "INSERT INTO `tb_user_basic` "
            +"( `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `MODTIME`)"
            +" VALUES ( '"+self.req.post["UENAME"]+"', '"
                +self.req.post["UCNAME"]+"', '"
                +self.req.post["PHONENUMBER"]+"', '"
                +PASSWORD+"', '"
                +self.req.post["ADDRESS"]+"', '"
                +unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")+"')";
            db.query(sql,function(){

                if(arguments.length==1){
                    var sql2 = "select USERID from tb_user_basic where `PHONENUMBER` = '"+self.req.post["PHONENUMBER"]+"' and `PASSWORD` = '"+PASSWORD+"'";
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
    //
    if(self.req.post
        && self.req.post.hasOwnProperty('UENAME')
        && self.req.post.hasOwnProperty('PASSWORD')
        && self.req.post.hasOwnProperty('PHONENUMBER')
        && self.req.post.hasOwnProperty('EMAIL')
	      && self.req.post.hasOwnProperty('VERIFY')
    ){
        var verify =  self.req.post['VERIFY'];
        var PASSWORD = md5(self.req.post["PASSWORD"])
        console.log(unit_date.getTime(),String(verifyCode.decode(sessions.getCookieCode(self.req,self.res))), String(verify));
	    if(String(verifyCode.decode(sessions.getCookieCode(self.req,self.res))) != String(verify) ){
		    result = {'success':false,'message':'校验码验证失败'};
		    self.responseDirect(200,"text/json",JSON.stringify(result));
		    return;
	    }
        var sql = "SELECT" +
            " `USERID`," +
            //" `GROUPID`," +
            " `UENAME`," +
            " `PHONENUMBER`," +
            " `PASSWORD`," +
            " `EMAIL`" +
            "  FROM `tb_user_basic` where " +
            " `UENAME`='%s'" +
            " or " +
            " `PHONENUMBER`='%s'" +
            " or " +
            " `EMAIL`='%s'";
            // " and `PASSWORD`='%s'";
        sql = util.format(sql,
            this.req.post["UENAME"],
            self.req.post['PHONENUMBER'],
            self.req.post['EMAIL']);
        db.query(sql,function(){
            
            if(arguments.length==0){
                add_newUser(self);
            }else if(arguments.length==1){

                for(var i = 0; i < arguments[0].length; i++){
                    if(arguments[0][i]["UENAME"] == self.req.post['UENAME']){
                        //'data':"find password",
                        result = {'success':false,'message':'该用户已经注册过 code:0'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                        return;
                    }else if(arguments[0][i]["PHONENUMBER"] == self.req.post['PHONENUMBER']){
                        //'data':"find password",
                        result = {'success':false,'message':'该电话已经注册过 code:1'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                        return;
                    }else if(arguments[0][i]["EMAIL"] == self.req.post['EMAIL']){
                        //'data':"find password",
                        result = {'success':false,'message':'该邮箱已经注册过 code:2'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                        return;
                    }
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
    var ip =  getIP(this.req);
    if(ip && ip.hasOwnProperty('clientIp')){
        ip = ip['clientIp'];
    }
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    sessions.destory(self.req,self.res);
    insert_exit_log_login(uID,ip);
    self.responseDirect(200,"text/json",JSON.stringify(result));
};



exports.login = function(args){

	var self = this;
  var ip =  getIP(this.req);
	if(ip && ip.hasOwnProperty('clientIp')){
		ip = ip['clientIp'];
	}
  
  var usr = args["usr"] || null;
  var psw = md5(args["psw"]) || null;
  var verify = args["verify"] || null;
  

  if(String(verifyCode.decode(sessions.getCookieCode(self.req,self.res))) != String(verify) ){
	  result = {'success':false,'message':'校验码验证失败，请重新登录'};
	  self.responseDirect(200,"text/json",JSON.stringify(result));
	  return;
  }

  if(usr && psw){

        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `tb_user_basic` where `UENAME`='"+usr+"' and `PASSWORD`='"+psw+"'";
        var result = {'success':true,'message':'登录成功'};
        db.query(sql,function(){
            if( arguments.length==1 ){
                console.log(unit_date.getTime(),'login USERID',arguments[0][0]['USERID']);
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
    console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),'updateUserLoginTime');
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
        console.log(unit_date.getTime(),"updateUserLoginTime",arguments);
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
        " `USERID`" +
        "," +
        " `UENAME`" +
        ", `UCNAME`" +
        ", `PHONENUMBER`" +
        ", `PASSWORD`" +
        ", `ADDRESS`" +
        // ", `ZIPCODE`" +
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

exports.updateUserInfo = function(){
    var self = this;
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    // // USERID
    // // GROUPID
    // // UENAME
    // UCNAME
    // PHONENUMBER
    // PASSWORD
    // ADDRESS
    
    // // TYPEID
    // // STATUS
    // // LASTLOGIN
    // // SESSIONID
    // // ONLINE
    // // ADDTIME
    // MODTIME
    // EMAIL
    // // REMARK
    // // INVOKE
    if(self.req.post && self.req.post.hasOwnProperty('UENAME')){
        var updates = [];
        if(self.req.post.hasOwnProperty('UCNAME')){
            //`POLICYPARAM` = "%s"
            updates.push('`UCNAME`="'+self.req.post['UCNAME']+'"');
        }
        if( self.req.post.hasOwnProperty('PHONENUMBER')){
            updates.push('`PHONENUMBER`="'+self.req.post['PHONENUMBER']+'"');
        }

        if( self.req.post.hasOwnProperty('PASSWORD')){
            updates.push('`PASSWORD`="'+md5(self.req.post['PASSWORD'])+'"');
        }

        if( self.req.post.hasOwnProperty('ADDRESS')){
            updates.push('`ADDRESS`="'+self.req.post['ADDRESS']+'"');
        }
        // if( self.req.post.hasOwnProperty('ZIPCODE')){
        //     updates.push('`ZIPCODE`="'+self.req.post['ZIPCODE']+'"');
        // }
        if( self.req.post.hasOwnProperty('EMAIL')){
            updates.push('`EMAIL`="'+self.req.post['EMAIL']+'"');
        }

        updates.push('`MODTIME`="'+unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")+'"');

        if(updates.length>0){
            var sql = 'UPDATE `tb_user_basic` SET ';
            for(var i = 0; i < updates.length; i++){
                if(i!=0){
                    sql += ","
                }
                sql += updates[i];
            }

            sql += ' WHERE ' +
                '`USERID` =  ' + uID+
                ' and `UENAME` ="'+self.req.post['UENAME']+'"';

            db.query(sql,function () {
                if(arguments.length  == 1){
                    result.data = [];//arguments[0];
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }else{
                    result = {'success':false,'message':'user 数据库异常 '};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }
            });

        }else{
            result = {'success':false,'message':''};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }

    }

};
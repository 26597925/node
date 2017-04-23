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
                console.log("insert",JSON.stringify(arguments));
                if(arguments.length==1){
                    var sql2 = "select USERID from tb_user_basic where `PHONENUMBER` = '"+self.req.post["PHONENUMBER"]+"' and `PASSWORD` = '"+self.req.post["PASSWORD"]+"'";
                    db.query(sql2,function(){
                        if(arguments.length==1){
                            updateUserLoginTime(arguments["USERID"],self,"USERID");
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
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `tb_user_basic` where `UENAME`='"+this.req.post["UENAME"]+"' and `PASSWORD`='"+this.req.post["PASSWORD"]+"'";
        db.query(sql,function(){
            
            if(arguments.length==0){
                add_newUser(self);
            }else if(arguments.length==1){
                // add_newUser(self);
                result = {'success':true,'message':'该用户名已经注册过'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }else{
                result = {'success':false,'message':'数据查询有问题，请联系管理员'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        })
        
    }else{
        result = {'success':false,'message':'数据非法0'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }
};



exports.exit = function(){
    var self = this;
    var sess = sessions.validate(self.req);
    if(sess){
        sess.destory();
    }
    self.responseDirect(200,'text/json','');
};

exports.login = function(args){
    var ip = '';
    if(this.req.hasOwnProperty("headers")
        && this.req.headers.hasOwnProperty('x-forwarded-for')){
        ip = this.req.headers['x-forwarded-for']
    }else{
        ip = this.req.connection.remoteAddress ||
            this.req.socket.remoteAddress ||
            this.req.connection.socket.remoteAddress||"";
    }



	var self = this;
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

var updateUserLoginTime = function(USERID,context){
    console.log(path.basename(__filename).replace('.js',''),'updateUserLoginTime');
    var self = null;
    if(context){self = context;}
    var req = self.req;
    var res = self.res;
    var SID = sessions.createSID();
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


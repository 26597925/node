const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));


exports.heartTime = function(){

    var self = this;
    var cookies = sessions.parseCookies(this.req.headers.cookie);
    var USERID = sessions.get_uID(this.req);
    var result = {'success':true,'message':'登录成功'};
    if(cookies["sID"] != null && cookies["uID"] != null ){

        var sql = "select `LASTLOGIN` from `tb_user_basic` WHERE `tb_user_basic`.`USERID` = "+USERID+" ";
        db.query(sql,function(){
            
            if(arguments.length == 1){

                if(arguments[0][0]['LASTLOGIN']){
                    var time = sessions.invertTimestamp(arguments[0][0]['LASTLOGIN']);
                    var cookieTime = sessions.invertTimestamp(cookies["sID"]);
                    console.log(path.basename(__filename),"lastlogin:",cookieTime,time, (cookieTime-time)>30000);
                    self.responseDirect(200,'text/json',JSON.stringify(result));
                }else{
                    result.success = false;
                    result.message = "heartTime null 数据异常! ";
                    self.responseDirect(200,'text/json',JSON.stringify(result));
                }

            }else{
                result.success = false;
                result.message = "heartTime empty 数据异常! ";
                self.responseDirect(200,'text/json',JSON.stringify(result));
            }
        });

    }else{
        result.success = false;
        result.message = "heartTime ck 数据异常! ";
        self.responseDirect(200,'text/json',JSON.stringify(result));
    }

    
};



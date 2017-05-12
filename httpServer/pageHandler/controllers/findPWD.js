const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const mail = require(path.join(__dirname, "..", "..", "mailer.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.submit_find = function(USERID){

    var self = this;
    console.log(JSON.stringify(self.req.post));
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        if(self.req.post.hasOwnProperty("UENAME") && self.req.post.hasOwnProperty("EMAIL")){
            var sql = "SELECT `PASSWORD` FROM `tb_user_basic` where `UENAME` ='%s' and `EMAIL`='%s'";
            sql = util.format(sql,self.req.post["UENAME"],self.req.post["EMAIL"]);
            db.query(sql,function(){
                if(arguments.length == 1){
                    mail.getPWD(self.req.post["EMAIL"],arguments[0][0]['PASSWORD'],function(){
                        console.log(JSON.stringify(arguments));
                        if(arguments[0]=="success"){
                            self.responseDirect(200,'text/json',JSON.stringify(result));
                        }else if(arguments[0]=="faise" ){
                            result = {'success':false,'message':'请检查你的邮箱设置并联系管理员'};
                            self.responseDirect(200,"text/json",JSON.stringify(result));
                        }
                    });
                }else{
                    result = {'success':false,'message':'该邮箱没有注册过'};
                    self.responseDirect(200,"text/json",JSON.stringify(result));
                }
            });
        }else{
            result = {'success':false,'message':'非法请求'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }

    }

};


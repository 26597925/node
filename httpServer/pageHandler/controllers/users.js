var util = require('util');
var path = require('path');
var uuid = require('node-uuid');
var db = require(path.join(__dirname,"..","web_DB_config.js"));
var sessions = require(path.join(__dirname,"sessions.js"));
console.log(uuid);

exports.listAll = function(args){
    var thisObj = this;
    var sess = sessions.validate(this.req);
    var res = {};
    res.result = "success";

    if(sess){
        var usr = sess.get('user');
        if(usr && sess.get('authority') == 0){
           
            var sql = "select name,mail, notified, mobile,im,created from users where authority=1 order by created";
	    var beginQueryTime = new Date().getTime();
            db.query(sql,function(err,rows){
		res.queryTime = new Date().getTime() - beginQueryTime;
                if(!err && rows && rows.length > 0){
                    res.data = rows.map(function(val){
                        var date = val["created"] ? val["created"].getMonth() + 1 + "/" + val["created"].getDate() + "/" + val["created"].getFullYear() : "";
                        return [val["name"] || '',val["mail"] || '',  (val["notified"]?'Yes':'No')  || '' ,val["mobile"] || '',val["im"],date];
                    });
                }else{
                    res.data = [[]];
                }
                thisObj.responseDirect(200,'text/json',JSON.stringify(res));
            });    
            return;
        }
        res.result = "noauthority";
    }else{
    		logger.error("listAll expired");
        res.result = "expired";
    }
    thisObj.responseDirect(200,'text/json',JSON.stringify(res));
};
exports.addnewuser = function(args){

	var usrPara = args['usr'];
    var mb = args['mb'];
    var ptxt = args['ptxt'];

	var thisObj = this;
    var sess = sessions.validate(this.req);
    var res = {};
    res.result = "success";

    if(sess){
        var usr = sess.get('user');
        if(usr && sess.get('authority') == 0){
            var cid = uuid.v4();
			var sql = util.format("insert into users set name='%s',mail='%s', ptxt='%s', cid='%s' ; ",usrPara,mb,ptxt,cid);

         db.query(sql,function(err,rows){
				 if(!err && rows.affectedRows > 0){
					res.result = "success";
					res.data = cid;
					res.message = "注册成功";
				}else{
					res.result = "failed";
					res.message = "此用户名已存在";
				}
				thisObj.responseDirect(200,'text/html',JSON.stringify(res));
            });    
            return;
        }
        res.result = "noauthority";
    }else{
    		logger.error("addnewuser expired");
        res.result = "expired";
    }
    thisObj.responseDirect(200,'text/json',JSON.stringify(res));
};

exports.guideReset = function(args){
    this.render(['guidereset.html','guidereset.js'],{});
};

var mailer = require('mailer');
exports.resetStepA = function(args){
    var usr = new Buffer(args['usr'], 'base64').toString('binary');
    var email = new Buffer(args['email'],'base64').toString('binary');
    var sid = uuid.v4();
    var thisObj = this;
    debugger;
    if(usr && email){
        var sql = util.format("select id from users where name='%s' and mail='%s'",usr,email);
        db.query(sql,function(err,rows){
            debugger;
            if(!err && rows && rows.length > 0){
                sql = util.format("insert into reset set name='%s',sid='%s' on DUPLICATE KEY UPDATE " + 
                                  "expired=TIMESTAMPADD(HOUR,6,CURRENT_TIMESTAMP),sid='%s'",usr,sid,sid);
                debugger;
                db.query(sql,function(err,rows){
                    if(!err && rows && rows.affectedRows > 0){
                        var resUrl = util.format("http://%s/crm/resetb?sid=%s",thisObj.req.headers.host,sid);
                        debugger;
                        mailer.send({
                            host: "mail.letv.com",
                            port : "587",
                            domain: "[127.0.0.1]",
                            authentication: "login",
                            username: "p2palert",
                            password: "Letv_abc123",
                            to : email,
                            from : "p2palert@letv.com",
                            subject : "找回密码",
                            body : "尊敬的用户：\n\t您好，您已申请找回密码，点击以下链接设置新密码：\n" + resUrl
                        },function(err,result){
                            if(!err && result){
                                thisObj.responseDirect(200,'text/json',JSON.stringify({result:'success'}));
                            }else{
                                thisObj.responseDirect(200,'text/json',JSON.stringify({result:'failed'}));
                            }
                        });
                    }else{
                        thisObj.responseDirect(200,'text/json',JSON.stringify({result:'failed'}));
                    }
                });
            }else{
                thisObj.responseDirect(200,'text/json',JSON.stringify({result:'noauthority'}));
            }
        });
    }else{
        thisObj.responseDirect(200,'text/json',JSON.stringify({result:'noauthority'}));
    }
};

exports.resetStepB = function(args){
    var sid = args["sid"] || null;//required
    var thisObj = this;
    var resetErr = "<html><head><meta charset='utf-8'/><title>webp2p统计系统</title><script>" + 
            "alert('抱歉，您的链接已失效，您可以重新申请找回密码或直接登录')</script></head><body></body></html>";
    if(sid){
        var sql = util.format("select * from reset where expired > CURRENT_TIMESTAMP and sid='%s'",sid);
        db.query(sql,function(err,rows){
            if(!err && rows && rows.length > 0){
                thisObj.render(["reset.html","reset.js"],{});
            }else{
                thisObj.responseDirect(200,'text/html',resetErr);
            }
        });
    }else{
        this.responseDirect(200,'text/html',resetErr);
    }
};

exports.resetStepC = function(args){
    var sid = args["sid"] || null;//required
    var newpsw = args["npsw"] || null;//required
    var thisObj = this;
    var res = {};
    debugger;
    if(sid && newpsw){
        var sql = util.format("select name from reset where expired > CURRENT_TIMESTAMP and sid='%s'",sid);
        db.query(sql,function(err,rows){
            debugger;
            if(!err && rows && rows.length > 0){
                //sql = util.format("update users set psw='%s' where name='%s'",newpsw,rows[0]["name"]);
				sql = util.format("update users set ptxt='%s' where name='%s'",newpsw,rows[0]["name"]);
                db.query(sql,function(err,rows){
                    debugger;
                    if(!err && rows.affectedRows > 0){
                        res.result = "success";
                        res.message = "修改密码成功";
                    }else{
                        res.result = "failed";
                        res.message = "无法找到此用户名";
                    }
                    thisObj.responseDirect(200,'text/json',JSON.stringify(res));
                });
                sql = util.format("delete LOW_PRIORITY from reset where sid='%s'",sid);
                db.query(sql,function(err,rows){
                    if(err){
                        console.warn(err);
                    }
                });
            }else{
                res.result = "failed";
                res.message = "抱歉，您的链接已失效，您可以重新申请找回密码或直接登录";
                thisObj.responseDirect(200,'text/json',JSON.stringify(res));
            }
        });
    }else{
        res.result = "failed";
        res.message = "参数不正确";
        this.responseDirect(200,'text/json',JSON.stringify(res));
    }
};

exports.createUser = function(args){
    var usr = args["user"] ;
    var psw = args["psw"] ;
    var mail = args["mail"] ;
    var website = args["ws"] ;
    var mobile = args["mobile"] ;
    var im = args["im"] ;

    var res = {};
    var thisObj = this;
    if(usr && psw && mail){
        var cid = uuid.v4();
        var sql = util.format("insert into users set name='%s',cid='%s',psw='%s',mail='%s',website='%s',mobile='%s',im='%s'"
                              ,usr,cid,psw,mail,website,mobile,im);
        db.query(sql,function(err,rows){
            if(!err && rows.affectedRows > 0){
                res.result = "success";
                res.data = cid;
                res.message = "注册成功";
            }else{
                res.result = "failed";
                res.message = "此用户名已存在";
            }
            thisObj.responseDirect(200,'text/html',JSON.stringify(res));
        });
    }else{
        res.result = "failed";
        res.message = "参数不正确";
        thisObj.responseDirect(200,'text/html',JSON.stringify(res));
    }
};


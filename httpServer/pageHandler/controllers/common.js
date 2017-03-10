var util = require('util');
var path = require('path');
var sessions = require(path.join(__dirname,"sessions.js"));
var db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));

exports.index = function(){
    sessions.createAuthorize("aaa","bbb");
    this.render(['login.html','login.js'], {message:''});
};

MyConvertDateToSqlTs = function(d) {
    var val_tsDate = (d.getFullYear()).toString() + '-' + (d.getMonth() + 1).toString() + '-' + (d.getDate()).toString();
    var val_tsDateTime = val_tsDate + ' ' + d.toLocaleTimeString();
    return val_tsDateTime;
};

exports.exit = function(){
    var sess = sessions.validate(this.req);
    if(sess){
        sess.destory();
    }
    this.responseDirect(200,'text/json','');
};

exports.login = function(args){
	var thisObj = this;
  var usr = args["usr"] || null;
  var psw = args["psw"] || null;
  if(usr && psw){
  	var userStatement = "select authority,cid from users where name= '" + usr + "' and ptxt = '" + psw + "'";
	
  	db.query(userStatement,function(err,rows){
  		if(!err && rows && rows.length > 0 ){
  				sessions.startSession(thisObj.req,thisObj.res,usr,function(sess){
  				sess.set('authority',Number(rows[0]['authority']));
  				sess.set('user',usr);
  				sess.set('cid',rows[0]['cid']);
  			});
  			var res = {'success':true,'message':'登录成功'};
				thisObj.responseDirect(200,'text/json',JSON.stringify(res));
				return;
  		}else
		{
			
			res = {'success':false,'message':'用户名或密码错误，请重新登录'};
			thisObj.responseDirect(200,"text/json",JSON.stringify(res));
		}
  	});
	}else{
		
		this.handler404(this.req,this.res);
	}
};

exports.modifypsw = function(args){
	var thisObj = this;
    var sess = sessions.validate(this.req);
    if(sess){
        var old_psw = args['opsw'] || null;
        var new_psw = args['npsw'] || null;
        var usr = sess.get('user');       
        debugger;
        if(usr && old_psw && new_psw){
						var sql = util.format("update users set ptxt='%s' where name='%s' and ptxt='%s' ; ",new_psw,usr,old_psw);
            db.query(sql,function(err,rows){
                debugger;
                if(!err && rows && rows.affectedRows > 0){
                    thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'success'}));
                }else{
                    thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'failed'}));
                }
            });
        }else{
            thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'failed'}));
        }
    }else{
        thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'expired'}));
    }
};

var adminNav = "<h5><a href='#'>用户管理</a></h5>"
        + "<div> <a href='#' id='aalluser'>用户一览</a> <br />  "
        + "	     <a href='#' id='a_anu_full'>添加用户</a> <br />  </div>";

var advPart = " <a id='svr_groupids' href='#'>GroupID </a> <br /> ";
var advPartHis = "<a href='#' id='historydata_hgdd_here'>Group ID历史数据</a><br />";

var versionManager = "<a href='#' id='version_set'>上线版本号管理</a><br />";

exports.main = function(){
    var sess = sessions.validate(this.req);
    if(sess){
      if(sess.get('authority') == 0){
          this.render(['main.html','main.js'], {admin:adminNav, advpart: '', advparthis: advPartHis,versionManager:versionManager  });
      }else{
          this.render(['main.html','main.js'], {admin:'', advpart: '', advparthis:'',versionManager:''} );
      }
    }else{
        this.render(['login.html','login.js'], {message:''});
    }
};

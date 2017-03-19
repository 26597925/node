var util = require('util');
var path = require('path');
var sessions = require(path.join(__dirname,"sessions.js"));
var db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));

exports.index = function(){
    this.render(['login.html','login.js'], {message:''});
};

exports.logup =function(){

    this.render(['login_up.html','login_up.js'], {message:''});
}

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
            //INSERT INTO `tb_user_basic` (`USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `userLastLogin`, `ONLINE`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES ('0', '0', 'test3', '测试3', '15801278254', '111111', 'zvxvc', 'qweqwe', '0', '0', NULL, '0', CURRENT_TIMESTAMP, '0000-00-00 00:00:00.000000', 'sdasdsda');
            var sql = "INSERT INTO `tb_user_basic` "
            +"( `UENAME`, `UCNAME`, `PHONENUMBER`, `PASSWORD`, `ADDRESS`, `ZIPCODE`)"
            +" VALUES ( '"+self.req.post["UENAME"]+"', '"
                +self.req.post["UCNAME"]+"', '"
                +self.req.post["PHONENUMBER"]+"', '"
                +self.req.post["PASSWORD"]+"', '"
                +self.req.post["ADDRESS"]+"', '"
                +self.req.post["ZIPCODE"]+"')";
            db.query(sql,function(){
                console.log("insert",JSON.stringify(arguments));
                result = {'success':false,'message':'数据非法2'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            })
        }else{
            result = {'success':false,'message':'数据非法1'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    }
}

exports.logup_submit = function(){
    var self = this;
    var result = {'success':true,'message':'登录成功'};
    if(self.req.post){
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `winners`.`tb_user_basic` where `UENAME`='"+this.req.post["UENAME"]+"' and `PASSWORD`='"+this.req.post["PASSWORD"]+"'";
        db.query(sql,function(){
            debugger
            if(arguments.length==0){
                add_newUser(self);
            }else if(arguments.length==1){
                result = {'success':false,'message':'该用户名已经注册过'};
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
}

MyConvertDateToSqlTs = function(d) {
    var val_tsDate = (d.getFullYear()).toString() + '-' + (d.getMonth() + 1).toString() + '-' + (d.getDate()).toString();
    var val_tsDateTime = val_tsDate + ' ' + d.toLocaleTimeString();
    return val_tsDateTime;
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
	var self = this;
    var usr = args["usr"] || null;
    var psw = args["psw"] || null;
    // SELECT `USERID`, `GROUPID`, `UENAME`, `UCNAME`, `PHONENUMBER`, 
    //`PASSWORD`, `ADDRESS`, `ZIPCODE`, `TYPEID`, `STATUS`, `userLastLogin`, 
    //`ONLINE`, `ADDTIME`, `MODTIME`, `REMARK` FROM `winners`.`tb_user_basic`
    
    if(usr && psw){
        var sql = "SELECT `USERID`, `GROUPID`, `UENAME`, `PASSWORD`  FROM `winners`.`tb_user_basic` where `UENAME`='"+usr+"' and `PASSWORD`='"+psw+"'";
        db.query(sql,function(){
            var result = {'success':true,'message':'登录成功'};
            if(arguments.length==1){
                require("./common.js").updateLoginTime(arguments[0]['USERID'],self);
            }else{
                result = {'success':false,'message':'用户名或密码错误，请重新登录'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        });

	}else{
		self.handler404(self.req,self.res);
	}
};

exports.updateLoginTime = function(USERID,context){
   
    var self = this;
    if(context){self = context;}
    var req = this.req || context.req;
    var res = this.res || context.res;
    var SID = sessions.createSID();
    sessions.setCookie(req,res,SID,USERID);
    var sql2 = "UPDATE `tb_user_basic` SET `userLastLogin` = '"+SID+"' WHERE `tb_user_basic`.`USERID` = "+USERID+" "
    var result = {'success':true,'message':'登录成功'};
    db.query(sql2,function(){
        if(arguments.length==1){
            self.responseDirect(200,'text/json',JSON.stringify(result));
        }else{
            result = {'success':false,'message':'用户已经过期，请重新登录'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    });
}



// exports.modifypsw = function(args){
// 	var thisObj = this;
//     var sess = sessions.validate(this.req);
//     if(sess){
//         var old_psw = args['opsw'] || null;
//         var new_psw = args['npsw'] || null;
//         var usr = sess.get('user');       
       
//         if(usr && old_psw && new_psw){
// 						var sql = util.format("update users set ptxt='%s' where name='%s' and ptxt='%s' ; ",new_psw,usr,old_psw);
//             db.query(sql,function(err,rows){
               
//                 if(!err && rows && rows.affectedRows > 0){
//                     thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'success'}));
//                 }else{
//                     thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'failed'}));
//                 }
//             });
//         }else{
//             thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'failed'}));
//         }
//     }else{
//         thisObj.responseDirect(200,'text/html',JSON.stringify({'result':'expired'}));
//     }
// };

var adminNav = "<h5><a href='#'>用户管理</a></h5>"
        + "<div> <a href='#' id='aalluser'>用户一览</a> <br />  "
        + "	     <a href='#' id='a_anu_full'>添加用户</a> <br />  </div>";

var advPart = " <a id='svr_groupids' href='#'>GroupID </a> <br /> ";
var advPartHis = "<a href='#' id='historydata_hgdd_here'>Group ID历史数据</a><br />";

var versionManager = "<a href='#' id='version_set'>上线版本号管理</a><br />";

exports.main = function(){
    var self = this;
    // var sess = sessions.validate(this.req);
    // this.render(['main.html','main.js'], {admin:'', advpart: '', advparthis:'',versionManager:''} );
    // if(sess){
    //   if(sess.get('authority') == 0){
    //       this.render(['main.html','main.js'], {admin:adminNav, advpart: '', advparthis: advPartHis,versionManager:versionManager  });
    //   }else{
    //       this.render(['main.html','main.js'], {admin:'', advpart: '', advparthis:'',versionManager:''} );
    //   }
    // }else{
        sessions.invalidate(self.req);
        self.render(['login.html','login.js'], {message:''});
    // }
};

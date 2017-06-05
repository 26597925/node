const util = require('util');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const sessions = require(path.join(__dirname,"sessions.js"));
const login = require(path.join(__dirname,"login.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.heartTime = function(){

  var self = this;
	var parentAlias = this.alias;
	var callback;
	if(arguments.length>0){
		callback = arguments[0];
	}
	
  var cookies = sessions.parseCookies(this.req.headers.cookie);
  var USERID = sessions.get_uID(this.req);
  var result = {'success':true,'message':'登录成功'};
	
	if(cookies["sID"] != null && cookies["uID"] != null ){

    var sql = "select `LASTLOGIN` from `tb_user_basic` WHERE `tb_user_basic`.`USERID` = "+USERID+" ";
    db.query(sql,function(){
      console.log(JSON.stringify(arguments));
      debugger;
      if(arguments.length == 1){

        if(arguments[0][0]['LASTLOGIN']){
          // var dblogtime = sessions.invertTimestamp(arguments[0][0]['LASTLOGIN']);
          var cookieTime = sessions.invertTimestamp(cookies["sID"]);
          var currentTime = (new Date()).getTime();

          console.log(
            "cookieTime\n"
		        ,cookieTime
		        ,'\ncurrentTime\n'
		        ,currentTime
		        ,"=\n"
		        ,(currentTime-cookieTime)
          );
         
          if(arguments[0][0]['LASTLOGIN'] != cookies["sID"]){
	          if(parentAlias == 'root'){
		          result.success = false;
		          result.message = "你的账号已经在其他地方登录，如果不是你本人操作，请联系管理员冻结账号";
		          self.responseDirect(200,'text/json',JSON.stringify(result));
	          }else if(parentAlias == 'common.js' ){
	          	if(callback){
			          callback("failse",self);
		          }
	          }
            return;
          }
					
				 	if(parentAlias == 'root'){
					  self.alias = "heart";
					  self.SID = cookies["sID"];
					  login.updateLoginTime.apply(self,[USERID]);
				 	}else if(parentAlias == 'common.js' ){
					 	if(callback){
						  console.log('heartTime',(currentTime-cookieTime)/1000);
						  if((currentTime-cookieTime)/1000<1800 && cookieTime >1496481600000){
							  callback("success",self);
						  }else{
							  callback("failse",self);
						  }
					 	}
				 	}

        }else{
	        if(parentAlias == 'root'){
		        result.success = false;
		        result.message = "数据异常! code 1 -null -heartTime";
		        self.responseDirect(200,'text/json',JSON.stringify(result));
	        }else if(parentAlias == 'common.js' ){
					 	if(callback){
							callback("failse",self);
					 	}
	        }
        }

      }else{
	      if(parentAlias == 'root'){
		      result.success = false;
		      result.message = "数据异常! code 2 -empty -heartTime";
		      self.responseDirect(200,'text/json',JSON.stringify(result));
	      }else if(parentAlias == 'common.js' ){
	       	if(callback){
						callback("failse",self);
				 	}
	      }

      }
    });

  }else{
		if(parentAlias == 'root'){
			result.success = false;
			result.message = "heartTime ck 数据异常! ";
			self.responseDirect(200,'text/json',JSON.stringify(result));
		}else if(parentAlias == 'common.js' ){
		 	if(callback){
		 	 	callback("failse",self);
			}
		}
  }
};



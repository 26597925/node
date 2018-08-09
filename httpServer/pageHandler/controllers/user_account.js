const http = require('http');
const util = require('util');
const path = require('path');
// var zlib = require("zlib");
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
//const localIP = require(path.join(__dirname,"..","..","..",'localIP'));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const cfg_httpserver = require(path.join(__dirname, "..", "..", "..", "Config_HttpServer.js"));
//查询账户
exports.select_userAccount = function(){
	var self = this;

	var uID = sessions.get_uID(self.req);
 
	var result = {'success':true,'data':''};
	var sql = "select" +
    " `tb_capital_conf`.`USERID`," +
    " `tb_user_account`.`TRADEID`," +
    " `tb_capital_conf`.`ACCOUNTID`," +
	" `tb_user_account`.`ADDTIME`," +
    " `CANAME`," +
    " `PASSWORD`," +
	" `TXPASSWD`," +
    " `MAXBUY`," +
    " `BUYCOUNT`," +
    " `BUYAMOUNT`,  " +
	" now() AS STIME" +
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
    console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),"select_userAccount", arguments);
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

//修改账号，包含添加用户时，用户账号已经存在也走修改账号的流程
exports.modify_userAccount = function(){
    
  var self = this;
  var ID = sessions.get_uID(self.req);
  
  var result = {'success':true,'data':''};
  if(self.req.post){
    if( self.req.post.hasOwnProperty("TRADEID")
      &&self.req.post.hasOwnProperty("ACCOUNTID")
      &&self.req.post.hasOwnProperty("PASSWORD")
      &&self.req.post.hasOwnProperty("TXPASSWD")
    ){
      console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),'modify_userAccount',JSON.stringify(self.req.post));

        reqRSA('["'+self.req.post["PASSWORD"]+'","'+self.req.post["TXPASSWD"]+'"]',function(result_p){

            var PASSWORD="", TXPASSWD="";

            if(result_p instanceof Array ){
                for(var id=0; id < result_p.length; id ++){
                    if(id == 0 ){
                        PASSWORD = result_p[id][String(self.req.post["PASSWORD"])];
                        continue;
                    }

                    if(id == 1 ){
                        TXPASSWD = result_p[id][String(self.req.post["TXPASSWD"])];
                    }
                }

                var sql_slt_pwd = "select `PASSWORD`, `TXPASSWD`  FROM tb_user_account where `ACCOUNTID` = %s";
                sql_slt_pwd = util.format(sql_slt_pwd,self.req.post["ACCOUNTID"]);

                db.query(sql_slt_pwd,function(){
                    //资本表
                    //UPDATE `tb_user_account` SET `ADDTIME`='2017-07-14 00:00:00' where `ACCOUNTID`=309219249819;
                    var sql1 = "UPDATE `tb_capital_conf` SET " +
                        // " `USERID` = '%s', " +
                        " `MAXBUY` = '%s', " +
                        " `BUYCOUNT` = '%s', " +
                        " `BUYAMOUNT` = '%s', " +
                        " `MODTIME` = '%s' " +
                        " WHERE " +
                        " `ACCOUNTID` = '%s'";
                    sql1 = util.format(sql1,
                        //ID,
                        self.req.post["MAXBUY"]
                        ,self.req.post["BUYCOUNT"]
                        ,self.req.post["BUYAMOUNT"]
                        ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
                        ,self.req.post["ACCOUNTID"]
                    );
                    //券商表
                    var sql2 = '';
                    //添加时，已经存在的用户
                    if(self.alias == "add"){
                        sql2= "UPDATE `tb_user_account` SET " +
                            // " `USERID` = '%s', " +
                            " `PASSWORD` = '%s', " +
                            " `TXPASSWD` = '%s', " +
                            " `MODTIME`=now(), " +
                            " `VISIBLE` = '1'" +
                            " WHERE " +
                            " `TRADEID` = %s " +
                            " AND " +
                            " `ACCOUNTID` = '%s'";
                        sql2 = util.format(sql2,
                            //ID
                            // self.req.post["PASSWORD"]
                            PASSWORD
                            // ,self.req.post["TXPASSWD"]
                            ,TXPASSWD
                            ,self.req.post["TRADEID"]
                            ,self.req.post["ACCOUNTID"]
                        );
                    }else{
                        sql2= "UPDATE `tb_user_account` SET " +
                            // " `USERID` = '%s', " +
                            " `MODTIME`=now(), " +
                            " `PASSWORD` = '%s', " +
                            " `TXPASSWD` = '%s' " +
                            // ", " +
                            " WHERE " +
                            " `TRADEID` = %s " +
                            " AND " +
                            " `ACCOUNTID` = '%s'";
                        sql2 = util.format(sql2,
                            //ID
                            // self.req.post["PASSWORD"]
                            PASSWORD
                            // ,self.req.post["TXPASSWD"]
                            ,TXPASSWD
                            ,self.req.post["TRADEID"]
                            ,self.req.post["ACCOUNTID"]
                        );
                    }


                    try{
                        db.transaction(sql1,sql2,function(){
                            self.responseDirect(200,"text/json",JSON.stringify(result));
                        });
                    }catch(err){
                        console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),'modify_userAccount',JSON.stringify(err));
                        result = {'success':false,'message':'非法请求数据，请联系管理员'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }
                });

                console.log("start",PASSWORD,TXPASSWD,"end");
            }else{
                result = {'success':false,'message':'非法请求数据，请联系管理员'};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }

        });
      
    }else{
      result = {'success':false,'message':'非法请求数据，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
        
  }else{
      result = {'success':false,'message':'非法请求数据，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
  }
};


//
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

//
exports.add_userAccount = function(){

  var self = this;
  var result = {'success':true,'data':''};
	
  if(self.req.post){
    if( self.req.post.hasOwnProperty("TRADEID")
      &&self.req.post.hasOwnProperty("ACCOUNTID")
      &&self.req.post.hasOwnProperty("PASSWORD")
	    &&self.req.post.hasOwnProperty("TXPASSWD")
      &&self.req.post.hasOwnProperty("MAXBUY")
      &&self.req.post.hasOwnProperty("BUYCOUNT")
      &&self.req.post.hasOwnProperty("BUYAMOUNT")
    ){
      console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),'add_userAccount',JSON.stringify(self.req.post));
      
      var param = "?tradeid="+self.req.post["TRADEID"]
        +"&accountid="+self.req.post["ACCOUNTID"]
        +"&password="+self.req.post["PASSWORD"]
        +"&txpassword="+(self.req.post["TXPASSWD"]?self.req.post["TXPASSWD"]:"")
        +"&rdm="+Math.ceil(Math.random()*10000);
     
      var url = cfg_httpserver.account.url+param;
      console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),'param',url);
      http_get(url,function(hresult,url){
        try{
          // hresult = '{ "status": 200, "tradeid": 1, "accountid": "'+Math.floor(Math.random()*1000000000)+'", "shanghai_code": "A382208153", "shenzhen_code": "0150916266", "account_name": "李洪福", "detail": "successful" }'
          // hresult = '{ "status": 200, "tradeid": '+self.req.post["TRADEID"]+', "accountid": "'+self.req.post["ACCOUNTID"]+'", "shanghai_code": "A382208153", "shenzhen_code": "0150916266", "account_name": "李洪福", "detail": "successful" }'
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
        //{ "status": 200, "tradeid": 2, "accountid": "5890000049", "shanghai_code": "A738685727", "shenzhen_code": "0125561330", "account_name": "夏彦刚", "detail": "successful" }
        //{ "status": 403, "tradeid": 4, "accountid": "10500998", "shanghai_code": "", "shenzhen_code": "", "account_name": "", "detail": "连接交易服务器失败, 请尝试其它交易服务器。" }
      });
    }else{
      result = {'success':false,'message':'请求数据参数错误 001'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
  }else{
    result = {'success':false,'message':'请求数据类型错误 002'};
    self.responseDirect(200,"text/json",JSON.stringify(result));
  }
};
//
var insert_userAccount = function(context,account_result){
    
  var self = context;
  var post = context.req.post;
  var ID = sessions.get_uID(context.req);
  var result = {'success':true,'data':''};
  var sql = "SELECT `TRADEID`, `ACCOUNTID` FROM `tb_user_account` WHERE `TRADEID` = %s AND `ACCOUNTID` = '%s'";
  sql = util.format(sql,account_result['tradeid'],account_result['accountid']);

  //请求RSA接口，存储加密数据
  reqRSA('["'+post["PASSWORD"]+'","'+post["TXPASSWD"]+'"]',function(result_p){
      var PASSWORD = "", TXPASSWD = "";

      if(result_p instanceof Array ){
          //目前只请求PASSWORD TXPASSWD，如果请求多个可以id%2=0，id%2=1来做判断获得PASSWORD TXPASSWD数组
          for(var id=0; id < result_p.length; id ++){
              if(id == 0 ){
                  PASSWORD = result_p[id][String(self.req.post["PASSWORD"])];
                  continue;
              }

              if(id == 1 ){
                  TXPASSWD = result_p[id][String(self.req.post["TXPASSWD"])];
              }
          }

          db.query(sql,function(){
              if(arguments.length == 0){
                  var sql1 = "INSERT INTO `tb_user_account` (" +
                      "`USERID`, " +//1
                      "`TRADEID`, " +//2
                      "`ACCOUNTID`, " +//3
                      "`PASSWORD`, " +//4
                      "`TXPASSWD`, " +//5
                      "`CANAME`, " +//6
                      "`EXCHGID_SH`, " +//7
                      "`EXCHGID_SZ`, " +//8
                      "`ADDTIME`" +//9
                      ") VALUES (" +
                      "%s" +//1
                      ",%s" +//2
                      ",'%s'" +//3
                      ",'%s'" +//4
                      ",'%s'" +//5
                      ",'%s'" +//6
                      ",'%s'" +//7
                      ",'%s'" +//8
                      ",'%s'" +//9
                      ")";

                  sql1 = util.format(sql1,
                      ID
                      , account_result['tradeid']
                      , account_result['accountid']
                      //,post["PASSWORD"]
                      ,PASSWORD
                      //,post["TXPASSWD"]
                      ,TXPASSWD
                      , account_result['account_name']
                      , account_result['shanghai_code']
                      ,account_result['shenzhen_code']
                      , unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
                  );

                  // INSERT INTO `tb_capital_conf` (`ACCOUNTID`, `USERID`, `MAXBUY`, `BUYCOUNT`, `BUYAMOUNT`, `PERCENT`, `SPLITCOUNT`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES
                  // ('301719804403', 20000, 0, 0, 0, 0.4, 1, '2017-02-23 01:11:14', '2017-02-23 09:10:06', ''),

                  var sql2 = "INSERT INTO `tb_capital_conf` (" +
                      " `ACCOUNTID`," +
                      " `USERID`," +
                      " `MAXBUY`, " +
                      " `BUYCOUNT`," +
                      " `BUYAMOUNT`," +
                      "`ADDTIME`" +
                      ") VALUES(" +
                      "'%s'," +
                      " %s," +
                      " %s, " +
                      " %s," +
                      " %s," +
                      "'%s'" +
                      ")";

                  sql2 = util.format(sql2,
                      account_result['accountid']
                      ,ID
                      ,post["MAXBUY"]
                      ,post["BUYCOUNT"]
                      ,post["BUYAMOUNT"]
                      ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
                  );
                  console.log(unit_date.getTime(),"db.transaction",sql1,sql2);
                  try{
                      db.transaction(sql1,sql2,function(){
                          context.responseDirect(200,"text/json",JSON.stringify(result));
                      });
                  }catch(err){
                      console.log(unit_date.getTime(),path.basename(__filename).replace('.js',''),"catch",err);
                      result = {'success':false,'message':'操作数据库异常'+path.basename(__filename).replace('.js','')};
                      self.responseDirect(200,"text/json",JSON.stringify(result));
                  }

              }else{
                  console.log(unit_date.getTime(),"db.transaction",self.alias);//var parentAlias = this.alias;

                  self.alias = "add";
                  require("./user_account.js").modify_userAccount.apply(self);
                  // result = {'success':false,'message':'该帐号已经存在，如有问题请联系管理员'+path.basename(__filename).replace('.js','')};
                  // self.responseDirect(200,"text/json",JSON.stringify(result));
              }
          });

      }else{

          result = {'success':false,'message':'操作数据库异常'+path.basename(__filename).replace('.js','')};
          self.responseDirect(200,"text/json",JSON.stringify(result));
      }


  });
    

};

//请求券商信息
var http_get=function(url,callback,param){
  
  http.get(url,function(res){
    console.log(unit_date.getTime(),"user_account","http_get",url );
    var result="";
    res.setEncoding("utf8");
    // res.setEncoding("gbk");
    res.on("data",function(chunk){
      result += chunk;
    });
    res.on("end",function(){
      console.log(unit_date.getTime(),"老夏接口",JSON.stringify(result));
      if(param){
        callback(result,url,param);
      }else{
        callback(result,url);
      }
    });
  }).on("error",function(err){
    console.log(unit_date.getTime(),"error>>>",err);
    callback("error>>>"+JSON.stringify(err.message),url);
  })
};


//请求RSA，reqRSA('["123456","654321"]',function(result){})
var reqRSA = function(param, cb){


    var options = {};
    options = Object.assign(options,cfg_httpserver.rsa);
    options.path = options.path +"?rand="+Math.ceil(Math.random()*10000);
    console.log(options);
    var _req = http.request(options, function(res) {
        var html="",output;
        if(res.headers["content-encoding"]=="gzip"){
            var gzip=zlib.createGunzip();
            res.pipe(gzip);
            output=gzip;
        }else{
            output=res;
        }
        output.on("data",function(data){
            data=data.toString("utf-8");
            html+=data;
        });
        output.on("end",function(){
            //返回结果
            try{
               // console.log("<<<<<<<<<:",typeof(html) ,html);
                html = JSON.parse( html );

            }catch(err){
                console.log("err::::",err);
                html = {"success":"false","msg":err.message,"codeID":"0005"}
            }

            if(cb){
                cb(html);
            }
        })
    }).on("error", function(e) {
        if(cb){
            cb({"success":"false","msg":e.message,"codeID":"0001"})
        }

    });
    console.log("param:",param)
    _req.write(param);

    _req.end();
};

//http://106.39.244.172:8080/account/gddm?tradeid=4&accountid=10500998&password=1111111

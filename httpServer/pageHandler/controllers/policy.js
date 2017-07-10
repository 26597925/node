const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));


exports.select_subscrible = function(){

  var self = this;
  var result = {'success':true,'data':''};

  var uID = sessions.get_uID(self.req);
  var sql = "SELECT  `GROUPID`  FROM `tb_user_basic` where `USERID`="+uID;

  db.query(sql,function(){
    if(arguments.length==1){
      select_combinePolicy(arguments[0][0],uID,self);
    }else if(arguments.length==0){
      result = {'success':true,'data':[]};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    } else{
      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'数据查询失败，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
  })
   
};

var select_combinePolicy = function(){

  var groupID = arguments[0]['GROUPID'];
  var uID = arguments[1];
  var self = arguments[2];

  var result = {'success':true,'data':''};

  var sql = "select `POLICYID`, `PGROUPID`, `PNAME`, `DIRTYPE`,"
    +" `USERID`,`USETYPE`, `POLICYPARAM`, `STARTTIME`, `ENDTIME`,"
    +" `STOCKSET`, `PERCENT`,  `ISTEST`, `PRICES`, `ADDTIME`, `MODTIME`, `FLAG` "
    +"from  tb_policy_define where (`USERID`="+uID
    +" and`FLAG`=1) or (`USERID`=0 and ISTEST=0 and FLAG=1)";

  var sql2 = "select  `USERID`, `PNAME`, `DIRTYPE`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `STARTTIME`,"
    +" `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `PRICES`, `ADDTIME`, `MODTIME`, `FLAG`,"
    +" `SUBSCRBLE`, `PERCENT` "
    +"from  tb_policy_usage where (`USERID`="+uID
    +"  and `FLAG`=1 ) or ( `USERID`=0 and ISTEST=0 and `FLAG`=1)  ";

  var result1,result2;

  db.query(sql,function(){
    if(arguments.length==1){

      console.log(path.basename(__filename).replace('.js',''),"select_combinePolicy",arguments[0]);

      var groupList = [];
      result1 = [];
	         
      for(var i=0; i < arguments[0].length; i++){
        groupList=[];
        groupList = arguments[0][i]["USETYPE"].split(",");
        if(groupList.indexOf(groupID.toString())>=0){
          result1.push(arguments[0][i]);
        }
              //groupList = groupList.concat(arguments[0][i]["USETYPE"].split(","));
      }

      // if(groupList.indexOf(groupID.toString())>=0){
      //
      //     result1= arguments[0];
      if( result1.length > 0 ){
        db.query(sql2,function(){
          if(arguments.length==1){
            result2=arguments[0];
            result.data = combinePolicyResult(result1,result2);
            self.responseDirect(200,"text/json",JSON.stringify(result));
          }else{
            result.data = combinePolicyResult(result1,[]);
            self.responseDirect(200,"text/json",JSON.stringify(result));
          }
        });
            
      }else{
        result = {'success':true,'data':''};
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }
    }else{
      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'数据查询失败1，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
  });
};

var combinePolicyResult=function(){

  var result1=arguments[0];
  var result2=arguments[1];
  var obj = {};

  // column_name
  // USERID
  // POLICYID
  // POLICYPARAM
  // STARTTIME
  // ENDTIME
  // STOCKSET
  // ISTEST
  // STATUS
  // FLAG
  // REMARK
  // SUBSCRBLE
  // PNAME
//
  var MODTIME = "";
  for(var i = 0; i < result2.length; i++){
    MODTIME = result2[i]['MODTIME'];
    if(!unit_date.matchYMD(MODTIME,1))
    {
      MODTIME = unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss");
    }
    console.log("policy combinePolicyResult:",new Buffer(result2[i]['POLICYPARAM'], 'base64').toString('UTF8'));
    obj[result2[i]['POLICYID'] ] =
      {
        USERID:result2[i]['USERID'],
        PGROUPID:result2[i]['PGROUPID'],
        PNAME :result2[i]['PNAME'],
        DIRTYPE: result2[i]['DIRTYPE'],
        POLICYID :result2[i]['POLICYID'],
        POLICYPARAM :JSON.parse(new Buffer(result2[i]['POLICYPARAM'], 'base64').toString('UTF8')),
        STARTTIME :unit_date.toHMS(result2[i]['STARTTIME']),
        ENDTIME :unit_date.toHMS(result2[i]['ENDTIME']),
        STOCKSET :result2[i]['STOCKSET'],
        ISTEST :result2[i]['ISTEST'],
        STATUS :result2[i]['STATUS'],
        FLAG :result2[i]['FLAG'],
        REMARK :result2[i]['REMARK'],
        SUBSCRBLE :result2[i]['SUBSCRBLE'],
        PERCENT :result2[i]['PERCENT'],
        PRICES :result2[i]['PRICES'],
        ADDTIME :unit_date.Format(new Date(result2[i]['ADDTIME']),"yyyy-MM-dd HH:mm:ss"),
        MODTIME :MODTIME
      };
//
    }

    for(var i = 0; i < result1.length; i++){

      // if(obj.hasOwnProperty(result1[i]['USERID']+"_"+result1[i]['POLICYID'])){
      if(obj.hasOwnProperty(result1[i]['POLICYID'])){
        continue;
      }else{
        MODTIME = result1[i]['MODTIME'];
        if(!unit_date.matchYMD(MODTIME,1))
        {
          MODTIME = unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss");
        }
	
        console.log("policy combinePolicyResult:",new Buffer(result1[i]['POLICYPARAM'], 'base64').toString('UTF8'));
        obj[ result1[i]['USERID']+"_"+result1[i]['POLICYID'] ] = {
          USERID:result1[i]['USERID'],
          PGROUPID:result1[i]['PGROUPID'],
          PNAME :result1[i]['PNAME'],
          DIRTYPE: result1[i]['DIRTYPE'],
          POLICYID :result1[i]['POLICYID'],
          POLICYPARAM :JSON.parse(new Buffer(result1[i]['POLICYPARAM'], 'base64').toString('UTF8')),
          STARTTIME :unit_date.toHMS(result1[i]['STARTTIME']),
          ENDTIME :unit_date.toHMS(result1[i]['ENDTIME']),
          STOCKSET :result1[i]['STOCKSET'],
          ISTEST :result1[i]['ISTEST'],
          STATUS :0,
          FLAG :result1[i]['FLAG'],
          REMARK :result1[i]['REMARK'],
          SUBSCRBLE :0,
          PERCENT :result1[i]['PERCENT'],
          PRICES :result1[i]['PRICES'],
          ADDTIME :unit_date.Format(new Date(result1[i]['ADDTIME']),"yyyy-MM-dd HH:mm:ss"),
          MODTIME :MODTIME
        }
      }
    }

    var arr = [];
    for(var elm in obj){
      if(obj[elm]['SUBSCRBLE']==0){
        arr.push(obj[elm])
      }
    }

    console.log(path.basename(__filename).replace('.js',''),'combinePolicyResult ',JSON.stringify(obj));
    debugger;
    return arr;
};


exports.select_alreadySubscrible = function(){

  console.log( path.basename(__filename).replace('.js',''),"alias select_alreadySubscrible:",JSON.stringify(this.alias) );

  var self = this;
  var result = {'success':true,'data':''};
  var uID = sessions.get_uID(self.req);

  var sql = "select  `USERID`, `PNAME`, `DIRTYPE`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `STARTTIME`,"
    +" `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FLAG`,"
    +" `SUBSCRBLE`, `PERCENT` "
    +"from  tb_policy_usage where ((`USERID`="+uID
    +" and `FLAG`=1) or (`USERID`=0 and ISTEST=0 and `FLAG`=1) ) and SUBSCRBLE=1 order by MODTIME desc";

  db.query(sql,function(){
    if(arguments.length==1){
      result.data = arguments[0];
      
      for(var i = 0; i < result.data.length; i++){
        result.data[i]['STARTTIME'] = unit_date.toHMS(result.data[i]['STARTTIME']);
        result.data[i]['ENDTIME'] = unit_date.toHMS(result.data[i]['ENDTIME']);
        result.data[i]['POLICYPARAM'] = JSON.parse(new Buffer(result.data[i]['POLICYPARAM'], 'base64').toString('UTF8'));
      }

      self.responseDirect(200,"text/json",JSON.stringify(result));
    }else if(arguments.length==0){
      result = {'success':true,'data':[]};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }else{
      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
  });
};

exports.update_subscrible = function(){
  var self = this;
  var result = {'success':true,'data':''};
  var uID = sessions.get_uID(self.req);
    
  if(self.req.post){
    console.log(path.basename(__filename).replace('.js',''),'update_subscrible ',self.req.post);

    var sql = '';
    var db_type = 'insert';
    sql = "SELECT `USERID`, `POLICYID` FROM  tb_policy_usage where USERID="
      + uID
      + " and POLICYID="+self.req.post["POLICYID"];
    db.query(sql,function(){
      if(arguments.length==1){
        db_type = 'update';
      }
      if(self.req.post.hasOwnProperty('POLICYPARAM')
        && self.req.post['POLICYPARAM']
      ){
        self.req.post['POLICYPARAM'] = new Buffer(JSON.stringify(self.req.post['POLICYPARAM'])).toString('base64');
      }else{
        self.req.post['POLICYPARAM'] = '';
      }
	          
      console.log("policy update_subscrible:",self.req.post['POLICYPARAM']);
      var STARTTIME = unit_date.objToNumber(self.req.post['STARTTIME']); // (!self.req.post['STARTTIME']) ?unit_date.Format(new Date(),'yyyy-MM-dd'):self.req.post['STARTTIME'];
      var ENDTIME = unit_date.objToNumber(self.req.post['ENDTIME']); //(!self.req.post['ENDTIME']) ?unit_date.Format(new Date(),'yyyy-MM-dd'):self.req.post['ENDTIME'];

      self.req.post['STOCKSET'] = (!self.req.post['STOCKSET'])?"":self.req.post['STOCKSET'];
      self.req.post['STATUS'] = (!self.req.post['STATUS'])?0:self.req.post['STATUS'];
      self.req.post['FLAG'] = (!self.req.post['FLAG'])?0:self.req.post['FLAG'];
      console.log(path.basename(__filename).replace('.js',''),"update STARTTIME:",STARTTIME,'ENDTIME:',ENDTIME);

      if(db_type == 'insert'){
        sql = "INSERT INTO `tb_policy_usage` (" +
          "`USERID`" +
	        ", `PNAME`" +
	        ", `PGROUPID`" +
          ", `POLICYID`" +
	        ", `POLICYPARAM`" +
	        ", `DIRTYPE`" +
          ", `STARTTIME`" +
	        ", `ENDTIME`" +
	        ", `STOCKSET`" +
          ", `ISTEST`" +
	        ", `STATUS`" +
	        ", `PRICES`" +
          ", `MODTIME`" +
	        ", `FLAG`" +
	        ", `SUBSCRBLE`" +
	        ", `PERCENT`" +
          ")VALUES(" +
          "%s" +
	        ", '%s'" +
	        ", %s" +
          ", %s" +
	        ", '%s'" +
	        ", %s" +
          ", %s" +
	        ", %s" +
	        ", '%s'" +
          ", %s" +
	        ", %s" +
	        ", %s" +
          ", '%s'" +
	        ", %s" +
	        ", %s" +
	        ", " +
          "%s)";
        sql = util.format(sql,
          // self.req.post['USERID']
          uID,self.req.post['PNAME']
	        ,self.req.post['PGROUPID']
          ,self.req.post['POLICYID']
	        ,self.req.post['POLICYPARAM']
	        ,self.req.post['DIRTYPE']
	        ,STARTTIME
	        ,ENDTIME
	        ,self.req.post['STOCKSET']
	        ,self.req.post['ISTEST']
	        ,self.req.post['STATUS']
	        ,self.req.post['PRICES']
	        ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
	        ,self.req.post['FLAG'],self.req.post['SUBSCRBLE']
	        ,self.req.post['PERCENT']
        );


	      db.query(sql,function(){
		      if(arguments.length==1){
			      self.responseDirect(200,"text/json",JSON.stringify(result));
		      }else{
			      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
			      self.responseDirect(200,"text/json",JSON.stringify(result));
		      }
	      });

      }else if( db_type == 'update' ){

	      sql = 'UPDATE `tb_policy_usage` SET ' +
		      '`POLICYPARAM` = "%s", `STARTTIME` = %s,`ENDTIME` = %s, ' +
		      '`STOCKSET` = "%s", ' +
		      '`SUBSCRBLE` = %s, ' +
		      '`PERCENT` = "%s", ' +
		      '`MODTIME` = "%s" ' +
		      'WHERE ' +
		      '`tb_policy_usage`.`POLICYID` = %s ' +
		      'and `tb_policy_usage`.`USERID` = %s';
	      sql = util.format(sql,
		      self.req.post['POLICYPARAM'],STARTTIME,ENDTIME,
		      self.req.post['STOCKSET'],
		      self.req.post['SUBSCRBLE'],
		      self.req.post['PERCENT'],
		      unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss"),
		      self.req.post['POLICYID'],
		      uID);
                    // self.req.post['USERID']);

	      db.query(sql,function(){
		      if(arguments.length==1){
			      self.responseDirect(200,"text/json",JSON.stringify(result));
		      }else{
			      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
			      self.responseDirect(200,"text/json",JSON.stringify(result));
		      }
	      });
      }

    });

  }else{
	  result = {'success':false,'message':path.basename(__filename).replace('.js','')+'请求失败，请联系管理员'};
	  self.responseDirect(200,"text/json",JSON.stringify(result));
  }
};



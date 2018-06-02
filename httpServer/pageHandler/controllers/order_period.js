const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const policy = require('./policy.js');
const user_account = require('./user_account.js');
const cfg_httpserver = require(path.join(__dirname, "..", "..", "..", "Config_HttpServer.js"));


exports.select_orderPeriod = function(){
  this.alias = path.basename(__filename);
  var self = this;
  var uID = sessions.get_uID(self.req);

  var result = {'success':true,'data':''};
  var sql  = 'SELECT' +
    ' `ROWID`,'+
    ' `ORDERID`,'+
    ' `USERID`,'+
    ' `PGROUPID`,'+
    ' `ACCOUNTID`,'+
    ' `TRADEID`,'+
    ' `POLICYID`,'+
    ' `PNAME`,'+
    ' `POLICYPARAM`,'+
    ' `DIRTYPE`,'+
    ' `STOCKSET`,'+
    ' `DEALSTOCK`,'+
    ' `STARTTIME`,'+
    ' `ENDTIME`,'+
    ' `ISTEST`,'+
    ' `BUYCOUNT`,'+
    ' `BUYAMOUNT`,'+
    ' `PERCENT`,'+
    ' `STATUS`,'+
    ' `FLAG_SYSTEM`,'+
    ' `FLAG_USER`,'+
    ' `VISIBLE`,'+
    ' `ADDTIME`,'+
    ' `MODTIME`,'+
    ' `PRDSTART`,'+
    ' `PRDEND`,'+
    ' `FROMID`, '+
	  ' `CHECKED`, '+
	  ' `LABLE` '+
    ' FROM ' +
    '`view_orderid_period`' +
    ' WHERE' +
    ' `USERID`=%s' +
    ' AND ' +
    ' `FLAG_SYSTEM` = 1'+
    ' AND ' +
    ' `VISIBLE` = 1';

  sql = util.format(sql,uID);
  db.query(sql,function(){
    if(arguments.length==1){
      result.data = arguments[0];
      var date = null;
      var HMS = null;
      //debugger;
      for(var i = 0; i < result.data.length; i++){
        if(result.data[i]['STARTTIME'] == null){
          result.data[i]['STARTTIME'] = 0 ;
        }
        
        if(result.data[i]['ENDTIME'] == null){
          result.data[i]['ENDTIME'] = 0 ;
        }
        
        if( result.data[i]['PRDSTART'] ){
          date = new Date(result.data[i]['PRDSTART']);
          HMS = unit_date.toHMS(result.data[i]['STARTTIME']);
          date.setHours( HMS['hh']);
          date.setMinutes(HMS['mm']);
          date.setSeconds(HMS['ss']);
          result.data[i]['STARTTIME'] = unit_date.Format(date,"yyyy-MM-dd HH:mm:ss");
        }
	      
        if(result.data[i]['PRDEND'] ){
          date = new Date(result.data[i]['PRDEND']);
          HMS = unit_date.toHMS(result.data[i]['ENDTIME']);
          date.setHours( HMS['hh']);
          date.setMinutes(HMS['mm']);
          date.setSeconds(HMS['ss']);
          result.data[i]['ENDTIME'] = unit_date.Format(date,"yyyy-MM-dd HH:mm:ss");
        }
	            
        result.data[i]['POLICYPARAM'] = JSON.parse(new Buffer(result.data[i]['POLICYPARAM'], 'base64').toString('UTF8'))
        result.data[i]['ADDTIME'] = unit_date.Format( new Date(result.data[i]['ADDTIME']),"yyyy-MM-dd HH:mm:ss");//unit_date.toHMS(result.data[i]['ADDTIME']);
        result.data[i]['MODTIME'] = unit_date.Format(new Date(result.data[i]['MODTIME']),"yyyy-MM-dd HH:mm:ss");//unit_date.toHMS(result.data[i]['MODTIME']);
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

// exports.select_userPolicyGID = function(){
//     this.alias = path.basename(__filename);
//     this.callback = callback_userPolicyGID;
//     console.log(unit_date.getTime(), path.basename(__filename).replace('.js',''),"alias select_userPolicyGID:",JSON.stringify(this.alias) );
//     policy.select_alreadySubscrible.apply(this,arguments[0],"test123_567");
//
// };

exports.insert_orderPeriod = function(){
  var  self = this;
  var uID = sessions.get_uID(self.req);
  var result = {'success':true,'data':''};
  console.log(unit_date.getTime(), path.basename(__filename), "insert_preorder", JSON.stringify(self.req.post));
  var sql = "INSERT INTO `view_orderid_period` (" +
    "`ORDERID`" +//1
    ", `USERID`" +//2
    ", `PGROUPID`" +//3
    ", `ACCOUNTID`" +//4
    ", `TRADEID`" +//5
    ", `POLICYID`" +//6
    ", `PNAME` "+//6_1
    ", `POLICYPARAM`" +//7
    ", `DIRTYPE`" +//8
    ", `STOCKSET`" +//9
    // ", `DEALSTOCK`" +//10
    ", `STARTTIME`" +//11
    ", `ENDTIME`" +//12
    ", `ISTEST`" +//13
    ", `BUYCOUNT`" +//14
    ", `BUYAMOUNT`" +//15
    ", `PERCENT`" +//16
    // ", `STATUS`" +//17
    // ", `FLAG_SYSTEM`" +//18
    // ", `FLAG_USER`" +//18_1
    // ", `ADDTIME`" +//19
    ", `MODTIME`" +//20
    ", `PRDSTART`" +//20_1
    ", `PRDEND`" +//20_2
    ", `FROMID`" +//21
    // ", `REMARK`" +//22
	  ", `CHECKED`"+//23
	  ", `LABLE`"+// 24
    ") VALUES";
  
  var value = "(" +
    "%s" +//1 ORDERID
    ",%s" +//2 USERID
    ",%s" +//3 PGROUPID
    ",'%s'" + //4 ACCOUNTID
    ",%s" + //5 TRADEID
    ",%s" +//6 POLICYID
    ",'%s'" +//6_1 PNAME
    ",'%s'" +//7 POLICYPARAM
    ",%s" + // 8 DIRTYPE
    ",'%s'" +//9 STOCKSET
    // ",%s" + //10 DEALSTOCK
    ",'%s'" + // 11 STARTTIME
    ",'%s'" + // 12 ENDTIME
    ",%s" + // 13 ISTEST
    ",%s" + // 14 BUYCOUNT
    ",%s" + // 15 BUYAMOUNT
    ",%s" + // 16 PERCENT
    // ",%s" + // 17 STATUS
    // ",%s" + // 18 FLAG
    // ",'2017-04-20 01:00:00'" + // 19  ADDTIME
    ",'%s'" + // 20  MODTIME
    ",'%s'" + // 20_1  PRDSTART
    ",'%s'" + // 20_2  PRDEND
    ",1" + //21 FROMID
	  ",%s" + // 23  CHECKED
	  ",'%s'" + // 24  LABLE
    ")";



  var sqldata = "";
  var hms = unit_date.Format(new Date(),"HH:mm:ss").split(":");
  
  var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT,PRDSTART,PRDEND;
  var reportServer = [];
  var _POLICYPARAM = '',_POLICYPARAM_RESULT = '';
  var hh,mm,ss;
	ORDERID = unit_date.objToNumber({hh:hms[0],mm:hms[1],ss:hms[2]})*10000+self.cumulation();
  self.root.regestOrder( uID, {"type":"period", "orderid":ORDERID} );
  for( var i = 0; i < self.req.post.length; i++ ){
    if(i!=0){
      sqldata += ",";
    }
    
    PRDSTART = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"yyyy-MM-dd");
    hh = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"HH");
    mm = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"mm");
    ss = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"ss");
    STARTTIME = unit_date.objToNumber({'hh':hh,'mm':mm,'ss':ss});
	    
    PRDEND = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"yyyy-MM-dd");
    hh = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"HH");
    mm = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"mm");
    ss = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"ss");
    ENDTIME = unit_date.objToNumber({'hh':hh,'mm':mm,'ss':ss});
	    
    BUYCOUNT = unit_date.string2int(self.req.post[i]['BUYCOUNT']);
    BUYAMOUNT = unit_date.string2num(self.req.post[i]['BUYAMOUNT']);
    PERCENT =  unit_date.string2num(self.req.post[i]['PERCENT']);
    _POLICYPARAM = new Buffer(JSON.stringify(self.req.post[i]['POLICYPARAM'])).toString('base64');
    _POLICYPARAM_RESULT = new Buffer(JSON.stringify(self.req.post[i]['POLICYPARAM']['result'])).toString('base64');
    sqldata += util.format(value,
      ORDERID//1 ORDERID
      ,uID//self.req.post[i]['USERID']//2 USERID
      ,self.req.post[i]['PGROUPID']//3 PGROUPID
      ,self.req.post[i]['ACCOUNTID']//4 ACCOUNTID
      ,self.req.post[i]['TRADEID']//5 TRADEID
      ,self.req.post[i]['POLICYID']//6 POLICYID
      ,self.req.post[i]['PNAME']//6_1 PNAME
      ,_POLICYPARAM//7 POLICYPARAM
      ,self.req.post[i]['DIRTYPE']// 8 DIRTYPE
      ,self.req.post[i]['STOCKSET']//9 STOCKSET
      ,STARTTIME// 11 STARTTIME
      ,ENDTIME// 12 ENDTIME
      ,self.req.post[i]['ISTEST']//13 ISTEST
      ,BUYCOUNT //14 BUYCOUNT
      , BUYAMOUNT  // 15 BUYAMOUNT
      , PERCENT // 16 PERCENT
      // ,self.req.post[i]['FLAG']// 18 FLAG
      ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")// 20  MODTIME
      ,PRDSTART// 20_1  PRDSTART
      ,PRDEND// 20_2  PRDEND
	    ,self.req.post[i]['CHECKED']//23 CHECKED
	    ,self.req.post[i]['LABLE']//23 LABLE
      );
	  var operation = '1';
	
	  if(self.req.post[i]['FLAG_USER'] == '0' || self.req.post[i]['CHECKED']== '0'){
		  operation = '3';
	  }else{
		  operation = '1';
	  }
	  
    reportServer.push(
      {
        "orderid":String(ORDERID)
        ,"operation":String(operation)//operation=删除0记录,插入新数据1,修改记录2
        ,"accountid":String(self.req.post[i]['ACCOUNTID'])
        ,"tradeid":String(self.req.post[i]['TRADEID'])
        ,"userid":String(uID)
        ,"policyid":String(self.req.post[i]['POLICYID'])
        ,"policyparam":_POLICYPARAM
        ,"dirtype":String(self.req.post[i]['DIRTYPE'])
        ,"istest":String(self.req.post[i]['ISTEST'])
        ,"starttime":String(STARTTIME)
        ,"endtime":String(ENDTIME)
        ,"buycount":String(BUYCOUNT)
        ,"buyamount":String(BUYAMOUNT)
        ,"percent":String(PERCENT)
        ,"stockset":String(self.req.post[i]['STOCKSET'])
        ,"fromid":String(2)
        ,"flaguser":String(1)
        ,"flagsystem":String(1)
      }
    );
  }
  // console.log(unit_date.getTime(), path.basename(__filename), "http_post", JSON.stringify(reportServer));
  http_post(reportServer);
  db.query(sql+sqldata,function(){
    if(arguments.length==1){
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }else{
      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
  });
};

var http_post=function(){
  var result = JSON.stringify(arguments[0]) ;
  result = result.replace("\\","");
  //result = result.replace("\"","'");
  console.log(unit_date.getTime(), path.basename(__filename), "http_post", result);
	var options = {};
	
	for(var elm in cfg_httpserver.order){
		options[elm] = cfg_httpserver.order[elm];
	}
	
	options.path = options.path+"?rdm="+Math.ceil(Math.random()*10000);
 
	console.log(unit_date.getTime(), path.basename(__filename), "http_post", options);
	
  var req = http.request(options, function(res) {
    console.log(unit_date.getTime(),'Status: ' + res.statusCode);
    console.log(unit_date.getTime(),'Headers: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (body) {
      console.log(unit_date.getTime(),'Body: ' + body);
    });
  });

  req.on('error', function(e) {
    console.log(unit_date.getTime(),'problem with request: ' + e.message);
  });

  req.write(result);
  req.end();
};

exports.update_orderPeriod = function(){
  //时间  param参数 自选股集合 数量/金额/比例 可以修改
  
  var  self = this;
  var uID = sessions.get_uID(self.req);
  var result = {'success':true,'data':''};
  
  if(self.req.post){
	
	  var reportServer = [];
	  var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT,PRDSTART,PRDEND;
    if(self.req.post.length>0){
      self.root.regestOrder( uID, {"type":"period","orderid":self.req.post[0]['ORDERID']} );
    }
	  var sql_pre = 'INSERT INTO `view_orderid_period`  (' +
		  '`ROWID`' +//0
		  // ', `ORDERID`' +//1
		  // ', `USERID`' +//2
		  // ', `PGROUPID`' +//3
		  // ', `ACCOUNTID`' +//4
		  // ', `TRADEID`' +//5
		  // ', `POLICYID`' +//6
		  // ', `PNAME` '+//6_1
		  ', `POLICYPARAM`' +//7
		  // ', `DIRTYPE`' +//8
		  ', `STOCKSET`' +//9
		  // ', `DEALSTOCK`' +//10
		  ', `STARTTIME`' +//11
		  ', `ENDTIME`' +//12
		  // ', `ISTEST`' +//13
		  ', `BUYCOUNT`' +//14
		  ', `BUYAMOUNT`' +//15
		  ', `PERCENT`' +//16
		  // ', `STATUS`' +//17
		  // ', `FLAG_SYSTEM`' +//18
		  ', `FLAG_USER`' +//18_1
		  // ', `ADDTIME`' +//19
		  ', `MODTIME`' +//20
		  // ', `FROMID`' +//21
		  ', `VISIBLE`' +//22
		  ', `PRDSTART`' +//23
		  ', `PRDEND`' +//24
		  ', `CHECKED`' +//23_1
		  ', `LABLE`' +//23_2
		  ') VALUES';
	  var value = "(" +
		  "%s" +//0 ROWID
		  // ",%s" +//1 ORDERID
		  // ",%s" +//2 USERID
		  // ",%s" +//3 PGROUPID
		  // ",'%s'" + //4 ACCOUNTID
		  // ",%s" + //5 TRADEID
		  // ",%s" +//6 POLICYID
		  // ",'%s'" +//6_1 PNAME
		  "," +
		  "'%s'" +//7 POLICYPARAM
		  // ",%s" + // 8 DIRTYPE
		  ",'%s'" +//9 STOCKSET
		  // ",%s" + //10 DEALSTOCK
		  ",%s" + // 11 STARTTIME
		  ",%s" + // 12 ENDTIME
		  // ",%s" + // 13 ISTEST
		  ",%s" + // 14 BUYCOUNT
		  ",%s" + // 15 BUYAMOUNT
		  ",%s" + // 16 PERCENT
		  // ",%s" + // 17 STATUS
		  // ",%s" + // 18 FLAG
		  ',%s' +//18_1 FLAG_USER
		  // ",'%s'" + // 19  ADDTIME
		  ",'%s'" + // 20  MODTIME
		  // ",%s" + //21 FROMID
		  ",%s" + // 22 VISIBLE
		  ",'%s'" + // 23 PRDSTART
		  ",'%s'" + // 24 PRDEND
		  ",%s" + // 23_1 CHECKED
		  ",'%s'" + // 23_2 LABLE
		  ")";
	  var sqldata = ' ';
	  for( var i = 0; i < self.req.post.length; i++ ){
		  if(i!=0){
			  sqldata += ",";
		  }
		
		  PRDSTART = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"yyyy-MM-dd");
		  hh = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"HH");
		  mm = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"mm");
		  ss = unit_date.Format(new Date(self.req.post[i]['STARTTIME']),"ss");
		  STARTTIME = unit_date.objToNumber({'hh':hh,'mm':mm,'ss':ss});
		
		  PRDEND = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"yyyy-MM-dd");
		  hh = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"HH");
		  mm = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"mm");
		  ss = unit_date.Format(new Date(self.req.post[i]['ENDTIME']),"ss");
		  ENDTIME = unit_date.objToNumber({'hh':hh,'mm':mm,'ss':ss});
		
		
		  BUYCOUNT = unit_date.string2int(self.req.post[i]['BUYCOUNT']);
		  BUYAMOUNT = unit_date.string2num(self.req.post[i]['BUYAMOUNT']);
		  PERCENT =  unit_date.string2num(self.req.post[i]['PERCENT']);
		
		  _POLICYPARAM = new Buffer(JSON.stringify(self.req.post[i]['POLICYPARAM'])).toString('base64');
		  _POLICYPARAM_RESULT = new Buffer(JSON.stringify(self.req.post[i]['POLICYPARAM']['result'])).toString('base64');
		
		  sqldata += util.format(value
			  ,self.req.post[i]['ROWID']                          //0 ROWID
			  ,_POLICYPARAM                                       //7 POLICYPARAM
			  ,unit_date.string2_(self.req.post[i]['STOCKSET'])   //9 STOCKSET
			  ,STARTTIME                                          // 11 STARTTIME
			  ,ENDTIME                                            // 12 ENDTIME
			  ,BUYCOUNT                                           // 14 BUYCOUNT
			  ,BUYAMOUNT                                          // 15 BUYAMOUNT
			  ,PERCENT                                            // 16 PERCENT
			  ,self.req.post[i]['FLAG_USER']                      //18_1 FLAG_USER
			  ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss") // 20  MODTIME
			  ,self.req.post[i]['VISIBLE']                        // 22 VISIBLE
			  ,PRDSTART                                           // 23 PRDSTART
			  ,PRDEND                                             // 24 PRDEND
			  ,self.req.post[i]['CHECKED']// 23 VISIBLE
			  ,self.req.post[i]['LABLE']// 24 VISIBLE
		  );
		
		  var operation = '';
		  if(self.req.post[i]['VISIBLE'] == '0'){
			  operation = '0';
		  }else{
			  if(self.req.post[i]['FLAG_USER'] == '0' || self.req.post[i]['CHECKED']== '0' ){
				  operation = '3'
			  }else{
				  operation = '2'
			  }
		  }
		
		  reportServer.push(
			  {
				  "orderid":String(self.req.post[i]['ORDERID'])
				  ,"operation":String(operation)//0删除 1增加 2启用 3禁用
				  ,"accountid":String(self.req.post[i]['ACCOUNTID'])
				  ,"tradeid":String(self.req.post[i]['TRADEID'])
				  ,"userid":String(uID)
				  ,"policyid":String(self.req.post[i]['POLICYID'])
				  ,"policyparam":String(_POLICYPARAM_RESULT)
				  ,"dirtype":String(self.req.post[i]['DIRTYPE'])
				  ,"istest":String(self.req.post[i]['ISTEST'])
				  ,"starttime":String(STARTTIME)
				  ,"endtime":String(ENDTIME)
				  ,"buycount":String(BUYCOUNT)
				  ,"buyamount":String(BUYAMOUNT)
				  ,"percent":String(PERCENT)
				  ,"stockset":String(self.req.post[i]['STOCKSET'])
				  ,"fromid":String(2)
				  ,"flaguser":String(self.req.post[i]['FLAG_USER'])
				  ,"flagsystem":String(1)
			  }
		  );
	  }
	
	  var sql_suf = 'ON DUPLICATE KEY UPDATE ' +
		  // 'ROWID=VALUES(ROWID)' +//0
		  // ', `ORDERID`' +//1
		  // ', `USERID`' +//2
		  // ', `PGROUPID`' +//3
		  // ', `ACCOUNTID`' +//4
		  // ', `TRADEID`' +//5
		  // ', `POLICYID`' +//6
		  // ', `PNAME` '+//6_1
		  // ', ' +
		  'POLICYPARAM=VALUES(POLICYPARAM)' +//7
		  // ', `DIRTYPE`' +//8
		  ', STOCKSET=VALUES(STOCKSET)' +//9
		  // ', `DEALSTOCK`' +//10
		  ', STARTTIME=VALUES(STARTTIME)' +//11
		  ', ENDTIME=VALUES(ENDTIME)' +//12
		  // ', `ISTEST`' +//13
		  ', BUYCOUNT=VALUES(BUYCOUNT)' +//14
		  ', BUYAMOUNT=VALUES(BUYAMOUNT)' +//15
		  ', PERCENT=VALUES(PERCENT)' +//16
		  // ', `STATUS`' +//17
		  // ', `FLAG_SYSTEM`' +//18
		  ', FLAG_USER=VALUES(FLAG_USER)' +//18_1
		  // ', `ADDTIME`' +//19
		  ', MODTIME=VALUES(MODTIME)' +//20
		  // ', `FROMID`' +//21
		  ', VISIBLE=VALUES(VISIBLE)' +//22
		  ', PRDSTART=VALUES(PRDSTART)' +//23
		  ', PRDEND=VALUES(PRDEND)'+//24
	    ', CHECKED=VALUES(CHECKED)'+//23_1
	    ', LABLE=VALUES(LABLE)' //23_2
	  ;
	
	  var sql = sql_pre+sqldata+sql_suf;
	  db.query(sql, function(){
		  if(arguments.length==1){
			  http_post(reportServer);
			  self.responseDirect(200,"text/json",JSON.stringify(result));
		  }else{
			  result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
			  self.responseDirect(200,"text/json",JSON.stringify(result));
		  }
	  });
	  
	  
	  
    // //
    // var sql = "UPDATE `view_orderid_period` set" +
    //   // USERID
    //   //PNAME
    //   // "  `PGROUPID`=%s ," +
    //   // " `ACCOUNTID`=%s ," +
    //   // " `TRADEID`=%s ," +
    //   // " `POLICYID`=%s ," +
    //   " `POLICYPARAM`='%s' ," +
    //   // " `DIRTYPE`=%s ," +
    //   " `STOCKSET`='%s' ," +
    //   " `STARTTIME`='%s' ," +
    //   " `ENDTIME`='%s' ," +
    //   // " `ISTEST`=%s ," +
    //   " `BUYCOUNT`=%s ," +
    //   " `BUYAMOUNT`=%s ," +
    //   " `PERCENT`=%s," +
    //   //STATUS
    //   //FLAG_SYSTEM
    //   " `FLAG_USER`='%s', " +
    //   " `VISIBLE`='%s', " +
    //   //ADDTIME
    //   " `MODTIME`='%s', " +
    //   " `PRDSTART`='%s', " +
    //   " `PRDEND`='%s' " +
    //   // "," +
    //   // " `FROMID`=%s " +
    //   " WHERE " +
    //   "`ROWID`='%s'";
    // // ORDERID = unit_date.objToNumber({hh:hms[0],mm:hms[1],ss:hms[2]})*10000+self.cumulation();
    //
    // // var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT,PRDSTART,PRDEND;
    //
    // PRDSTART = unit_date.Format(new Date(self.req.post[0]['STARTTIME']),"yyyy-MM-dd");
    // hh = unit_date.Format(new Date(self.req.post[0]['STARTTIME']),"HH");
    // mm = unit_date.Format(new Date(self.req.post[0]['STARTTIME']),"mm");
    // ss = unit_date.Format(new Date(self.req.post[0]['STARTTIME']),"ss");
    // STARTTIME = unit_date.objToNumber({'hh':hh,'mm':mm,'ss':ss});
    //
    // PRDEND = unit_date.Format(new Date(self.req.post[0]['ENDTIME']),"yyyy-MM-dd");
    // hh = unit_date.Format(new Date(self.req.post[0]['ENDTIME']),"HH");
    // mm = unit_date.Format(new Date(self.req.post[0]['ENDTIME']),"mm");
    // ss = unit_date.Format(new Date(self.req.post[0]['ENDTIME']),"ss");
    // ENDTIME = unit_date.objToNumber({'hh':hh,'mm':mm,'ss':ss});
    //
    // BUYCOUNT = unit_date.string2int(self.req.post[0]['BUYCOUNT']);
    // BUYAMOUNT = unit_date.string2num(self.req.post[0]['BUYAMOUNT']);
    // PERCENT =  unit_date.string2num(self.req.post[0]['PERCENT']);
    //
    // console.log(unit_date.getTime(),"_POLICYPARAM",JSON.stringify(self.req.post[0]['POLICYPARAM']));
    // var _POLICYPARAM = new Buffer(JSON.stringify(self.req.post[0]['POLICYPARAM'])).toString('base64');
    // console.log(unit_date.getTime(),"_POLICYPARAM",_POLICYPARAM);
    //
    // var _POLICYPARAM_RESULT = new Buffer(JSON.stringify(self.req.post[0]['POLICYPARAM']['result'])).toString('base64');
    // sql  = util.format(sql
    //   ,_POLICYPARAM
    //   ,unit_date.string2_(self.req.post[0]['STOCKSET'])
    //   ,STARTTIME
    //   ,ENDTIME
    //   ,BUYCOUNT
    //   ,BUYAMOUNT
    //   ,PERCENT
    //   ,self.req.post[0]['FLAG_USER']
    //   ,self.req.post[0]['VISIBLE']
    //   ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
    //   ,PRDSTART
    //   ,PRDEND
    //   ,self.req.post[0]['ROWID']
    // );
    // // var reportServer = [];
    // var operation = '';
    // if(self.req.post[0]['VISIBLE'] == '0'){
    //   operation = '0';
    // }else{
    //   if(self.req.post[0]['FLAG_USER'] == '0'){
    //     operation = '3'
    //   }else{
    //     operation = '2'
    //   }
    // }
    // reportServer.push(
    //   {
    //     "orderid":String(self.req.post[0]['ORDERID'])
    //     ,"operation":operation//0删除 1增加 2启用 3禁用
    //     ,"accountid":String(self.req.post[0]['ACCOUNTID'])
    //     ,"tradeid":String(self.req.post[0]['TRADEID'])
    //     ,"userid":String(uID)
    //     ,"policyid":String(self.req.post[0]['POLICYID'])
    //     ,"policyparam":String(_POLICYPARAM_RESULT)
    //     ,"dirtype":String(self.req.post[0]['DIRTYPE'])
    //     ,"istest":String(self.req.post[0]['ISTEST'])
    //     ,"starttime":String(STARTTIME)
    //     ,"endtime":String(ENDTIME)
    //     ,"buycount":String(BUYCOUNT)
    //     ,"buyamount":String(BUYAMOUNT)
    //     ,"percent":String(PERCENT)
    //     ,"stockset":String(self.req.post[0]['STOCKSET'])
    //     ,"fromid":String(2)
    //     ,"flaguser":String(self.req.post[0]['FLAG_USER'])
    //     ,"flagsystem":String(1)
    //   }
    // );
    //
    // http_post(reportServer);
    // db.query(sql, function(){
    //   if(arguments.length==1){
    //     self.responseDirect(200,"text/json",JSON.stringify(result));
    //   }else{
    //     result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
    //     self.responseDirect(200,"text/json",JSON.stringify(result));
    //   }
    // });
  }

};
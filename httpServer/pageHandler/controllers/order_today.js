const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const policy = require('./policy.js');
//const user_account = require('./user_account.js');
const bean = require(path.join(__dirname,"..","..","..",'bean','bean_entity'));
const cfg_httpserver = require(path.join(__dirname, "..", "..", "..", "Config_HttpServer.js"));
const descrip = require(path.join(__dirname, "..", "..", "..", 'bean','des_stock.js'));
const crawler = require(path.join(__dirname, "..", "..", "..", 'crawler','crawler_stock.js'));
const mail = require(path.join(__dirname,  "..", "..", "mailer.js"));
const localIP = require(path.join(__dirname,"..", "..", "..", 'localIP'));

var ip = localIP.localIP;
//console.log("cfg_httpserver.ip"+cfg_httpserver.ip);
exports.select_preorder = function(){
  var parentAlias = this.alias;
  this.alias = path.basename(__filename);
  var self = this;

  var uID;
  if(parentAlias == 'root'){
    uID = sessions.get_uID(self.req);
  }else if(parentAlias == 'order_today.js' || parentAlias == 'market.js'){
    uID = self.uID;
  }
  if(!uID){
    result = {'success':false,'message':path.basename(__filename).replace('.js','')+'数据错误'};
    self.responseDirect(200,"text/json",JSON.stringify(result));
    console.log(unit_date.getTime(),"error order_today is null");
    return;
  }


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
    ' `FROMID`, '+
	  ' `CHECKED`, '+
	  ' `LABLE` '+
    ' FROM ' +
    '`view_orderid_today`' +
    ' WHERE' +
    ' `USERID`=%s' +
    ' AND ' +
    ' `FLAG_SYSTEM` = 1'+
    ' AND ' +
    ' `VISIBLE` = 1'+
		' AND ' +
		' `CHECKED` != 0';

  sql = util.format(sql,uID);
  db.query(sql,function(){
    if(arguments.length==1){
      result.data = arguments[0];
      
      for(var i = 0; i < result.data.length; i++){
        result.data[i]['POLICYPARAM'] = JSON.parse(new Buffer(result.data[i]['POLICYPARAM'], 'base64').toString('UTF8'))
        //new Buffer(self.req.post['POLICYPARAM']).toString('base64');
        result.data[i]['ADDTIME'] = unit_date.Format( new Date(result.data[i]['ADDTIME']),"HH:mm:ss");//unit_date.toHMS(result.data[i]['ADDTIME']);
        result.data[i]['MODTIME'] = unit_date.Format(new Date(result.data[i]['MODTIME']),"HH:mm:ss");//unit_date.toHMS(result.data[i]['MODTIME']);
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

exports.insert_preorder = function(){
  var  self = this;
  var result = {'success':true,'data':''};
  if(self.req.post.length > 0 ){
		
	  if( self.req.post[0].hasOwnProperty('ONTIMESEND') && self.req.post[0]['ONTIMESEND'] ){
		  //及时卖出，调用爬虫数据，其次优先下单后插入数据库,并且该请求只有一个股票
		  var gotoCrawler = true;
		  
		  if( String(self.req.post[0]['DIRTYPE']) == '9'){
			  gotoCrawler = false;
		  }
		  // else if( self.req.post[0]['POLICYPARAM'].hasOwnProperty('result') ){
			 //  //如果绝对 卖出 或者 撤单 不走爬虫数据,但需要保证昨收
			 //  var result_obj = {};
			 //  for(var idx = 0; idx < self.req.post[0]['POLICYPARAM']['result'].length; idx++){
				//   result_obj[self.req.post[0]['POLICYPARAM']['result'][idx].id] = self.req.post[0]['POLICYPARAM']['result'][idx].value;
			 //  }
		  //
			 //  if( String(result_obj['select_id1']) == '3' ){
				//   gotoCrawler = false;
			 //  }
		  // }
		  console.log('order_today','insert_preorder','gotoCrawler',gotoCrawler);
			if(gotoCrawler){
			  ontime_getStock( [String(self.req.post[0]['STOCKSET'])], function( result_stk ){
				  //{"stocks":{"300104":["300104","0.00","30.68"]},"title":["代码","当前价格","昨收"]
				  console.log('',"result_stk",result_stk);
				  if(result_stk.stocks.hasOwnProperty(String(self.req.post[0]['STOCKSET']))){
					  initsql(self, result, result_stk.stocks[String(self.req.post[0]['STOCKSET'])], '1');
				  }else{
					  result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员 code: 001'};
					  self.responseDirect(200,"text/json",JSON.stringify(result));
				  }
			  });
		  }else{
				initsql(self, result, null, '1');
			}
	  }else{
		  //常规操作
		  initsql(self, result, null, '0')
	  }
  }else{
	  result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员 code: 000'};
	  self.responseDirect(200,"text/json",JSON.stringify(result));
  }
  
};

var initsql = function(self, result, stocks, type){
	//type:0 一般的操作，1为及时卖出
	//stocks 数组
	
	console.log(unit_date.getTime(), path.basename(__filename), "initsql", JSON.stringify(self.req.post), type, stocks);
	if( 1 == type && stocks && stocks[2] == null ){
		result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员 code: 004'};
		self.responseDirect(200,"text/json",JSON.stringify(result));
		return;
	}
	
	var uID = sessions.get_uID(self.req);
	var sql = "INSERT INTO `view_orderid_today` (" +
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
    ", `FROMID`" +//21
    // ", `REMARK`" +//22
	  ", `CHECKED`"+//23
	  ", `LABLE`"+//24
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
    ",%s" + // 11 STARTTIME
    ",%s" + // 12 ENDTIME
    ",%s" + // 13 ISTEST
    ",%s" + // 14 BUYCOUNT
    ",%s" + // 15 BUYAMOUNT
    ",%s" + // 16 PERCENT
    // ",%s" + // 17 STATUS
    // ",%s" + // 18 FLAG
    // ",'2017-04-20 01:00:00'" + // 19  ADDTIME
    ",'%s'" + // 20  MODTIME
    ",2" + //21 FROMID
	  // ",'%s'" + // 22  REMARK
	  ",%s" + // 23  CHECKED
	  ",'%s'" + // 23  LABLE
    ")";
  
//
	
	var sqldata = "";
  var hms = unit_date.Format(new Date(),"HH:mm:ss").split(":");

  var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT;
  var reportServer = [];
  var report_ontimesend = [];
  var _POLICYPARAM_no64 = '', _POLICYPARAM = '',_POLICYPARAM_RESULT = '';
	
	ORDERID = unit_date.objToNumber({hh:hms[0],mm:hms[1],ss:hms[2]})*10000+self.cumulation();
	
	for( var i = 0; i < self.req.post.length; i++ ){
    if(i!=0){
      sqldata += ",";
    }

    STARTTIME = unit_date.objToNumber(self.req.post[i]['STARTTIME']);
    ENDTIME = unit_date.objToNumber(self.req.post[i]['ENDTIME']);

    BUYCOUNT = unit_date.string2int(self.req.post[i]['BUYCOUNT']);
    BUYAMOUNT = unit_date.string2num(self.req.post[i]['BUYAMOUNT']);
    PERCENT =  unit_date.string2num(self.req.post[i]['PERCENT']);
		_POLICYPARAM_no64 = self.req.post[i]['POLICYPARAM'];
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
	    ,self.req.post[i]['CHECKED']//23 CHECKED
	    ,self.req.post[i]['LABLE']//24 LABLE
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
        ,"policyparam":_POLICYPARAM_RESULT
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
	  // 1502180435
	  // 1502070890
		//{
		// 	"view":[{"type":"select","id":"select_id1","key":["1","2","3"],"value":["相对涨幅", "绝对涨幅", "绝对价格"],"suf":[{"type":"input","id":"input1"},{"type":"input","id":"input2"},{"type":"input","id":"input3"}]}]
		// 		,"title":"懒人模式"
		// 		,"stockset":{'type':'0'}
		// ,"result":[{"id":"select_id1","value":"1"},{"id":"input1","value":"-20"}]
		// }
		//["300104","0.00","30.68"] ["代码","当前价格","昨收"]}
		var price = 0;
		if(1 == type && _POLICYPARAM_no64.hasOwnProperty('result')){
			
			var result_obj = {};
			for(var idx = 0; idx < _POLICYPARAM_no64['result'].length; idx++){
				result_obj[_POLICYPARAM_no64['result'][idx].id] = _POLICYPARAM_no64['result'][idx].value;
			}
			
			console.log('_POLICYPARAM_no640',JSON.stringify(result_obj) ,JSON.stringify(stocks) );
			
			if(
				result_obj.hasOwnProperty('input1')
				&&result_obj.hasOwnProperty('select_id1')
				&&String(result_obj['select_id1']=='1')){
				//相对涨幅 "当前价格"*(1+x/100)
				price = Number(stocks[1])*(1+Number(result_obj['input1'])/100);
			}else if(
				result_obj.hasOwnProperty('input2')
				&&result_obj.hasOwnProperty('select_id1')
				&&String(result_obj['select_id1']=='2')
			){
				//绝对涨幅  "昨收"*(1+x/100)
				price = Number(stocks[2])*(1+Number(result_obj['input2'])/100);
			}else if(
				result_obj.hasOwnProperty('input3')
				&&result_obj.hasOwnProperty('select_id1')
				&&String(result_obj['select_id1']=='3')
			){
				//绝对价格
				price = Number(result_obj['input3']);
			}
			console.log('2_0price', price );
			if(String(self.req.post[i]['DIRTYPE']) != '9'){
				if(price > Number(stocks[2])*1.1){price = Number(stocks[2])*1.1}
				if(price < Number(stocks[2])*0.9){price = Number(stocks[2])*0.9}
			}
			console.log('2_1price', price );
			price = Math.round(price*100)/100;
			price = parseInt(price*100)/100;
			console.log('3price', price );
		}
		if(self.req.post[i]['CHECKED']== '1'){
		  report_ontimesend.push(
			  {
				  "orderid": String(ORDERID)        //
				  , "systime": String( parseInt( (new Date()).getTime()/1000 ) )     //本地时间
				  , "policyid": String(self.req.post[i]['POLICYID'])          //
				  , "pricetype": "0"            //
				  , "dir": String(self.req.post[i]['DIRTYPE'])                 //
				  , "stock": String(self.req.post[i]['STOCKSET'])           //
				  , "price": String(price)             //
				  , "istest": "0"               //
				  , "sequence": "0"             //
			  }
		  )
		}
  }
	
	if( 0 == type ){//先插入数据库再通知
		handlerMysql( self, sql+sqldata ,result, type, reportServer );
	}else if( 1 == type ){//先通知再插入数据库
		http_post(reportServer, function( result_rp ) {
			if( 'success'  == result_rp ){
				http_post_ontimeSend(report_ontimesend, function(result_ontime, data){
					if( 'success' == result_ontime ){
						result.data = data;
						handlerMysql( self, sql+sqldata ,result, type, reportServer );
						
					}else if( 'error' == result_ontime ){
						result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员 code: 003'};
						self.responseDirect(200,"text/json",JSON.stringify(result));
					}
					
				});
			}else if( 'error' == result_rp ){
				result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员 code: 002'};
				self.responseDirect(200,"text/json",JSON.stringify(result));
			}
			
		});
	}
};

var handlerMysql = function( self, sql, result, type, reportServer ){
	//type:0 一般的操作，1为及时卖出,买入，撤单
	db.query( sql, function(){
    if(arguments.length==1){
      if( 0 == type ){
        http_post(reportServer);
        http_post_2(reportServer);
      }

      self.responseDirect(200,"text/json",JSON.stringify(result));
    }else{
      result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
      self.responseDirect(200,"text/json",JSON.stringify(result));
    }
	});
};


var ontime_getStock = function(stocks,callback){
	
	stocks = crawler.addPrefix(stocks);
	console.log('order_today','ontime_getStock',stocks);
	crawler.getStockInfo(stocks,function(result_back){
		//{"stocks":{"300104":["300104","0.00","30.68"]},"title":["代码","当前价格","昨收"]}
		if(callback){
			callback({
				'stocks': crawler.parseOntimeStocks(result_back),
				'title': result_back.title_stock
			});
		}
	});
};

var http_post = function(data,callback){
  var result = JSON.stringify(data) ;
  result = result.replace("\\","");
  //result = result.replace("\"","'");
	var options = {};
	
	for(var elm in cfg_httpserver.order){
		options[elm] = cfg_httpserver.order[elm];
	}
	var my_path = options.path;
	options.path = options.path+"?rdm="+Math.ceil(Math.random()*10000);
	
	console.log(unit_date.getTime(), path.basename(__filename), "http_post", result);
	console.log(unit_date.getTime(), path.basename(__filename), "http_post", options );
	
  var req = http.request(options, function(res) {
    console.log(unit_date.getTime(),'Status: ' + res.statusCode);
    console.log(unit_date.getTime(),'Headers: ' + JSON.stringify(res.headers));
    if(String(res.statusCode) != '200' && String(ip) == cfg_httpserver.ip ){
	    options.path = my_path;
	    mail.ServerError('mazhou_654452588@qq.com', String(res.statusCode)+'</ br>'+JSON.stringify(options)+'</ br>'+result);
    }
	
	  var result_back="";
	  res.setEncoding("utf8");
	  res.on("data",function(chunk){
		  result_back += chunk;
	  });
	  res.on("end",function(){
		  console.log(unit_date.getTime(),'Body: ' , result_back);
		  if(callback){
			  callback('success');
		  }
	  });
	  
  });

  req.on('error', function(e) {
	
	  console.log(unit_date.getTime(),my_path+' problem request: ' + e.message);
	  options.path = my_path;
	  mail.ServerError('mazhou_654452588@qq.com', "ERROR: "+e.message+'</ br>'+JSON.stringify(options)+'</ br>'+result);
	  if( callback != null ){
		  callback('error');
	  }
	  
  });

  req.write(result);
  req.end();
};

var http_post_ontimeSend = function(data, callback){
	var result = JSON.stringify(data) ;
	result = result.replace("\\","");
	//[ { "orderid": "356890000", "systime": "1502070890", "policyid": "1002", "pricetype": "0", "dir": "1", "stock": "600879", "price": "8.10", "istest": "0", "sequence": "0" } ]
	console.log(unit_date.getTime(),"http_post_ontimeSend",result);
	var options = {
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': result.length
		}
	};
	
	for(var param in cfg_httpserver.ontimeSend){
		options[param] = cfg_httpserver.ontimeSend[param];
	}
	
	var my_path = options.path;
	options.path = options.path+"?rdm="+Math.ceil(Math.random()*10000);
	console.log(unit_date.getTime(),'http_post_ontimeSend options: ' , JSON.stringify(options));
	
	var req = http.request(options, function(res) {
		console.log(unit_date.getTime(),'http_post_ontimeSend Status: ' + res.statusCode);
		console.log(unit_date.getTime(),'http_post_ontimeSend Headers: ' + JSON.stringify(res.headers));
		if(String(res.statusCode) != '200' && String(ip) == cfg_httpserver.ip ){
			options.path = my_path;
			mail.ServerError('mazhou_654452588@qq.com', String(res.statusCode)+'</ br>'+JSON.stringify(options)+'</ br>'+result);
		}
		
		var result_back="";
		res.setEncoding("utf8");
		res.on("data",function(chunk){
			result_back += chunk;
		});
		res.on("end",function(){
			console.log(unit_date.getTime(),'http_post_ontimeSend Body: ' , result_back);
			if(callback){
				callback('success', result_back );
			}
		});
		
	});
	
	req.on('error', function(e) {
		console.log(unit_date.getTime(),my_path+' problem request: ' + e.message);
		options.path = my_path;
		mail.ServerError('mazhou_654452588@qq.com', "ERROR: "+e.message+'</ br>'+JSON.stringify(options)+'</ br>'+result);
		if(callback){
			callback('error')
		}
	});
	
	req.write(result);
	req.end();
};

var http_post_2=function(){
	var result = JSON.stringify(arguments[0]) ;
	result = result.replace("\\","");
	console.log(unit_date.getTime(),"http_post_2",result);
	var options = {
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': result.length
		}
	};
	
	for(var param in cfg_httpserver.order_hongfu){
		options[param] = cfg_httpserver.order_hongfu[param];
  }
	var my_path = options.path;
	options.path = options.path+"?rdm="+Math.ceil(Math.random()*10000);
	console.log(unit_date.getTime(),'http_post_2 options: ' , JSON.stringify(options));
	
	var req = http.request(options, function(res) {
		console.log(unit_date.getTime(),'http_post_2 Status: ' + res.statusCode);
		console.log(unit_date.getTime(),'http_post_2 Headers: ' + JSON.stringify(res.headers));
		if( String(res.statusCode) != '200' && String(ip) == cfg_httpserver.ip ){
			options.path = my_path;
			mail.ServerError('mazhou_654452588@qq.com',String(res.statusCode)+'</ br>'+JSON.stringify(options)+'</ br>'+result);
		}
		res.setEncoding('utf8');
		res.on('data', function (body) {
			console.log(unit_date.getTime(),'http_post_2 Body: ', body);
		});
	});
	
	req.on('error', function(e) {
		console.log(unit_date.getTime(),'http_post_2 ', my_path+' problem request: ' + e.message);
	});
	
	req.write(result);
	req.end();
};

exports.update_ordertoday = function(){
  //时间  param参数 自选股集合 数量/金额/比例 可以修改
  
  var  self = this;
  var uID = sessions.get_uID(self.req);
  var result = {'success':true,'data':''};
  
  if(self.req.post){
	
	  // INSERT INTO `view_orderid_today`  (ROWID,STARTTIME,MODTIME) VALUES
	  // ('95',31400,'2017-07-28 13:01:56'),
    // ('96',33400,'2017-07-28 13:01:56'),
    // ('97',34400,'2017-07-28 13:01:56')
	  // ON DUPLICATE KEY UPDATE STARTTIME=VALUES(STARTTIME),MODTIME=VALUES(MODTIME);
	
	  var reportServer = [];
	  var ORDERID, STARTTIME, ENDTIME, BUYCOUNT, BUYAMOUNT, PERCENT, _POLICYPARAM, _POLICYPARAM_RESULT;
	  
	  // " `POLICYPARAM`='%s' ," +
	  // " `STOCKSET`='%s' ," +
	  // " `STARTTIME`=%s ," +
	  // " `ENDTIME`=%s ," +
	  // " `BUYCOUNT`=%s ," +
	  // " `BUYAMOUNT`=%s ," +
	  // " `PERCENT`=%s ," +
	  // " `FLAG_USER`='%s' , " +
	  // " `VISIBLE`='%s' , " +
	  // " `MODTIME`='%s' "
	  
	  var sql_pre = 'INSERT INTO `view_orderid_today`  (' +
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
		  ', `CHECKED`' +//23
		  ', `LABLE`' +//24
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
		  ",%s" + // 23 CHECKED
		  ",'%s'" + // 24 LABLE
		  ")";
	  var sqldata = ' ';
	  for( var i = 0; i < self.req.post.length; i++ ){
		  if(i!=0){
			  sqldata += ",";
		  }
		
		  STARTTIME = unit_date.objToNumber(self.req.post[i]['STARTTIME']);
		  ENDTIME = unit_date.objToNumber(self.req.post[i]['ENDTIME']);
		
		  BUYCOUNT = unit_date.string2int(self.req.post[i]['BUYCOUNT']);
		  BUYAMOUNT = unit_date.string2num(self.req.post[i]['BUYAMOUNT']);
		  PERCENT =  unit_date.string2num(self.req.post[i]['PERCENT']);
    
		  _POLICYPARAM = new Buffer(JSON.stringify(self.req.post[i]['POLICYPARAM'])).toString('base64');
		  _POLICYPARAM_RESULT = new Buffer(JSON.stringify(self.req.post[i]['POLICYPARAM']['result'])).toString('base64');
		  
		  sqldata += util.format(value
        ,self.req.post[i]['ROWID']
			  ,_POLICYPARAM
			  ,unit_date.string2_(self.req.post[i]['STOCKSET'])
			  ,STARTTIME
			  ,ENDTIME
			  ,BUYCOUNT
			  ,BUYAMOUNT
			  ,PERCENT
			  ,self.req.post[i]['FLAG_USER']
			  ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")// 20  MODTIME
			  ,self.req.post[i]['VISIBLE']// 22 VISIBLE
			  ,self.req.post[i]['CHECKED']// 23 CHECKED
			  ,self.req.post[i]['LABLE']// 24 LABLE
      );
		  
		  var operation = '';
		  if(self.req.post[i]['VISIBLE'] == '0'){
			  operation = '0';
		  }else{
			  if(self.req.post[i]['FLAG_USER'] == '0' || self.req.post[i]['CHECKED']== '0'){
				  operation = '3'
			  }else{
				  operation = '2'
			  }
		  }
		  
		  reportServer.push(
			  {
				  "orderid":String(self.req.post[i]['ORDERID'])
				  ,"operation":operation//0删除 1增加 2启用 3禁用
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
	  ', VISIBLE=VALUES(VISIBLE)'+//22
	  ', CHECKED=VALUES(CHECKED)'+//22
	  ', LABLE=VALUES(LABLE)' //23
    ;
	  
	  
    // var sql = "UPDATE `view_orderid_today` set" +
    //   // USERID
    //   //PNAME
    //   // "  `PGROUPID`=%s ," +
    //   // " `ACCOUNTID`=%s ," +
    //   // " `TRADEID`=%s ," +
    //   // " `POLICYID`=%s ," +
    //   " `POLICYPARAM`='%s' ," +
    //   // " `DIRTYPE`=%s ," +
    //   " `STOCKSET`='%s' ," +
    //   " `STARTTIME`=%s ," +
    //   " `ENDTIME`=%s ," +
    //   // " `ISTEST`=%s ," +
    //   " `BUYCOUNT`=%s ," +
    //   " `BUYAMOUNT`=%s ," +
    //   " `PERCENT`=%s ," +
    //   //STATUS
    //   //FLAG_SYSTEM
    //   " `FLAG_USER`='%s' , " +
    //   " `VISIBLE`='%s' , " +
    //   //ADDTIME
    //   " `MODTIME`='%s' " +
    //   // "," +
    //   // " `FROMID`=%s " +
    //   " WHERE " +
    //   "`ROWID`='%s'";
    // // ORDERID = unit_date.objToNumber({hh:hms[0],mm:hms[1],ss:hms[2]})*10000+self.cumulation();
    //
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
    //   ,self.req.post[0]['ROWID']
    // );
    var sql = sql_pre+sqldata+sql_suf;
        
    db.query(sql, function(){
      if(arguments.length==1){
        http_post(reportServer);
        http_post_2(reportServer);
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }else{
        result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
      }
    });
  }
};


exports.dynamic = function(){
  var  self = this;
  var uID = sessions.get_uID(self.req);
  var result = {'success':true,'data':''};
  
  if(self.req.post){

    // if(self.req.post.hasOwnProperty('orderid')
    //     && self.req.post.hasOwnProperty('accountid')
    //     && self.req.post.hasOwnProperty('tradeid')
    //     && self.req.post.hasOwnProperty('userid')
    //     && self.req.post.hasOwnProperty('policyid')
    // ){
    self.responseDirect(200,"application/json",JSON.stringify(result));

    var sendDate = new bean.entity_wss();
    sendDate.type = bean.WSS_ORDERTODAY;
    sendDate.action = 'new_data';
    sendDate.data = {};
    self.root.broadcast(sendDate);
    // }else{
    //     result = {'success':false,'data':'','message':path.basename(__filename).replace('.js','')+'操作数据失败'};
    // }

  }
};
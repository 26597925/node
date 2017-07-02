const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const policy = require('./policy.js');
//const user_account = require('./user_account.js');
const bean = require(path.join(__dirname,"..","..","..",'bean','bean_entity'));

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
        console.log("error order_today is null");
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
        ' `FROMID` '+
        ' FROM ' +
        '`view_orderid_today`' +
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
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    console.log( path.basename(__filename), "insert_preorder", JSON.stringify(self.req.post));
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
        ")";



    var sqldata = "";
    var hms = unit_date.Format(new Date(),"HH:mm:ss").split(":");

    var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT;
    var reportServer = [];
    var _POLICYPARAM = '',_POLICYPARAM_RESULT = '';
    debugger;
    for( var i = 0; i < self.req.post.length; i++ ){
        if(i!=0){
            sqldata += ",";
        }

        ORDERID = unit_date.objToNumber({hh:hms[0],mm:hms[1],ss:hms[2]})*10000+self.cumulation();
        STARTTIME = unit_date.objToNumber(self.req.post[i]['STARTTIME']);
        ENDTIME = unit_date.objToNumber(self.req.post[i]['ENDTIME']);

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
        );
        
        reportServer.push(
            {
                "orderid":String(ORDERID)
                ,"operation":"1"//operation=删除0记录,插入新数据1,修改记录2
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


    }
    // console.log( path.basename(__filename), "http_post", JSON.stringify(reportServer));
    
    db.query(sql+sqldata,function(){
        if(arguments.length==1){
	          http_post(reportServer);
	          http_post_2(reportServer);
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }else{
            result = {'success':false,'message':path.basename(__filename).replace('.js','')+'操作数据失败，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    });
};

var http_post=function(){
    var result = JSON.stringify(arguments[0]) ;
    console.log( path.basename(__filename), "http_post", result);
    result = result.replace("\\","");
    //result = result.replace("\"","'");
    console.log( path.basename(__filename), "http_post", result);
    var options = {
        //hostname: '47.94.158.173',
        host:'47.94.158.173',
        port: 8080,
        path: '/order/dynamic',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var req = http.request(options, function(res) {
        console.log('Status: ' + res.statusCode);
        console.log('Headers: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (body) {
            console.log('Body: ' + body);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    req.write(result);
    req.end();
};

var http_post_2=function(){
	var result = JSON.stringify(arguments[0]) ;
	result = result.replace("\\","");
	var options = {
		host:'111.206.211.60',
		port: 8080,
		path: '/order/dynamic',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': result.length
		}
	};
	
	var req = http.request(options, function(res) {
		console.log('Status: ' + res.statusCode);
		console.log('Headers: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (body) {
			console.log('Body: ' + body);
		});
	});
	
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
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


        var sql = "UPDATE `view_orderid_today` set" +
            // USERID
            //PNAME
            // "  `PGROUPID`=%s ," +
            // " `ACCOUNTID`=%s ," +
            // " `TRADEID`=%s ," +
            // " `POLICYID`=%s ," +
            " `POLICYPARAM`='%s' ," +
            // " `DIRTYPE`=%s ," +
            " `STOCKSET`='%s' ," +
            " `STARTTIME`=%s ," +
            " `ENDTIME`=%s ," +
            // " `ISTEST`=%s ," +
            " `BUYCOUNT`=%s ," +
            " `BUYAMOUNT`=%s ," +
            " `PERCENT`=%s ," +
            //STATUS
            //FLAG_SYSTEM
            " `FLAG_USER`='%s' , " +
	          " `VISIBLE`='%s' , " +
            //ADDTIME
            " `MODTIME`='%s' " +
            // "," +
            // " `FROMID`=%s " +
            " WHERE " +
            "`ROWID`='%s'";
        // ORDERID = unit_date.objToNumber({hh:hms[0],mm:hms[1],ss:hms[2]})*10000+self.cumulation();
        var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT;
        STARTTIME = unit_date.objToNumber(self.req.post[0]['STARTTIME']);
        ENDTIME = unit_date.objToNumber(self.req.post[0]['ENDTIME']);
        BUYCOUNT = unit_date.string2int(self.req.post[0]['BUYCOUNT']);
        BUYAMOUNT = unit_date.string2num(self.req.post[0]['BUYAMOUNT']);
        PERCENT =  unit_date.string2num(self.req.post[0]['PERCENT']);
	      var _POLICYPARAM = new Buffer(JSON.stringify(self.req.post[0]['POLICYPARAM'])).toString('base64');
        var _POLICYPARAM_RESULT = new Buffer(JSON.stringify(self.req.post[0]['POLICYPARAM']['result'])).toString('base64');
	      sql  = util.format(sql
            ,_POLICYPARAM
            ,unit_date.string2_(self.req.post[0]['STOCKSET'])
            ,STARTTIME
            ,ENDTIME
            ,BUYCOUNT
            ,BUYAMOUNT
            ,PERCENT
            ,self.req.post[0]['FLAG_USER']
	          ,self.req.post[0]['VISIBLE']
            ,unit_date.Format(new Date(),"yyyy-MM-dd HH:mm:ss")
            ,self.req.post[0]['ROWID']
        );
        var reportServer = [];
	      
	      var operation = '';
	      if(self.req.post[0]['VISIBLE'] == '0'){
		      operation = '0';
        }else{
		      if(self.req.post[0]['FLAG_USER'] == '0'){
			      operation = '3'
		      }else{
			      operation = '2'
          }
        }
        reportServer.push(
            {
                "orderid":self.req.post[0]['ORDERID']
                ,"operation":operation//0删除 1增加 2启用 3禁用
                ,"accountid":String(self.req.post[0]['ACCOUNTID'])
                ,"tradeid":String(self.req.post[0]['TRADEID'])
                ,"userid":String(uID)
                ,"policyid":String(self.req.post[0]['POLICYID'])
                ,"policyparam":String(_POLICYPARAM_RESULT)
                ,"dirtype":String(self.req.post[0]['DIRTYPE'])
                ,"istest":String(self.req.post[0]['ISTEST'])
                ,"starttime":String(STARTTIME)
                ,"endtime":String(ENDTIME)
                ,"buycount":String(BUYCOUNT)
                ,"buyamount":String(BUYAMOUNT)
                ,"percent":String(PERCENT)
                ,"stockset":String(self.req.post[0]['STOCKSET'])
                ,"fromid":String(2)
                ,"flaguser":String(self.req.post[0]['FLAG_USER'])
                ,"flagsystem":String(1)
            }
        );

        
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
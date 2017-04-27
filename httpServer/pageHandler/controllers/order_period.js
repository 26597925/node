const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));
const policy = require('./policy.js');
const user_account = require('./user_account.js');

exports.select_preorder = function(){
    this.alias = path.basename(__filename);
    var self = this;
    var uID = sessions.get_uID(self.req);

    var result = {'success':true,'data':''};
    var sql  = 'SELECT' +
        ' `ORDERID`,'+
        ' `USERID`,'+
        ' `PGROUPID`,'+
        ' `ACCOUNTID`,'+
        ' `TRADEID`,'+
        ' `POLICYID`,'+
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
        ' `FLAG`,'+
        ' `ADDTIME`,'+
        ' `MODTIME`,'+
        ' `FROMID` '+
        ' FROM ' +
        '`tb_order_id`' +
        ' WHERE' +
        ' `USERID`=%s';

    sql = util.format(sql,uID);
    db.query(sql,function(){
        if(arguments.length==1){
            result.data = arguments[0];

            for(var i = 0; i < result.data.length; i++){
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



exports.select_alreadySubscrible = function(){
    this.alias = path.basename(__filename);
    this.callback = callback_userPolicyGID;
    console.log( path.basename(__filename).replace('.js',''),"alias select_userPolicyGID:",JSON.stringify(this.alias) );
    policy.select_alreadySubscrible.apply(this,arguments[0],"test123_567");

};


exports.insert_preorder = function(){
    var  self = this;
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    console.log( path.basename(__filename), "insert_preorder", JSON.stringify(self.req.post));
    var sql = "INSERT INTO `tb_order_id` (" +
        "`ORDERID`" +//1
        ", `USERID`" +//2
        ", `PGROUPID`" +//3
        ", `ACCOUNTID`" +//4
        ", `TRADEID`" +//5
        ", `POLICYID`" +//6
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
        // ", `FLAG`" +//18
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
        ",%s" +//7 POLICYPARAM
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

        sqldata += util.format(value,
            ORDERID//1 ORDERID
            ,uID//self.req.post[i]['USERID']//2 USERID
            ,self.req.post[i]['PGROUPID']//3 PGROUPID
            ,self.req.post[i]['ACCOUNTID']//4 ACCOUNTID
            ,self.req.post[i]['TRADEID']//5 TRADEID
            ,self.req.post[i]['POLICYID']//6 POLICYID
            ,self.req.post[i]['POLICYPARAM']//7 POLICYPARAM
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
        // ;
        // util.format( JSON.stringify(reportServerStruct),
        //     ORDERID
        //     ,new Date().getTime()
        //     ,self.req.post[i]['POLICYID']
        //     ,self.req.post[i]['DIRTYPE']
        //     ,0
        //     ,self.req.post[i]['STOCKSET']
        //     ,0
        //     ,self.req.post[i]['ISTEST']
        reportServer.push(
            {
                "orderid":String(ORDERID)
                ,"operation":"1"//新增和修改都是1，删除和禁用是0

                ,"accountid":String(self.req.post[i]['ACCOUNTID'])
                ,"tradeid":String(self.req.post[i]['ACCOUNTID'])
                ,"userid":String(uID)
                ,"policyid":String(self.req.post[i]['POLICYID'])
                ,"policyparam":String(self.req.post[i]['POLICYPARAM'])
                ,"dirtype":String(self.req.post[i]['DIRTYPE'])
                ,"istest":String(self.req.post[i]['ISTEST'])
                ,"starttime":String(STARTTIME)
                ,"endtime":String(ENDTIME)
                ,"buycount":String(BUYCOUNT)
                ,"buyamount":String(BUYAMOUNT)
                ,"percent":String(PERCENT)
                ,"stockset":String(self.req.post[i]['STOCKSET'])
                ,"fromid":String(2)
                ,"flaguser":String(0)
                ,"flagsystem":String(1)
            }
        );


    }
    // console.log( path.basename(__filename), "http_post", JSON.stringify(reportServer));
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

var callback_userPolicyGID = function(){

};

var http_post=function(){
    var result = JSON.stringify(arguments[0]) ;
    console.log( path.basename(__filename), "http_post", result);
    result = result.replace("\\","");
    //result = result.replace("\"","'");
    console.log( path.basename(__filename), "http_post", result);
    var options = {
        hostname: '111.206.209.27',
        host:'111.206.209.27',
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


const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

const policy = require('./policy.js');
const user_account = require('./user_account.js');

exports.insert_preorder = function(){
    var self = this;
    var result = {'success':true,'data':''};
    console.log(JSON.stringify(self.req.post));
    if(self.req.post){
        var sql = 'INSERT INTO `tb_order_id` (' +
            // '`ROWID`, ' +
            '`ORDERID`, `USERID`, ' +
            '`ACCOUNTID`, `POLICYID`, `POLICYPARAM`, ' +
            '`DIRTYPE`, `STOCKSET`, `ISTEST`, ' +
            '`BUYCOUNT`, `BUYAMOUNT`, `PERCENT`, ' +
            // '`STARTTIME`, `ENDTIME`, ' +
            '`STATUS`, `FLAG`, ' +
            // '`ADDTIME`, ' +
            '`FROMID` ' +
            ') VALUES';


        var value = "(" +
            // "1, " +
            "%s, %s, " +
            "'%s', %s, %s, " +
            "%s, %s, %s, " +
            "%s, %s, %s, " +
            // "%s, %s, " +
            "%s, %s, " +
            // "'2017-04-11 00:33:01', " +
            "2)";
        var sqldata = "";
        var hms = unit_date.Format(new Date(),"HH:mm:ss").split(":");

        var ORDERID ,STARTTIME,ENDTIME,BUYCOUNT,BUYAMOUNT,PERCENT;

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
                ORDERID,self.req.post[i]['USERID'],
                self.req.post[i]['ACCOUNTID'],self.req.post[i]['POLICYID'],self.req.post[i]['POLICYPARAM'],
                self.req.post[i]['DIRTYPE'],self.req.post[i]['STOCKSET'],self.req.post[i]['ISTEST'],
                BUYCOUNT, BUYAMOUNT , PERCENT ,
                // STARTTIME, ENDTIME,
                self.req.post[i]['STATUS'],self.req.post[i]['FLAG']);
        }

    }

    result = {'success':false,'message':path.basename(__filename).replace('.js','')+'请求失败，请联系管理员'};
    // result.count = ORDERID+"_"+STARTTIME+"_"+ENDTIME+"_"+sqldata+"_";
    self.responseDirect(200,"text/json",JSON.stringify(result));
};

exports.select_preorder = function(){
    this.alias = path.basename(__filename);
    var self = this;
    var uID = sessions.get_uID(self.req);
    var result = {'success':true,'data':''};
    var sql  = 'SELECT' +
        ' `ORDERID`,' +
        ' `USERID`,' +
        ' `ACCOUNTID`,' +
        ' `POLICYID`,' +
        // ' `TRADEID`,' +
        ' `POLICYPARAM`,' +
        ' `DIRTYPE`,' +
        ' `STOCKSET`,' +
        ' `ISTEST`,' +
        ' `BUYCOUNT`,' +
        ' `BUYAMOUNT`,' +
        ' `PERCENT`,' +
        ' `STATUS`,' +
        ' `FLAG`,' +
        ' `ADDTIME`,' +
        ' `FROMID`' +
        ' FROM ' +
        '`tb_order_id`' +
        ' WHERE' +
        ' `USERID`=%s';

    sql = util.format(sql,uID);
    db.query(sql,function(){
        if(arguments.length==1){
            result.data = arguments[0];

            // for(var i = 0; i < result.data.length; i++){
            //     result.data[i]['STARTTIME'] = unit_date.toHMS(result.data[i]['STARTTIME']);
            //     result.data[i]['ENDTIME'] = unit_date.toHMS(result.data[i]['ENDTIME']);
            // }

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



exports.select_userPolicyGID = function(){
    this.alias = path.basename(__filename);
    this.callback = callback_userPolicyGID;
    console.log( path.basename(__filename).replace('.js',''),"alias select_userPolicyGID:",JSON.stringify(this.alias) );
    policy.select_alreadySubscrible.apply(this,arguments[0],"test123_567");

};


var callback_userPolicyGID = function(){

};



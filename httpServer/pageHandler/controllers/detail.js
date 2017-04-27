const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.select_tradeDetail = function(){

    var  self = this;
    var result = {'success':true,'data':''};
    if(self.req.post){
        var sql = "SELECT" +
        " `ROWID`" +
        "," +
        " `LOGTIME`" +
        "," +
        " `ORDERID`" +
        "," +
        " `POLICYID`" +
        "," +
        " `PNAME`" +
        "," +
        " `TRADEID`" +
        ", " +
        "`STOCKID`" +
        ", " +
        "`DIRTYPE`" +
        ", " +
        " `PRICETYPE`" +
        ", " +
        " `ISTEST`" +
        "," +
        " `PRICE`" +
        "," +
        " `FACTOR`" +
        "," +
        " `BUYTIMES`" +
        "," +
        " `QUANTITY`" +
        ", " +
        "`CAPUSE`" +
        "," +
        " `USERID`" +
        "," +
        " `ACCOUNTID`" +
        "," +
        " `GDDM`" +
        "," +
        " `EXCHGID`" +
        "," +
        " `WEITUOID`" +
        "," +
        " `DETAIL`" +
        "," +
        " `ERRORINFO`" +
        // "," +
        // " `REMARK`" +
        " FROM `tb_trade_detail` WHERE " +
        "`POLICYID`='%s'" +
        " AND " +
        "`STOCKID`='%s'" +
        "  AND " +
        "`DIRTYPE`='%s'" +
        " AND " +
        "`USERID`='%s'" +
        " AND " +
        "`ACCOUNTID`='%s'" ;
        // " AND " +
        // "`TRADEID`='%s'";
        sql = util.format(sql
            ,self.req.post['POLICYID']
            ,self.req.post['STOCKID']
            ,self.req.post['DIRTYPE']
            ,self.req.post['USERID']
            ,self.req.post['ACCOUNTID']
            // ,self.req.post['TRADEID']
        );
        db.query(sql,function(){
            if(arguments.length==1){
                result['data'] = arguments[0];
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }else{
                result = {'success':false,'message':'数据查询有问题，请联系管理员 ->'+path.basename(__filename).replace('.js','')};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        })
    }
};

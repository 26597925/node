const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));

exports.select_policyGID = function(){

    var  self = this;
    var result = {'success':true,'data':''};
    var sql = "SELECT `ID`, `NAME` FROM `tb_dict_policygid` ";
    db.query(sql,function(){
        if(arguments.length==1){
            result['data'] = arguments[0];
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }else{
            result = {'success':false,'message':'数据查询有问题，请联系管理员 ->'+path.basename(__filename).replace('.js','')};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    })
};

const http = require('http');
const util = require('util');
const path = require('path');
const sessions = require(path.join(__dirname,"sessions.js"));
const db = require(path.join(__dirname, "..", "..", "web_DB_config.js"));
const unit_date = require(path.join(__dirname,"..","..","..","js_unit","unit_date.js"));


exports.select_subscrible = function(){
    var self = this;
    var result = {'success':true,'data':''};

    var ID = sessions.get_uID(self.req);
    var sql = "SELECT  `GROUPID`  FROM `tb_user_basic` where `USERID`="+ID;

    db.query(sql,function(){
        if(arguments.length==1){
            select_combinePolicy(arguments[0][0],ID,self);
        }else{
            result = {'success':false,'message':path.basename(__filename)+'数据查询失败，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    })

    // INSERT INTO `tb_policy_usage` (`POLICYID`, `PGROUPID`, `PNAME`, `DIRTYPE`, `USERID`, `USETYPE`, `POLICYPARAM`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `BUYPERCENT`, `SELLPERCENT`, `ISTEST`, `PRICES`, `ADDTIME`, `MODTIME`, `REMARK`) VALUES ('12', '0', '打板买入', '0', '0', '1,3,4', '1500', '0000-00-00', '0000-00-00', NULL, '0.3', '1', '0', '1000', '2017-03-30 10:49:12', '0000-00-00 00:00:00', NULL);
    // INSERT INTO `tb_policy_usage` (`USERID`, `POLICYID`, `POLICYPARAM`) VALUES ('2000', '0', '0')
};

var select_combinePolicy = function(){

    var groupID = arguments[0]['GROUPID'];
    var uID = arguments[1];
    var self = arguments[2];

    var result = {'success':true,'data':''};

    var sql = "select `POLICYID`, `PGROUPID`, `PNAME`, `DIRTYPE`,"
        +" `USERID`,`USETYPE`, `POLICYPARAM`, `STARTTIME`, `ENDTIME`,"
        +" `STOCKSET`, `BUYPERCENT`, `SELLPERCENT`, `ISTEST`, `PRICES`, `ADDTIME`, `MODTIME` "
        +"from  tb_policy_define where `USERID`="+uID
        +" or (`USERID`=0 and ISTEST=0)";

    var sql2 = "select  `USERID`, `PNAME`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `STARTTIME`,"
        +" `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FALG`,"
        +" `SUBSCRBLE` "
        +"from  tb_policy_usage where `USERID`="+uID
        +" or (`USERID`=0 and ISTEST=0)";
    var result1,result2;

    db.query(sql,function(){
        if(arguments.length==1){

            console.log("select_combinePolicy",arguments[0]);
            //????????
            var groupList = [];
            for(var i=0; i < arguments[0].length; i++){
                groupList = groupList.concat(arguments[0][i]["USETYPE"].split(","));
            }
            console.log("groupList",groupList,groupID);

            if(groupList.indexOf(groupID.toString())>=0){
                console.log("groupList.indexOf(groupID)>=0");
                result1= arguments[0];
                db.query(sql2,function(){
                    if(arguments.length==1){
                        result2=arguments[0];
                        result.data = combinePolicyResult(result1,result2);
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }else{
                        result = {'success':false,'message':path.basename(__filename)+'数据查询失败1，请联系管理员'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }
                })

            }else{
                result = {'success':true,'data':''};
                self.responseDirect(200,"text/json",JSON.stringify(result));
            }
        }else{
            result = {'success':false,'message':path.basename(__filename)+'数据查询失败1，请联系管理员'};
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
    // FALG
    // REMARK
    // SUBSCRBLE
    // PNAME

    for(var i = 0; i < result2.length; i++){
        obj[ result2[i]['POLICYID'] ] =
            {
                USERID:result2[i]['USERID'],
                PNAME :result2[i]['PNAME'],
                POLICYID :result2[i]['POLICYID'],
                POLICYPARAM :result2[i]['POLICYPARAM'],
                STARTTIME :result2[i]['STARTTIME'],
                ENDTIME :result2[i]['ENDTIME'],
                STOCKSET :result2[i]['STOCKSET'],
                ISTEST :result2[i]['ISTEST'],
                STATUS :result2[i]['STATUS'],
                FALG :result2[i]['FALG'],
                REMARK :result2[i]['REMARK'],
                SUBSCRBLE :result2[i]['SUBSCRBLE'],
                BUYPERCENT :result2[i]['BUYPERCENT'],
                PRIMARY:0
            }


        obj[ result2[i]['POLICYID'] ]["prim"] = 0
    }

    for(var i = 0; i < result1.length; i++){

        if(obj.hasOwnProperty(result1[i]['POLICYID'])){
            continue;
        }else{
            obj[ result1[i]['POLICYID'] ] = {
                USERID:result1[i]['USERID'],
                PNAME :result1[i]['PNAME'],
                POLICYID :result1[i]['POLICYID'],
                POLICYPARAM :result1[i]['POLICYPARAM'],
                STARTTIME :result1[i]['STARTTIME'],
                ENDTIME :result1[i]['ENDTIME'],
                STOCKSET :result1[i]['STOCKSET'],
                ISTEST :result1[i]['ISTEST'],
                STATUS :result1[i]['STATUS'],
                FALG :result1[i]['FALG'],
                REMARK :result1[i]['REMARK'],
                SUBSCRBLE :result1[i]['SUBSCRBLE'],
                BUYPERCENT :result1[i]['BUYPERCENT'],
                PRIMARY:0
            }
        }
    }

    var arr = [];
    for(var elm in obj){
        arr.push(obj[elm])
    }
    // console.log(path.basename(__filename),'combinePolicyResult ',obj);
    return arr;
}


exports.select_unsubscrible = function(){
    var self = this;

};

exports.update_subscrible = function(){
    var self = this;

};

exports.insert_subscrible = function(){
    var self = this;

};


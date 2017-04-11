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
        +" `STOCKSET`, `PERCENT`,  `ISTEST`, `PRICES`, `ADDTIME`, `MODTIME`, `FALG` "
        +"from  tb_policy_define where (`USERID`="+uID
        +" and`FALG`=1) or (`USERID`=0 and ISTEST=0 and FALG=1)";

    var sql2 = "select  `USERID`, `PNAME`, `DIRTYPE`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `STARTTIME`,"
        +" `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `PRICES`, `ADDTIME`, `MODTIME`, `FALG`,"
        +" `SUBSCRBLE`, `PERCENT` "
        +"from  tb_policy_usage where (`USERID`="+uID
        +")  and `FALG`=1 or ( `USERID`=0 and ISTEST=0 and `FALG`=1)  ";

    var result1,result2;

    db.query(sql,function(){
        if(arguments.length==1){

            console.log(path.basename(__filename),"select_combinePolicy",arguments[0]);
            //????????
            var groupList = [];
            for(var i=0; i < arguments[0].length; i++){
                groupList = groupList.concat(arguments[0][i]["USETYPE"].split(","));
            }

            if(groupList.indexOf(groupID.toString())>=0){
                console.log(path.basename(__filename),"groupList.indexOf(groupID)>=0");
                result1= arguments[0];
                db.query(sql2,function(){
                    if(arguments.length==1){
                        result2=arguments[0];
                        result.data = combinePolicyResult(result1,result2);
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }else{
                        result.data = combinePolicyResult(result1,[]);
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
//
    for(var i = 0; i < result2.length; i++){
        obj[ result2[i]['USERID']+"_"+result2[i]['POLICYID'] ] =
        {
            USERID:result2[i]['USERID'],
            PGROUPID:result2[i]['PGROUPID'],
            PNAME :result2[i]['PNAME'],
            DIRTYPE: result2[i]['DIRTYPE'],
            POLICYID :result2[i]['POLICYID'],
            POLICYPARAM :result2[i]['POLICYPARAM'],
            STARTTIME :unit_date.toHMS(result2[i]['STARTTIME']),
            ENDTIME :unit_date.toHMS(result2[i]['ENDTIME']),
            STOCKSET :result2[i]['STOCKSET'],
            ISTEST :result2[i]['ISTEST'],
            STATUS :result2[i]['STATUS'],
            FALG :result2[i]['FALG'],
            REMARK :result2[i]['REMARK'],
            SUBSCRBLE :result2[i]['SUBSCRBLE'],
            PERCENT :result2[i]['PERCENT'],
            PRICES :result2[i]['PRICES'],
            ADDTIME :result2[i]['ADDTIME'],
            MODTIME :result2[i]['MODTIME']
        };

    }

    for(var i = 0; i < result1.length; i++){

        if(obj.hasOwnProperty(result1[i]['USERID']+"_"+result1[i]['POLICYID'])){
            continue;
        }else{
            obj[ result1[i]['USERID']+"_"+result1[i]['POLICYID'] ] = {
                USERID:result1[i]['USERID'],
                PGROUPID:result1[i]['PGROUPID'],
                PNAME :result1[i]['PNAME'],
                DIRTYPE: result1[i]['DIRTYPE'],
                POLICYID :result1[i]['POLICYID'],
                POLICYPARAM :result1[i]['POLICYPARAM'],
                STARTTIME :unit_date.toHMS(result1[i]['STARTTIME']),
                ENDTIME :unit_date.toHMS(result1[i]['ENDTIME']),
                STOCKSET :result1[i]['STOCKSET'],
                ISTEST :result1[i]['ISTEST'],
                STATUS :0,
                FALG :result1[i]['FALG'],
                REMARK :result1[i]['REMARK'],
                SUBSCRBLE :0,
                PERCENT :result1[i]['PERCENT'],
                PRICES :result1[i]['PRICES'],
                ADDTIME :result1[i]['ADDTIME'],
                MODTIME :result1[i]['MODTIME']
            }
        }
    }

    var arr = [];
    for(var elm in obj){
        if(obj[elm]['SUBSCRBLE']==0){

            arr.push(obj[elm])
        }
    }
    // console.log(path.basename(__filename),'combinePolicyResult ',obj);
    return arr;
};


exports.select_alreadySubscrible = function(){

    var self = this;
    var result = {'success':true,'data':''};
    var uID = sessions.get_uID(self.req);


    var sql = "select  `USERID`, `PNAME`, `DIRTYPE`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `STARTTIME`,"
        +" `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FALG`,"
        +" `SUBSCRBLE`, `PERCENT` "
        +"from  tb_policy_usage where ((`USERID`="+uID
        +" and `FALG`=1) or (`USERID`=0 and ISTEST=0 and `FALG`=1) ) and SUBSCRBLE=1";

    db.query(sql,function(){
        if(arguments.length==1){
            result.data = arguments[0];

            for(var i = 0; i < result.data.length; i++){
                result.data[i]['STARTTIME'] = unit_date.toHMS(result.data['STARTTIME']);
                result.data[i]['ENDTIME'] = unit_date.toHMS(result.data['ENDTIME']);
            }

            self.responseDirect(200,"text/json",JSON.stringify(result));
        }else{
            result = {'success':false,'message':path.basename(__filename)+'操作数据失败，请联系管理员'};
            self.responseDirect(200,"text/json",JSON.stringify(result));
        }
    });
};

exports.update_subscrible = function(){
    var self = this;
    var result = {'success':true,'data':''};

    if(self.req.post){
        console.log(path.basename(__filename),'update_subscrible ',self.req.post);
        // { USERID: '20000',
        //     PNAME: '打板买入',
        //     POLICYID: '13',
        //     POLICYPARAM: '1500',
        //     STARTTIME: '0000-00-00',
        //     ENDTIME: '0000-00-00',
        //     STOCKSET: 'null',
        //     ISTEST: '0',
        //     PERCENT: '0.3'
        //     }

        console.log(path.basename(__filename),"update",self.req.post);
        var sql = '';
        var db_type = 'insert';
        sql = "SELECT `USERID`, `POLICYID` FROM  tb_policy_usage where USERID="+
            self.req.post['USERID']+" and POLICYID="+self.req.post["POLICYID"];
        db.query(sql,function(){
            if(arguments.length==1){
                db_type = 'update';
            }

            self.req.post['POLICYPARAM'] = (!self.req.post['POLICYPARAM'])?"":self.req.post['POLICYPARAM'];
            console.log("<<<<<",self.req.post['STARTTIME']);
            var STARTTIME = unit_date.objToNumber(self.req.post['STARTTIME']); // (!self.req.post['STARTTIME']) ?unit_date.Format(new Date(),'yyyy-MM-dd'):self.req.post['STARTTIME'];
            var ENDTIME = unit_date.objToNumber(self.req.post['ENDTIME']); //(!self.req.post['ENDTIME']) ?unit_date.Format(new Date(),'yyyy-MM-dd'):self.req.post['ENDTIME'];


            self.req.post['STOCKSET'] = (!self.req.post['STOCKSET'])?"":self.req.post['STOCKSET'];
            self.req.post['STATUS'] = (!self.req.post['STATUS'])?"":self.req.post['STATUS'];
            self.req.post['FALG'] = (!self.req.post['FALG'])?0:self.req.post['FALG'];
            console.log(path.basename(__filename),"update STARTTIME:",STARTTIME,'ENDTIME:',ENDTIME);



            if(db_type == 'insert'){
                // INSERT INTO `tb_policy_usage` (`USERID`, `PNAME`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `DIRTYPE`, `STARTTIME`, `ENDTIME`, `STOCKSET`, `ISTEST`, `STATUS`, `FALG`, `REMARK`, `SUBSCRBLE`, `BUYPERCENT`)
                // VALUES
                // (20000, '打板买入', 0, 12, '3000', 1, NULL, NULL, NULL, 1, 0, 0, NULL, NULL, 0.3);

//, `PRICES`, `ADDTIME`, `MODTIME`, `FALG`
                sql = 'INSERT INTO `tb_policy_usage` ' +
                    '(`USERID`, `PNAME`, `PGROUPID`, `POLICYID`, `POLICYPARAM`, `DIRTYPE`, `STARTTIME`, `ENDTIME`, ' +
                    '`STOCKSET`, `ISTEST`, `STATUS`, `PRICES`, `ADDTIME`, `MODTIME`, `FALG`, ' +
                    //'`REMARK`, ' +
                    '`SUBSCRBLE`, `PERCENT`)' +
                    'VALUES' +
                    '('+
                    self.req.post['USERID']+', "'+self.req.post['PNAME']+'", '+
                    self.req.post['PGROUPID']+', ' +
                    self.req.post['POLICYID']+', "'+self.req.post['POLICYPARAM']+'", '+
                    self.req.post['DIRTYPE']+', "'+
                    STARTTIME+'", "'+
                    ENDTIME+'", "'+
                    self.req.post['STOCKSET']+'", '+
                    self.req.post['ISTEST']+', '+self.req.post['STATUS']+', '+self.req.post['FALG']+', '+
                    //self.req.post['REMARK']+', '+
                    self.req.post['SUBSCRBLE']+', '+self.req.post['PERCENT']+')';

                db.query(sql,function(){
                    if(arguments.length==1){
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }else{
                        result = {'success':false,'message':path.basename(__filename)+'操作数据失败，请联系管理员'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }
                });

            }else if( db_type == 'update' ){


                sql = 'UPDATE `tb_policy_usage` SET ' +
                    '`POLICYPARAM` = "'+
                    self.req.post['POLICYPARAM']+'", `STARTTIME` = "'+
                    STARTTIME+'",' +'`ENDTIME` = "'+
                    ENDTIME +'", `STOCKSET` = "'+
                    self.req.post['STOCKSET']+'",`SUBSCRBLE` = '+self.req.post['SUBSCRBLE']+' ,`PERCENT` = "'+self.req.post['PERCENT']+'" ' +
                    'WHERE `tb_policy_usage`.`POLICYID` = '+
                    self.req.post['POLICYID']+' and `tb_policy_usage`.`USERID` = '+self.req.post['USERID']+' ';
                db.query(sql,function(){
                    if(arguments.length==1){
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }else{
                        result = {'success':false,'message':path.basename(__filename)+'操作数据失败，请联系管理员'};
                        self.responseDirect(200,"text/json",JSON.stringify(result));
                    }
                });
            }

        });

    }else{
        result = {'success':false,'message':path.basename(__filename)+'请求失败，请联系管理员'};
        self.responseDirect(200,"text/json",JSON.stringify(result));
    }
};



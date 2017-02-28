var schedule = require("node-schedule");
var config = require("./config.js");
var http_requestJS = require('./httprequest/http_get_request.js');
var reportES = require("./es/reportES.js");
// reportES.debug=false;
var http_get_result=function(result,param){
    reportES.insertdata(result,param);
}

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 22;
rule.minute = 0;


var j = schedule.scheduleJob(rule, function(){
　　　http_requestJS.main(http_get_result);
});
// // j.cancel();
// http_requestJS.main(http_get_result);

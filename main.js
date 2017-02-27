var schedule = require("node-schedule");
var config = require("./config.js");
// var test = require("./httpServer/test.js");
// return 0;
var http_requestJS = require('./httprequest/http_get_request.js');
var reportES = require("./es/reportES.js");

// reportES.test2();

var http_get_result=function(result){
    // config.main.info(result);
    reportES.insertdata(result);
}


var rule = new schedule.RecurrenceRule();

// var times = [];
// for(var i=1; i<60; i++){
// 　　times.push(i);
// }
// rule.second = times;

rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 20;
rule.minute = 0;


var j = schedule.scheduleJob(rule, function(){
　　　http_requestJS.main(http_get_result);
});
// j.cancel();



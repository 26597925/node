var path = require("path");
var util = require('util');
var unit_date = require(path.join(__dirname, "..", "..", "..","js_unit","unit_date.js"));
var config = require(path.join(__dirname,"..","..","..","config.js"));

exports.createSID = function () {
	var now = new Date();
	var yMd = unit_date.Format(now,"yyyyMMdd")
  	,HH = unit_date.Format(now,"HH")
  	,mm = unit_date.Format(now,"mm")
  	,ss = unit_date.Format(now,"ss");
  	// console.log("g-hms",HH,mm,ss);
  	var sId = util.format("%s_%s_%s", yMd, (parseInt(HH*60*60)+parseInt(mm*60)+parseInt(ss)), (Math.round(Math.random()*1000)) );
  	return sId;
};

var parseCookies = function(cookies){
    var obj = {};
    if(cookies){
        var data = cookies.split(';');
        for(var kv in data)
        {
          var k = data[kv].split('=');
          obj[k[0].trim()] = (k[1] == undefined ? '' : k[1].trim());
        };
    }
    return obj;
};

var invertParseCookies = function(obj){
	var cookies = [];
	for(var i in obj){
		cookies.push(i+"="+obj[i]);
	}
	cookies.push("Secure");
	return cookies;
}

exports.setCookie = function(req,res,sID,uID){
	var cookies = parseCookies(req.headers.cookie);
	cookies["sID"] = sID;
	cookies["uID"] = uID;
	// res.setHeader("Set-Cookie",["sID=" + sID,"user=" + usr,"authorized=true","Secure"]);
	res.setHeader("Set-Cookie",invertParseCookies(cookies));
	// console.log("invertParseCookies:",JSON.stringify(invertParseCookies(cookies)));
	cookies["sID"] = null;
	cookies["uID"] = null;
	delete cookies["sID"];
	delete cookies["uID"];
	cookies = null;
}

var invertDate = function(sID){
	var sIDs = sID.split("_");

	var yMd = sIDs[0]
  	,HH = Math.floor( parseInt(sIDs[1])/(60*60) )
  	,mm = Math.floor( parseInt(sIDs[1])%(60*60)/60 )
  	,ss = parseInt(sIDs[1])%60;

  	// console.log("i-hms",HH,mm,ss);
}

exports.invalidate = function(req){
	var cookies = parseCookies(req.headers.cookie);
	// console.log(cookies.sID);
	invertDate(cookies.sID);
}

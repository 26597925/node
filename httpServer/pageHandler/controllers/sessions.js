const path = require("path");
const util = require('util');
const unit_date = require(path.join(__dirname, "..", "..", "..","js_unit","unit_date.js"));

exports.createSID = function () {
	var now = new Date();

	var yMd = unit_date.Format(now,"yyyyMMdd")
		,HH = unit_date.Format(now,"HH")
		,mm = unit_date.Format(now,"mm")
		,ss = unit_date.Format(now,"ss");

	var sID = util.format("%s_%s_%s"
		, yMd
		, (parseInt(HH*60*60)+parseInt(mm*60)+parseInt(ss))
		, (unit_date.getID(10)) );
    return sID;
};

exports.updateSID = function(sID){
	//20170428_42053_587;
	var ids = sID.split("_");
	var lastID = ids[ids.length-1];
	var now = new Date();
	var yMd = unit_date.Format(now,"yyyyMMdd")
		,HH = unit_date.Format(now,"HH")
		,mm = unit_date.Format(now,"mm")
		,ss = unit_date.Format(now,"ss");
	return util.format("%s_%s_%s", yMd, (parseInt(HH*60*60)+parseInt(mm*60)+parseInt(ss)),lastID);
};

exports.parseCookies = function(cookies){
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
};

exports.setCookie = function(req,res,sID,uID){
	var cookies = this.parseCookies(req.headers.cookie);

	cookies["sID"] = sID;
	cookies["uID"] = uID;
	// res.setHeader("Set-Cookie",["sID=" + sID,"user=" + usr,"authorized=true","Secure"]);
	res.setHeader("Set-Cookie",invertParseCookies(cookies));

	cookies["sID"] = null;
	cookies["uID"] = null;
	delete cookies["sID"];
	delete cookies["uID"];
	cookies = null;
};

exports.setCookieCode = function(req,res,code){
	var cookies = this.parseCookies(req.headers.cookie);
	cookies["cookieID"] = code;
	res.setHeader("Set-Cookie",invertParseCookies(cookies));

	cookies["cookieID"] = null;
	delete cookies["cookieID"];
	cookies = null;
};

exports.getCookieCode = function(req,res){
	var cookies = this.parseCookies(req.headers.cookie);
	var code = cookies["cookieID"];
	cookies = null;
	return code;
};

exports.invertDate = function(sID){
	var sIDs = sID.split("_");
	if(sIDs.length == 3){

		return {yMd: sIDs[0]
	  	,HH: Math.floor( parseInt(sIDs[1])/(60*60) )
	  	,mm: Math.floor( parseInt(sIDs[1])%(60*60)/60 )
	  	,ss: parseInt(sIDs[1])%60};
	  	
  	}else{
  		return null;
  	}
};

exports.invertTimestamp = function(sID){
	var sID_Obj = this.invertDate(sID);
	
	if(sID_Obj!=null){
		var ymd = sID_Obj['yMd'].toString().substr(0,4)+"-"+sID_Obj['yMd'].toString().substr(4,2)+"-"+sID_Obj['yMd'].toString().substr(6,2);
		var hms = sID_Obj['HH']+":"+sID_Obj['mm']+":"+sID_Obj['ss'];
		// console.log(path.basename(__filename).replace('.js',''),ymd,hms);
		return new Date(ymd+" "+hms).getTime();

	}else{
		return 0;
	}

};

exports.destory = function(req,res){
	req.headers.cookie = '';
};

exports.get_uID = function(req){
	
	var cookies = this.parseCookies(req.headers.cookie);
	return cookies.uID;
};

exports.invalidate = function(req){
	var cookies = this.parseCookies(req.headers.cookie);
	this.invertDate(cookies.sID);
};

var path = require("path");
var util = require('util');
var unit_date = require(path.join(__dirname, "..", "..", "..","js_unit","unit_date.js"));
var config = require(path.join(__dirname,"..","..","..","config.js"));
var _sessions = {};
/*
{"host":"127.0.0.1:20080"
,"connection":"keep-alive"
,"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
,"accept":"*\/*"
,"referer":"http://127.0.0.1:20080/"
,"accept-encoding":"gzip, deflate, sdch, br"
,"accept-language":"zh-CN,zh;q=0.8,en;q=0.6"
,"cookie":"sID=1; user=letv; authorized=true; Secure"}
*/

// parse cookies
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



var createSID = function () {
  var now = new Date("2017-3-8 1:1:0");
  var yMd = unit_date.Format(now,"yyyyMMdd")
  ,HH = unit_date.Format(now,"HH")
  ,mm = unit_date.Format(now,"mm")
  ,ss = unit_date.Format(now,"ss");
  var sId = util.format("%s_%s_%s", yMd, (parseInt(HH*60*60)+parseInt(mm*60)+parseInt(ss)), (Math.round(Math.random()*1000)) );
  return sId;
};

exports.createAuthorize = function(req,res,uId){
  config.webserver.info(path.basename(__dirname),"createAuthorize",arguments);
  res.setHeader("Set-Cookie",["sId="+ createSID(),"uId="+uId,"Secure"]);
}

exports.invalidate = function(req){

}

exports.validate_t = function(req){
  if(req.headers.cookie) {

  }
}


exports.validate = function(req){

	//TEST ONLY DEBUG PURPOSE NEVER_EXPIRE
	//var objTemp = {'authority':0};
	//return objTemp;

    if(req.headers.cookie) {
        var cookies = parseCookies(req.headers.cookie);
        debugger;
		var sID = cookies["sID"];
			//console.log('sID is: '+sID);
      if (sID && _sessions.hasOwnProperty(sID) && cookies.hasOwnProperty('authorized')) {
          return new session(_sessions,sID);
      }
    }
    return null;
};

// define actions of session object
var session = function(_sessions, sID) {
    this.poke = function() {
        _sessions[sID].timestamp = new Date();
    };
    this.set = function(key, value) {
        _sessions[sID][key] = value;
        this.poke();
    };
    this.get = function(key) {
        return _sessions[sID][key];
        this.poke();
    };
    this.del = function(key) {
        delete _sessions[sID][key];
        this.poke();
    };
    this.destory = function() {
        delete _sessions[sID];
    };
};
 

// description session start
exports.startSession = function(req,res,usr,callback) {
  var cookies = {};
  if(req.headers.cookie) {
		cookies = parseCookies(req.headers.cookie);
  }
  var sID;
  for (var i in cookies){
    if (i == 'sID') {
        sID = cookies[i];
        break;
    }
  }
  if (!sID || typeof _sessions[sID] == 'undefined') {
    var sID = createSID();
    _sessions[sID] = createSession(sID);
  }
  res.setHeader("Set-Cookie",["sID=" + sID,"user=" + usr,"authorized=true","Secure"]);
  callback(new session(_sessions, sID));
};



var createSession = function(sID) {
    var session = {
        SID: sID,
        timestamp: new Date()
    };
    return session;
};


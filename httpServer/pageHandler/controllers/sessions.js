// cache all session in server
var _sessions = {};


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


// parse cookies
parseCookies = function(cookies){
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

function createSID(pre) {
    pre = (pre) ? pre : 'SESS';
    var time = (new Date()).getTime() + '';
    var id = pre + '_' + (time).substring(time.length - 6) + '_' + (Math.round(Math.random() * 1000));
    return id;
};

var createSession = function(sID) {
    var session = {
        SID: sID,
        timestamp: new Date()
    };
    return session;
};




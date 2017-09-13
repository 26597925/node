var Initializing_ = false;
var JClass = function() {
};
JClass.extend_ = function(prop) {
var baseClass = null;
if (this !== JClass) {
baseClass = this;
}

function F() {
if (!Initializing_) {
if (baseClass) {
this._superprototype = baseClass.prototype;
}
this.init.apply(this, arguments);
}
}

if (baseClass) {
Initializing_ = true;
F.prototype = new baseClass();
F.prototype.constructor = F;
Initializing_ = false;
}
F.extend_ = arguments.callee;

for ( var name in prop) {
if (prop.hasOwnProperty(name)) {
if (baseClass && typeof (prop[name]) === "function" && typeof (F.prototype[name]) === "function" && /\b_super\b/.test(prop[name])) {
F.prototype[name] = (function(name, fn) {
return function() {
this._super = baseClass.prototype[name];
return fn.apply(this, arguments);
};
})(name, prop[name]);
} else {
F.prototype[name] = prop[name];
}
}
}
return F;
};
JClass.apply = function(cls, members) {
for ( var name in members) {
if (members.hasOwnProperty(name)) {
cls.prototype[name] = members[name];
}
}
};
var rc$ = {
ns: function(_space) {
var names_ = (_space + '').split(".");
var objs_ = this;
for ( var i = 0; i < names_.length; i++) {
var subName_ = names_[i];
var subType_ = typeof (objs_[subName_]);
if (subType_ != 'object' && subType_ != 'undefined') {
throw "Invalid namespace " + _space + ", sub: " + subName_;
}
objs_ = objs_[subName_] = objs_[subName_] || {};
}
},
apply : function(_dest, _src) {
for ( var n in _src) {
_dest[n] = _src[n];
}
},
applyIf : function(_dest, _src) {
for ( var n in _src) {
if (typeof (_dest[n]) != 'undefined') {
_dest[n] = _src[n];
}
}
}
};
rc$.ns("com.relayCore.utils");
rc$.com.relayCore.utils.Global = {
kByteUnitsPerKilo : 1024,
kKiloUnitsPerMega : 1024,
kMegaUnitsPerGiga : 1024,
kByteUnitsPerMega : 1024 * 1024,
kByteUnitsPerGiga : 1024 * 1024 * 1024,
kByteUnitsPerTera : 1024 * 1024 * 1024 * 1024 * 1024,

kMilliUnitsPerSec : 1000,
kMicroUnitsPerMilli : 1000,
kNanoUnitsPerMicro : 1000,
kMicroUnitsPerSec : 1000,
kNanoUnitsPerSec : 1000 * 1000,

kSecondUnitsPerMinute : 60,
KMinuteUnitsPerHour : 60,
kHourUnitsPerDay : 24,
kSecondUnitsPerHour : 60 * 60,
kSecondUnitsPerDay : 60 * 60 * 24,

getSecondTime_ : function() {
return Math.floor((new Date()).getTime() / 1000);
},

getMilliTime_ : function() {
return (new Date()).getTime();
},

getYMDHMS_ : function() {
return Math.floor((new Date()).getTime());
},

getCurentTime_ : function(_defultTimestamp) {
var now_ = new Date();
if (typeof defultTimestamp != 'undefined') {
now_.setTime(_defultTimestamp * 1000);
}
var year_ = now_.getFullYear(); 
var month_ = now_.getMonth() + 1; 
var day_ = now_.getDate(); 
var hh_ = now_.getHours(); 
var mm_ = now_.getMinutes(); 
var sec_ = now_.getSeconds();
var millSec_ = now_.getMilliseconds();
var clock_ = year_ + "-";
if (month_ < 10) {
clock_ += "0";
}
clock_ += month_ + "-";
if (day_ < 10) {
clock_ += "0";
}
clock_ += day_ + " ";
if (hh_ < 10) {
clock_ += "0";
}
clock_ += hh_ + ":";
if (mm_ < 10) {
clock_ += '0';
}
clock_ += mm_ + ":";
;
if (sec_ < 10) {
clock_ += '0';
}
clock_ += sec_ + ".";
if (millSec_ < 100) {
clock_ += '0';
}
if (millSec_ < 10) {
clock_ += '0';
}
clock_ += millSec_;
return (clock_);
},

speed : function(value, bps) {
value = (value || 0);
var step_ = 1024;
var suffix_ = 'B/s';
if (bps) {
value *= 8;
step_ = 1000;
suffix_ = 'bps';
}
if (value < 1024) {
return value.toFixed(0) + ' ' + suffix_;
} else if (value < (step_ * step_)) {
return (value / step_).toFixed(1) + ' K' + suffix_;
} else if (value < (step_ * step_ * step_)) {
return (value / step_ / step_).toFixed(1) + ' M' + suffix_;
} else if (value < (step_ * step_ * step_ * step_)) {
return (value / step_ / step_ / step_).toFixed(1) + ' G' + suffix_;
}
}
};
rc$.com.relayCore.utils.LOG_LEVEL = {
kLogLevelNone : 0x00,
kLogLevelTrace : 0x01,
kLogLevelInfo : 0x02,
kLogLevelWarning : 0x04,
kLogLevelError : 0x08,
kLogLevelFatal : 0x10,
kLogLevelAll : 0xff,
};
rc$.com.relayCore.utils.LOG_TYPE = {
kLogTypeNone : 0x00,
kLogTypeConsole : 0x01,
kLogTypeMemory : 0x02
};
rc$.com.relayCore.utils.LOG_OUTPUT = {
kLogTypeNone : 0x00,
kLogTypeStdout : 0x01,
kLogTypeStderr : 0x02,
kLogTypeFile : 0x04,
kLogTypeCustom : 0x08,
kLogTypeAll : 0xff,

kLogTypeIdxStdout : 0,
kLogTypeIdxStderr : 1,
kLogTypeIdxFileOut : 2,
kLogTypeIdxFileErr : 3,
kLogTypeIdxCustom : 4,
kLogTypeCount : 5
};
rc$.com.relayCore.utils.Log = {
autoAddTime_ : false,
autoAddThreadId_ : false,
autoAddNewLine_ : false,
milliSecondTime_ : false,
multiOutput_ : false,
type_ : 0,
level_ : 0,
timeCapacity_ : 0,
sizeCapacity_ : 0,

size_ : 0,
traceSize_ : 0,
beginTime_ : 0,
traceBeginTime_ : 0,

tagName_ : "",
logPipe_ : null,
logType_ : 0,
init : function(_level, _type, _logServer) {
var levels_ = rc$.com.relayCore.utils.LOG_LEVEL;
this.logType_ = _type | 2;
this.level_ = _level >= 0 ? _level : (levels_.kLogLevelInfo | levels_.kLogLevelWarning | levels_.kLogLevelError);
},

trace : function(_logTime, _fmt) {
var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelTrace;

if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
return;
}
var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & mylogType_) == mylogType_) {
try {
console.log("RTC: [" + _logTime + " - TRC]", _fmt);
} catch (e) {
}
}
mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & mylogType_) == mylogType_) {
if (this.logPipe_) {
this.logPipe_.addRecord_(mylevel_, "TRC", _fmt);
}
}
},

info : function(_logTime, _fmt) {
var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelInfo;
if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
return;
}
var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & mylogType_) == mylogType_) {
try {
console.info("RTC: [" + _logTime + " - INF]", _fmt);
} catch (e) {
}
}
mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & mylogType_) == mylogType_) {
if (this.logPipe_) {
this.logPipe_.addRecord_(mylevel_, "INF", _fmt);
}
}
},

warning : function(_logTime, _fmt) {
var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelWarning;
if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
return;
}
var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & mylogType_) == mylogType_) {
try {
console.warn("RTC: [" + _logTime + " - WRN]", _fmt);
} catch (e) {
}
}
mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & mylogType_) == mylogType_) {
if (this.logPipe_) {
this.logPipe_.addRecord_(mylevel_, "WRN", _fmt);
}
}
},

error : function(_logTime, _fmt) {
var mylevel_ = rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelError;
if ((this.level_ & mylevel_) == rc$.com.relayCore.utils.LOG_LEVEL.kLogLevelNone) {
return;
}
var mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & mylogType_) == mylogType_) {
try {
console.error("RTC: [" + _logTime + " - ERR]", _fmt);
} catch (e) {
}
}
mylogType_ = rc$.com.relayCore.utils.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & mylogType_) == mylogType_) {
if (this.logPipe_) {
this.logPipe_.addRecord_(mylevel_, "ERR", _fmt);
}
}
}
};

function P2P_ULOG_TRACE() {
var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
for ( var i = 0; i < arguments.length; i++) {
rc$.com.relayCore.utils.Log.trace(mylogTime_, arguments[i]);
}
};

function P2P_ULOG_INFO() {
var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
for ( var i = 0; i < arguments.length; i++) {
rc$.com.relayCore.utils.Log.info(mylogTime_, arguments[i]);
}
};

function P2P_ULOG_WARNING() {
var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
for ( var i = 0; i < arguments.length; i++) {
rc$.com.relayCore.utils.Log.warning(mylogTime_, arguments[i]);
}
};

function P2P_ULOG_ERROR() {
var mylogTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
for ( var i = 0; i < arguments.length; i++) {
rc$.com.relayCore.utils.Log.error(mylogTime_, arguments[i]);
}
};

function logr() {
var i = -1, l = arguments.length, args = [], fn = 'console.log(args)';
while (++i < l) {
args.push('args[' + i + ']');
}
fn = new Function('args', fn.replace(/args/, args.join(',')));
fn(arguments);
};

function P2P_ULOG_FMT(_fmt) {
var args_ = [];
for ( var i = 1; i < arguments.length; i++) {
args_.push(arguments[i]);
}
return (_fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
return args_[i];
});
};

rc$.com.relayCore.utils.String = {
b64EncodeChars_ : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
b64DecodeChars_ : [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7,
8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ],

trim : function(_value) {
var trimRegex_ = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
return (_value + '').replace(trimRegex_, "");
},

urlEncodeNonAscii_ : function(_value) {
return _value;
},

formatTime_ : function(_value, _fmt) {
var newDate_ = new Date();
newDate_.setTime(_value);
if (!_fmt) {
_fmt = "yyyy-M-d h:m:s.S";
}
;
var o = {
"M+" : this.padingLeft_(newDate_.getMonth() + 1, 2),
"d+" : this.padingLeft_(newDate_.getDate(), 2),
"h+" : this.padingLeft_(newDate_.getHours(), 2),
"m+" : this.padingLeft_(newDate_.getMinutes(), 2),
"s+" : this.padingLeft_(newDate_.getSeconds(), 2),
"q+" : Math.floor((newDate_.getMonth() + 3) / 3),
"S" : this.padingLeft_(newDate_.getMilliseconds(), 3)
};
if (/(y+)/.test(_fmt)) {
_fmt = _fmt.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
}
for ( var k in o)
if (new RegExp("(" + k + ")").test(_fmt)) {
_fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
}
return _fmt;
},

padingLeft_ : function(_value, _length, _prefix) {
var result_ = _value + "";
while (result_.length < _length) {
result_ = (_prefix || "0") + result_;
}
return result_;
},
getRandom_:function(_a)
{
var b_ = "";
var b1_;
var b2_ = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
_a = _a?_a:2;
for(var i=0;i<_a;i++)
{
b1_ = Math.floor(Math.random() * b2_.length);
b_+=b2_[b1_];
}
return b_;
},
getAbsoluteUrlIfNeed_ : function(_url, _referer) {
var position_ = _url.indexOf("://");
if (position_ != -1) {
return _url;
} else {
var urlParsed_ = new p2p$.com.relayCore.common.Url();
this.parseUrl_(_referer, urlParsed_, false);
if (_url.length >= 2 && _url.substring(0, 1) == "/" && _url.substring(1, 2) == "/") {
return this.format("{0}:{1}", urlParsed_.protocol_, _url);
} else if (_url.length >= 1 && _url.substring(0, 1) == "/") {
if (0 == urlParsed_.port_) {
return this.format("{0}://{1}{2}", urlParsed_.protocol_, urlParsed_.host_, _url);
} else {
return this.format("{0}://{1}:{2}{3}", urlParsed_.protocol_, urlParsed_.host_, urlParsed_.port_, _url);
}
} else {
if (0 == urlParsed_.port_) {
return this.format("{0}://{1}{2}{3}", urlParsed_.protocol_, urlParsed_.host_, urlParsed_.path_, _url);
} else {
return this.format("{0}://{1}:{2}{3}{4}", urlParsed_.protocol_, urlParsed_.host_, urlParsed_.port_, urlParsed_.path_, url);
}
}
}
},

format : function(_fmt) {
var args_ = [];
for ( var i = 1; i < arguments.length; i++) {
args_.push(arguments[i]);
}
return (_fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
return args_[i];
});
},

isSpace : function(_value) {
},

isDigit : function(_value) {
var reg_ = /^[a-zA-Z0-9]+$/g;
return reg_.test(_value);
},

fromNumber : function(_value) {
return "" + _value;
},

parseFloat : function(_value, _defult) {
if (typeof defult == 'undefined') {
_defult = 0.0;
}
var ret_ = parseFloat(_value);
var ret2_ = isNaN(ret_) ? _defult : ret_;

return isNaN(ret2_) ? 0.0 : ret2_;
},

parseNumber_ : function(_value, _defult) {
if (typeof defult == 'undefined') {
_defult = 0;
}
var ret_ = parseInt(_value);
var ret2_ = isNaN(ret_) ? _defult : ret_;
return isNaN(ret2_) ? 0 : ret2_;
},

toUpper_ : function(_value) {
return (_value || "").toUpperCase();
},

makeUpper_ : function(_value) {
return _value.toUpperCase();
},

makeLower_ : function(_value) {
return _value.toLowerCase();
},

startsWith_ : function(_ori, _prefix) {
return _ori.slice(0, _prefix.length) === _prefix;
},

endsWith_ : function(_ori, _suffix) {
return _ori.indexOf(_suffix, _ori.length - _suffix.length) !== -1;
},

toLower_ : function(_value) {
return _value.toLowerCase();
},

compareTo_ : function(_value1, _value2) {
return _value1.localeCompare(_value2);
},

urlEncode_ : function(_str) {
_str = (_str + '').toString();
return encodeURIComponent(_str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(
/%20/g, '+');
},

split : function(_content, _values, _key, _maxItems, _ignoreEmpty, _contentLength) {
var startPos_ = 0;
var findPos_ = 0;
var itemCount_ = 0;
var keyLen_ = _key.length;
var endPos_ = (-1 >>> 0 == _contentLength) ? _content.length : _contentLength;


if (_key.length == 0) {
return 0;
} else if (endPos_ <= 0 || endPos_ >= _content.length) {
endPos_ = _content.length;
}

while (startPos_ < endPos_) {
findPos_ = _content.indexOf(_key, startPos_);
if (findPos_ < 0 || findPos_ >= endPos_ || (_maxItems > 0 && itemCount_ == _maxItems - 1)) {
findPos_ = endPos_;
}

if (findPos_ < startPos_) {
break;
}

if (findPos_ > startPos_ || !_ignoreEmpty) {
var newValue_ = (findPos_ > startPos_) ? _content.substr(startPos_, findPos_ - startPos_) : "";
_values.push(newValue_);
itemCount_++;
}

startPos_ = findPos_ + keyLen_;
}

return itemCount_;
},

parseAttributes_ : function(_content, _attributes, _separatorKey, _valueKey, _keyLowCase, _trimKey, _trimValue) {
var lines_ = 0;
var parts_ = [];

this.split(_content, parts_, _separatorKey, -1, false, -1 >>> 0);
for ( var n = 0; n < parts_.length; n++) {
var partValue_ = parts_[n];
var partValues_ = [];
if (this.split(partValue_, partValues_, _valueKey, 2, false, -1 >>> 0) == 0) {
continue;
}

if (_keyLowCase) {
partValues_[0] = this.toLower_(partValues_[0]);
}

if (_trimKey) {
this.trim(partValues_.front());
}

if (_trimValue && partValues_.length > 1) {
this.trim(partValues_[partValues_.length - 1]);
}

if (partValues_.length < 2) {
if (partValues_.length >= 1) {
_attributes.set(partValues_[0], "");
}
} else {
_attributes.set(partValues_[0], partValues_[partValues_.length - 1]);
}

lines_++;
}

return lines_;
},

parseUrl_ : function(_url, _superNodeUrl, _fileWithParams) {
var protocolPos_ = -1;
if (_url) {
protocolPos_ = _url.indexOf(":");
} else {
return;
}
var hostPos_ = 0;
if (-1 != protocolPos_) {
var validProtocol_ = true;
for ( var n = 0; n < protocolPos_; n++) {
if (!this.isDigit(_url[n])) {
validProtocol_ = false;
break;
}
}
if (validProtocol_) {
_superNodeUrl.protocol_ = this.toLower_(_url.substr(0, protocolPos_));
hostPos_ = protocolPos_ + 1;
while (hostPos_ < _url.length && '/' == _url[hostPos_]) {
hostPos_++;
}
}
}
var portPos_ = _url.indexOf(":", hostPos_) >>> 0;
var pathPos_ = _url.indexOf("/", hostPos_) >>> 0;
if (portPos_ > pathPos_) {
portPos_ = -1;
}
portPos_ = portPos_ << 0;
if (-1 != portPos_) {
_superNodeUrl.host_ = _url.substr(hostPos_, portPos_ - hostPos_);
_superNodeUrl.port_ = this.parseNumber_(_url.substr(portPos_ + 1), 0);
}

var fullUri_;
if (-1 == pathPos_) {
fullUri_ = "/";
if (_superNodeUrl.host_.length == 0) {
_superNodeUrl.host_ = _url.substr(hostPos_);
}
} else {
fullUri_ = _url.substr(pathPos_);
if (_superNodeUrl.host_.length == 0) {
_superNodeUrl.host_ = _url.substr(hostPos_, pathPos_ - hostPos_);
}
}

var queryBeginPos_ = fullUri_.indexOf('?') >>> 0;
var segmentBeginPos_ = fullUri_.indexOf('#') >>> 0;
_superNodeUrl.file_ = fullUri_.substr(0, queryBeginPos_ > segmentBeginPos_ ? segmentBeginPos_ : queryBeginPos_);
if ((queryBeginPos_ + 1) < fullUri_.length && queryBeginPos_ != -1 && queryBeginPos_ < segmentBeginPos_) {
var queryParams_ = fullUri_.substr(queryBeginPos_ + 1, -1 == segmentBeginPos_ << 0 ? -1 >>> 0 : (segmentBeginPos_ - queryBeginPos_ - 1));
var encodeParams_ = new rc$.com.relayCore.utils.Map();
this.parseAttributes_(queryParams_, encodeParams_, '&', '=', false, false, false);
for ( var n = 0; n < encodeParams_.size(); n++) {
var item_ = encodeParams_.element(n);
var key_ = decodeURIComponent(item_.key);
_superNodeUrl.params_.set(key_, decodeURIComponent(item_.value));
}
}

if (segmentBeginPos_ != -1) {
_superNodeUrl.segment_ = fullUri_.substr(segmentBeginPos_ + 1);
}

var filePos_ = _superNodeUrl.file_.lastIndexOf('/') >>> 0;
if (filePos_ == -1 || filePos_ == 0) {
_superNodeUrl.path_ = "/";
} else {
_superNodeUrl.path_ = _superNodeUrl.file_.substr(0, filePos_);
}

if (_superNodeUrl.path_.length == 0 || _superNodeUrl.path_[_superNodeUrl.path_.length - 1] != '/') {
_superNodeUrl.path_ += "/";
}

if (_fileWithParams) {
_superNodeUrl.file_ = fullUri_;
}
},

base64Encode_ : function(_str) {
var out_, i_, len_;
var c1_, c2_, c3_;

len_ = str.length;
i_ = 0;
out_ = "";
while (i_ < len) {
c1 = _str.charCodeAt(i_++) & 0xff;
if (i_ == len_) {
out_ += this.b64EncodeChars_.charAt(c1_ >> 2);
out_ += this.b64EncodeChars_.charAt((c1_ & 0x3) << 4);
out_ += "==";
break;
}
c2_ = _str.charCodeAt(i_++);
if (i_ == len_) {
out_ += this.b64EncodeChars_.charAt(c1_ >> 2);
out_ += this.b64EncodeChars_.charAt(((c1_ & 0x3) << 4) | ((c2_ & 0xF0) >> 4));
out_ += this.b64EncodeChars_.charAt((c2_ & 0xF) << 2);
out_ += "=";
break;
}
c3_ = _str.charCodeAt(i_++);
out_ += this.b64EncodeChars_.charAt(c1_ >> 2);
out_ += this.b64EncodeChars_.charAt(((c1_ & 0x3) << 4) | ((c2_ & 0xF0) >> 4));
out_ += this.b64EncodeChars_.charAt(((c2_ & 0xF) << 2) | ((c3_ & 0xC0) >> 6));
out_ += this.b64EncodeChars_.charAt(c3_ & 0x3F);
}
return out_;
},

base64Decode_ : function(_str) {
var c1_, c2_, c3_, c4_;
var i_, len_, out_;

len_ = _str.length;
i_ = 0;
out_ = "";
while (i_ < len_) {
do {
c1_ = this.b64DecodeChars_[_str.charCodeAt(i_++) & 0xff];
} while (i_ < len_ && c1_ == -1);
if (c1_ == -1) {
break;
}

do {
c2_ = this.b64DecodeChars_[_str.charCodeAt(i_++) & 0xff];
} while (i_ < len && c2_ == -1);
if (c2_ == -1) {
break;
}

out_ += String.fromCharCode((c1_ << 2) | ((c2_ & 0x30) >> 4));

do {
c3_ = _str.charCodeAt(i_++) & 0xff;
if (c3_ == 61) {
return out_;
}
c3_ = this.b64DecodeChars_[c3_];
} while (i_ < len_ && c3_ == -1);
if (c3_ == -1) {
break;
}

out_ += String.fromCharCode(((c2_ & 0XF) << 4) | ((c3_ & 0x3C) >> 2));

do {
c4_ = _str.charCodeAt(i_++) & 0xff;
if (c4_ == 61) {
return out_;
}
c4_ = this.b64DecodeChars_[c4_];
} while (i_ < len_ && c4_ == -1);
if (c4_ == -1) {
break;
}
out_ += String.fromCharCode(((c3_ & 0x03) << 6) | c4_);
}
return out_;
},

utf16to8_ : function(_str) {
var out_, i_, len_, c_;

out_ = "";
len_ = _str.length;
for (i_ = 0; i_ < len_; i_++) {
c_ = _str.charCodeAt(i_);
if ((c_ >= 0x0001) && (c_ <= 0x007F)) {
out_ += _str.charAt(i_);
} else if (c_ > 0x07FF) {
out_ += String.fromCharCode(0xE0 | ((c_ >> 12) & 0x0F));
out_ += String.fromCharCode(0x80 | ((c_ >> 6) & 0x3F));
out_ += String.fromCharCode(0x80 | ((c_ >> 0) & 0x3F));
} else {
out_ += String.fromCharCode(0xC0 | ((c_ >> 6) & 0x1F));
out_ += String.fromCharCode(0x80 | ((c_ >> 0) & 0x3F));
}
}
return out_;
},

utf8to16_ : function(_str) {
var out_, i_, len_, c_;
var char2_, char3_;

out_ = "";
len_ = _str.length;
i_ = 0;
while (i_ < len_) {
c_ = _str.charCodeAt(i_++);
switch (c_ >> 4) {
case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
out_ += _str.charAt(i_ - 1);
break;
case 12:
case 13:
char2_ = _str.charCodeAt(i_++);
out_ += String.fromCharCode(((c_ & 0x1F) << 6) | (char2_ & 0x3F));
break;
case 14:
char2_ = _str.charCodeAt(i_++);
char3_ = _str.charCodeAt(i_++);
out_ += String.fromCharCode(((c_ & 0x0F) << 12) | ((char2_ & 0x3F) << 6) | ((char3_ & 0x3F) << 0));
break;
}
}

return out_;
},

charToHex_ : function(_str) {
var out_, i_, len_, c_, h_;

out_ = "";
len_ = _str.length;
i_ = 0;
while (i_ < len_) {
c_ = _str.charCodeAt(i_++);
h_ = c_.toString(16);
if (h_.length < 2) {
h_ = "0" + h_;
}

out_ += "\\x" + h_ + " ";
if (i_ > 0 && i_ % 8 == 0) {
out_ += "\r\n";
}
}

return out_;
}
};
window.JSON = window.JSON || {};
window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
window.RTCPeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
rc$.com.relayCore.utils.Utils = {
format : function(_fmt) {
var args_ = [];
for (var i = 1; i < arguments.length; i++) {
args_.push(arguments[i]);
}
return (_fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
return args_[i];
});
},

formatDate_ : function(_fmt, _value) {
if (!_fmt) {
_fmt = 'Y-m-d H:i:s';
}
if (!_value) {
return '-';
} else if (typeof (_value) == 'number') {
_value = new Date(_value);
}

return _fmt.replace(/Y/g, _value.getFullYear()).replace(/m/g, this.pad(_value.getMonth() + 1, 2)).replace(/d/g, this.pad(_value.getDate(), 2)).replace(
/H/g, this.pad(_value.getHours(), 2)).replace(/i/g, this.pad(_value.getMinutes(), 2)).replace(/s/g, this.pad(_value.getSeconds(), 2)).replace(
/U/g, this.pad(_value.getMilliseconds(), 3));
},

formatDuration_ : function(_value) {
var result_ = '';
if (_value > 3600) {
result_ += (Math.floor(_value / 3600) + ':');
}
if (_value > 60) {
result_ += (this.pad(Math.floor((_value % 3600) / 60), 2) + ':');
}
if (_value >= 0) {
result_ += this.pad(Math.floor(_value % 60), 2);
}
return result_;
},

size : function(_value) {
var step_ = 1024;
if (_value < step_) {
return _value.toFixed(0) + ' B';
} else if (_value < (step_ * step_)) {
return (_value / step_).toFixed(1) + ' KB';
} else if (_value < (step_ * step_ * step_)) {
return (_value / step_ / step_).toFixed(1) + ' MB';
} else if (_value < (step_ * step_ * step_ * step_)) {
return (_value / step_ / step_ / step_).toFixed(1) + ' GB';
}
},

speed : function(_value, _bps) {
_value = (_value || 0);
var step_ = 1024;
var suffix_ = 'B/s';
if (_bps) {
_value *= 8;
step_ = 1000;
suffix_ = 'bps';
}
if (_value < 1024) {
return _value.toFixed(0) + ' ' + suffix_;
} else if (_value < (step_ * step_)) {
return (_value / step_).toFixed(1) + ' K' + suffix_;
} else if (_value < (step_ * step_ * step_)) {
return (_value / step_ / step_).toFixed(1) + ' M' + suffix_;
} else if (_value < (step_ * step_ * step_ * step_)) {
return (_value / step_ / step_ / step_).toFixed(1) + ' G' + suffix_;
}
},

pad : function(_num, _size) {
var s_ = _num + "";
while (s_.length < _size) {
s_ = "0" + s_;
}
return s_;
},

trim : function(_value) {
var trimRegex_ = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
return (_value + '').replace(trimRegex_, "");
},

getUrlParams_ : function(_url) {
var params_ = {};
var paramString_ = _url.indexOf('?') >= 0 ? (_url.substr(_url.indexOf('?') + 1) || '') : _url;
var paramArray_ = paramString_.split('&');
for (var i = 0; i < paramArray_.length; i++) {
var itemArray_ = paramArray_[i].split('=');
var key_ = '';
var value_ = null;
if (itemArray_.length > 0) {
key_ = decodeURIComponent(itemArray_[0]);
}
if (itemArray_.length > 1) {
value_ = decodeURIComponent(itemArray_[1]);
}
params_[key_] = value;
}
return params_;
},

htmlEscape_ : function(_str) {
return String(_str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
};
rc$.com.relayCore.utils.Map = JClass.extend_({
elements_ : null,
length : 0,
init : function() {
this.elements_ = new Array();
this.length = 0;
},
size : function() {
return this.elements_.length;
},

isEmpty : function() {
return (this.elements_.length < 1);
},
empty : function() {
return (this.elements_.length < 1);
},
front : function() {
if (!this.isEmpty()) {
return this.elements_[0].value;
}
return null;
},
pop_front : function() {
if (!this.isEmpty()) {
this.elements_.splice(0, 1);
this.length--;
return true;
}
return false;
},
clear : function() {
this.elements_ = new Array();
this.length = 0;
},

set : function(_key, _value, _checkSame) {
if (typeof checkSame == 'undefined') {
_checkSame = true;
}
if (_checkSame) {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
this.elements_[i].value = _value;
return;
}
}
}

this.elements_.push({
key : _key,
value : _value
});
this.length++;
},

remove : function(_key) {
var bln_ = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
this.elements_.splice(i, 1);
this.length--;
return true;
}
}
} catch (e) {
bln_ = false;
}
return bln_;
},
erase : function(_key) {
var bln_ = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
this.elements_.splice(i, 1);
this.length--;
return true;
}
}
} catch (e) {
bln_ = false;
}
return bln_;
},
get : function(_key) {
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
return this.elements_[i].value;
}
}
return null;
} catch (e) {
return null;
}
},

element : function(_index) {
if (_index < 0 || _index >= this.elements_.length) {
return null;
}
return this.elements_[_index];
},

has : function(_key) {
var bln_ = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
bln_ = true;
}
}
} catch (e) {
bln_ = false;
}
return bln_;
},
find : function(_key) {
var bln_ = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
bln_ = true;
}
}
} catch (e) {
bln_ = false;
}
return bln_;
},
find2 : function(_key, _retValue) {
var bln_ = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
_retValue.value = this.elements_[i].value;
bln_ = true;
}
}
} catch (e) {
bln_ = false;
}
return bln_;
},

containsValue : function(_value) {
var bln_ = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].value == _value) {
bln_ = true;
}
}
} catch (e) {
bln_ = false;
}
return bln_;
},

values : function() {
var arr_ = new Array();
for ( var i = 0; i < this.elements_.length; i++) {
arr_.push(this.elements_[i].value);
}
return arr_;
},

keys : function() {
var arr_ = new Array();
for ( var i = 0; i < this.elements_.length; i++) {
arr_.push(this.elements_[i].key);
}
return arr_;
},
});

rc$.com.relayCore.utils.Number = {
max : function(_value1, _value2) {
return _value1 > _value2 ? _value1 : _value2;
},

min : function(_value1, _value2) {
return _value1 > _value2 ? _value2 : _value1;
},

maxUnsignedValue_ : function() {
return -1 >>> 0;
},

convertToBit_ : function(_size, _data, _array) {
var __uint8 = null;
switch (_size) {
case "1":
__uint8 = new Uint8Array(1);
__uint8[0] = parseInt(_data) & 0xff;
_array.push(__uint8);
break;
case "2":
__uint8 = new Uint8Array(2);
__uint8[0] = (parseInt(_data) >> 8) & 0xff;
__uint8[1] = parseInt(_data) & 0xff;
_array.push(__uint8);
break;
case "3":
__uint8 = new Uint8Array(3);
__uint8[0] = (parseInt(_data) >> 16) & 0xff;
__uint8[1] = (parseInt(_data) >> 8) & 0xff;
__uint8[2] = parseInt(_data) & 0xff;
_array.push(__uint8);
break;
case "4":
__uint8 = new Uint8Array(4);
__uint8[0] = (parseInt(_data) >> 24) & 0xff;
__uint8[1] = (parseInt(_data) >> 16) & 0xff;
__uint8[2] = (parseInt(_data) >> 8) & 0xff;
__uint8[3] = parseInt(_data) & 0xff;
_array.push(__uint8);
break;
case "8":
__uint8 = new Uint8Array(8);
var data1 = Math.floor(_data / 0x100000000);
__uint8[0] = (data1 >> 24) & 0xff;
__uint8[1] = (data1 >> 16) & 0xff;
__uint8[2] = (data1 >> 8) & 0xff;
__uint8[3] = (data1) & 0xff;
var data2 = Math.floor(_data % 0x100000000);
__uint8[4] = (data2 >> 24) & 0xff;
__uint8[5] = (data2 >> 16) & 0xff;
__uint8[6] = (data2 >> 8) & 0xff;
__uint8[7] = (data2) & 0xff;
_array.push(__uint8);
break;
case "utf":
__uint8 = new Uint8Array(_data.length);
for ( var i = 0; i < _data.length; i++) {
__uint8[i] = _data.charCodeAt(i);
}
_array.push(__uint8);
break;
case "d":
if (_data && _data.length > 0) {
_array.push(_data);
}
break;
}
},

convertToValue_ : function(_size, _byteArray, _position, _len) {
var value1_;
var value2_;
var value3_;
var value4_;
var value_ = null;
switch (_size) {
case "1":
value_ = _byteArray[_position];
break;
case "2":
value1_ = _byteArray[_position];
value2_ = _byteArray[_position + 1];
value_ = (value1_ << 8) + value2_;
break;
case "3":
value1_ = _byteArray[_position];
value2_ = _byteArray[_position + 1];
value3_ = _byteArray[_position + 2];
value_ = (value1_ << 16) + (value1_ << 8) + value2_;
case "4":
value1_ = _byteArray[_position];
value2_ = _byteArray[_position + 1];
value3_ = _byteArray[_position + 2];
value4_ = _byteArray[_position + 3];
value_ = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
break;
case "8":
value1_ = _byteArray[_position];
value2_ = _byteArray[_position + 1];
value3_ = _byteArray[_position + 2];
value4_ = _byteArray[_position + 3];

var high = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
value1_ = _byteArray[_position + 4];
value2_ = _byteArray[_position + 5];
value3_ = _byteArray[_position + 6];
value4_ = _byteArray[_position + 7];
var low_ = (value1_ * Math.pow(2, 24)) + (value2_ << 16) + (value3_ << 8) + value4_;
value_ = (high * 0x100000000) + low;
break;
case "utf":
var str_ = "";
for ( var i = 0; i < _len; i++) {
str_ += String.fromCharCode(_byteArray[_position + i]);
}
value_ = str_;
break;
case "d":
value_ = _byteArray.subarray(_position, _position + _len);
break;
}
return value_;
}
};

rc$.com.relayCore.utils.Url = JClass.extend_({
protocol_ : "",
host_ : "",
port_ : 0,
path_ : "",
file_ : "",
segment_ : "",
params_ : null,

init : function() {
this.protocol_ = "";
this.host_ = "";
this.port_ = 0;
this.path_ = "";
this.file_ = "";
this.segment_ = "";
this.params_ = new rc$.com.relayCore.utils.Map();
},

getParams : function() {
return this.params_;
},

fromString_ : function(_value) {
rc$.com.relayCore.utils.String.parseUrl_(_value, this, false);
},

toString : function() {
var isDefaultPort_ = (this.port_ == 0) || (this.protocol_ == "http" && this.port_ == 80) || (this.protocol_ == "https" && this.port_ == 443);
var protocolName_ = this.protocol_ == "" ? "http" : this.protocol_;

var value_;
if (isDefaultPort_) {
value_ = protocolName_ + "://" + this.host_ + this.file_;
} else {
value_ = protocolName_ + "://" + this.host_ + ":" + this.port_ + this.file_;
}

return value_ + this.toQueryString_();
},

toQueryString_ : function(_fromFirst) {
var value_ = "";
var isFirstKey_ = true;
if (typeof fromFirst == 'undefined') {
isFirstKey_ = true;
} else {
isFirstKey_ = _fromFirst;
}
if (!this.params_.empty()) {
for ( var i = 0; i < this.params_.elements_.length; i++) {
if (isFirstKey_) {
value_ += "?";
} else {
value_ += "&";
}
value_ += (rc$.com.relayCore.utils.String.urlEncodeNonAscii_(this.params_.elements_[i].key) + "=" + rc$.com.relayCore.utils.String
.urlEncodeNonAscii_(this.params_.elements_[i].value));
isFirstKey_ = false;
}
}

if (this.segment_ != "") {
value_ += "#";
value_ += this.segment_;
}
return value_;
}
});
rc$.com.relayCore.utils.HttpDownLoader = JClass.extend_({
url_ : null,
scope_ : null,
method_ : "GET",
config_ : null,
type_ : "text",
tag_ : "",
startTime_ : "",
endTime : "",
totalUsedTime_ : "",
transferedSpeed_ : 0,
transferedBytes_ : -1,
responseCode_ : 0,
responseLength_ : -1,
responseData_ : "",
successed_ : false,
resolvedTime_ : 0,
connectedTime_ : 0,
responsedTime_ : 0,
transferedTime_ : 0,
info_ : "",
http_ : null,
readyState_ : 0,
global_:null,

init:function()
{
this.responseLength_ = 0;
this.resolvedTime_ = 0;
this.connectedTime_ = 0;
this.responsedTime_ = 0;
this.transferedTime_ = 0;
this.transferedSpeed_ = 0;
this.transferedBytes_ = 0;
this.responseCode_ = 0;
this.info_ = "";
this.responseData_ = "";
this.remoteEndpoint_ = "";
this.postData_ = null;
this.http_ = null;
this.readyState_ = 0;
this.global_ = rc$.com.relayCore.utils.Global;
this.startTime_ = this.global_.getMilliTime_();
if(arguments.length>0&&typeof(arguments[0])=="object")
{
rc$.apply(this,arguments[0]);
}
},
setRequsetRange_ : function(_rangeStr) {
this.rangeStr_ = _rangeStr;
},
setPredefineHost_ : function(_predefine) {
var predefineIpAndPort_ = _predefine.split(":");
if (!predefineIpAndPort_) {
return;
}
var myurl_ = new rc$.com.relayCore.utils.Url();
myurl_.fromString_(this.url_);
if (predefineIpAndPort_.length > 2) {
return;
}
myurl_.host_ = predefineIpAndPort_[0];
if (predefineIpAndPort_.length == 1) {
myurl_.port_ = 0;
} else {
myurl_.port_ = predefineIpAndPort_[1];

}
this.url_ = myurl_.toString();
},
log_ : function(_result) {
if ("cdn::range-data" == this.tag_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Download {1}, Segment ({2}/{3}-{16}), url({4}), "
+ "response code({5}), data({6}/{7} Bytes), " + "resolved time({8} ms), " + "connected time({9} ms), " + "responsed time({10} ms), "
+ "total used time({11} ms), " + "transfered time({12} ms), " + "ready State({13}), " + "speed({14}), " + "bytes({15})", this.tag_,
(_result == "" ? (this.successed_ ? "OK" : "FAILED") : _result), this.info_ ? this.info_.segmentId_ : 0, this.info_ ? this.info_.startIndex_
: 0, this.url_, this.responseCode_, this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_,
this.connectedTime_, this.responsedTime_, this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_
.speed(this.transferedSpeed_, false), this.transferedBytes_, this.info_ ? this.info_.endIndex_ : 0));
} else {
P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Download {1}, url({2}), " + "response code({3}), data({4}/{5} Bytes), "
+ "resolved time({6} ms), " + "connected time({7} ms), " + "responsed time({8} ms), " + "total used time({9} ms), "
+ "transfered time({10} ms), " + "ready State({11}), " + "speed({12}), " + "bytes({13})", this.tag_,
(_result == "" ? (this.successed_ ? "OK" : "FAILED") : _result), this.url_, this.responseCode_,
this.successed_ ? this.responseData_.length : 0, this.responseLength_, this.resolvedTime_, this.connectedTime_, this.responsedTime_,
this.totalUsedTime_, this.transferedTime_, this.readyState_, this.global_.speed(this.transferedSpeed_, false),
this.transferedBytes_));
}
},
load_ : function() {

var xhr_ = this.http_ = this.createRequest_();
var scope_ = this;
xhr.onreadystatechange = function() {
if (this.readyState == 1) {
scope_.readyState_ = 1;
}
if (this.readyState == 2) {
scope_.readyState_ = 2;
}
if (this.readyState == 3) {
scope_.readyState_ = 3;
}
if (this.readyState == 4) {
scope_.readyState_ = 4;
scope_.endTime = scope_.global_.getMilliTime_();
scope_.responseCode_ = this.status;
scope_.responseData_ = this.response || '';

scope_.totalUsedTime_ = scope_.endTime - scope_.startTime_;

if (this.status >= 200 && this.status < 300) {
if (scope_.tag_ == "cdn::range-data") {
var uInt8Array = new Uint8Array(scope_.responseData_);
scope_.responseData_ = uInt8Array;
scope_.responseLength_ = uInt8Array.length;
scope_.transferedBytes_ = uInt8Array.length;
} else {
if ("json" == scope_.type_) {
var str_ = JSON.stringify(scope_.responseData_);
scope_.transferedBytes_ = scope_.responseLength_ = str_.length;
} else {
scope_.transferedBytes_ = scope_.responseLength_ = scope_.responseData_.length;
}
}
scope_.transferedSpeed_ = (scope_.transferedBytes_ * 1000 / scope_.totalUsedTime_);
scope_.transferedSpeed_ = Math.round(scope_.transferedSpeed_ * 100) / 100;
scope_.successed_ = true;

} else {
scope_.successed_ = false;
}
if (!scope_.isAbort_) {
scope_.onDownloadCompleted_();
}

}
};
xhr_.open(this.method_, this.url_);
if (this.rangeStr_) {
xhr_.setRequestHeader("Range", this.rangeStr_);
}
try {
xhr_.responseType = this.type_;
if (!this.postData_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("HttpDownloader [{0}] Start download {1}...", this.tag_, this.url_));
}
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("HttpDownloader [{0}] url({1})ERROR({2})", this.tag_, this.url_,e.toString()|""));
}
var myurl_ = new rc$.com.relayCore.utils.Url();
myurl_.fromString_(this.url_);
this.remoteEndpoint_ = myurl_.host_ + (myurl_.port_ == 0 ? "" : ":" + myurl_.port_);

try {
if (this.postData_) {
xhr_.send(this.postData_);
} else {
xhr_.send(null);
}

} catch (e) {
console.log(e);
}
},
createRequest_:function()
{
var objXMLHttpRequest_ = null;
if (window.ActiveXObject) { 
var activeXNameList = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP",
"Microsoft.XMLHTTP");
for ( var h = 0; h < activeXNameList.length; h++) {
try {
objXMLHttpRequest_ = new ActiveXObject(activeXNameList[h]);
} catch (e) {
continue;
}
if (objXMLHttpRequest_) {
break;
}
}
} else if (window.XMLHttpRequest) { 
objXMLHttpRequest_ = new XMLHttpRequest();
if (objXMLHttpRequest_.overrideMimeType) { 
objXMLHttpRequest_.overrideMimeType(this.type);
}
}
return objXMLHttpRequest_;
},
onDownloadData_ : function() {
if (typeof this.scope_.onHttpDownloadData_ != 'undefined' & this.scope_.onHttpDownloadData_ instanceof Function) {
this.scope_.onHttpDownloadData_(this);
}
},

stringToJson_ : function(_stringVal) {
eval("var theJsonVal = " + _stringVal);
return theJsonVal;
},

setInfo_ : function(_info) {
this.info_ = _info;
},

onDownloadCompleted_ : function() {
if (!this.postData_) {
}
if (typeof this.scope_.onHttpDownloadCompleted_ != 'undefined' & this.scope_.onHttpDownloadCompleted_ instanceof Function) {
this.scope_.onHttpDownloadCompleted_(this);
}

},

sendInfo : function(_value) {
var info_ = {};
info_.code = "Mobile.Info.Debug";
info_.info = _value;
},
close : function() {
if (this.http_) {
this.isAbort_ = true;
this.http_.abort();
}
}
});

rc$.com.relayCore.utils.LogPipDefault = JClass.extend_({
records_ : null,
uploadTimer_ : null,
logServer_ : null,
logDom_ : null,
maxRecordCount_ : 500,
nextLogId_ : 0,

init : function(_logServer) {
this.records_ = [];
this.uploadTimer_ = null;
this.logServer_ = _logServer;
this.nextLogId_ = 1;
this.logDom_ = document.getElementById("cde-log-container");
},

setUploadTimeout_ : function(_timeoutMs) {
var scope_ = this;
this.uploadTimer_ = setTimeout(function() {
scope_.onUploadTimeout_();
}, _timeoutMs);
},

onUploadTimeout_ : function() {
this.upload();
this.setUploadTimeout_(2000);
},

addRecord_ : function(_level, _name, _log) {

var logTime_ = rc$.com.relayCore.utils.Global.getCurentTime_();
var formatLog_ = "[" + logTime_ + " - " + _name + "]" + _log;

if (this.logServer_) {
$.post(this.logServer_, {
sessionid : "lmpn",
log : formatLog_
}, function(data, status) {
});
}

if (this.logDom_) {
try {
if (this.logDom_.value.length > 100000) {
this.logDom_.value = "";
}
if (this.logDom_.value) {
this.logDom_.value += "\r\n";
}
this.logDom_.value += formatLog_;
} catch (e) {
}
}

if (this.records_.length >= this.maxRecordCount_) {
this.records_.shift();
}
var localTime_ = new Date().getTime() * 1000;
this.records_.push({
level : _level,
id : this.nextLogId_++,
localTime : localTime_,
absTime : localTime_,
content : _log
});
},

upload : function() {
var params_ = "";
for ( var n = 0; n < this.records_.length; n++) {
params_ += this.records_[n] + "\r\n";
}
this.records_ = [];
this.downloader_ = new rc$.com.relayCore.utils.HttpDownLoader({url_:"http://127.0.0.1:8000/", scope_:this, method_:"POST", tag_:"upload::log",postData_:{
log : params_
}});
this.downloader_.load_();
},

onHttpDownloadCompleted_ : function(_downloader) {
var handled_ = false;
this.downloader_ = null;
if ("upload::log" == _downloader.tag_) {
if (!_downloader.successed_ || _downloader.responseCode_ < 200 || _downloader.responseCode_ >= 300) {
return handled_;
} else {

}
}
},

require : function(_lastId, _lastTime, _level, _filter, _limit, _maxLogTime, _order) {
if (typeof order == 'undefined') {
_order = false;
}
var result_ = {
records : [],
maxLogTime : _maxLogTime
};
for ( var i = 0; i < this.records_.length; i++) {
var item_ = this.records_[i];
if (item_.id <= _lastId || item_.absTime <= _lastTime) {
continue;
} else if ((item_.level & _level) == 0) {
continue;
} else if (_filter && item_.content.indexOf(_filter) < 0) {
continue;
}

result_.maxLogTime = Math.max(result_.maxLogTime, item_.absTime);
if (!_order) {
result_.records.unshift(item_);
} else {
result_.records.push(item_);
}

if (result_.records.length >= _limit) {
break;
}
}
return result;
}
});
rc$.ns("com.relayCore.broadcast");
rc$.com.relayCore.broadcast.Types = {
TypePeer:1,
TypeChannel:2,
TypeSSRC:3,
RemoteID:4
};
rc$.com.relayCore.broadcast.BroadCast = {
selectPeerId_:-1,
selectSSRCId_:-1,
peers_:null,
ssrcs_:null,
colors_:{
normal:"#eeeeee",
has:"#9A0316",
del:"#cccccc",
insert:"#67000D",
},
init_:function(_a)
{
var b_ = document.getElementById(_a);
if(b_)
{
var b1_ ="<form class=\"form-inline\">" +
"<div class=\"form-group\">" +
"<select type=\"select\" class=\"form-control\" id=\"serve-type\">" +
"<option>sourcing</option>" +
"<option>serving</option>" +
"</select>" +
"<input type=\"text\" class=\"form-control\" id=\"serving\" placeholder=\"输入SSRC\">" +
"<button type=\"button\" class=\"btn btn-info input-group-addon\" onclick=\"openServing()\">open</button>" +
"<button type=\"button\" class=\"btn btn-info\" onclick=\"stopServing()\">stop</button>" +
"</div>" +
"</form>";
var b2_ = "<form class=\"form-inline\">" +
"<div class=\"form-group\">" +
"<select type=\"select\" class=\"form-control\" id=\"message-type\">" +
"<option>80</option>" +
"<option>77</option>" +
"</select>" +
"<input type=\"text\" class=\"form-control\" id=\"ssrcId\" placeholder=\"SSRCID\">" +
"<input type=\"text\" class=\"form-control\" id=\"message\" placeholder=\"消息内容\">" +
"<button type=\"button\" class=\"btn btn-info\" onclick=\"sending()\">send</button>" +
"</div>" +
"</form>";
var b3_=
[
{id:"remoteId",content:"<h4>RelayCoreID：</h4>"}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"Peer节点列表："}]}]},tbody:{id:"peer"}}}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",content:"SSRC资源列表："}]}]},tbody:{id:"ssrc"}}}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{name:"title",id:"ssrcDetail",content:"资源加载情况"}]}]},tbody:{id:"ssrc_layer"}}}
,{name:"module-table",table:{name:"table table-bordered",thead:{tr:[{th:[{content:"操作"}]}]},tbody:{tr:[{td:[{content:b1_}]},{td:[{content:b2_}]}]}}}
];
for(var i=0;i<b3_.length;i++)
{
b_.appendChild(this.createModule_(b3_[i]));
}
}
},
createModule_:function(_a)
{
var b_ = document.createElement("div");
if(_a.hasOwnProperty("name"))
{
b_.className = _a.name;
}
if(_a.hasOwnProperty("id"))
{
b_.setAttribute("id",_a.id);
}
if(_a.hasOwnProperty("content"))
{
b_.innerHTML = _a.content;
}
if(_a.hasOwnProperty("table"))
{
var b1_,b2_,b3_,b4_,b5_,b6_;
b1_ = document.createElement("table");
if(_a.table.hasOwnProperty("name"))
{
b1_.className = _a.table.name;
}
b_.appendChild(b1_);
if(_a.table.hasOwnProperty("thead"))
{
b2_ = document.createElement("thead");
b1_.appendChild(b2_);
if(_a.table.thead.hasOwnProperty("name"))
{
b2_.className = _a.table.b2_.name;
}
if(_a.table.thead.hasOwnProperty("id"))
{
b2_.setAttribute("id",_a.table.b2_.id);
}
if(_a.table.thead.hasOwnProperty("tr"))
{
for(var i=0;i<_a.table.thead.tr.length;i++)
{
b3_ = document.createElement("tr");
b2_.appendChild(b3_);
if(_a.table.thead.tr[i].hasOwnProperty("th"))
{
for(var j=0;j<_a.table.thead.tr[i].th.length;j++)
{
b4_ = document.createElement("th");
b3_.appendChild(b4_);
if(_a.table.thead.tr[i].th[j].hasOwnProperty("name"))
{
b4_.className = _a.table.thead.tr[i].th[j].name;
}
if(_a.table.thead.tr[i].th[j].hasOwnProperty("id"))
{
b4_.setAttribute("id",_a.table.thead.tr[i].th[j].id);
}
if(_a.table.thead.tr[i].th[j].hasOwnProperty("content"))
{
b4_.innerHTML = _a.table.thead.tr[i].th[j].content;
}
}
}
}
}
}
if(_a.table.hasOwnProperty("tbody"))
{
b5_ = document.createElement("tbody");
b1_.appendChild(b5_);
if(_a.table.tbody.hasOwnProperty("name"))
{
b5_.className = _a.table.tbody.name;
}
if(_a.table.tbody.hasOwnProperty("id"))
{
b5_.setAttribute("id",_a.table.tbody.id);
}
if(_a.table.tbody.hasOwnProperty("tr"))
{
for(var i=0;i<_a.table.tbody.tr.length;i++)
{
b3_ = document.createElement("tr");
b5_.appendChild(b3_);
if(_a.table.tbody.tr[i].hasOwnProperty("td"))
{
for(var j=0;j<_a.table.tbody.tr[i].td.length;j++)
{
b6_ = document.createElement("td");
b3_.appendChild(b6_);
if(_a.table.tbody.tr[i].td[j].hasOwnProperty("name"))
{
b6_.className = _a.table.tbody.tr[i].td[j].name;
}
if(_a.table.tbody.tr[i].td[j].hasOwnProperty("id"))
{
b6_.setAttribute("id",_a.table.tbody.tr[i].td[j].id);
}
if(_a.table.tbody.tr[i].td[j].hasOwnProperty("content"))
{
b6_.innerHTML = _a.table.tbody.tr[i].td[j].content;
}
}
}
}
}

}
}
return b_;
},
broad_:function(_a)
{
var b_ = _a.type;
switch(b_)
{
case rc$.com.relayCore.broadcast.Types.TypePeer:
this.updatePeer_(_a.data);
break;
case rc$.com.relayCore.broadcast.Types.TypeChannel:
this.updataChannel_(_a.data);
break;
case rc$.com.relayCore.broadcast.Types.TypeSSRC:
this.updateSSRC_(_a.data);
break;
case rc$.com.relayCore.broadcast.Types.RemoteID:
var b1_ = document.getElementById("remoteId");
if(b1_){
b1_.innerHTML = "<h4>RelayCoreID："+_a.data+"</h4>";
}
break;
default:
break;
}
},
updatePeer_:function(_a)
{
if(!this.peers_)
{
this.peers_ = new rc$.com.relayCore.utils.Map();
}
var b_ = document.getElementById("peer");
if(!b_)
{
return;
}
var b1_,b2_;
switch(_a.type)
{
case "add":
b2_ = _a.peer;
b1_ = b2_.peerId_;
if(!this.peers_.find(b1_))
{
this.peers_.set(b1_,b2_);
tr_ = document.createElement("tr");
tr_.className = "peerItem";
tr_.setAttribute("id",b1_);
var b3_ = "<td><b_ onclick=\"rc$.com.relayCore.broadcast.BroadCast.showDes_('"+b1_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>"+(b2_.fromServer_?"【主动】":"【被动】")+b1_+"<span class=\"ng\">（"+b2_.channel_.ng_+"-"+b2_.channel_.negPacket_.ngId_+"）"+"</span></b_></td>";
tr_.innerHTML = b3_;
b_.appendChild(tr_);
}
break;
case "remove":
b1_ = _a.id;
if(this.peers_.find(b1_))
{
this.peers_.remove(b1_);
var b4_ = document.getElementById(b1_);
b_.removeChild(b4_);
}
break;
}
},
updateSSRC_:function(_a)
{
if(!this.ssrcs_)
{
this.ssrcs_ = new rc$.com.relayCore.utils.Map();
}
var b_ = document.getElementById("ssrc");
if(!b_)
{
return;
}
var b1_,b2_,b3_,b4_;
switch(_a.type)
{
case "add":
b2_ = _a.ssrc;
b1_ = b2_.id+":"+b2_.level;
if(!this.ssrcs_.find(b1_))
{
this.ssrcs_.set(b1_,b2_);
b4_ = document.createElement("tr");
b4_.className = "ssrcItem";
b4_.setAttribute("id",b1_);
b3_ = "<td><div onclick=\"rc$.com.relayCore.broadcast.BroadCast.showChannel_('"+b1_+"')\"><span class=\"glyphicon glyphicon-plus\"></span>【"+b2_.level+"】"+b2_.id+"</div></td>";
b4_.innerHTML = b3_;
b_.appendChild(b4_);
}
break;
case "remove":
b1_ = _a.id;
if(this.ssrcs_.find(b1_))
{
this.ssrcs_.remove(b1_);
var b5_ = document.getElementById(b1_);
b_.removeChild(b5_);
}
break;
}
},
showChannel_:function(_a)
{
var b_ = document.getElementById(_a);
if(b_)
{
var b1_,b2_,b3_,b4_,b5_,b6_,b7_,b8_,b9_,b10_,b11_,b12_,b13_,b14_,b15_,b16_,b17_,b18_,b19_,b20_,b21_,b22_;
if(this.selectSSRCId_!=-1)
{
b2_ = document.getElementById(this.selectSSRCId_);
if(b2_)
{
b1_ = b2_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
}
}
b1_ = b_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
if(this.selectSSRCId_==_a)
{
this.selectSSRCId_ = -1;
return;
}
this.selectSSRCId_=_a;
b3_ = this.ssrcs_.get(_a);
this.showDetail_();
b4_ = b3_.layers_;
if(!b4_)
{
return;
}
b5_ = b3_.ssrcChannel_.dataChannels_;

for(var i=0;i<b4_.length;i++)
{
b22_ = b4_.elements_[i].key;
b13_ = b4_.elements_[i].value;
b16_ = b13_.channelId_;
b18_ = b13_.syncChannels_;
b17_ = b13_.unsyncChannels_;
b14_ = b13_.cachePacket_.get(80);
b15_ = b13_.cachePacket_.get(77);
b6_ = document.createElement("table");
b6_.className="table table-condensed";
b1_.appendChild(b6_);
b7_ = document.createElement("thead");
b11_ = document.createElement("tr");
b9_ = document.createElement("th");
b9_.innerHTML = "<span class=\"layer\">层："+b22_+"</span>";
b11_.appendChild(b9_);
b7_.appendChild(b11_);
b6_.appendChild(b7_);
b8_ = document.createElement("tbody");
b6_.appendChild(b8_);

if(b18_.length>0)
{
b11_ = document.createElement("tr");
b11_.className = "danger";
b12_ = document.createElement("td");
b12_.innerHTML = "已同步：";
b11_.appendChild(b12_);
b8_.appendChild(b11_);

for(var j=0;j<b18_.length;j++)
{
b20_ = b18_[j];
b10_="";
if(!b5_.find(b20_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",b20_));
continue;
}
b19_ = b5_.get(b20_);
b21_ = String.fromCharCode(b19_.syncStatus_);
if(b19_.label_.indexOf("@VIR")==-1)
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>]"+(b16_==b20_?"【主】":"【副】")+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
else
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>]"+(b16_==b20_?"【主】":"【副】")+"[虚]"+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
b11_ = document.createElement("tr");
b11_.className = "info";
b12_ = document.createElement("td");
b12_.innerHTML = b10_;
b11_.appendChild(b12_);
b8_.appendChild(b11_);
}
}
if(b17_.length>0)
{
b11_ = document.createElement("tr");
b11_.className = "danger";
b12_ = document.createElement("td");
b12_.innerHTML = "需同步：";
b11_.appendChild(b12_);
b8_.appendChild(b11_);
for(var j=0;j<b17_.length;j++)
{
b20_ = b17_[j];
b10_="";
if(!b5_.find(b20_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("com::relayCore::broadcast::BroadCast id({1})不存在了",b20_));
continue;
}
b19_ = b5_.get(b20_);
b21_ = String.fromCharCode(b19_.syncStatus_);
if(b19_.label_.indexOf("@VIR")==-1)
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>]"+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
else
{
b10_="<span>[<span class=\"status-"+b21_+"\" id="+b20_+"-status>"+b21_+"</span>][虚]"+b19_.label_+"::"+b20_+"</span><span id="+b20_+"-message></span>";
}
b11_ = document.createElement("tr");
b11_.className = "warning";
b12_ = document.createElement("td");
b12_.innerHTML = b10_;
b11_.appendChild(b12_);
b8_.appendChild(b11_);
}
}
}
}
},
showDes_:function(_a)
{
var b_ = document.getElementById(_a);
if(b_)
{
var b1_,b2_,b3_,b4_,b5_,b6_,b7_,b8_,b9_,b10_,b11_,b12_;
if(this.selectPeerId_!=-1)
{
b3_ = document.getElementById(this.selectPeerId_);
if(b3_)
{
b1_ = b3_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
}
}
b1_ = b_.firstChild;
while(b1_.childNodes.length>1)
{
b1_.removeChild(b1_.childNodes[b1_.childNodes.length-1]);
}
if(this.selectPeerId_==_a)
{
this.selectPeerId_=-1;
return;
}
this.selectPeerId_=_a;
b2_ = this.peers_.get(_a);
b4_ = b2_.fromServer_?0:1;
b11_ = b2_.channel_.negPacket_.unsynced_;
b12_ = b2_.channel_.negPacket_.synced_;
b8_ = document.createElement("table");
b8_.className="table table-condensed";
b1_.appendChild(b8_);
b6_ = document.createElement("tbody");
b8_.appendChild(b6_);
if(b12_.length>0)
{
b9_ = document.createElement("tr");
b9_.className = "danger";
b10_ = document.createElement("td");
b10_.innerHTML = "同步：";
b9_.appendChild(b10_);
b6_.appendChild(b9_);
for(i=0;i<b12_.length;i++)
{
b5_=(b4_+b12_[i].mappedId)%2;
b7_="<span>【"+(b5_==0?"已同步":"需同步")+"】"+b12_[i].id+":"+b12_[i].mappedId+":"+b12_[i].spc+"</span>";
b9_ = document.createElement("tr");
b9_.className = "info";
b10_ = document.createElement("td");
b10_.innerHTML = b7_;
b9_.appendChild(b10_);
b6_.appendChild(b9_);
}
}
if(b11_.length>0)
{
b9_ = document.createElement("tr");
b9_.className =  "danger";
b10_ = document.createElement("td");
b10_.innerHTML = "未同步：";
b9_.appendChild(b10_);
b6_.appendChild(b9_);
for(i=0;i<b11_.length;i++)
{
b5_=(b4_+b11_[i].mappedId)%2;
var b7_="<span>【"+(b5_==0?"已同步":"需同步")+"】"+b11_[i].id+":"+b11_[i].mappedId+":"+b11_[i].spc+"</span>";
b9_ = document.createElement("tr");
b9_.className = "warning";
b10_ = document.createElement("td");
b10_.innerHTML = b7_;
b9_.appendChild(b10_);
b6_.appendChild(b9_);
}
}
}
},
showDetail_:function()
{
var container_ = document.getElementById("ssrc_layer");
var sid_ = container_.getAttribute("sid");
if(sid_ == this.selectSSRCId_)
{
return;
}
var title_ = document.getElementById("ssrcDetail");
if(title_)
{
title_.innerHTML="资源："+this.selectSSRCId_;
}
container_.setAttribute("sid",this.selectSSRCId_);
while(container_.childNodes.length>0)
{
container_.removeChild(container_.firstChild);
}
var ssrc_ = this.ssrcs_.get(this.selectSSRCId_);
var layers_ = ssrc_.layers_;
var item_,table_,thead_,tbody_,th_,tr_,td_,layer_,key_,p_,m_,span_,br_,color_;
tr_ = document.createElement("tr");
td_ = document.createElement("td");
tr_.appendChild(td_);
container_.appendChild(tr_);
item_ = td_;

for(var i=0;i<layers_.length;i++)
{
key_ = layers_.elements_[i].key;
layer_ = layers_.elements_[i].value;
p_ = layer_.cachePacket_.get(80);
m_ = layer_.cachePacket_.get(77);
u_ = layer_.cachePacket_.get(85);
n_ = layer_.cachePacket_.get(78);
t_ = layer_.cachePacket_.get(84);
q_ = layer_.cachePacket_.get(81);
table_ = document.createElement("table");
table_.className="table table-condensed";
item_.appendChild(table_);
thead_ = document.createElement("thead");
tr_ = document.createElement("tr");
th_ = document.createElement("th");
th_.innerHTML = "<span class=\"layer\">层："+key_+"</span>";
tr_.appendChild(th_);
thead_.appendChild(tr_);
table_.appendChild(thead_);
tbody_ = document.createElement("tbody");
table_.appendChild(tbody_);
tr_ = document.createElement("tr");
tbody_.appendChild(tr_);
td_ = document.createElement("td");
td_.innerHTML="<span id=\""+this.selectSSRCId_+":"+key_+"\"><span>P["+(p_?p_.successTotal_:0)+"/"+(p_?p_.total_:0)+"]</span><span>N["+(n_?n_.total_:0)+"]</span><span>Q["+(q_?q_.total_:0)+"]</span><span>L["+layer_.loss_+"]</span><span>T["+(t_?t_.total_:0)+"]</span></span>";
tr_.appendChild(td_);
if(key_==0)
{
td_.innerHTML="<span id=\""+this.selectSSRCId_+":"+key_+"\"><span>M["+(m_?m_.successTotal_:0)+"/"+(m_?m_.successTotal_:0)+"]</span><span>U["+(u_?u_.total_:0)+"]</span><span>Q["+(q_?q_.total_:0)+"]</span><span>L["+layer_.loss_+"]</span></span>";
continue;
}
tr_ = document.createElement("tr");
tbody_.appendChild(tr_);
td_ = document.createElement("td");
tr_.appendChild(td_);
for(var j=0;j<256;j++)
{
span_ = document.createElement("span");
span_.className="p-units";
span_.setAttribute("id",this.selectSSRCId_+":"+key_+":p:"+j);
span_.setAttribute("title",j);
color_ = this.colors_.normal;
if(p_&&p_.data&&p_.data.get(j))
{
color_ = this.colors_.has;
}
span_.style.backgroundColor=color_;
td_.appendChild(span_);
}
}
},

updataChannel_:function(_a)
{
if(!this.ssrcs_)
{
return;
}
if(this.selectSSRCId_ == _a)
{
this.selectSSRCId_ = -1;
this.showChannel_(_a);
}
},
channelMessage_:function(_a,_a1,_a2)
{
var b_;

switch(_a1)
{
case "neg":
b_ = document.getElementById(_a);
if(b_)
{
b_.firstChild.firstChild.childNodes[2].innerHTML = "（"+_a2.ng+"-"+_a2.ngseq+"）";
}
if(_a==this.selectPeerId_)
{
this.selectPeerId_ = -1;
this.showDes_(_a);
}
break;
case "syncStatus":
b_ = document.getElementById(_a+"-status");
if(b_)
{
b_.className = "status-"+String.fromCharCode(_a2);
b_.innerHTML = String.fromCharCode(_a2);
}
break;
case "send":
if(_a2==75||_a2==107)
{
break;
}
b_ = document.getElementById(_a+"-message");
if(b_)
{
console.log(_a2,String.fromCharCode(_a2));
b_.innerHTML = "【发送"+(_a2==0?"协商":String.fromCharCode(_a2))+"】";
}
break;
case "receive":
if(_a2==75||_a2==107)
{
break;
}
b_ = document.getElementById(_a+"-message");
if(b_)
{
b_.innerHTML = "【接受"+(_a2==0?"协商":String.fromCharCode(_a2))+"】";
}
break;
case "layer-message":
b_ = document.getElementById(_a);
if(b_)
{
if(_a2.type==80)
{
b_.firstChild.innerHTML="P["+_a2.success+"/"+_a2.total+"]";
}
else if(_a2.type==77)
{
b_.firstChild.innerHTML="M["+_a2.success+"/"+_a2.total+"]";
}
else if(_a2.type==85)
{
b_.childNodes[1].innerHTML="U["+_a2.total+"]";
}
else if(_a2.type==81)
{
b_.childNodes[2].innerHTML="Q["+_a2.total+"]";
}
else if(_a2.type==78)
{
b_.childNodes[1].innerHTML="N["+_a2.total+"]";
}
else if(_a2.type==84)
{
if(b_.childNodes.length>4)
{
b_.childNodes[4].innerHTML="T["+_a2.total+"]";
}
}
}
break;
case "loss":
b_ = document.getElementById(_a);
if(b_)
{
b_.childNodes[3].innerHTML="T["+_a2.total+"]";
}
break;
case "P":
var b1_ = _a+":p:"+_a2.num;
b_ = document.getElementById(b1_);
if(b_)
{
var b2_ = this.colors_.normal;
switch(_a2.type)
{
case "add":
b2_ = this.colors_.has;
break;
case "remove":
b2_ = this.colors_.del;
break;
case "insert":
b2_ = this.colors_.insert;
break;
}
b_.style.backgroundColor = b2_;
}
break;
}
},
};
rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.Manager = JClass.extend_({
opened_ : false,
id_:null,
totalConut_:0,
maxActiveSession_:10,
beginRegisterTime_:0,
connectedTime_:0,
peerMaxConnectingTime_:100*1000,
activeSessionCount_:0,
controller_:null,
peers_ : null,
global_:null,
strings_:null,
config_:null,
broadcast_:null,

tag_:"com::relayCore::webrtc::Manager",

init : function(_controller) {
this.peers_ = new rc$.com.relayCore.utils.Map();
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.config_ = rc$.com.relayCore.vo.Config;
this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
this.controller_ = _controller;
},

open : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open 打开webrtp管理", this.tag_));
this.opened_ = true;
this.activeTime_ = this.global_.getMilliTime_();
return true;
},
addPeer:function(_a)
{
var b_ = this.peers_.find(_a.remoteId);
if(!b_)
{
if (this.peers_.size() >= this.maxActiveSession_ * 2) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Peer is max, cancle",this.tag_));
return;
}
var b1_ = new rc$.com.relayCore.webrtc.Peer(this,_a);
this.peers_.set(_a.remoteId, b1_);
this.broad_({type:"add",peer:b1_});
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addPeer, id({1})from({2})remote({3})size({4})",this.tag_,_a.id,_a.from,_a.remoteId,this.peers_.size()));
}
},
removePeerById_:function(_a)
{
if(this.peers_.find(_a))
{
this.controller_.OnPeerClose_(_a);
this.peers_.get(_a).clear();
this.peers_.remove(_a);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removePeerById close Peer({1}),peers({2})",this.tag_, _a,this.peers_.length));
this.broad_({type:"remove",id:_a});
}
},
getPeerById_:function(_a)
{
return this.peers_.get(_a);
},
getSSRCManager_:function()
{
return this.controller_.ssManager_;
},
broad_:function(_a)
{
if(this.broadcast_)
{
this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypePeer,data:_a});
}
},
close_:function()
{
var el_;
for(var i=0;i<this.peers_.length;i++)
{
el_ = this.peers_.elements_[i].value;
el_.close();
}
this.peers_.clear();
}
});
rc$.com.relayCore.webrtc.PeerStatic = {
kTimerTypeOnInit : 1
};
rc$.com.relayCore.webrtc.Peer = JClass.extend_({
config_:null,
global_:null,
strings_:null,
channel_:null,
peer_ : null,
peerId_:null,
remoteId_ : 0,
fromServer_ : false,
manager_ : null,
id_ : "",
tag_:"com::relayCore::webrtc::Peer",


init:function(_a,_a1)
{
this.config_ = rc$.com.relayCore.vo.Config;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.channel_ = new rc$.com.relayCore.webrtc.Channel(this);
this.manager_ = _a;
this.id_ = _a1.id;
this.fromServer_ = _a1.from;
this.remoteId_ = _a1.remoteId;
this.peer_ = _a1.peer;
this.setPeerEvents_(this.peer_);
this.peerId_ = this.remoteId_;
if(this.fromServer_)
{
this.channel_.createChannel_({"name":"peerChannel","id":0});
}
},
setPeerEvents_ : function(_peer) {
var scope_ = this;
_peer.ondatachannel = function(evt) {
scope_.onPeerDataChannel_(evt);
};
},
onPeerDisconnet_:function()
{
this.manager_.removePeerById_(this.peerId_);
},
onPeerDataChannel_: function( _evt )
{
var channel_ = _evt.channel;
var isReject_ = false;
if(channel_.id!=0)
{
var sid_ = channel_.label.split(":")[1];
var myssrcs_ = this.manager_.getSSRCManager_().ssrcs_;
var ssrcId_ = this.strings_.format("{0}:{1}",sid_,"relay");
if(myssrcs_.find(ssrcId_))
{
if(myssrcs_.get(ssrcId_).getMainChannelPeer_()==this.peerId_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onPeerDataChannel 接收到Peer({1})存在(relay)主channel({2}),拒绝！",this.tag_, myssrcs_.get(ssrcId_).getMainChannelPeer_(),channel_.label));
isReject_=true;
}
}
else
{
ssrcId_ = this.strings_.format("{0}:{1}",sid_,"serving");
if(myssrcs_.find(ssrcId_))
{
if(myssrcs_.get(ssrcId_).getMainChannelPeer_()==this.peerId_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onPeerDataChannel 接收到Peer({1})存在(serving)主channel({2}),拒绝！",this.tag_, myssrcs_.get(ssrcId_).getMainChannelPeer_(),channel_.label));
isReject_=true;
}
}
}
}
if(isReject_||(channel_.id>0&&channel_.label.indexOf("@SYNC")==-1))
{
channel_.close();
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerDataChannel ({1}) Receive PeerDataChannel,channel name({2}),id({3})",this.tag_, this.remoteId_,channel_.label,channel_.id));
this.channel_.createChannel_({"channel":channel_});
},
setTimeout_ : function(_tag, _timer, _milliSeconds) {
var scope_ = this;
_timer = setTimeout(function() {
scope_.onTimeout_(_tag, _timer);
}, _milliSeconds);
return _timer;
},
onTimeout_ : function(_tag, _timer, _errorCode) {
switch (_tag) {
case rc$.com.relayCore.webrtc.PeerStatic.kTimerTypeOnInit:
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::初始化信息交换超时，放弃通信", this.tag_));
this.initTimer_ = null;
this.closeChannel_(0);
break;
default:
break;
}
},
disconnect : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::disconnect ({1}) disconnect... ", this.tag_,this.peerId_));
this.channel_.close();
if (this.peer_) {
this.peer_.close();
this.peer_ = null;
}
this.connecting_ = false;
},
updateSSRC_:function()
{

},
clear:function()
{
this.config_=null;
this.global_=null;
this.strings_=null;
if(this.channel_)
{
this.channel_.close_();
this.channel_=null;
}
this.peer_=null;
this.peerId_=null;
this.remoteId_=0;
this.fromServer_=false;
this.manager_=null;
this.id_ = "";
this.tag_="";
}
});
rc$.com.relayCore.webrtc.PeerSSRCStatus = {
UNKNOWN:0,
KNOWN:1,
UNSYNC:2
};
rc$.com.relayCore.webrtc.Channel = JClass.extend_({
dataChannels_ : null,
timestamp_:-1,
context_:null,
packet_:null,
negPacket_:null,
bytesPacket_:null,
isHasNewNg_:false,
ngStatus_:false,
ng_:0,
lastPacket_:null,
initTimerOutId_:-1,
initTimerOutInterval_:30*1000,
ssrcTimerOutId_:-1,
ssrcTimerOutInterval_:30*1000,
remoteSSRCStatus_:0,
remoteOwned_:null,
uRTT_:0,
uJitter_:0,
uPackLossRate_:0,
uSPC_:null,
owned_:null,
global_:null,
strings_:null,
mappedIds_:null,
tag_:"com::relayCore::webrtc::Channel",

init:function(_a)
{
this.context_ = _a;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.dataChannels_ = new rc$.com.relayCore.utils.Map();
this.mappedIds_ = new rc$.com.relayCore.utils.Map();
this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
this.packet_ = new rc$.com.relayCore.webrtc.PacketProcess(this);
this.negPacket_ = new rc$.com.relayCore.webrtc.packets.NegPacket(this);
this.remoteOwned_ = null;
this.owned_ = [];
},
createChannel_:function(_a)
{
var b_;
if(_a.channel)
{
b_ = _a.channel;
}
else
{
var b1_ = {"ordered":false};
b1_.id = _a.id;
try{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createChannel peerId({1})!",this.tag_,this.context_.peerId_));
b_ = this.context_.peer_.createDataChannel(_a.name,b1_);
}
catch(e)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::createChannel peerId({1})params({2})! error({3})",this.tag_,this.context_.peerId_,JSON.stringify(b1_),e.toString()));
}
}
if(!b_)
{
return null;
}
var b2_ = new rc$.com.relayCore.webrtc.MetaChannel(this,b_,_a);
this.dataChannels_.set(b_.id,b2_);
this.setChannelEvents_(b_);
return b_;
},
setChannelEvents_ : function(_channel) {
var scope_ = this;
_channel.onopen = function(evt) {
scope_.onChannelOpen_(evt);
};
_channel.onmessage = function(evt) {
scope_.onChannelMessage_(evt);
};
_channel.onerror = function(evt) {
scope_.onChannelError_(evt);
};
_channel.onclose = function(evt) {
scope_.onChannelClose_(evt);
};
},
onChannelOpen_: function(_evt)
{
var channel_ = _evt.target;
this.context_.connecting_ = true;
var cid_ = channel_.id;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onChannelOpen peerId({1}) Channel({2}) open success!!!!!!!!!!!!!!", this.tag_,this.context_.peerId_,cid_));
var metaChannel_ = this.dataChannels_.get(cid_);
if(metaChannel_ == null)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onChannelOpen id({1}) metaChannel 不存在", this.tag_,cid_));
return;
}
metaChannel_.startPing_();
if(cid_ == 0)
{
this.sendNeg_();
var callback_ = this.initTimeOut_.bind(this);
this.initTimerOutId_ = setTimeout(callback_, this.initTimerOutInterval_);
return;
}
this.context_.manager_.controller_.ssManager_.addChannel_(metaChannel_);
},

onSSRCUpdate_:function()
{
var myowned_ = this.getOwned_();
if(this.strings_.compareTo_(JSON.stringify(myowned_),JSON.stringify(this.owned_))!=0)
{
if(this.ngStatus_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg 上一个协商还未完成，等待...", this.tag_,this.context_.peerId_));
this.isHasNewNg_ = true;
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCUpdate peerId({1})资源发生变化！", this.tag_,this.context_.peerId_));
this.sendNeg_(true);
}
},
sendNeg_:function(_a)
{
if(_a)
{
this.negPacket_.status_ = 0;
if(this.negPacket_.ngId_>0)
{
this.negPacket_.ngId_ = this.ng_+1;
}
this.isHasNewNg_ = false;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg peerId({1}) 重新协商！", this.tag_,this.context_.peerId_));
}
this.ngStatus_ = true;
var b_ = this.dataChannels_.get(0);
if(!b_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg peerId({1}) 节点已经断连！", this.tag_,this.context_.peerId_));
return;
}
this.lastPacket_ = this.negPacket_.getPacket_();
this.sendMessage_(this.lastPacket_,b_);
},
onChannelMessage_: function(_evt)
{
var channel_ = _evt.target;
var data_ = _evt.data;
var cid_ = channel_.id;
var metaChannel_ = this.dataChannels_.get(cid_);
if(metaChannel_ == null)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onChannelMessage id({1}) metaChannel 不存在", this.tag_,cid_));
return;
}
var dataType_ = typeof(data_);
if(dataType_ == "string")
{
if(cid_ == 0)
{
metaChannel_.broad_("receive",0);
this.ngStatus_ = true;
if(this.initTimerOutId_ > 0)
{
clearTimeout(this.initTimerOutId_);
this.initTimerOutId_ = -1;
}
var message_ = {type:"negotiation",data:data_};
this.packet_.process_(message_);
return;
}
}
else
{
var stype_ = rc$.com.relayCore.utils.Number.convertToValue_('1',new Uint8Array(data_),0);
metaChannel_.broad_("receive",stype_);
switch(stype_)
{
case 75:
metaChannel_.send_({type:"byte",data:{type:107}});
break;
default:
metaChannel_.respond_();
this.context_.manager_.getSSRCManager_().receiveMessage_({type:stype_,channel:metaChannel_,data:new Uint8Array(data_)});
break;
}
}
},
onChannelError_ : function(_evt) {
this.removeChannel_(_evt.target);
},

onChannelClose_ : function(_evt) {
},
removeChannel_:function(_a)
{
var b_=_a.id;
if(this.dataChannels_.find(b_)){
var b1_ = this.dataChannels_.get(b_);
this.dataChannels_.remove(b_);
if(b1_.label_.indexOf("@SYNC")>-1)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel_ peer({1})删除资源频道({2})", this.tag_,this.context_.peerId_,b1_.label_));
this.context_.manager_.controller_.ssManager_.removeChannel_(b1_);
}
b1_.clear_();
if(this.dataChannels_.length == 0)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel_ peer({1})所有dataChannel关闭！该peer断连)", this.tag_,this.context_.peerId_));
this.context_.onPeerDisconnet_();
}
}
},
initTimeOut_:function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::initTimeOut peer({1})初始化交换信息超时", this.tag_,this.context_.remoteId_));
},
closeChannelById_ : function(_id) {
if(_id != null && this.dataChannels_.find(_id))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::closeChannel channelId({1})", this.tag_,_id));
var metaChannel_ = this.dataChannels_.get(_id);
metaChannel_.close_();
}
},
close_:function()
{
var el_;
for(var i=0;i<this.dataChannels_.length;i++)
{
el_ = this.dataChannels_.element(i);
el_.value.close_();
}
this.dataChannels_.clear();
if(this.ssrcTimerOutId_>0)
{
clearInterval(this.ssrcTimerOutId_);
this.ssrcTimerOutId_ = -1;
}
},
sendMessage_:function(_a,_a1)
{
if(_a1 == null)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::sendMessage metaChannel 不存在", this.tag_));
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendMessage peerId({1}),NG({2})", this.tag_,_a1.peerId_,_a.Negotiate));
try {
_a1.send_({type:"json",data:_a});
} catch (e) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendMessage_ failed, {1}",this.tag_, e.toString()));
}
},
getOwned_:function()
{
var myssrcs_ = this.context_.manager_.getSSRCManager_().ssrcs_;
if(myssrcs_.length == 0)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getOwned, 当前还不存在任何媒体流",this.tag_));
return [];
}
var owned_ = [];
var ssrc_;
var startMappedId_ = this.context_.fromServer_ ?1:2;
var spc_,myroute_,routes_=[],rIndex_,index_=-1,ttl_,reject_,peerId_;
for(var i=0;i<myssrcs_.length;i++)
{
rIndex_ = -1;
ttl_ = -1;
ssrc_ = myssrcs_.elements_[i].value;
peerId_ = ssrc_.getMainChannelPeer_();
spc_ = -1;
switch(ssrc_.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
spc_ = ssrc_.spc;
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
spc_ = ssrc_.getSPC_(this.context_.peerId_);
break;
}
if(spc_!=-1)
{
myroute_ = ssrc_.getRoute_();
if(myroute_)
{
routes_.push(myroute_.route);
index_++;
rIndex_ = index_;
ttl_ = myroute_.ttl;
}
if(this.mappedIds_.find(ssrc_.id))
{
mappedId_=this.mappedIds_.get(ssrc_.id);
}
else
{
mappedId_=this.mappedIds_.length*2+startMappedId_;
this.mappedIds_.set(ssrc_.id,mappedId_);
}
var params = {
id:ssrc_.id,
channel:ssrc_.channel,
mappedId:mappedId_,
spc:spc_,
layer:ssrc_.layer,
routeIndex:rIndex_,
routeTTL:ttl_,
peerId:peerId_
};
if(!this.hasOwned_(owned_,params))
{
owned_.push(params);
}
}
}
this.negPacket_.sortSSRC_(owned_);
this.routes_ = routes_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getOwned, 当前存在媒体流个数({1})",this.tag_,owned_.length));
return owned_;
},
hasOwned_:function(_a,_a1)
{
var b_=false;
var b1_;
for(var i=0;i<_a.length;i++)
{
if(_a[i].id == _a1.id)
{
b_ = true;
break;
}
}
return b_;
},
getWanted_:function()
{
return [];
},

onNegOver_:function()
{
if(this.isHasNewNg_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1})有一个新的协商继续...", this.tag_,this.context_.peerId_));
this.sendNeg_(true);
return false;
}
this.broad_("neg",{"ng":this.ng_,"ngseq":this.negPacket_.ngId_});
this.syncSSRC_();
if(this.ssrcTimerOutId_>0)
{
clearTimeout(this.ssrcTimerOutId_);
}
var callback_=this.checkSSRCStatus_.bind(this);
this.ssrcTimerOutId_ = setTimeout(callback_,this.ssrcTimerOutInterval_);
},
checkSSRCStatus_:function()
{
var unsynced_ = [];
var ssrc_,id_;
var syncing_ = this.getSyncStatus_();
for(var i=0;i<this.negPacket_.synced_.length;i++)
{
ssrc_ = this.negPacket_.synced_[i];
id_ = this.strings_.format("{0}:{1}",ssrc_.id,ssrc_.mappedId);
if(!syncing_.find(id_))
{
if(this.addToUnSync_(ssrc_))
{
unsynced_.push(ssrc_);
}
}
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkSSRCStatus, peerId({1})协商列表中有({2})个未进行同步的.",this.tag_,this.context_.peerId_,unsynced_.length));
if(unsynced_.length>0)
{
var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
for(var i=0;i<unsynced_.length;i++)
{
var layerArr_ = unsynced_[i].layer?unsynced_[i].layer:[0];
for(var j=0;j<layerArr_.length;j++)
{
id_ = layerArr_[j]*(1024/maxLayer_)+ssrc_.mappedId_;
if(this.dataChannels_.find(id_))
{
this.closeChannelById_(id_);
}
}
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkSSRCStatus, peerId({1})协商列表中有未进行同步的SSRC({2}).",this.tag_,this.context_.peerId_,JSON.stringify(unsynced_)));
this.negPacket_.ngId_++;
this.sendNeg_();
}
},
addToUnSync_:function(_a)
{
var b_ = this.strings_.format("{0}:{1}",_a.id,_a.mappedId);
var b1_ = this.negPacket_.getSync_(this.negPacket_.unsynced_,[_a],false);
if(b1_.length>0)
{
this.negPacket_.addunSync_(b1_);
return true;
}
return false;
},
getSYNC_:function(_a)
{
var b_ = this.negPacket_.synced_;
for(var i=0;i<b_.length;i++)
{
if(b_[i].id == _a)
{
return b_[i];
}
}
return null;
},
syncSSRC_:function(_a)
{
var b_,b1_,b2_,b3_,b4_,b5_,b6_,b7_,b8_;
var b9_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
var b10_ = this.negPacket_.synced_;
var b11_ = this.context_.fromServer_?0:1;
var b12_ =this.context_.manager_.getSSRCManager_().ssrcs_;
var b13_ = this.getSyncStatus_();
var b14_,b15_;
for(var i=0;i<b10_.length;i++)
{
if(_a&&b10_[i].id != _a.id)
{
continue;
}
b3_ = b10_[i].mappedId;
b2_ = (b11_+b3_)%2;
if(b2_==1)
{
continue;
}
b1_ = this.strings_.format("{0}:{1}",b10_[i].id,"sourcing");
if(b12_.find(b1_))
{
b_ = b12_.get(b1_);
if(b_.spcs_.values().indexOf(b10_[i].spc)>-1)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncSSRC, SSRC({1})存在Sourcing级别的服务。不同步",this.tag_,JSON.stringify(b10_[i])));
continue;
}
}
b7_ = this.strings_.format("{0}:{1}",b10_[i].id,b3_);
if(b13_.find(b7_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncSSRC, peerId({1})SSRC({2})已经在同步中..",this.tag_,this.context_.peerId_,JSON.stringify(b10_[i])));
continue;
}

if(this.remoteOwned_)
{
for(var j=0;j<this.remoteOwned_.length;j++)
{
if(this.remoteOwned_[j].id==b10_[i].id&&this.remoteOwned_[j].mappedId==b10_[i].mappedId)
{
b15_ = this.remoteOwned_[j].peerId;
}
}
}
if(b15_==this.context_.id_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSync 拉流的Peer的主Channel为自己，不需要同步该SSRC({1})", this.tag_,JSON.stringify(b10_[i])));
continue;
}

layerArr_ = [];
if(typeof(b10_[i].layer)=="number")
{
for(var j=0;j<b10_[i].layer;j++)
{
layerArr_.push(j);
}
}
else
{
layerArr_ = b10_[i].layer;
}
b4_ = "@SYNC"+this.strings_.getRandom_();
b4_ += ":"+b10_[i].id;
var b16_ = b4_;
for(var j=0;j<layerArr_.length;j++)
{
b5_ = layerArr_[j]*(1024/b9_)+b3_;
if(layerArr_[j]!=0)
{
b16_ = b4_ +":"+layerArr_[j];
}
b14_ = this.negPacket_.getRoute_(b10_[i]);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::syncSSRC, peerId({1})channel({2})id({3})同步中..",this.tag_,this.context_.peerId_,b16_,b5_));
this.createChannel_({name:b16_,id:b5_,route:b14_});
}
}
},
getSyncStatus_:function()
{
var syncs_ = new rc$.com.relayCore.utils.Map();
var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
var arr_,label_,layer,mappedId_,syncId_,channel_,cid_;
for(var i=0;i<this.dataChannels_.length;i++)
{
channel_ = this.dataChannels_.elements_[i].value;
label_ = channel_.label_;
layer_ = channel_.layer_;
cid_ = channel_.cid_;
if(label_.indexOf("@SYNC")>-1)
{
arr_ = label_.split(":");
mappedId_ = cid_-layer_*(1024/maxLayer_);
syncId_ = this.strings_.format("{0}:{1}",arr_[1],mappedId_);
if(!syncs_.find(syncId_))
{
syncs_.set(syncId_,1);
}
}
}
return syncs_;
},
setU_:function(_a)
{
var b_ = this.bytesPacket_.decode_(_a);
var b1_;
if(b_.data.ext)
{
b1_ = JSON.parse(b_.data.ext);
for(var i in b1_)
{
switch(i)
{
case "PackLossRate":
this.uPackLossRate_ = 1-(1-this.uPackLossRate_)*(1-b1_[i]);
break;
case "RTT":
this.uRTT_ = b1_[i]+this.uRTT_;
break;
case "Jitter":
this.uJitter_ = b1_[i];
case "SPC":
this.uSPC_=b1_[i];
}
}
}
},
broad_:function(_a,_a1)
{
if(this.context_.manager_.broadcast_)
{
this.context_.manager_.broadcast_.channelMessage_(this.context_.peerId_,_a,_a1);
}
}
});
rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.webrtc.packets.NegPacket = JClass.extend_({
ngId_:0,
lmVer_:0,
maxlayerCount_:8,
synced_:[],
unsynced_:[],
congif_:null,
tag_:"com::relayCore::webrtc::packets::NGPacket",
remoteAdvertise_:null,
lastAdvertise_:null,
context_:null,
strings_:null,
global_:null,
remoteRoute_:null,
routeActiveTime_:-1,
status_:0,

init:function(_a)
{
this.context_ = _a;
this.config_ = rc$.com.relayCore.vo.Config;
this.strings_ = rc$.com.relayCore.utils.String;
this.global_ = rc$.com.relayCore.utils.Global;
this.maxOwneds_ = this.config_.maxOwnedNum?this.config_.maxOwnedNum:this.maxOwneds_;
this.synced_ = [];
this.unsynced_ = [];
this.remoteAdvertise_ = null;
this.remoteRoute_ = null;
this.routeActiveTime_=-1;
this.lastAdvertise_ = null;
},
getPacket_:function()
{
var packet_ = {};
packet_.Negotiate = this.ngId_;
packet_.LMPNRC_Ver = this.lmVer_;
packet_.maxLayerCount = this.maxlayerCount_;
packet_.synced = this.synced_;
packet_.unsynced = this.unsynced_;
var myOwned_ = this.context_.getOwned_();
var mysame_ = this.isSame_(myOwned_,this.context_.owned_);
if(!mysame_||this.status_==0)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getPacket peer({1})资源发生变化需要发送Owned",this.tag_,this.context_.context_.peerId_));
this.context_.owned_ = myOwned_;
this.lastAdvertise_ = this.getAdvertise_();
packet_.Advertise = this.lastAdvertise_;
}
return packet_;
},
getAdvertise_:function()
{
var resource_ = {};
if(this.synced_.length<this.config_.syncMax_)
{
resource_.owned = this.context_.owned_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getAdvertise peerId({1})", this.tag_,this.context_.context_.peerId_));
}
else
{
var mywanted_ = this.context_.getWanted_();
resource_.wanted = mywanted_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getAdvertise peerId({1})->wanted({2})", this.tag_,this.status_,this.context_.context_.peerId_,JSON.stringify(resource_.wanted)));
}
resource_.route = this.context_.routes_;
return  resource_;
},
getSync_:function(_a,_a1,_a2)
{
if(_a == null||_a1 == null)
{
return [];
}
var b_ = [],exit_;
var b1_ = ["id","channel","mappedId"];
for(var i=0;i<_a1.length;i++)
{
exit_ = false;
for(var j=0;j<_a.length;j++)
{
exit_ = this.compareTo_(_a1[i],_a[j],b1_);
if(exit_)
{
break;
}
}
if(exit_==_a2)
{
b_.push(_a1[i]);
}
}
return b_;
},
addSync_:function(_a)
{
if(_a.length==0)
{
return false;
}
var b_,b1_;
for(var i=0;i<_a.length;i++)
{
b_ = _a[i];
b1_ = this.getSync_(this.unsynced_,[b_],true);
if(b1_.length>0)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSync 存在sync({1})", this.tag_,JSON.stringify(b_)));
continue;
}
this.synced_.push({id:b_.id,channel:b_.channel,mappedId:b_.mappedId,layer:b_.layer,spc:b_.spc});
}
return true;
},
getRoute_:function(_a)
{
var b_;
if(this.context_.remoteOwned_)
{
for(var i=0;i<this.context_.remoteOwned_.length;i++)
{
if(this.context_.remoteOwned_[i].id==_a.id)
{
b_ = this.context_.remoteOwned_[i];
break;
}
}
}
var b1_,b2_;
b1_ = this.remoteRoute_[b_.routeIndex];
b2_ = b_.routeTTL;
return {route:b1_,ttl:b2_,start:this.routeActiveTime_};
},
addunSync_:function(_a)
{
if(_a.length==0)
{
return false;
}
var b_ = this.getSync_(this.unsynced_,_a,false);
for(var i=0;i<b_.length;i++)
{
for(var j=0;j<this.synced_.length;j++)
{
if(this.compareTo_(b_[i],this.synced_[j],["id","channel","mappedId"]))
{
this.synced_.splice(j,1);
}
}
this.unsynced_.push(b_[i]);
this.sortSSRC_(this.unsynced_);
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addunSync 增加一个UnSync({1})", this.tag_,JSON.stringify(b_)));
return true;
},
deleteSync_:function(_a)
{
var b_ = [];
var b1_;
var b2_ = this.context_.context_.fromServer_?0:1;
for(var i=0;i<this.synced_.length;i++)
{
b1_ = (b2_+this.synced_[i].mappedId)%2;
if(b1_ == 0)
{
for(var j=0;j<_a.length;j++)
{
if(this.synced_[i].id == _a[j].id && this.synced_[i].mappedId == _a[j].mappedId)
{
b_.push(this.synced_[i]);
}
}
}
}
if(b_.length>0)
{
this.addunSync_(b_);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::deleteSync 同步资源（{1}）不存在了", this.tag_,JSON.stringify(b_)));
}
},
processData_:function(_a)
{
this.status_ = 1;
var b_,b1_,b2_,b3_,b4_;
var b5_ = _a.Negotiate;
if(_a.LMPNRC_Ver == null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 协议版本号为空，放弃通信", this.tag_));
return false;
}
if(Math.abs(this.ngId_ - this.context_.ng_)>this.config_.maxThreshold_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 阈值({1})超出最大阈值({2})，中断", this.tag_,this.ngId_ - this.context_.ng_,this.config_.maxThreshold_));
return false;
}
this.ngId_++;
var b6_ = _a.LMPNRC_Ver;
if(b6_<this.lmVer_)
{
this.lmVer_ = b6_;
}
var b7_ = _a.maxLayerCount;
if(b7_>this.maxlayerCount_)
{
this.maxlayerCount_ = b7_;
}
if(_a.synced.length>0)
{
if(!this.isSame_(this.synced_,_a.synced))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 同步列表不同，重新生成同步列表", this.tag_));
syncs_ = this.getSync_(this.synced_,this.context_.owned_,false);
this.addSync_(syncs_);
syncs_ = this.getSync_(this.synced_,this.context_.remoteOwned_,false);
this.addSync_(syncs_);
}
}
if(_a.unsynced&&_a.unsynced.length>0)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 更新不同步列表", this.tag_));
this.addunSync_(_a.unsynced);
}
b_ = _a.Advertise;
b1_ = this.context_.owned_;
b3_=false;
b4_=false;
if(b_ != null)
{
this.remoteAdvertise_ = b_;
if(b1_ != null)
{
b2_ = this.getSync_(this.synced_,b1_,false);
b3_ = this.addSync_(b2_);
}
if(b_.owned)
{
b2_ = this.getSync_(this.synced_,b_.owned,false);
b4_ = this.addSync_(b2_);
this.context_.remoteOwned_ = b_.owned;
this.context_.remoteSSRCStatus_ = rc$.com.relayCore.webrtc.PeerSSRCStatus.KNOWN;
}
if(b_.wanted)
{
b2_ = this.getSync_(owned_,b_.wanted,true);
b4_ = this.addSync_(b2_);
this.context_.remoteSSRCStatus_ = rc$.com.relayCore.webrtc.PeerSSRCStatus.UNKNOWN;
}
if(b_.route)
{
this.remoteRoute_ = b_.route;
this.routeActiveTime_ = this.global_.getMilliTime_();
}
if(b3_||b4_)
{
this.sortSSRC_(this.synced_);
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 本地是否需要同步({1})，是否存在新的同步({2})", this.tag_,b3_,b4_));
}
this.deleteSync_(b1_);
return true;
},
sortSSRC_:function(_a)
{
var b_ = ["id","mappedId","spc"];
_a.sort(function(a,b){
var b1_ = b_.length;
for(var i=0;i<b1_;i++)
{
if(a[b_[i]] != null)
{
if((a[b_[i]]-b[b_[i]]) != 0)
{
return a[b_[i]]-b[b_[i]];
}
}
}
return a[b_[b1_-1]]-b[b_[b1_-1]];
});
},
isSame_:function(_a,_a1)
{
var b_ = this.getSync_(_a,_a1,false);
if(b_.length>0)
{
return false;
}
b_=this.getSync_(_a1,_a,false);
if(b_.length>0)
{
return false;
}
return true;
},
compareTo_:function(_a,_a1,_a2)
{
var b_ = true;
for(var i=0;i<_a2.length;i++)
{
switch(_a2[i])
{
case "mappedId":
var b1_ = _a.mappedId%2;
var b2_ = _a1.mappedId%2;
if(b1_!=b2_)
{
b_ = false;
}
break;
default:
if(_a[_a2[i]]!=_a1[_a2[i]])
{
b_ = false;
}
break;
}
if(b_ == false)
{
break;
}
}
return b_;
}
});
rc$.com.relayCore.webrtc.packets.BytesPacket = {
ext_:{
C:0,
H:0,
K:0,
M:16,
N:0,
P:16,
Q:0,
R:0,
T:0,
k:0
},
encode_ : function(_message) {
var type_ = this.selectType_(_message.type);
var packet_;
if(type_ == "stream")
{
packet_ = this.streamEncode_(_message);
}
if(type_ == "meta")
{
packet_ = this.metaEncode_(_message);
}
return packet_;
},
decode_:function(_a)
{
var b_ = new Uint8Array(_a);
var b1_ = rc$.com.relayCore.utils.Number.convertToValue_('1', b_,0);
var b2_ = this.selectType_(b1_);
var b3_={type:b2_};
switch(b2_)
{
case "stream":
b3_.data = this.streamDecode_(b_);
break;
case "meta":
b3_.data = this.metaDecode_(b_);
break;
default:
break;
}
return b3_;
},
selectType_:function(_a)
{
var b_ = "未知";
switch(_a)
{
case 72:
case 75:
case 107:
case 67:
case 78:
case 80:
case 81:
case 84:
case 85:
case 77:
case 82:
b_ = "stream";
break;
default:
b_ = "meta";
break;
}
return b_;
},
streamEncode_:function(_a)
{
var b_ = [ {
"type_1" : _a.type?_a.type:81
}
,{
"mpt_1" : _a.mpt?_a.mpt:0
}
,{
"reveive_1" : 0
}
,{
"seq_1" : _a.seq?_a.seq:0
}
,{
"ts_4" : _a.ts?_a.ts:0
}
,{
"ext" : []
}
,{
"payload" :[]
}
];
var b1_ = String.fromCharCode(_a.type);
var b2_ = this.ext_[b1_];
var b3_;
if(b2_>0)
{
b3_ = {};
b3_["ext_"+b2_]=_a.ext?_a.ext:"";
b_[5].ext.push(b3_);
}
var b4_ = _a.payload?_a.payload:0;
if(b1_=="U")
{
b3_ = {};
b3_.payload_utf=b4_;
}
else
{
b3_ = {};
b3_.payload_d=b4_;
}
b_[6].payload.push(b3_);
return this.toBytes_(b_);
},
streamDecode_:function(_a)
{
var b_ = {};
var b1_ = 0;
b_.type = rc$.com.relayCore.utils.Number.convertToValue_('1', _a, b1_);
b1_ += 1;
b_.mpt = rc$.com.relayCore.utils.Number.convertToValue_('1', _a, b1_);
b1_ += 2;
b_.seq = rc$.com.relayCore.utils.Number.convertToValue_('1', _a, b1_);
b1_ += 1;
b_.ts = rc$.com.relayCore.utils.Number.convertToValue_('4', _a, b1_);
b1_ += 4;
var b2_ = this.ext_[String.fromCharCode(b_.type)];
if(b2_>0)
{
b_.ext = rc$.com.relayCore.utils.Number.convertToValue_('utf', _a, b1_,b2_);
b1_ += b2_;
}
var b3_ = _a.length-b1_;
if(b_.type==85)
{
b_.payload = rc$.com.relayCore.utils.Number.convertToValue_('utf', _a, b1_,b3_);
}
else
{
b_.payload = rc$.com.relayCore.utils.Number.convertToValue_('d', _a, b1_,b3_);
}
return b_;
},
metaEncode_:function(_a)
{
var b_ = [ {
"status_1" : _a.type?_a.type:0
}
,{
"Layers_1" : _a.layers?_a.layer:0
}
,{
"AuthPoint_1" : _a.authpoint?_a.authpoint:0
}
,{
"receive_1" : 0
}
,{
"NTPS_4" : _a.ntps?_a.ntps:0
}
,{
"NTPSF_4" : _a.ntpsf?_a.ntpsf:0
}
,{
"SDPHash" : [{"len_4":16},{"sdp_utf":_a.sdphash?_a.sdphash:""}]
}
];
if(_a.layers>1)
{
for(var i=0;i<_a.Tags.length;i++)
{
var b1_ = _a.Tags[i];
b_.push({"len_4":16,"b1_utf":b1_});
}
}
return this.toBytes_(b_);
},
metaDecode_:function(_a)
{
var b_ = {};
var b1_ = 0;
b_.status = rc$.com.relayCore.utils.Number.convertToValue_('1', _a, b1_);
b1_ += 1;
b_.Layers = rc$.com.relayCore.utils.Number.convertToValue_('1', _a, b1_);
b1_ += 1;
b_.AuthPoint = rc$.com.relayCore.utils.Number.convertToValue_('1', _a, b1_);
b1_ += 2;
b_.NTPS = rc$.com.relayCore.utils.Number.convertToValue_('4', _a, b1_);
b1_ += 4;
b_.NTPSF = rc$.com.relayCore.utils.Number.convertToValue_('4', _a, b1_);
b1_ += 4;
b_.SDPHash = rc$.com.relayCore.utils.Number.convertToValue_('utf', _a, b1_,16);
b1_ += 16;
if(b_.Layers>1)
{
var b2_ = 16;
b_.Tags=[];
for(var i=0;i<b_.Layers-2;i++)
{
b_.Tags.push(rc$.com.relayCore.utils.Number.convertToValue_('utf', _a, b1_,b2_));
b1_ += b2_;
}
}
return b_;
},
toBytes_:function(_a)
{
var b_ = [];
this.processObject_(_a, b_);
var b1_ = 0;

for ( var _i = 0; _i < b_.length; _i++) {
b1_ += b_[_i].length;
}
var b2_ = new Uint8Array(b1_);
var b3_ = 0;
for ( var _i = 0; _i < b_.length; _i++) {
for ( var _j = 0; _j < b_[_i].length; _j++) {
b2_[b3_++] = b_[_i][_j];
}
}
return b2_;
},
processObject_ : function(_obj, _array) {
switch (typeof (_obj)) {
case "array":
for ( var i = 0; i < _obj.length; i++) {
if (_obj[i] instanceof Array) {
this.processObject_(_obj[i], _array);
} else if (typeof (_obj[i]) == "object") {
this.processObject_(_obj[i], _array);
}
}
break;
case "object":
var element_;
for ( element_ in _obj) {
var size_ = element_.split("_")[1];
if (size_) {
rc$.com.relayCore.utils.Number.convertToBit_(size_, _obj[element_], _array);
}
if (!size_ && _obj[element_]) {
this.processObject_(_obj[element_], _array);
}
}
break;
default:
break;
}
}
};
rc$.com.relayCore.webrtc.PacketProcess = JClass.extend_({
negPacket_:null,
bytesPacket_:null,
channel_:null,
strings_:null,
tag_:"com::relayCore::webrtc::PacketProcess",
init:function(_a)
{
this.channel_ = _a;
this.strings_ = rc$.com.relayCore.utils.String;
},
process_:function(_a)
{
var b_ = _a.type;
switch(b_)
{
case "negotiation":
this.processNeg_(_a.data);
break;
case "meta":
break;
case "stream":
break;
default:
break;
}
},
processNeg_:function(_a)
{
var b_ = JSON.parse(_a);
var b1_ = this.channel_.lastPacket_;
var b2_ = false;
var b3_=true;
var b4_=false;
if(b1_&&b_.Negotiate==b1_.Negotiate)
{
b4_ = this.compareTo_(b1_,b_);
if(!b4_)
{
b3_ = this.channel_.negPacket_.processData_(b_);
}
}
else if(b_.Negotiate == (this.channel_.negPacket_.ngId_+1))
{
b3_ = this.channel_.negPacket_.processData_(b_);
b2_ = true;
b1_ = this.channel_.negPacket_.getPacket_();
b4_ = this.compareTo_(b1_,b_);
}
if(!b3_){
return false;
}
if(!b4_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1}) NG({2}) 协商不成立，继续...", this.tag_,this.channel_.context_.peerId_,b_.Negotiate));
this.channel_.sendNeg_();
return false;
}

if(b2_)
{
this.channel_.sendNeg_();
}
this.channel_.ng_ = this.channel_.negPacket_.ngId_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1})协商成立,序列号({2})", this.tag_,this.channel_.context_.peerId_,this.channel_.ng_));
this.channel_.ngStatus_ = false;
this.channel_.onNegOver_();
},
compareTo_:function(_a,_a1)
{
var b_ = ["Negotiate","LMPNRC_Ver","maxLayerCount","synced","unsynced","Advertise"];
var b1_ = true;
var b2_,b3_,b4_,b5_,b6_,b7_;
for(var i=0;i<b_.length;i++)
{
b4_ = _a[b_[i]];
b5_ = _a1[b_[i]];
switch(b_[i])
{
case "synced":
case "unsynced":
b2_ = this.channel_.negPacket_.getSync_(b4_,b5_,false);
b3_ = this.channel_.negPacket_.getSync_(b4_,b5_,false);
if(b2_.length>0||b3_.length>0)
{
b1_ = false;
}
break;
case "Advertise":
b6_ = b4_?b4_.owned:[];
b7_ = b5_?b5_.owned:[];
b2_ = this.channel_.negPacket_.getSync_(b6_,b7_,false);
b3_ = this.channel_.negPacket_.getSync_(b7_,b6_,false);
if(b2_.length>0||b3_.length>0)
{
b1_ = false;
}
b6_ = b4_?b4_.wanted:[];
b7_ = b5_?b5_.wanted:[];
b2_ = this.channel_.negPacket_.getSync_(b6_,b7_,false);
b3_ = this.channel_.negPacket_.getSync_(b7_,b6_,false);
if(b2_.length>0||b3_.length>0)
{
b1_ = false;
}
break;
default:
if(b4_!=b5_)
{
b1_ = false;
}
break;
}
if(b1_==false)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::compareTo ({1}),{2}-{3}", this.tag_,b_[i],JSON.stringify(b4_),JSON.stringify(b5_)));
break;
}
}
return b1_;
}
});
rc$.com.relayCore.webrtc.MetaChannel = JClass.extend_({
label_:null,
id_:null,
cid_:-1,
level_:-1,
from_:-1,
layer_:-1,
peerId_:null,

activeTime_:0,
createTime_:0,
timestamp_:-1,
seq_:-1,
cachePacket_:null,
channel_:null,
context_:null,
active_:false,
interval_:5*1000,
timerOutId_:-1,
pingId_:-1,
global_:null,
strings_:null,
config_:null,
from_:-1,
syncStatusId_:-1,
syncStatusInterval_:300*1000,
syncStatus_:67,
sendSeqs_:null,
lossP_:0,

unavailableTimes_:0,
rsendTimes_:0,
unavailableTimes_:0,
route_:null,
broadcast_:null,
tag_:"com::relayCore::webrtc::MetaChannel",

init:function(_a,_a1,_a2)
{
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.config_ = rc$.com.relayCore.vo.Config;
this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
this.cachePacket_ = new rc$.com.relayCore.utils.Map();
this.timerId_ = -1;
this.pingId_ = -1;
this.channel_ = _a1;
this.context_ = _a;
this.peerId_ = this.context_.context_.peerId_;
this.from_ = this.context_.context_.fromServer_?0:1;
this.label_ = this.channel_.label;
var b_ = this.label_.split(":");
this.layer_ = b_.length>2?Number(b_[2]):0;
this.cid_ = this.channel_.id;
this.level_ = (this.from_+this.cid_)%2;
if(this.label_.indexOf("@SYNC")>-1)
{
this.id_ = this.strings_.format("{0}:{1}:{2}", this.from_,this.peerId_, this.cid_);
}
this.active_ = true;
this.route_ = _a2.route,
this.createTime_ = this.global_.getMilliTime_();
this.sendSeqs_=[];
},
startPing_:function()
{
this.send_({type:"byte",data:{type:75}});
this.startTimeout_();
},
startTimeout_:function()
{
this.stopTimeout_();
if(this.temerOutId_ == -1)
{
var callback_ = this.timerOut_.bind(this);
this.temerOutId_ = setTimeout(callback_,this.interval_);
}
},
stopTimeout_:function()
{
if(this.temerOutId_ != -1)
{
clearTimeout(this.temerOutId_);
this.temerOutId_ = -1;
}
},
timerOut_:function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::timerOut_ Ping send Out! peerId({1}),channelId({2}),close channel",this.tag_, this.peerId_,this.channel_.id));
this.active_ = false;
this.close_();
},
respond_:function()
{
this.active_ = true;
this.activeTime_ = this.global_.getMilliTime_();
this.stopTimeout_();
if(this.pingId_ != -1)
{
clearTimeout(this.pingId_);
}
this.pingId_ = setTimeout(this.startPing_.bind(this),this.interval_);
},
addUnavailbleTime_:function()
{
this.unavailableTimes_++;
this.send_({type:"byte",data:{type:this.syncStatus_}});
if(this.unavailableTimes_>this.config_.unavailableMaxTimes_)
{
this.close_();
}
},
updateStatus_:function(_a)
{
if(this.syncStatus_ != _a)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::updateStatus peerId({1}),status({2})->({3})",this.tag_, this.peerId_,this.syncStatus_,_a));
if(this.syncStatusId_>0)
{
clearTimeout(this.syncStatusId_);
this.closeId_ = -1;
}
this.syncStatus_ = _a;
if(this.syncStatus_==67)
{
var b_ = this.timerOut_.bind(this);
this.syncStatusId_ = setTimeout(b_,this.syncStatusInterval_)
}
this.broad_("syncStatus",this.syncStatus_);
return true;
}
return false;
},
redoSend_:function(_a,_a1)
{
if(this.sendSeqs_.indexOf(_a1)>-1)
{
return;
}
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})发现丢包seq({2}),发送N", this.tag_,this.channel_.label,_a1));
this.sendSeqs_.push(_a1);
this.send_(_a);
},
send_:function(_a)
{
var b_ = _a.type;
var b1_=_a.data;
var b2_=0;
switch(b_)
{
case "json":
b1_ = JSON.stringify(_a.data);
b2_=0;
break;
case "byte":
b1_ = this.context_.bytesPacket_.encode_(_a.data);
b2_=rc$.com.relayCore.utils.Number.convertToValue_('1', b1_,0);
break;
default:
b2_=rc$.com.relayCore.utils.Number.convertToValue_('1', _a.data,0);
break;
}
this.broad_("send",b2_);
if(this.channel_.readyState == "closing")
{
return;
}
if(this.channel_.id>0&&this.channel_.label.indexOf("@SYNC")==-1)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::send_ peerId({1}),channelId({2)非法channel！",this.tag_, this.peerId_,this.channel_.id));
this.close_();
return;
}
this.channel_.send(b1_);
},
getSYNC_:function()
{
var labelInfo_ = this.channel_.label.split(":");
return this.context_.getSYNC_(labelInfo_[1]);
},
updatePacket_:function(_a)
{
var b_ = _a.type;
var b1_;
if(this.cachePacket_.find(b_))
{
b1_ = this.cachePacket_.get(b_);
b1_.update_(_a);
return;
}
b1_ = new rc$.com.relayCore.ssrcs.CacheData(this);
b1_.update_(_a);
this.cachePacket_.set(b_,b1_);
},
getActiveTime_:function()
{
return this.activeTime_-this.createTime_;
},
broad_:function(_a,_a1)
{
this.broadcast_.channelMessage_(this.id_,_a,_a1);
},
updateLossSEQ_:function(_a)
{
var b_ = this.context_.uRTT_;
if(this.cachePacket_.find(72))
{
var b1_ = this.cachePacket_.get(72);
var b2_ = b1_.timestamp_;
var b3_ = b2_-(b_-_a);
this.seq_ = b1_.getSEQ_(b3_);
if(this.seq_>-1)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::updateLossSEQ 设置channel({1})的seq({2}),可能存在丢包！",this.tag_, this.channel_.label,this.seq_));
}
}
},
getH_:function(_a)
{
if(!this.cachePacket_.find(72))
{
return null;
}
var b_ = this.cachePacket_.get(72);
if(!_a&&b_.data.find(b_.seq_))
{
return b_.data.get(b_.seq_);
}
return b_.data.get(_a);
},
close_:function()
{
this.channel_.close();
this.context_.removeChannel_(this.channel_);
},
clear_:function()
{
this.activeTime_=-1;
this.createTime_=0;
this.channel_=null;
this.context_=null;
this.route_=null;
this.active_=false;
this.interval_=-1;
this.stopTimeout_();
this.broadcast_=null;
if(this.pingId_!=-1)
{
clearTimeout(this.pingId_);
}
if(this.syncStatusId_>0)
{
clearTimeout(this.syncStatusId_);
this.closeId_ = -1;
}
this.global_=null;
}
});
rc$.ns("com.relayCore.vo");
rc$.com.relayCore.vo.Config=
{
version:"1.0.1",
clientId:null,
debugBarId:null,
auto:false,
logLevel : 15,
logType : 3,
webrtcTotalNodeCount:0,
webrtcServerHost_:"ws://10.75.134.220:8090",
stunServerHost:"stun:stun01.sipphone.com",
logServer:"http://10.58.132.159:8000",
syncMax_:10,
channel_:"test",
prints_:[72,85],
unavailableMaxTimes_:5,
maxThreshold_:5,
messageExpiredTime_:30*1000,
test:"//"
};
rc$.ns("com.relayCore.statics");
rc$.com.relayCore.statics.Statics = JClass.extend_({
config_:null,
strings_:null,
global_:null,
controller_:null,
tag_:"com::relayCore::statics::Statics",

init:function(_a)
{
this.controller_ = _a;
this.config_ = rc$.com.relayCore.vo.Config;
this.strings_ = rc$.com.relayCore.utils.String;
this.global_ = rc$.com.relayCore.utils.Global;
},
send_:function(_a)
{

},
close_:function()
{
this.config_=null;
this.strings_=null;
this.global_=null;
this.controller_=null;
}
});
rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.SyncLevel={
RELAY:"relay",
SERVING:"serving",
SOURCING:"sourcing"
};
rc$.com.relayCore.ssrcs.SSRC = JClass.extend_({
id:null,
channel:null,
level:"relay",
sdp:null,
spc:null,
callback:null,
options:null,
layer:0,

timestamp_:0,
routeIndex_:-1,
activeTime_:0,
manager_:null,

ssrcChannel_:null,

spcs_:null,
config_:null,
layers_:null,
global_:null,
strings_:null,
bytesPacket_:null,

checkPacketId_:-1,
checkPacketInterval:30*1000,
virCloseInterval_:60*1000,
virTimeoutId_:-1,
sendCID_:-1,
sendCInterval_:5*1000,
checkSyncId_:-1,
checkSyncInterval_:30*1000,

relaysyncMin_:1,
servingsyncMin_:3,
sourcingunsyncMin_:2,


tag_:"com::relayCore::ssrcs::SSRC",

init:function(_a,_a1)
{
this.level = rc$.com.relayCore.ssrcs.SyncLevel.RELAY;
this.manager_ = _a;
this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.config_ = rc$.com.relayCore.vo.Config;
rc$.apply(this,_a1);
this.layers_ = new rc$.com.relayCore.utils.Map();
this.spcs_ = new rc$.com.relayCore.utils.Map();
this.ssrcChannel_ = this.manager_.getChannelById_(this.id);
this.ssrcChannel_.registerMethod_({name:"onAdd",body:this.addChannel_.bind(this)});
this.ssrcChannel_.registerMethod_({name:"onRemove",body:this.removeChannel_.bind(this)});
},
initializeServing_:function()
{
var layers_ = [];
if(typeof(this.layer)=="number")
{
for(var i=0;i<this.layer;i++)
{
layers_.push(i);
}
}
else
{
layers_ = this.layer;
}
var layerChannel_,cid_,channel_,label_,metaChannel_,hasChannels_,params_,layer_,type_,arr_,channelId_;
switch(this.level)
{
case "relay":
for(var i=0;i<layers_.length;i++)
{
layerChannel_ = this.createLayer_(layers_[i]);
}
hasChannels_=this.ssrcChannel_.getChannelByType_({type:"@SYNC"});
for(var i=0;i<hasChannels_.length;i++)
{
metaChannel_ = this.ssrcChannel_.getChannelById_(hasChannels_[i]);
this.addChannel_(metaChannel_);
}
break;
case "serving":
for(var i=0;i<layers_.length;i++)
{
layerChannel_ = this.createLayer_(layers_[i]);
this.getSPC_(this.id);
cid_ = this.strings_.format("{0}:{1}:{2}",0,this.id,1+layers_[i]*2);
label_ = this.strings_.format("@VIR:{0}:{1}",this.id,layers_[i]);
if(layerChannel_.unsyncChannels_.indexOf(cid_)==-1)
{
channel_ = this.createVirtualChannel_({label:label_,peerId:this.id,from:0,cid:1+layers_[i]*2,id:cid_,layer:layers_[i],callback:this.callback});
channel_.onOpen_();
}
}
this.createLayer_(0);
hasChannels_=this.ssrcChannel_.getChannelByType_({level:0});
for(var i=0;i<hasChannels_.length;i++)
{
metaChannel_ = this.ssrcChannel_.getChannelById_(hasChannels_[i]);
this.addChannel_(metaChannel_);
}
break;
case "sourcing":
for(var i=0;i<layers_.length;i++)
{
cid_ = this.strings_.format("{0}:{1}:{2}",1,this.id,1+layers_[i]*2);
label_ = this.strings_.format("@VIR:{0}:{1}",this.id,layers_[i]);
layerChannel_ = this.createLayer_(layers_[i]);
if(layerChannel_.syncChannels_.indexOf(cid_)==-1)
{
if(this.virTimeoutId_>0)
{
clearTimeout(this.virTimeoutId_);
}
params_={
label:label_,
peerId:"VIR",
from:1,
cid:1+layers_[i]*2,
id:cid_,
layer:layers_[i]
};
channel_ = this.createVirtualChannel_(params_);
channel_.onOpen_();
this.settingMainChannel_(channel_);
}
}
this.options.send = this.messageFromApp_.bind(this);
break;
}
if(this.checkSyncId_>0){clearInterval(this.checkSyncId_);}
this.checkSyncId_ = setInterval(this.checkSyncStatus_.bind(this),this.checkSyncInterval_);
},

stop_:function(_a)
{
var b_=this.layers_.keys();
if(_a.hasOwnProperty("layer"))
{
if(typeof(_a.layer)=="number")
{
b_=[];
for(var i=0;i<_a.layer;i++)
{
b_.push(i);
}
}
else
{
b_ = _a.layer;
}
}
var b1_,b2_;
for(var i=0;i<b_.length;i++)
{
b1_ = this.strings_.format("{0}:{1}:{2}",_a.level=="serving"?0:1,this.id,1+b_[i]*2);
b2_ = this.ssrcChannel_.getChannelById_(b1_);
if(b2_)
{
b2_.close_();
}
}
},
addChannel_:function(_a)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel 添加level({1})Channel({2})",this.tag_,this.level,_a.id_));
var b_ = this.createLayer_(_a.layer_);
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
if(_a.label_.indexOf("@SYNC")>-1)
{
if(_a.level_==0)
{
b_.syncChannels_.push(_a.id_);
this.settingMainChannel_(_a);
}
else
{
b_.unsyncChannels_.push(_a.id_);
}
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
if(_a.level_==0)
{
b_.syncChannels_.push(_a.id_);
this.settingMainChannel_(_a);
var b1_ = this.strings_.format("{0}:{1}:{2}",0,this.id,1+_a.layer_*2);
if(b_.unsyncChannels_.indexOf(b1_)==-1)
{
this.getSPC_(this.id);
label_ = this.strings_.format("@VIR:{0}:{1}",this.id,_a.layer_);
var b2_ = this.createVirtualChannel_({label:label_,peerId:this.id,from:0,cid:1+_a.layer_*2,id:b1_,layer:_a.layer_,callback:this.callback});
b2_.onOpen_();
}
}
else
{
if(_a.label_.indexOf("@VIR")>-1)
{
b_.unsyncChannels_.push(_a.id_);
}
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
if(_a.level_==1)
{
b_.unsyncChannels_.push(_a.id_);
}
else
{
if(_a.label_.indexOf("@VIR")>-1)
{
b_.syncChannels_.push(_a.id_);
}
}

break;
}
this.broad_({type:"add",id:_a.id_});
this.syncChannelStatus_(_a.layer_);
},
removeChannel_:function(_a)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel 删除level({1})Channel({2})",this.tag_,this.level,_a.id_));
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
if(this.layers_.find(_a.layer_))
{
if(_a.level_==0)
{
this.layers_.get(_a.layer_).syncChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_a.layer_});
this.settingMainChannel_(_a);
if(this.layers_.get(_a.layer_).syncChannels_<this.relaysyncMin_)
{
this.getMoreChannel_(_a);
}
if(this.layers_.get(_a.layer_).syncChannels_.length==0)
{
var b_=this.getMessageByType_(67);
if(this.sendCID_ > 0){clearInterval(this.sendCID_);}
this.sendCID_ = setInterval(this.relayMessage_.bind(this),this.sendCInterval_,{layer:[0],level:1,data:b_});
}
}
else
{
this.layers_.get(_a.layer_).unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_a.layer_});
var b1_ = this.ssrcChannel_.getChannelByType_({level:1});
this.syncChannelStatus_(_a.layer_);
if(b1_.length==0)
{
this.onSSRCClose_();
}
}
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
if(this.layers_.find(_a.layer_))
{
if(_a.level_==0)
{
this.layers_.get(_a.layer_).syncChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_a.layer_});
this.settingMainChannel_(_a);
if(this.layers_.get(_a.layer_).syncChannels_<this.servingsyncMin_)
{
this.getMoreChannel_(_a);
}
}
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
if(this.layers_.find(_a.layer_))
{
if(_a.level_==1)
{
this.layers_.get(_a.layer_).b1_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_a.layer_});
if(this.layers_.get(_a.layer_).b1_<this.sourcingunsyncMin_)
{
this.getMoreChannel_(_a);
}
var b2_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_a.layer_,type:"@VIR"});
if(this.layers_.get(_a.layer_).b1_.length==0&&b2_.length==0)
{
this.onSSRCClose_();
}
this.syncChannelStatus_(_a.layer_);
}
}
break;
}
this.broad_({type:"remove",id:_a.id_});
},
getSPC_:function(_a)
{
if(this.spcs_.find(_a))
{
return this.spcs_.get(_a);
}
var b_ = this.strings_.format("{0}-{1}-{2}",this.strings_.getRandom_(5),this.strings_.getRandom_(5),this.strings_.getRandom_(5));
this.spcs_.set(_a,b_);
return b_;
},
createVirtualChannel_:function(_a)
{
var b_ = this.ssrcChannel_.getChannelById_(_a.label);
if(b_)
{
return b_;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}createVirtualChannel 创建虚拟通道({1})",this.tag_,_a.label));
b_ = new rc$.com.relayCore.ssrcs.VirtualChannel(this,_a);
this.manager_.addChannel_(b_);
return b_;

},
closeVirtualChannel_:function(_a)
{
var b_ = this.ssrcChannel_.getChannelById_(_a.label);
if(b_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::closeVirtualChannel_ 关闭虚拟通道({1})",this.tag_,_a.label));
this.ssrcChannel_.removeChannel_(b_);
var b1_ = this.layers_.get(_a.layer);
var b2_,b3_,b4_;
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
b2_ = b1_.unsyncChannels_;
b3_ = b2_.indexOf(_a.label);
if(b3_>-1)
{
b2_.splice(b3_,1);
}
b1_.unsyncChannels_ = b2_;
b4_ = this.ssrcChannel_.getChannelByType_({level:1,type:"@VIR"});
if(b4_.length==0)
{
this.onSSRCClose_();
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
b2_ = b1_.syncChannels_;
b3_ = b2_.indexOf(_a.label);
if(b3_>-1)
{
b2_.splice(b3_,1);
}
b1_.syncChannels_ = b2_;
b4_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@VIR"});
if(b4_.length==0)
{
var b5_=this.getMessageByType_(67);
if(this.sendCID_ > 0){clearInterval(this.sendCID_);}
this.sendCID_ = setInterval(this.relayMessage_.bind(this),this.sendCInterval_,{layer:this.layers_.keys(),level:1,data:b5_});
if(this.virTimeoutId_>0)
{
clearTimeout(this.virTimeoutId_);
}
this.virTimeoutId_ = setTimeout(this.onSSRCClose_.bind(this),this.virCloseInterval_);
}
break;
}
}
},
createLayer_:function(_a)
{
if(this.layers_.find(_a))
{
return this.layers_.get(_a);
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createLayer 创建新层({1})",this.tag_,_a));
var b_ = new rc$.com.relayCore.ssrcs.Layer(this,_a);
if(_a==0){
b_.startCheck_();
}
this.layers_.set(_a,b_);
return b_;
},
updateChannelStatus_:function()
{
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
break;
}
},
settingMainChannel_:function(_a)
{
var b_ = this.layers_.get(_a.layer_);
if(b_.channelId_ == null)
{
b_.channelId_ = _a.id_;
b_.route_ = this.getRoute_(_a.layer_);
return;
}
var b1_=b_.syncChannels_;

if(b1_.indexOf(_a.id_)==-1)
{
b_.channelId_ = null;
var b2_;
for(var i=0;i<b1_.length;i++)
{
b2_ = this.ssrcChannel_.getChannelById_(b1_[i]);
if(b2_)
{
if(b2_.context_.uSPC_==this.spc)
{
b_.channelId_ = b1_[i];
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}openSycnChannel 更改主Channel({1})->({2})",this.tag_,b_.channelId_,b1_[i]));
break;
}
}
}
if(b_.channelId_==null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}openSycnChannel 没有找到对应SPC({1})的channel做主Channel",this.tag_,this.spc));
}
}
return;
},
messageFromApp_:function(_a,_a1)
{
var b_ = this.strings_.format("{0}:{1}:{2}",1,this.id,1+Number(_a1)*2);
var b1_ = this.ssrcChannel_.getChannelById_(b_);
if(!b1_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::messageFromApp b1_({1})还没有创建！",this.tag_,b_));
return;
}
try{
b1_.onMessage_(_a);
}
catch(e)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::messageFromApp b1_({1})数据处理错误（）！",this.tag_,b_,e.toString()));
}
},
onStreamSync_:function(_a)
{
this.activeTime_ = this.global_.getMilliTime_();
var b_ = _a.channel.level_;
var b1_ = _a.channel.layer_;
var b2_;
if(!this.layers_.find(b1_))
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync 当前发送数据所在层({1})不存在！",this.tag_,b1_));
return;
}
var b3_ = _a.channel.id_;
var b4_;
var b5_ = this.isMainChannel_(_a.channel);
switch(b_)
{
case 0:
switch(_a.type)
{
case 67:
switch(b5_.status)
{
case 67:
break;
case 81:
b5_.channel.addUnavailbleTime_();
if(b5_.main)
{
this.relayMessage_({layer:[b1_],level:1,status:[81,84],data:_a.data});
}
break;
case 84:
b5_.channel.addUnavailbleTime_();
if(b5_.main)
{
this.relayMessage_({layer:[b1_],level:1,status:[84],data:_a.data});
}
break;
}
if(b5_.channel.updateStatus_(67)){
this.syncChannelStatus_(b1_);
}
break;
case 72:
b2_ = this.layers_.get(b1_);
b2_.updatePacket_({type:_a.type,data:_a.data});
b5_.channel.updatePacket_({type:_a.type,data:_a.data});
b5_.channel.updateLossSEQ_(this.getChannelRTT_(b1_));
switch(b5_.status)
{
case 67:
b5_.channel.send_(this.getMessageByType_(b5_.status));
break;
case 81:
var b6_ = this.getMessageByType_(b5_.status);
b5_.channel.send_(b6_);
if(b5_.main)
{
this.relayMessage_({layer:[b1_],level:1,status:[84],data:_a.data});
}
break;
case 84:
if(b5_.main)
{
this.relayMessage_({layer:[b1_],level:1,status:[84],data:_a.data});
}
break;
}
break;
case 77:
var b7_,b8_=-1,sdpHash_;
b2_ = this.layers_.get(0);
b7_ = b2_.cachePacket_.get(77);
if(b7_)
{
b8_ = b7_.timestamp_;
sdpHash_ =b7_.sdpHash_;
}
b2_.updatePacket_({type:_a.type,data:_a.data});
b7_ = b2_.cachePacket_.get(77);
if(b8_>b7_.timestamp_)
{
break;
}
var b9_ = b2_.cachePacket_.get(85);
if(b7_.sdpHash_&&b9_)
{
if(!b9_.active_)
{
b9_.check_(b7_.sdpHash_);
}
else
{
if(sdpHash_&&this.strings_.compareTo_(sdpHash_,b7_.sdpHash_)!=0)
{
b9_.active_ = false;
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息M。SDPHash变化，U失效 。label({1}),sdp({2})->({3})", this.tag_,_a.channel.label_,sdpHash_,payload_.SDPHash));
}
}
}
this.timestamp_ = b7_.timestamp_;

switch(b5_.status)
{
case 67:
var b10_ = this.getMessageByType_(b5_.status);
b5_.channel.send_(b10_);
break;
case 81:
if(b5_.main)
{
this.relayMessage_({layer:[b1_],level:1,status:[81,84],data:_a.data});
}
break;
case 84:
if(b5_.main)
{
this.relayMessage_({layer:[b1_],level:1,status:[84],data:_a.data});
}
break;
}
break;
case 80:
b5_.channel.unavailbleTimes_=0;
b2_ = this.layers_.get(b1_);
b2_.updatePacket_({type:_a.type,data:_a.data});
switch(b5_.status)
{
case 67:
var b10_ = this.getMessageByType_(b5_.status);
b5_.channel.send_(b10_);
break;
case 81:
var b12_;
var b13_ = b2_.checkLoss_(_a.data);
if(b13_.length>0)
{
for(var i=0;i<b13_.length;i++)
{
b12_ = this.getMessageByType_(78,b13_[i]);
b5_.channel.redoSend_(b12_,b13_[i].seq);
}
}
if(b5_.main)
{
var b14_ = b2_.getH_();
if(b14_)
{
this.relayMessage_({layer:[b1_],level:1,status:[84],data:b14_});
}
this.relayMessage_({layer:[b1_],level:1,status:[81],data:_a.data});
break;
}
break;
case 84:
b5_.channel.updatePacket_({type:72,data:_a.data});
b5_.channel.updateLossSEQ_(this.getChannelRTT_(b1_));
var b15_ = this.getMessageByType_(b5_.status);
b5_.channel.send_(b15_);
if(b5_.main)
{
var b14_ = b2_.getH_();
this.relayMessage_({layer:[b1_],level:1,status:[84],data:b14_});
}
break;
}
break;
case 82:
break;
case 85:
if(b5_.channel&&b5_.channel.label_.indexOf("@VIR")==-1)
{
b5_.channel.context_.setU_(_a.data);
}
b2_ = this.layers_.get(0);
var b9_,b18_=false;
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
if(b5_.main)
{
b2_.updatePacket_({type:85,data:_a.data});
b9_ = b2_.cachePacket_.get(85).data;
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
b5_.channel.updatePacket_({type:85,data:_a.data});

var b19_ = b2_.syncChannels_;
var b9_,b21_,b13_=1,rtt_=0,jitter_,channel_,temp_;
for(var i=0;i<b19_.length;i++)
{
b4_ = this.ssrcChannel_.getChannelById_(b19_[i]);
if(b4_)
{
b13_ = b13_*b4_.context_.uPackLossRate_;
jitter_ = Math.max((b4_.context_.uRTT_+b4_.context_.uJitter),jitter_);
rtt_ = Math.max(b4_.context_.uRTT,rtt_);
}
}
b9_ = this.bytesPacket_.decode_(_a.data).data;
b21_ = JSON.parse(b9_.payload);
b21_.PackLossRate = 1-b13_;
b21_.RTT = rtt_;
b21_.Jitter = jitter_-rtt_;
b9_.b21_ = JSON.stringify(b21_);
b9_=this.bytesPacket_.encode_(b9_);
b2_.updatePacket_({type:85,data:b9_});
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
b2_.updatePacket_({type:85,data:_a.data});
var b9_ = this.bytesPacket_.decode_(_a.data);
var b21_ = JSON.parse(b9_.data.payload);
var b25_,b26_;
for(var i=0;i<b2_.unsyncChannels_.length;i++)
{
b4_ = this.ssrcChannel_.getChannelById_(b2_.unsyncChannels_[i]);
if(b4_)
{

b26_ = b4_.peerId_;
if(b4_.label_.indexOf("@VIR")==-1)
{
if(!this.spcs_.find(b26_))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})spc不存在", this.tag_,b2_.unsyncChannels_[i]));
continue;
}
b25_ = this.spcs_.get(b26_);
b21_.SPC = b25_;
b9_.data.payload = JSON.stringify(b21_);
}
b4_.send_({type:"byte",data:b9_.data});
}
}
break;
}
switch(b5_.status)
{
case 67:
var b10_ = this.getMessageByType_(b5_.status);
b5_.channel.send_(b10_);
break;
case 81:
if(b5_.main)
{
this.relayMessage_({layer:[0],level:1,status:[81,84],data:b9_});
}
break;
case 84:
if(b5_.main)
{
this.relayMessage_({layer:[0],level:1,status:[84],data:b9_});
}
break;
}
break;
}
break;
case 1:
switch(_a.type)
{
case 67:
if(b5_.channel.updateStatus_(67))
{
this.syncChannelStatus_(b1_);
}
break;
case 78:
b2_ = this.layers_.get(b1_);
b2_.updatePacket_({type:78,data:_a.data});
var b28_ = this.bytesPacket_.decode_(_a.data).data;
var b29_ = b28_.seq;
try{
var b30_ = this.layers_.get(b1_).getP_(b29_);
if(!b30_){
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,无法找到对应消息P，忽略", this.tag_));
break;
}
var Pb5_ = this.bytesPacket_.decode_(b30_).data;
if(Math.abs(Pb5_.ts-b28_.ts)>1000)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,找到对应消息P，但是时间戳超出范围", this.tag_));
break;
}
b5_.channel.send_({type:"raw",data:b30_});
}
catch(e)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,error({1})", this.tag_,e||e.toString()));
}
break;
case 81:
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})layer({3})接到消息Q", this.tag_,this.id,this.level,b1_));
b2_ = this.layers_.get(b1_);
b2_.updatePacket_({type:81,data:_a.data});
if(b5_.channel.updateStatus_(81))
{
this.syncChannelStatus_(b1_);
}
if(b5_.channel.label_.indexOf("@VIR")>-1){
break;
}
var b6_ = this.bytesPacket_.decode_(_a.data).data;
var b30_;
var b7_ = this.layers_.get(0).cachePacket_.get(77);
var b9_ = this.layers_.get(0).cachePacket_.get(85);
var b36_=false,sendU_=false;
if(b7_&&b7_.isActive_()) {
b36_ = true;
b5_.channel.send_({type: "raw", data: b7_.data});
}
if(b1_!=0)
{
b30_ = b2_.getP_(b6_.seq);
if(b30_) {
b5_.channel.send_({type: "raw", data: b30_});
}
var b37_=b5_.channel.context_.negPacket_.maxlayerCount_;
var b38_ = this.layers_.get(0);
var b39_=b5_.id.split(":");
var b40_ = Number(b39_[2])-b1_*(1024/b37_);
var b41_ = this.strings_.format("{0}:{1}:{2}",b39_[0],b39_[1],b40_);
if(b38_.unsyncChannels_.indexOf(b41_)>-1) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})接到消息Q，发送U消息到({3})", this.tag_,this.id,this.level,b41_));
if(b9_&&b9_.isActive_()){
sendU_ = true;
b4_=this.ssrcChannel_.getChannelById_(b41_);
if(b4_) {
b4_.send_({type: "raw", data: b9_.data});
}
}
}
}
if((b1_==0&&b36_&&sendU_)||(b1_!=0&&b36_))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync 发送了M({1})U({2})", this.tag_,b36_,sendU_));
}
break;
case 84:
b2_ = this.layers_.get(b1_);
b2_.updatePacket_({type:84,data:_a.data});
b5_.channel.unavailbleTimes_=0;
if(b5_.channel.updateStatus_(84))
{
this.syncChannelStatus_(b1_);
}
var b15_ = this.bytesPacket_.decode_(_a.data).data;
var b14_ = b2_.getH_(b15_.seq);
var b7_ = this.layers_.get(0).cachePacket_.get(77);
var b9_ = this.layers_.get(0).cachePacket_.get(85);
var b36_=false,sendU_=false;
if(b7_&&b7_.isActive_())
{
b36_ = true;
b5_.channel.send_({type:"raw",data:b7_.data});
}
if(b1_!=0)
{
if(b14_)
{
b5_.channel.send_({type:"raw",data:b14_});
}
if(b9_&&b9_.isActive_()){
sendU_ = true;
b5_.channel.send_({type:"raw",data:b9_.data});
}
}
if((b1_==0&&b36_&&sendU_)||(b1_!=0&&b36_))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync 发送了M({1})U({2})", this.tag_,b36_,sendU_));
}
break;
}
break;
}
},

getChannelRTT_:function(_a)
{
var b_;
if(!this.layers_.find(_a))
{
return 0;
}
b_ = this.layers_.get(_a);
var b1_ = b_.channelId_;
if(b1_==null)
{
return 0;
}
return this.ssrcChannel_.getChannelById_(b1_).context_.uRTT_;
},
syncChannelStatus_:function(_a)
{
if(!this.layers_.find(_a))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncChannelStatus layer({1})不存在，无法更新同步状态！", this.tag_,_a));
return;
}
var b_ = this.layers_.get(_a);
if(b_.unsyncChannels_.length>0)
{
var b1_=0;
var b2_=0;
var b3_=0;
var b4_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_a});
for(var i=0;i<b4_.length;i++)
{
metaChannel_=this.ssrcChannel_.getChannelById_(b4_[i]);
if(metaChannel_)
{
if(metaChannel_.syncStatus_==67)
{
b2_++;
}
else if(metaChannel_.syncStatus_==84)
{
b1_++;
}
else if(metaChannel_.syncStatus_==81)
{
b3_++;
}
}
}
var b5_ = 0,secondarystatus_ = 0;
if(b3_>0)
{
b5_ = 81;
secondarystatus_ = 84;
}
else if(b1_>0)
{
b5_ = secondarystatus_ =  84;
}
else
{
b5_ = secondarystatus_ = 67;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::syncChannelStatus layer({1})已同步状态变更C({2})Q({3})T({4}),sync({5})", this.tag_,_a,b2_,b3_,b1_,b_.syncChannels_.join(",")));
if(b_.syncChannels_.length>0)
{
var b6_,b7_;
for(var i=0;i<b_.syncChannels_.length;i++)
{
metaChannel_=this.ssrcChannel_.getChannelById_(b_.syncChannels_[i]);
if(metaChannel_)
{
if(b_.syncChannels_[i]==b_.channelId_)
{
b7_ = b5_;
}
else
{
b7_ = secondarystatus_;
}
if(b7_>0&&b7_!=metaChannel_.syncStatus_)
{
metaChannel_.updateStatus_(b7_);
metaChannel_.send_(this.getMessageByType_(b7_));
}
}
}
}
}
},
getMainChannelPeer_:function()
{
if(!this.layers_.find(0))
{
return null;
}
var layer_ = this.layers_.get(0);
var channel_ = this.ssrcChannel_.getChannelById_(layer_.channelId_);
if(channel_)
{
return channel_.peerId_;
}
return null;
},
checkSyncStatus_:function()
{
var mylayer_,reload_ = false;
for(var i=0;i<this.layers_.length;i++)
{
mylayer_ = this.layers_.elements_[i].key;
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
if(this.layers_.get(mylayer_).syncChannels_<this.relaysyncMin_)
{
reload_ = true;
this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:0});
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
if(this.layers_.get(mylayer_).syncChannels_<this.servingsyncMin_)
{
reload_ = true;
this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:0});
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
if(this.layers_.get(mylayer_).unsyncChannels_<this.sourcingunsyncMin_)
{
reload_ = true;
this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:1});
}
break;
}
if(reload_){break;}
}
},
getMoreChannel_:function(_a)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel ssrc({1}-{2})获取更多资源需求处理", this.tag_,this.id,this.level));
var b_,b1_,b2_;
var b3_ = this.layers_.get(_a.layer_);
var b4_ = this.manager_.controller_.webrtc_.peers_;
if(b3_&&b3_.route_)
{
var b5_ = b3_.route_.rtt-(this.global_.getMilliTime_()-b3_.route_.start);
if(b5_>0)
{
var b6_ = b3_.route_.route;
if(route_)
{
b_ = b6_.split("*")[0];
if(b4_.find(b_))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})满足需求1重新协商", this.tag_,b_));
b4_.get(b_).channel_.sendNeg_(true);
return;
}
}
}
}
var b7_ = this.ssrcChannel_.getChannelByType_({level:_a.level_,layer:_a.layer_});
for(var i=0;i<b4_.length;i++)
{
b1_ = b4_.elements_[i].value;
if(_a.type==0&&b7_.indexOf(b1_.peerId_)==-1)
{
b2_ = b1_.channel_.remoteOwned_;
for(var j=0;j<b2_.length;j++)
{
if(b2_[j].id==this.id&&b2_[j].peerId!=b1_.id_&&b2_[j].peerId!=b1_.peerId_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})level({2})满足需求2重新协商", this.tag_,b1_.peerId_,_a.level_));
b1_.channel_.sendNeg_(true);
return;
}
}
}
if(_a.level_==1&&b7_.indexOf(b1_.peerId_)==-1)
{
if(b1_.id!=this.getMainChannelPeer_())
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})满足需求3重新协商", this.tag_,b1_.peerId_));
b1_.channel_.sendNeg_(true);
return;
}
}
}
this.manager_.controller_.OnTryResolveQuery_(this.id);
},
isMainChannel_:function(_a)
{
var b_ = false;
var b1_ = this.layers_.get(_a.layer_).channelId_;
var b2_ = _a.syncStatus_;
if(b1_==null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::isMainChannel ssrc({1}-{2})layer({3})主Channel不存在", this.tag_,this.id,this.level,_a.layer_));
}
if(b1_==_a.id_)
{
b_ = true;
}
return {level:_a.level_,id:_a.id_,status:b2_,main:b_,channel:_a};
},
relayMessage_:function(_a)
{
var b_ = _a.layer;
for(var l=0;l<b_.length;l++)
{
var b1_ = this.layers_.get(b_[l]);
var b2_ = _a.level == 0?b1_.syncChannels_:b1_.unsyncChannels_;
if(b2_.length==0)
{
continue;
}
var b3_,b4_,b5_,b6_;
for(var i=0;i<b2_.length;i++)
{
b6_ = b2_[i];
b3_ = this.ssrcChannel_.dataChannels_.get(b6_);
if(b3_)
{
b5_ = b3_.syncStatus_;
b4_=false;
if(_a.hasOwnProperty("status"))
{
for(var j=0;j<_a.status.length;j++)
{
if(b5_==_a.status[j])
{
b4_=true;
}
}
}
else
{
b4_=true;
}
if(b4_)
{
var b7_ = rc$.com.relayCore.utils.Number.convertToValue_('1', _a.data, 0);
if(this.config_.prints_.indexOf(b7_)>-1)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::relayMessage ssrc({1}-{2}) level({3})转发消息({4})给({5})。", this.tag_,this.id,this.level,_a.level==0?"已同步":"需同步",b7_,b6_));
}
b3_.send_({type:"raw",data:_a.data});
}
}
}
}
},
onSSRCClose_:function()
{
var ssrc_,channels_,metaChannel_;
switch(this.level)
{
case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
ssrc_ = this.manager_.getSSRCById_({id:this.id,level:"serving"});
if(!ssrc_)
{
channels_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@SYNC"});
for(var i=0;i<channels_.length;i++)
{
metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
if(metaChannel_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCClose_ 关闭频道({1})！",this.tag_,channels_[i]));
metaChannel_.close_();
}
}
if(this.manager_.channels_.find(this.id))
{
this.manager_.channels_.remove(this.id);
}
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
ssrc_ = this.manager_.getSSRCById_({id:this.id,level:"relay"});
if(!ssrc_)
{
channels_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@SYNC"});
for(var i=0;i<channels_.length;i++)
{
metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
if(metaChannel_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCClose_ 关闭频道({1})！",this.tag_,channels_[i]));
metaChannel_.close_();
}
}
if(this.manager_.channels_.find(this.id))
{
this.manager_.channels_.remove(this.id);
}
}
break;
case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
break;
}
this.manager_.closeSSRCById_({id:this.id,level:this.level});
},
checkPacket_:function()
{
var myactive_ = false;
if(this.layers_.find(0))
{
var cache_ = this.layers_.get(0).cachePacket_;
if(cache_)
{
var Mb_ = cache_.get(77);
var Ub_ = cache_.get(85);
if(Mb_&&Mb_.active_&&Ub_&&Ub_.active_)
{
myactive_ = true;
}
}
if(!myactive_)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkPacket M或者U过期。发送Q ", this.tag_));
var Qb_ = this.bytesPacket_.encode_({type:81});
this.relayMessage_({layer:[0],level:0,data:Qb_});
}
}
},
getMessageByType_:function(_a,_a1)
{
var b_={type:_a};
if(_a1)
{
rc$.apply(b_,_a1);
}
switch(_a){
case 72:
break;
case 67:
break;
case 78:
break;
case 80:
break;
case 81:
break;
case 84:
break;
case 77:
break;
case 85:
break;
case 82:
}
return {type:"byte",data:b_};
},
getRoute_:function(_a)
{
var b_,b1_,b2_;
if(!_a)
{
_a = 0;
}
if(this.layers_.find(_a))
{
b_ = this.layers_.get(_a).channelId_;
if(!b_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::getRoute ssrc({1}:{2})layer(0)主channel不存在！", this.tag_,this.id,this.level));
return null;
}
b2_ = this.ssrcChannel_.getChannelById_(b_);
if(!b2_)
{
return null;
}
if(b2_.label_.indexOf("@VIR")>-1)
{
b1_ = b2_.getRoute_({id:this.id});
}
else
{
b1_ = b2_.context_.negPacket_.getRoute_({id:this.id});
}
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::getRoute ssrc({1}:{2})路由信息({3})！", this.tag_,this.id,this.level,JSON.stringify(b1_)));
}
return b1_;
},
broad_:function()
{
if(this.id)
{
var id_ = this.strings_.format("{0}:{1}",this.id,this.level);
this.manager_.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypeChannel,data:id_});
}
},

close_:function()
{
this.id=null;
this.channel=null;
this.spc=null;
this.level="";
this.sdp=null;
if(this.checkSyncId_>0){clearInterval(this.checkSyncId_);}
if(this.checkPacketId_>0){clearInterval(this.checkPacketId_);}
if(this.virTimeoutId_>0){clearTimeout(this.virTimeoutId_);}
if(this.sendCID_>0){clearInterval(this.sendCID_);}
this.timestamp_=0;
this.routeIndex_=-1;
this.activeTime_=-1;
this.manager_=null;
this.dataChannels_=null;
this.sessionPeers_=null;
this.layers_=null;
this.global_=null;
this.strings_=null;
}
});
rc$.com.relayCore.ssrcs.Layer = JClass.extend_({
context_:null,
layer_:-1,
cachePacket_:null,
channelId_:null,
route_:null,
syncChannels_:null,
unsyncChannels_:null,
checkId_:-1,

lossSeq_:-1,
lossSeqs_:null,
loss_:0,

checkInterval_:30*1000,
bytesPacket_:null,
relaySpc_:null,
tag_:"com::relayCore::ssrcs::Layer",

init:function(_a,_a1)
{
this.context_ = _a;
this.layer_ = _a1;
this.checkInterval_ = this.context_.config_.messageExpiredTime_?this.context_.config_.messageExpiredTime_:30*1000;
this.cachePacket_ = new rc$.com.relayCore.utils.Map();
this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
this.spc_ = null;
this.route_ = null;
this.syncChannels_=[];
this.unsyncChannels_=[];
this.lossSeqs_=[];
},
startCheck_:function()
{
if(this.checkId_>0)
{
clearInterval(this.checkId_);
this.checkId_ = -1;
}
var callBack_ = this.checkExpired_.bind(this);
this.checkId_ = setInterval(callBack_,this.checkInterval_);
},
updatePacket_:function(_a)
{
var b_ = _a.type;
var b1_;
if(this.cachePacket_.find(b_))
{
b1_ = this.cachePacket_.get(b_);
b1_.update_(_a);
return;
}
b1_ = new rc$.com.relayCore.ssrcs.CacheData(this);
b1_.update_(_a);
this.cachePacket_.set(b_,b1_);
},
getP_:function(_a)
{
var b_ = this.cachePacket_.get(80);
if(!b_||!b_.data)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getP P消息为空！",this.tag_));
return null;
}
if(!_a||_a<0)
{
_a = b_.seq_;
}
if(!b_.data||!b_.data.find(_a))
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getP seq({1})的消息不存在！",this.tag_,_a));
return null;
}
return b_.data.get(_a);
},
getH_:function(_a)
{
var b_ = this.cachePacket_.get(80);
var b1_ = this.cachePacket_.get(72);
var b2_,b3_;
b3_=_a;
if(b1_&&b1_.data)
{
if(!_a)
{
b3_ = b1_.b3_;
}
b2_ = b1_.data.get(b3_);
}
if(b_&&b_.data)
{
if((b2_&&b1_.timestamp_<b_.timestamp_)||!b2_)
{
if(!_a)
{
b3_ = b_.b3_;
}
b2_ = b_.data.get(b3_);
if(b2_)
{
b2_ = this.bytesPacket_.decode_(b2_).data;
b2_.type = 72;
b2_.payload=0;
b2_ = this.bytesPacket_.encode_(b2_);
}
}
}
return b2_;
},
rollBack_:function(_a)
{
if(this.lossSeq_>_a)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::rollBack 重置lossSeq_({1})->({2})", this.tag_,this.lossSeq_,_a));
this.lossSeq_=_a;
}
var b_ = this.lossSeqs_.indexOf(_a);
if(b_>-1)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::rollBack channel({1})序列号({2})丢包记录", this.tag_,this.channelId_,_a));
this.loss_++;
this.broad_("loss",{loss:this.loss_,seq:_a});
var b1_ = this.context_.ssrcChannel_.getChannelById_(this.channelId_);
if(b1_)
{
b1_.lossP_++;
}
this.lossSeqs_.splice(b_,1);
return;
}
},
checkLoss_:function(_a)
{
var b3_,b1_,b2_,b3_,b4_,b5_=0,ts_,newb5_=[];
b1_ = this.bytesPacket_.decode_(_a).data;
var b6_ = this.lossSeqs_.indexOf(b1_.seq);
if(b6_>-1)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkLoss 接收到丢包序列号({1})", this.tag_,b1_.seq));
this.lossSeqs_.splice(b6_,1);
return [];
}
if(this.cachePacket_.find(80))
{
b3_ = this.getP_(this.lossSeq_);
if(!b3_)
{
return [];
}
b3_ = this.bytesPacket_.decode_(b3_).data;
if(this.lossSeq_>b3_.seq)
{
return [];
}
this.lossSeq_ = b1_.seq;
b2_=b3_?b3_.seq:-1;
b3_=b1_.seq;
if(b2_>b3_){
return [];
}
if((b2_+1)<b3_)
{
b5_ = b3_-b2_-1;
for(var i=b2_+1;i<b3_;i++)
{
ts_ = (b1_.ts-b3_.ts)*(i-b2_)/b5_+b3_.ts;
newb5_.push({ts:ts_,seq:i});
this.lossSeqs_.push(i);
}
}
}
return newb5_;
},
checkExpired_:function()
{
var Mb_,Ub_,Qb_;
if(this.cachePacket_.find(77))
{
Mb_ = this.cachePacket_.get(77);
}
if(this.cachePacket_.find(85))
{
Ub_ = this.cachePacket_.get(85);
}
var Mex_=true;
var Uex_=true;
if(Mb_)
{
Mex_ = Mb_.isActive_();
}
if(Ub_)
{
Uex_ = Ub_.isActive_();
}
if(!Uex_||!Mex_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::checkExpired 消息M({1})U({2})",this.tag_,Mex_?"有效":"过期",Uex_?"有效":"过期"));
Qb_ = this.bytesPacket_.encode_(this.context_.getMessageByType_(81).data);
this.context_.relayMessage_({layer:[0],level:0,data:Qb_});
}
},
broad_:function(_a,_a1)
{
var b_ = this.context_.strings_.format("{0}:{1}:{2}",this.context_.id,this.context_.level,this.layer_);
this.context_.manager_.broadcast_.channelMessage_(b_,_a,_a1);
},
close_:function()
{
if(this.checkId_>0){clearInterval(this.ckeckId_);}
this.bytesPacket_ = null;
this.context_=null;
this.cachePacket_=null;
this.channelId_=null;
this.syncChannels_=[];
this.unsyncChannels_=[];
}
});
rc$.com.relayCore.ssrcs.CacheData = JClass.extend_({
type:null,
data:null,
activeTime_:0,
global_:null,
bytesPacket_:null,
context_:null,
timestamp_:-1,
sdpHash_:null,
sdp_:null,
seq_:-1,
active_:false,
maxCache_:100,
maxCacheSeq_:null,
total_:0,
successTotal_:0,
tag_:"com.relayCore::ssrcs::CacheData",

init:function(_a)
{
this.context_ = _a;
this.global_ = rc$.com.relayCore.utils.Global;
this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
this.activeTime_ = this.global_.getMilliTime_();
this.maxCacheSeq_=[];
this.data=null;
},
update_:function(_a)
{
this.activeTime_ = this.global_.getMilliTime_();
this.type=_a.type;
var b_ = _a.data;
this.total_++;
switch(this.type)
{
case 85:
var b1_={};
var b2_ = this.bytesPacket_.decode_(b_).data;
if(!b2_.payload)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::update U({1})消息的载荷为空！",this.tag_,JSON.stringify(b2_)));
break;
}
this.successTotal_++;
var b3_ = JSON.parse(b2_.payload);
if(this.data != null)
{
var b4_ = this.bytesPacket_.decode_(this.data).data;
b1_ = JSON.parse(b4_.payload);
}
for(var i in b3_)
{
switch(i)
{
case "SPC":
b1_[i] = b3_[i];
if(this.context_.context_.level == rc$.com.relayCore.ssrcs.SyncLevel.SERVING)
{
b1_[i] = this.context_.context_.spc;
}
break;
case "PackLossRate":
var b5_ = b1_.PackLossRate?b1_.PackLossRate:0;
var b6_ = 1-(1-b5_)*(1-b3_[i]);
b1_.PackLossRate = b6_;
break;
case "RTT":
var b7_ = b1_.RTT+b3_[i];
b1_.RTT = b7_;
break;
case "Jitter":
b1_[i] = b3_[i];
break;
case "SDP":
b1_[i] = b3_[i];
this.sdp_ = b3_[i];
this.timestamp_ = b2_.ts;
break;
default:
break;
}
}
b2_.payload_ = JSON.stringify(b1_);
this.data = this.bytesPacket_.encode_(b2_);
break;
case 72:
case 80:
if(this.data==null)
{
this.data=new rc$.com.relayCore.utils.Map();
}
var b8_ = this.bytesPacket_.decode_(b_).data;
var b9_ = 0;
if(this.timestamp_<b8_.ts||(this.timestamp_==b8_.ts&&(this.seq_<b8_.seq||(this.seq_==255&&b8_.seq==0))))
{
b9_ = 2;
}
else if(!this.data.find(b8_.seq))
{
b9_ = 1;
}
if(b9_>0)
{
this.successTotal_++;
if(this.type==72&&b8_.type==80)
{
b8_.type=72;
b8_.payload = null;
b_ = this.bytesPacket_.encode_(b8_);
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::update 缓存H,P->H！",this.tag_,b_));
}
if(this.data.length>this.maxCache_)
{
var b10_ = this.maxCacheSeq_.shift();
this.data.remove(b10_.seq);
if(this.type==80)
{
this.context_.broad_("P",{type:"remove",num:b10_.seq});
}
}
this.data.set(b8_.seq,b_);
this.maxCacheSeq_.push({"type":this.type,"seq":b8_.seq,"ts":b8_.ts});
this.maxCacheSeq_.sort(function(a,b){
if(a.ts-b.ts==0)
{
if(a.seq<b.seq)
{
return a.seq-b.seq
}
else
{
return b.seq-a.seq
}
}
return a.ts-b.ts
});
if(b9_>1){
if(this.type==80)
{
this.context_.broad_("P",{type:"add",num:b8_.seq});
if(this.context_.tag_=="com::relayCore::ssrcs::Layer")
{
this.context_.rollBack_(b8_.seq);
}
}
this.timestamp_ = b8_.ts;
this.seq_ = b8_.seq;
}
else
{
this.context_.broad_("P",{type:"insert",num:b8_.seq});
}
}
break;
case 77:
var b11_,b12_;
b12_ = this.bytesPacket_.decode_(b_).data;
if(b12_.ts<=this.timestamp_)
{
break;
}
this.successTotal_++;
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::update_ 接到消息M。时间({1})>({2})，更新", this.tag_,b12_.ts,this.timestamp_));
this.active_ = true;
this.timestamp_ = b12_.ts;
b11_ = this.bytesPacket_.decode_(b12_.payload).data;
this.sdpHash_ = b11_.SDPHash;
this.data = b_;
break;
default:
this.successTotal_++;
this.data = b_;
break;
}
if(this.context_.tag_=="com::relayCore::ssrcs::Layer")
{
this.context_.broad_("layer-message",{type:this.type,success:this.successTotal_,total:this.total_});
}
},
getSEQ_:function(_a)
{
var b_ = this.data.keys();
b_.sort();
var b1_=-1;
var b2_;
b2_ = this.bytesPacket_.decode_(this.data.get(b_[b_.length-1])).data;
if(b2_.ts<_a)
{
return -1;
}
for(var i=b_.length-2;i>0;i--)
{
b2_ = this.bytesPacket_.decode_(this.data.get(b_[i])).data;
if(b2_.ts<_a)
{
break;
}
b1_ = b2_.seq;
}
return b1_;
},
isActive_:function()
{
return this.active_;
},
check_:function(_a)
{
this.active_ = true;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::check 校验SDP({1}),SDPHash({2})！",this.tag_,_a,this.sdp_));
}
});
rc$.com.relayCore.ssrcs.Manager = JClass.extend_({
ssrcs_:null,
channels_:null,
config_:null,
global_:null,
controller_:null,
broadcast_:null,
strings_:null,

tag_:"com:ssrcs::Manager",

init:function(_a)
{
this.controller_ = _a;
this.ssrcs_ = new rc$.com.relayCore.utils.Map();
this.channels_ = new rc$.com.relayCore.utils.Map();
this.config_ = rc$.com.relayCore.vo.Config;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
},
addSSRC_:function(_a)
{
if(!_a)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSSRC 添加资源错误",this.tag_));
return null;
}
var b_ = this.strings_.format("{0}:{1}",_a.id,_a.level?_a.level:"relay");
if(this.ssrcs_.find(b_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSSRC 存在SSRC媒体流id({1})",this.tag_,b_));
return this.ssrcs_.get(b_);
}
if(!this.channels_.find(_a.id))
{
var b1_ = new rc$.com.relayCore.ssrcs.Channel(this);
this.channels_.set(_a.id,b1_);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSSRC 添加新的ChannelMap id({1})",this.tag_,_a.id));
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSSRC 添加新的SSRC媒体流 id({1})",this.tag_,b_));
var b2_ = new rc$.com.relayCore.ssrcs.SSRC(this,_a);
this.ssrcs_.set(b_,b2_);
b2_.initializeServing_();
this.broad_({type:"add",ssrc:b2_});
if(_a.level!="relay")
{
this.onSSRCUpdate_();
}
return b2_;
},
stopSSRC_:function(_a)
{
var b_ = this.strings_.format("{0}:{1}",_a.id,_a.level);
if(this.ssrcs_.find(b_))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} stopSSRC 停止SSRC({1})！",this.tag_,b_));
var b1_ = this.ssrcs_.get(b_);
b1_.stop_(_a);
}
},
addChannel_:function(_a)
{
var b_ = _a.label_;
var b1_ = b_.split(":")[1];
var b2_;
var b3_ = this.strings_.format("{0}:{1}",b1_,"sourcing");
var b4_ = this.strings_.format("{0}:{1}",b1_,"relay");
if(!this.channels_.find(b1_)||(b_.indexOf("@SYNC")>-1&&_a.level_==1&&this.ssrcs_.find(b3_)&&this.ssrcs_.find(b4_)))
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel 频道所在ssrc({1})不存在！创建relay级别资源",this.tag_,_a.id_));
var b5_ = _a.getSYNC_();
var b6_ = {};
rc$.apply(b6_,b5_);
b6_.level="relay";
b2_ = this.addSSRC_(b5_);
if(b2_==null)
{
return;
}
}
var b7_ = this.channels_.get(b1_);
b7_.addChannel_(_a);
if(b2_!=null)
{
this.onSSRCUpdate_();
}
},
removeChannel_:function(_a)
{
var b_ = _a.label_.split(":")[1];
if(!this.channels_.find(b_))
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::removeChannel 删除频道Channel({1})不存在！",this.tag_,b_));
return;
}
var b1_ = this.channels_.get(b_);
b1_.removeChannel_(_a);
},
testSourcingSS_:function(_a)
{
var b_ = _a.id;
var b1_ = Number(_a.type);
var b2_ = _a.message;
var b3_ = this.strings_.format("{0}:{1}",_a.id,"sourcing");
if(!this.ssrcs_.find(b3_))
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::testSourcingSS SSRC({1})不存在！",this.tag_,b3_));
return;
}
var b4_ = 1+b2_.layer*2;
var b5_ = this.strings_.format("{0}:{1}:{2}",1,_a.id,b4_);
var b6_ = this.channels_.get(b_).getChannelById_(b5_);
if(!b6_)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::testSourcingSS 虚拟频道({1})不存在！",this.tag_,b5_));
return;
}
var b7_;
if(b1_==80)
{
b7_ ={
type:b1_,
ts:b2_.ts?b2_.ts:0,
seq:b2_.seq?b2_.seq:0,
payload:b2_.payload?b2_.payload:0,
};
}
else
{
b7_ ={
type:b1_,
Layers:b2_.layer?b2_.layer:0
};
}
var b8_ = rc$.com.relayCore.webrtc.packets.BytesPacket.encode_(b7_);
b6_.onMessage_(b8_);
},
getChannelById_:function(_a)
{
if(!this.channels_.find(_a))
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getChannelById 请求ssrc({1})dataChannel不存在！",this.tag_,_a));
return null;
}
return this.channels_.get(_a);
},
getSSRCById_:function(_a)
{
var b_ = this.strings_.format("{0}:{1}",_a.id,_a.level);
return this.ssrcs_.get(b_);
},
closeSSRCById_:function(_a)
{
var b_ = this.strings_.format("{0}:{1}",_a.id,_a.level);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} closeSSRCById 关闭SSRC({1})！",this.tag_,b_));
if(this.ssrcs_.find(b_))
{
var b1_ = this.ssrcs_.get(b_);
b1_.close_();
this.ssrcs_.remove(b_);
this.onSSRCUpdate_();
this.controller_.OnSSRCClose_(_a);
this.broad_({type:"remove",id:b_});
}
},
receiveMessage_:function(_a)
{
var b_ = _a.channel.label_.split(":");
var b1_ = b_[1];
var b2_ = "";
var b3_;
for(var i in rc$.com.relayCore.ssrcs.SyncLevel)
{
b2_ = rc$.com.relayCore.ssrcs.SyncLevel[i];
b3_=this.strings_.format("{0}:{1}",b1_,b2_);
if(this.ssrcs_.find(b3_))
{
this.ssrcs_.get(b3_).onStreamSync_(_a);
}
}
},
onSSRCUpdate_:function()
{
var mypeers_ = this.controller_.webrtc_.peers_;
var peer_;
for(var i=0;i<mypeers_.length;i++)
{
peer_ = mypeers_.elements_[i].value;
peer_.channel_.onSSRCUpdate_();
}
},
broad_:function(_a)
{
this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypeSSRC,data:_a});
}
});
rc$.com.relayCore.ssrcs.Channel = JClass.extend_({
dataChannels_ : null,
context_:null,
methodMap_:null,
strings_:null,
tag_:"com::relayCore::ssrcs::Channel",

init:function(_a)
{
this.context_ = _a;
this.strings_ = rc$.com.relayCore.utils.String;
this.dataChannels_ = new rc$.com.relayCore.utils.Map();
this.methodMap_ = new rc$.com.relayCore.utils.Map();
},
addChannel_:function(_a)
{
if(this.dataChannels_.find(_a.id_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} addChannel 存在peerId({1}),mappedId({2}) channel",this.tag_,_a.peerId_,_a.cid_));
return;
}
this.dataChannels_.set(_a.id_,_a);
this.excuteMethod_("onAdd",_a);
},
removeChannel_:function(_a)
{
if(this.dataChannels_.find(_a.id_))
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} removeChannel 删除dataChannels中id({1})的channel",this.tag_,_a.id_));
this.dataChannels_.remove(_a.id_);
this.excuteMethod_("onRemove",_a);
}
},
excuteMethod_:function(_a,_a1)
{
if(this.methodMap_.find(_a))
{
var b_ = this.methodMap_.get(_a);
for(var i=0;i<b_.length;i++)
{
b_[i](_a1);
}
}
},
registerMethod_:function(_a)
{
if(!this.methodMap_.find(_a.name))
{
this.methodMap_.set(_a.name,[]);
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::registerMethod 注册一个({1})回调方法",this.tag_,_a.name));
this.methodMap_.get(_a.name).push(_a.body);
},
getChannelById_:function(_a)
{
return this.dataChannels_.get(_a);
},

getChannelByType_:function(_a)
{
var b_=[];
var b1_,b2_,b3_,b4_;
for(var i=0;i<this.dataChannels_.length;i++)
{
key_ = this.dataChannels_.elements_[i].key;
b1_ = this.dataChannels_.elements_[i].value;
b2_ = b1_.label_;
b4_ = b1_.level_;
b3_ = b1_.layer_;
if(_a.hasOwnProperty("type"))
{
if(b2_.indexOf(_a.type)==-1)
{
continue;
}
}
if(_a.hasOwnProperty("level"))
{
if(b4_!=_a.level)
{
continue;
}
}
if(_a.hasOwnProperty("layer"))
{
if(b3_!=_a.layer)
{
continue;
}
}
b_.push(key_);
}
return b_;
},
});
rc$.com.relayCore.ssrcs.VirtualChannel = JClass.extend_({
id_:null,
label_:null,
from_:0,
layer_:0,
peerId_:"",
cid_:1,
callback_:null,
level_:-1,
context_:null,
bytesPacket_:null,
cachePacket_:null,
lossP_:0,
unavailableTimes_:0,

syncStatusId_:-1,
syncStatusInterval_:300*1000,
syncStatus_:67,
sendSeqs_:null,

route_:null,
broadcast_:null,
tag_:"com::relayCore::ssrcs::VirtualChannel",
init:function(_a,_a1)
{
this.context_=_a;
this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
this.cachePacket_ = new rc$.com.relayCore.utils.Map();
this.setParams_(_a1);
this.sendSeqs_=[];
this.level_ = (this.from_+this.cid_)%2;
},
setParams_:function(_a)
{
for(var i in _a)
{
this[(i+"_")]=_a[i];
}
},
onOpen_:function()
{
if(this.level_==0)
{
this.callback_ = this.context_.options.callback;
}
else
{
this.syncStatus_ = 81;
this.sendServingQ_();
}
},
sendServingQ_:function()
{
var ext_ = {};
var packet_ = {type:81,ext:JSON.stringify(ext_)};
var Qb_ = this.bytesPacket_.encode_(packet_);
this.onMessage_(Qb_);
},
getSDP_:function()
{
return "";
},
redoSend_:function(_a,_a1)
{
if(this.sendSeqs_.indexOf(_a1)>-1)
{
return;
}
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})发现丢包seq({2}),发送N", this.tag_,this.label_,_a1));
this.sendSeqs_.push(_a1);
this.send_(_a);
},
send_:function(_a)
{
var b_ = _a.type;
var b1_=_a.data;
var b2_=0;
if(this.callback_)
{
switch(b_)
{
case "json":
b1_ = JSON.stringify(_a.data);
b2_=0;
break;
case "byte":
b1_ = this.context_.bytesPacket_.encode_(_a.data);
b2_=_a.data.type?_a.data.type:_a.data.status;
break;
default:
b2_=rc$.com.relayCore.utils.Number.convertToValue_('1', _a.data,0);
break;
}
if(this.context_.config_.prints_.indexOf(b2_)>-1)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} ({1})layer({2})level({3})发送数据({4})给APP!",this.tag_,this.label_,this.layer_,this.level_,b2_));
}
this.broad_("send",b2_);
this.callback_(b1_,this.layer_);
}
},
getRoute_:function()
{
return {route:this.peerId,ttl:300*1000};
},
onMessage_:function(_a)
{
var b_ = rc$.com.relayCore.utils.Number.convertToValue_('1',new Uint8Array(_a),0);
this.broad_("receive",b_);
this.context_.onStreamSync_({type:b_,channel:this,data:_a});
},
timerOut_:function()
{
this.active_ = false;
},
updateStatus_:function(_a)
{
if(this.syncStatus_ != _a)
{
if(this.syncStatusId_>0)
{
clearTimeout(this.syncStatusId_);
this.closeId_ = -1;
}
this.syncStatus_ = _a;
if(this.syncStatus_==67)
{
var b_ = this.timerOut_.bind(this);
this.syncStatusId_ = setTimeout(b_,this.syncStatusInterval_);
}
this.broad_("syncStatus",this.syncStatus_);
}
},
getSYNC_:function()
{
return this.label_.split(":")[1];
},
updateLossSEQ_:function(_a)
{

},
updatePacket_:function(_a)
{
},
broad_:function(_a,_a1)
{
this.broadcast_.channelMessage_(this.id_,_a,_a1);
},
addUnavailbleTime_:function()
{
this.unavailableTimes_++;
this.send_({type:"byte",data:{type:this.syncStatus_}});
if(this.unavailableTimes_>this.context_.config_.unavailableMaxTimes_)
{
this.close_();
}
},
getH_:function(_a)
{
if(!this.cachePacket_.find(72))
{
return null;
}
var b_ = this.cachePacket_.get(72);
if(!_a&&b_.data.find(b_.seq_))
{
return b_.data.get(b_.seq_);
}
return b_.data.get(seq);
},
close_:function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} id({1}) close!",this.tag_,this.label_));
if(this.syncStatusId_>0){clearTimeout(this.syncStatusId_);}
this.context_.closeVirtualChannel_({label:this.id_,layer:this.layer_});
}
});
rc$.ns("com.relayCore.controller");
rc$.com.relayCore.controller.LMPN = JClass.extend_({
config_:null,
strings_:null,
global_:null,
webrtc_:null,
socket_:null,
ssManager_:null,
statics_:null,
OnPeerClose:null,
OnSSClose:null,
OnTryResolveQuery:null,
broadcast_:null,

tag_:"com::relayCore::player::Live",
live:null,

init:function()
{
this.config_ = rc$.com.relayCore.vo.Config;
this.strings_ = rc$.com.relayCore.utils.String;
this.global_ = rc$.com.relayCore.utils.Global;
this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
this.statics_ = new rc$.com.relayCore.statics.Statics(this);
if(arguments.length>0&&typeof(arguments[0]) == "object")
{
rc$.apply(this.config_,arguments[0]);
}
this.broadcast_.init_(this.config_.debugBarId);
rc$.com.relayCore.utils.Log.init(this.config_.logLevel, this.config_.logType, this.config_.logServer);
this.ssManager_ = new rc$.com.relayCore.ssrcs.Manager(this);
this.webrtc_ = new rc$.com.relayCore.webrtc.Manager(this);
this.webrtc_.open();
if(this.config_.auto)
{
if(rc$.com.relayCore.websocket)
{
this.socket_ = new rc$.com.relayCore.websocket.Manager(this);
this.socket_.createSession([{"name":"webrtc","url":this.config_.webrtcServerHost_}]);
}
}
},
syncSSRC:function(_a)
{
this.ssManager_.sycn(_a);
},
addPeer:function(_a)
{
this.webrtc_.addPeer(_a);
this.broad_(_a.id);
},
requetSS:function(_a)
{
var b_={
id:_a.id,
level:"serving",
channel:_a.channel,
callback:_a.callback
};
if(!b_.channel)
{
b_.channel=this.config_.channel_;
}
this.ssManager_.addSSRC_(b_);
},
stopRequetSS:function(_a)
{
var b_={
id:_a.id,
level:"serving",
layer:_a.layer,
channel:_a.channel,
scope:_a
};
this.ssManager_.stopSSRC_(b_);
},

sourcingSS:function(_a)
{
var b_={
id:_a.id,
level:"sourcing",
layer:_a.layer,
channel:_a.channel,
options:_a
};
this.ssManager_.addSSRC_(b_);
},
testSourcingSS:function(_a)
{
this.ssManager_.testSourcingSS_(_a);
},
stopSourcingSS:function(_a)
{
var b_={
id:_a.id,
level:"sourcing",
layer:_a.layer,
channel:_a.channel,
scope:_a
};
this.ssManager_.stopSSRC_(b_);
},
OnPeerClose_:function(_a)
{
if(this.OnPeerClose != null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} OnPeerClose 通知外部Peer({1})断开",this.tag_,_a));
this.OnPeerClose(_a);
}
},
OnSSRCClose_:function(_a)
{
if(this.OnSSClose != null)
{
this.OnSSClose(_a);
}
},
OnTryResolveQuery_:function(_a)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::OnTryResolveQuery_ ({1})重新获取新的外部数据", this.tag_,_a));
if(this.OnTryResolveQuery != null)
{
this.OnTryResolveQuery(_a);
}
},
broad_:function(_a)
{
if(this.broadcast_)
{
this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.RemoteID,data:_a});
}
}
});
rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.ManagerStatic = {
kTimerTypeTracker : 1,
kTimerTypeSession : 2,
kTimerTypeAsyncPeers : 3,
};

rc$.com.relayCore.websocket.Manager = JClass.extend_({
config_:null,
global_:null,
strings_:null,
opened_:false,
activeTime_:0,
id_:null,
sessions_:null,
trackerBeginQueryTime_:0,
status:false,
controller_:null,
sessionId_:null,
queryPeer_:null,
broadcast_:null,
tag_:"com::relayCore::websocket::Manager",

init : function(_controller) {
this.controller_ = _controller;
this.config_ = rc$.com.relayCore.vo.Config;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
this.sessions_ = new rc$.com.relayCore.utils.Map();
this.queryPeer_ = new rc$.com.relayCore.websocket.QueryPeer(this);
this.sessionId_ = [];
},

createSession : function(_sessionParams) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createSession params({1})", this.tag_,JSON.stringify(_sessionParams)));
if(typeof(_sessionParams) == "object")
{
var session_;
var sessionTag_;
for(var i=0;i<_sessionParams.length;i++)
{
sessionTag_ = _sessionParams[i];
if(this.sessions_.find(sessionTag_.name))
{
continue;
}
session_ = new rc$.com.relayCore.websocket.Session(this,sessionTag_.name);
session_.open_(sessionTag_.url);
if(sessionTag_.name=="webrtc")
{
this.config_.clientId = session_.id_;
this.queryPeer_.bindSession_(session_);
this.broad_({type:rc$.com.relayCore.broadcast.Types.RemoteID,data:session_.id_});
session_.bind_(this.queryPeer_);
}
this.sessions_.set(sessionTag_.name,session_);
}
}
return true;
},
getRtc:function()
{
return this.controller_.webrtc_;
},
getSessionByName:function(_a)
{
return this.sessions_.get(_a);
},
broad_:function(_a)
{
this.broadcast_.broad_(_a);
},
close : function() {
this.opened_ = false;
this.session_.close_();
}
});
rc$.com.relayCore.websocket.ManagerStatic = {
kTimerTypeTracker : 1,
kTimerTypeSession : 2,
kTimerTypeAsyncPeers : 3,
kTimerTypeOnRegister : 100,
kTimerTypeOnHeartBeat : 101,
kTimerTypeOnQueryPeerList : 102
};
rc$.com.relayCore.websocket.Session = JClass.extend_({

config_:null,
strings_:null,
global_:null,
manager_:null,
websocket:null,
opened_:false,
activeTime_:0,
id_:null,
status_:false,
name_:"",

onWebSocketOpenBinded_:null,
onWebSocketCloseBinded_:null,
onWebSocketMessageBinded_:null,
onWebSocketErrorBinded_:null,

tag_:"com::relayCore::webrtc::Session",
uir_:null,

init : function(_mgr,_name) {
this.manager_ = _mgr;
this.name_ = _name;
this.config_ = rc$.com.relayCore.vo.Config;
this.strings_ = rc$.com.relayCore.utils.String;
this.global_ = rc$.com.relayCore.utils.Global;
this.id_ = this.strings_.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
Math.floor(Math.random() * (1000 + 1)), this.global_.getMilliTime_());
},

send : function(_message) {
this.activeTime_ = this.global_.getMilliTime_();
this.websocket.send(_message);
},

open_ : function(_url,_type) {
this.opened_ = true;
this.activeTime_ = this.global_.getMilliTime_();
this.uir = _url;
if(_type)
{
this.uir = _url ;
}
try {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open webSocket: {1}", this.tag_,this.uir));
this.websocket = new WebSocket(this.uir);
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::open failed, exception: {1}", this.tag_,e));
return false;
}
this.bind_(this);
return true;
},
bind_:function(_a)
{
this.onWebSocketOpenBinded_ = _a.onWebSocketOpen_.bind(_a);
this.onWebSocketMessageBinded_ = _a.onWebSocketMessage_.bind(_a);
this.onWebSocketCloseBinded_ = this.onWebSocketClose_.bind(this);
this.onWebSocketErrorBinded_ = this.onWebSocketError_.bind(this);
this.websocket.onopen = this.onWebSocketOpenBinded_;
this.websocket.onclose = this.onWebSocketCloseBinded_;
this.websocket.onmessage = this.onWebSocketMessageBinded_;
this.websocket.onerror = this.onWebSocketErrorBinded_;
},
onWebSocketOpen_ : function(_evt) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onWebSocketOpen", this.tag_));
this.status_ = true;
if(this.name_ == "peer")
{

}
},
onWebSocketMessage_ : function(_message) {
if(this.name_ == "peer")
{

}
},
onWebSocketClose_ : function(_evt) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onWebSocketClose name({1})", this.tag_,this.name_));
this.status_ = false;
return true;
},
onWebSocketError_ : function(_evt) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onWebSocketError({1}), exception: {2}", this.tag_,this.name_,_evt.toString));
this.status_ = false;
return true;
},
close_ : function() {
this.status_ = false;
this.websocket.close();
this.websocket = null;
}
});
rc$.com.relayCore.websocket.QueryPeer = JClass.extend_({
webrtcServerInterval_:5*1000,
webrtcServerTimerId_ : -1,
id_:null,
webrtc_:null,
manager_:null,
global_:null,
strings_:null,
session_:null,
config_:null,
peers_:null,

tag_:"com::relayCore::websocket::QueryPeer",

init : function(_mgr) {
this.manager_ = _mgr;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.config_ = rc$.com.relayCore.vo.Config;
this.peers_ = new rc$.com.relayCore.utils.Map();
},
bindSession_:function(_a)
{
this.session_ = _a;
this.webrtc_ = this.manager_.getRtc();
this.webrtc_.id_ = this.id_ = this.session_.id_;
},
onWebSocketOpen_ : function(_evt) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start register webrtc server ({1}) ...",this.tag_, _evt.target.url));
this.register_();
},
onWebSocketMessage_ : function(_evt) {
var message_ = JSON.parse(_evt.data);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onWebSocketMessage tag({1})",this.tag_, message_.method));
switch (message_.method) {
case 'registerRequest':
this.onRegisterResponse_(message_);
break;
case 'proxyDataRequest':
this.onProxyDataRequest_(message_);
break;
default:
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::WebSocket unknown method: {1}",this.tag_, message_.method));
break;
}
},
register_:function()
{
var req_ = {
method : "registerRequest",
channel:"chenzhaofei",
id:this.id_,
localTime : this.global_.getMilliTime_()
};
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::register",this.tag_));

var callback_ = this.onRegisterTimeout_.bind(this);
this.webrtcServerTimerId_ = setTimeout(callback_, this.webrtcServerInterval_);
this.webrtc_.beginRegisterTime_ = this.global_.getMilliTime_();
this.sendMessage_(req_);
},
onRegisterResponse_ : function(_message) {
var mid_ = _message.id;
if(mid_ == this.id_)
{
if (this.webrtcServerTimerId_>0) {
clearTimeout(this.webrtcServerTimerId_);
this.webrtcServerTimerId_ = -1;
}
this.webrtc_.connectedTime_ = this.global_.getMilliTime_() - this.webrtc_.beginRegisterTime_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Register response success, peerid({1})",this.tag_, _message.id));
}
else
{
if(_message.channel=="chenzhaofei")
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::New Peer response success, peerid({1})",this.tag_, mid_));
this.createPeer_(mid_);
}

}
},
createPeer_:function(_a)
{
var b_ = new rc$.com.relayCore.websocket.Peer(this);
b_.fromServer_ = true;
b_.load({"id":this.id_,"remoteId":_a});
b_.connect();
params_={
id:this.id_,
remoteId:_a,
from:true,
peer:b_.peer_
};
this.peers_.set(params_.remoteId,b_);
this.manager_.controller_.addPeer(params_);
},
onProxyDataRequest_ : function(_message) {
if (typeof (_message.data) == 'string') {
_message.data = JSON.parse(_message.data);
}
var sid_ = _message.sendId;
var destId_ = _message.destPeerId;
var peerId_ = _message.peerId;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onProxyDataRequest selfId({1}),sendId({2}),connectionId({3}),peerId({4}))",this.tag_,this.id_,sid_,destId_,peerId_));
if(sid_ != this.id_ && this.id_ == peerId_)
{
this.onRemotePeerConnectRequest_(sid_, _message.data);
}
else if(destId_ == this.id_ && peerId_ == sid_)
{
this.onRemotePeerConnectResponse_(sid_, _message.data);
}
return;
},
onRemotePeerConnectRequest_ : function(_peerId, _message) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Receive a connect request from {1}",this.tag_, _peerId));
var mypeer_;
if(!this.peers_.find(_peerId))
{
mypeer_ = new rc$.com.relayCore.websocket.Peer(this);
}
else
{
mypeer_ = this.peers_.get(_peerId);
}
mypeer_.fromServer_ = false;
mypeer_.load2(_message);
mypeer_.id_ = this.id_;
mypeer_.remoteId_ = _peerId;
mypeer_.peerId_ = this.id_;
mypeer_.iceServers_ = _message.iceServers;
mypeer_.remoteIceCandidates_ = _message.iceCandidates;
mypeer_.remoteSdpDescriptions_ = _message.sdpDescriptions;
mypeer_.connect();
params_={
id:this.id_,
remoteId:_peerId,
from:false,
peer:mypeer_.peer_
};
this.peers_.set(_peerId,mypeer_);
this.manager_.controller_.addPeer(params_);
},
onRemotePeerConnectResponse_ : function(_peerId, _message) {
var isFind_ = this.peers_.find(_peerId);
var peer_;
if (!isFind_) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Receive a connect response from {1}, but not in the peers",this.tag_, _peerId));
return;
}
peer_ = this.peers_.get(_peerId);
peer_.load2(_message);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Recveive a connect response from {1}",this.tag_, _peerId));
peer_.acceptAnswer_(_message.iceCandidates, _message.sdpDescriptions);
},
onRegisterTimeout_:function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onRegisterTimeout thisId({1}) 注册超时！",this.tag_,this.id_));
clearTimeout(this.webrtcServerTimerId_);
this.webrtcServerTimerId_ = -1;
},
close : function() {
return true;
},
sendMessage_ : function(_message) {
if (typeof (_message) != 'string') {
_message = JSON.stringify(_message);
}
this.session_.send(_message);
}
});
rc$.com.relayCore.websocket.Peer = JClass.extend_({
config_:null,
global_:null,
strings_:null,
peer_ : null,
peerId_:null,
remoteId_:null,
id_ : null,
fromServer_ : false,

lastConnectTime_ : 0,
context_ : null,

localIceCandidates_ : null,
localSdpDescriptions_ : null,

remoteIceCandidates_ : null,
remoteSdpDescriptions_ : null,

iceOptions : null,
sdpOptions : null,
connecting_ : false,
connectionId_:"",
tag_:"com::relayCore::webrtc::Peer",

init:function(_a)
{
this.config_ = rc$.com.relayCore.vo.Config;
this.global_ = rc$.com.relayCore.utils.Global;
this.strings_ = rc$.com.relayCore.utils.String;
this.context_ = _a;
this.id_ = this.context_.id_;
this.connecting_ = false;
this.connectionId_ = "";
this.fromServer_ = false;
this.lastConnectTime_ = 0;
this.localIceCandidates_ = this.localIceCandidates_ || [];
this.remoteIceCandidates_ = this.remoteIceCandidates_ || [];
this.iceOptions = this.iceOptions || {
"optional" : []
};
this.sdpOptions = this.sdpOptions || {
'mandatory' : {
'OfferToReceiveAudio' : false,
'OfferToReceiveVideo' : false
}
};
},
load : function(_peerItem) {
this.peerId_ = this.remoteId_ = _peerItem.remoteId;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},load id({1}),remoteId({2})",this.tag_,this.id_,this.peerId_));
},
load2 : function(_message) {
for ( var n = 0; n < _message.iceCandidates.length; n++) {
var peerInfo_ = _message.iceCandidates[n];
var candidate_ = peerInfo_.candidate;
if (candidate_.indexOf("udp") != -1) {
var datas_ = candidate_.split(" ");
if (!this.remoteIp_) {
this.remoteIp_ = datas_[4] || "0.0.0.0";
}

if (this.remoteIp_.indexOf(":") != -1) {
continue;
}
if (!this.remotePort_) {
this.remotePort_ = datas_[5] || "0";
}

if ((datas_[7] || "").indexOf("srflx") == -1) {
continue;
} else {
this.remoteIp_ = datas_[4] || "0.0.0.0";
this.remotePort_ = datas_[5] || "0";
}
break;
}
}
},
connect: function()
{
var iceUrl_ = this.config_.stunServerHost;
this.iceServers_ = [ {
url : iceUrl_ + '?transport=udp'
} ];
if (this.fromServer_) {
this.connectionId_ = this.peerId_ + "-active";
} else {
this.connectionId_ = this.peerId_ + "-passive";
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},caller({1}),stunServer({2})",this.tag_,this.fromServer_,this.iceServers_[0].url));
try
{
this.peer_ = new RTCPeerConnection({
iceServers : this.iceServers_
}, this.iceOptions);
this.setPeerEvents_(this.peer_);
var scope_ = this;
if (this.fromServer_) {
} else {
this.peer_.setRemoteDescription(new RTCSessionDescription({type : 'offer',sdp:this.remoteSdpDescriptions_}));
this.peer_.createAnswer(function( description ){
if(scope_.remoteIceCandidates) scope_.addPeerIceCandidates(scope_.remoteIceCandidates);
scope_.peer_.setLocalDescription(description);
scope_.localSdpDescriptions_ = description.sdp;
},
function( err ){
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createAnswer error",scope_.tag_));
}, this.sdpOptions);
}
this.lastConnectTime_ = this.global_.getMilliTime_();
}
catch(e)
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} error({1})", this.tag_,(e || "").toString()));
}
},
setPeerEvents_ : function(_peer) {
var scope_ = this;
_peer.onnegotiationneeded = function() {
scope_.onPeerOpen_();
};
_peer.onicecandidate = function(evt) {
scope_.onPeerIceCandidate_(evt);
};
},
onPeerDataChannel_: function(_evt )
{
},
onPeerOpen_: function()
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},onPeerOpen,connectionId({1}),peerId({2})",this.tag_,this.connectionId_,this.peerId_));
var scope_ = this;
this.peer_.createOffer(function( description )
{
scope_.peer_.setLocalDescription(description);
scope_.localSdpDescriptions_ = description.sdp;
}, function( err )
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createOffer error",scope_.tag_));
}, this.sdpOptions);
},
sendConnectRequest_: function()
{
if (this.localIceCandidates_.length < 1) {
return;
}

var proxyData_ = {
action : 'connectRequest',
iceServers : this.iceServers_,
iceCandidates : this.localIceCandidates_,
sdpDescriptions : this.localSdpDescriptions_
};

this.status = true;
this.context_.sendMessage_({
method : 'proxyDataRequest',
sendId:this.id_,
destPeerId : this.remoteId_,
peerId:this.peerId_,
data : JSON.stringify(proxyData_)
});
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectRequest connectionId({1}) Send connect request) ",this.tag_, this.connectionId_));
},
sendConnectResponse_ : function() {
if (this.localIceCandidates_.length < 1) {
return;
}
var proxyData_ = {
action : 'connectResponse',
iceCandidates : this.localIceCandidates_,
sdpDescriptions : this.localSdpDescriptions_
};
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectResponse ({1})Send connect response",this.tag_, this.connectionId_));
this.status = true;
this.context_.sendMessage_({
method : 'proxyDataRequest',
sendId:this.id_,
destPeerId : this.remoteId_,
peerId:this.peerId_,
data : JSON.stringify(proxyData_)
});
},
addPeerIceCandidates_: function( _candidates )
{
if( Object.prototype.toString.call(_candidates) == '[object Array]' )
{
for( var i = 0; i < _candidates.length; i ++ )
{
this.peer_.addIceCandidate(new RTCIceCandidate(typeof(_candidates[i]) != 'string' ? _candidates[i] :
{
sdpMLineIndex: 0,
sdpMid: 'data',
candidate: _candidates[i]
}));
}
}
else
{
this.peer.addIceCandidate(new RTCIceCandidate(_candidates));
}
},
acceptAnswer_ : function(_candidates, _sdpDescriptions) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::acceptAnswer ({1}) Accept answer",this.tag_, this.connectionId_));
this.remoteIceCandidates_ = _candidates;
this.remoteSdpDescriptions_ = _sdpDescriptions;
this.peer_.setRemoteDescription(new RTCSessionDescription({
type : 'answer',
sdp : _sdpDescriptions
}));
this.addPeerIceCandidates_(_candidates);
},
onPeerIceCandidate_: function( _evt )
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerIceCandidate ({1}) Receive",this.tag_, this.connectionId_));
if (_evt.candidate) {
this.localIceCandidates_.push(_evt.candidate);
} else {
if (this.fromServer_) {
this.sendConnectRequest_();
} else {
this.sendConnectResponse_();
}
}
},

clear:function()
{
this.config_=null;
this.global_=null;
this.strings_=null;
this.peer_=null;
this.peerId_=null;
this.remoteId_=0;
this.fromServer_=false;
this.lastConnectTime_=0;
this.manager_=null;

this.localIceCandidates_=null;
this.localSdpDescriptions_=null;

this.remoteIceCandidates_=null;
this.remoteSdpDescriptions_=null;

this.iceOptions=null;
this.sdpOptions=null;
this.connectionId_="";
this.id_ = "";
this.connecting_=false;
this.tag_="";
}
});

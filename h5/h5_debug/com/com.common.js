p2p$.ns("com.common");
p2p$.com.common.Global = {
kByteUnitsPerKilo : 1024,
kKiloUnitsPerMega : 1024,
kMegaUnitsPerGiga : 1024,
kByteUnitsPerMega : 1024 * 1024,
kByteUnitsPerGiga : 1024 * 1024 * 1024,
kByteUnitsPerTera : 1024 * 1024 * 1024 * 1024 * 1024,

// seconds
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

getCurentTime_ : function(defultTimestamp) {
var now = new Date();
if (typeof defultTimestamp != 'undefined') {
now.setTime(defultTimestamp * 1000);
}
var year = now.getFullYear(); // 年
var month = now.getMonth() + 1; // 月
var day = now.getDate(); // 日
var hh = now.getHours(); // 时
var mm = now.getMinutes(); // 分
var sec = now.getSeconds();
var millSec = now.getMilliseconds();
var clock = year + "-";
if (month < 10) {
clock += "0";
}
clock += month + "-";
if (day < 10) {
clock += "0";
}
clock += day + " ";
if (hh < 10) {
clock += "0";
}
clock += hh + ":";
if (mm < 10) {
clock += '0';
}
clock += mm + ":";
;
if (sec < 10) {
clock += '0';
}
clock += sec + ".";
if (millSec < 100) {
clock += '0';
}
if (millSec < 10) {
clock += '0';
}
clock += millSec;
return (clock);
},

speed : function(value, bps) {
value = (value || 0);
var step = 1024;
var suffix = 'B/s';
if (bps) {
value *= 8;
step = 1000;
suffix = 'bps';
}
if (value < 1024) {
return value.toFixed(0) + ' ' + suffix;
} else if (value < (step * step)) {
return (value / step).toFixed(1) + ' K' + suffix;
} else if (value < (step * step * step)) {
return (value / step / step).toFixed(1) + ' M' + suffix;
} else if (value < (step * step * step * step)) {
return (value / step / step / step).toFixed(1) + ' G' + suffix;
}
}
};
p2p$.ns('com.common');
p2p$.com.common.LOG_LEVEL = {
kLogLevelNone : 0x00,
kLogLevelTrace : 0x01,
kLogLevelInfo : 0x02,
kLogLevelWarning : 0x04,
kLogLevelError : 0x08,
kLogLevelFatal : 0x10,
kLogLevelAll : 0xff
};
p2p$.com.common.LOG_TYPE = {
kLogTypeNone : 0x00,
kLogTypeConsole : 0x01,
kLogTypeMemory : 0x02
};
p2p$.com.common.LOG_OUTPUT = {
// mode
kLogTypeNone : 0x00,
kLogTypeStdout : 0x01,
kLogTypeStderr : 0x02,
kLogTypeFile : 0x04,
kLogTypeCustom : 0x08,
kLogTypeAll : 0xff,

// count
kLogTypeIdxStdout : 0,
kLogTypeIdxStderr : 1,
kLogTypeIdxFileOut : 2,
kLogTypeIdxFileErr : 3,
kLogTypeIdxCustom : 4,
kLogTypeCount : 5
};
p2p$.com.common.Log = {
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
init : function(level, type, logServer) {
var levels = p2p$.com.common.LOG_LEVEL;
this.logType_ = type | 2;
// levels.kLogLevelTrace |
this.level_ = level >= 0 ? level : (levels.kLogLevelInfo | levels.kLogLevelWarning | levels.kLogLevelError);
this.logPipe_ = new p2p$.com.common.LogPipDefault(logServer);
},

trace : function(logTime, fmt) {
var level = p2p$.com.common.LOG_LEVEL.kLogLevelTrace;
if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
return;
}
var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & logType) == logType) {
try {
console.log("H5: [" + logTime + " - TRC]", fmt);
} catch (e) {
}
}
logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & logType) == logType) {
if (this.logPipe_) {
this.logPipe_.addRecord_(level, "TRC", fmt);
}
}
},

info : function(logTime, fmt) {
var level = p2p$.com.common.LOG_LEVEL.kLogLevelInfo;
if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
return;
}
var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & logType) == logType) {
try {
console.info("H5: [" + logTime + " - INF]", fmt);
} catch (e) {
}
}
logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & logType) == logType) {
if (this.logPipe_) {
this.logPipe_.addRecord_(level, "INF", fmt);
}
}
},

warning : function(logTime, fmt) {
var level = p2p$.com.common.LOG_LEVEL.kLogLevelWarning;
if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
return;
}
var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & logType) == logType) {
try {
console.warn("H5: [" + logTime + " - WRN]", fmt);
} catch (e) {
}
}
logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & logType) == logType) {
if (this.logPipe_) {
this.logPipe_.addRecord_(level, "WRN", fmt);
}
}
},

error : function(logTime, fmt) {
var level = p2p$.com.common.LOG_LEVEL.kLogLevelError;
if ((this.level_ & level) == p2p$.com.common.LOG_LEVEL.kLogLevelNone) {
return;
}
var logType = p2p$.com.common.LOG_TYPE.kLogTypeConsole;
if ((this.logType_ & logType) == logType) {
try {
// console.error.apply(console, arguments__);
console.error("H5: [" + logTime + " - ERR]", fmt);
} catch (e) {
}
}
logType = p2p$.com.common.LOG_TYPE.kLogTypeMemory;
if ((this.logType_ & logType) == logType) {
if (this.logPipe_) {
this.logPipe_.addRecord_(level, "ERR", fmt);
}
}
}
};

function P2P_ULOG_TRACE() {
var logTime = p2p$.com.common.Global.getCurentTime_();
// p2p$.com.webp2p.core.common.Log.trace.apply(this, arguments);
for ( var i = 0; i < arguments.length; i++) {
p2p$.com.common.Log.trace(logTime, arguments[i]);
}
// p2p$.com.webp2p.core.common.Log.trace(fmt);
};

function P2P_ULOG_INFO() {
var logTime = p2p$.com.common.Global.getCurentTime_();
for ( var i = 0; i < arguments.length; i++) {
p2p$.com.common.Log.info(logTime, arguments[i]);
}
};

function P2P_ULOG_WARNING() {
var logTime = p2p$.com.common.Global.getCurentTime_();
for ( var i = 0; i < arguments.length; i++) {
p2p$.com.common.Log.warning(logTime, arguments[i]);
}
// p2p$.com.webp2p.core.common.Log.warning(fmt);
};

function P2P_ULOG_ERROR() {
var logTime = p2p$.com.common.Global.getCurentTime_();
// var temp = logTime;
// var temp2;
// var argLength = arguments.length;
// for(var i =0; i<argLength; i++){
// temp2 = arguments[i];
// arguments[i] = temp;
// temp = temp2;
// }
// arguments[argLength] = temp;
// arguments.length = 5;
// p2p$.com.webp2p.core.common.Log.error(logTime,arguments);
for ( var i = 0; i < arguments.length; i++) {
p2p$.com.common.Log.error(logTime, arguments[i]);
}
};

function logr() {
var i = -1, l = arguments.length, args = [], fn = 'console.log(args)';
while (++i < l) {
args.push('args[' + i + ']');
}
;
fn = new Function('args', fn.replace(/args/, args.join(',')));
fn(arguments);
};

function P2P_ULOG_FMT(fmt) {
var args = [];
for ( var i = 1; i < arguments.length; i++) {
args.push(arguments[i]);
}
return (fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
return args[i];
});
};
p2p$.ns('com.common');
p2p$.com.common.LogPipDefault = JClass.extend_({
records_ : null,
uploadTimer_ : null,
logServer_ : null,
logDom_ : null,
maxRecordCount_ : 500,
nextLogId_ : 0,
downloader_:null,

init : function(logServer) {
this.records_ = [];
this.uploadTimer_ = null;
this.downloader_ = null;
this.logServer_ = logServer;
this.nextLogId_ = 1;
this.logDom_ = document.getElementById("cde-log-container");
},

setUploadTimeout_ : function(timeoutMs) {
var me = this;
this.uploadTimer_ = setTimeout(function() {
me.onUploadTimeout_();
}, timeoutMs);
},

onUploadTimeout_ : function() {
this.upload();
this.setUploadTimeout_(2000);
},

addRecord_ : function(level, name, log) {
// this.records_.push(log);

var logTime = p2p$.com.common.Global.getCurentTime_();
var formatLog = "[" + logTime + " - " + name + "]" + log;

if (this.logServer_) {
$.post(this.logServer_, {
sessionid : "lmpn",
log : formatLog
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
this.logDom_.value += formatLog;
} catch (e) {
}
}

if (this.records_.length >= this.maxRecordCount_) {
this.records_.shift();
}
var localTime = new Date().getTime() * 1000;
this.records_.push({
level : level,
id : this.nextLogId_++,
localTime : localTime,
absTime : localTime,
content : log
});
},

upload : function() {
var params = "";
for ( var n = 0; n < this.records_.length; n++) {
params += this.records_[n] + "\r\n";
}
this.records_ = [];
this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:"http://127.0.0.1:8000/", scope_:this, method_:"POST", tag_:"upload::log",postData_:{
log : params
}});
this.downloader_.load_();
},

onHttpDownloadCompleted_ : function(downloader) {
var handled = false;
this.downloader_ = null;
if ("upload::log" == downloader.tag_) {
if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
// waiting for timeout and retry ...
return handled;
} else {

}
}
},

require : function(lastId, lastTime, level, filter, limit, maxLogTime, order) {
if (typeof order == 'undefined') {
order = false;
}
var result = {
records : [],
maxLogTime : maxLogTime
};
for ( var i = 0; i < this.records_.length; i++) {
var item = this.records_[i];
if (item.id <= lastId || item.absTime <= lastTime) {
continue;
} else if ((item.level & level) == 0) {
continue;
} else if (filter && item.content.indexOf(filter) < 0) {
continue;
}

result.maxLogTime = Math.max(result.maxLogTime, item.absTime);
if (!order) {
result.records.unshift(item);
} else {
result.records.push(item);
}

if (result.records.length >= limit) {
break;
}
}
return result;
}
});
p2p$.ns('com.common');
p2p$.com.common.Map = JClass.extend_({
/*
* MAP对象，实现MAP功能
*
* 接口： size() 获取MAP元素个数 isEmpty() 判断MAP是否为空 clear() 删除MAP所有元素 put(key, value) 向MAP中增加元素（key, value) remove(key) 删除指定KEY的元素，成功返回True，失败返回False get(key)
* 获取指定KEY的元素值VALUE，失败返回NULL element(index) 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL containsKey(key) 判断MAP中是否含有指定KEY的元素
* containsValue(value) 判断MAP中是否含有指定VALUE的元素 values() 获取MAP中所有VALUE的数组（ARRAY） keys() 获取MAP中所有KEY的数组（ARRAY）
*
* 例子： var map = new Map();
*
* map.put("key", "value"); var val = map.get("key") ……
*
*/
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
// 删除MAP所有元素
clear : function() {
this.elements_ = new Array();
this.length = 0;
},

// 向MAP中增加元素（key, value)
set : function(_key, _value, checkSame) {
if (typeof checkSame == 'undefined') {
checkSame = true;
}
if (checkSame) {
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

// 删除指定KEY的元素，成功返回True，失败返回False
remove : function(_key) {
var bln = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
this.elements_.splice(i, 1);
this.length--;
return true;
}
}
} catch (e) {
bln = false;
}
return bln;
},
erase : function(_key) {
var bln = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
this.elements_.splice(i, 1);
this.length--;
return true;
}
}
} catch (e) {
bln = false;
}
return bln;
},
// 获取指定KEY的元素值VALUE，失败返回NULL
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

// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
element : function(_index) {
if (_index < 0 || _index >= this.elements_.length) {
return null;
}
return this.elements_[_index];
},

// 判断MAP中是否含有指定KEY的元素
has : function(_key) {
var bln = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
bln = true;
}
}
} catch (e) {
bln = false;
}
return bln;
},
// 判断MAP中是否含有指定KEY的元素
find : function(_key) {
var bln = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
bln = true;
}
}
} catch (e) {
bln = false;
}
return bln;
},
find2 : function(_key, retValue) {
var bln = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].key == _key) {
retValue.value = this.elements_[i].value;
bln = true;
}
}
} catch (e) {
bln = false;
}
return bln;
},

// 判断MAP中是否含有指定VALUE的元素
containsValue : function(_value) {
var bln = false;
try {
for ( var i = 0; i < this.elements_.length; i++) {
if (this.elements_[i].value == _value) {
bln = true;
}
}
} catch (e) {
bln = false;
}
return bln;
},

// 获取MAP中所有VALUE的数组（ARRAY）
values : function() {
var arr = new Array();
for ( var i = 0; i < this.elements_.length; i++) {
arr.push(this.elements_[i].value);
}
return arr;
},

// 获取MAP中所有KEY的数组（ARRAY）
keys : function() {
var arr = new Array();
for ( var i = 0; i < this.elements_.length; i++) {
arr.push(this.elements_[i].key);
}
return arr;
}
});
p2p$.ns("com.common");
p2p$.com.common.String = {
b64EncodeChars_ : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
b64DecodeChars_ : [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7,
8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1 ],

trim : function(value) {
var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
return (value + '').replace(trimRegex, "");
},

urlEncodeNonAscii_ : function(value) {
return value;
},

/*
* "yyyy-MM-dd hh:mm:ss.S" ==> 2006-07-02 08:09:04.423 "yyyy-M-d h:m:s.S" ==> 2006-7-2 8:9:4.18
*/
formatTime_ : function(value, fmt) {
var newDate = new Date();
newDate.setTime(value);
if (!fmt) {
fmt = "yyyy-M-d h:m:s.S";
}
;
var o = {
"M+" : this.padingLeft_(newDate.getMonth() + 1, 2),
"d+" : this.padingLeft_(newDate.getDate(), 2),
"h+" : this.padingLeft_(newDate.getHours(), 2),
"m+" : this.padingLeft_(newDate.getMinutes(), 2),
"s+" : this.padingLeft_(newDate.getSeconds(), 2),
"q+" : Math.floor((newDate.getMonth() + 3) / 3),
"S" : this.padingLeft_(newDate.getMilliseconds(), 3)
};
if (/(y+)/.test(fmt)) {
fmt = fmt.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
}
for ( var k in o)
if (new RegExp("(" + k + ")").test(fmt)) {
fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
}
return fmt;
},

padingLeft_ : function(value, length, prefix) {
var result = value + "";
while (result.length < length) {
result = (prefix || "0") + result;
}
return result;
},

getAbsoluteUrlIfNeed_ : function(url, referer) {
var position = url.indexOf("://");
if (position != -1) {
return url;
} else {
var urlParsed = new p2p$.com.common.Url();
this.parseUrl_(referer, urlParsed, false);
if (url.length >= 2 && url.substring(0, 1) == "/" && url.substring(1, 2) == "/") {
// protocol relative
return this.format("{0}:{1}", urlParsed.protocol_, url);
} else if (url.length >= 1 && url.substring(0, 1) == "/") {
// path relative
if (0 == urlParsed.port_) {
return this.format("{0}://{1}{2}", urlParsed.protocol_, urlParsed.host_, url);
} else {
return this.format("{0}://{1}:{2}{3}", urlParsed.protocol_, urlParsed.host_, urlParsed.port_, url);
}
} else {
// file relative
if (0 == urlParsed.port_) {
return this.format("{0}://{1}{2}{3}", urlParsed.protocol_, urlParsed.host_, urlParsed.path_, url);
} else {
return this.format("{0}://{1}:{2}{3}{4}", urlParsed.protocol_, urlParsed.host_, urlParsed.port_, urlParsed.path_, url);
}
}
}
},

format : function(fmt) {
var args = [];
for ( var i = 1; i < arguments.length; i++) {
args.push(arguments[i]);
}
return (fmt || '').replace(/\{(\d+)\}/g, function(m, i) {
return args[i];
});
},

isSpace : function(value) {
},

isDigit : function(value) {
var reg = /^[a-zA-Z0-9]+$/g;
return reg.test(value);
},

fromNumber : function(value) {
return "" + value;
},

parseFloat : function(value, defult) {
if (typeof defult == 'undefined') {
defult = 0.0;
}
;
var ret = parseFloat(value);
var ret2 = isNaN(ret) ? defult : ret;

return isNaN(ret2) ? 0.0 : ret2;
},

// isNaN()
parseNumber_ : function(value, defult) {
if (typeof defult == 'undefined') {
defult = 0;
}
;
var ret = parseInt(value);
var ret2 = isNaN(ret) ? defult : ret;
return isNaN(ret2) ? 0 : ret2;
},

toUpper_ : function(value) {
return (value || "").toUpperCase();
},

makeUpper_ : function(value) {
return value.toUpperCase();
},

makeLower_ : function(value) {
return value.toLowerCase();
},

startsWith_ : function(ori, prefix) {
return ori.slice(0, prefix.length) === prefix;
},

endsWith_ : function(ori, suffix) {
return ori.indexOf(suffix, ori.length - suffix.length) !== -1;
},

toLower_ : function(value) {
return value.toLowerCase();
},

compareTo_ : function(value1, value2) {
return value1.localeCompare(value2);
},

// escape()函数，不会encode @*/+ (不推荐使用)
// encodeURI()函数，不会encode ~!@#$&*()=:/,;?+' (不推荐使用)
// encodeURIComponent()函数，不会encode~!*() 这个函数是最常用的
urlEncode_ : function(str) {
str = (str + '').toString();
return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(
/%20/g, '+');
},

split : function(content, values, key, maxItems, ignoreEmpty, contentLength) {
var startPos = 0;
var findPos = 0;
var itemCount = 0;
var keyLen = key.length;
var endPos = (-1 >>> 0 == contentLength) ? content.length : contentLength;

// values = [];

if (key.length == 0) {
return 0;
} else if (endPos <= 0 || endPos >= content.length) {
endPos = content.length;
}

while (startPos < endPos) {
findPos = content.indexOf(key, startPos);
if (findPos < 0 || findPos >= endPos || (maxItems > 0 && itemCount == maxItems - 1)) {
findPos = endPos;
}

if (findPos < startPos) {
break;
}

if (findPos > startPos || !ignoreEmpty) {
var newValue = (findPos > startPos) ? content.substr(startPos, findPos - startPos) : "";
values.push(newValue);
itemCount++;
}

startPos = findPos + keyLen;
}

return itemCount;
},

parseAttributes_ : function(content, attributes, separatorKey, valueKey, keyLowCase, trimKey, trimValue) {
var lines = 0;
var parts = [];

this.split(content, parts, separatorKey, -1, false, -1 >>> 0);
for ( var n = 0; n < parts.length; n++) {
var partValue = parts[n];
var partValues = [];
if (this.split(partValue, partValues, valueKey, 2, false, -1 >>> 0) == 0) {
continue;
}

if (keyLowCase) {
partValues[0] = this.toLower_(partValues[0]);
}

if (trimKey) {
this.trim(partValues.front());
}

if (trimValue && partValues.length > 1) {
this.trim(partValues[partValues.length - 1]);
}

if (partValues.length < 2) {
if (partValues.length >= 1) {
attributes.set(partValues[0], "");
}
} else {
attributes.set(partValues[0], partValues[partValues.length - 1]);
}

lines++;
}

return lines;
},

parseUrl_ : function(url, superNodeUrl, fileWithParams) {
// protocol_, host_, port_, path_, file_, segment_, params_
var protocolPos = -1;
if (url) {
protocolPos = url.indexOf(":");
} else {
return;
}
var hostPos = 0;
if (-1 != protocolPos) {
var validProtocol = true;
for ( var n = 0; n < protocolPos; n++) {
if (!this.isDigit(url[n])) {
validProtocol = false;
break;
}
}
if (validProtocol) {
superNodeUrl.protocol_ = this.toLower_(url.substr(0, protocolPos));
hostPos = protocolPos + 1;
while (hostPos < url.length && '/' == url[hostPos]) {
hostPos++;
}
}
}
var portPos = url.indexOf(":", hostPos) >>> 0;
var pathPos = url.indexOf("/", hostPos) >>> 0;
if (portPos > pathPos) {
// maybe such url http://server/about:blank
portPos = -1;
}
portPos = portPos << 0;
if (-1 != portPos) {
superNodeUrl.host_ = url.substr(hostPos, portPos - hostPos);
superNodeUrl.port_ = this.parseNumber_(url.substr(portPos + 1), 0);
}

var fullUri;
if (-1 == pathPos) {
fullUri = "/";
if (superNodeUrl.host_.length == 0) {
superNodeUrl.host_ = url.substr(hostPos);
}
} else {
fullUri = url.substr(pathPos);
if (superNodeUrl.host_.length == 0) {
superNodeUrl.host_ = url.substr(hostPos, pathPos - hostPos);
}
}

var queryBeginPos = fullUri.indexOf('?') >>> 0;
var segmentBeginPos = fullUri.indexOf('#') >>> 0;
superNodeUrl.file_ = fullUri.substr(0, queryBeginPos > segmentBeginPos ? segmentBeginPos : queryBeginPos);
if ((queryBeginPos + 1) < fullUri.length && queryBeginPos != -1 && queryBeginPos < segmentBeginPos) {
var queryParams = fullUri.substr(queryBeginPos + 1, -1 == segmentBeginPos << 0 ? -1 >>> 0 : (segmentBeginPos - queryBeginPos - 1));
var encodeParams = new p2p$.com.common.Map();
this.parseAttributes_(queryParams, encodeParams, '&', '=', false, false, false);
for ( var n = 0; n < encodeParams.size(); n++) {
var item = encodeParams.element(n);
var key = decodeURIComponent(item.key);
superNodeUrl.params_.set(key, decodeURIComponent(item.value));
}
}

if (segmentBeginPos != -1) {
superNodeUrl.segment_ = fullUri.substr(segmentBeginPos + 1);
}

var filePos = superNodeUrl.file_.lastIndexOf('/') >>> 0;
if (filePos == -1 || filePos == 0) {
superNodeUrl.path_ = "/";
} else {
superNodeUrl.path_ = superNodeUrl.file_.substr(0, filePos);
}

// format path as /name/
if (superNodeUrl.path_.length == 0 || superNodeUrl.path_[superNodeUrl.path_.length - 1] != '/') {
superNodeUrl.path_ += "/";
}

if (fileWithParams) {
superNodeUrl.file_ = fullUri;
// core::common::String::normalizeUrlPath(path);
// core::common::String::normalizeUrlPath(file);
}
},

base64Encode_ : function(str) {
var out, i, len;
var c1, c2, c3;

len = str.length;
i = 0;
out = "";
while (i < len) {
c1 = str.charCodeAt(i++) & 0xff;
if (i == len) {
out += this.b64EncodeChars_.charAt(c1 >> 2);
out += this.b64EncodeChars_.charAt((c1 & 0x3) << 4);
out += "==";
break;
}
c2 = str.charCodeAt(i++);
if (i == len) {
out += this.b64EncodeChars_.charAt(c1 >> 2);
out += this.b64EncodeChars_.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
out += this.b64EncodeChars_.charAt((c2 & 0xF) << 2);
out += "=";
break;
}
c3 = str.charCodeAt(i++);
out += this.b64EncodeChars_.charAt(c1 >> 2);
out += this.b64EncodeChars_.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
out += this.b64EncodeChars_.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
out += this.b64EncodeChars_.charAt(c3 & 0x3F);
}
return out;
},

base64Decode_ : function(str) {
var c1, c2, c3, c4;
var i, len, out;

len = str.length;
i = 0;
out = "";
while (i < len) {
/* c1 */
do {
c1 = this.b64DecodeChars_[str.charCodeAt(i++) & 0xff];
} while (i < len && c1 == -1);
if (c1 == -1) {
break;
}

/* c2 */
do {
c2 = this.b64DecodeChars_[str.charCodeAt(i++) & 0xff];
} while (i < len && c2 == -1);
if (c2 == -1) {
break;
}

out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

/* c3 */
do {
c3 = str.charCodeAt(i++) & 0xff;
if (c3 == 61) {
return out;
}
c3 = this.b64DecodeChars_[c3];
} while (i < len && c3 == -1);
if (c3 == -1) {
break;
}

out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

/* c4 */
do {
c4 = str.charCodeAt(i++) & 0xff;
if (c4 == 61) {
return out;
}
c4 = this.b64DecodeChars_[c4];
} while (i < len && c4 == -1);
if (c4 == -1) {
break;
}
out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
}
return out;
},

utf16to8_ : function(str) {
var out, i, len, c;

out = "";
len = str.length;
for (i = 0; i < len; i++) {
c = str.charCodeAt(i);
if ((c >= 0x0001) && (c <= 0x007F)) {
out += str.charAt(i);
} else if (c > 0x07FF) {
out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
} else {
out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
}
}
return out;
},

utf8to16_ : function(str) {
var out, i, len, c;
var char2, char3;

out = "";
len = str.length;
i = 0;
while (i < len) {
c = str.charCodeAt(i++);
switch (c >> 4) {
case 0:
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
// 0xxxxxxx
out += str.charAt(i - 1);
break;
case 12:
case 13:
// 110x xxxx 10xx xxxx
char2 = str.charCodeAt(i++);
out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
break;
case 14:
// 1110 xxxx 10xx xxxx 10xx xxxx
char2 = str.charCodeAt(i++);
char3 = str.charCodeAt(i++);
out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
break;
}
}

return out;
},

charToHex_ : function(str) {
var out, i, len, c, h;

out = "";
len = str.length;
i = 0;
while (i < len) {
c = str.charCodeAt(i++);
h = c.toString(16);
if (h.length < 2) {
h = "0" + h;
}

out += "\\x" + h + " ";
if (i > 0 && i % 8 == 0) {
out += "\r\n";
}
}

return out;
},
getFunName:function(value){
var re = /function\s*(\w*)/ig;
var matches = re.exec(value);
return matches[1];
}
};
p2p$.ns("com.common");
p2p$.com.common.Url = JClass.extend_({
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
this.params_ = new p2p$.com.common.Map();
},

getParams : function() {
return this.params_;
},

fromString_ : function(value) {
p2p$.com.common.String.parseUrl_(value, this, false);
},

toString : function() {
var isDefaultPort = (this.port_ == 0) || (this.protocol_ == "http" && this.port_ == 80) || (this.protocol_ == "https" && this.port_ == 443);
var protocolName = this.protocol_ == "" ? "http" : this.protocol_;

var value;
if (isDefaultPort) {
value = protocolName + "://" + this.host_ + this.file_;
} else {
value = protocolName + "://" + this.host_ + ":" + this.port_ + this.file_;
}

return value + this.toQueryString_();
},

toQueryString_ : function(fromFirst) {
var value = "";
var isFirstKey = true;
if (typeof fromFirst == 'undefined') {
isFirstKey = true;
} else {
isFirstKey = fromFirst;
}
if (!this.params_.empty()) {
for ( var i = 0; i < this.params_.elements_.length; i++) {
// var vthis.params_.elements_[i].value
if (isFirstKey) {
value += "?";
} else {
value += "&";
}
value += (p2p$.com.common.String.urlEncodeNonAscii_(this.params_.elements_[i].key) + "=" + p2p$.com.common.String.urlEncodeNonAscii_(this.params_.elements_[i].value));
isFirstKey = false;
}
}

if (this.segment_ != "") {
value += "#";
value += segment_;
}
return value;
}
});

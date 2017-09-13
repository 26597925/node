p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.META_DATA_TYPE = {
kMetaDataTypeVod : 0,
kMetaDataTypeLive : 1,
kMetaDataTypeDownload : 2,
kMetaDataTypeRtlStream : 3
};

p2p$.com.webp2p.core.common.META_PIECE_TYPE = {
kMetaPieceTypeTn : 0,
kMetaPieceTypePn : 1
};

p2p$.com.webp2p.core.common.ERROR_CODE = {
kErrorSuccess : 0,
kErrorAccessDenied : 1,
kErrorInvalidParameters : 2,
kErrorInternalError : 3,
kErrorDestUnreachable : 4,
kErrorServiceBusy : 5,
kErrorNetworkUnreachable : 6,
kErrorAlreadyExists : 7,
kErrorNoSuchGroup : 8,
kErrorNoSuchGroupItem : 9,
kErrorNoSuchSession : 10,
kErrorNoSuchItem : 11,
kErrorNetworkFailed : 12,
kErrorTimeout : 13,
kErrorNotReady : 14,
kErrorStreamIdIsEmpty : 15,
kErrorCanceled : 16,
kErrorAuthFailed : 17,
kErrorNoPrivileges : 18,
kErrorAlreadyLogin : 19,
kErrorServiceOffline : 20,
kErrorNotSupported : 21,
kErrorPasswordExpired : 22,
kErrorCodeMax : 23,
};

p2p$.com.webp2p.core.common.SERVER_TYPES = {
kServerTypeReserved : 0,
kServerTypeControl : 1,
kServerTypeStorage : 2,
kServerTypeRtmfp : 4,
kServerTypeWebRTC : 8,
kServerTypeHttpTracker : 16,
kServerTypeReserved5 : 32,
kServerTypeStunServer : 64,
kServerTypeSelector : 128,
};

p2p$.com.webp2p.core.common.Enum = {
getMetaTypeName_ : function(type) {
switch (type) {
case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod:
return "vod";
case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive:
return "live";
case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload:
return "download";
case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeRtlStream:
return "stream";
default:
return "unknown";
}
},

getPieceTypeName_ : function(type) {
switch (type) {
case p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn:
return "tn";
case p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn:
return "pn";
default:
return "unknown";
}
}
};
p2p$.ns('com.webp2p.core.common');

/*
* A JavaScript implementation of the RSA Data Security, Inc. MD5 Message Digest Algorithm, as defined in RFC 1321. Version 2.1 Copyright (C) Paul Johnston 1999 -
* 2002. Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet Distributed under the BSD License See http://pajhome.org.uk/crypt/md5 for more info.
*/

/*
* Configurable variables. You may need to tweak these to be compatible with the server-side, but the defaults work in most cases.
*/
p2p$.com.webp2p.core.common.Md5 = {
hexcase : 0, /* hex output format. 0 - lowercase; 1 - uppercase */
chrsz : 8, /* bits per input character. 8 - ASCII; 16 - Unicode */

/*
* These are the functions you'll usually want to call They take string arguments and return either hex or base-64 encoded strings
*/
hexString_ : function(s) {
return this.binl2hex_(this.core_md5_(this.str2binl_(s), s.length * this.chrsz));
},

/*
* Calculate the MD5 of an array of little-endian words, and a bit length
*/
core_md5_ : function(x, len) {
/* append padding */
x[len >> 5] |= 0x80 << ((len) % 32);
x[(((len + 64) >>> 9) << 4) + 14] = len;

var a = 1732584193;
var b = -271733879;
var c = -1732584194;
var d = 271733878;

for ( var i = 0; i < x.length; i += 16) {
var olda = a;
var oldb = b;
var oldc = c;
var oldd = d;

a = this.ff(a, b, c, d, x[i + 0], 7, -680876936);
d = this.ff(d, a, b, c, x[i + 1], 12, -389564586);
c = this.ff(c, d, a, b, x[i + 2], 17, 606105819);
b = this.ff(b, c, d, a, x[i + 3], 22, -1044525330);
a = this.ff(a, b, c, d, x[i + 4], 7, -176418897);
d = this.ff(d, a, b, c, x[i + 5], 12, 1200080426);
c = this.ff(c, d, a, b, x[i + 6], 17, -1473231341);
b = this.ff(b, c, d, a, x[i + 7], 22, -45705983);
a = this.ff(a, b, c, d, x[i + 8], 7, 1770035416);
d = this.ff(d, a, b, c, x[i + 9], 12, -1958414417);
c = this.ff(c, d, a, b, x[i + 10], 17, -42063);
b = this.ff(b, c, d, a, x[i + 11], 22, -1990404162);
a = this.ff(a, b, c, d, x[i + 12], 7, 1804603682);
d = this.ff(d, a, b, c, x[i + 13], 12, -40341101);
c = this.ff(c, d, a, b, x[i + 14], 17, -1502002290);
b = this.ff(b, c, d, a, x[i + 15], 22, 1236535329);

a = this.gg(a, b, c, d, x[i + 1], 5, -165796510);
d = this.gg(d, a, b, c, x[i + 6], 9, -1069501632);
c = this.gg(c, d, a, b, x[i + 11], 14, 643717713);
b = this.gg(b, c, d, a, x[i + 0], 20, -373897302);
a = this.gg(a, b, c, d, x[i + 5], 5, -701558691);
d = this.gg(d, a, b, c, x[i + 10], 9, 38016083);
c = this.gg(c, d, a, b, x[i + 15], 14, -660478335);
b = this.gg(b, c, d, a, x[i + 4], 20, -405537848);
a = this.gg(a, b, c, d, x[i + 9], 5, 568446438);
d = this.gg(d, a, b, c, x[i + 14], 9, -1019803690);
c = this.gg(c, d, a, b, x[i + 3], 14, -187363961);
b = this.gg(b, c, d, a, x[i + 8], 20, 1163531501);
a = this.gg(a, b, c, d, x[i + 13], 5, -1444681467);
d = this.gg(d, a, b, c, x[i + 2], 9, -51403784);
c = this.gg(c, d, a, b, x[i + 7], 14, 1735328473);
b = this.gg(b, c, d, a, x[i + 12], 20, -1926607734);

a = this.hh(a, b, c, d, x[i + 5], 4, -378558);
d = this.hh(d, a, b, c, x[i + 8], 11, -2022574463);
c = this.hh(c, d, a, b, x[i + 11], 16, 1839030562);
b = this.hh(b, c, d, a, x[i + 14], 23, -35309556);
a = this.hh(a, b, c, d, x[i + 1], 4, -1530992060);
d = this.hh(d, a, b, c, x[i + 4], 11, 1272893353);
c = this.hh(c, d, a, b, x[i + 7], 16, -155497632);
b = this.hh(b, c, d, a, x[i + 10], 23, -1094730640);
a = this.hh(a, b, c, d, x[i + 13], 4, 681279174);
d = this.hh(d, a, b, c, x[i + 0], 11, -358537222);
c = this.hh(c, d, a, b, x[i + 3], 16, -722521979);
b = this.hh(b, c, d, a, x[i + 6], 23, 76029189);
a = this.hh(a, b, c, d, x[i + 9], 4, -640364487);
d = this.hh(d, a, b, c, x[i + 12], 11, -421815835);
c = this.hh(c, d, a, b, x[i + 15], 16, 530742520);
b = this.hh(b, c, d, a, x[i + 2], 23, -995338651);

a = this.ii(a, b, c, d, x[i + 0], 6, -198630844);
d = this.ii(d, a, b, c, x[i + 7], 10, 1126891415);
c = this.ii(c, d, a, b, x[i + 14], 15, -1416354905);
b = this.ii(b, c, d, a, x[i + 5], 21, -57434055);
a = this.ii(a, b, c, d, x[i + 12], 6, 1700485571);
d = this.ii(d, a, b, c, x[i + 3], 10, -1894986606);
c = this.ii(c, d, a, b, x[i + 10], 15, -1051523);
b = this.ii(b, c, d, a, x[i + 1], 21, -2054922799);
a = this.ii(a, b, c, d, x[i + 8], 6, 1873313359);
d = this.ii(d, a, b, c, x[i + 15], 10, -30611744);
c = this.ii(c, d, a, b, x[i + 6], 15, -1560198380);
b = this.ii(b, c, d, a, x[i + 13], 21, 1309151649);
a = this.ii(a, b, c, d, x[i + 4], 6, -145523070);
d = this.ii(d, a, b, c, x[i + 11], 10, -1120210379);
c = this.ii(c, d, a, b, x[i + 2], 15, 718787259);
b = this.ii(b, c, d, a, x[i + 9], 21, -343485551);

a = this.add(a, olda);
b = this.add(b, oldb);
c = this.add(c, oldc);
d = this.add(d, oldd);
}
return Array(a, b, c, d);
},

/*
* These functions implement the four basic operations the algorithm uses.
*/
cmn : function(q, a, b, x, s, t) {
return this.add(this.br(this.add(this.add(a, q), this.add(x, t)), s), b);
},

ff : function(a, b, c, d, x, s, t) {
return this.cmn((b & c) | ((~b) & d), a, b, x, s, t);
},

gg : function(a, b, c, d, x, s, t) {
return this.cmn((b & d) | (c & (~d)), a, b, x, s, t);
},

hh : function(a, b, c, d, x, s, t) {
return this.cmn(b ^ c ^ d, a, b, x, s, t);
},

ii : function(a, b, c, d, x, s, t) {
return this.cmn(c ^ (b | (~d)), a, b, x, s, t);
},

/*
* Add integers, wrapping at 2^32. This uses 16-bit operations internally to work around bugs in some JS interpreters.
*/
add : function(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF);
var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
},

/*
* Bitwise rotate a 32-bit number to the left.
*/
br : function(num, cnt) {
return (num << cnt) | (num >>> (32 - cnt));
},

/*
* Convert a string to an array of little-endian words If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
*/
str2binl_ : function(str) {
var bin = Array();
var mask = (1 << this.chrsz) - 1;
for ( var i = 0; i < str.length * this.chrsz; i += this.chrsz) {
bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
}
return bin;
},

/*
* Convert an array of little-endian words to a string
*/
binl2str_ : function(bin) {
var str = "";
var mask = (1 << this.chrsz) - 1;
for ( var i = 0; i < bin.length * 32; i += this.chrsz) {
str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
}
return str;
},

/*
* Convert an array of little-endian words to a hex string.
*/
binl2hex_ : function(binarray) {
var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
var str = "";
for ( var i = 0; i < binarray.length * 4; i++) {
str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
}
return str;
}
};
window.JSON = window.JSON || {};
window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
window.RTCPeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined

// in Nighly but useless
var CdeByteArray = function(data) {

this.length = 0;
this._position = 0;
this.uInt8Array = new Uint8Array();
if (data) {
this.uInt8Array = new Uint8Array(data);
}
this.writeBytes = function(bytes) {
var tempByteArray = null;
if (this.uInt8Array) {
tempByteArray = new Uint8Array(this.uInt8Array.length + bytes.length);
tempByteArray.set(this.uInt8Array, 0);
tempByteArray.set(bytes, this.uInt8Array.length);
} else {
tempByteArray = bytes;
}
this.uInt8Array = tempByteArray;
};
this.setBytes = function(int8) {
this.position = 0;
this.uInt8Array = int8;
};

this.readBytes = function(bytes, offset, length) {
offset = offset || 0;
length = length || this.uInt8Array.length;
if (length === 0) {
length = this.uInt8Array.length;
}
if ((offset === 0 || (offset > 0 && offset < bytes.uInt8Array.length)) && length > 0 && (this.position + length) <= this.uInt8Array.length) {
var tempBytes0 = new Uint8Array(offset);
tempBytes0 = bytes.uInt8Array.subarray(0, offset);

var tempBytes1 = new Uint8Array(tempBytes0.length + length);
var tempBytes2 = new Uint8Array(length);

tempBytes2 = this.uInt8Array.subarray(this.position, length);

tempBytes1.set(tempBytes0);
tempBytes1.set(tempBytes2, tempBytes0.length);
bytes.uInt8Array = new Uint8Array(tempBytes1);
} else {
console.log("readBytes error");
}

};
this.generationByteArray = function(int8) {
this.position = 0;
this.uInt8Array = int8;
};

this.clear = function() {
this.position = 0;
this.uInt8Array = new Uint8Array();
};

this.__defineGetter__("position", function() {
return this._position;
});

this.__defineSetter__("position", function(value) {
this._position = value;
});
this.__defineGetter__("length", function() {
return this.uInt8Array.length;
});
this.__defineGetter__("bytesAvailable", function() {
return this.length - this._position;
});

this.__defineGetter__("CdeByteArray", function() {
return this.uInt8Array;
});

};

JSON.stringify = JSON.stringify || function(obj) {
var t = typeof (obj);
if (t != "object" || obj === null) {
// simple data type
if (t == "string") {
obj = '"' + obj + '"';
}
return String(obj);
} else {
// recurse array or object
var n, v, json = [], arr = (obj && obj.constructor == Array);
for ( n in obj) {
v = obj[n];
t = typeof (v);
if (t == "string") {
v = '"' + v + '"';
} else if (t == "object" && v !== null) {
v = JSON.stringify(v);
}
json.push((arr ? "" : '"' + n + '":') + String(v));
}
return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
}
};
p2p$.ns("com.webp2p.core.common");

p2p$.com.webp2p.core.common.Number = {
max : function(value1, value2) {
return value1 > value2 ? value1 : value2;
},

min : function(value1, value2) {
return value1 > value2 ? value2 : value1;
},

maxUnsignedValue_ : function() {
return -1 >>> 0;
},

convertToBit_ : function(size, data, _array) {
var __uint8 = null;
switch (size) {
case "2":
__uint8 = new Uint8Array(2);
__uint8[0] = (parseInt(data) >> 8) & 0xff;
__uint8[1] = parseInt(data) & 0xff;
_array.push(__uint8);
break;
case "4":
__uint8 = new Uint8Array(4);
__uint8[0] = (parseInt(data) >> 24) & 0xff;
__uint8[1] = (parseInt(data) >> 16) & 0xff;
__uint8[2] = (parseInt(data) >> 8) & 0xff;
__uint8[3] = parseInt(data) & 0xff;
_array.push(__uint8);
break;
case "8":
__uint8 = new Uint8Array(8);
var data1 = Math.floor(data / 0x100000000);
__uint8[0] = (data1 >> 24) & 0xff;
__uint8[1] = (data1 >> 16) & 0xff;
__uint8[2] = (data1 >> 8) & 0xff;
__uint8[3] = (data1) & 0xff;
var data2 = Math.floor(data % 0x100000000);
__uint8[4] = (data2 >> 24) & 0xff;
__uint8[5] = (data2 >> 16) & 0xff;
__uint8[6] = (data2 >> 8) & 0xff;
__uint8[7] = (data2) & 0xff;
_array.push(__uint8);
break;
case "utf":
__uint8 = new Uint8Array(data.length);
for ( var i = 0; i < data.length; i++) {
__uint8[i] = data.charCodeAt(i);
}
_array.push(__uint8);
break;
case "d":
if (data && data.length > 0) {
_array.push(data);
}
break;
}
},

convertToValue_ : function(size, byteArray, position, len) {
var value1;
var value2;
var value3;
var value4;
var value = null;
switch (size) {
case "2":
value1 = byteArray[position];
value2 = byteArray[position + 1];
value = (value1 << 8) + value2;
break;
case "4":
value1 = byteArray[position];
value2 = byteArray[position + 1];
value3 = byteArray[position + 2];
value4 = byteArray[position + 3];
value = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
break;
case "8":
value1 = byteArray[position];
value2 = byteArray[position + 1];
value3 = byteArray[position + 2];
value4 = byteArray[position + 3];

var high = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
value1 = byteArray[position + 4];
value2 = byteArray[position + 5];
value3 = byteArray[position + 6];
value4 = byteArray[position + 7];
var low = (value1 * Math.pow(2, 24)) + (value2 << 16) + (value3 << 8) + value4;
value = (high * 0x100000000) + low;
break;
case "utf":
var str = "";
for ( var i = 0; i < len; i++) {
str += String.fromCharCode(byteArray[position + i]);
}
value = str;
break;
case "d":
value = byteArray.subarray(position, position + len);
break;
}
return value;
}
};
p2p$.ns('com.webp2p.core.entrance');

p2p$.com.webp2p.core.entrance.VideoStream = {
initialized_ : false,
channelManager_ : null,
pool_ : null,
enviroment_ : null,
connectionType_ : "",
strings_:null,
platForms_:[["Win32","Windows"],["Mac68K","MacPPC","Macintosh","MacIntel"]],
tag_:"com::webp2p::core::entrance::VideoStream",

init : function() {
if (this.initialized_) {
return;
}
this.strings_ = p2p$.com.common.String;
this.connectionType_ = "";
this.initialized_ = true;
this.enviroment_ = p2p$.com.selector.Enviroment;
this.checkNetwork_();
this.channelManager_ = new p2p$.com.webp2p.logic.base.Manager(this.enviroment_);
this.pool_ = p2p$.com.webp2p.core.storage.Pool;
this.pool_.initialize_(this.channelManager_);
this.setCheckTimer_(5000);
},

checkNetwork_ : function() {
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
if (connection) {
this.connectionType_ = connection.type;
try {
var me = this;
// Register for event changes.
connection.onchange = function(e) {
me.onNetowrkTypeChanged_(e);
};
// Alternatively.
connection.addEventListener('change', function(e) {
me.onNetowrkTypeChanged_(e);
});
} catch (e) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add network change event failed: {1}",this.tag_,(e || "").toString()));
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Check network, type: {1}",this.tag_,this.connectionType_));
} else {
var osType = this.enviroment_.getOSType_();
switch(osType)
{
case "Mac":
case "Unix":
case "Linux":
case "Win2000":
case "Win2003":
case "WinXP":
case "WinVista":
case "Win7":
case "Win":
case "other":
this.connectionType_ = "ethernet";
break;
case "iPhone":
case "Android":
this.connectionType_ = "mobile";
break;
default:
break;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Check network not support, os {1} default as {2}",this.tag_,osType,this.connectionType_));
}
this.enviroment_.setNetworkType_(this.connectionType_);
},
onNetowrkTypeChanged_ : function(e) {
var temp = this.connectionType_;
this.connectionType_ = navigator.connection.type;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Network changed from ({1}) to ({2})",this.tag_, temp, this.connectionType_));
this.enviroment_.setNetworkType_(connectionType);
this.channelManager_.checkTimeout_();
},

onCheckTimeout_ : function() {
this.channelManager_.checkTimeout_();
this.setCheckTimer_(5000);
},

setCheckTimer_ : function(timeoutMs) {
var me = this;
this.checkTimer_ = setTimeout(function() {
me.onCheckTimeout_();
}, timeoutMs);
},

getConnectionParams_ : function(palyUrl, url) {
url.fromString_(palyUrl);
},

requestPlay_ : function(palyUrl) {
var channel = null;
var url = new p2p$.com.common.Url();
this.playUrl_ = palyUrl;
this.getConnectionParams_(palyUrl, url);
channel = this.channelManager_.openChannel_(this.playUrl_, url.params_, this);
if (channel) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play, url({1})", this.tag_,palyUrl));
return channel;
}
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Open channel failed",this.tag_));
return null;
},

requestPlaySlice_ : function(channelId, requestSegmentId, urgentSegmentId) {
var responseDetails = "";
var channel = this.channelManager_.getChannelById_(channelId);

if (channel == null) {
responseDetails = "Channel Not Found";
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play slice {1}",this.tag_, responseDetails));
return null;
}

var result = channel.requireSegmentData_(requestSegmentId, urgentSegmentId);
if (result.segment != null && result.stream != null) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play slice request urgent({1}) success",this.tag_, requestSegmentId));
} else {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Request play slice request urgent({1}) failed",this.tag_,requestSegmentId));
}
return result;
},

requestPlayStop_ : function(palyUrl) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request stop {1}",this.tag_,palyUrl));
this.channelManager_.closeChannel_(palyUrl);
},

requestControlParams_ : function() {
},

getConnectionParams2_ : function(palyUrl) {
var urlParse = new p2p$.com.common.Url();
urlParse.fromString_(palyUrl);
return urlParse.params_;
},

requestStateCurrent_ : function(url) {
var params, result = {};
params = this.getConnectionParams2_(url);
var maxLogTime = 0;
this.getCurrentState_(params, result, maxLogTime);
return result;
},
getCurrentState_ : function(params, result, maxLogTime) {
// module
var moduleResult = result["module"] = {};
moduleResult["version"] = this.strings_.format("H5-{0}.{1}.{2}", p2p$.com.selector.Module.kH5MajorVersion,p2p$.com.selector.Module.kH5MinorVersion, p2p$.com.selector.Module.kH5BuildNumber);
moduleResult["buildTime"] = p2p$.com.selector.Module.kBuildTime;

// system
result["system"] = {};
this.getSystemInfoDetails_(params, result["system"]);

// enviroment
result["enviroment"] = {};
this.enviroment_.getAllStatus_(result["enviroment"]);
// this.supportSession_.getAllStatus_(result["support"]);

if (!params.get("ignoreChannels")) {
this.channelManager_.getAllStatus_(params, result);
}

// log pipes
if (params.get("needLogPipe")) {
var logResult = p2p$.com.common.Log.logPipe_.require(parseInt(params.get("logPipeId") || 0), parseInt(params.get("logPipeTime") || 0),
parseInt(params.get("logPipeLevel") || 255), params.get("logPipeFilter") || "", parseInt(params.get("logPipeLimit") || 1), maxLogTime);
maxLogTime = logResult.maxLogTime;
result["logs"] = logResult.records;
}

return maxLogTime;
},

getSystemInfoDetails_ : function(params, result) {
result["currentTime"] = new Date().getTime() / 1000;

// system:default bucket
var defaultBucket = p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
var storageInfo = result["storage"] = {};
var defaultInfo = storageInfo["default"] = {};
defaultInfo["name"] = defaultBucket.getName_();
defaultInfo["dataSize"] = defaultBucket.getDataSize_();
defaultInfo["dataCapacity"] = defaultBucket.getDataCapacity_();
}
};
p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.BasePlayer = JClass.extend_({
kNoFirstSeek : -1,
kFirstSeekInit : 0,
kFirstSeekWaitDownLoadSegment : 1,
kFirstSeekDownLoadSegmentOk : 2,
kFirstSeekStatusDone : 3,
errorReplayTime_:0,
firstSeekPosition_ : 0,

firstPlayTime_:-1,//执行playing时间
firstAddDataTime_:-1,//喂第一块数据时间
firstPlayingTime_:-1,//执行playing时间
seekingTime_:-1,//开始seek时间
seekedTime_:-1,//seek用时
rangeDalay_:0,
stream_ : null,
delayTime_:0,
wrapper_ : null,
url_ : "",
urgentSegment_ : 0,
mediaSource_ : null,
mediaOpened_ : false,
fectchInterval_ : 200,
channel_ : null,
video_ : null,
blockList_ : null,
sourceBuffer_ : null,
sourceIdle_ : true,
sourceMime_ : null,
toMp4_ : null,
initFnum_ : 0,
fetchTimer_ : null,
metaData_ : null,
nextSegmentId_ : 0,
playerContext_ : null,
preTime_ : 0,
preSegmentId_ : "",
breakTimes_ : 0,
bufferTimes_ : 0,
macSafariPattern_ : false,
videoDuration_ : 0,
actived_ : false,
maxErrorTimes_ : 0,
duration_ : 0,
global_:null,
strings_:null,
config_:null,
videoStatus_:null,
playerStatus_:null,
tag_:"com::webp2p::core::player::BasePlayer",

init : function(wrapper) {
this.wrapper_ = wrapper;
this.stream_ = null;
this.url_ = "";
this.mediaSource_ = null;
this.mediaOpened_ = false;
this.channel_ = null;
this.blockList_ = [];
this.sourceBuffer_ = null;
this.video_ = null;
this.strings_ = p2p$.com.common.String;
this.global_ = p2p$.com.common.Global;
this.config_ = p2p$.com.selector.Config;
this.videoStatus_ = p2p$.com.webp2p.core.player.VIDEO_STATUS;
this.playerStatus_ = p2p$.com.webp2p.core.player.PLAY_STATES;
this.toMp4_ = null;

this.initFnum_ = 0;
this.fetchTimer_ = null;
this.metaData_ = null;
this.nextSegmentId_ = 0;
this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
this.preTime_ = 0;
this.preSegmentId_ = -1;
this.sourceIdle_ = true;
this.macSafariPattern_ = false;
this.actived_ = false;
// this.loop_ = 0;
this.urgentSegment_ = 0;
this.errorTimes_ = 0;
this.maxErrorTimes_ = 3;
this.duration_ = 0;
this.lastErrorTime_ = 0;
},

stopFetchTimer_ : function() {
if (this.fetchTimer_) {
clearInterval(this.fetchTimer_);
this.fetchTimer_ = null;
}
},

initialize_ : function(url, video, stream, channel) {
this.channel_ = channel;
this.channel_.setPlayer_(this);
this.url_ = url;
this.stream_ = stream;
this.video_ = video;
this.actived_ = true;
this.mediaOpened_ = false;

var mediaType = p2p$.com.selector.Enviroment.getMediaType_();
if (mediaType.mediasource) {
if (mediaType.ts&&this.config_.encode==0) {
this.macSafariPattern_ = true;
this.playerContext_.isEncode_ = false;
} else if (mediaType.mp4) {
this.toMp4_ = new p2p$.com.webp2p.segmentmp4.ToMp4();
this.playerContext_.isEncode_ = true;
}
}
this.firstPlayTime_=this.global_.getMilliTime_();
this.addVideoEvents_(this.video_);
this.startTimer_();
this.sendStatus_({type:"PLAYER.INIT"})
return true;
},
startTimer_ : function() {
this.onLoop_();
if (this.fetchTimer_) {
clearInterval(this.fetchTimer_);
}
this.fetchTimer_ = setInterval(this.onLoop_.bind(this), this.fectchInterval_);
},
play : function() {
if (!this.video_) {
return;
}
if (this.video_.paused) {
this.video_.play();
}
},
getBlock_:function()
{
return true;
},
onLoop_ : function() {
if (!this.metaData_) {
this.getMetaData_();
} else {
if (this.actived_) {
this.getSegment_();
this.playSegment_();
}
}
},

getMetaData_ : function() {
if ((this.channel_.metaData_ && this.channel_.metaData_.p2pGroupId_) || (this.channel_.metaData_ && this.channel_.onMetaCompleteCode_ == 302)) {
this.metaData_ = this.channel_.metaData_;
this.pictureHeight_ = this.metaData_.pictureHeight_;
this.pictureWidth_ = this.metaData_.pictureWidth_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMetaData_: height={1},width={2}",this.tag_,this.pictureHeight_,this.pictureWidth_));
}
},

refreshUrgentSegment_ : function(segmentId) {
if (!this.playerContext_.bufferd_) {
return;
}
var vtime = this.video_.currentTime;
if (vtime > 1) {
var segment = this.getSegmentByVideoTime_(vtime);
if (segment) {
this.urgentSegment_ = segment.id_;
if(this.nextSegmentId_>0&&this.nextSegmentId_<this.urgentSegment_)
{
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} nextSegmentId({1}) need change for urgentSegment({2})",this.tag_,this.nextSegmentId_,this.urgentSegment_));
this.nextSegmentId_ = this.urgentSegment_+1;
}
return;
}
}
this.urgentSegment_ = segmentId;
},
getSegmentByVideoTime_ : function(time) {
time = time * 1000;
var temp = null;
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.timestamp_ <= time && time <= (segment.timestamp_ + segment.duration_)) {
temp = segment;
}
}
return temp;
},
getSegment_ : function() {
if (this.blockList_.length >= 1) {
return;
}
if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekInit) {
this.firstSeekStatus_ = this.kFirstSeekWaitDownLoadSegment;
var seek2Segment = this.findSegment_(this.firstSeekPosition_);
if (seek2Segment) {
this.nextSegmentId_ = seek2Segment.id_;
this.urgentSegment_ = this.nextSegmentId_;
this.preSeekTime_ = this.firstSeekPosition_;
} else {
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getSegment({1}) seekPosition({2})",this.tag_,this.nextSegmentId_, this.firstSeekPosition_));
}

var tempBlock = this.getBlock_(this.nextSegmentId_);
if (!tempBlock) {
if (this.nextSegmentId_ != -1) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getSegment({1}) return({2})",this.tag_,this.nextSegmentId_, tempBlock));
}
return;
}
this.refreshUrgentSegment_(tempBlock.id_);
var streamInfo = this.stream_.requestPlaySlice_(this.channel_.getId_(), tempBlock.id_, this.urgentSegment_);

if (!streamInfo || !streamInfo.stream) {
var nowTime = new Date().getTime();
if (!this.lastSegmentFailedLogTime_ || (this.lastSegmentFailedLogTime_ + 10000) < nowTime) {
this.lastSegmentFailedLogTime_ = nowTime;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::vtime({1}) requestSegment({2}) stream({3}) urgentSegment({4})",this.tag_,this.video_ ? this.video_.currentTime.toFixed(2) : 0, tempBlock.id_, (streamInfo.stream != null), this.urgentSegment_));
}
return null;
}
this.preSegmentId_ = tempBlock.id_;
this.nextSegmentId_ = tempBlock.nextId_;
if(this.nextSegmentId_!=(this.preSegmentId_+1))
{
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getSegment nextSegment mable error! preId({1}),next({2})",this.tag_,this.preSegmentId_,this.nextSegmentId_));
}
var _params={
width : tempBlock.pictureWidth_ || 960,
height : tempBlock.pictureHeight_ || 400,
segmentIndex:this.initFnum_,
encode:this.playerContext_.isEncode_
};
var info = this.getStreamInfo_(streamInfo.stream,_params,tempBlock);
tempBlock.timestamp_ = info.start;
this.initFnum_++;
this.blockList_.push({
data : info.stream,
block : tempBlock,
mime : this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_)
});
},
getStreamInfo_:function(stream,params,block){
var _stream = stream;
var _start = block.startTime_;
var startChangeTime = this.global_.getMilliTime_();
if(this.toMp4_)
{
_stream = this.toMp4_.processFileSegment_(stream,params);
this.playerContext_.avccName_ = this.toMp4_.getMediaStreamAvccName_();
this.playerContext_.aacName_ = this.toMp4_.getMediaStreamAacName_();
_start = this.toMp4_.startTime;
var endChangeTime = this.global_.getMilliTime_();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} turn to mp4, segmentid({1}), before({2}), after({3}),timeuse({4}),playtime({5}),nextSegmentId({6}),startTime({7}),params({8})",this.tag_,block.id_, stream.length, _stream.length, ((endChangeTime - startChangeTime) / 1000).toFixed(1),this.video_ ? this.video_.currentTime.toFixed(2) : 0, this.nextSegmentId_,_start,JSON.stringify(params)));
}
return {"stream":_stream,"start":_start};
},
findSegment_ : function(time) {
var segment = null;
if (this.metaData_) {
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
segment = this.metaData_.segments_[n];
if (segment.startTime_ <= time * 1000 && time * 1000 < segment.startTime_ + segment.duration_) {
return segment;
}
}
}
return null;
},

playSegment_ : function() {
},

calculateBufferLength_ : function() {
if (!this.video_) {
return;
}
var _st = 0;
var _ed = 0;
this.preTime_ = this.video_.currentTime;
this.playerContext_.bufferLength_ = 0;
if (!this.playerContext_.bufferd_) {
return;
}
var start_ = -1;
var end_ = -1;
for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
_st = this.playerContext_.bufferd_.start(i);
_ed = this.playerContext_.bufferd_.end(i);

if (this.isFirstSegment_) {
this.playerContext_.bufferLength_ = _ed - _st;
this.isFirstSegment_ = false;
if (this.onErrorReplay_) {
this.onErrorReplay_ = false;
if (_st <= this.errorReplayTime_ && this.errorReplayTime_ <= _ed) {
this.video_.currentTime = this.errorReplayTime_;
} else {
this.video_.currentTime = _st;
}
}
if(this.macSafariPattern_){
this.resetSeekTo_=Math.ceil(_st*1000)/1000;
this.video_.currentTime = this.resetSeekTo_;
}
if(this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive){
this.video_.currentTime = _st;
this.onBufferEndAndOnPrepared_();
this.video_.play();
this.playNextVideo_ = null;
}
} else {
if(start_==-1)
{
start_ = _st;
end_ = _ed;
}
else
{
if(_st - end_ < 1)//小于1秒内的不连贯buffer属于误差范围，归为一个buffer长度
{
end_ = _ed;
}
else
{
start_ = _st;
end_ = _ed;
}
}
if(this.preTime_<start_&&start_<1){
this.playerContext_.bufferLength_=(end_-start_);
continue;
}
if(this.preTime_&&start_<=this.preTime_&&end_>=this.preTime_)
{
this.playerContext_.bufferLength_=(end_-this.preTime_);
continue;
}
}
}
},

existTime_ : function(value) {
var b = false;
for ( var i = 0; i < this.playerContext_.buffers_.length; i++) {
var _start = this.playerContext_.buffers_[i][0];
var _end = this.playerContext_.buffers_[i][1];
if (value >= _start && value <= _end) {
b = true;
break;
}
}
return b;
},

createMediaSource_ : function() {
var media = null;
try {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createMediaSource...",this.tag_));
media = new MediaSource();
this.onMediaSourceOpenBinded_ = this.onMediaSourceOpen_.bind(this);
this.onMediaSourceEndedBinded_ = this.onMediaSourceEnded_.bind(this);
this.onMediaSourceClosedBinded_ = this.onMediaSourceClosed_.bind(this);
this.onMediaSourceErrorBinded_ = this.onMediaSourceError_.bind(this);

media.addEventListener('sourceopen', this.onMediaSourceOpenBinded_);
media.addEventListener('sourceended', this.onMediaSourceEndedBinded_);
media.addEventListener('sourceclose', this.onMediaSourceClosedBinded_);
media.addEventListener('error', this.onMediaSourceErrorBinded_);

this.actived_ = true;
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add media source failed: {1}",this.tag_,(e || "").toString()));
}
return media;
},

removeSourceBuffer_ : function() {
if (!this.mediaSource_) {
return;
}
// this.mediaSource_.endOfStream();
try {
if (this.sourceBuffer_) {
this.sourceBuffer_.abort();
this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
this.removeSourceEvents_(this.sourceBuffer_);
this.sourceBuffer_ = null;
}
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::remove sourcebuffer failed: {1}",this.tag_,(e || "").toString()));
}
},

clearMediaSource_ : function() {
this.mediaOpened_ = false;
if (!this.mediaSource_) {
return;
}

try {
if (this.sourceBuffer_) {
if(this.mediaSource_.readyState=="open"){
this.sourceBuffer_.abort();
this.mediaSource_.removeSourceBuffer(this.sourceBuffer_);
}
this.removeSourceEvents_(this.sourceBuffer_);
this.sourceBuffer_ = null;
}
this.mediaSource_.endOfStream();
this.mediaSource_.removeEventListener('sourceopen', this.onMediaSourceOpenBinded_);
this.mediaSource_.removeEventListener('sourceended', this.onMediaSourceEndedBinded_);
this.mediaSource_.removeEventListener('sourceclose', this.onMediaSourceClosedBinded_);
this.mediaSource_.removeEventListener('error', this.onMediaSourceErrorBinded_);
this.mediaSource_ = null;
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Clear media source failed: {1}",this.tag_,(e || "").toString()));
}
},

formatMimeTypeName_ : function(avcc, aac) {
var typeName = 'video/mp2t; codecs="avc1.64001f"';
if (avcc) {
if (this.playerContext_.isEncode_) {
typeName = 'video/mp4; codecs="' + avcc + ', ' + aac + '"';
} else {
typeName = 'video/mp2t; codecs="' + avcc + '"';
}
}
return typeName;
},
addMediaSourceHeader_ : function() {
var _b = false;
var typeName = this.formatMimeTypeName_(this.playerContext_.avccName_, this.playerContext_.aacName_);
var mediaDescriptions = "";
if (this.mediaSource_) {
if(!this.sourceBuffer_)
{
try {
if (this.mediaSource_.sourceBuffers.length > 0) {
return true;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add media source header, type: {1}, medias: {2}",this.tag_,typeName, mediaDescriptions));
this.sourceBuffer_ = this.mediaSource_.addSourceBuffer(typeName);
this.sourceIdle_ = true;
this.sourceMime_ = typeName;
this.addSourceEvents_(this.sourceBuffer_);
_b = true;
} catch (err) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add media source header, type: {1}, medias: {2}, error: {3}",this.tag_,typeName,mediaDescriptions, err.toString()));
this.clearMediaSource_();
_b = false;
}
}
}
return _b;
},

onMediaSourceOpen_ : function(evt) {
if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
return;
}

P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource open, {1} arguments",this.tag_,arguments.length));
if (this.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
this.mediaSource_.duration = this.channel_.metaData_.totalDuration_ / 1000;
}
this.mediaOpened_ = true;
this.addMediaSourceHeader_();
this.playSegment_();
},

onMediaSourceEnded_ : function(evt) {
if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource end, {1} arguments,({2}),({3})",this.tag_,arguments.length, arguments[1], arguments[2]));
},

onMediaSourceClosed_ : function(evt) {
if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMediaSource close, {1} arguments",this.tag_,arguments.length));
this.actived_ = false;
this.mediaOpened_ = false;
},

onMediaSourceError_ : function(evt) {
if (!this.mediaSource_ || this.mediaSource_ != evt.target) {
return;
}
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onMediaSource error, {1} arguments",this.tag_,arguments.length));
this.actived_ = false;
this.mediaOpened_ = false;
},

addSourceBufferListEvent_ : function() {
var bufferlists = this.mediaSource_.sourceBuffers;
this.onRemoveSourceBufferBinded_ = this.onRemoveSourceBuffer_.bind(this);
this.onAddSourceBufferBinded_ = this.onAddSourceBuffer_.bind(this);
bufferlists.addEventListener('removesourcebuffer', this.onRemoveSourceBufferBinded_);
bufferlists.addEventListener('addsourcebuffer', this.onAddSourceBufferBinded_);
},

onRemoveSourceBuffer_ : function() {
this.sourceBufferRemoved_ = true;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removesourcebuffer...",this.tag_));
},

onAddSourceBuffer_ : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onAddSourceBuffer...",this.tag_));
},

addSourceEvents_ : function(source) {
try {

this.onSourceUpdateEndBinded_ = this.onSourceUpdateEnd_.bind(this);
this.onSourceUpdateBinded_ = this.onSourceUpdate_.bind(this);
this.onSourceUpdateStartBinded_ = this.onSourceUpdateStart_.bind(this);
this.onSourceUpdateErrorBinded_ = this.onSourceUpdateError_.bind(this);

source.addEventListener('updateend', this.onSourceUpdateEndBinded_);
source.addEventListener('update', this.onSourceUpdateBinded_);
source.addEventListener('updatestart', this.onSourceUpdateStartBinded_);
source.addEventListener('error', this.onSourceUpdateErrorBinded_);
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add source event failed: {1}",this.tag_,(e || "").toString()));
}
},

removeSourceEvents_ : function(source) {
try {
source.removeEventListener('updateend', this.onSourceUpdateEndBinded_);
source.removeEventListener('update', this.onSourceUpdateBinded_);
source.removeEventListener('updatestart', this.onSourceUpdateStartBinded_);
source.removeEventListener('error', this.onSourceUpdateErrorBinded_);
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Remove source event failed: {1}",this.tag_,(e || "").toString()));
}
},

onSourceUpdateStart_ : function(evt) {
if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
return;
}
// P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source update start",this.tag_));
this.sourceIdle_ = false;
},

onSourceUpdate_ : function(evt) {
if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
return;
}
//		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source onUpdate",this.tag_));
},

onSourceUpdateEnd_ : function(evt) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Source updatedEnd",this.tag_));
if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
return;
}
this.sourceIdle_ = true;
if (this.firstSeekStatus_ != undefined && this.firstSeekStatus_ == this.kFirstSeekWaitDownLoadSegment) {
this.video_.currentTime = this.preSeekTime_;
this.firstSeekStatus_ = this.kFirstSeekDownLoadSegmentOk;
}

try {
if(this.sourceBuffer_){
this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
}
else
{
this.playerContext_.bufferd_ = null;
}
} catch (err) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} buffered error ({1})",this.tag_,err));
}

var currenTime = this.video_.currentTime;
var ranges_=[];
if (this.playerContext_.bufferd_ && this.playerContext_.bufferd_.length > 0) {
for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
ranges_.push([this.playerContext_.bufferd_.start(i),this.playerContext_.bufferd_.end(i)]);
}
this.sendStatus_({"type":"VIDEO.BUFFER.RANGE","range":ranges_,"dur":this.getDuration_(),"time":currenTime});
}
},

onSourceUpdateError_ : function(evt) {
if (!this.sourceBuffer_ || this.sourceBuffer_ != evt.target) {
return;
}
this.removeSourceEvents_(this.sourceBuffer_);
this.sendStatus_({"type":"VIDEO.PLAY.ERROR","code":50001,"info":"update Source error!"});
},

addVideoEvents_ : function(video) {
var events = this.playerStatus_.VideoEvents;
this.videoStatusHandlerBinded_ = this.videoStatusHandler_.bind(this);
for ( var i = 0; i < events.length; i++) {
try {
video.addEventListener(events[i], this.videoStatusHandlerBinded_);
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Add video event({1}) failed: {2}",this.tag_,events[i], (e || "").toString()));
}
}
},

removeVideoEvents_ : function(video) {
var events = this.playerStatus_.VideoEvents;
for ( var i = 0; i < events.length; i++) {
try {
video.removeEventListener(events[i], this.videoStatusHandlerBinded_);
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Remove video event({1}) failed: {2}",this.tag_,events[i], (e || "").toString()));
}
}
},

videoStatusHandler_ : function(evt) {
if (!this.video_ || this.video_ != evt.target) {
return;
}

var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
var type = evt.type;
switch (type) {
case "abort":
break;
case "canplay":
this.onVideoCanPlay_();
break;
case "canplaythrough":
this.onCanPlayThrough_();
break;
case "durationchange":
break;
case "emptied":
break;
case "ended":
this.onEnded_();
break;
case "error":
this.onError_();
break;
case "loadeddata":
this.onLoadedData_();
break;
case "loadedmetadata":
this.onVideoLoadedMetaData_();
break;
case "loadstart":
this.loadStart_();
break;
case "pause":
this.onVideoPuase_();
break;
case "play":
this.onVideoPlay_();
break;
case "playing":
this.onVideoPlaying_();
break;
case "progress":
this.onVideoProgress_();
break;
case "ratechange":
break;
case "seeked":
this.onVideoSeeked_();
break;
case "seeking":
this.onVideoSeeking_();
break;
case "stalled":
break;
case "suspend":
break;
case "timeupdate":
this.onVideoTimeUpdate_();
break;
case "volumechange":
break;
case "waiting":
this.onVideoWaiting_();
break;
default:
break;
}
},
onVideoProgress_ : function() {

},
loadStart_ : function() {
this.sendStatus_({type:"VIDEO.PLAY.START"});
this.playerContext_.videoStatus_ = this.videoStatus_.loadstart;
},

onLoadedData_ : function() {
this.sendStatus_({type:"VIDEO.PLAY.LOAD"});
this.playerContext_.videoStatus_ = this.videoStatus_.loadeddata;
},

onVideoLoadedMetaData_ : function() {
this.videoDuration_ = this.video_.duration ? this.video_.duration.toFixed(1) : 0;
this.sendStatus_({type:"VIDEO.META.INFO",info:{dur:this.videoDuration_}});
},

onVideoTimeUpdate_ : function() {
this.errorTimes_ = 0;
},

onVideoSeeking_ : function() {
var time = this.video_.currentTime ? this.video_.currentTime : 0;
if(this.preTime_ == time)
{
return;
}
this.preSeekTime_ = time;
this.sendStatus_({type:"VIDEO.PLAY.SEEKING",pause:this.video_.paused});
this.seekingTime_=this.global_.getMilliTime_();
this.playerContext_.videoStatus_ = this.videoStatus_.seeking;
this.seek2(this.preSeekTime_);
},

onVideoSeeked_ : function() {
var time = this.video_.currentTime ? this.video_.currentTime : 0;
this.playerContext_.videoStatus_ = this.videoStatus_.seeked;
this.seekedTime_ = this.global_.getMilliTime_();
var params={};
params["utime"]=this.seekedTime_-this.seekingTime_;
params["pos"]=time;
this.sendStatus_({type:"VIDEO.PLAY.SEEKED",params:params,pause:this.video_.paused});
if (!this.video_.paused) {
this.onVideoPlay_();
return;
}
this.video_.play();
},
onVideoPuase_ : function() {
this.playerContext_.videoStatus_ = this.videoStatus_.pause;
this.sendStatus_({type:"VIDEO.PLAY.PAUSE"});
},
onVideoPlay_ : function() {
if(this.playerContext_.videoStatus_ == this.videoStatus_.pause){
this.sendStatus_({type:"VIDEO.PLAY.RESUME"});
}
},
onVideoWaiting_ : function() {
},
onVideoCanPlay_ : function() {
if (this.playerContext_.videoStatus_ == this.videoStatus_.loadeddata) {
this.playerContext_.videoStatus_ = this.videoStatus_.canplay;
if (this.firstSeekTime_) {
this.video_.currentTime = this.firstSeekTime_;
}
}
},
onCanPlayThrough_ : function() {
},
onVideoPlaying_ : function() {
this.playerContext_.videoStatus_ == this.videoStatus_.playing;
if(this.firstPlayingTime_==-1)
{
this.firstPlayingTime_=this.global_.getMilliTime_();
this.sendStatus_({"type":"VIDEO.PLAY.FIRST","init":this.firstPlayTime_,"meta":this.channel_.channelOpenedTime_,"add":this.firstAddDataTime_,"playing":this.firstPlayingTime_})
return;
}
this.sendStatus_({type:"VIDEO.PLAY.PLAYING"});
},

onBufferEndAndOnPrepared_ : function() {
if (this.playerContext_.videoStatus_ == this.videoStatus_.loadstart) {
this.playerContext_.videoStatus_ = this.videoStatus_.canplay;
if (!this.firstOnPrepared_) {
// throw the onprepared event at first play only
this.firstOnPrepared_ = true;
this.sendStatus_({type:"VIDEO.PLAY.PREPARED"});
} else {
this.video_.play();
}
}
},

onEnded_ : function(from) {
var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
this.sendStatus_({type:"VIDEO.PLAY.END"});
},

onError_ : function() {
var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
var code = -100;
if (this.video_ && this.video_.error) {
code = this.video_.error.code;
}
this.actived_ = false;
var nowTime = new Date().getTime();
if (nowTime - this.lastErrorTime_ >= 4000) {
this.lastErrorTime_ = nowTime;
return true;
}
var info = "";
switch (code) {
case 1:
info = "MEDIA_ERR_ABORTED";
break;
case 2:
info = "MEDIA_ERR_NETWORK";
break;
case 3:
info = "MEDIA_ERR_DECODE";
break;
case 4:
info = "MEDIA_ERR_SRC_NOT_SUPPORTED";
break;
default:
info = "";
}
code += 10000;
this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code,info:info});
return false;
},

stop_ : function() {
this.actived_ = false;
this.stopFetchTimer_();
this.clearMediaSource_();
if (this.video_) {
this.video_.pause();
this.removeVideoEvents_(this.video_);
// this.video_ = null;
}

this.blockList_ = [];
this.toMp4_ = null;
this.initFnum_ = 0;
this.metaData_ = null;
this.nextSegmentId_ = 0;
this.preTime_ = 0;
this.preSegmentId_ = -1;
this.playerContext_ = new p2p$.com.webp2p.core.player.Context();
this.breakTimes_ = 0;
this.bufferTimes_ = 0;
},

pause_ : function() {
if (this.video_) {
this.video_.pause();
}
},
replay_ : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::replay ...",this.tag_));
this.seek_(1);
},

seek_ : function(postion) {
},
getCurrentBuffered_ : function() {
var buffer = -1;
return buffer;
},
getCurrentPosition_ : function() {
if (this.video_) {
return this.video_.currentTime;
}
return 0;
},

getDuration_ : function() {
var dur = -1;
if(this.playerContext_.metaDataType_== p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod)
{
dur = this.channel_.metaData_.totalDuration_ / 1000;
}
return dur;
},
sendStatus_:function(params)
{
if(this.channel_){
this.channel_.sendStatus_(params,true);
}
this.wrapper_.sendStatus_(params);
}
});
p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.PLAY_TYPE = {
kPlayTypeBinary : 0,// 二进制方式
kPlayTypeM3U8 : 1,
};

p2p$.com.webp2p.core.player.VIDEO_STATUS = {
loadstart : 'loadstart',
loadeddata : 'loadeddata',
canplay : 'canplay',
seeking : 'seeking',
seeked : 'seeked',
playing : 'playing',
pause : 'pause',
breakstart : 'breakstart',
breakend : 'breakend',
replay : 'replay'
};

p2p$.com.webp2p.core.player.PLAY_STATES = {
status : '',
IDE : 'IDE',
PLAY : 'PLAY',
PLAYING : 'PLAYING',
PAUSE : 'PAUSE',
RESUME : 'RESUME',
SEEKING : 'SEEKING',
SEEKED : 'SEEKED',
// /video 事件
VideoEvents : [ "abort",// 当音频/视频的加载已放弃时
"canplay",// 当浏览器可以播放音频/视频时
"canplaythrough",// 当浏览器可在不因缓冲而停顿的情况下进行播放时
"durationchange",// 当音频/视频的时长已更改时
"emptied",// 当目前的播放列表为空时
"empty", "ended",// 当目前的播放列表已结束时
"error",// 当在音频/视频加载期间发生错误时
"loadeddata",// 当浏览器已加载音频/视频的当前帧时
"loadedmetadata",// 当浏览器已加载音频/视频的元数据时
"loadstart",// 当浏览器开始查找音频/视频时
"pause",// 当音频/视频已暂停时
"play",// 当音频/视频已开始或不再暂停时
"playing",// 当音频/视频在已因缓冲而暂停或停止后已就绪时
"progress",// 当浏览器正在下载音频/视频时
"ratechange",// 当音频/视频的播放速度已更改时
"seeked",// 当用户已移动/跳跃到音频/视频中的新位置时
"seeking",// 当用户开始移动/跳跃到音频/视频中的新位置时
"stalled",// 当浏览器尝试获取媒体数据，但数据不可用时
"suspend",// 当浏览器刻意不获取媒体数据时
"timeupdate",// 当目前的播放位置已更改时
"volumechange",// 当音量已更改时
"waiting" ]
};

p2p$.com.webp2p.core.player.Context = JClass.extend_({
playType_ : -1,
isEncode_ : false,
metaDataType_ : 0,
avccName_ : null,
aacName_ : null,
bufferd_ : null,
bufferLength_ : 0,
playState_ : "PLAY",
buffers_ : null,
currentPlayTime_ : 0,
videoStatus_ : "IDE",
lastCurrentTime_ : -1,

init : function() {
this.playType_ = -1;
this.isEncode_ = false;
this.metaDataType_ = -1;
this.avccName_ = null;
this.aacName_ = null;
this.bufferd_ = null;
this.bufferLength_ = 0;
this.playState_ = "PLAY";
this.buffers_ = [];
this.currentPlayTime_ = 0;
this.videoStatus_ = "";
this.lastCurrentTime_ = -1;
}
});
p2p$.ns('com.webp2p.core.player');

p2p$.com.webp2p.core.player.Creator = JClass.extend_({
channel_ : null,
player_ : null,
url_ : "",
video_ : null,
stream_ : null,
wrapper_ : null,
tag_:"com::webp2p::core::player::Creator",

init : function() {
this.channel_ = null;
this.player_ = null;
this.url_ = "";
this.video_ = null;
this.stream_ = null;
},

initialize_ : function(wrapper, url, video, stream) {
this.wrapper_ = wrapper;
this.url_ = url;
this.video_ = video;
this.stream_ = stream;
},

changeChannel_ : function(url) {
this.url_ = url;
this.channel_ != null ? this.channel_.close_():"";
this.player_.stop_();
this.player_ = null;
},

createPlayer_ : function() {

this.channel_ = this.stream_.requestPlay_(this.url_);
if (this.channel_ != null) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Create player open channel({1}) success",this.tag_,this.url_));
this.channel_.setListener_(this.wrapper_);
this.channel_.open();
if (this.channel_.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
// VOD
this.player_ = new p2p$.com.webp2p.core.player.VodPlayer(this.wrapper_);
if (this.wrapper_.config_.startTime>0) {
this.channel_.setFirstSeekTime_(this.wrapper_.config_.startTime);
}
} else {
// LIVE
this.player_ = new p2p$.com.webp2p.core.player.LivePlayer(this.wrapper_);
}

if (this.player_ != null) {
this.player_.initialize_(this.url_, this.video_, this.stream_, this.channel_);
if (this.player_.playerContext_.metaDataType_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod) {
if (this.wrapper_.config_.startTime>0) {
this.player_.firstSeekStatus_ = this.player_.kFirstSeekInit;
this.player_.firstSeekPosition_ = this.wrapper_.config_.startTime;
}
}
} else {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}.Create player failed",this.tag_));
}
} else {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Create player open channel({1}) failed",this.tag_,this.url_));
}
return this.player_;
}
});
p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.LivePlayer = p2p$.com.webp2p.core.player.BasePlayer.extend_({
isFirstSegment_ : false,
firstIndexUsed_ : false,
playNextDelayTime_ : 0,
suspendTimes_ : 0,

init : function(wrapper) {
this._super(wrapper);
this.tag_="com::webp2p::core::player:LivePlayer";
this.isFirstSegment_ = false;
this.playNextDelayTime_ = 0;
this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive;
this.lastDiscontinuitySegment_ = 0;
this.lastHandleSuspendTime_ = 0;
if(p2p$.com.webp2p.segmentmp4 != undefined)
{
this.toMp4_ = new p2p$.com.webp2p.segmentmp4.ToMp4();
}
},
play : function() {
if (!this.video_) {
return;
}
if (this.video_.paused) {
this.video_.play();
}
this.canHandleSuspend_ = true;
},
getBlock_ : function(nextSegment) {
if (!this.metaData_) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta data is null",this.tag_));
return null;
}

for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
var segment = this.metaData_.segments_[n];
var segment2 = this.metaData_.segments_[n + 1];
segment.nextId_ = segment2.id_;
if (n == this.metaData_.segments_.length - 2) {
segment2.nextId_ = segment2.id_;
}
}

for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (nextSegment == segment.id_) {
return segment;
}
if (n == this.metaData_.segments_.length - 1) {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::segment ({1}) not found,return default segment({2})",this.tag_,nextSegment,this.metaData_.segments_[0].id_));
}
}
return this.metaData_.segments_[0];
},

refreshUrgentSegment_ : function(segmentId) {
if (!this.playerContext_.bufferd_) {
return;
}
var vtime = this.video_.currentTime;
if (vtime > 1) {
var segment = this.getSegmentByVideoTime_(vtime);
if (segment) {
this.urgentSegment_ = segment.id_;
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::refreshUrgentSegment1 requestSegment({1}),urgentSegment({2})",this.tag_,segmentId,this.urgentSegment_));
return;
}
}
this.urgentSegment_ = segmentId - 1;
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::refreshUrgentSegment2 requestSegment({1}),urgentSegment({2})",this.tag_,segmentId, this.urgentSegment_));
},

getSegmentByVideoTime_ : function(time) {
time = time * 1000;
var temp = null;
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
// the current urgentSegment should be the latest urgentSegment_
if (segment.timestamp_ <= time && time <= segment.timestamp_ + segment.duration_ && segment.id_ > this.lastDiscontinuitySegment_) {
temp = segment;
}
}
return temp;
},
playSegment_ : function() {
this.calculateBufferLength_();
if (!this.playerContext_.avccName_&&this.playerContext_.isEncode_) {
return;
}
if (!this.mediaSource_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Create media source ...",this.tag_));
this.mediaSource_ = this.createMediaSource_();
this.video_.src = window.URL.createObjectURL(this.mediaSource_);
}
//mediasource创建超时，5秒超时
if (!this.sourceBuffer_) {
if (!this.mediaOpened_) {
this.delayTime_++;
if (this.delayTime_ > 50) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Play segment with delay count({1})",this.tag_,this.delayTime_));
}
return;
}
this.addMediaSourceHeader_();
return;
}
if (this.sourceBuffer_.updating) {
return;
}
if(this.blockList_.length==0)
{
return;
}
var streamInfo = this.blockList_[0];
if (streamInfo.block.index_ == 0 && !this.firstIndexUsed_) {
this.isFirstSegment_ = true;
this.firstIndexUsed_ = true;
}

if (this.addedSegment_ && streamInfo.block.timestamp_ < this.addedSegment_.timestamp_) {
if (!this.showDiscontinuity_) {
if (streamInfo.block.discontinuity_) {
this.showDiscontinuity_ = true;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::discontinuity true, segment({1})",this.tag_, streamInfo.block.id_));
} else {
streamInfo.block.discontinuity_ = true;
this.showDiscontinuity_ = true;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::discontinuity false, segment({1})",this.tag_, streamInfo.block.id_));
}
}
}

if (streamInfo.block.discontinuity_ && !this.playNextVideo_ && this.lastDiscontinuitySegment_ != streamInfo.block.id_) {
if (this.playerContext_.bufferLength_ < 0.1 || this.playNextDelayTime_ > 15) {
var offsetTime = ((streamInfo.block.timestamp_ || 0)) / 1000;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start to play next video, buffer({1}), delay({2}), offset({3}), mime({4}, {5} => {6})",this.tag_,this.playerContext_.bufferLength_.toFixed(3), this.playNextDelayTime_, offsetTime, streamInfo.mime == this.sourceMime_ ? "same": "diff", this.sourceMime_, streamInfo.mime));
// this.video_.pause();
this.video_.currentTime = offsetTime;
if (streamInfo.mime != this.sourceMime_) {
// play next video
this.clearMediaSource_();
this.playNextVideo_ = true;
this.isFirstSegment_ = true;
this.playerContext_.bufferd_ = null;
this.playerContext_.avccName_ = null;
this.playerContext_.aacName_ = null;
this.blockList_ = [];
} else if (this.sourceBuffer_.buffered.length > 0) {
this.sourceBuffer_.abort()
this.sourceBuffer_.remove(0, this.sourceBuffer_.buffered.end(this.sourceBuffer_.buffered.length - 1));
}
this.preTime_ = 0;
this.playNextDelayTime_ = 0;
this.showDiscontinuity_ = false;
this.addedSegment_ = null;
this.playerContext_.bufferLength_ = 0;
this.lastDiscontinuitySegment_ = streamInfo.block.id_;
} else {
if (this.playerContext_.bufferLength_ < 1) {
this.playNextDelayTime_++;
}
}
//			this.nextSegmentId_ = streamInfo.block.id_;
return null;
}
//		this.handleSuspend_();
if (this.blockList_.length <= 0 || this.playerContext_.bufferLength_ >= this.config_.bufferLength) {
return;
}
this.blockList_.shift();
if(this.firstAddDataTime_==-1)
{
this.firstAddDataTime_=this.global_.getMilliTime_();
}
this.sourceBuffer_.appendBuffer(streamInfo.data);
this.addedSegment_ = streamInfo.block;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add data success ,buffer length({1}),blockLength ({2}s), segmentId({3}), startTime({4}), timestamp({5}), discontinuity({6}), segment length ({7}), prev segment({8}), next segment({9})",this.tag_, this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000,streamInfo.block.id_, this.global_.getCurentTime_(streamInfo.block.startTime_ / 1000), streamInfo.block.timestamp_,streamInfo.block.discontinuity_, streamInfo.data.length, this.preSegmentId_, this.nextSegmentId_));
},

handleSuspend_ : function() {
if (!this.playerContext_.bufferd_ || !this.canHandleSuspend_) {
return;
}
var nowTime = new Date().getTime();
if (this.lastHandleSuspendTime_ + 500 > nowTime) {
return;
}
this.lastHandleSuspendTime_ = nowTime;
var temp = this.playerContext_.currentPlayTime_;
var bufferIndex = -1;
if (Math.abs(this.video_.currentTime - temp) < 0.1) {
// break
for ( var i = 0; i < this.playerContext_.bufferd_.length; i++) {
var start = this.playerContext_.bufferd_.start(i);
if (start > temp) {
bufferIndex = i;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} start ({1}),length ({2}),i ({3}),bufferIndex ({4})",this.tag_, start,this.playerContext_.bufferd_.length, i, bufferIndex));
break;
}
}
if (bufferIndex != -1) {
var seekto = this.playerContext_.bufferd_.start(bufferIndex);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} replay suspend seekto ({1}) ...",this.tag_, seekto));
try {
// this.video_.pause();
this.video_.currentTime = seekto;
this.video_.play();
if (bufferIndex >= 2) {
if (!this.macSafariPattern_) {
this.sourceBuffer_.remove(0, this.playerContext_.bufferd_.end(bufferIndex - 2));
}
this.playerContext_.bufferd_ = this.sourceBuffer_.buffered;
}
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} replay seek or remove error({1})",this.tag_, e));
}
this.suspendTimes_ = 0;
} else {
if (!this.suspendTimes_) {
this.suspendTimes_ = 0;
}
this.suspendTimes_++;
if (this.suspendTimes_ > 5) {
var seekto = temp + 0.2;
this.video_.currentTime = seekto;
this.suspendTimes_ = 0;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} replay2 suspend seekto ({1}) ...",this.tag_, seekto));
}
}
} else {
this.suspendTimes_ = 0;
}
this.playerContext_.currentPlayTime_ = this.video_.currentTime;
},

onVideoSeeking_ : function() {
},

onVideoSeeked_ : function() {
// this.video_.play();
},

onError_ : function() {
this.errorTimes_++;
this._super();
if (this.errorTimes_ > this.maxErrorTimes_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Player error {1} times...,return error",this.tag_,this.errorTimes_));
return;
}
this.clearMediaSource_();
// this.removeSourceBuffer_();
this.playNextVideo_ = true;
this.isFirstSegment_ = true;
this.playerContext_.bufferd_ = null;
this.playerContext_.avccName_ = null;
this.playerContext_.aacName_ = null;
this.blockList_ = [];
this.video_.pause();
this.onErrorReplay_ = true;
var findFlag = 0;
var segment = this.getSegmentByVideoTime_(this.playerContext_.currentPlayTime_);
if (segment) {
this.nextSegmentId_ = segment.id_;
findFlag = 1;
} else {
var timestamp = Date.parse(new Date());
var seek2Segment = this.findSegment_(timestamp / 1000);
if (seek2Segment) {
this.nextSegmentId_ = seek2Segment.id_;
findFlag = 2;
} else {
this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
findFlag = 3;
}
}
this.lastDiscontinuitySegment_ = 0;
this.playerContext_.bufferLength_ = 0;
this.actived_ = true;
this.playNextDelayTime_ = 0;
this.showDiscontinuity_ = false;
this.addedSegment_ = null;
this.playerContext_.bufferLength_ = 0;
this.errorReplayTime_ = this.playerContext_.currentPlayTime_;
this.playerContext_.currentPlayTime_ = 0;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::replay find segment by ({1}),nextSegmentId({2}),errorReplayTime({3})",this.tag_,findFlag,this.nextSegmentId_, this.errorReplayTime_));
},

onVideoTimeUpdate_ : function() {
this._super();
// this.playerContext_.currentPlayTime_ = this.video_.currentTime;
},
seek_ : function(postion) {
return;
}
});
p2p$.ns('com.webp2p.core.player');
p2p$.com.webp2p.core.player.VodPlayer = p2p$.com.webp2p.core.player.BasePlayer.extend_({
firstSeekStatus_ : -1,
addNextSegmentId_ : false,
addedSegment_ : null,
resetSeekTo_ : 0,

init : function(wrapper) {
this._super(wrapper);
this.tag_="com::webp2p::player::VodPlayer";
this.firstSeekStatus_ = -1;
this.firstSeekPosition_ = 0;
this.resetSeekTo_ = 0;
this.addNextSegmentId_ = false;
this.playerContext_.metaDataType_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
},
getBlock_ : function(nextSegment) {
if (this.metaData_) {
if (!this.addNextSegmentId_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getBlock first to set MetaData nextId for segment!",this.tag_));
for ( var n = 0; n < this.metaData_.segments_.length - 1; n++) {
var segment = this.metaData_.segments_[n];
var segment2 = this.metaData_.segments_[n + 1];
segment.nextId_ = segment2.id_;
if (n == this.metaData_.segments_.length - 2) {
segment2.nextId_ = -1;
}
this.addNextSegmentId_ = true;
}
}
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.id_ == nextSegment) {
return segment;
}
}
} else {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta data is null",this.tag_));
return null;
}
},

playSegment_ : function() {
if (!this.playerContext_.avccName_ && this.playerContext_.isEncode_) {
return;
}

if (!this.mediaSource_) {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Create media source ...", this.tag_));
this.sourceBuffer_ = null;
this.mediaSource_ = this.createMediaSource_();
this.video_.src = window.URL.createObjectURL(this.mediaSource_);
if (!this.firstSetSrc_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onvideosrc ...", this.tag_));
this.firstSetSrc_ = true;
}
}

if (!this.sourceBuffer_) {
this.delayTime_++;
if (this.delayTime_ > 500) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Play segment with delay count({1})", this.tag_, this.delayTime_));
}
return;
}
if (this.sourceBuffer_.updating) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::sourceBuffer_.updating ({1})", this.tag_, this.sourceBuffer_.updating));
return;
}
//判断视频在缓冲中
var currentTime = this.video_.currentTime.toFixed(1);
var vRemaining = this.video_.duration - this.video_.currentTime;
if (this.playerContext_.lastCurrentTime_ == currentTime && !this.video_.paused && !this.video_.ended){
if(this.playerContext_.bufferLength_ > 3)//存在缓冲，属于卡顿
{
this.breakTimes_++;//卡顿计数
if(this.playerContext_.videoStatus_ != p2p$.com.webp2p.core.player.VIDEO_STATUS.seeking&&this.breakTimes_>=5){
this.resetSeekTo_ = this.resetSeekTo_ + this.fectchInterval_*this.breakTimes_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} time({1}),seekTo({2}),resetSeekTo({3}), bufferLength({4})", this.tag_,currentTime, Number(currentTime)+this.resetSeekTo_/1000,this.resetSeekTo_, this.playerContext_.bufferLength_));
this.video_.currentTime = Number(currentTime)+this.resetSeekTo_/1000;
// this.video_.play();
this.breakTimes_=0;
}
}else if (Math.abs(vRemaining) > 5 ) {
this.bufferTimes_++;//加缓冲载数据计数
if (this.bufferTimes_ > 5) {
if (this.playerContext_.videoStatus_ == this.videoStatus_.canplay
|| this.playerContext_.videoStatus_ == this.videoStatus_.seeked
|| this.playerContext_.videoStatus_ == this.videoStatus_.seeking
|| this.playerContext_.videoStatus_ == this.videoStatus_.breakend) {
this.sendStatus_({type:"VIDEO.BUFFER.START"});
this.playerContext_.videoStatus_ = this.videoStatus_.breakstart;
}
}
}
}
if (this.playerContext_.lastCurrentTime_ != currentTime) {
if (this.playerContext_.videoStatus_ == this.videoStatus_.breakstart) {
this.sendStatus_({type:"VIDEO.BUFFER.END"});
this.playerContext_.videoStatus_ = this.videoStatus_.breakend;
}
this.resetSeekTo_=0;
this.breakTimes_ = 0;
this.bufferTimes_ = 0;
this.playerContext_.lastCurrentTime_ = currentTime;
}
//////
this.calculateBufferLength_();
if (this.blockList_.length <= 0 || this.playerContext_.bufferLength_ >= this.config_.bufferLength) {
return;
}
var streamInfo = this.blockList_[0];
this.blockList_.shift();
if (streamInfo.block.index_ == 0 && this.playerContext_.videoStatus_ != this.videoStatus_.seeking) {
this.isFirstSegment_ = true;
}
var existTime = streamInfo.block.startTime_ / 1000 + 2;
this.addedSegment_ = streamInfo.block;
if (this.existTime_(existTime) && !this.onErrorReplay_) {//判断buffer中是否存在该时刻的数据
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} Add data exist,ignore! segmentId({1})",this.tag_,streamInfo.block.id_));
return;
}
if(this.firstAddDataTime_==-1)//记录首次添加数据时间
{
this.firstAddDataTime_=this.global_.getMilliTime_();
}
this.sourceBuffer_.appendBuffer(streamInfo.data);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add data success ,buffer({1}),block({2}s), segment({3}), start time ({4}),  timestamp({5}),segment length ({6})",this.tag_,this.playerContext_.bufferLength_.toFixed(2), streamInfo.block.duration_ / 1000, streamInfo.block.id_,streamInfo.block.startTime_ / 1000, streamInfo.block.timestamp_, streamInfo.data.length));
},

seek : function(postion) {
if (!this.mediaSource_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Seek postion ({1}),mediaSource is null",this.tag_,postion));
return;
}
if (isNaN(postion)) {
return;
}
if (postion <= 1) {
postion = 1;
}
if (postion >= this.mediaSource_.duration) {
postion = this.mediaSource_.duration - 0.5;
}
var time = this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0;
this.preSeekTime_ = Number(postion).toFixed(0);
this.video_.currentTime = postion;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Seek vtime({1}) seekTo({2})",this.tag_,time, this.preSeekTime_));
},

seek2 : function(time) {
var seek2Segment = this.findSegment_(time);
if (seek2Segment) {
this.nextSegmentId_ = seek2Segment.id_;
try {
this.sourceBuffer_.abort();
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::seek2 abort error({1})",this.tag_,e));
}
this.blockList_ = [];
this.playerContext_.bufferLength_ = 0;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::seek2 seek to({1}), next segment({2}), state({3})",this.tag_,time, this.nextSegmentId_,this.playerContext_.playState_));
this.onLoop_();
} else {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::seek2 find segment failed, seek to({1}), next segment({2})",this.tag_,time,this.nextSegmentId_));
}
},

onVideoTimeUpdate_ : function() {
if (parseFloat(this.videoDuration_) < 1) {
return;
}
this._super();
var time = parseFloat(this.video_.currentTime ? this.video_.currentTime.toFixed(1) : 0);
this.playerContext_.currentPlayTime_ = time;
var remain = parseFloat(this.videoDuration_) - time;

// put a compulsory end event
if (Math.abs(remain) < 5 && !this.endTimer_) {
var me = this;
this.endTimer_ = setTimeout(function() {
me.endTimer_ = null;
if (parseFloat(me.videoDuration_) - parseFloat(me.video_.currentTime) < 5) {
if (!me.VideoEnd_) {
me.VideoEnd_ = true;
me.onEnded_(true);
}
}
}, 5000);
} else {
if (this.endTimer_ && Math.abs(remain) > 5) {
clearTimeout(this.endTimer_);
this.endTimer_ = null;
}
}

if (Math.abs(remain) <= 5) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Video time update, time({1}) remain({2})",this.tag_,time, remain));
}
if (Math.abs(remain) <= 0.5 && !this.VideoEnd_) {
this.VideoEnd_ = true;
this.onEnded_(false);
}
if (this.VideoEnd_ && parseFloat(this.videoDuration_) - time > 0.5) {
this.VideoEnd_ = null;
}
},
getCurrentBuffered : function() {
var buffer = -1;
if (this.video_) {
var curTime = this.video_.currentTime ? this.video_.currentTime : 0;
for ( var i = 0; i < this.video_.buffered.length; i++) {
var start = this.video_.buffered.start(i);
var end = this.video_.buffered.end(i);
if (start <= curTime && curTime <= end) {
buffer = end;
break;
}
}
}
return buffer;
},
onError_ : function() {
var isContinue = this._super();
if (!isContinue) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Player error stop play ...",this.tag_));
this.stop_();
return false;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Player error {1} times... init a new one",this.tag_,this.errorTimes_));
this.clearMediaSource_();
this.isFirstSegment_ = true;
this.onErrorReplay_ = true;
this.playerContext_.bufferd_ = null;
this.playerContext_.avccName_ = null;
this.playerContext_.aacName_ = null;
this.playerContext_.bufferLength_ = 0;
this.firstProgress_ = null;
this.blockList_ = [];
this.actived_ = true;
this.errorReplayTime_ = this.playerContext_.currentPlayTime_ + 1;
var seek2Segment = this.findSegment_(this.errorReplayTime_);
if (seek2Segment) {
this.nextSegmentId_ = seek2Segment.id_;
} else {
this.nextSegmentId_ = this.addedSegment_ ? this.addedSegment_.id_ : 0;
}

this.addedSegment_ = null;
this.playerContext_.currentPlayTime_ = 0;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::replay segment({1}),nextSegmentId2({2}),errorReplayTime({3})",this.tag_,(seek2Segment != null), this.nextSegmentId_, this.errorReplayTime_));
}
});
p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.BucketStatic = {
kLowDataCapacity : 30 * 1024 * 1024,
kUpperMemoryCapacity : 60 * 1024 * 1024,
kUpperDataCapacity : 1000 * 1024 * 1024
},

p2p$.com.webp2p.core.storage.Bucket = JClass.extend_({
name_ : "",
opened_ : false,
dataSize_ : 0,
dataCapacity_ : 0,
upperCapacity_ : 0,
maxOpenBlocks_ : 0,

init : function(name) {
this.name_ = name;
this.opened_ = false;
this.dataSize_ = 0;
this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity;
this.upperCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kUpperDataCapacity;
this.maxOpenBlocks_ = 500;
},

getName_ : function() {
return this.name_;
},

getDataSize_ : function() {
return this.dataSize_;
},

getDataCapacity_ : function() {
return this.dataCapacity_;
},

getMaxOpenBlocks_ : function() {
return this.maxOpenBlocks_;
},

setDataCapacity_ : function(size) {
var old = this.dataCapacity_;
if (size <= this.upperCapacity_) {
this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity > size ? p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity
: size;
} else {
this.dataCapacity_ = this.upperCapacity_;
}
return old;
},

available : function() {
return this.opened_;
},
});
/*
* 内存管理篮子
* */
p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.MemoryBlock = JClass.extend_({
archived_ : false,
activeTime_ : 0,
writeTime_ : 0,
archiveTime_ : 0,
data_ : "",

init : function() {
this.archived_ = false;
this.activeTime_ = 0;
this.writeTime_ = 0;
this.archiveTime_ = 0;
this.data_ = "";// new ArrayBuffer(0);
},
});

p2p$.com.webp2p.core.storage.MemoryBucket = p2p$.com.webp2p.core.storage.Bucket.extend_({
lowCapacity_ : false,
blocks_ : null,
manager_ : null,

init : function(manager) {
this.manager_ = manager;
this._super("memory");
this.lowCapacity_ = false;
this.blocks_ = new p2p$.com.common.Map();// p2p$.com.webp2p.core.storage.MemoryBlock();
},

open : function() {
this.blocks_.clear();
this.lowCapacity_ = false;
this.dataCapacity_ = 200 * 1024 * 1024;// memory.availableBytes_ / 5;
this.upperCapacity_ = this.dataCapacity_;
if (this.dataCapacity_ < p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity) {
this.lowCapacity_ = true;
this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kLowDataCapacity;
this.upperCapacity_ = this.dataCapacity_;
} else if (this.dataCapacity_ > p2p$.com.webp2p.core.storage.BucketStatic.kUpperMemoryCapacity) {
this.dataCapacity_ = p2p$.com.webp2p.core.storage.BucketStatic.kUpperMemoryCapacity;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Open successfully"));
this.opened_ = true;
return true;
},

close : function() {
this.opened_ = false;
this.blocks_.clear();
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Closed"));
return true;
},

clearExpiredBlocks_ : function(currentId) {
var removedCount = 0;
var minBlockTime = -1;
var elemIndex = null;
for ( var n = 0; n < this.blocks_.length; n++) {
// ignore current block
var elem = this.blocks_.element(n);
if (elem.key == currentId) {
continue;
}
if (minBlockTime < 0 || elem.value.writeTime_ < minBlockTime) {
elemIndex = elem;
minBlockTime = elem.value.writeTime_;
}
}
if (elemIndex != this.blocks_.element(this.blocks_.length - 1)) {
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::MemoryBucket::Clear expire block({0}), size({1}), last write({2})", elemIndex.key,
elemIndex.value.data_.length, p2p$.com.common.String.formatTime_(elemIndex.value.writeTime_, "yyyy-M-d h:m:s")));

removedCount++;
this.dataSize_ -= elemIndex.value.data_.length;
this.blocks_.erase(elemIndex.key);
var items = elemIndex.key.split("//");
if (items.length >= 3) {
for ( var n = 0; n < this.manager_.channels_.length; n++) {
var mapItem = this.manager_.channels_.element(n);
if (mapItem.value.id_ == items[1]) {
var channel = mapItem.value;
channel.resetSegmentPieceCompletion_(items[2]);
}
}
}

}
return removedCount;
},

exists : function(objectId) {
return this.blocks_.find(objectId);
},

archived : function(objectId) {
},

read : function(objectId, offset, size) {
var itrFind = this.blocks_.find(objectId);
if (!itrFind) {
return -1;
}
if (typeof size == 'undefined') {
size = p2p$.com.webp2p.core.common.Number.maxUnsignedValue_();
}
var block = this.blocks_.get(objectId);
var stream = null;
if (size == p2p$.com.webp2p.core.common.Number.maxUnsignedValue_()) {
stream = block.data_;
} else if (offset == 0 && size == block.data_.length) {
stream = block.data_;
} else {
stream = block.data_.subarray(offset, offset + size);
}
return stream;
},

write : function(objectId, offset, data, size) {
if (this.dataSize_ + size > this.dataCapacity_) {
while (this.dataSize_ + size > this.dataCapacity_) {
if (this.clearExpiredBlocks_(objectId) <= 0) {
break;
}
}
}
var block = this.blocks_.get(objectId);
block.activeTime_ = block.writeTime_ = p2p$.com.common.Global.getMilliTime_();

var minSize = offset + size;
var allocSize = (minSize > block.data_.length) ? (minSize - block.data_.length) : 0;
if (allocSize > 0) {
block.data_ = new Uint8Array(minSize);
this.dataSize_ += allocSize;
}
block.data_.set(data, offset);
return true;
},

archive : function(objectId, archived) {
},

reserve : function(objectId, size) {
var block = this.blocks_.get(objectId);
if (typeof block == 'undefined' || block == null) {
block = new p2p$.com.webp2p.core.storage.MemoryBlock();
this.blocks_.set(objectId, block);
}
block.activeTime_ = block.writeTime_ = p2p$.com.common.Global.getMilliTime_();
var allocSize = (size > block.data_.length) ? (size - block.data_.length) : 0;
if (allocSize > 0) {
block.data_ = new Uint8Array(size);
this.dataSize_ += allocSize;
}
return true;
},

remove : function(objectId) {
var itrFind = this.blocks_.find(objectId);
if (!itrFind) {
return -1;
}
var block = this.blocks_.get(objectId);
this.dataSize_ -= block.data_.length;
this.blocks_.erase(objectId);
return true;
}
});
p2p$.ns("com.webp2p.core.storage");

p2p$.com.webp2p.core.storage.Pool = {

buckets_ : null,
memoryBucket_ : null,

initialize_ : function(manager) {
this.buckets_ = [];
this.memoryBucket_ = null;
this.memoryBucket_ = new p2p$.com.webp2p.core.storage.MemoryBucket(manager);
this.buckets_.push(this.memoryBucket_);

for ( var n = 0; n < this.buckets_.length; n++) {
var item = this.buckets_[n];
if (!item.open()) {
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Open bucket({0}) failed", item.getName_()));
return false;
}
}
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Initialize successfully"));
return true;
},

exit : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Exiting...."));
for ( var n = 0; n < this.buckets_.length; n++) {
var item = this.buckets_[n];
item.close();
}
P2P_ULOG_INFO(P2P_ULOG_FMT("core::storage::Pool::Exited"));
},

getDefaultBucket_ : function() {
return this.memoryBucket_;
},

getMemoryBucket_ : function() {
return this.memoryBucket_;
}
};
p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.BitmapStatic = {
kMaxBitCount : 80 * 1000,
};

p2p$.com.webp2p.core.supernode.Bitmap = JClass.extend_({
data_ : null,

init : function() {
this.data_ = new p2p$.com.common.Map();
},

getValue : function(id) {
var index = id % p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
var offset = Math.floor(index / 8);
var retValue = {
value : 0,
};
if (index < 0 || offset < 0 || !this.data_.find2(offset, retValue)) {
return false;
}
// this.data_.find2(offset,retValue);
var value = retValue.value;// this.data_.get(offset);
var old = (value & (1 << (index % 8))) ? true : false;
return old;
},

setValue : function(id, bit) {

var index = id % p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
var offset = Math.floor(index / 8);
if (index < 0 || offset < 0) {
return false;
}
var value = this.data_.get(offset);
if (typeof value == 'undefined' || value == null) {
value = new Uint8Array(1);
this.data_.set(offset, value);
}
var old = (value & (1 << (index % 8))) ? true : false;
value |= (1 << (index % 8));
this.data_.set(offset, value);
return old;
},

reserve : function(size) {
},

clear : function(reserveBuffer) {
if (reserveBuffer) {
for ( var i = 0; i < this.data_.elements_.length; i++) {
this.data_.elements_[i].value = new Uint8Array(1);
}
} else {
this.data_.clear();
}
}
});
p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.Context = JClass.extend_({
url_ : null,
gslbData_ : null,
configData_ : null,
strings_:null,

// properties
debug_ : false,
drmEnabled_ : false,
streamId_ : "",
moduleVersion_ : "",
deviceType_ : "",
sosType_ : "",
playType_ : "",
platformId_ : "",
subPlatformId_ : "",
videoType_ : "",
videoFormat_ : "",
appUuid_ : "",
uid_ :"",
cid_ :"",
vid_ :"",
pid_ :"",
custid_:"",
lc_ :"",
token_ : "",
pay_ : "",
termId_ : "",
t3partyAppChannel_ : "",
addtionalParam1_ : "",
addtionalParam2_ : "",
addtionalParam3_ : "",
addtionalParams_ : 0,
terminalType_ : 0,
statReportInterval_ : 0, // seconds
specialPlayerTimeOffset_ : 0, // seconds offset for special hardware players such as S50, S40
specialPlayerTimeLimit_ : 0, // seconds limit for speical hardware player such as S240F, S250F
liveStorageMemoryOnly_ : false,
vodStorageMemoryOnly_ : 0,

// geo
isp_ : 0,
country_ : 0,
province_ : 0,
city_ : 0,
area_ : 0,
countryCode_ : "",
geo_ : "",
geoName_ : "",
clientIp_ : "",
gslbServerIp_ : "",
metaServerIp_ : "",

// cdn/p2p params
p2pServerVersion_ : 0,// p2p server protocol version, 1:1.0, 2: 2.0
p2pFetchRate_ : null, // percent, 0~1
p2pMaxPeers_ : 0, // count
p2pUrgentSize_ : 0, // second(s)
p2pUrgentLevel1_ : 0, // urgent size if playLevel == 1
p2pSharePeers_ : false, // enable share p2p peers to others
p2pUploadEnabled_ : false, // enable p2p upload
p2pUploadLimit_ : false, // limit p2p upload speed
p2pUploadThrottleInit_ : 0, // initial upload bandwidth for p2p upload throttle (byte/s)
p2pUploadThrottleAverage_ : 0, // estimated average upload bandwidth for p2p upload throttle (byte/s)
p2pUploadMaxReserved_ : 0, // max reserved upload bandwidth (byte/s)
p2pUrgentUploadEnabled_ : false, // to upload if download enter urgent area
p2pPeerId_ : "",// primary p2p peer id
p2pRtmfpPeerId_ : "",// fro rtmfp
p2pWebsocketPeerId_ : "", // for websocket
p2pWebrtcPeerId_ : "", // for webrtc
p2pMaxQPeers_ : 0, //
p2pHeartbeatInterval_ : 0, // interval to gather,tracker (seconds)
p2pShareRangeInterval_ : 0, // send range interval (seconds)
p2pMaxParallelRequestPieces_ : 0, // max parallel request pieces for p2p peers
p2pMaxUrgentRequestPieces_ : 0, // max parallel request pieces for p2p peers when urgent not fullfill
cdnSlowThresholdRate_ : 0, // to decide whether cdn speed is too slow compare with media bitrate
cdnDisabled_ : false, // disable download data from cdn
cdnMultiRequest_ : false, // request from multi-cdn servers
cdnMultiMaxHost_ : 0, // request maximum cdn servers
cdnStartTime_ : 0, // for advertisment, second(s)
playingPosition_ : 0, // the position now player used
downloadSpeedRatio_ : 0, // download speed control rate, compare with bitrate

// protocols
protocolCdnDisabled_ : false,
protocolRtmfpDisabled_ : false,
protocolWebsocketDisabled_ : false,
protocolWebrtcDisabled_ : false,

// protocol status
selectorServerHost_ : "",
gatherServerHost_ : "",
rtmfpServerHost_ : "",
trackerServerHost_ : "",
webrtcServerHost_ : "",
stunServerHost_ : "",

selectorConnectedTime_ : 0, // units: us
rtmfpServerConnectedTime_ : 0, // units: us
gatherServerConnectedTime_ : 0, // units: us
trackerServerConnectedTime_ : 0, // units: us, cde tracker
webrtcServerConnectedTime_ : 0,

cdnTotalNodeCount_ : 0,
rtmfpTotalNodeCount_ : 0,
websocketTotalNodeCount_ : 0,
webrtcTotalNodeCount_ : 0,

upnpMapCompleteTime_ : 0,
upnpMapSuccess_ : false,
upnpMappedInPort_ : 0,
upnpMappedOutPort_ : 0,
upnpMappedAddress_ : "",

hasDefaultTrackerServer_ : false,
hasDefaultWebrtcServer_ : false,
hasDefaultStunServer_ : false,
init : function() {
this.url_ = new p2p$.com.common.Url();
this.strings_ = p2p$.com.common.String;
this.debug_ = false;
this.drmEnabled_ = false;
this.terminalType_ = 1;
this.statReportInterval_ = 60;
this.specialPlayerTimeOffset_ = 0; // default disabled
this.specialPlayerTimeLimit_ = 0; // default disabled
this.liveStorageMemoryOnly_ = false;
this.vodStorageMemoryOnly_ = false;
this.videoFormat_ = "lm3u8";

// geo
this.isp_ = 0;
this.country_ = 0;
this.province_ = 0;
this.city_ = 0;
this.area_ = 0;

// cdn/p2p params
this.p2pServerVersion_ = 1; // 1.0
this.p2pFetchRate_ = 0.1;
this.p2pMaxPeers_ = 10;
this.p2pUrgentSize_ = 10;
this.p2pUrgentLevel1_ = 10;
this.p2pSharePeers_ = true;
this.p2pUploadEnabled_ = true;
this.p2pUrgentUploadEnabled_ = false;
this.p2pUploadLimit_ = false;
this.p2pUploadThrottleInit_ = 50000; // 50kB/s
this.p2pUploadThrottleAverage_ = 120000; // 100kB/s
this.p2pUploadMaxReserved_ = 30000; // 30kB/s
this.p2pMaxQPeers_ = 5;
this.p2pHeartbeatInterval_ = 30; // second(s)
this.p2pShareRangeInterval_ = 5; // second(s)
this.p2pMaxParallelRequestPieces_ = 20;
this.p2pMaxUrgentRequestPieces_ = 1;
this.cdnSlowThresholdRate_ = 1.0;
this.cdnDisabled_ = false;
this.cdnMultiRequest_ = true; // false;
this.cdnMultiMaxHost_ = 3;
this.cdnStartTime_ = 0;
this.playingPosition_ = 0;
this.downloadSpeedRatio_ = -1.0;

// protocol params
this.protocolCdnDisabled_ = false;
this.protocolRtmfpDisabled_ = false;
this.protocolWebsocketDisabled_ = false;
this.protocolWebrtcDisabled_ = false;

// status
// selectorServerPort_ = 0;
// gatherServerPort_ = 0;
// rtmfpServerPort_ = 0;
// trackerServerPort_ = 0;
this.selectorConnectedTime_ = 0;
this.rtmfpServerConnectedTime_ = 0;
this.gatherServerConnectedTime_ = 0;
this.trackerServerConnectedTime_ = 0;
this.webrtcServerConnectedTime_ = 0;

this.cdnTotalNodeCount_ = 0;
this.rtmfpTotalNodeCount_ = 0;
this.websocketTotalNodeCount_ = 0;
this.webrtcTotalNodeCount_ = 0;

this.upnpMapCompleteTime_ = 0;
this.upnpMapSuccess_ = false;
this.upnpMappedInPort_ = 0;
this.upnpMappedOutPort_ = 0;

this.hasDefaultTrackerServer_ = false;
this.hasDefaultWebrtcServer_ = false;
this.hasDefaultStunServer_ = false;
},
initialize_ : function(url, env) {
// properties
this.url_ = url;
this.moduleVersion_ = this.strings_.format("H5-{0}.{1}.{2}", p2p$.com.selector.Module.kH5MajorVersion,
p2p$.com.selector.Module.kH5MinorVersion, p2p$.com.selector.Module.kH5BuildNumber);
this.deviceType_ = this.strings_.toUpper_(this.url_.params_.get("hwtype"));
this.osType_ = this.url_.params_.get("ostype");
this.terminalType_ = this.strings_.parseNumber_(this.url_.params_.get("termid"), 1);
this.platformId_ = this.url_.params_.get("platid");
this.subPlatformId_ = this.url_.params_.get("splatid");
this.videoType_ = this.url_.params_.get("vtype");
this.streamId_ = this.url_.params_.has("stream_id") ? this.url_.params_.get("stream_id") : "";
this.appUuid_ = this.url_.params_.has("uuid") ? this.url_.params_.get("uuid") : "";
this.t3partyAppChannel_ = this.url_.params_.has("ch") ? this.url_.params_.get("ch") : "";
this.token_ = this.url_.params_.has("token") ? this.url_.params_.get("token") : "";
this.pay_ = this.url_.params_.has("payff") ? this.url_.params_.get("payff") : "";
this.termId_ = this.url_.params_.has("termid") ? this.url_.params_.get("termid") : "";
this.cid_ = this.url_.params_.has("cid") ? this.url_.params_.get("cid") : "";
this.vid_ = this.url_.params_.has("vid") ? this.url_.params_.get("vid") : "";
this.pid_ = this.url_.params_.has("pid") ? this.url_.params_.get("pid") : "";
this.uid_ = this.url_.params_.has("uid") ? this.url_.params_.get("uid") : "";
this.custid_ = this.url_.params_.has("custid") ? this.url_.params_.get("custid") : "";
this.lc_ = this.url_.params_.has("lc") ? this.url_.params_.get("lc") : "";

this.liveStorageMemoryOnly_ = env.liveStorageMemoryOnly_;
this.vodStorageMemoryOnly_ = env.vodStorageMemoryOnly_;

if (this.deviceType_ == "" || !env.deviceType_ == "") {
this.deviceType_ = env.deviceType_;
}
if (this.osType_ == "" || !env.osType_ == "") {
this.osType_ = env.osType_;
}
if (env.specialPlayerTimeOffset_ != 0) {
this.specialPlayerTimeOffset_ = env.specialPlayerTimeOffset_;
}
if (env.specialPlayerTimeLimit_ != 0) {
this.specialPlayerTimeLimit_ = env.specialPlayerTimeLimit_;
}
if (env.downloadSpeedRatio_ > 0) {
this.downloadSpeedRatio_ = env.downloadSpeedRatio_;
}

if (env.paramWebrtcServer_) {
this.hasDefaultWebrtcServer_ = true;
this.webrtcServerHost_ = "ws://" + env.paramWebrtcServer_;
}
if (env.paramTrackerServer_) {
this.hasDefaultTrackerServer_ = true;
this.gatherServerHost_ = env.paramTrackerServer_;
}
if (env.paramStunServer_) {
this.hasDefaultStunServer_ = true;
this.stunServerHost_ = "stun:" + env.paramStunServer_;
}
if (env.paramCloseWebrtc_) {
this.protocolWebrtcDisabled_ = env.paramCloseWebrtc_;
}
if (env.paramCloseWebsocket_) {
this.protocolWebsocketDisabled_ = env.paramCloseWebsocket_;
}

// addtional params
this.addtionalParams_ == "";
this.addtionalParam1_ = this.url_.params_.has("p1") ? this.url_.params_.get("p1") : "";
this.addtionalParam2_ = this.url_.params_.has("p2") ? this.url_.params_.get("p2") : "";
this.addtionalParam3_ = this.url_.params_.has("p3") ? this.url_.params_.get("p3") : "";
if (this.addtionalParam1_ != "" || this.addtionalParam2_ != "" || this.addtionalParam3_ != "") {
this.addtionalParams_ = this.strings_.format("p1={0}&p2={1}&p3={2}", this.addtionalParam1_, this.addtionalParam2_,
this.addtionalParam3_);
}
},

loadParams_ : function(params, customParams) {
if (customParams.hasOwnProperty("cdnMultiRequest")) {
this.cdnMultiRequest_ = customParams["cdnMultiRequest"];
}

if (params.hasOwnProperty("debug")) {
this.debug_ = params["debug"];
}
if (params.hasOwnProperty("mcdn")) {
this.cdnMultiRequest_ = params["mcdn"];
}
if (params.hasOwnProperty("ccdn")) {
this.cdnMultiMaxHost_ = params["ccdn"];
}
if (params.hasOwnProperty("dsratio")) {
this.downloadSpeedRatio_ = params["dsratio"];
}
},

loadData_ : function(data) {
this.gslbData_ = data;
this.geo_ = data["geo"];
this.geoName_ = data["desc"];
this.clientIp_ = data["remote"];
var geoValues = this.geo_.split(".");
if (geoValues.length > 0) {
this.countryCode_ = this.strings_.trim(geoValues[0]);
this.country_ = 0;
for ( var n = 0; n < this.countryCode_.length && n < 2; n++) {
this.country_ = this.country_ * 256 + (this.countryCode_[n]).charCodeAt();
}
}
if (geoValues.length > 1) {
this.province_ = this.strings_.parseNumber_(geoValues[1]);
}
if (geoValues.length > 2) {
this.city_ = this.strings_.parseNumber_(geoValues[2]);
}
if (geoValues.length > 3) {
this.isp_ = this.strings_.parseNumber_(geoValues[3]);
}
},

detectSpecialPlayerTimeOffset_ : function() {
},

resetPeerState_ : function() {
},
getAllStatus_ : function(result) {
result["drmEnabled"] = this.drmEnabled_;
result["geo"] = this.geo_;
result["geoName"] = this.geoName_;
result["clientIp"] = this.clientIp_;
result["gslbServerIp"] = this.gslbServerIp_;
result["metaServerIp"] = this.metaServerIp_;
result["deviceType"] = this.deviceType_;
result["osType"] = this.osType_;
result["statReportInterval"] = this.statReportInterval_;
result["specialPlayerTimeOffset"] = this.specialPlayerTimeOffset_;
result["specialPlayerTimeLimit"] = this.specialPlayerTimeLimit_;
result["liveStorageMemoryOnly"] = this.liveStorageMemoryOnly_;
result["vodStorageMemoryOnly"] = this.vodStorageMemoryOnly_;
result["downloadSpeedRatio"] = this.downloadSpeedRatio_;

result["p2pPeerId"] = this.p2pPeerId_;
result["p2pRtmfpPeerId"] = this.p2pRtmfpPeerId_;
result["p2pWebsocketPeerId"] = this.p2pWebsocketPeerId_;
result["p2pWebrtcPeerId"] = this.p2pWebrtcPeerId_;
result["p2pFetchRate"] = this.p2pFetchRate_;
result["p2pMaxPeers"] = this.p2pMaxPeers_;
result["p2pUrgentSize"] = this.p2pUrgentSize_;
result["p2pUploadEnabled"] = this.p2pUploadEnabled_;
result["p2pUploadLimit"] = this.p2pUploadLimit_;
result["p2pUploadThrottleInit"] = this.p2pUploadThrottleInit_;
result["p2pUploadThrottleAverage"] = this.p2pUploadThrottleAverage_;
result["p2pUploadMaxReserved"] = this.p2pUploadMaxReserved_;
result["p2pUrgentUploadEnabled"] = this.p2pUrgentUploadEnabled_;
result["p2pShareRangeInterval"] = this.p2pShareRangeInterval_;
result["p2pMaxParallelRequestPieces"] = this.p2pMaxParallelRequestPieces_;
result["p2pMaxUrgentRequestPieces"] = this.p2pMaxUrgentRequestPieces_;

result["cdnSlowThresholdRate"] = this.cdnSlowThresholdRate_;
result["cdnDisabled"] = this.cdnDisabled_;
result["cdnMultiRequest"] = this.cdnMultiRequest_;
result["cdnMultiMaxHost"] = this.cdnMultiMaxHost_;
result["cdnStartTime"] = this.cdnStartTime_;
result["playingPosition"] = this.playingPosition_;

result["selectorServerHost"] = this.selectorServerHost_;
result["gatherServerHost"] = this.gatherServerHost_;
result["rtmfpServerHost"] = this.rtmfpServerHost_;
result["trackerServerHost"] = this.trackerServerHost_;

var url = new p2p$.com.common.Url();
url.fromString_(this.webrtcServerHost_);
result["webrtcServerHost"] = url.host_ + ":" + url.port_;

result["protocolCdnDisabled"] = this.protocolCdnDisabled_;
result["protocolRtmfpDisabled"] = this.protocolRtmfpDisabled_;
result["protocolWebsocketDisabled"] = this.protocolWebsocketDisabled_;
result["protocolWebrtcDisabled"] = this.protocolWebrtcDisabled_;

result["selectorConnectedTime"] = this.selectorConnectedTime_;
result["rtmfpServerConnectedTime"] = this.rtmfpServerConnectedTime_;
result["webrtcServerConnectedTime"] = this.webrtcServerConnectedTime_;
result["gatherServerConnectedTime"] = this.gatherServerConnectedTime_;
result["trackerServerConnectedTime"] = this.trackerServerConnectedTime_;

result["cdnTotalNodeCount"] = this.cdnTotalNodeCount_;
result["rtmfpTotalNodeCount"] = this.rtmfpTotalNodeCount_;
result["webrtcTotalNodeCount"] = this.webrtcTotalNodeCount_;
result["websocketTotalNodeCount"] = this.websocketTotalNodeCount_;

result["upnpMapCompleteTime"] = this.upnpMapCompleteTime_;
result["upnpMapSuccess"] = this.upnpMapSuccess_;
result["upnpMappedInPort"] = this.upnpMappedInPort_;
result["upnpMappedOutPort"] = this.upnpMappedOutPort_;
result["upnpMappedAddress"] = this.upnpMappedAddress_;
}
});
p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD = {
kDataVerifyMethodDefault : 0,
kDataVerifyMethodCrc32 : 1
};

p2p$.com.webp2p.core.supernode.MetaData = JClass.extend_({
type_ : 0,
hlsMode_ : false,
directMetaMode_ : false,
rangeParamsSupported_ : false,
version_ : "",
allowCache_ : "",
targetDuration_ : 0,
programId_ : "",
programeType_ : "",
programVersion_ : "",
programDateTime_ : "",
p2pGroupId_ : "",
localMetaContent_ : "",
mediaSequence_ : 0,
lastReceiveSpeed_ : 0,
pictureWidth_ : 0,
pictureHeight_ : 0,
// totalTnLength_;
// totalPnLength_;
// totalSegmentCount_;
directCount_ : 0,
moreUrlCount_ : 0,
p2pPieceCount_ : 0,
verifyMethod_ : 0,
totalDuration_ : 0,
directDuration_ : 0,
createTime_ : 0,
updateTime_ : 0,
urgentSegmentId_ : 0,
dataSize_ : 0,
totalGapDuration_ : 0,

taskId_ : "",
storageId_ : "",
channelUrl_ : "",
sourceUrl_ : "",
finalUrl_ : "",
sourceServer_ : "",
morePrimaryUrls_ : null,
segments_ : null,

tn2SegmentIndexMap_ : null,
pn2SegmentIndexMap_ : null,

strings_:null,
global_:null,

init : function() {
this.segments_ = [];
this.tn2SegmentIndexMap_ = new p2p$.com.common.Map();
this.pn2SegmentIndexMap_ = new p2p$.com.common.Map();
this.strings_ = p2p$.com.common.String;
this.global_ = p2p$.com.common.Global;
this.type_ = p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod;
this.hlsMode_ = true;
this.directMetaMode_ = false;
this.rangeParamsSupported_ = true; // default support for rstart, rend params
this.verifyMethod_ = p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD.kDataVerifyMethodDefault;
this.tidy();
},
// readBigUnsignedInteger( const char *data );

tidy : function() {
this.targetDuration_ = 0;
this.pictureWidth_ = 0;
this.pictureHeight_ = 0;
// totalTnLength_ = 0;
// totalPnLength_ = 0;
// totalSegmentCount_ = 0;
this.directCount_ = 0;
this.moreUrlCount_ = 0;
this.p2pPieceCount_ = 0;
this.totalDuration_ = 0;
this.directDuration_ = 0;
this.mediaSequence_ = 0;
this.lastReceiveSpeed_ = 0;
this.updateTime_ = 0;
this.createTime_ = this.global_.getMilliTime_();
this.urgentSegmentId_ = -1;
this.dataSize_ = 0;
this.totalGapDuration_ = 0;

this.version_ = "";
this.programId_ = "";
this.programVersion_ = "";
this.p2pGroupId_ = "";
this.segments_ = [];
this.localMetaContent_ = "";
this.tn2SegmentIndexMap_.clear();
this.pn2SegmentIndexMap_.clear();
},
fork : function() {
var result = new p2p$.com.webp2p.core.supernode.MetaData();
for ( var n in this) {
result[n] = this[n];
}
return result;
},
load : function(values, elapsedTime, needBuildIndexes) {
this.tidy();
this.hlsMode_ = true;
this.moreUrlCount_ = 0;

var lines = values.split("\n");
var maxPieceId = 0;
var nonDirectCount = 0;
var lastSegment = new p2p$.com.webp2p.core.supernode.MetaSegment();
lastSegment.m3u8LoadTime_ = elapsedTime;
var needMoreUrls = (this.directMetaMode_ || p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == this.type_);
if (needMoreUrls) {
lastSegment.moreMediaUrls_ = [];
}
this.updateTime_ = this.global_.getMilliTime_();
for ( var n = 0; n < lines.length; n++) {
// if (n == 100) break;
var line = lines[n];
line = this.strings_.trim(line);
if ("" == line) {
continue;
}
if (line[0] != '#') {
if (lastSegment.id_ < 0 || (this.directMetaMode_ && this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive)) {
lastSegment.id_ = this.segments_.length;
}

if (this.directMetaMode_ && lastSegment.directMode_) {
lastSegment.p2pDisabled_ = true;
}
lastSegment.pictureHeight_ = this.pictureHeight_;
lastSegment.pictureWidth_ = this.pictureWidth_;
lastSegment.url_ = line;
lastSegment.mediaUrl_ = this.strings_.getAbsoluteUrlIfNeed_(lastSegment.url_, this.finalUrl_);
lastSegment.playUrl_ = lastSegment.formatPlayUrl_(this.storageId_);

if (lastSegment.pieces_.length == 0) {
// no pieces
var pieceItem = new p2p$.com.webp2p.core.supernode.MetaPiece();
pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
pieceItem.id_ = (lastSegment.id_ > 0) ? lastSegment.id_ : this.segments_.length;
lastSegment.piecePnCount_++;
pieceItem.size_ = 0;
pieceItem.checksum_ = 0;
pieceItem.offset_ = lastSegment.size_;
pieceItem.index_ = lastSegment.pieces_.length;
lastSegment.p2pDisabled_ = true;
lastSegment.size_ += pieceItem.size_;
lastSegment.pieces_.push(pieceItem);
}

if (lastSegment.startTime_ <= 0) {
lastSegment.startTime_ = this.totalDuration_;
}
if (this.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod
|| this.type_ == p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
lastSegment.startTimeActual_ = this.totalDuration_;
} else {
lastSegment.startTimeActual_ = lastSegment.startTime_;
}
if (needMoreUrls) {
if (lastSegment.moreMediaUrls_ && lastSegment.moreMediaUrls_[0]) {
this.moreUrlCount_ = 1;
}
if (lastSegment.moreMediaUrls_ && lastSegment.moreMediaUrls_[1]) {
this.moreUrlCount_ = 2;
}
}

this.segments_.push(lastSegment);
this.p2pPieceCount_ += (lastSegment.pieceTnCount_ + lastSegment.piecePnCount_);
this.totalDuration_ += lastSegment.duration_;
this.dataSize_ += lastSegment.size_;
if (lastSegment.directMode_ && nonDirectCount <= 0) {
this.directCount_++;
this.directDuration_ += lastSegment.duration_;
} else {
nonDirectCount++;
}

lastSegment = new p2p$.com.webp2p.core.supernode.MetaSegment();
lastSegment.m3u8LoadTime_ = elapsedTime;
if (this.directMetaMode_ || needMoreUrls) {
lastSegment.moreMediaUrls_ = [];
}
continue;
}
var pos = 0, linKey = "", linValue = "";
if ((pos = line.indexOf(":")) == -1) {
linKey = line;
} else {
linKey = (pos > 0) ? line.substr(0, pos) : "";
linValue = ((pos + 1) < line.length) ? line.substr(pos + 1) : "";
}
linKey = this.strings_.trim(linKey);
linValue = this.strings_.trim(linValue);

if (this.strings_.compareTo_(linKey, "#EXT-X-VERSION", true) == 0) {
this.version_ = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-X-ALLOW-CACHE", true) == 0) {
this.allowCache_ = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-X-TARGETDURATION", true) == 0) {
this.targetDuration_ = this.strings_.parseNumber_(linValue, 0);
} else if (this.strings_.compareTo_(linKey, "#EXT-X-MEDIA-SEQUENCE", true) == 0) {
this.mediaSequence_ = this.strings_.parseNumber_(linValue, 0);
} else if (this.strings_.compareTo_(linKey, "#EXT-X-PROGRAM-DATE-TIME", true) == 0) {
this.programDateTime_ = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-M3U8-TYPE", true) == 0) {
this.programeType_ = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-M3U8-VER", true) == 0) {
this.programVersion_ = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PROGRAM-ID", true) == 0) {
this.programId_ = linValue;
lastSegment.programId_ = linValue;
lastSegment.beginOfMeta_ = true;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PIC-WIDTH", true) == 0) {
this.pictureWidth_ = this.strings_.parseFloat(linValue, 0);
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PIC-HEIGHT", true) == 0) {
this.pictureHeight_ = this.strings_.parseFloat(linValue, 0);
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-DIRECT", true) == 0) {
lastSegment.directMode_ = this.strings_.parseNumber_(linValue, 0) ? true : false;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PATH1", true) == 0 && lastSegment.moreMediaUrls_ != null) {
lastSegment.moreMediaUrls_[0] = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-PATH2", true) == 0 && lastSegment.moreMediaUrls_ != null) {
lastSegment.moreMediaUrls_[1] = linValue;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-AD-MONITOR-URL", true) == 0) {
lastSegment.advertMonitorUrl_ = linValue;
}

if (this.strings_.compareTo_(linKey, "#EXT-LETV-START-TIME", true) == 0) {
lastSegment.startTime_ = this.strings_.parseFloat(linValue, 0) * 1000;
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-SEGMENT-ID", true) == 0) {
lastSegment.id_ = this.strings_.parseNumber_(linValue, 0);
} else if (this.strings_.compareTo_(linKey, "#EXT-LETV-CKS", true) == 0) {

// speed up method
var pieceItem = new p2p$.com.webp2p.core.supernode.MetaPiece();
linValue = this.strings_.makeUpper_(linValue);
var position = linValue.indexOf("TN=");
var pieceTag = linValue.substr(position);
if (-1 != position) {
pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
pieceItem.id_ = this.strings_.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));

position = linValue.indexOf("KEY=");
pieceTag = linValue.substr(position);
if (-1 != position) {
pieceItem.key_ = this.strings_.parseNumber_(pieceTag.substring(4, pieceTag.indexOf("&")));
}

lastSegment.pieceTnCount_++;
} else {
pieceItem.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
position = linValue.indexOf("PN=");
pieceTag = linValue.substr(position);
if (-1 != position) {
pieceItem.id_ = this.strings_.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));
}
lastSegment.piecePnCount_++;
}
position = linValue.indexOf("SZ=");
pieceTag = linValue.substr(position);
if (-1 != position) {
pieceItem.size_ = this.strings_.parseNumber_(pieceTag.substring(3, pieceTag.indexOf("&")));
}

position = linValue.indexOf("CKS=");
pieceTag = linValue.substr(position);
if (-1 != position) {
pieceItem.checksum_ = this.strings_.parseNumber_(pieceTag.substring(4));
}

// P2P_ULOG_INFO("pieceItem.checksum_:"+pieceItem.checksum_ +",pieceItem.size_:"+pieceItem.size_+",sum:"+(pieceItem.checksum_+pieceItem.size_));
pieceItem.offset_ = lastSegment.size_;
pieceItem.index_ = lastSegment.pieces_.length;
lastSegment.size_ += pieceItem.size_;
lastSegment.pieces_.push(pieceItem);
this.maxPieceId = Math.max(maxPieceId, pieceItem.id_);
} else if (this.strings_.compareTo_(linKey, "#EXT-X-DISCONTINUITY", true) == 0) {
lastSegment.discontinuity_ = true;
P2P_ULOG_TRACE("core::supernode::MetaData Segment is #EXT-X-DISCONTINUITY id(" + lastSegment.id_ + "), start time(" + lastSegment.startTime_
+ ")");
} else if (this.strings_.compareTo_(linKey, "#EXTINF", true) == 0) {
lastSegment.duration_ = (this.strings_.parseFloat(linValue, 0) * 1000);
// P2P_ULOG_INFO("parseResult:"+this.strings_.parseFloat(linValue, 0)+",lastSegment.duration_:"+lastSegment.duration_
// +",linval="+linValue);
}

}
if (needBuildIndexes) {
this.buildIndexes_();
}

// default
if (!(this.programId_ == "")) {//生成gid
this.p2pGroupId_ = this.programId_ + this.programVersion_ + p2p$.com.selector.Module.kP2pVersion;
}
return true;
},

loadHeaders_ : function(url, cheaders, checksumData) {
},

buildIndexes_ : function() {
this.tn2SegmentIndexMap_.clear();
this.pn2SegmentIndexMap_.clear();
this.segments_.sort(function(item1, item2) {
return item1.id_ - item2.id_;
});

this.p2pPieceCount_ = 0;
this.totalDuration_ = 0;
for ( var n = 0; n < this.segments_.length; n++) {
var segment = this.segments_[n];
segment.index_ = n;
this.totalDuration_ += segment.duration_;
if (segment.p2pDisabled_) {
continue;
}

this.p2pPieceCount_ += segment.pieces_.length;
for ( var k = 0; k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
var indexMap = (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn == piece.type_) ? this.tn2SegmentIndexMap_
: this.pn2SegmentIndexMap_;
// indexMap[piece.id_] = segment.index_;
indexMap.set(piece.id_, segment.index_, false);
}
}
},

updateMetaCache_ : function(endTime, endList, localMode) {
},

combineWith_ : function(other, reloaded, groupChanged) {
var modifyCount = 0;
var newSegmentCount = 0;
var maxSegmentId = 0;
var newSegments = [];
if (groupChanged) {
this.version_ = other.version_;
this.mediaSequence_ = other.mediaSequence_;
this.pictureWidth_ = other.pictureWidth_;
this.pictureHeight_ = other.pictureHeight_;
}

for ( var k = 0; k < this.segments_.length; k++) {
var item = this.segments_[k];
maxSegmentId = maxSegmentId > item.id_ ? maxSegmentId : item.id_;
}

for ( var n = 0; n < other.segments_.length; n++) {
var segment = other.segments_[n];
var exists = false;
var existsIndex = 0;
for ( var k = 0; k < this.segments_.length; k++) {
var item = this.segments_[k];
if (item.startTime_ > 0) {
if (item.id_ == segment.id_) {
existsIndex = k;
exists = true;
break;
}
} else if (item.url_ == segment.url_) {
existsIndex = k;
exists = true;
break;
}
}

if (exists) {
if (reloaded) {
var existsSegment = this.segments_[existsIndex];
var backupSegment = existsSegment;
existsSegment = segment;
existsSegment.url_ = backupSegment.url_;
existsSegment.mediaUrl_ = backupSegment.mediaUrl_;
existsSegment.playUrl_ = backupSegment.playUrl_;
existsSegment.advertMonitorUrl_ = backupSegment.advertMonitorUrl_;
existsSegment.advertMonitorReported_ = backupSegment.advertMonitorReported_;
existsSegment.pictureWidth_ = backupSegment.pictureWidth_;
existsSegment.pictureHeight_ = backupSegment.pictureHeight_;
modifyCount++;
}
continue;
}
newSegments.push(segment.id_);
this.segments_.push(segment);
var newSegment = this.segments_[this.segments_.length - 1];
if (this.p2pGroupId_ == "") {
// standrad meta
newSegment.id_ = (segment.startTime_ > 0) ? (newSegment.startTime_ / 1000) : (++maxSegmentId);
if (segment.pieces_.length == 1) {
newSegment.pieces_[0].id_ = segment.id_;
}
}
this.p2pPieceCount_ += segment.pieces_.length;
newSegmentCount++;
modifyCount++;
}

if (modifyCount > 0) {
this.buildIndexes_();
}

return {
newSegmentCount_ : newSegmentCount,
newSegments_ : newSegments
};
},

combineSameGroup_ : function(other) {
if (other.segments_.length == 0) {
return 0;
}

var newSegmentCount = 0;
var maxSegmentId = 0;
var newSegments = [];
var endIndex = other.segments_.length - 1;
for (; endIndex >= 0; endIndex--) {
var item = other.segments_[endIndex];
if (item.beginOfMeta_) {
break;
}
}

if (endIndex <= 0) {
return 0;
}

for ( var n = 0; n < endIndex; n++) {
var segment = other.segments_[n];
var exists = false;
for ( var k = 0; k < this.segments_.length; k++) {
var item = this.segments_[k];
if (item.startTime_ > 0) {
if (item.id_ == segment.id_) {
exists = true;
break;
}
} else if (item.url_ == segment.url_) {
exists = true;
break;
}
}

if (exists) {
continue;
}
newSegments.push(segment.id_);
this.segments_.push(segment);
var newSegment = this.segments_[this.segments_.length - 1];
if (!this.p2pGroupId_) {
// standrad meta
newSegment.id_ = (segment.startTime_ > 0) ? (newSegment.startTime_ / 1000) : (++maxSegmentId);
if (segment.pieces_.length == 1) {
newSegment.pieces_[0].id_ = segment.id_;
}
}
this.p2pPieceCount_ += segment.pieces_.length;
newSegmentCount++;
}

if (newSegmentCount > 0) {
this.buildIndexes_();
}
return {
newSegmentCount_ : newSegmentCount,
newSegments_ : newSegments
};
},

duplicateExistsFrom_ : function(other) {
},

markAllSegmentP2pDisabled_ : function() {
for ( var n = 0; n < this.segments_.length; n++) {
var item = this.segments_[n];
item.p2pDisabled_ = true;
}
},

updateSegmentTimeGap_ : function() {
},

resetReceiveTags_ : function() {
},

parseChecksum_ : function(pieceSize, checksums, checksumData) {
},

verifyPiece_ : function(piece, data, size) {
switch (this.verifyMethod_) {
case p2p$.com.webp2p.core.supernode.DATA_VERIFY_METHOD.kDataVerifyMethodCrc32:
return piece.verifyWithCrc32_(data, size);
default:
return piece.verify(data, size);
}
},

getLocalMetaContent_ : function() {
return this.localMetaContent_;
},

getSegmentStorageId_ : function(segmentId) {
return this.strings_.format("channel://{0}//{1}", this.storageId_, segmentId);
},

getSegmentIndexById_ : function(id) {
for ( var n = 0; n < this.segments_.length; n++) {
var item = this.segments_[n];
if (item.id_ == id) {
return n;
}
}
return -1;
},

getSegmentIndexByPieceId_ : function(type, id) {
var indexMap = (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn == type) ? this.tn2SegmentIndexMap_ : this.pn2SegmentIndexMap_;
var value = indexMap.get(id);
return (value != null ? value : -1);
},

getSegmentById_ : function(id) {
var segment = null;
for ( var n = 0; n < this.segments_.length; n++) {
var item = this.segments_[n];
if (item.id_ == id) {
segment = item;
break;
}
}
return segment;
},

getDataSize_After_ : function(msId) {
},
getAllStatus_ : function(startSegmentId, maxDuration, params, result) {
var incompleleOnly = params.get("incompleteOnly");
result["updateTime"] = this.updateTime_;
result["segmentCount"] = this.segments_.length;
result["directCount"] = this.directCount_;
result["pieceCount"] = this.tn2SegmentIndexMap_.length + this.pn2SegmentIndexMap_.length;
result["tnPieceCount"] = this.tn2SegmentIndexMap_.length;
result["pnPieceCount"] = this.pn2SegmentIndexMap_.length;
result["p2pGroupId"] = this.p2pGroupId_;
result["directDuration"] = this.directDuration_;
result["targetDuration"] = this.targetDuration_;
result["totalGapDuration"] = this.totalGapDuration_;
result["segmentFirstId"] = (this.segments_.length > 0) ? this.segments_[0].id_ : 0;
result["segmentLastId"] = (this.segments_.length > 0) ? this.segments_[this.segments_.length - 1].id_ : 0;
result["rangeParamsSupported"] = this.rangeParamsSupported_;
result["verifyMethod"] = this.verifyMethod_;
var segmentDisplayCount = 0;
var segmentDisplayDuration = 0;
var segmentCompletedCount = 0;
var segmentCompletingCount = 0;
var resultSegments = result["segments"] = [];
for ( var n = 0, j = 0; n < this.segments_.length; n++) {
var segment = this.segments_[n];
if (incompleleOnly && segment.completedTime_ > 0) {
continue;
}
if (startSegmentId >= 0 && segment.id_ < startSegmentId) {
continue;
}
if (maxDuration > 0 && segmentDisplayDuration >= maxDuration * 1000) {
break;
}
var resultSegmentsStatus = resultSegments[j++] = {};
segment.getAllStatus_(resultSegmentsStatus);

segmentDisplayCount++;
segmentDisplayDuration += segment.duration_;
if (segment.completedTime_ > 0) {
segmentCompletedCount++;
} else if (segment.completedPieceCount_ > 0) {
segmentCompletingCount++;
}
}
result["segmentDisplayCount"] = segmentDisplayCount;
result["segmentDisplayDuration"] = segmentDisplayDuration;
result["segmentCompletedCount"] = segmentCompletedCount;
result["segmentCompletingCount"] = segmentCompletingCount;
}
});
p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.MetaPiece = JClass.extend_({
id_ : 0,
type_ : 0,
key_ : 0,
offset_ : 0,
size_ : 0,
wild_ : false,
checksum_ : 0,
index_ : 0,

// status
randomNumber_ : 0,
transferDepth_ : 0,
receiveProtocol_ : 0,
shareInRanges_ : 0,
receiveByStable_ : false,
receiveByOther_ : false,
receiveSessionId_ : 0,
receiveStartTime_ : 0,
playedTime_ : 0,
completedTime_ : 0,
recvTimes_ : 0,
writeTimes_ : 0,

init : function() {
this.id_ = 0;
this.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
this.key_ = 0;
this.offset_ = 0;
this.size_ = 0;
this.wild_ = false;
this.checksum_ = 0;
this.index_ = 0;
this.randomNumber_ = Math.floor(Math.random() * 100 + 1);
this.transferDepth_ = 0;
this.receiveProtocol_ = 0;
this.shareInRanges_ = 0;
this.receiveByStable_ = false;
this.receiveByOther_ = false;
this.receiveSessionId_ = 0;
this.receiveStartTime_ = 0;
this.playedTime_ = 0;
this.completedTime_ = 0;
this.recvTimes_ = 0;
},

fork : function() {
var result = new p2p$.com.webp2p.core.supernode.MetaPiece();
for ( var n in this) {
result[n] = this[n];
}
return result;
},

verify : function(data, size) {
if (this.size_ <= 0 || this.wild_) {
return true;
}

var step = 47;
var pos = 0;
var sum = 0xffffffff;
if (size >= 188) {
pos += 4;
while (pos + step < size) {
// uint32 item1 = core::common::network2Host32(*(uint32 *)(data + pos));
// uint32 item2 = (uint32(data[pos]) << 24) + (uint32(data[pos + 1]) << 16) + (uint32(data[pos + 2]) << 8) + (uint32(data[pos + 3]));
// p2p$.com.webp2p.core.common.Number.convertToValue_('8',value,_position);'4',value,_position
var item1 = p2p$.com.webp2p.core.common.Number.convertToValue_('4', data, pos);
sum ^= item1;
pos += step;
}
}
sum = (~(((sum >> 16) & 0xffff) + (sum & 0xffff))) & 0xffff;
return this.checksum_ == sum;
},

verifyWithCrc32_ : function(data, size) {
},

getTypeName_ : function() {
},
getAllStatus_ : function(result) {
result["id"] = this.id_;
result["index"] = this.index_;
result["type"] = this.type_;
result["offset"] = this.offset_;
result["size"] = this.size_;
result["wild"] = this.wild_;
result["checksum"] = this.checksum_;
result["transferDepth"] = this.transferDepth_;
result["shareInRanges"] = this.shareInRanges_;
result["receiveProtocol"] = this.receiveProtocol_;
result["receiveByStable"] = this.receiveByStable_;
result["receiveStartTime"] = this.receiveStartTime_;
result["playedTime"] = this.playedTime_;
result["completedTime"] = this.completedTime_;
}
});
p2p$.ns("com.webp2p.core.supernode");

p2p$.com.webp2p.core.supernode.MetaSegment = JClass.extend_({
id_ : 0,
startTime_ : 0,
startTimeActual_ : 0,
duration_ : 0,
urlOffset_ : 0,
index_ : 0,
pieceTnCount_ : 0,
piecePnCount_ : 0,
size_ : 0,
beginOfMeta_ : false,
directMode_ : false,
discontinuity_ : false,
p2pDisabled_ : false,
timeGapChecked_ : false,
advertMonitorReported_ : false,
url_ : "",
mediaUrl_ : "",
playUrl_ : "",
advertMonitorUrl_ : "",
programId_ : "",
pieces_ : null,
moreMediaUrls_ : null,
pictureWidth_ : 0,
pictureHeight_ : 0,

lastActiveTime_ : 0,
completedPieceCount_ : 0,
completedTime_ : 0,
completedSize_ : 0,
startReceiveTime_ : 0,
lastReceiveTime_ : 0,
lastPlayTime_ : 0,
receiveSpeed_ : 0,
m3u8LoadTime_ : 0,
tag_:"com::relayCore::channels::meta::MetaSegement",

init : function() {
this.pieces_ = [];
this.id_ = -1;
this.startTime_ = 0;
this.startTimeActual_ = 0;
this.duration_ = 0;
this.urlOffset_ = -1;
this.index_ = 0;
this.pieceTnCount_ = 0;
this.piecePnCount_ = 0;
this.size_ = 0;
this.lastActiveTime_ = 0;
this.completedPieceCount_ = 0;
this.completedTime_ = 0;
this.completedSize_ = 0;
this.startReceiveTime_ = 0;
this.lastReceiveTime_ = 0;
this.lastPlayTime_ = 0;
this.receiveSpeed_ = 0;
this.beginOfMeta_ = false;
this.directMode_ = false;
this.discontinuity_ = false;
this.p2pDisabled_ = false;
this.timeGapChecked_ = false;
this.advertMonitorReported_ = false;
this.m3u8LoadTime_ = 0;
},

getPieceIndex_ : function(type, id) {
for ( var n = 0; n < this.pieces_.length; n++) {
var piece = this.pieces_[n];
if (piece.type_ == type && piece.id_ == id) {
return n;
}
}
return -1;
},

checkPieceCompletion_ : function() {

var nowTime = p2p$.com.common.Global.getMilliTime_();
this.lastReceiveTime_ = nowTime;
this.completedPieceCount_ = 0;
this.completedSize_ = 0;
for ( var n = 0; n < this.pieces_.length; n++) {
var piece = this.pieces_[n];
if (piece.writeTimes_ > 0) {
this.completedPieceCount_++;
if (piece.size_ >= 0) {
this.completedSize_ += piece.size_;
}
}
}
if (this.completedPieceCount_ == this.pieces_.length) {
this.completedTime_ = nowTime;
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Segment({1}) download complete",this.tag_, this.id_, this.pieces_.length));
if (this.completedSize_ <= 0) {
this.completedSize_ = this.size_;
}
}
if (this.startReceiveTime_ > 0 && nowTime > this.startReceiveTime_) {
this.receiveSpeed_ = this.completedSize_ * 1000 / (nowTime - this.startReceiveTime_);
}
},

resetPieceCompletion_ : function() {
this.lastPlayTime_ = 0;
this.completedTime_ = 0;
this.completedPieceCount_ = 0;
this.completedSize_ = 0;
for ( var n = 0; n < this.pieces_.length; n++) {
var piece = this.pieces_[n];
piece.completedTime_ = 0;
piece.writeTimes_ = 0;
piece.playedTime_ = 0;
piece.recvTimes_ = 0;
}
},

formatPlayUrl_ : function(storageId) {
return "/play/slices/" + this.id_ + ".ts?id=" + storageId + "&segment=" + this.id_;
},
getAllStatus_ : function(result) {
result["id"] = this.id_;
result["index"] = this.index_;
result["duration"] = this.duration_;
result["url"] = this.url_;
result["pieceCount"] = this.pieces_.length;
result["pieceTnCount"] = this.pieceTnCount_;
result["piecePnCount"] = this.piecePnCount_;
result["size"] = this.size_;
result["startTime"] = this.startTime_;
result["startTimeActual"] = this.startTimeActual_;
result["lastActiveTime"] = this.lastActiveTime_;
result["completedTime"] = this.completedTime_;
result["completedPieceCount"] = this.completedPieceCount_;
result["completedSize"] = this.completedSize_;
result["startReceiveTime"] = this.startReceiveTime_;
result["lastReceiveTime"] = this.lastReceiveTime_;
result["receiveSpeed"] = this.receiveSpeed_;
result["beginOfMeta"] = this.beginOfMeta_;
result["discontinuity"] = this.discontinuity_;

var pendingPieceCount = 0;
var resultPieces = result["pieces"] = [];
for ( var n = 0; n < this.pieces_.length; n++) {
var piece = this.pieces_[n];
if (piece.completedTime_ <= 0 && piece.receiveStartTime_ > 0) {
pendingPieceCount++;
}
var resultPiecesStatus = resultPieces[n] = {};
piece.getAllStatus_(resultPiecesStatus);
}
result["pendingPieceCount"] = pendingPieceCount;
}
});

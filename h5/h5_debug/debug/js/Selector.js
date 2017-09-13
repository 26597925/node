p2p$.ns("com.selector");
p2p$.com.selector.Config={//设置外部参数
callback:"callback",
useType:-1,
encode:0,
p2p:1,
video:null,
playUrl:null,
showConsole:0,
bufferLength:10,
startTime:-1,
jsonp:0,
autoplay:1,
maxMetaNum:2,
domains:""
};
p2p$.ns("com.selector");

p2p$.com.selector.NetworkType = {
kNetworkTypeReserved : 0,
kNetworkTypeEthernet : 1,
kNetworkTypeMobile : 2,
kNetworkTypeWifi : 3,
kNetworkTypeMobile2G : 4,
kNetworkTypeMobile3G : 5,
kNetworkTypeMobile4G : 6,
kNetworkTypeMobile5G : 7,
kNetworkTypeMax : 8,
};

p2p$.com.selector.Enviroment = {
initialized_ : false,
debug_ : false,
p2pEnabled_ : false,
p2pUploadEnabled_ : false,
rtlStreamEnabled_ : false,
liveStorageMemoryOnly_ : false,
vodStorageMemoryOnly_ : false,
networkType_ : 0,
appId_ : 0,
dataDirectory_ : "",
externalAppId_ : "",
externalAppVersion_ : "H5.201706051450",
externalAppChannel_ : "",
externalAppPackageName_ : "",
moduleVersion_ : "",
moduleId_ : "",
clientGeo_ : "",
clientGeoName_ : "",
clientIp_ : "",
deviceType_ : "",
osType_ : "",
rootDomain_ : "",
globalProxyUrl_ : "",
defaultGslbTss_ : "",
defaultGslbM3v_ : "",

hlsServerPort_ : 0,
livePlayOffset_ : 0, // seconds
specialPlayerTimeOffset_ : 0, // seconds, default player offset
specialPlayerTimeLimit_ : 0, // seconds, default player limit
downloadSpeedRatio_ : 0, // download speed control rate, compare with bitrate

// control params
protocolCdnDisabled_ : false,
protocolRtmfpDisabled_ : false,
protocolWebsocketDisabled_ : false,
protocolWebrtcDisabled_ : false,

// custom params
customContextParams_ : "",
customMediaParams_ : "",
customDomainMaps_ : null,

paramWebrtcServer_ : "",
paramTrackerServer_ : "",
paramIsPlayWithlocalVideo_ : false,
paramCloseWebrtc_ : false,
paramCloseWebsocket_ : false,
paramStunServer_ : "",
strings_:null,
tag_:"com::selector::Enviroment",
initialize_ : function() {
if (this.initialized_) {
return;
}
this.initialized_ = true;
this.customDomainMaps_ = new p2p$.com.common.Map();
this.strings_ = p2p$.com.common.String;
this.debug_ = false;
this.p2pEnabled_ = true;
this.p2pUploadEnabled_ = true;
this.rtlStreamEnabled_ = false;
this.liveStorageMemoryOnly_ = false;
this.vodStorageMemoryOnly_ = false;
this.networkType_ = p2p$.com.selector.NetworkType.kNetworkTypeEthernet;
this.appId_ = 800;
this.externalAppId_ = "800"; // H5
this.moduleVersion_ = this.strings_.format("H5-{0}.{1}.{2}", p2p$.com.selector.Module.kH5MajorVersion,
p2p$.com.selector.Module.kH5MinorVersion, p2p$.com.selector.Module.kH5BuildNumber);
this.moduleId_ = this.strings_.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random()
* (1000 + 1)), Math.floor(Math.random() * (1000 + 1)), p2p$.com.common.Global.getMilliTime_());
this.defaultGslbTss_ = "tvts";
this.defaultGslbM3v_ = "1";
this.hlsServerPort_ = 0;
this.livePlayOffset_ = 120;
this.specialPlayerTimeOffset_ = 0; // disabled
this.specialPlayerTimeLimit_ = 0; // disabled
this.downloadSpeedRatio_ = -1; // disabled
this.customContextParams_ = "";
this.customMediaParams_ = "";

// control params
this.protocolCdnDisabled_ = false;
this.protocolRtmfpDisabled_ = false;
this.protocolWebsocketDisabled_ = false;
this.protocolWebrtcDisabled_ = false;

this.deviceType_ = this.getDeviceType_();
this.browserType_ = this.getBrowserType_();
this.osType_ = this.getOSType_();
},

isMobileNetwork_ : function() {
if (this.networkType_ == p2p$.com.selector.NetworkType.kNetworkTypeWifi || this.networkType_ == p2p$.com.selector.NetworkType.kNetworkTypeEthernet)
{
return false;
}
return true;
},

setNetworkType_ : function(connectionType) {
var networkType = 0;
if (connectionType == "ethernet") {
networkType = p2p$.com.selector.NetworkType.kNetworkTypeEthernet;
} else if (connectionType == "cellular" || connectionType == "mobile" || connectionType == "wimax") {
networkType = p2p$.com.selector.NetworkType.kNetworkTypeMobile;
} else if (connectionType == "wifi") {
networkType = p2p$.com.selector.NetworkType.kNetworkTypeWifi;
} else {
networkType = p2p$.com.selector.NetworkType.kNetworkTypeMobile;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setNetworkType_ connectionType({1}),networkType({2})",this.tag_,connectionType,networkType));
this.networkType_ = networkType;
this.p2pEnabled_ = !this.isMobileNetwork_();
},

setChannelParams_ : function(params) {
if (!this.deviceType_) {
var itr = params.get("hwtype");
if (itr) {
this.deviceType_ = itr;
}
}
if (!this.osType_) {
var itr = params.get("ostype");
if (itr) {
this.osType_ = itr;
}
}
},

attachContext_ : function(context) {

if (context.geo_) {
this.clientGeo_ = context.geo_;
} else if (this.clientGeo_) {
context.geo_ = this.clientGeo_;
}
if (context.geoName_) {
this.clientGeoName_ = context.geoName_;
} else if (this.clientGeoName_) {
context.geoName_ = this.clientGeoName_;
}

if (context.clientIp_) {
this.clientIp_ = context.clientIp_;
} else if (this.clientIp_) {
context.clientIp_ = this.clientIp_;
}
},

getHostDomain_ : function(domain) {
return domain;
},
getBackupHostIps_ : function(domain) {
return "117.121.54.219";
},
getLocalMacAddresses_ : function() {
return "FF-EE-DD-CC-BB-AA";
},

getBrowserType_ : function() {
var sys = {};
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf("eui") > -1) {
return "eui";
}
var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
var m = ua.match(re) || [];
sys.browser = (m[1] || "").replace(/version/, "'safari");
sys.ver = (m[2] || "");
return sys.browser || "unknown";
},

getDeviceType_ : function() {
var sUserAgent = navigator.userAgent;
var ua = sUserAgent.toLowerCase();
if (ua.indexOf("x600") > -1) {
return "Letv-x600";
}
if (ua.indexOf("x800") > -1) {
return "Letv-x800";
}
if (ua.indexOf("x900") > -1) {
return "Letv-x900";
}
if (String(navigator.platform).toLowerCase().indexOf("iphone") > -1 || ua.indexOf("iphone") > -1) {
return "iPhone";
}

var split1 = ua.split(";");
for ( var i = 0; i < split1.length; i++) {
var pos = split1[i].indexOf("build");
if (pos > -1) {
var type = split1[i].substring(0, pos);
return p2p$.com.common.String.trim(type);
}
}
return "Unkonwn";
},

getOSType_ : function() {
var sUserAgent = navigator.userAgent;
var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh")
|| (navigator.platform == "MacIntel");
if (isMac) {
return "Mac";
}
if (String(navigator.platform).toLowerCase().indexOf("iphone") > -1 || sUserAgent.toLowerCase().indexOf("iphone") > -1) {
return "iPhone";
}
if (String(navigator.platform).toLowerCase().indexOf("android") > -1 || sUserAgent.toLowerCase().indexOf("android") > -1) {
return "Android";
}
var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
if (isUnix) {
return "Unix";
}
var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
if (isLinux) {
return "Linux";
}

if (isWin) {
var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
if (isWin2K) {
return "Win2000";
}
var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
if (isWinXP) {
return "WinXP";
}
var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
if (isWin2003) {
return "Win2003";
}
var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
if (isWinVista) {
return "WinVista";
}
var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
if (isWin7) {
return "Win7";
}
return "Win";
}
return "other";
},

getMediaType_ : function() {
var mediaType = {
mediasource : false,
webm : false,
mp4 : false,
ts : false
};
try {
var TestMediaSource = window.MediaSource || window.WebKitMediaSource;
if (!!!TestMediaSource) {
} else {
mediaType.mediasource = true;
mediaType.webm = TestMediaSource.isTypeSupported('video/webm; codecs="vorbis,vp8"');
mediaType.mp4 = TestMediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
mediaType.ts = TestMediaSource.isTypeSupported('video/mp2t; codecs="avc1.42E01E,mp4a.40.2"');
}
} catch (e) {
}
return mediaType;
},
getAllStatus_:function(result)
{
result["debug"] = this.debug_;
result["p2pEnabled"] = this.p2pEnabled_;
result["p2pUploadEnabled"] = this.p2pUploadEnabled_;
result["rtlStreamEnabled"] = this.rtlStreamEnabled_;
result["liveStorageMemoryOnly"] = this.liveStorageMemoryOnly_;
result["vodStorageMemoryOnly"] = this.vodStorageMemoryOnly_;
result["networkType"] = this.networkType_;
result["externalAppId"] = this.externalAppId_;
result["externalAppVersion"] = this.externalAppVersion_;
result["externalAppChannel"] = this.externalAppChannel_;
result["externalAppPackageName"] = this.externalAppPackageName_;
result["moduleVersion"] = this.moduleVersion_;
result["moduleId"] = this.moduleId_;
result["clientGeo"] = this.clientGeo_;
result["clientGeoName"] = this.clientGeoName_;
result["clientIp"] = this.clientIp_;
result["deviceType"] = this.deviceType_;
result["osType"] = this.osType_;
result["rootDomain"] = this.rootDomain_;
result["globalProxyUrl"] = this.globalProxyUrl_;
result["defaultGslbTss"] = this.defaultGslbTss_;
result["defaultGslbM3v"] = this.defaultGslbM3v_;
result["hlsServerPort"] = this.hlsServerPort_;
result["livePlayOffset"] = this.livePlayOffset_;
result["specialPlayerTimeOffset"] = this.specialPlayerTimeOffset_;
result["specialPlayerTimeLimit"] = this.specialPlayerTimeLimit_;
result["downloadSpeedRatio"] = this.downloadSpeedRatio_;
result["customContextParams"] = this.customContextParams_;
result["customMediaParams"] = this.customMediaParams_;
// result["keyDataCacheCount"] = (json::Int)keyDataCaches_.size();

// control params
result["protocolCdnDisabled"] = this.protocolCdnDisabled_;
result["protocolRtmfpDisabled"] = this.protocolRtmfpDisabled_;
result["protocolWebsocketDisabled"] = this.protocolWebsocketDisabled_;
result["protocolWebrtcDisabled"] = this.protocolWebrtcDisabled_;
}
};
p2p$.ns('com.selector');
p2p$.com.selector.Judge = JClass.extend_({
//flag : 0,//表示播放方式，0代表mediasource的MP4，1代表mediasource的ts，2代表系统播放,3代表其他
mediaType_ : null,
enviroment_:null,
sysParam_ : null,
flag_:2,
tag_:"com::selector::Juge",

init : function(){
this.enviroment_ = p2p$.com.selector.Enviroment;
this.enviroment_.initialize_();
this.mediaType_=this.enviroment_.getMediaType_();
if(this.mediaType_.mediasource){
if(this.mediaType_.ts){
this.flag_ = 1;
}else if(this.mediaType_.mp4){
this.flag_ = 0;
}else{
this.flag_ = 2;
}
}
},
setFlag:function(flag)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setFlag 设置播放方式 flag={1}",this.tag_,flag));
switch(flag)
{
case 0:
if(this.mediaType_.mp4)
{
this.flag_ = 0;
}
else
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setFlag 设置播放方式失败，不支持mp4格式播放",this.tag_));
}
break;
case 1:
if(this.mediaType_.ts)
{
this.flag_ = 1;
}
else
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::setFlag 设置播放方式失败，不支持ts格式播放",this.tag_));
}
break;
case 2:
this.flag_ = 2;
break;
default:
break;
}
}
});
p2p$.ns('com.selector');
p2p$.com.selector.LoadScript = JClass.extend_({
judge_ : null,
message_ : null,
scope_ : null,
config_:null,
tag_:"com::selector::LoadScript",
urls_:[],
index_:0,
module_:null,

init : function(){
if(arguments.length>0)
{
this.scope_ = arguments[0];
}
this.module_=p2p$.com.selector.Module;
this.config_ = p2p$.com.selector.Config;
this.judge_ = new p2p$.com.selector.Judge();
if(this.config_.useType != null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init 设置useType={1}",this.tag_,this.config_.useType));
this.judge_.setFlag(this.config_.useType);
}
this.urls_.push(this.module_.kernel[this.judge_.flag_]);
if(this.config_.showConsole == 1)
{
this.urls_.push(p2p$.com.selector.Module.other[0]);
}
this.loadScript_();
},
loadScript_ : function(){
me = this;
var url=this.urls_[this.index_];
if(this.config_.domains == "/"){
this.module_.domains = "";
}
else if(this.config_.domains != "")
{
this.module_.domains = this.config_.domains;
}
if(this.module_.domains != "")
{
url=this.module_.domains+this.urls_[this.index_];
}
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = script.onreadystatechange = function () {
me.onComplete_();
};
script.src = encodeURI(url);
document.getElementsByTagName('head')[0].appendChild(script);
this.index_++;
},
onComplete_:function()
{
if(this.index_>=this.urls_.length)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::loadScript_ 模块加载完毕",this.tag_));
this.scope_.onComplete_();
return
}
this.loadScript_();
},
getFlag_:function()
{
return this.judge_.flag_;
}
});
p2p$.ns("com.selector");
p2p$.com.selector.Module = {
kBuildDate : "2017-03-31",
kBuildTime : "2017-03-31 11:10:00",
kVenderName : "",
kBinName : "bin", // suffix .bin
kConfigName : "config", // suffix .json
kLogName : "log", // suffix .log
kShareName : "share", // suffix .shm
kWebName : "web", // suffix .web
kDataName : "data", // suffix .*
kP2pVersion : "1.3m3u8_12272000", // p2p version tag

kH5MajorVersion : 0,
kH5MinorVersion : 9,
kH5BuildNumber : 65,
domains:"http://js.letvcdn.com/",
kernel:["js/lib.mp4.min.js","js/lib.ts.min.js","js/lib.js"],//,["lc05_iscms/201706/06/17/03/lib.mp4.min.js","lc07_iscms/201706/06/17/03/lib.ts.min.js","lc07_iscms/201706/06/17/03/lib.js"],//内核列表
other:["js/tools.js"],//["lc05_iscms/201706/06/17/03/tools.js"],//其他模块

getKp2pVersion_ : function() {
return this.kP2pVersion;
},

getkH5FullVersion_ : function() {
return this.kH5MajorVersion * 1000 + this.kH5MinorVersion * 100 + this.kH5BuildNumber;
}
};
p2p$.ns("com.selector");
p2p$.com.selector.Selector=JClass.extend_({
config_:null,
message_:null,
media_:null,
video_:null,
load_:null,
useTime_:-1,
gTime_:-1,
global_:null,
tag_:"com::selector::Selector",
init:function()
{
this.config_ = p2p$.com.selector.Config;
this.global_ = p2p$.com.common.Global;
if(arguments.length>0&&typeof(arguments[0])=="object")
{
//处理外部参数
for(var i in arguments[0]){
this.initConfig_(i,arguments[0][i]);
}

}
//根据url刷新参数
this.refreshFromUrl_(this.config_.playUrl);
if(this.config_.video == null)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init 没有传入video参数！",this.tag_));
return;
}
var el_=this.config_.video;
if (el_.tagName.toLowerCase() == 'video') {
this.video_ = el_;
} else {
this.video_ = document.createElement("video");
if (params && params.playerAttributes) {
try {
for ( var n in params.playerAttributes) {
this.video_[n] = params.playerAttributes[n];
}
} catch (e) {
// Ignore
}
}
while (el_.childNodes.length > 0) {
el_.removeChild(el_.childNodes[0]);
}
el.appendChild(this.video_);
}
this.gTime_=this.global_.getMilliTime_();
this.load_=new p2p$.com.selector.LoadScript(this);
},
refreshFromUrl_:function(videourl)
{
var url = new p2p$.com.common.Url();
url.fromString_(videourl);
var params = url.getParams();
var el;
for(var i=0;i<url.getParams().elements_.length;i++)
{
el = url.getParams().elements_[i];
this.initConfig_(el.key,el.value);
}
},
initConfig_:function(key,value)
{
switch(key)
{
case "video":
case "callback":
case "useType":
case "encode":
case "p2p":
case "video":
case "playUrl":
case "showConsole":
case "bufferLength":
case "startTime":
case "autoplay":
case "jsonp":
case "domains":
this.config_[key]= (typeof this.config_[key] == "number") ? parseInt(value) : value;
}
},
onComplete_:function()
{
if(this.config_.showConsole == 1)//显示bug面板
{
p2p$.com.tools.console.Index.start();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onComplete_...",this.tag_));
}
this.createPlayer_();
},
createPlayer_:function()
{
var flag=this.load_.getFlag_();
switch(flag)
{
case 0://mp4
case 1://ts
this.media_ = new p2p$.com.player.MediaPlayer(this.video_);
break;
case 2://system
this.media_ = new p2p$.com.player.SystemPlayer(this.video_);
break;
default:
break;
}
this.useTime_=this.global_.getMilliTime_()-this.gTime_;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createPlayer_ 播放模块加载成功！创建播放器。type({1}),useTime({2})",this.tag_,this.load_.getFlag_(),this.useTime_));
if(this.config_.autoplay == 1)
{
this.media_.start();
}
},
openUrl_:function(url)
{
this.config_.playUrl=url;
//根据url刷新参数
this.refreshFromUrl_(this.config_.playUrl);
if(!this.media_)
{
this.createPlayer_();
return;
}
this.media_.openUrl_(url);
}
});

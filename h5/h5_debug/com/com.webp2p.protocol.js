p2p$.ns('com.webp2p.protocol.base');
p2p$.com.webp2p.protocol.base.PROTOCOL_STATES = {
kProtocolStateReady : 0,
kProtocolStateConnecting : 1,
kProtocolStateConnected : 2,
kProtocolStateDisconnecting : 3,
kProtocolStateDisconnected : 4
};

p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES = {
kProtocolTypeReserved : 0,
kProtocolTypeCdn : 1,
kProtocolTypeRtmfp : 2,
kProtocolTypeWebSocket : 3,
kProtocolTypeWebrtc : 4,
kProtocolTypeMax : 5
};

p2p$.com.webp2p.protocol.base.TERMINAL_TYPES = {
kTerminalTypeReserved : 0,
kTerminalTypePc : 1,
kTerminalTypeTv : 2,
kTerminalTypeBox : 3,
kTerminalTypeMobile : 4,
kTerminalTypeMax : 5
};

p2p$.com.webp2p.protocol.base.ManagerStatic = {
getTerminalType_ : function(type) {
var typeMark = null;
var pos = type.indexOf('/');
if (pos == -1) {
typeMark = type;
} else if (pos > 0) {
typeMark = type.substr(0, pos);
}
var strings_ = p2p$.com.common.String;
var lowerTypeMark = strings_.makeLower_(typeMark);
if (strings_.startsWith_(lowerTypeMark, "un")) {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc;
} else if (strings_.startsWith_(lowerTypeMark, "pc")) {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc;
} else if (strings_.startsWith_(lowerTypeMark, "tv")) {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv;
} else if (strings_.startsWith_(lowerTypeMark, "box")) {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox;
} else if (strings_.startsWith_(lowerTypeMark, "mp")) {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
} else if (strings_.startsWith_(lowerTypeMark, "iphone")) {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
} else if (lowerTypeMark.length > 0) {
switch (lowerTypeMark[0]) {
case 'C':
case 'c': // C1,C1S
case 'T':
case 't': // T1, T1S
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox;
break;

case 'X':
case 'x': // X50 X60
case 'S':
case 's': // S40, S50, S70
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv;
break;

default:
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile;
break;
}
} else {
return p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved;
}
},
};

p2p$.com.webp2p.protocol.base.Manager = JClass.extend_({
pool_ : null,//管理池
eventListener_ : null,
sessions_ : null,

type_ : 0,
protocolState_ : 0,
maxActiveSession_ : 0,
beginRegisterTime_:0,
id_ : "",
serverId_ : "",
serverUrl_ : "",
global_:null,
strings_:null,
config_:null,
module_:null,
tag_:"com::webp2p::protocol::base::Manager",

init : function(pool, evt, type) {
this.pool_ = pool;
this.eventListener_ = evt;
this.type_ = type;
this.protocolState_ = p2p$.com.webp2p.protocol.base.PROTOCOL_STATES.kProtocolStateReady;
this.maxActiveSession_ = 20;
this.sessions_ = [];
this.global_ = p2p$.com.common.Global;
this.strings_ = p2p$.com.common.String;
this.config_ = p2p$.com.selector.Config;
this.module_ = p2p$.com.selector.Module;
},

getId_ : function() {
return this.id_;
},
getType : function() {
return this.type_;
},
getTypeNames_ : function(type) {
switch (type) {
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeReserved:
return "reserved";
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
return "cdn";
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
return "rtmfp";
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
return "websocket";
case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
return "webrtc";
default:
return "unknown";
}
},
getTypeName_ : function() {
return this.getTypeNames_(this.type_);
},

// boost::asio::io_service &getService(){ return service_; }
getPool_ : function() {
return this.pool_;
},

getEventListener_ : function() {
return this.eventListener_;
},

setTimeout_ : function(tag, timer, milliSeconds) {
var me = this;
timer = setTimeout(function() {
me.onTimeout_(tag, timer);
}, milliSeconds);
return timer;
},

onTimeout_ : function(tag, timer, errorCode) {
},

setMaxActiveSession_ : function(count) {
this.maxActiveSession_ = count;
},

isStable_ : function() {
return p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn == this.type_;
},

open : function() {
},
close : function() {
}
});
p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.PieceRangeItem = JClass.extend_({
type_ : 0,
count_ : 0,
start_ : 0,
init : function() {
this.type_ = 0;
this.count_ = 0;
this.start_ = 0;
},
});

p2p$.com.webp2p.protocol.base.RequestDataItem = JClass.extend_({
urgent_ : false,
segmentId_ : 0,
pieceId_ : 0,
pieceType_ : 0,
checksum_ : 0,
init : function() {
this.urgent_ = false;
this.segmentId_ = -1;
this.pieceId_ = 0;
this.pieceType_ = 0;
this.checksum_ = 0;
},
});

p2p$.com.webp2p.protocol.base.ResponseDataItem = JClass.extend_({
segmentId_ : 0,
pieceId_ : 0,
pieceType_ : 0,
pieceKey_ : 0,
data_ : "",
init : function() {
this.segmentId_ = -1;
this.pieceId_ = 0;
this.pieceType_ = 0;
this.pieceKey_ = 0;
},
});

p2p$.com.webp2p.protocol.base.Message = JClass.extend_({
type_ : "",
ranges_ : null,
requests_ : null,
responses_ : null,
init : function() {
this.type_ = 0;
this.ranges_ = [];
this.requests_ = [];
this.responses_ = [];
},
empty : function() {
return this.ranges_.length == 0 && this.requests_.length == 0 && this.responses_.length == 0;
}
});
p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Pool = JClass.extend_({
valid_ : false,
p2pActive_ : false,
enviroment_ : null,
context_ : null,
metaData_ : null,
http_ : null,
// service_:null,
timer_ : null,
eventListener_ : null,
managers_ : null,
strings_:null,

selectorRedirectTimes_ : 0,
selectorTryTimes_ : 0,
selectorSuccessTime_ : 0,
selectorRedirectNeeded_ : false,
selectorRedirectHost_ : "",
selectorResponseResult_ : "",
tag_:"com::webp2p::protocol::base::Pool",

init : function(enviroment, context, metaData, baseChannel) {
this.enviroment_ = enviroment;
this.context_ = context;
this.metaData_ = metaData;
this.eventListener_ = baseChannel;
this.strings_ = p2p$.com.common.String;
this.managers_ = [];
this.http_ = null;
this.valid_ = false;
this.context_.webrtcServerHost_ = "ws://123.125.89.103:3852";
this.context_.gatherServerHost_ = "111.206.208.61:80";
this.context_.stunServerHost_ = "stun:111.206.210.145:8124";
//检查webrtc是否可用
if(!window.RTCPeerConnection)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init webrtc can not use in this broswer",this.tag_));
this.enviroment_.protocolWebrtcDisabled_=true;
}
},

initialize_ : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::initialuze_ pool for type({1}), channel({2})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.metaData_.type_),this.metaData_.storageId_));
this.exit();
this.valid_ = true;
//创建cdn管理
var newManager = new p2p$.com.webp2p.protocol.cdn.Manager(this, this.eventListener_);
newManager.open();
this.managers_.push(newManager);
//加载selector
this.queryFromSelector_();
},
/*selector*/
queryFromSelector_ : function() {
if (!this.metaData_.p2pGroupId_) {
return;
}
if (this.http_ != null) {
this.http_.log("cancel");
this.http_.close();
this.http_ = null;
}
var hostDomain = this.enviroment_.getHostDomain_("selector.webp2p.letv.com");
var localMacAddress = this.strings_.urlEncodeNonAscii_(this.enviroment_.getLocalMacAddresses_());
var hardwareType = this.strings_.urlEncodeNonAscii_(this.enviroment_.deviceType_);
var requestUrl = this.strings_.format("http://{0}/query?streamid={1}&type={2}&module=cde&version={3}&geo={4}&isp={5}&country={6}&province={7}&city={8}&area={9}&appid={10}&mac={11}&hwtype={12}"
,this.selectorRedirectNeeded_ ? this.selectorRedirectHost_ : hostDomain
,this.metaData_.p2pGroupId_
,p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC + p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker + p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer
,this.context_.moduleVersion_
,this.context_.geo_
,this.context_.isp_
,this.context_.country_
,this.context_.province_
,this.context_.city_
,this.context_.area_
,this.enviroment_.appId_
,localMacAddress
,hardwareType);
this.selectorRedirectNeeded_ = false;
this.http_ = new p2p$.com.loaders.HttpDownLoader({url_:requestUrl, scope_:this,type_:"json", tag_:"base::selector"});
this.http_.load_();
this.setSelectorTimeout_(10 * 1000);
},
//selector加载结束
onHttpDownloadCompleted_ : function(downloader) {
var myFunName = this.strings_.getFunName(arguments.callee.toString());
var handled = false;
if (this.http_ != downloader) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Expired http complete for tag({2}), channel({3}), ignore",this.tag_,myFunName,this.http_.tag_,this.metaData_.storageId_));
return handled;
}

this.http_ = null;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} tag({2}), channel({3}), response code({4}),size({5})",this.tag_,myFunName,downloader.tag_, this.metaData_.storageId_, downloader.responseCode_,downloader.responseData_.length));
if (downloader.tag_ == "base::selector") {
handled = true;
if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
return handled;
}
// parse selector response
if (!this.parseSelectorResponse_(downloader)) {
// waiting for timeout and retry ...
return handled;
} else if (this.selectorRedirectNeeded_) {
this.selectorRedirectTimes_++;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Selector redirect to({2}), total {3} redirect times ...",this.tag_,myFunName,this.selectorRedirectHost_,this.selectorRedirectTimes_));
if (this.selectorRedirectTimes_ > 3) {
// too much redirect, waiting for timeout and retry ...
this.selectorRedirectNeeded_ = false;
this.selectorRedirectTimes_ = 0;
} else {
this.removeSelectorTimer_();
this.queryFromSelector_();
}
return handled;
}
this.removeSelectorTimer_();

P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Query from selector successfully, gather(http://{2}), webrtc({3}), tracker(http://{4}),stun({5}),max peers({6}), urgent size({7}), channel({8}),rtmfp({9}), websocket({10}), webrtc({11}), upload({12}), urgent upload({13}), range interval({14} s), upload limit({15}), init throttle({16} B/s), avg throttle({17} B/s), max reserved({18} B/s)"
,this.tag_
,myFunName
,this.context_.gatherServerHost_
,this.context_.webrtcServerHost_
,this.context_.trackerServerHost_
,this.context_.stunServerHost_
,this.context_.p2pMaxPeers_
,this.context_.p2pUrgentSize_
,this.metaData_.storageId_
,this.context_.protocolRtmfpDisabled_ ? "no" : "yes"
,this.context_.protocolWebsocketDisabled_ ? "no" : "yes"
,this.context_.protocolWebrtcDisabled_ ? "no" : "yes"
,this.context_.p2pUploadEnabled_ ? "yes" : "no"
,this.context_.p2pUrgentUploadEnabled_ ? "yes" : "no"
,this.context_.p2pShareRangeInterval_
,this.context_.p2pUploadLimit_ ? "yes" : "no"
,this.context_.p2pUploadThrottleInit_
,this.context_.p2pUploadThrottleAverage_
,this.context_.p2pUploadMaxReserved_));

this.selectorSuccessTime_ = p2p$.com.common.Global.getMilliTime_();
this.context_.selectorServerHost_ = downloader.remoteEndpoint_;
this.context_.selectorConnectedTime_ = downloader.totalUsedTime_;
this.eventListener_.onProtocolSelectorOpen_(p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess);
this.createOtherProtocols_();
}

return handled;
},
//分析
parseSelectorResponse_ : function(downloader) {
var myFunName = this.strings_.getFunName(arguments.callee.toString());
var result = downloader.responseData_;
if (result == "" || result == null) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} Parse selector response data failed: channel({2})"
,this.tag_
,myFunName
,this.metaData_.storageId_));
return false;
}
this.selectorResponseResult_ = result["status"];
if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == this.selectorResponseResult_) {
this.context_.configData_ = result;
var value = this.context_.configData_;
var items = value.items;
for ( var n = 0; n < items.length; n++) {
var item = items[n];
if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC) {
var rets = item.serviceUrls.split(",");
if (rets && rets.length > 1) {
if (!this.context_.hasDefaultWebrtcServer_) {
this.context_.webrtcServerHost_ = rets[1];
}
}

}
if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker) {
var rets = item.serviceUrls.split("//");
if (rets && rets.length > 1) {
if (!this.context_.hasDefaultTrackerServer_) {
this.context_.gatherServerHost_ = rets[1];
}
}
}
if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer) {
if (!this.context_.hasDefaultStunServer_) {
this.context_.stunServerHost_ =  item.serviceUrls;
}
}

}
// var value = JSON.stringify(this.context_.configData_);

this.context_.trackerServerHost_ = value.hasOwnProperty("trackerId") ? value["trackerId"] : this.context_.gatherServerHost_;
this.context_.p2pMaxPeers_ = Math.max(value["maxPeers"], 1);
this.context_.p2pUrgentSize_ = Math.max(value["urgentSize"], 1);
if (value.hasOwnProperty("p2pUploadEnabled")) {
this.context_.p2pUploadEnabled_ = value["p2pUploadEnabled"];
}
// enviroment_.p2pUploadEnabled_ = this.context_.p2pUploadEnabled_ = false;
if (value.hasOwnProperty("p2pUploadLimit")) {
this.context_.p2pUploadLimit_ = value["p2pUploadLimit"];
}
if (value.hasOwnProperty("p2pUploadThrottleInit")) {
this.context_.p2pUploadThrottleInit_ = value["p2pUploadThrottleInit"];
}
if (value.hasOwnProperty("p2pUploadThrottleAverage")) {
this.context_.p2pUploadThrottleAverage_ = value["p2pUploadThrottleAverage"];
}
if (value.hasOwnProperty("p2pUploadMaxReserved")) {
this.context_.p2pUploadMaxReserved_ = value["p2pUploadMaxReserved"];
}
if (value.hasOwnProperty("p2pUrgentUploadEnabled")) {
this.context_.p2pUrgentUploadEnabled_ = value["p2pUrgentUploadEnabled"];// /
}
if (value.hasOwnProperty("p2pShareRangeInterval")) {
this.context_.p2pShareRangeInterval_ = Math.max(value["p2pShareRangeInterval_"], 2);// /
}
if (value.hasOwnProperty("p2pMaxParallelRequestPieces")) {
this.context_.p2pMaxParallelRequestPieces_ = value["p2pMaxParallelRequestPieces"];// /
}
if (value.hasOwnProperty("p2pMaxUrgentRequestPieces")) {
this.context_.p2pMaxUrgentRequestPieces_ = value["p2pMaxUrgentRequestPieces"];// /
}
if (value.hasOwnProperty("fetchRate")) {
this.context_.p2pFetchRate_ = value["fetchRate"];
}
if (value.hasOwnProperty("cdnSlowThresholdRate")) {
this.context_.cdnSlowThresholdRate_ = value["cdnSlowThresholdRate"];//
}
if (value.hasOwnProperty("hbInterval")) {
this.context_.p2pHeartbeatInterval_ = Math.max(2, value["hbInterval"]);
}
if (value["statReportInterval"] > 0) {
this.context_.statReportInterval_ = value["statReportInterval"];//
}
if (value["livePlayOffset"] > 0) {
this.enviroment_.livePlayOffset_ = value["livePlayOffset"];//
}
if (value.hasOwnProperty("protocols")) {
var specificProtocols = value["protocols"];
// this.context_.protocolCdnDisabled_ = specificProtocols["cdn"]["disabled"];
this.context_.protocolRtmfpDisabled_ = specificProtocols["rtmfp"]["disabled"];
this.context_.protocolWebsocketDisabled_ = specificProtocols["websocket"]["disabled"];
this.context_.protocolWebrtcDisabled_ = specificProtocols["webrtc"]["disabled"];
}

return true;
} else {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} Selector response error:{2}, channel({3})"
,this.tag_
,myFunName
,this.selectorResponseResult_,
this.metaData_.storageId_));
this.removeSelectorTimer_();
// this.onSelectorTimeout_();
return false;
}
},

setSelectorTimeout_ : function(timeoutMs) {
var me = this;
this.timer_ = setTimeout(function() {
me.onSelectorTimeout_();
}, timeoutMs);
},

removeSelectorTimer_ : function() {
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
},

onSelectorTimeout_ : function(errorCode) {
if (!this.valid_) {
return;
}

if (this.http_ != null) {
this.http_.log("timeout");
this.http_.close();
this.http_ = null;
}
this.selectorTryTimes_++;
var myFunName = this.strings_.getFunName(arguments.callee.toString());
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} Selector timeout for channel({2}), {3} try times..."
,this.tag_
,myFunName
,this.metaData_.storageId_
,this.selectorTryTimes_));
this.queryFromSelector_();
// this.selectorSuccessTime_ = 1;
// this.createOtherProtocols_();
},

createOtherProtocols_ : function() {
// p2p not support under mobile network
var myFunName = this.strings_.getFunName(arguments.callee.toString());
var isMobileNow = this.enviroment_.isMobileNetwork_();
if (this.metaData_.p2pGroupId_ == "" || this.p2pActive_ || this.selectorSuccessTime_ <= 0 || isMobileNow) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} p2pGroupId_({2}),p2pActive({3}), selectorSuccessTime_({4}),isMobileNow({5})"
,this.tag_
,myFunName
,this.metaData_.p2pGroupId_
,this.p2pActive_
,this.selectorSuccessTime_
,isMobileNow));
return true;
}
if (!this.context_.protocolWebrtcDisabled_ && !this.enviroment_.protocolWebrtcDisabled_) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} p2pGroupId_({2})"
,this.tag_
,myFunName
,this.metaData_.p2pGroupId_));
var newManager = new p2p$.com.webp2p.protocol.webrtc.Manager(this, this.eventListener_);
newManager.open();
newManager.setMaxActiveSession_(this.context_.p2pMaxPeers_);
this.managers_.push(newManager);
}

// this.context_.protocolWebsocketDisabled_ = true;
if (!this.context_.protocolWebsocketDisabled_ && !this.enviroment_.protocolWebsocketDisabled_) {
var newManager = new p2p$.com.webp2p.protocol.websocket.Manager(this, this.eventListener_);
newManager.open();
newManager.setMaxActiveSession_(this.context_.p2pMaxPeers_);
this.managers_.push(newManager);
}
this.p2pActive_ = true;
return true;
},
refreshStable_ : function() {
},

p2pGroupIdChange_ : function() {
},

p2pActivate_ : function() {
if (this.p2pActive_) {
return true;
}
return this.createOtherProtocols_();
},

p2pDeactive_ : function() {
if (!this.p2pActive_) {
return true;
}

// close all p2p managers
for ( var n = 0; n < this.managers_.length; n++) {
var mgr = this.managers_[n];
if (mgr.isStable_()) {
continue;
}
mgr.close();
}
this.managers_ = [];
this.context_.rtmfpServerConnectedTime_ = 0;
this.context_.webrtcServerConnectedTime_ = 0;
this.context_.trackerServerConnectedTime_ = 0;
this.p2pActive_ = false;
return true;
},

p2pisActive_ : function() {
return this.p2pActive_;
},

p2pIsReady_ : function() {
return this.selectorSuccessTime_ > 0;
},

isValid_ : function() {
return this.valid_;
},

getContext_ : function() {
return this.context_;
},

getEnviroment_ : function() {
return this.enviroment_;
},

getMetaData_ : function() {
return this.metaData_;
},

getManagers_ : function() {
return this.managers_;
},

exit : function() {
this.valid_ = false;
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
if (this.http_ != null) {
this.http_.log("cancel");
this.http_ = null;
}
this.p2pActive_ = false;
this.selectorSuccessTime_ = 0;
for ( var n = 0; n < this.managers_.length; n++) {
var mgr = this.managers_[n];
mgr.close();
}
this.managers_ = [];
return true;
}
});
p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Session = JClass.extend_({
manager_ : null,
name_ : "",
remoteId_ : "",
remoteAddress_ : "",
remoteType_ : "",
opened_ : false,
active_ : false,
terminalType_ : 0,
timer_:null,
tag_:"com::webp2p::protocol::base::Session",
global_:null,
strings_:null,
enum_:null,

init : function(mgr, remoteId) {
this.manager_ = mgr;
this.remoteId_ = remoteId;
this.opened_ = false;
this.active_ = false;
this.terminalType_ = p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved;
this.global_ = p2p$.com.common.Global;
this.strings_ = p2p$.com.common.String;
this.enum_ = p2p$.com.webp2p.core.common.Enum;
},

setTimeout_ : function(tag, timer, milliSeconds) {
var me = this;
me.timer_ = setTimeout(function() {
me.onTimeout_(tag, me.timer_);
}, milliSeconds);
},
onTimeout_:function()
{
return true;
},
open : function() {
this.opened_ = true;
return true;
},

close : function() {
this.opened_ = false;
return true;
},

send : function(message) {
return false;
},

control : function(ctrl) {
return false;
},

getLastReceiveSpeed_ : function() {
return -1;
},
getUpdateReceiveSpeed_ : function(nowTime, waiting) {
return -1;
},
isActive_ : function() {
return this.active_;
},
isStable_ : function() {
return this.manager_.isStable_();
},

getManager_ : function() {
return this.manager_;
},
getName_ : function() {
return this.name_;
},
getRemoteId_ : function() {
return this.remoteId_;
},
getRemoteAddress_ : function() {
return this.remoteAddress_;
},
getRemoteType_ : function() {
return this.remoteType_;
},
getTerminalType_ : function() {
return this.terminalType_;
},
getType : function() {
return this.manager_.getType();
},
getTypeName_ : function() {
return this.manager_.getTypeName_();
},

setName : function(name) {
this.name_ = name;
},
setRemoteAddress_ : function(address) {
this.remoteAddress_ = address;
},
setRemoteType_ : function(type) {
this.remoteType_ = type;
},
setTerminalType_ : function(type) {
this.terminalType_ = type;
},
updateTerminalType_ : function() {
if (this.manager_.isStable_() || p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeReserved != this.terminalType_) {
return;
}
this.terminalType_ = p2p$.com.webp2p.protocol.base.ManagerStatic.getTerminalType_(this.remoteType_ == "" ? this.name_ : this.remoteType_);
}
});
p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
kTimerTypeEncryptKey : 0,
kTimerTypePieceTn : 1,

opened_ : false,
encryptTryTimes_ : 0,
pieceTnTryTimes_ : 0,
sn_ :-1,

init : function(pool, evt) {
this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn);
this.tag_="com::webp2p::protocol::cdn::Manager";
this.opened_ = false;
this.encryptTryTimes_ = 0;
this.pieceTnTryTimes_ = 0;
this.sn_ = -1;
},

open : function() {
this.close();
this.opened_ = true;
this.doOpen_();
},

doOpen_ : function() {
if (!this.opened_ || !(this.sessions_.length == 0)) {
return;
}
// add primary session
var nodeIndex = 0;
var gslbResponseData = this.pool_.getContext_().gslbData_;
var nodeList = gslbResponseData["nodelist"];
var item,name,locationUrl,session;
for ( var n = 0; n < nodeList.length; n++) {
item = nodeList[n];
name = item["name"];
locationUrl = item["location"];
if (this.pool_.getContext_().cdnMultiRequest_ && this.sessions_.length < this.pool_.getContext_().cdnMultiMaxHost_) {
session = new p2p$.com.webp2p.protocol.cdn.Session(this, locationUrl, nodeIndex++);
session.setName(name);
this.sessions_.push(session);
}
}
//打开cdn下载
for ( var n = 0; n < this.sessions_.length; n++) {
var session = this.sessions_[n];
session.open();
}
this.pool_.getContext_().cdnTotalNodeCount_ = this.sessions_.length;
return true;
},

sleep : function(numberMillis) {
var now = new Date();
var exitTime = now.getTime() + numberMillis;
while (true) {
now = new Date();
if (now.getTime() > exitTime) {
return;
}
}
},

close : function() {
this.opened_ = false;
for ( var n = 0; n < this.sessions_.length; n++) {
var session = this.sessions_[n];
session.close();
}
this.sessions_ = [];
return true;
},

checkGslbExpired_ : function() {
var num = 0;
for ( var n = 0; n < this.sessions_.length; n++) {
var session = this.sessions_[n];
if (session.gslbExpired_) {
num++;
}
}
if (num == this.sessions_.length) {
// gslb timeout error
this.getEventListener_().onGslbExpiredError_();
}
}
});
p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.RequestRange = JClass.extend_({
downloading_ : null,
updated_ : false,
urgent_ : false,
urlOffset_ : 0,
segmentId_ : 0,
segmentSize_ : 0,
tryTimes_ : 0,
offset_ : 0,
length_ : 0,
dataUsed_ : 0,
pieceUsed_ : 0,
url_ : "",
startIndex_ : 0,
endIndex_ : 0,
pieces_ : null,

init : function() {
this.pieces_ = [];
this.downloading_ = false;
this.updated_ = false;
this.urgent_ = false;
this.urlOffset_ = -1;
this.segmentId_ = -1;
this.segmentSize_ = 0;
this.tryTimes_ = 0;
this.offset_ = 0;
this.length_ = 0;
this.dataUsed_ = 0;
this.pieceUsed_ = 0;
this.startIndex_ = 0;
this.endIndex_ = 0;
},

addPiece_ : function(piece) {
this.updated_ = true;

var exists = false;
for ( var n = 0; n < this.pieces_.length; n++) {
var item = this.pieces_[n];
if (item.type_ == piece.type_ && item.id_ == piece.id_) {
exists = true;
break;
}
}
if (!exists) {
this.pieces_.push(piece.fork());
}
return !exists;
},

preparePieces_ : function(forkRange) {
this.offset_ = 0;
this.length_ = 0;
this.pieces_.sort(function(item1, item2) {
return item1.offset_ - item2.offset_;
});
// std::sort(pieces_.begin(), pieces_.end());
if (this.segmentSize_ <= 0) {
return;
}

var lastIndex = -1;
var newSize = 0;
for ( var n = 0; n < this.pieces_.length; n++) {
var piece = this.pieces_[n];
if (piece.size_ <= 0) {
this.offset_ = 0;
this.length_ = 0;
return;
} else if (piece.completedTime_ > 0) {
// alreay completed, skip
continue;
}

if (lastIndex < 0) {
lastIndex = piece.index_;
this.offset_ = piece.offset_;
this.length_ = piece.size_;
newSize++;
this.startIndex_ = this.endIndex_ = lastIndex;
continue;
}
if (lastIndex + 1 != piece.index_) {
// multi segments
forkRange.addPiece_(piece);
continue;
}
this.endIndex_ = lastIndex = piece.index_;
this.length_ += piece.size_;
newSize++;
}

if (this.length_ >= this.segmentSize_ && this.urlOffset_ < 0) {
// full request
this.length_ = 0;
}
}
});
p2p$.ns('com.webp2p.protocol.cdn');

p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE = {
kTimerTypeOpen : 0,
kTimerTypeMeta : 1,
kTimerTypeRangeDownload : 2
};

p2p$.com.webp2p.protocol.cdn.Session = p2p$.com.webp2p.protocol.base.Session.extend_({
metaUrl_ : null,
firstSegmentUrl_ : null,
metaData_ : null,
downloader_ : null,
downloadingRange_ : null,
pendingRanges_ : null,

primary_ : false,
metaTryTimes_ : 0,
activeTime_ : 0,
maxRangeDownloadTime_ : 0,
lastReceiveSpeed_ : 0,
lastStartReceiveTime_ : 0,
lastTotalReceiveBytes_ : 0,

init : function(mgr, remoteId, nodeIndex) {
this._super(mgr, remoteId);
this.tag_="com::webp2p::protocol::cdn::Session";
this.nodeIndex_ = nodeIndex;
this.activeTime_ = 0;
this.metaTryTimes_ = 0;
this.maxRangeDownloadTime_ = 30 * 1000; // ms
this.lastReceiveSpeed_ = 0;
this.lastStartReceiveTime_ = 0;
this.lastTotalReceiveBytes_ = 0;
this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
var mainMeta = this.manager_.getPool_().getMetaData_();
this.metaUrl_ = new p2p$.com.common.Url();
this.firstSegmentUrl_ = new p2p$.com.common.Url();
this.pendingRanges_ = new p2p$.com.common.Map();
if(mainMeta.finalUrl_==remoteId)
{
// primary session
this.primary_ = true;
this.metaData_ = mainMeta;
this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
if (this.metaData_.segments_.length > 0) {
this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
}
}else {
this.primary_ = false;
this.metaData_.verifyMethod_ = mainMeta.verifyMethod_;
this.metaData_.rangeParamsSupported_ = mainMeta.rangeParamsSupported_;
this.metaData_.sourceUrl_ = this.remoteId_;
}
this.metaUrl_.fromString_(this.metaData_.sourceUrl_);
this.remoteAddress_ = (this.primary_ ? "*" : "") + (this.metaUrl_.host_ + ":") + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
this.metaData_.sourceServer_ = this.metaUrl_.host_ + ":" + ((this.metaUrl_.port_ == 0) ? 80 : this.metaUrl_.port_);
this.downloadingRange_ = new p2p$.com.webp2p.protocol.cdn.RequestRange();
},

open : function() {
if (this.active_) {
return true;
}
this._super();
if (this.metaData_.finalUrl_ != "") {
this.active_ = true;
// rank first
if (this.lastReceiveSpeed_ <= 0) {
this.lastReceiveSpeed_ = 200000;
}
this.lastReceiveSpeed_ = this.metaData_.lastReceiveSpeed_;
this.manager_.getEventListener_().onProtocolSessionOpen_(this);
} else {
// delay open to avoid network congestion
this.metaTryTimes_ = -1;
this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 5 * 1000);
}
return true;
},

cleanAllPending_ : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Clean all pending requests, session({2})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_));

// stop timer
if (this.timer_ != null) {
clearTimeout(this.timer_);
this.timer_ = null;
}
if (this.downloader_ != null) {
this.downloader_.log_("clean");
this.downloader_.close();
this.downloader_ = null;
}
this.pendingRanges_.clear();
this.downloadingRange_.downloading_ = false;
},

downloadMeta_ : function() {
this.activeTime_ = this.global_.getMilliTime_();
if (this.downloader_ != null) {
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::downloadMeta_ name({1})",this.tag_,this.name_));
this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:this.metaData_.sourceUrl_, scope_:this, tag_:"cdn::meta"});
this.downloader_.load_();
// set meta timer
this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta, this.timer_, 10 * 1000);
},

downloadNextRange_ : function(retry) {
if (this.downloader_ != null) {
return;
}
if (!retry) {
if (this.pendingRanges_.empty()) {
// completed
return;
}
var forkRange = new p2p$.com.webp2p.protocol.cdn.RequestRange();
this.downloadingRange_ = this.pendingRanges_.element(0).value;
this.downloadingRange_.preparePieces_(forkRange);
if (forkRange.pieces_.length == 0) {
this.pendingRanges_.clear();
}
}

var requestUrl = this.downloadingRange_.url_;
this.downloadingRange_.downloading_ = true;
this.downloadingRange_.dataUsed_ = 0;
this.downloadingRange_.pieceUsed_ = 0;
if (this.downloadingRange_.length_ > 0) {
var offsetBegin = Math.max(this.downloadingRange_.urlOffset_, 0) + this.downloadingRange_.offset_;
var offsetEnd = offsetBegin + this.downloadingRange_.length_ - 1;
if (this.manager_.getPool_().getMetaData_().rangeParamsSupported_) {
if (requestUrl.indexOf('?') == -1) {
requestUrl += "?";
} else {
requestUrl += "&";
}
requestUrl += this.strings_.format("rstart={0}&rend={1}", offsetBegin, offsetEnd);
}
else {
this.requestRange_ = this.strings_.format("bytes={0}-{1}", offsetBegin, offsetEnd);
}
}

// addtional appid
if (requestUrl.indexOf("&appid=") == -1 && requestUrl.indexOf("?appid=") == -1) {
var externalAppId = this.strings_.urlEncode_(this.manager_.getPool_().getEnviroment_().externalAppId_);
var moduleVersion = this.strings_.fromNumber(p2p$.com.selector.Module.getkH5FullVersion_());
if (requestUrl.indexOf('?') == -1) {
requestUrl += "?";
} else {
requestUrl += "&";
}
requestUrl += this.strings_.format("appid={0}&cde={1}", externalAppId, moduleVersion);
}
//
// // p1,p2,p3 parameters, cdn server may take those parameters
if (this.manager_.getPool_().getContext_().addtionalParams_ != "" && requestUrl.indexOf("&p1=") == -1 && requestUrl.indexOf("?p1=") == -1) {
if (requestUrl.indexOf('?') == -1) {
requestUrl += "?";
} else {
requestUrl += "&";
}
requestUrl += this.manager_.getPool_().getContext_().addtionalParams_;
}

requestUrl += this.strings_.format("&ajax={0}", 1);
//
this.lastTotalReceiveBytes_ = 0;
this.lastStartReceiveTime_ = this.global_.getMilliTime_();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::downloadNextrange_ url({1})",this.tag_,requestUrl));
this.manager_.sn_++;
var params={};
params["err"]=0;
params["sn"]=this.manager_.sn_;
this.manager_.eventListener_.sendStatus_({type:"VIDEO.TS.LOADING",params:params});
this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:requestUrl, scope_:this,type_:"arraybuffer", tag_:"cdn::range-data"});
this.downloader_.setInfo_(this.downloadingRange_);
if (this.requestRange_) {
this.downloader_.setRequsetRange_(this.requestRange_);
}
this.downloader_.load_();
this.setTimeout_(p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload, this.timer_, this.maxRangeDownloadTime_);
},

parseMetaResponse_ : function(downloader) {
if (!this.metaData_.load(downloader.responseData_, downloader.totalUsedTime_)) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}[{1}]Parse meta response failed,url({2}),channel({3}),size({4})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_),this.metaData_.sourceUrl_, this.manager_.getPool_().getMetaData_().storageId_,downloader.responseData_.length));
return false;
}
return true;
},

onOpenTimeout_ : function(errorCode) {
this.manager_.getEventListener_().onProtocolSessionOpen_(this);
},

onMetaTimeout_ : function(errorCode) {
if (this.downloader_ != null) {
this.downloader_.log_("timeout");
this.downloader_.close();
this.downloader_ = null;
}
if (++this.metaTryTimes_ != 0) {
var tryTimes = this.metaTryTimes_ < 3 ? "retry again ..." : "meta failed";
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Meta timeout for url{2},channel({3}),try times({4}),result({5})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_),this.metaData_.sourceUrl_,this.manager_.getPool_().getMetaData_().storageId_,this.metaTryTimes_,tryTimes));
}
if (this.metaTryTimes_ < 3) {
this.downloadMeta_();
}
},

onRangeDownloadTimeout_ : function(errorCode) {

if (this.downloader_ != null) {
this.downloader_.log_("timeout");
this.downloader_.close();
this.downloader_ = null;
}

// retry by scheduler ...
this.downloadingRange_.downloading_ = false;
this.downloadingRange_.tryTimes_++;
this.lastReceiveSpeed_ = 0;
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}] Range download timeout, segment({2}), items({3})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.downloadingRange_.segmentId_, this.downloadingRange_.pieces_.length));

var segmentIndex = -1;
if (this.downloadingRange_.segmentId_ >= 0) {
segmentIndex = this.metaData_.getSegmentIndexById_(this.downloadingRange_.segmentId_);
}
if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onRangeDownloadTimeout segment({1}) not found",this.tag_,this.downloadingRange_.segmentId_));
return null;
}
var segment = this.metaData_.segments_[segmentIndex];
for ( var k = 0; k < segment.pieces_.length; k++) {
// setting receiveStartTime_ = 0
// waiting schedule
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0) {
continue;
}
piece.receiveStartTime_ = 0;
}
},

// override protocol::base::Session
onTimeout_ : function(tag, timer, errorCode) {
if (timer != this.timer_ || !this.opened_) {
return;
}

// stop timer
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}

switch (tag) {
case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeOpen:
this.onOpenTimeout_(errorCode);
break;
case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeMeta:
this.onMetaTimeout_(errorCode);
break;
case p2p$.com.webp2p.protocol.cdn.TIMEER_TYPE.kTimerTypeRangeDownload:
this.onRangeDownloadTimeout_(errorCode);
break;
default:
break;
}
},

// override core::supernode::HttpDownloaderListener
onHttpDownloadData_ : function(downloader) {
var handled = false;
if (this.downloader_ != downloader) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadData type({1}),tag({2}),url({3}),channel({4}),code({5}),detail({6}),size({7})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_),downloader.tag_,downloader.url_,this.manager_.getPool_().getMetaData_().storageId_,downloader.responseCode_,downloader.responseDetails_,downloader.responseData_.length));
return handled;
}
if (downloader.tag_ == "cdn::range-data") {

}
},
onMetaCompleted_ :function(downloader)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMetaCompleted, channel({1})",this.tag_,this.manager_.getPool_().getMetaData_().storageId_));
if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
// waiting for timeout and retry ...
return;
}
this.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
this.lastReceiveSpeed_ = downloader.transferedSpeed_;
this.lastTotalReceiveBytes_ = downloader.transferedBytes_;

// stop timer
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
// parse meta data
this.metaData_.storageId_ = this.manager_.getPool_().getMetaData_().storageId_;
this.metaData_.finalUrl_ = downloader.url_;
if (!this.parseMetaResponse_(downloader)) {
return;
}
if (this.metaData_.segments_.length > 0) {
this.firstSegmentUrl_.fromString_(this.metaData_.segments_[0].mediaUrl_);
}
this.active_ = true;
this.downloadNextRange_(false);
this.manager_.getEventListener_().onProtocolSessionOpen_(this);
},
onRangeDataCompleted_ :function(downloader){
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onRangeDataCompleted_ tag({1}) ",this.tag_,downloader.tag_));
this.downloadingRange_.downloading_ = false;
var params={};
params["err"]=downloader.responseCode_;
params["utime"]=downloader.totalUsedTime_;
params["sn"]=this.manager_.sn_;
if (downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
this.lastReceiveSpeed_ = 0;
params["err"]=30001;
this.manager_.eventListener_.sendStatus_({type:"VIDEO.PLAY.ERROR",code:downloader.responseCode_,params:params});
if (downloader.responseCode_ == 403) {
this.gslbExpired_ = true;
this.manager_.checkGslbExpired_();
}
return;
}
this.manager_.eventListener_.sendStatus_({type:"VIDEO.TS.LOADED",params:params});
this.gslbExpired_ = false;
this.lastReceiveSpeed_ = downloader.transferedSpeed_;
this.lastTotalReceiveBytes_ = downloader.transferedBytes_;
// stop timer
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}

var dataOffset = this.downloadingRange_.dataUsed_;
var message = new p2p$.com.webp2p.protocol.base.Message();
while (this.downloadingRange_.pieceUsed_ < this.downloadingRange_.pieces_.length) {
var piece = this.downloadingRange_.pieces_[this.downloadingRange_.pieceUsed_];
if (piece.size_ <= 0) {
if (piece.checksum_ != 0) {
// maybe AD
break;
}
} else if (piece.completedTime_ > 0) {
// already completed
if (this.downloadingRange_.length_ > 0) {
dataOffset += piece.size_;
}
this.downloadingRange_.dataUsed_ += piece.size_;
this.downloadingRange_.pieceUsed_++;
continue;
}

if (this.downloadingRange_.length_ <= 0) {
dataOffset = piece.offset_;
}
if ((dataOffset + piece.size_) > downloader.responseData_.length) {
// incompleted
break;
}

var responseData = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
responseData.segmentId_ = this.downloadingRange_.segmentId_;
responseData.pieceType_ = piece.type_;
responseData.pieceId_ = piece.id_;
responseData.pieceKey_ = piece.key_;
if (piece.size_ <= 0) {
responseData.data_ = downloader.responseData_;
} else {
responseData.data_ = downloader.responseData_.subarray(dataOffset, piece.size_ + dataOffset);
}

if (this.downloadingRange_.length_ > 0) {
dataOffset += piece.size_;
}
this.downloadingRange_.dataUsed_ += piece.size_;
this.downloadingRange_.pieceUsed_++;
piece.completedTime_ = this.global_.getMilliTime_();
message.responses_.push(responseData);
}
if (message.responses_.length != 0) {
this.manager_.getEventListener_().onProtocolSessionMessage_(this, message);
}
},
onHttpDownloadCompleted_ : function(downloader) {
if (this.downloader_ != downloader) {
return;
}
this.downloader_ = null;
this.activeTime_ = this.global_.getMilliTime_();
if (downloader.tag_ == "cdn::meta") {
this.onMetaCompleted_(downloader);
return;
}
if (downloader.tag_ == "cdn::range-data") {
this.onRangeDataCompleted_(downloader);
return;
}
},

close : function() {
this._super();
if (this.timer_ != null) {
clearTimeout(this.timer_);
this.timer_ = null;
}
if (this.downloader_ != null) {
this.downloader_.log_("clean");
this.downloader_.close();
this.downloader_ = null;
}
return true;
},

send : function(message) {
var emptyResponseCount = 0;
var meta = this.metaData_.directMetaMode_ ? this.metaData_ : this.manager_.getPool_().getMetaData_();
var globalMeta = this.manager_.getPool_().getMetaData_();
// // check expire segments
if (this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ < meta.urgentSegmentId_) {
// cancel
if (this.downloader_ != null) {
this.downloader_.log_("cancel");
this.downloader_.close();
this.downloader_ = null;
}
this.downloadingRange_.downloading_ = false;
}
for ( var n = 0; n < message.requests_.length; n++) {
var item = message.requests_[n];
if (item.pieceId_ == -1) {
// clean all requests
this.lastReceiveSpeed_ = -1;
this.lastStartReceiveTime_ = 0;
this.lastTotalReceiveBytes_ = 0;
this.cleanAllPending_();
return true;
}

var index = -1;
if (item.segmentId_ >= 0) {
index = meta.getSegmentIndexById_(item.segmentId_);
} else {
index = meta.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
}
if (index < 0 || index >= meta.segments_.length) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Send piece from session({2}) not found, type({3}), id({4}), ignore it!",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), this.remoteAddress_,p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_));
emptyResponseCount++;
continue;
}
var segment = meta.segments_[index];
var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
emptyResponseCount++;
continue;
}

var piece = segment.pieces_[pieceIndex];
// if( this.downloadingRange_.downloading_ && this.downloadingRange_.segmentId_ == segment.id_ && this.downloadingRange_.length_ <= 0 )
// {
// // full range request, add piece is ok
// if( !this.downloadingRange_.addPiece_(piece) )
// {
// emptyResponseCount ++;
// }
// continue;
// }
//
var range = this.pendingRanges_.get(index);
if (typeof range == 'undefined' || range == null) {
range = new p2p$.com.webp2p.protocol.cdn.RequestRange();
this.pendingRanges_.set(index, range);
}
range.urgent_ = item.urgent_;
range.urlOffset_ = segment.urlOffset_;
range.segmentId_ = segment.id_;
range.segmentSize_ = segment.size_;
if (range.url_ == "") {
// range.url_ = segment.mediaUrl_;
var backupIndex = this.nodeIndex_ - 1;
var isSameSource = (this.primary_ && globalMeta.sourceServer_ == "") || (globalMeta.sourceServer_ == this.metaData_.sourceServer_);
if (isSameSource || this.metaData_.directMetaMode_) {
range.url_ = segment.mediaUrl_;
} else if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == globalMeta.type_ && !globalMeta.directMetaMode_ && backupIndex >= 0
&& segment.moreMediaUrls_ && backupIndex < segment.moreMediaUrls_.length && segment.moreMediaUrls_[backupIndex]) {
range.url_ = segment.moreMediaUrls_[backupIndex];
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Using backup url from meta, index({2}), url({3})",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.manager_.getPool_().getMetaData_().type_), backupIndex, range.url_));
} else {
var newUrl = new p2p$.com.common.Url();
newUrl.fromString_(segment.mediaUrl_);
var isSamePort = newUrl.port_ == this.firstSegmentUrl_.port_ || (newUrl.port_ == 0 && this.firstSegmentUrl_.port_ == 80)
|| (newUrl.port_ == 80 && this.firstSegmentUrl_.port_ == 0);
if (newUrl.host_ != this.firstSegmentUrl_.host_ || !isSamePort) {
newUrl.host_ = this.firstSegmentUrl_.host_;
newUrl.port_ = this.firstSegmentUrl_.port_;

if (this.firstSegmentUrl_.params_.has("path")) {
newUrl.params_.set("path", this.firstSegmentUrl_.params_.get("path"));
}

if (this.firstSegmentUrl_.params_.has("proxy")) {
newUrl.params_.set("proxy", this.firstSegmentUrl_.params_.get("proxy"));
}

range.url_ = newUrl.toString();
} else {
range.url_ = segment.mediaUrl_;
}
}
}
if (!range.addPiece_(piece)) {
emptyResponseCount++;
}
}
this.downloadNextRange_(false);
return true;
},

getLastReceiveSpeed_ : function() {
return -1;
},

getUpdateReceiveSpeed_ : function(nowTime, waiting) {
if (this.pendingRanges_.isEmpty() && !this.downloadingRange_.downloading_ && !waiting) {
return this.lastReceiveSpeed_;
}

var timeUsed = this.lastStartReceiveTime_ > 0 ? (nowTime - this.lastStartReceiveTime_) : 0;
if (timeUsed > 1000) {
this.lastReceiveSpeed_ = this.lastTotalReceiveBytes_ * 1000 / timeUsed;
}
return this.lastReceiveSpeed_;
}
});
p2p$.ns('com.webp2p.protocol.webrtc');

p2p$.com.webp2p.protocol.webrtc.ManagerStatic = {
kTimerTypeTracker : 1,
kTimerTypeSession : 2,
kTimerTypeAsyncPeers : 3,
kTimerTypeOnRegister : 100,
kTimerTypeOnHeartBeat : 101,
kTimerTypeOnQueryPeerList : 102,
};

p2p$.com.webp2p.protocol.webrtc.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
opened_ : false,
websocket_ : null,
queryWebrtcServerTimer_ : null,
heartBeatTimer_ : null,
queryPeerListTimer_ : null,
peers_ : null,
peerMaxConnectingTime_ : 0,
activeSessionCount_ : 0,
ip_:null,//"ws://10.75.227.140:3852",
tag_:"com::webp2p::protocol::webrtc::Manager",

init : function(pool, evt) {
this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc);
this.peers_ = new p2p$.com.common.Map();
this.peerMaxConnectingTime_ = 100 * 1000;
this.activeSessionCount_ = 0;
this.webrtcRegisterEnabled_ = true;
this.webrtcRegistered_ = false;
},

open : function() {
this.close();
this.opened_ = true;
this.activeTime_ = this.global_.getMilliTime_();
this.id_ = this.strings_.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
Math.floor(Math.random() * (1000 + 1)), this.global_.getMilliTime_());

if (this.pool_.getContext_().p2pHeartbeatInterval_ > 0) {
this.heartbeatInterval_ = this.pool_.getContext_().p2pHeartbeatInterval_;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open id({1})",this.tag_,this.id_));
this.queryFromWebrtcServer_();
this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 1 * 1000);
return true;
},

queryFromWebrtcServer_ : function() {
var _serverUrl = this.pool_.getContext_().webrtcServerHost_;
if(this.ip_!=null){
_serverUrl = this.ip_;
}
this.websocket_ = new WebSocket(_serverUrl);
var myFunName = this.strings_.getFunName(arguments.callee.toString());
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} open webrtc server ({2}) ..."
,this.tag_
,myFunName
,this.pool_.getContext_().webrtcServerHost_));
var _me = this;
this.websocket_.onopen = function(evt) {
_me.onWebSocketOpen_(evt);
};
this.websocket_.onclose = function(evt) {
_me.onWebSocketClose_(evt);
};
this.websocket_.onerror = function(evt) {
_me.onWebSocketClose_(evt);
};
this.websocket_.onmessage = function(message) {
_me.onWebSocketMessage_(message);
};
},

onWebSocketOpen_ : function(evt) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Start register webrtc server ({1}) ...",this.tag_,this.pool_.getContext_().webrtcServerHost_));
this.registerWebrtcServer_();
},

onWebSocketClose_ : function(evt) {
var myFunName = this.strings_.getFunName(arguments.callee.toString());
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} webrtc({1}) close ..."
,this.tag_
,myFunName
,this.pool_.getContext_().webrtcServerHost_));
},

onWebSocketMessage_ : function(evt) {
// var me = this;
var message = JSON.parse(evt.data);
var myFunname=this.strings_.getFunName(arguments.callee.toString());
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} data->{2}",this.tag_,myFunname,evt.data));
switch (message.method) {
case 'registerResponse':
this.onRegisterResponse_(message);
break;
case 'heartbeatResponse':
this.onHeartbeatResponse_(message);
break;
case 'queryPeerListResponse':
this.onQueryPeerListResponse_(message);
break;
case 'proxyDataRequest':
this.onProxyDataRequest_(message);
break;
case 'proxyDataResponse':
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} proxy data response code: {2}",this.tag_,myFunname,message.errorCode));
break;
default:
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} unknown method: {3}",this.tag_,myFunname,message.method));
break;
}
},

onTimeout_ : function(tag, timer, errorCode) {
switch (tag) {
case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeTracker:
this.onTimeout_();
break;
case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession:
this.onSessionTimeout_();
break;
case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeAsyncPeers:
//onAsyncPeersTimeout();
break;
case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnRegister:
this.onRegisterTimeout_();
break;
case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnHeartBeat:
this.onHeartBeatTimeout_();
break;
case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnQueryPeerList:
this.onQueryPeerListTimeout_();
break;
default:
break;
}
},

getSelfInfo_ : function() {
var version = this.strings_.format("{0}.{1}.{2}", this.module_.kH5MajorVersion,this.module_.kH5MinorVersion, this.module_.kH5BuildNumber);
var client = {
clientId : this.id_,
clientModule : this.pool_.getEnviroment_().browserType_,
clientVersion : version,
protocolVersion : 1.0,
playType : this.pool_.getContext_().playType_,
p2pGroupId : this.pool_.getMetaData_().p2pGroupId_,
osPlatform : encodeURIComponent(this.pool_.getContext_().osType_),
hardwarePlatform : this.pool_.getEnviroment_().deviceType_ == "Unkonwn" ? encodeURIComponent(this.pool_.getContext_().osType_) : this.pool_
.getEnviroment_().deviceType_
};
return client;
},

onSessionTimeout_ : function() {
this.checkPeerSessions_();
this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 1 * 1000);
},

onRegisterTimeout_ : function() {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Register timeout, try again ...",this.tag_));
},

onHeartBeatTimeout_ : function() {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::HeartBeat timeout, try again ...",this.tag_));
},

onQueryPeerListTimeout_ : function() {
//		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Query peer list timeout, try again ...",this.tag_));
this.queryPeerList_();
},

onHeartbeatResponse_ : function(message) {
},

registerWebrtcServer_ : function() {
var req = {
method : "registerRequest",
streamId : this.pool_.getMetaData_().p2pGroupId_,
nodeInfo : {
ver : this.pool_.getContext_().moduleVersion_,
pos : (111 >= 0 ? 111 : 0),
neighbors : 0,
isp : this.pool_.getContext_().isp_,
country : this.pool_.getContext_().country_,
province : this.pool_.getContext_().province_,
city : this.pool_.getContext_().city_,
area : this.pool_.getContext_().area_,
protocol : p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc
},
localTime : this.global_.getMilliTime_()
};
var mst = p2p$.com.webp2p.protocol.webrtc.ManagerStatic;
this.queryWebrtcServerTimer_ = this.setTimeout_(mst.kTimerTypeOnRegister, this.queryWebrtcServerTimer_, 5000);
this.beginRegisterTime_ = this.global_.getMilliTime_();
this.sendMessage_(req);
},

onRegisterResponse_ : function(message) {
var myFunName=this.strings_.getFunName(arguments.callee.toString());
if (message.errorCode !== 0) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::{1} response failed, errorCode({2})",this.tag_,myFunName,message.errorCode));
return;
}
// if register success, cancel timer
if (this.queryWebrtcServerTimer_) {
clearTimeout(this.queryWebrtcServerTimer_);
this.queryWebrtcServerTimer_ = null;
}
this.pool_.getContext_().webrtcServerConnectedTime_ = this.global_.getMilliTime_() - this.beginRegisterTime_;
this.pool_.getContext_().p2pWebrtcPeerId_ = message.peerId;

this.heartBeat_();
this.queryPeerList_();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} response success, peerid({2})",this.tag_,myFunName,message.peerId));
},

heartBeat_ : function() {
//		this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnHeartBeat, this.heartBeatTimer_, 5000);
},

queryPeerList_ : function() {
var userparam = {"root": { "langtype": "3" }};
userparam=this.strings_.base64Encode_(JSON.stringify(userparam));
var queryPeerListRequest = {
method : "queryPeerListRequest",
limit : 10,
userparam:userparam
};
this.queryPeerListTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnQueryPeerList, this.queryPeerListTimer_,10 * 1000);
this.sendMessage_(queryPeerListRequest);
},

onQueryPeerListResponse_ : function(message) {
var myfunname = this.strings_.getFunName(arguments.callee.toString());
var peerResponseCount = 0;
var newPeerCount = 0;
var itemId = "";
var _arr = message.items;
if (_arr.length == 0) {
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::{1} Query peer list responsed, peerList.length = 0",this.tag_,myfunname));
}
for ( var i = 0; i < _arr.length; i++) {
var peerItem = _arr[i];
itemId = peerItem.peerId;
var isFind = this.peers_.find(itemId);
var info;
if (!isFind) {
if (this.peers_.size() >= this.maxActiveSession_ * 2) {
break;
}
info = new p2p$.com.webp2p.protocol.webrtc.Peer(this);
this.peers_.set(itemId, info);
newPeerCount++;
info.fromServer_ = true;
} else {
info = this.peers_.get(itemId);
}
if (info != null) {
info.load(peerItem);
}

}
peerResponseCount = _arr.length;
this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
if (this.webrtcRegisterEnabled_ && !this.webrtcRegistered_) {
this.webrtcRegistered_ = true;
this.eventListener_.onProtocolManagerOpen_(this, 0);
}

if (newPeerCount >= 0) {
this.checkPeerSessions_();
}

P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::{1} Query peer list successfully, load {2} peer(s), {3} peer(s) now, channel({4})"
,this.tag_
,myfunname
,peerResponseCount
,this.peers_.size()
,this.pool_.getMetaData_().storageId_));
},

checkPeerSessions_ : function() {
var nowTime = this.global_.getMilliTime_();
var updatedPeerCount = 0;

// clean connect failed peers
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_) && (peer.totalConnectingTimes_ > 5 || peer.disconnectTimes_ > 3 || !peer.fromServer_)) {
if (peer.session_ != null) {
this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
}
peer.disconnect();
this.peers_.erase(elem.key);
updatedPeerCount++;
}
}
this.activeSessionCount_ = 0;
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (peer.session_ == null) {
continue;
}
if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
peer.disconnect();
updatedPeerCount++;
} else {
this.activeSessionCount_++;
}
}

if (this.activeSessionCount_ >= this.maxActiveSession_) {
return;
}
var connectablePeers = [];
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
continue;
}
if (!peer.fromServer_) {
// passive peer
continue;
} else if (peer.lastConnectTime_ + 60 * 1000 > nowTime) {
// sleep
continue;
}
connectablePeers.push(peer);
}
for ( var n = 0; n < connectablePeers.length; n++) {
var peer = connectablePeers[n];

// try connect peer
if (!peer.connect()) {
// failed
continue;
}

this.activeSessionCount_++;
if (this.activeSessionCount_ >= this.maxActiveSession_) {
break;
}
}
},

onProxyDataRequest_ : function(message) {
if (typeof (message.data) == 'string') {
message.data = JSON.parse(message.data);
}
switch (message.data.action) {
case 'connectRequest':
this.onRemotePeerConnectRequest_(message.sourcePeerId, message.data);
break;
case 'connectResponse':
this.onRemotePeerConnectResponse_(message.sourcePeerId, message.data);
break;
default:
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Remote peer unknown action: {1}",this.tag_,message.data.action));
break;
}
},

onRemotePeerConnectResponse_ : function(peerId, message) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Recveive a connect response from {1}",this.tag_,peerId));
var itemId = peerId;
var isFind = this.peers_.find(itemId);
var info;
if (!isFind) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Receive a connect response from {1}, but not in the peers",this.tag_,peerId));
return;
} else {
info = this.peers_.get(itemId);
}
if (info != null) {
info.load2(message);
}
info.acceptAnswer_(message.iceCandidates, message.sdpDescriptions);
},

onRemotePeerConnectRequest_ : function(peerId, message) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Receive a connect request from {0}",this.tag_,peerId));
var itemId = peerId;
var isFind = this.peers_.find(itemId);
var info = null;
if (!isFind) {
info = new p2p$.com.webp2p.protocol.webrtc.Peer(this);
this.peers_.set(itemId, info);
info.fromServer_ = false;
} else {
info = this.peers_.get(itemId);
}
if (info != null) {
info.load2(message);
}
info.fromServer_ = false;
this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
info.remoteId_ = peerId;
info.iceServers_ = message.iceServers;
info.remoteIceCandidates_ = message.iceCandidates;
info.remoteSdpDescriptions_ = message.sdpDescriptions;
info.connect();
},
sendMessage_ : function(message) {
if (typeof (message) != 'string') {
message = JSON.stringify(message);
}
if (this.websocket_) {
this.websocket_.send(message);
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Send message channel({1}), msg:{2}",this.tag_,this.pool_.getMetaData_().storageId_, message));
},

closeChannel_ : function(session) {
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (session == peer.session_) {
this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
this.eventListener_.onProtocolSessionClose_(session);
break;
}
}
},

close : function() {
this.opened_ = false;
if (this.websocket_) {
this.websocket_.close();
this.websocket_ = null;
}

if (this.queryPeerListTimer_) {
clearTimeout(this.queryPeerListTimer_);
this.queryPeerListTimer_ = null;
}

if (this.sessionTimer_) {
clearTimeout(this.sessionTimer_);
this.sessionTimer_ = null;
}
if (this.queryWebrtcServerTimer_) {
clearTimeout(this.queryWebrtcServerTimer_);
this.queryWebrtcServerTimer_ = null;
}
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
peer.disconnect();
}
this.peers_.clear();
return true;
}
});
p2p$.ns('com.webp2p.protocol.webrtc');
p2p$.com.webp2p.protocol.webrtc.Packet = {
peerIds_ : [],

// encode
encode : function(message, peerIdsList, type) {
// this.sendrangNum++;
var _sendDataSct = [ {
"sequence_4" : 0
},// 0
{
"dataLength_4" : 0
},// 1
{
"rangeCount_4" : 0
},// 2
{
"rangeItems" : [ [ {
"type_2" : 123
}, {
"start_8" : 234
}, {
"end_4" : 345
} ] ]
},// 3
{
"requestCount_4" : 0
},// 4
{
"requestItems" : [ [ {
"type_2" : 0
}, {
"start_8" : 1411033199
}, {
"cks_4" : 57473
} ] ]
},// 5
{
"responseCount_4" : 0
},// 6
{
"responseItems" : [ [ {
"type_2" : 0
}, {
"start_8" : 1411033199
}, {
"streamLength_4" : 57473
}, {
"stream_d" : null
} ] ]
},// 7
{
"peerCount_4" : 1
},// 连接节点数
{
"peerItems" : [ [ {
"head_4" : 0
}, {
"URL_utf" : "ws://202.103.4.52:34567/*****"
} ] ]
} // 9
];

// 3
var _rangeItems = [];
var _start;
var _end;
for ( var n = 0; n < message.ranges_.length; n++) {
var item = message.ranges_[n];
_start = item.start_;
_end = item.count_;
_rangeItems.push([ {
"type_2" : item.type_
}, {
"start_8" : _start
}, {
"end_4" : (_end)
} ]);
}
_sendDataSct[3].rangeItems = _rangeItems;

// 5
var _requestItems = [];
for ( var n = 0; n < message.requests_.length; n++) {
var item = message.requests_[n];
_requestItems.push([ {
"type_2" : item.pieceType_
}, {
"start_8" : item.pieceId_
}, {
"cks_4" : item.checksum_
} ]);
}
_sendDataSct[5].requestItems = _requestItems;

// 7
var _responseItems = [];
for ( var n = 0; n < message.responses_.length; n++) {
var item = message.responses_[n];
_responseItems.push([ {
"type_2" : item.pieceType_
}, {
"start_8" : item.pieceId_
}, {
"streamLength_4" : item.data_.length
}, {
"stream_d" : item.data_
} ]);
}
_sendDataSct[7].responseItems = _responseItems;

// 9
var _peerItems = [];
if (typeof peerIdsList != 'undefined') {
for ( var n = 0; n < peerIdsList.length; n++) {
var item = peerIdsList[n];
_peerItems.push([ {
"head_4" : n
}, {
"URL_utf" : item
} ]);
}
_sendDataSct[9].peerItems = _peerItems;
}

_sendDataSct[2].rangeCount_4 = _sendDataSct[3].rangeItems.length;
_sendDataSct[4].requestCount_4 = _sendDataSct[5].requestItems.length;
_sendDataSct[6].responseCount_4 = _sendDataSct[7].responseItems.length;
_sendDataSct[8].peerCount_4 = _sendDataSct[9].peerItems.length;

// for(var _i = 0; _i < _sendDataSct[7].responseItems.length;_i++ )
// {
// _sendDataSct[7].responseItems[_i][2].streamLength_4 = _sendDataSct[7].responseItems[_i][3].stream_d.length;
// }

for ( var _i = 0; _i < _sendDataSct[9].peerItems.length; _i++) {
_sendDataSct[9].peerItems[_i][0].head_4 = _sendDataSct[9].peerItems[_i][1].URL_utf.length;
}

// /结算分享数据信息
// for(var _i=0;_i<_sendDataSct[7].responseItems.length;_i++)
// {
// this.shareNum++;
// this.shareSize+=Number(_sendDataSct[7].responseItems[_i][2].streamLength_4);
// }

// this.sendInfo(_sendDataSct);

var _arr = [];
if (type != p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
_sendDataSct.splice(1, 1);
}
this.processObject_(_sendDataSct, _arr);
var _size = 0;

for ( var _i = 0; _i < _arr.length; _i++) {
_size += _arr[_i].length;
}
var _sendData = new Uint8Array(_size);
var _count = 0;
for ( var _i = 0; _i < _arr.length; _i++) {
for ( var _j = 0; _j < _arr[_i].length; _j++) {
_sendData[_count++] = _arr[_i][_j];
}
}
// //
if (type == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
var _sdatalen = _sendData.length;
_sendData[4] = (parseInt(_sdatalen) >> 24) & 0xff;
_sendData[5] = (parseInt(_sdatalen) >> 16) & 0xff;
_sendData[6] = (parseInt(_sdatalen) >> 8) & 0xff;
_sendData[7] = parseInt(_sdatalen) & 0xff;
}
// this.req++;
// this.dl++;
return _sendData;
},

decode : function(value, type) {
var _position = 0;
// var _sequnce = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
// var _time;
var _type;
// var _info;
var _i;
var message = new p2p$.com.webp2p.protocol.base.Message();
// ranges_:null,
// requests_:null,
// responses_:null,

_position += 4;
if (type == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc) {
_position += 4;// 跳过4个字节，这4个字节是说明数据长度的
}

var _rangeCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
_position += 4;
var rangeInfo = null;
if (_rangeCount !== 0) {
for (_i = 0; _i < _rangeCount; _i++) {
_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
_position += 2;
if (p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn === _type) {
// this.remoteTNList.push({"start":_start,"end":(_start+_end-1)});
rangeInfo = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
rangeInfo.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
} else {
// this.remotePNList.push({"start":_start,"end":(_start+_end-1)});
rangeInfo = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
rangeInfo.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;

}
rangeInfo.start_ = -1;
rangeInfo.count_ = 0;
var _start = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
_position += 8;
var _end = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
_position += 4;
rangeInfo.start_ = _start;
rangeInfo.count_ = _end;
message.ranges_.push(rangeInfo);
}
// 输出 range信息
// _info={};
// _info.code="P2P.Range.Info";
// _info.info={"TN":this.remoteTNList,"PN":this.remotePNList};
// this.statics.sendToJs(_info);
}

var _reqCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
_position += 4;
var requestInfo = null;
for (_i = 0; _i < _reqCount; _i++) {

requestInfo = new p2p$.com.webp2p.protocol.base.RequestDataItem();
_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
_position += 2;
var _pid = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
_position += 8;
var _sck = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
_position += 4;

requestInfo.pieceType_ = _type;
requestInfo.pieceId_ = _pid;
requestInfo.checksum_ = _sck;
message.requests_.push(requestInfo);
}

var _respCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
_position += 4;
var responseInfo = null;
// var _len = 1;// (requestArr?requestArr.length:1); && _i<_len
for (_i = 0; _i < _respCount; _i++) {
// _responseItems.push([{"type_2":item.pieceType_},
// {"start_8":item.pieceId_},
// {"streamLength_4":item.data_.length},
// {"stream_d":item.data_}]);
//
responseInfo = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
// if(value.length > 50)
// {
// console.log("response");
// }
// _time = this.config.localTime - this.starttime;
_type = p2p$.com.webp2p.core.common.Number.convertToValue_('2', value, _position);
_position += 2;
var _pid2 = p2p$.com.webp2p.core.common.Number.convertToValue_('8', value, _position);
_position += 8;
var _DataL = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);
_position += 4;

var _stream = p2p$.com.webp2p.core.common.Number.convertToValue_('d', value, _position, _DataL);
_position += _DataL;

responseInfo.pieceType_ = _type;
responseInfo.pieceId_ = _pid2;
responseInfo.data_ = _stream;
message.responses_.push(responseInfo);

// this.dealRemoteData({'pieceID':_pid2,'data':_stream});
// this.downNum++;
// this.downSize+=_stream.length;
// this.speed = Math.round(_stream.length*8/_time/10)/100;
// _info = {};
// _info.code = "P2P.Info.Debug";
// _info.info="p2p:["+this.remoteId_+"] "+_type+"_"+_pid2;
// this.statics.sendToJs(_info);
}

var _peerCount = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);// sequnce
_position += 4;
var peersInfo = [];
for (_i = 0; _i < _peerCount; _i++) {
var _peerheadL = p2p$.com.webp2p.core.common.Number.convertToValue_('4', value, _position);// sequnce
_position += 4;
var _url = p2p$.com.webp2p.core.common.Number.convertToValue_('utf', value, _position, _peerheadL);
_position += _peerheadL;
peersInfo.push(_url);
}
// //接受完数据
// if(_rangeCount>0)
// {
// this.reqrangNum++;
// //防止发送太快，设置间隔
// this.peer.sendMessage_();
// }
return message;
},

processObject_ : function(obj, _array) {
switch (typeof (obj)) {
case "array":
for ( var i = 0; i < obj.length; i++) {
if (obj[i] instanceof Array) {
this.processObject_(obj[i], _array);
} else if (typeof (obj[i]) == "object") {
this.processObject_(obj[i], _array);
}
}
break;
case "object":
for ( var element in obj) {
var size = element.split("_")[1];
if (size) {
p2p$.com.webp2p.core.common.Number.convertToBit_(size, obj[element], _array);
}
if (!size && obj[element]) {
this.processObject_(obj[element], _array);
}
}
break;
default:
break;
}
}
};
p2p$.ns('com.webp2p.protocol.webrtc');

p2p$.com.webp2p.protocol.webrtc.Peer = p2p$.com.webp2p.protocol.base.Session.extend_({
peer_ : null,
dataChannel_ : null,
fromServer_ : false,
session_ : null,
lastConnectTime_ : 0,
manager_ : null,
properties_ : null,
remoteId_ : 0,
remoteConnectionId_ : 0,

localIceCandidates_ : null,
localSdpDescriptions_ : null,

remoteIceCandidates_ : null,
remoteSdpDescriptions_ : null,

iceOptions : null,
sdpOptions : null,
connectionId_ : "",
id_ : "",
connecting_ : false,
serverType_:false,//true为主动节点，false为被动节点
rate_ : 0,
rData_:null,
rData_len:0,
rTotalData_len:0,
tag_:"com::webp2p::protocol::webrtc::Peer",

init : function(manager) {
this._super(manager);
this.fromServer_ = false;
this.session_ = null;
this.lastConnectTime_ = 0;
this.manager_ = manager;
this.selfInfo_ = this.manager_.getSelfInfo_();
this.connectionId_ = "";
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
this.id_ = "";
this.connecting_ = false;
},

load : function(peerItem) {
this.id_ = this.remoteId_ = peerItem.peerId;
},

load2 : function(message) {
for ( var n = 0; n < message.iceCandidates.length; n++) {
var peerInfo = message.iceCandidates[n];
var candidate = peerInfo.candidate;
if (candidate.indexOf("udp") != -1) {
var datas = candidate.split(" ");
if (!this.remoteIp_) {
this.remoteIp_ = datas[4] || "0.0.0.0";
}

if (this.remoteIp_.indexOf(":") != -1) {
continue;
}
if (!this.remotePort_) {
this.remotePort_ = datas[5] || "0";
}

if ((datas[7] || "").indexOf("srflx") == -1) {
continue;
} else {
this.remoteIp_ = datas[4] || "0.0.0.0";
this.remotePort_ = datas[5] || "0";
}
break;
}
}

if (!this.properties_) {
if (message.selfInfo) {
this.properties_ = message.selfInfo;
}

}
this.id_ = this.remoteId_;
},

connect : function() {
if (this.fromServer_) {
var _iceUrl = this.manager_.getPool_().getContext_().stunServerHost_;
this.iceServers_ = [ {
url : _iceUrl + '?transport=udp'
} ];
}
if (this.fromServer_) {
this.connectionId_ = this.remoteId_ + "-active";
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} active Try to connect to remote peer({1})  ...,stunServer({2})",this.tag_,this.remoteId_,
this.iceServers_[0].url));
} else {
this.connectionId_ = this.remoteId_ + "-passive";
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} passive Try to connect to remote peer({1})  ...,stunServer({2})",this.tag_,this.remoteId_,
this.iceServers_[0].url));
}

try {
this.peer_ = new RTCPeerConnection({
iceServers : this.iceServers_
}, this.iceOptions);
if (this.fromServer_) {
this.caller_ = this.peer_;
} else {
this.callee_ = this.peer_;
}
this.setPeerEvents_(this.peer_);
var me = this;
if (this.fromServer_) {
// caller
this.sendChannel_ = this.dataChannel_ = this.peer_.createDataChannel('peerChannel');
this.setChannelEvents_(this.dataChannel_);
} else {
// callee
this.peer_.setRemoteDescription(new RTCSessionDescription({
type : 'offer',
sdp : this.remoteSdpDescriptions_
}));
if (this.remoteIceCandidates_) {
this.addPeerIceCandidates_(this.remoteIceCandidates_);
}
this.callee_.createAnswer(function(description) {
me.callee_.setLocalDescription(description);
me.localSdpDescriptions_ = description.sdp;
},
function( err ){
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createAnswer error",scope_.tag_));
}, this.sdpOptions);
}
this.lastConnectTime_ = this.activeTime_ = this.global_.getMilliTime_();
} catch (e) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Open failed, exception: {1}",this.tag_,(e || "").toString()));
}
},

onPeerOpen_ : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerOpen  create fromserver({1})",this.tag_,this.fromServer_));
var me=this;
this.caller_.createOffer(function( description )
{
me.caller_.setLocalDescription(description);
me.localSdpDescriptions_ = description.sdp;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerOpen",me.tag_));
}, function( err )
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createOffer error",scope_.tag_));
}, this.sdpOptions);
},

sendConnectRequest_ : function() {
if (this.localIceCandidates_.length < 1) {
return;
}

var proxyData = {
action : 'connectRequest',
iceServers : this.iceServers_,
iceCandidates : this.localIceCandidates_,
sdpDescriptions : this.localSdpDescriptions_,
selfInfo : this.selfInfo_
};
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectRequest ({1}) Send connect request ",this.tag_,this.connectionId_));
this.status = true;
this.manager_.sendMessage_({
method : 'proxyDataRequest',
destPeerId : this.remoteId_,
data : JSON.stringify(proxyData)
});
},

sendConnectResponse_ : function() {
if (this.status || this.localIceCandidates_.length < 1) {
return;
}
var proxyData = {
action : 'connectResponse',
iceCandidates : this.localIceCandidates_,
sdpDescriptions : this.localSdpDescriptions_,
selfInfo : this.selfInfo_
};
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectResponse ({1}) Send connect response ",this.tag_,this.connectionId_));
this.status = true;
this.manager_.sendMessage_({
method : 'proxyDataRequest',
destPeerId : this.remoteId_,
data : JSON.stringify(proxyData)
});
},
onPeerIceCandidate_ : function(evt) {

if (evt.candidate) {
// both of caller and callee should save it first,waiting for switch candidate with Peer
this.localIceCandidates_.push(evt.candidate);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerIceCandidate ({2}) Receive PeerIceCandidate:({3})",this.tag_,this.connectionId_,evt.candidate.candidate));
if (!this.connecting_) {

}
} else {
if (this.fromServer_) {
this.sendConnectRequest_();
} else {
this.sendConnectResponse_();
}
}
},

onPeerDataChannel_ : function(evt) {
// callee open channel in this function
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::onPeerDataChannel ({1}) Receive PeerDataChannel,channel name({2})",this.tag_,this.connectionId_,evt.channel.label));
this.dataChannel_ = evt.channel;
this.setChannelEvents_(evt.channel);
},
onChannelOpen_ : function(channel, evt) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onChannelOpen ({1}) Channel open success!!!!!!!!!!!!!!",this.tag_,this.connectionId_));
this.connecting_ = true;
this.session_ = new p2p$.com.webp2p.protocol.webrtc.Session(this.manager_, this.remoteId_, this.dataChannel_, this.remoteIp_, this.remotePort_);
this.session_.attchProperties_(this.properties_);
this.manager_.getEventListener_().onProtocolSessionOpen_(this.session_);
},

onChannelMessage_ : function(channel, evt) {
var type=evt.data.constructor.toString();
var _barry = new Uint8Array(evt.data);
if(type.indexOf("Blob")>-1)
{
var reader = new FileReader();
var me=this;
reader.readAsArrayBuffer(evt.data);
reader.onload = function (e) {
_barry = new Uint8Array(reader.result);
me.analyziseData_(_barry);
}
return;
}
this.analyziseData_(_barry);
},
analyziseData_:function(data)
{
// 提取前4位，如果前4位为0则为数据开始，然后
if (data[0] == 0 && data[1] == 0 && data[2] == 0 && data[3] == 0) {
this.rData_ = new CdeByteArray();
this.rData_len = data.length;
this.rTotalData_len = (data[4] << 24) + (data[5] << 16) + (data[6] << 8) + data[7];
} else {
this.rData_len = this.rData_len + data.length;
}
this.rData_.writeBytes(data);

if (this.rData_len >= this.rTotalData_len) {
//计算传输速度
var time = this.global_.getMilliTime_()-this.session_.sendTime_;
if(time>0&&this.session_.sendTime_>0&&this.rData_len>1000){
this.rate_ = this.rData_len/time;
console.log("rate=",this.rate_,this.rData_len,this.session_.sendTime_);
this.session_.sendTime_=-1;
}
this.rData_len = 0;
this.rTotalData_len = 0;
var message = p2p$.com.webp2p.protocol.webrtc.Packet.decode(this.rData_.uInt8Array, this.manager_.getType());
// console.log("protocol::webrtc::Peer::onChannelMessage_:",message);
this.manager_.getEventListener_().onProtocolSessionMessage_(this.session_, message);

} else {
// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::onChannelMessage ({0}) Channel open part of the message", this.connectionId_));
}
this.activeTime_ = this.global_.getMilliTime_();
},
acceptAnswer_ : function(candidates, sdpDescriptions) {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::acceptAnswer ({1}) Accept answer ",this.tag_,this.connectionId_));
this.remoteIceCandidates_ = candidates;
this.remoteSdpDescriptions_ = sdpDescriptions;
this.peer_.setRemoteDescription(new RTCSessionDescription({
type : 'answer',
sdp : sdpDescriptions
}));
this.addPeerIceCandidates_(candidates);
},
addPeerIceCandidates_ : function(candidates) {
if (Object.prototype.toString.call(candidates) == '[object Array]') {
for ( var i = 0; i < candidates.length; i++) {
this.peer_.addIceCandidate(new RTCIceCandidate(typeof (candidates[i]) != 'string' ? candidates[i] : {
sdpMLineIndex : 0,
sdpMid : 'data',
candidate : candidates[i]
}));
}
} else {
this.peer_.addIceCandidate(new RTCIceCandidate(candidates));
}
},
onChannelError_ : function(channel, evt) {
},

onChannelClose_ : function(channel, evt) {
// this.connecting_ = false;
// this.closeChannel_(evt);
},

closeChannel_ : function(evt) {
this.status = false;
// this.disconnect();
},

setPeerEvents_ : function(peer) {
var me = this;
peer.onnegotiationneeded = function() {
me.onPeerOpen_();
};
peer.onicecandidate = function(evt) {
me.onPeerIceCandidate_(evt);
};
peer.ondatachannel = function(evt) {
me.onPeerDataChannel_(evt);
};
},

setChannelEvents_ : function(channel) {
var me = this;
channel.onopen = function(evt) {
me.onChannelOpen_(channel, evt);
};
channel.onmessage = function(evt) {
me.onChannelMessage_(channel, evt);
};
channel.onerror = function(evt) {
me.onChannelError_(channel, evt);
};
channel.onclose = function(evt) {
me.onChannelClose_(channel, evt);
};
},

disconnect : function() {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::disconnect ({1}) disconnect... ",this.tag_,this.connectionId_));

if (this.dataChannel_) {
this.dataChannel_.close();
this.dataChannel_ = null;
}
if (this.peer_) {
this.peer_.close();
this.peer_ = null;
}

if (this.session_) {
this.manager_.closeChannel_(this.session_);
this.session_.close();
}
this.session_ = null;
this.connecting_ = false;
},

isActive_ : function(nowTime, maxConnectingTime) {
if (this.connecting_) {
if (!this.session_) {
return false;
}
if (this.session_.isActive_()) {
return (this.activeTime_ + 30 * 1000) > nowTime;
} else if (!this.connecting_) {
return false;
}
}
return this.activeTime_ + maxConnectingTime > nowTime;
},
clear : function() {
this.peer_ = null;
this.connectionId = 0;
this.remoteId_ = 0;
this.remoteConnectionId_ = 0;
this.dataChannel_ = null;
this.iceServers_ = null;
this.iceOptions = null;
this.sdpOptions = null;
this.localIceCandidates_ = null;
this.localSdpDescriptions_ = null;
this.remoteIceCandidates_ = null;
this.remoteSdpDescriptions_ = null;
this.status = false;
}
});
p2p$.ns('com.webp2p.protocol.webrtc');

p2p$.com.webp2p.protocol.webrtc.Session = p2p$.com.webp2p.protocol.base.Session.extend_({
channel_ : null,
sendTime_ : -1,
init : function(mgr, remoteId, dataChannel, remoteIp, remotePort) {
this._super(mgr, remoteId);
this.channel_ = dataChannel;
this.remoteIp_ = remoteIp;
this.remotePort_ = remotePort;
this.remoteAddress_ = this.strings_.format("{0}:{1}", this.remoteIp_, this.remotePort_);
},

send : function(message) {
if (!this.channel_) {
return;
}
// P2P_ULOG_TRACE(P2P_ULOG_FMT("com.webp2p.protocol.webrtc.Session::send message"));
var data = p2p$.com.webp2p.protocol.webrtc.Packet.encode(message, [], this.manager_.getType());
try {
this.sendTime_ = this.global_.getMilliTime_();
this.channel_.send(data);
} catch (e) {
this.close();
P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Session::Send to channel failed, {0}, close channel({1})...", e.toString(), this.remoteAddress_));
}
},

attchProperties_ : function(properties) {
if (properties) {
// var clientModule = properties.clientModule;
// var clientVersion = properties.clientVersion;
// var protocolVersion = properties.protocolVersion;
// var playType = properties.playType;
// var p2pGroupId = properties.p2pGroupId;
// var osPlatform = properties.osPlatform;
// var hardwarePlatform = properties.hardwarePlatform;
this.name_ = this.remoteType_ = properties.hardwarePlatform + "/" + properties.clientModule + "-" + properties.clientVersion;
}
},

isActive_ : function() {
return (this.channel_ != null);
},

close : function() {
this.channel_ = null;
}
});
p2p$.ns('com.webp2p.protocol.websocket');
p2p$.com.webp2p.protocol.websocket.ManagerStatic = {
kTimerTypeTracker : 1,
kTimerTypeSession : 2,
kTimerTypeAsyncPeers : 3,
};

p2p$.com.webp2p.protocol.websocket.Manager = p2p$.com.webp2p.protocol.base.Manager.extend_({
http_ : null,
peers_ : null,
selfInnerIp_ : "",
selfInternetIp_ : "",
exchangePeerIdsData_ : "",

opened_ : false,
upnpMapResultReported_ : false,
upnpMapWaiting_ : false,
activeTime_ : 0,
protocolOpenedTime_ : 0,
peerMaxConnectingTime_ : 0,
trackerBeginQueryTime_ : 0,

trackerRegisterEnabled_ : false,
trackerRegistered_ : false,
activeSessionCount_ : 0,
trackerResponseStatus_ : 0,
shareServerPort_ : 0,
shareServerUpnpPort_ : 0,
heartbeatInterval_ : 0,
trackerTryTimes_ : 0,
upnpMapTryTimes_ : 0,
errorMap_:[],
tag_:"com::webp2p::protocol::websocket::Manager",

init : function(pool, evt) {
this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket);
this.peers_ = new p2p$.com.common.Map();
this.heartbeatInterval_ = 30; // seconds
this.shareServerPort_ = 1443; // https port
this.shareServerUpnpPort_ = 0;
this.trackerTryTimes_ = 0;
this.upnpMapTryTimes_ = 0;
this.activeTime_ = 0;
this.trackerRegisterEnabled_ = true;
this.trackerRegistered_ = false;
this.upnpMapResultReported_ = false;
this.upnpMapWaiting_ = false;
this.activeSessionCount_ = 0;
this.trackerResponseStatus_ = 0;
this.trackerBeginQueryTime_ = 0;
this.peerMaxConnectingTime_ = 10 * 1000;
this.errorMap_=[];
this.http_ = null;
},

open : function() {
this.close();
this.opened_ = true;
this.activeTime_ = this.global_.getMilliTime_();
this.id_ = this.strings_.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
Math.floor(Math.random() * (1000 + 1)), this.global_.getMilliTime_());
if (this.pool_.getContext_().p2pHeartbeatInterval_ > 0) {
this.heartbeatInterval_ = this.pool_.getContext_().p2pHeartbeatInterval_;
}
this.pool_.getContext_().p2pWebsocketPeerId_ = this.id_;
this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 5000);
this.queryFromTracker_();
return true;
},

close : function() {
this.opened_ = false;
if (this.serverTimer_) {
clearTimeout(this.serverTimer_);
this.serverTimer_ = null;
}

if (this.sessionTimer_) {
clearTimeout(this.sessionTimer_);
this.sessionTimer_ = null;
}
if (this.http_ != null) {
this.http_ = null;
}
// shareServer_->stop();
// upnpService_->stop();
// for( protocol::base::SessionPtrList::iterator itr = sessions_.begin(); itr != sessions_.end(); itr ++ )
// {
// protocol::base::SessionPtr &session = (*itr);
// if( session.get() ) session->close();
// }
// sessions_.clear();
//
// asyncOpenPeers_.clear();
// asyncClosePeers_.clear();
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
peer.disconnect();
}
this.peers_.clear();
//
// return true;
},

getXmtepHeaders_ : function() {
return "xMtepClientId="
+ this.id_
+ "&xMtepClientModule=h5"
+ "&xMtepClientVersion="
+ this.strings_.format("{0}.{1}.{2}", p2p$.com.selector.Module.kH5MajorVersion,
p2p$.com.selector.Module.kH5MinorVersion, p2p$.com.selector.Module.kH5BuildNumber) + "&xMtepProtocolVersion=1.0"
+ "&xMtepBusinessParams="
+ encodeURIComponent("playType=" + this.pool_.getContext_().playType_ + "&p2pGroupId=" + this.pool_.getMetaData_().p2pGroupId_)
+ "&xMtepOsPlatform=" + encodeURIComponent(this.pool_.getContext_().osType_) + "&xMtepHardwarePlatform=pc";
},

queryFromTracker_ : function() {
if (this.http_ != null) {
this.http_.log("cancel");
this.http_.close();
this.http_ = null;
}

this.activeTime_ = this.global_.getMilliTime_();

var context = this.pool_.getContext_();
// var terminalId = this.strings_.fromNumber(this.pool_.getContext_().terminalType_);
var operateCode = "3"; // get peer list
if (this.activeSessionCount_ >= this.pool_.getContext_().p2pMaxPeers_) {
operateCode = "1"; // heartbeat
}
var userparam = {"root": { "langtype": "3" }};
var url = new p2p$.com.common.Url();
url.protocol_ = "http";
url.host_ = this.pool_.getContext_().trackerServerHost_;
url.file_ = "/cde";
url.params_.set("termid", "2"); // terminalId;...
url.params_.set("format", "1");
url.params_.set("ver", context.playType_ + "." + context.moduleVersion_);
url.params_.set("op", operateCode);
url.params_.set("ckey", this.pool_.getMetaData_().p2pGroupId_);
url.params_.set("outip", "0.0.0.0");
url.params_.set("inip", "0.0.0.0");
url.params_.set("pid", this.strings_.format("33-{0}-0-0", this.id_));
url.params_.set("pos", this.strings_.fromNumber(this.pool_.getContext_().playingPosition_));
url.params_.set("ispId", this.strings_.fromNumber(context.isp_));
url.params_.set("neighbors", this.strings_.fromNumber(this.activeSessionCount_));
url.params_.set("arealevel1", context.countryCode_);
url.params_.set("arealevel2", this.strings_.fromNumber(context.province_));
url.params_.set("arealevel3", this.strings_.fromNumber(context.city_));
url.params_.set("expect", this.strings_.fromNumber(this.pool_.getContext_().p2pMaxPeers_ * 2));
url.params_.set("userparam",this.strings_.base64Encode_(JSON.stringify(userparam)));

var requestUrl = url.toString();
this.trackerBeginQueryTime_ = this.global_.getMilliTime_();
// set tracker timer
this.serverTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeTracker, this.serverTimer_,
this.heartbeatInterval_ * 1000);
this.http_ = new p2p$.com.loaders.HttpDownLoader({url_:requestUrl, scope_:this, type_:"json", tag_:"websocket::tracker"});
this.http_.load_();
},

onHttpDownloadCompleted_ : function(downloader) {
var handled = false;

if (!this.opened_ || this.http_ != downloader) {
// expired
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} Expired http complete for tag({1}), channel({2}), ignore",this.tag_,downloader.tag_, this.pool_
.getMetaData_().storageId_));
return handled;
}

this.http_ = null;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} Http complete for tag({1}), channel({2}), response code({3}), details({4}), size({5})",this.tag_,downloader.tag_, this.pool_.getMetaData_().storageId_, downloader.responseCode_, downloader.responseDetails_, downloader.responseLength_));

if (downloader.tag_ == "websocket::tracker") {
handled = true;
this.activeTime_ = this.global_.getMilliTime_();
if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
// waiting for timeout and retry ...
return handled;
}

if (this.pool_.getContext_().trackerServerConnectedTime_ <= 0) {
this.pool_.getContext_().trackerServerConnectedTime_ = this.activeTime_ - this.trackerBeginQueryTime_;
}
// parse tracker data
this.parseTrackerResponse_(downloader);
}

return handled;
},

parseTrackerResponse_ : function(downloader) {
var peerResponseCount = 0;
var newPeerCount = 0;
// var previousSelfIp = this.selfInternetIp_;
var result = downloader.responseData_;
if (result == "" || result == null) {
// if( this.gslbServerErrorCode_ <= 0 ) gslbServerErrorCode_ = 52001;
return false;
}

if (!downloader.responseData_ == "") {

this.trackerResponseStatus_ = result["status"];
if (this.trackerResponseStatus_ != 200) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} Tracker response status({1}), not 200, channel({2})",this.tag_,this.trackerResponseStatus_,
this.pool_.getMetaData_().storageId_));
return false;
}

this.selfInternetIp_ = result["host"] || "";
var peerList = result["peerlist"] || [];
for ( var n = 0; n < peerList.length; n++) {
var peerItem = peerList[n];
var itemId = peerItem["peerid"];
var itemIp = peerItem["userip"];
var itemPort = peerItem["pport"];
if (itemPort == this.shareServerPort_ && itemIp == this.selfInnerIp_) {
// self
continue;
}
if (itemIp == "127.0.0.1" || itemIp == "0.0.0.0" || itemIp == "255.255.255.255") {
// invalid ip address
continue;
}
if(this.isDisabledIp_(itemIp))
{
//invalid ip address
continue;
}
itemId = this.strings_.toLower_(itemId);
var isFind = this.peers_.find(itemId);
var info;
if (!isFind) {
if (this.peers_.size() >= this.maxActiveSession_ * 2) {
break;
}
info = new p2p$.com.webp2p.protocol.websocket.Peer(this);
this.peers_.set(itemId, info);
newPeerCount++;
info.fromServer_ = true;
} else {
info = this.peers_.get(itemId);
}
if (info != null) {
info.fromServer_ = true;
info.load(peerItem);
}

}
peerResponseCount = peerList.length;
this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.length;
}

var registering = false;
if (this.trackerRegisterEnabled_ && !this.trackerRegistered_) {
registering = true;
this.trackerRegistered_ = true;
this.protocolOpenedTime_ = this.global_.getMilliTime_();
this.eventListener_.onProtocolManagerOpen_(this, 0);
}

if (newPeerCount > 0) {
this.checkPeerSessions_();
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} {1} tracker successfully, self internet ip({2}), load {3} peer(s), {4} peer(s) now, channel({5})",this.tag_,(registering ? "Register to" : "Query peer from"), this.selfInternetIp_, peerResponseCount, this.peers_.length,this.pool_.getMetaData_().storageId_));
},
isDisabledIp_:function(ip)
{
var exit_ = false;
for(var i=0;i<this.errorMap_.length;i++)
{
if(this.errorMap_[i]==ip){
exit_=true;
P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} ip({1}) isDisable!",this.tag_,ip));
break;
}
}
return exit_;
},
checkPeerSessions_ : function() {
var nowTime = this.global_.getMilliTime_();
var updatedPeerCount = 0;

// clean connect failed peers
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_) && (peer.totalConnectingTimes_ > 5 || peer.disconnectTimes_ > 3 || !peer.fromServer_)) {
if (peer.session_ != null) {
this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
this.eventListener_.onProtocolSessionClose_(peer.session_);
}
peer.disconnect();
this.peers_.erase(elem.key);
n--;
updatedPeerCount++;
}
}

this.activeSessionCount_ = 0;
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (peer.session_ == null) {
continue;
}
if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
this.eventListener_.onProtocolSessionClose_(peer.session_);
peer.disconnect();
updatedPeerCount++;
} else {
this.activeSessionCount_++;
}
}

//
if (this.activeSessionCount_ >= this.maxActiveSession_) {
return;
}
//
var connectablePeers = [];
for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (peer.isActive_(nowTime, this.peerMaxConnectingTime_)) {
continue;
}
if (!peer.fromServer_) {
// passive peer
continue;
} else if (peer.lastConnectTime_ + 60 * 1000 > nowTime) {
// sleep
continue;
}
connectablePeers.push(peer);
}

for ( var n = 0; n < connectablePeers.length; n++) {
var peer = connectablePeers[n];
// try connect peer
if (!peer.connect(this)) {
// failed
continue;
}
this.activeSessionCount_++;
if (this.activeSessionCount_ >= this.maxActiveSession_) {
break;
}
}
},

onTimeout_ : function(tag, timer, errorCode) {
switch (tag) {
case p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeTracker:
this.onTrackerTimeout_();
break;
case p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeSession:
this.onSessionTimeout_();
break;
case p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeAsyncPeers:
//			this.onAsyncPeersTimeout();
break;
default:
break;
}
},

onTrackerTimeout_ : function() {
if (this.http_ != null) {
this.http_.log("timeout");
// http_->close();
this.http_ = null;
}

if (!this.opened_) {
return;
}
this.queryFromTracker_();
},

onSessionTimeout_ : function() {
this.checkPeerSessions_();
this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.websocket.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 5000);
},

onWebSocketOpen_ : function(evt, session) {
this.status = true;
},

onWebSocketMessage_ : function(message, session) {
if (!this.opened_) {
return false;
}
if (!this.status) {
return;
}

for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
var me = this;
if (session == peer.session_) {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Active session({1}, {2}:{3}) message arrive",this.tag_,peer.id_, peer.internetIp_,peer.internetPort_));

peer.activeTime_ = this.global_.getMilliTime_();

var data = message.data;
switch (typeof (data)) {
case "string":
if (false === session.openHashhand) {
session.openHashhand = true;
session.attchProperties_(JSON.parse(data));
this.eventListener_.onProtocolSessionOpen_(session);
}
break;
case "object":
var fileReader = new FileReader();
fileReader.onload = function() {
var messageDecode = p2p$.com.webp2p.protocol.webrtc.Packet.decode(new Uint8Array(this.result), me.getType());
me.getEventListener_().onProtocolSessionMessage_(session, messageDecode);
};
fileReader.readAsArrayBuffer(data);
break;
}
}

}
},

onWebSocketClose_ : function(evt, session) {
if (!this.opened_) {
return false;
}

for ( var n = 0; n < this.peers_.length; n++) {
var elem = this.peers_.element(n);
var peer = elem.value;
if (session == peer.session_) {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Session({1}, {2}:{3}) closed",this.tag_,peer.id_, peer.internetIp_, peer.internetPort_));
this.pool_.getContext_().websocketTotalNodeCount_ = this.peers_.size();
this.eventListener_.onProtocolSessionClose_(session);
peer.disconnect();
break;
}
}
return true;
},
onWebSocketError_ : function(evt,session){
if (!this.opened_) {
return false;
}
//把当前节点添加到已经连接过得节点
var exit_ = false;
for(var i=0;i<this.errorMap_.length;i++)
{
if(this.errorMap_[i]==session.remoteIp_){
exit_=true;
break;
}
}
if(!exit_){
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} add Invalid ip（{1}）",this.tag_,session.remoteIp_));
this.errorMap_.push(session.remoteIp_);
}
this.onWebSocketClose_(evt,session);
}
});
p2p$.ns('com.webp2p.protocol.websocket');

p2p$.com.webp2p.protocol.websocket.PeerStatic = {
nextConnectionId_ : 0,
};

p2p$.com.webp2p.protocol.websocket.Peer = p2p$.com.webp2p.protocol.base.Session.extend_({
protocol_ : 0,
weight_ : 0,
terminalType_ : 0,
id_ : "",
internetIp_ : "",
innerIp_ : "",
internetPort_ : 0,
innerPort_ : 0,
fromServer_ : false,

// status
loadTime_ : 0,
activeTime_ : 0,
lastConnectTime_ : 0,
heartbeatTime_ : 0,
peerExchangeTime_ : 0,
usingParamsMode_ : false,
innerIpConnectingTimes_ : 0,
totalConnectingTimes_ : 0,
disconnectTimes_ : 0,
randomSeed_ : 0,
connecting_ : false,


init : function(manager) {
this._super(manager,"");
this.tag_="com::webp2p::protocol::websocket::Peer";
this.protocol_ = 0;
this.weight_ = 0;
this.terminalType_ = 0;
this.internetPort_ = 0;
this.innerPort_ = 0;

this.loadTime_ = 0;
this.activeTime_ = 0;
this.lastConnectTime_ = 0;
this.heartbeatTime_ = 0;
this.peerExchangeTime_ = 0;
this.innerIpConnectingTimes_ = 0;
this.totalConnectingTimes_ = 0;
this.disconnectTimes_ = 0;
this.randomSeed_ = Math.floor(Math.random() * (1000 + 1));
this.usingParamsMode_ = false;
this.connecting_ = false;
this.fromServer_ = false;
},

load : function(result) {
this.loadTime_ = this.global_.getMilliTime_();
this.id_ = result["peerid"];
this.protocol_ = result["protocol"];
this.weight_ = result["weight"];
this.terminalType_ = result["termid"];
this.internetIp_ = result["userip"];
this.internetPort_ = result["pport"];
this.innerIp_ = result["inip"];
this.innerPort_ = result["inport"];
},

loadFromUrl_ : function(url) {
var info = new p2p$.com.common.Url;
info.fromString_(url);

this.loadTime_ = this.global_.getMilliTime_();
this.id_ = this.strings_.makeLower_(info.params_.get("peerId"));
this.terminalType_ = this.strings_.parseNumber_(info.params_.get("terminalType"), 0);
this.internetIp_ = info.host_;
this.internetPort_ = info.port_;
this.innerIp_ = info.params_.get("inIp");
this.innerPort_ = this.strings_.parseNumber_(info.params_.get("inPort"), 0);
},

toStringUrl_ : function() {
return this.strings_.format("ws://{0}:{1}/mtep-exchange-connection?inIp={2}&inPort={3}&peerId={4}", this.internetIp_,
this.internetPort_, this.innerIp_, this.innerPort_, id_);
},

attach : function(mgr, conn) {
},

connect : function(mgr, selfInternetIp) {
// this.disconnect();
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Try to connect to({1}), {2}:{3} ...",this.tag_,this.id_,this.internetIp_,this.internetPort_));

this.connecting_ = true;
this.totalConnectingTimes_++;
this.lastConnectTime_ = this.activeTime_ = this.global_.getMilliTime_();
this.session_ = new p2p$.com.webp2p.protocol.websocket.Session(mgr, this.id_, this.internetIp_, this.internetPort_);
return this.session_.open();
},

disconnect : function() {
this.connecting_ = false;
if (this.session_ != null) {
this.disconnectTimes_++;
this.session_.close();
}
this.session_ = null;
return true;
},

isActive_ : function(nowTime, maxConnectingTime) {
if (this.connecting_) {
if (this.session_ == null) {
return false;
}

if (this.session_.isActive_()) {
return (this.activeTime_ + 60 * 1000) > nowTime;
} else if (!this.connecting_) {
return false;
}
}
return this.activeTime_ + maxConnectingTime > nowTime;
}
});
p2p$.ns('com.webp2p.protocol.websocket');

p2p$.com.webp2p.protocol.websocket.Session = p2p$.com.webp2p.protocol.base.Session.extend_({

init : function(mgr, remoteId, remoteIp, remotePort) {
this._super(mgr, remoteId);
this.remoteIp_ = remoteIp;
this.remotePort_ = remotePort;
this.passive_ = false;
this.remoteAddress_ = this.strings_.format("{0}:{1}", this.remoteIp_, this.remotePort_);
this.openHashhand = false;
},

send : function(message) {
// console.log("com.webp2p.protocol.websocket.Peer::onWebSocketMessage_:send",message);
// P2P_ULOG_TRACE(P2P_ULOG_FMT("com.webp2p.protocol.websocket.Session::send message"));
var data = p2p$.com.webp2p.protocol.webrtc.Packet.encode(message, [], this.manager_.getType());
this.websocket.send(new Blob([ data ]));
},

open : function() {
if (this.passive_) {
return true;
}
var mgr = this.manager_;
var xmtepHeaders = mgr.getXmtepHeaders_();
var me = this;
this.uir = "ws://" + this.remoteIp_ + ":" + this.remotePort_ + "/mtep-exchange-connection?" + xmtepHeaders;
try {
this.websocket = new WebSocket(this.uir);
} catch (e) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}open failed, exception: {1}",this.tag_,e.toString()|""));
return false;
}
this.websocket.onopen = function(evt) {
mgr.onWebSocketOpen_(evt, me);
};
this.websocket.onclose = function(evt) {
mgr.onWebSocketClose_(evt, me);
};
this.websocket.onmessage = function(message) {
mgr.onWebSocketMessage_(message, me);
};
this.websocket.onerror = function(evt) {
mgr.onWebSocketError_(evt, me);
};
return true;
},

close : function() {
this.websocket = null;
},

isActive_ : function() {
if (this.passive_) {
return false;
} else {
return this.websocket;
}
},

attchProperties_ : function(value) {
if (!value) {
return;
}

// var responseClientId_ = "";
var hardwarePlatform = "";
var strClientMode = "";
var strClientVersion = "";
// var businessParamString = "";
if (value.hasOwnProperty("x-mtep-client-id")) {
responseClientId_ = value["x-mtep-client-id"];
} else if (value.hasOwnProperty("xMtepClientId")) {
responseClientId_ = value["xMtepClientId"];
}

if (value.hasOwnProperty("x-mtep-hardware-platform")) {
hardwarePlatform = value["x-mtep-hardware-platform"];
} else if (value.hasOwnProperty("xMtepHardwarePlatform")) {
hardwarePlatform = value["xMtepHardwarePlatform"];
}

if (value.hasOwnProperty("x-mtep-client-module")) {
strClientMode = value["x-mtep-client-module"];
} else if (value.hasOwnProperty("xMtepClientModule")) {
strClientMode = value["xMtepClientModule"];
}

if (value.hasOwnProperty("x-mtep-client-version")) {
strClientVersion = value["x-mtep-client-version"];
} else if (value.hasOwnProperty("xMtepClientVersion")) {
strClientVersion = value["xMtepClientVersion"];
}
this.name_ = this.remoteType_ = hardwarePlatform + "/" + strClientMode + "-" + strClientVersion;

if (value.hasOwnProperty("x-mtep-business-params")) {
businessParamString = value["x-mtep-business-params"];
} else if (value.hasOwnProperty("xMtepBusinessParams")) {
businessParamString = value["xMtepBusinessParams"];
}
}
});

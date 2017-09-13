p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Channel = JClass.extend_({
tag_:"com::webp2p::logic::base::Channel",
channelType_ : "base",
type_ : 0,
groupType_ : 0,
id_ : "",
playerTaskId_ : "",
playerHistoryKey_ : "",
globalParams_ : "",
context_ : null,//
url_ : null,//
player_:null,

protocolPool_ : null,
manager_ : null,

stablePeers_ : null,
otherPeers_ : null,
statData_ : null,

opened_ : false,
paused_ : false,
reopenMode_ : false,
redirectMode_ : false,
hlsMode_ : false,
directMetaMode_ : false,
icpCode_ : 0,
createTime_ : 0,
openTime_ : 0,
activeTime_ : 0,
closeTime_ : 0,
urlTagTime_ : 0,
maxSleepTime_ : 0,
maxSilentTime_ : 0,
channelOpenedTime_ : 0,
mediaStartTime_ : 0,
mediaActiveTime_ : 0,
playerStartTime_ : 0,
playerFlushTime_ : 0,
playerFlushInterval_ : 0,
playerFlushMaxInterval_ : 0,
playerInitialPosition_ : 0,
playerSkipPosition_ : 0,
playerSkipDuration_ : 0,
lastScheduleTime_ : 0,
lastPeerSortTime_ : 0,
lastPieceShareInUpdateTime_ : 0,
lastMessageUpdateTime_ : 0,
firstSegmentId_ : 0,
playerSegmentId_ : 0,
urgentSegmentId_ : 0,
urgentSegmentEndId_ : 0,
completedSegmentId_ : 0,
urgentSegmentIndex_ : 0,
urgentIncompleteCount_ : 0,
otherPeerRequestCount_ : 0,
checksumTryTimes_ : 0,

gslb_:null,//调出
meta_:null,//m3u8
metaData_ : null,//切片数据
/*meta信息*/
metaResponseCode_ : 0,
metaResponseDetails_ : "",
metaResponseType_ : "",
metaResponseBody_ : "",

checksumServerResponseCode_ : 0,
segmentNotFoundTimes_ : 0,
checksumLoadTime_ : 0,
checksumFileData_ : "",

peerReceiveTimeout_ : 0,
peerDeadTimeout_ : 0,
selectorReported_ : false,

rtmfpServerReported_ : false,
rtmfpGatherReported_ : false,
cdeTrackerReported_ : false,
webrtcServerReported_ : false,

firstReceivePieceReported_ : false,
p2pFirstPieceReported_ : false,
playerPositionSkipped_ : false,
playerBufferingSkipped_ : false,
selfRanges_ : "",
firstSeekTime_ : 0,
scheduleTimer_ : null,
reportTimer_ : null,
static_:null,//统计上报
strings_:null,
global_:null,
config_:null,
/**
* params
* type:播放类型
* channelUrl:下载地址
**/
init : function(type, channelUrl, decodedUrl, mgr) {
// console.debug("base.Channel init");
this.strings_ = p2p$.com.common.String;
this.global_ = p2p$.com.common.Global;
this.config_ = p2p$.com.selector.Config;
this.context_ = new p2p$.com.webp2p.core.supernode.Context();
this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
this.statData_ = new p2p$.com.webp2p.logic.base.StatData();
this.gslb_ = new p2p$.com.webp2p.logic.base.Gslb(this,decodedUrl);
this.meta_ = new p2p$.com.webp2p.logic.base.Meta(this,type);
this.selfRangesMessage_ = new p2p$.com.webp2p.protocol.base.Message();
this.stablePeers_ = [];
this.otherPeers_ = [];
this.id_ = p2p$.com.webp2p.core.common.Md5.hexString_(channelUrl).toLowerCase();
this.metaData_.type_ = type;
this.metaData_.channelUrl_ = channelUrl;
this.metaData_.storageId_ = this.id_;
this.manager_ = mgr;
this.type_ = type;
this.url_ = decodedUrl;

this.groupType_ = 0;
this.opened_ = false;//
this.paused_ = false;//
this.reopenMode_ = false;
this.redirectMode_ = false;
this.hlsMode_ = true;
this.directMetaMode_ = false;
this.icpCode_ = 0; // default icp
this.closeTime_ = 0;
this.urlTagTime_ = 0;
this.maxSleepTime_ = 60 * 1000;
this.maxSilentTime_ = 120 * 1000;
this.channelOpenedTime_ = 0;
this.mediaStartTime_ = 0;
this.mediaActiveTime_ = 0;
this.playerStartTime_ = 0;
this.playerFlushTime_ = 0;
this.playerFlushInterval_ = 0;
this.playerFlushMaxInterval_ = 0;
this.playerInitialPosition_ = -1;
this.playerSkipPosition_ = -1;
this.playerSkipDuration_ = 0;
this.lastScheduleTime_ = 0;
this.lastPeerSortTime_ = 0;
this.lastPieceShareInUpdateTime_ = 0;
this.lastMessageUpdateTime_ = 0;
this.firstSegmentId_ = -1;
this.playerSegmentId_ = -1;
this.urgentSegmentId_ = -1;
this.urgentSegmentEndId_ = -1;
this.completedSegmentId_ = -1;
this.urgentSegmentIndex_ = 0;
this.urgentIncompleteCount_ = 0;
this.otherPeerRequestCount_ = 0;

this.selectorReported_ = false;
this.rtmfpServerReported_ = false;
this.rtmfpGatherReported_ = false;
this.webrtcServerReported_ = false;
this.cdeTrackerReported_ = false;
this.firstReceivePieceReported_ = false;
this.p2pFirstPieceReported_ = false;
this.playerPositionSkipped_ = false;
this.playerBufferingSkipped_ = false;

this.checksumTryTimes_ = 0;
this.checksumServerResponseCode_ = 0;
this.segmentNotFoundTimes_ = 0;
this.openTime_ = 0;
this.createTime_ = this.activeTime_ = this.global_.getMilliTime_();

// default config
this.peerReceiveTimeout_ = 30 * 1000;
this.peerDeadTimeout_ = 30 * 1000;

// gslb reload
this.checksumLoadTime_ = 0;
this.selfRanges_ = "";
this.scheduleTimer_ = null;
this.reportTimer_ = null;
this.player_ = null;
if(p2p$.com.tools)
{
this.static_ = new p2p$.com.tools.collector.Statics(this);
}
},
setPlayer_:function(player)
{
this.player_ = player;
},
loadParams_ : function(params, customParams) {
this.globalParams_ = params;
this.playerTaskId_ = params["taskid"];
if (params.hasOwnProperty("icp")) {
this.icpCode_ = params["icp"];
}
this.metaData_.taskId_ = this.playerTaskId_;
this.metaData_.rangeParamsSupported_ = (this.icpCode_ == 0); // only default icp support range params
this.context_.loadParams_(this.globalParams_, customParams);
},

updateActiveTime_ : function(activate) {
this.activeTime_ = this.global_.getMilliTime_();
},

setUrlTagTime_ : function(tagTime) {
this.urlTagTime_ = tagTime;
},

open : function() {

this.checksumTryTimes_ = 0;
this.checksumServerResponseCode_ = 0;
this.segmentNotFoundTimes_ = 0;
this.openTime_ = this.activeTime_ = this.global_.getMilliTime_();
this.mediaActiveTime_ = 0;
this.urgentSegmentId_ = 0;
this.urgentIncompleteCount_ = 0;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}:open channel",this.tag_));
if (this.protocolPool_ != null) {
this.protocolPool_.exit();
}
this.protocolPool_ = new p2p$.com.webp2p.protocol.base.Pool(this.manager_.getEnviroment_(), this.context_, this.metaData_, this);
this.opened_ = true;
var env = this.manager_.getEnviroment_();
env.setChannelParams_(this.url_.params_);
this.context_.initialize_(this.url_, env);
this.sendStatus_({type:"VIDEO.INIT"});
return true;
},
onOpened_:function() {},
onTimeout_:function()
{
return true;
},
onSchedule_:function()
{
return true;
},
close_ : function() {
this.opened_ = false;
this.closeTime_ = this.global_.getMilliTime_();
this.stablePeers_ = [];
this.otherPeers_ = [];
this.meta_.close_();
if(this.static_){
this.static_.close_();
this.static_ = null;
}
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
if (this.scheduleTimer_) {
clearTimeout(this.scheduleTimer_);
this.scheduleTimer_ = null;
}
if (this.reportTimer_) {
clearTimeout(this.reportTimer_);
this.reportTimer_ = null;
}
if (this.protocolPool_ != null) {
this.protocolPool_.exit();
// if( responseSchedule_.get() ) responseSchedule_->close();
}

this.protocolPool_ = null;
// responseSchedule_.reset();

if (this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
var bucket = this.getStorageBucket_();
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
bucket.remove(objectId);
}
}
this.metaData_.segments_ = [];
return true;
},

pause : function() {
},

setChecksumTimeout_ : function() {
},
setProtocolTimeout_ : function() {
},
flushMetaCache_ : function() {
},

isOpened_ : function() {
return this.opened_;
},

isPaused_ : function() {
return this.paused_;
},
onGslbComplete_:function()
{
if (!("" == this.metaData_.sourceUrl_)) {
var params={
utime:this.gslb_.gslbTotalUseTime_,
err:200,
sn:this.gslb_.sn_
};
this.sendStatus_({type:"VIDEO.GSLB.LOADED",params:params});
if (this.hlsMode_) {
this.downloadMeta_();
}
}
},
downloadMeta_ : function() {
this.activeTime_ = this.global_.getMilliTime_();
this.sendStatus_({type:"VIDEO.META.LOADING"});
this.meta_.load_(this.context_.gslbData_["nodelist"]);
},

onMetaComplete_ : function(code, info, data) {
this.metaResponseCode_ = code;
this.metaResponseDetails_ = info;
if (200 != code && 302 != code) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Meta complete, channel({1}) open failed, response code({2}),info({3}) to player",this.tag_,this.id_,code,info));
var params={};
params["err"] = code;
switch(code){
case 20500:
case 20501:
params["utime"]=this.gslb_.gslbTotalUseTime_;
break;
case 20601:
params["utime"]=this.meta_.metaUseTime_;
break;
}
this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code,info:info,params:params});
} else {
var params={
utime:this.meta_.metaUseTime_
};
this.sendStatus_({type:"VIDEO.META.LOADED",code:0,params:params});
this.onOpened_();
if (this.channelOpenedTime_ <= 0) {
this.channelOpenedTime_ = this.global_.getMilliTime_();
}
if (this.firstSeekTime_ > 0) {

if (this.metaData_) {
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.startTime_ <= this.firstSeekTime_ * 1000 && this.firstSeekTime_ * 1000 < segment.startTime_ + segment.duration_) {
this.urgentSegmentId_ = segment.id_;
break;
}
}
}
}
if (this.firstSegmentId_ < 0 && this.metaData_.segments_.length > 0) {
this.firstSegmentId_ = this.metaData_.segments_[0].id_;
}
}
},

setScheduleTimeout_ : function(tag, timeoutMs) {
var me = this;
this.scheduleTimer_ = setTimeout(function() {
me.onTimeout_(tag);
}, timeoutMs);
},
setReportTimeout_ : function(tag, timeoutMs) {
var me = this;
this.reportTimer_ = setTimeout(function() {
me.onTimeout_(tag);
}, timeoutMs);
},
onReport_ : function() {
if (this.static_) {
this.static_.sendTraffic_(4,false);
}
},
/*自身piece信息*/
fillSelfPieceRanges_ : function(message) {
message.ranges_ = [];
if (!this.context_.p2pUploadEnabled_ || !this.manager_.getEnviroment_().p2pUploadEnabled_) {
var littleRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
littleRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
littleRange.start_ = 0;
littleRange.count_ = 1;
message.ranges_.push(littleRange);
return;
}

var lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
var lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();

lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
lastTnRange.start_ = -1;
lastTnRange.count_ = 0;
lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
lastPnRange.start_ = -1;
lastPnRange.count_ = 0;
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.p2pDisabled_) {
continue;
}
for ( var k = 0; k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
var lastRange = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? lastTnRange : lastPnRange;
if (piece.completedTime_ <= 0) {
// complete
if (lastRange.start_ >= 0) {
message.ranges_.push(lastRange);
if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
lastTnRange.start_ = -1;
lastTnRange.count_ = 0;
} else {
// lastPnRange
lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
lastPnRange.start_ = -1;
lastPnRange.count_ = 0;
}
}
continue;
}
if (lastRange.start_ < 0) {
lastRange.start_ = piece.id_;
}
lastRange.count_ = Math.max(0, piece.id_ - lastRange.start_) + 1;
}
}
if (lastTnRange.start_ >= 0) {
message.ranges_.push(lastTnRange);
}
if (lastPnRange.start_ >= 0) {
message.ranges_.push(lastPnRange);
}
this.selfRanges_ = "";
for ( var n = 0; n < message.ranges_.length; n++) {
var range = message.ranges_[n];
if (range.type_ == 0) {
var end = range.start_ + range.count_ - 1;
this.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
}
}
},

resetPeerMessage_ : function(nowTime, resetSpeed, peer) {
// send clean message
var message = new p2p$.com.webp2p.protocol.base.Message();
var cleanRequest = new p2p$.com.webp2p.protocol.base.RequestDataItem();
cleanRequest.pieceId_ = -1;
message.requests_.push(cleanRequest);
peer.lastSegmentId_ = -1;
peer.pendingRequestCount_ = 0;
if (resetSpeed) {
peer.lastReceiveSpeed_ = 0;
}
peer.totalSendRequests_ = peer.totalReceiveResponses_;
peer.lastTimeoutTime_ = peer.activeTime_ = nowTime;
peer.session_.send(message);
},

checkTimeoutPeers_ : function(nowTime) {
var expireTime = nowTime - this.peerReceiveTimeout_;
if (this.metaData_.p2pGroupId_ == "") {
expireTime += (this.peerReceiveTimeout_ / 2);
}
for ( var n = 0; n < this.stablePeers_.length; n++) {
var item = this.stablePeers_[n];
if (item.pendingRequestCount_ <= 0) {
continue;
}
if ((item.activeTime_ >= expireTime) && (item.lastSegmentId_ < 0 || item.lastSegmentId_ >= this.urgentSegmentId_)) {
// all pending downloads before urgent segment should be clear
continue;
}

item.timeoutTimes_++;

P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Peer stable blocked {2} times, peer id({3}), address({4}),lastSegment({5}),urgentSegment({6}),isTiemout({7})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.timeoutTimes_, item.session_.getRemoteId_(), item.session_.getRemoteAddress_(), item.lastSegmentId_, this.urgentSegmentId_, (item.activeTime_ < expireTime ? "true" : "false")));

this.resetPieceReceivingBySession_(item.sessionId_);
this.resetPeerMessage_(nowTime, false, item);
}

for ( var n = 0; n < this.otherPeers_.length; n++) {
var item = this.otherPeers_[n];
if (item.receivePiece_.receiveStartTime_ <= 0) {
continue;
}

if (item.receivePiece_.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime) {
continue;
}

// timeout
item.lastReceiveSpeed_ = 0;
item.timeoutTimes_++;
item.lastTimeoutTime_ = nowTime;
item.receivePiece_.receiveStartTime_ = 0;
item.receivePiece_.receiveByOther_ = false;

// release piece mark
var segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.receivePiece_.type_, item.receivePiece_.id_);
if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
continue;
}
var segment = this.metaData_.segments_[segmentIndex];
var pieceIndex = segment.getPieceIndex_(item.receivePiece_.type_, item.receivePiece_.id_);
if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
continue;
}
var piece = segment.pieces_[pieceIndex];
piece.receiveStartTime_ = 0;
piece.receiveSessionId_ = 0;
piece.receiveByOther_ = false;

P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Peer timeout {2} times, peer({3}://{4}), address({5}), segment id({6}), piece type({7}), id({8}), {9}/{10}",this.tag_, this.getTypeName_(), item.timeoutTimes_, item.session_.getTypeName_(), item.session_.getRemoteId_(), item.session_.getRemoteAddress_(),segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.receivePiece_.type_), item.receivePiece_.id_, (piece.index_ + 1),segment.pieces_.length));
}
},

checkTimeoutPieces_ : function(nowTime) {
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.p2pDisabled_) {
continue;
}
if (segment.id_ < this.urgentSegmentId_ || segment.completedTime_ > 0) {
continue;
}
for ( var k = 0; k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0 || // already complete
!piece.receiveByStable_ || // not receving
piece.receiveStartTime_ <= 0 || // not receving by stable
(piece.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime)) // not timeout yet
{
continue;
}

// timeout
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Piece stable timeout, channel://{2}/{3}/{4}/{5}, {6}/{7}, release",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), this.id_, segment.id_, piece.getTypeName_(), piece.id_,(piece.index_ + 1), segment.pieces_.legnth));
piece.receiveByStable_ = false;
piece.receiveStartTime_ = 0;
piece.receiveSessionId_ = 0;
}
}
},

checkPeerPieceRanges_ : function(nowTime) {
var minInterval = this.context_.p2pShareRangeInterval_ * 1000;
for ( var n = 0; n < this.otherPeers_.length; n++) {
var item = this.otherPeers_[n];
if (item.lastRangeExchangeTime_ + minInterval > nowTime) {
continue;
}

if (!this.selfRangesMessage_.ranges_.length == 0) {
item.lastRangeExchangeTime_ = nowTime;
item.statSendMessage_(this.selfRangesMessage_);
item.session_.send(this.selfRangesMessage_);
}
}
},

resetPieceReceivingBySession_ : function(sessionId) {
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.completedTime_ > 0) {
continue;
}
for ( var k = 0; k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
if (piece.receiveSessionId_ == sessionId) {
piece.receiveByStable_ = false;
piece.receiveByOther_ = false;
piece.receiveStartTime_ = 0;
piece.receiveSessionId_ = 0;
}
}
}
},

getStorageBucket_ : function() {
return p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
},

resetSegmentPieceCompletion_ : function(segmentId) {
var segmentIndex = this.metaData_.getSegmentIndexById_(segmentId);
if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Reset segment piece completion find segment({1}) failed",this.tag_, segmentId));
return false;
}
var segment = this.metaData_.segments_[segmentIndex];
segment.resetPieceCompletion_();
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Reset segment piece completion reset segment({1}) success",this.tag_, segmentId));
return true;
},

processMessageResponses_ : function(nowTime, peer, message) {
var updatePieceCount = 0;
var invalidPieces = 0;
var bucket = this.getStorageBucket_();
var session = peer.session_;
// responses: update storage data
for ( var n = 0; n < message.responses_.length; n++) {
var item = message.responses_[n];
if (item.pieceId_ < 0) {
// empty response
break;
}
var segmentIndex = -1;
if (item.segmentId_ >= 0) {
segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
} else {
segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
}
if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Response piece from session({2}://{3}) segment not found for channel({4}),segment idx({5}), piece type({6}), id({7}), drop it!",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_));
invalidPieces++;
peer.totalInvalidErrors_++;
if(this.static_)
{
this.static_.sendTraffic_(0,session.getType(),0,0,item.data_.length);
}
continue;
}
var segment = this.metaData_.segments_[segmentIndex];
var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Response piece from session({2}://{3}) piece not found for channel({4}),segment idx({5}), piece type({6}), id({7}), idx({8}), drop it!",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_),session.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.pieceType_), item.pieceId_, pieceIndex));
invalidPieces++;
peer.totalInvalidErrors_++;
if(this.static_)
{
this.static_.sendTraffic_(0,session.getType(),0,0,item.data_.length);
}
continue;
}
// verify checksum
var piece = segment.pieces_[pieceIndex];
piece.receiveByStable_ = false;
piece.receiveStartTime_ = 0;
if (item.data_.length == 0) {
continue;
}
if ((piece.size_ > 0 && item.data_.length != piece.size_) || !this.metaData_.verifyPiece_(piece, item.data_, item.data_.length)) {
// checksum check failed
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Verify piece size/checksum failed from session({2}://{3}), peer id({4}),segment({5}), piece type({6}), id({7}), size({8}/{9})",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
peer.lastReceiveSpeed_ = 0; // reset speed
peer.totalInvalidErrors_++;
peer.setPieceInvalid_(piece.type_, piece.id_, true);
invalidPieces++;
if (!(piece.size_ > 0 && item.data_.length != piece.size_)) {
peer.totalChecksumErrors_++;
}
if(this.static_)
{
this.static_.sendTraffic_(0,session.getType(), 0, 1,item.data_.length);
}
continue;
}

var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
if (!bucket.exists(objectId)) {
if (segment.completedPieceCount_ > 0) {
updatePieceCount++;
segment.resetPieceCompletion_();
}
}

if (segment.size_ > 0) {
bucket.reserve(objectId, segment.size_);
} else if (segment.size_ == 0 && segment.pieces_.length == 1) {
bucket.reserve(objectId, item.data_.length);
}
if (!bucket.write(objectId, piece.offset_, item.data_, item.data_.length)) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Write piece to storage({2}) failed from session({3}://{4}), peer id({5}),segment({6}), piece type({7}), id({8}), size({9}/{10})",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bucket.getName_(), session.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
bucket.remove(objectId);
segment.resetPieceCompletion_();
if(this.static_)
{
this.static_.sendTraffic_(0,session.getType(), 0, 0,item.data_.length);
}
continue;
}
piece.writeTimes_ = this.global_.getMilliTime_();
peer.lastSegmentId_ = peer.lastSegmentId_ > segment.id_ ? peer.lastSegmentId_ : segment.id_;
if (this.mediaStartTime_ <= 0) {
this.mediaStartTime_ = this.global_.getMilliTime_();
}

piece.receiveSessionId_ = 0;
if (piece.recvTimes_++ < 1) {
// stat, avoid duplicated data
var isUrgent = (this.urgentSegmentId_ < 0 || this.urgentSegmentEndId_ < 0)
|| (segment.id_ >= this.urgentSegmentId_ && segment.id_ <= this.urgentSegmentEndId_);
updatePieceCount++;
piece.completedTime_ = nowTime;
piece.receiveProtocol_ = session.getType();
peer.statReceiveData_(1, item.data_.length);
this.statData_.addReceiveData_(isUrgent, session.getType(), 1, item.data_.length);
if(this.static_)
{
this.static_.sendTraffic_(1,session.getType(), session.getTerminalType_(), item.data_.length);
}
if (this.statData_.firstPieceFetchTime_ <= 0) {
this.statData_.firstPieceFetchTime_ = nowTime - this.createTime_;
}

if (!this.firstReceivePieceReported_) {
this.firstReceivePieceReported_ = true;
this.sendStatus_({type:"ACTION.FIRST.PIECE",code:p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, host:session.getRemoteAddress_(), ut:nowTime - this.createTime_});
}
if (!this.p2pFirstPieceReported_ && !session.isStable_()) {
this.p2pFirstPieceReported_ = true;
this.sendStatus_({type:"ACTION.FIRST.P2P.PIECE",code:p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, host:session.getRemoteAddress_(), ut:nowTime - this.createTime_});
}
}

segment.lastActiveTime_ = nowTime;
if (segment.size_ <= 0) {
segment.size_ = item.data_.length;
}
segment.checkPieceCompletion_();
if (segment.completedTime_ > 0) {
this.completedSegmentId_ = this.completedSegmentId_ > segment.id_ ? this.completedSegmentId_ : segment.id_;
this.statData_.totalReceiveDuration_ += segment.duration_;
// asyncSchedule(true);
}
}

if (message.responses_.length > 0) {
peer.timeoutTimes_ = 0;
var pendingRequestCount = peer.pendingRequestCount_ - message.responses_.length;
peer.pendingRequestCount_ = 0 > pendingRequestCount ? 0 : pendingRequestCount;
peer.receivePiece_.receiveStartTime_ = 0;
peer.updateSpeed_(nowTime);
}
return updatePieceCount;
},

updatePeersSpeed_ : function(nowTime, peers) {
for ( var n = 0; n < peers.length; n++) {
var peer = peers[n];
peer.updateSpeed_(nowTime);
}
},

getNextIdleStablePeer_ : function() {
var result = null;
for ( var n = 0; n < this.stablePeers_.length; n++) {
var item = this.stablePeers_[n];
if (item.pendingRequestCount_ <= 0) {
result = item;
break;
}
}
return result;
},

getUrgentMaxDuration_ : function(ratio) {
var maxDuration = this.context_.p2pUrgentSize_ * ratio;
if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
&& this.urgentSegmentIndex_ + 1 < this.metaData_.segments_.length) {
// at least 2 segment(s)
var segment1 = this.metaData_.segments_[this.urgentSegmentIndex_];
var segment2 = this.metaData_.segments_[this.urgentSegmentIndex_ + 1];
if (maxDuration <= segment1.duration_) {
maxDuration = segment1.duration_ + segment2.duration_;
// P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}+{1}={2}",segment1.duration_,segment2.duration_,maxDuration));
}
}
return maxDuration;
},

requireSegmentData_ : function(requestSegmentId, urgentSegmentId) {
var segmentId = requestSegmentId;
this.updateActiveTime_(true);
this.mediaActiveTime_ = this.global_.getMilliTime_();
if (this.playerStartTime_ <= 0) {
this.playerStartTime_ = this.mediaActiveTime_;
}
this.updateUrgentSegment_(urgentSegmentId);
if (this.metaData_.segments_.length <= 0) {
// not load yet
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}:requireSegmentData_ Segment({0}) not load yet", this.tag_,segmentId));
return null;
}
var segment = this.metaData_.getSegmentById_(segmentId);
if (segment == null) {
this.segmentNotFoundTimes_++;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}:requireSegmentData_ Segment({0}) Not Found",this.tag_, segmentId));
return null;
}
var bucket = this.getStorageBucket_();
var objectId = this.metaData_.getSegmentStorageId_(segmentId);
var objectExists = bucket.exists(objectId);
var retStream = null;
if (segment.completedTime_ > 0 && objectExists) {
retStream = bucket.read(objectId, 0);
segment.lastPlayTime_ = this.activeTime_;
this.statData_.totalPlayedDuration_ += segment.duration_;
for ( var n = 0; n < segment.pieces_.length; n++) {
var piece = segment.pieces_[n];
piece.playedTime_ = this.activeTime_;
this.statData_.totalPlayedPieces_++;
this.statData_.totalPlayedBytes_ += piece.size_;
}
} else {
if (segment.completedTime_ > 0 && !objectExists) {
// has been clearExpiredBlock ，need resetPieceCompletion_
segment.resetPieceCompletion_();
this.fillSelfPieceRanges_(this.selfRangesMessage_);
}
// need re download
this.onSchedule_(false);
}
return {
segment : segment,
stream : retStream
};
},
setFirstSeekTime_ : function(firstseektime) {
this.firstSeekTime_ = firstseektime;
},
updateUrgentSegment_ : function(requireId) {
//		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::updateUrgentSegment_ id({1})",this.tag_,requireId));
this.urgentSegmentId_ = requireId;
},

onProtocolSelectorOpen_ : function(errorCode) {
if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
// already closed
return;
}

P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Protocol selector({2}) open, channel({3}), code({4}), {5}",this.tag_, p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), this.context_.selectorServerHost_, this.id_, errorCode,(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "FAILED" : "OK"));

if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
// report only open successfully
if (!this.selectorReported_ && this.context_.selectorConnectedTime_ > 0) {
this.selectorReported_ = true;
// update gather and websocket trakcer info
if(this.static_)
{
var url = new p2p$.com.common.Url();
url.fromString_(this.context_.trackerServerHost_);
var params_={};
params_["trackerServerIp_"]=url.host_;
params_["trackerServerPort_"]=url.port_;
url.fromString_(this.context_.webrtcServerHost_);
params_["webrtcServerIp_"]=url.host_;
params_["webrtcServerPort_"]=url.port_;
url.fromString_(this.context_.stunServerHost_);
params_["stunServerIp_"]=url.host_;
params_["stunServerPort_"]=url.port_;
this.static_.setTrafficParams_(params_);
this.sendStatus_({type:"ACTION.SELECTOR.CONNECTED", code:0,host:this.context_.selectorServerHost_, ut:this.context_.selectorConnectedTime_});
}
}
}
},

onProtocolSessionOpen_ : function(session) {
if (this.protocolPool_ == null) {
return;
}
var peer = null;// = new p2p$.com.webp2p.logic.base.Peer();
var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
session.updateTerminalType_();

// bool alreadyExists = false;
var sameTypeCount = 0;
for ( var n = 0; n < peers.length; n++) {
var item = peers[n];
if (item.session_ == session) {
peer = item;
}
if (item.session_ && item.session_.getType() == session.getType()) {
sameTypeCount++;
}
}
//
if (peer != null) {
// reset peer timeout
peer.timeoutTimes_ = 0;
} else {
sameTypeCount++;
peer = new p2p$.com.webp2p.logic.base.Peer();
peer.session_ = session;
peers.push(peer);
}
peer.activeTime_ = this.global_.getMilliTime_();

if (!session.isStable_()) {
if(this.static_)
{
this.static_.sendTraffic_(2, session.getType(), sameTypeCount);
}
}

// tell him my piece ranges
if (!this.selfRangesMessage_.empty() && this.manager_.getEnviroment_().p2pEnabled_ && !session.isStable_()) {
peer.statSendMessage_(this.selfRangesMessage_);
session.send(this.selfRangesMessage_);
this.lastPieceShareInUpdateTime_ = this.global_.getMilliTime_();
}
this.onSchedule_(!session.isStable_());
},

onProtocolSessionMessage_ : function(session, message) {
if (this.protocolPool_ == null) {
return;
}
if (session == null) {
return;
}
// onProtocolSessionAccept(session);
var updatePieceCount = 0;
var nowTime = this.global_.getMilliTime_();
var peer = null;
var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
for ( var n = 0; n < peers.length; n++) {
var item = peers[n];
if (item.session_ == session) {
peer = item;
break;
}
}
if (peer == null) {
return;
}
peer.activeTime_ = nowTime;
peer.statReceiveMessage_(message);

var rangeUpdateCount = 0;
if (message.ranges_.length > 0) {
// ranges: update bitmap
rangeUpdateCount = this.processMessageRanges_(nowTime, peer, message);
}
//
var uploadable = (this.urgentIncompleteCount_ <= 0 || this.context_.p2pUrgentUploadEnabled_);
if (this.manager_.getEnviroment_().p2pEnabled_ && uploadable && !message.requests_.length == 0) {
this.processMessageRequests_(nowTime, peer, message);
}
//
if (message.responses_.length > 0) {
updatePieceCount += this.processMessageResponses_(nowTime, peer, message);
}
//
// if( updatePieceCount > 0 )
// {
this.fillSelfPieceRanges_(this.selfRangesMessage_);
// }
//
if ((rangeUpdateCount > 0 && (this.lastMessageUpdateTime_ + 300 * this.global_.kMicroUnitsPerMilli < nowTime))
|| message.responses_.length > 0) {
lastMessageUpdateTime_ = nowTime;
this.onSchedule_(!session.isStable_());
}
},

processMessageRequests_ : function(nowTime, peer, message) {
// requests: get piece
var totalResponsedSize = 0;
var responseMessage = new p2p$.com.webp2p.protocol.base.Message();
var bucket = this.getStorageBucket_();
var session = peer.session_;

// responseMessage.responses_.resize(message.requests_.size());
for ( var n = 0; n < message.requests_.length; n++) {
var item = message.requests_[n];
var responseItem = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
responseMessage.responses_.push(responseItem);
responseItem.pieceId_ = item.pieceId_;
responseItem.pieceType_ = item.pieceType_;

do {
var segmentIndex = -1;
if (item.segmentId_ >= 0) {
segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
} else {
segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
}
if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) segment not found for channel(%s), "
// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), ignore it!"),
// core::common::getMetaTypeName_(type_),
// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_);
break;
}

var segment = this.metaData_.segments_[segmentIndex];
if (segment.p2pDisabled_) {
// p2p disabled
break;
}

var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
var objectExists = bucket.exists(objectId);
if (!objectExists) {
if (segment.completedPieceCount_ > 0) {
// expired, reset
segment.resetPieceCompletion_();
this.fillSelfPieceRanges_(this.selfRangesMessage_);
}
break;
}

var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) piece not found for channel(%s), "
// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), idx(%d), ignore it!"),
// core::common::getMetaTypeName_(type_),
// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_, (int)pieceIndex);
break;
}

// verify checksum
var piece = segment.pieces_[pieceIndex];
// if( (piece.size_ > 0 && item.checksum_ != (size_t)piece.checksum_) || piece.completedTime_ <= 0 )
if (piece.completedTime_ <= 0) {
// checksum check failed
// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request verify piece checksum/complete failed from session(%s://%s), peer
// id(%s), "
// "segment(" _I64FMT_ "), piece type(%s), id(" _I64FMT_ ")"),
// core::common::getMetaTypeName_(type_),
// session.getTypeName_(), session.getRemoteAddress_().c_str(), session.getRemoteId_().c_str(),
// segment.id_, core::common::getPieceTypeName_(piece.type_), piece.id_);
break;
}

responseItem.segmentId_ = segment.id_;
responseItem.pieceKey_ = piece.key_;
if (piece.size_ <= 0) {
// bucket.read(objectId, 0, responseItem.data_);
break;
} else {
responseItem.data_ = bucket.read(objectId, piece.offset_, piece.size_);
}
totalResponsedSize += responseItem.data_.length;
} while (false);
}

// if( !context_.p2pUploadLimit_ || !responseSchedule_ || !responseSchedule_->scheduleRequest(nowTime, peer, std::move(responseMessage),
// (int)totalResponsedSize))
// {
this.statData_.addSendData_(session.getType(), responseMessage.responses_.length, totalResponsedSize);
if(this.static_){
this.static_.sendTraffic_(3, session.getType(), session.getTerminalType_(), totalResponsedSize);
}
peer.statSendData_(responseMessage.responses_.length, totalResponsedSize);
peer.statSendMessage_(responseMessage);
session.send(responseMessage);
// }

return 0;
},

getOtherPeerRequestCount_ : function() {
var requestCount = 0;
for ( var n = 0; n < this.otherPeers_.length; n++) {
var item = this.otherPeers_[n];
if (item.receivePiece_.receiveStartTime_ <= 0) {
continue;
}
requestCount++;
}
return requestCount;
},

getStablePeersSpeedTooSlow_ : function() {
if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
return false;
}

var stableTooSlow = false;
var firstSegment = this.metaData_.segments_[this.urgentSegmentIndex_];
if (firstSegment.size_ > 0 && firstSegment.duration_ > 0) {
var firstRate = firstSegment.size_ * 1000 / firstSegment.duration_;
var thresoldRate = firstRate * this.context_.cdnSlowThresholdRate_;
var fastStableSpeed = 0;
for ( var n = 0; n < this.stablePeers_.length; n++) {
var fastPeer = this.stablePeers_[n];
if (fastPeer.pendingRequestCount_ > 0) {
fastStableSpeed = fastPeer.lastReceiveSpeed_;
break;
}
}
if (fastStableSpeed >= 0 && fastStableSpeed < thresoldRate) {
stableTooSlow = true;
}
}

return stableTooSlow;
},

updateUrgentIncompleteCount_ : function() {
this.urgentIncompleteCount_ = 0;
if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
return;
}

var maxDuration = this.context_.p2pUrgentSize_ * 1000;
var totalDuration = 0;
var urgentCount = 0;
for ( var n = this.urgentSegmentIndex_; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.completedTime_ <= 0) {
this.urgentIncompleteCount_++;
}
totalDuration += segment.duration_;
urgentCount++;
if (urgentCount > 1 && totalDuration >= maxDuration) {
// urgent should has 2 segments at least if more segments eixst
break;
}
}
},

getNextIdleOtherPeer_ : function(pieceType, pieceId) {
var result = null;
for ( var n = 0; n < this.otherPeers_.length; n++) {
var item = this.otherPeers_[n];
if (item.timeoutTimes_ > 5) {
continue;
}

if (item.receivePiece_.receiveStartTime_ <= 0 && item.hasPiece_(pieceType, pieceId)) {
result = item;
break;
}
}
return result;
},

processMessageRanges_ : function(nowTime, peer, message) {
var rangeUpdateCount = 0;
var session = peer.session_;

// clean old bitmap status
peer.tnPieceMark_.clear(true);
peer.pnPieceMark_.clear(true);
peer.selfRanges_ = "";
for ( var n = 0; n < message.ranges_.length; n++) {
var range = message.ranges_[n];
if (range.type_ == 0) {
var end = range.start_ + range.count_ - 1;
peer.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
}

var bitmap = (range.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? peer.tnPieceMark_ : peer.pnPieceMark_;
var maxBits = p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
for ( var index = range.start_, count = 0; count < range.count_ && count <= maxBits; index++, count++) {
var old = bitmap.setValue(index, true);
if (!old) {
rangeUpdateCount++;
}
}
}
if (this.manager_.getEnviroment_().p2pEnabled_ && message.ranges_.length != 0
&& (peer.lastRangeExchangeTime_ + this.context_.p2pShareRangeInterval_ * 1000 < nowTime)) {
if (!this.selfRangesMessage_.empty()) {
peer.lastRangeExchangeTime_ = nowTime;
peer.statSendMessage_(this.selfRangesMessage_);
session.send(this.selfRangesMessage_);
}
}
if (rangeUpdateCount > 0 && this.lastPieceShareInUpdateTime_ + 2000 < nowTime) {
this.lastPieceShareInUpdateTime_ = nowTime;
this.updateMetaPieceShareInRanges_(true);
}

return rangeUpdateCount;
},

updateMetaPieceShareInRanges_ : function(startFromUrgent) {
var startIndex = startFromUrgent ? ((this.urgentSegmentIndex_ < 0) ? 0 : this.urgentSegmentIndex_) : 0;
for ( var n = startIndex; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.p2pDisabled_) {
continue;
}
for ( var k = 0; k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
piece.shareInRanges_ = 0;
for ( var j = 0; j < this.otherPeers_.length; j++) {
var peer = this.otherPeers_[j];
if (peer.hasPiece_(piece.type_, piece.id_)) {
piece.shareInRanges_++;
}
}
}
}
},

getTypeName_ : function() {
return p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_);
},

onProtocolManagerOpen_ : function(mgr, errorCode) {
if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
// already closed
return;
}
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::[{1}] Protocol manager({2}://{3}) open, channel({4}), code({5}), {6}",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), mgr.getTypeName_(), mgr.getId_(), this.id_, errorCode,(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "try open after 10 seconds..." : "OK"));
// report only open successfully
if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
var url = new p2p$.com.common.Url();
var params={};
params["err"]=0;
if (!this.rtmfpServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp && this.context_.rtmfpServerConnectedTime_ > 0) {
this.rtmfpServerReported_ = true;
url.fromString_(this.context_.rtmfpServerHost_);
params["rip"]=url.host_;
params["rport"]=url.port_;
params["utime"]=this.context_.rtmfpServerConnectedTime_;
this.sendStatus_({type:"ACTION.RTMFP.CONNECTED", code:0,params:params});
}
if (!this.cdeTrackerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket && this.context_.trackerServerConnectedTime_ > 0) {
this.cdeTrackerReported_ = true;
url.fromString_(this.context_.trackerServerHost_);
params["gip"]=url.host_;
params["gport"]=url.port_;
params["utime"]=this.context_.trackerServerConnectedTime_;
this.sendStatus_({type:"ACTION.SOCKET.CONNECTED", code:0,params:params});
}
if (!this.webrtcServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc && this.context_.webrtcServerConnectedTime_ > 0) {
this.webrtcServerReported_ = true;
url.fromString_(this.context_.webrtcServerHost_);
params["wrip"]=url.host_;
params["wrport"]=url.port_;
params["utime"]=this.context_.webrtcServerConnectedTime_;
this.sendStatus_({type:"ACTION.WEBRTC.CONNECTED", code:0, params:params});
}
}
},

onProtocolSessionClose_ : function(session) {
if (this.protocolPool_ == null || session == null) {
// already closed
return;
}

var erased = false;
var sameTypeCount = 0;
var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
for ( var n = 0; n < peers.length; n++) {
var item = peers[n];
if (item.session_ == session) {
erased = true;
this.resetPieceReceivingBySession_(item.sessionId_);
peers.splice(n--, 1);
} else {
if (item.session_ && item.session_.getType() == session.getType()) {
sameTypeCount++;
}
}
}

if (erased) {
// this.updateMetaPieceShareInRanges_(true);
if (!session.isStable_()) {
if(this.static_){
this.static_.sendTraffic_(2, session.getType(), sameTypeCount);
}
}
}
},

getActiveTime_ : function() {
return this.activeTime_;
},//

getMaxSleepTime_ : function() {
return this.maxSleepTime_;
},

getChannelUrl_ : function() {
return this.metaData_.channelUrl_;
},

getMaxSilentTime_ : function() {
return this.maxSilentTime_;
},

p2pIsReady_ : function() {
if (this.protocolPool_ != null) {
return this.protocolPool_.p2pIsReady_();
}
return false;
},

p2pisActive_ : function() {
if (this.protocolPool_ != null) {
return this.protocolPool_.p2pisActive_();
}
return false;
},

p2pDeactive_ : function() {
this.otherPeers_ = [];
if (this.protocolPool_ != null) {
return this.protocolPool_.p2pDeactive_();
}
return false;
},

p2pActivate_ : function() {
if (this.protocolPool_ != null) {
return this.protocolPool_.p2pActivate_();
}
return false;
},
//get set
getId_ : function() {
return this.id_;
},
getChannelType_ : function() {
return this.channelType_;
},

setGroupType : function(type) {
this.groupType_ = type;
},

setReopenMode : function(mode) {
this.reopenMode_ = mode;
},
setListener_ : function(listener) {
this.wrapper_ = listener;
},
onGslbExpiredError_ : function() {
var code = 30404;
var info = "GSLB has expired";
this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code,info:info});
},
sendStatus_:function(params,type)
{
if(this.static_){
this.static_.sendStatus_(params);
}
if(this.wrapper_&&!type){
this.wrapper_.sendStatus_(params);
}
},

getAllStatus_ : function(params, result) {
var simpleMode = params.get("simple");
var needGslbData = params.get("gslb");
var segmentStartWithPlayer = params.get("segmentStartWithPlayer") == "1";
var maxDuration = params.get("maxDuration");
if (segmentStartWithPlayer && maxDuration <= 0) {
maxDuration = 300; // default
}

result["id"] = this.id_;
result["type"] = this.getTypeName_();
result["opened"] = this.opened_;
result["paused"] = this.paused_;
result["groupType"] = this.groupType_;
result["redirectMode"] = this.redirectMode_;
result["directMetaMode"] = this.directMetaMode_;
result["playerHistoryKey"] = this.playerHistoryKey_;
result["icpCode"] = this.icpCode_;
result["channelUrl"] = this.metaData_.channelUrl_;
result["channelPlayUrl"] = p2p$.com.common.String.format("/play?debug={0}&mcdn={1}&enc=base64&ext=m3u8&url={2}", this.context_.debug_ ? 1
: 0, this.context_.cdnMultiRequest_ ? 1 : 0, p2p$.com.common.String.urlEncode_(p2p$.com.common.String
.base64Encode_(this.metaData_.channelUrl_)));
result["gslbEncryptUrl"] = this.gslb_.gslbRequestUrl_;
result["createTime"] = this.createTime_;
result["openTime"] = this.openTime_;
result["activeTime"] = this.activeTime_;
result["urlTagTime"] = this.urlTagTime_;
result["gslbTryTimes"] = this.gslb_.gslbTryTimes_;
result["metaTryTimes"] = this.meta_.metaTryTimes_;
result["gslbServerResponseCode"] = this.gslb_.gslbServerResponseCode_;
result["gslbServerErrorCode"] = this.gslb_.gslbServerErrorCode_;
result["gslbServerErrorDetails"] = this.gslb_.gslbServerErrorDetails_;
result["metaServerResponseCode"] = this.meta_.metaServerResponseCode_;
result["checksumServerResponseCode"] = this.checksumServerResponseCode_;
result["channelOpenedTime"] = this.channelOpenedTime_;
result["maxSleepTime"] = this.maxSleepTime_;
result["playerFlushTime"] = this.playerFlushTime_;
result["playerFlushInterval"] = this.playerFlushInterval_;
result["playerFlushMaxInterval"] = this.playerFlushMaxInterval_;
result["playerInitialPosition"] = this.playerInitialPosition_;
result["playerSkipPosition"] = this.playerSkipPosition_;
result["playerSkipDuration"] = this.playerSkipDuration_;
result["playerSegmentId"] = this.playerSegmentId_;
result["urgentSegmentId"] = this.urgentSegmentId_;
result["urgentSegmentEndId"] = this.urgentSegmentEndId_;
result["urgentIncompleteCount"] = this.urgentIncompleteCount_;
result["otherPeerRequestCount"] = this.otherPeerRequestCount_;
result["completedSegmentId"] = this.completedSegmentId_;
result["downloadedRate"] = this.statData_.urgentReceiveSpeed_;
// result["downloadedDuration"] = getDownloadedDuration();
result["downloadedDuration"] = this.statData_.downloadedDuration_;
result["mediaStartTime"] = this.mediaStartTime_;
result["metaResponseCode"] = this.metaResponseCode_;
result["metaResponseDetails"] = this.metaResponseDetails_;
result["metaResponseType"] = this.metaResponseType_;
result["peerReceiveTimeout"] = this.peerReceiveTimeout_;
result["gslbReloadInterval"] = this.gslb_.gslbReloadInterval_ * 1000;
result["gslbLoadTime"] = this.gslb_.gslbLoadTime_;
result["gslbReloadTimes"] = this.gslb_.gslbReloadTimes_;
result["gslbConsumedTime"] = this.gslb_.gslbConsumedTime_;
result["gslbTotalUseTime"] = this.gslb_.gslbTotalUseTime_;
result["checksumLoadTime"] = this.checksumLoadTime_;
result["metaLoadTime"] = this.meta_.metaLoadTime_;
result["metaReloadTimes"] = this.meta_.metaReloadTimes_;
result["selfRanges"] = this.selfRanges_;
if (needGslbData) {
result["gslbData"] = this.context_.gslbData_;
}

if (simpleMode) {
return;
}
var contextStatus = result["context"] = {};
this.context_.getAllStatus_(contextStatus);

var statDataStatus = result["statData"] = {};
this.statData_.getAllStatus_(statDataStatus);

var metaDataStatus = result["metaData"] = {};
this.metaData_.getAllStatus_(segmentStartWithPlayer ? this.urgentSegmentId_ : -1, maxDuration, params, metaDataStatus);
if(this.static_){
var reportTrafficStatus = result["reportTraffic"] = {};
this.static_.reportTraffic_.getAllStatus_(reportTrafficStatus);
}

var resultStablePeers = result["stablePeers"] = [];
for ( var n = 0; n < this.stablePeers_.length; n++) {
var peer = this.stablePeers_[n];
var stablePeersStatus = resultStablePeers[n] = {};
peer.getAllStatus_(stablePeersStatus);
}

var resultOtherPeers = result["otherPeers"] = [];
for ( var n = 0; n < this.otherPeers_.length; n++) {
var peer = this.otherPeers_[n];
var otherPeersStatus = resultOtherPeers[n] = {};
peer.getAllStatus_(otherPeersStatus);
}
}
});
/**
* Created by chenzhaofei on 2017/5/19.
*/
p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Gslb = JClass.extend_({
tag_:"com::webp2p::logic::base::Gslb",
gslbTryTimes_ : 0,
gslbServerResponseCode_ : 0,
gslbServerErrorCode_ : 0,
gslbServerErrorDetails_ : "",
gslbReloadInterval_ : 0,
gslbLoadTime_ : 0,
gslbConsumedTime_ : 0,
gslbTotalUseTime_:0,
gslbReloadTimes_ : 0,
gslbCompleteReported_ : false,
openTime_:0,
downloader_:null,
gslbRequestUrl_:null,
location_:null,
nodelist_:null,
url_:null,
config_:null,
global_:null,
timer_:null,
wrapper_:null,
data_:null,
createTime_:0,
activeTime_:0,
sn_:0,

//调度请求

init:function(wrapper,url)
{
this.wrapper_=wrapper;
this.config_ = p2p$.com.selector.Config;
this.global_ = p2p$.com.common.Global;
this.gslbTryTimes_ = 0;
this.gslbServerResponseCode_ = 0;
this.gslbServerErrorCode_ = -1;
this.gslbCompleteReported_ = false;
this.gslbReloadTimes_ = 0;
this.gslbReloadInterval_ = 0;
this.gslbConsumedTime_ = 0;
this.sn_ = -1;
this.createTime_ = this.activeTime_ = this.global_.getMilliTime_();
this.url_=url;
this.addTionalParams_();
},
start_:function()
{
if(this.url_ == null){
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}:start url is null",this.tag_));
return;
}
this.stop_();
if(this.openTime_==0){
this.openTime_ = this.global_.getMilliTime_();
}
this.sn_++;
var timeoutMs = 5000 + (this.gslbTryTimes_ * 3000); // 5 seconds
var type_="json";
if(this.config_.jsonp==1){
type_="jsonp";
timeoutMs = 1000;
}
this.setTimeout_(timeoutMs);
this.gslbRequestUrl_ = this.url_.toString();
this.downloader_ = new p2p$.com.loaders.HttpDownLoader({url_:this.gslbRequestUrl_, scope_:this,type_:type_, tag_:"base::gslb"});
this.downloader_.load_();
},
addTionalParams_:function()
{
this.url_.params_.set("appid", 800);
this.url_.params_.set("format", "1");
this.url_.params_.set("expect", "3");
this.url_.params_.set("ajax", "1");

var tss = this.url_.params_.get("tss");
var m3v = this.url_.params_.get("m3v");
if (tss != "ios") {
tss = "tvts";
}
if (!m3v || m3v == "0") {
m3v = "1";
}
// m3v = "0";
this.url_.params_.set("tss", tss);
this.url_.params_.set("m3v", m3v);
},
stop_:function()
{
if(this.downloader_ != null)
{
this.downloader_.close();
this.downloader_ = null;
}
},
onHttpDownloadCompleted_:function(downloader){
this.stop_();
this.gslbConsumedTime_ = downloader.totalUsedTime_;
this.activeTime_ = this.global_.getMilliTime_();
this.gslbTotalUseTime_ = this.activeTime_-this.openTime_;
this.gslbServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
// waiting for timeout and retry ...
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadComplete_ success_({1}),responseCode({2})",this.tag_,downloader.successed_,downloader.responseCode_));
this.stopTimer_();
this.onTimeout_();
return;
}

if (!this.parseResponse_(downloader, "")) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onHttpDownloadComplete_ parseGslbResponse_->false",this.tag_));
if (52001 == this.gslbServerErrorCode_) {
// json parse failed, waiting timeout and retry
this.stopTimer_();
this.onTimeout_();
return;
}
// stop timer
this.stopTimer_();
this.wrapper_.onMetaComplete_(20501, "GSLB Response Failed " + this.gslbServerErrorCode_);
return;
}

// stop timer
this.stopTimer_();
if (!this.gslbCompleteReported_) {
this.gslbCompleteReported_ = true;
this.wrapper_.sendStatus_({type:"ACTION.SCHEDULE.COMPLETED",code:p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, host:downloader.remoteEndpoint_, ut:this.activeTime_ - this.createTime_});
if (this.wrapper_.onGslbComplete_) {
this.wrapper_.onGslbComplete_();
}
}
},
parseResponse_ : function(downloader, data) {
var gslbData = downloader.responseData_;
if (gslbData == "" || gslbData == null) {
if (this.gslbServerErrorCode_ <= 0) {
gslbServerErrorCode_ = 52001;
}
return false;
}
// parse responseData
gslbData["ercode"] = 0;
gslbData["errinfo"] = "Direct Meta";

this.gslbServerErrorCode_ = gslbData.ercode;
this.gslbServerErrorDetails_ = gslbData.errinfo || "";
this.gslbLoadTime_ = this.global_.getMilliTime_();
this.gslbReloadInterval_ = gslbData.forcegslb * 1000;
// url timeout or linkshell timeout
if (this.gslbServerErrorCode_ == 424 || this.gslbServerErrorCode_ == 428) {
// sync time with server again
// this.manager_.getAuthorization().update();
}

this.wrapper_.context_.loadData_(gslbData);
// test for cdn meta timeout
this.wrapper_.manager_.getEnviroment_().attachContext_(this.wrapper_.context_);

this.wrapper_.context_.detectSpecialPlayerTimeOffset_();
this.wrapper_.metaData_.directMetaMode_ = false;

this.wrapper_.metaData_.sourceUrl_ = this.wrapper_.context_.gslbData_["location"];
var allMetaNodes = this.wrapper_.context_.gslbData_["nodelist"];
if ("" == this.wrapper_.metaData_.sourceUrl_ && allMetaNodes.length > 0) {
this.metaData_.sourceUrl_ = allMetaNodes[0]["location"];
}
if ("" == this.wrapper_.metaData_.sourceUrl_) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} Gslb response failed, no g3 meta url location, url({1}))",this.tag_,downloader.url_));
if (this.gslbServerErrorCode_ <= 0) {
this.gslbServerErrorCode_ = 52002;
}
return false;
}

return true;
},
setTimeout_ : function(timeoutMs) {
var me = this;
this.timer_ = setTimeout(function() {
me.onTimeout_();
}, timeoutMs);
},
stopTimer_:function()
{
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
},
onTimeout_ : function() {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onGslbTimeout_",this.tag_));
this.stop_();
this.gslbTryTimes_++;
if (this.gslbTryTimes_ <= 2) {
this.start_();
} else {
this.wrapper_.onMetaComplete_(20500, "GSLB Request Failed", "");
}
},
updateBackupIp_ : function() {
var predefinedStrings = this.wrapper_.manager_.getEnviroment_().getBackupHostIps_();
if (!predefinedStrings) {
return;
}
// standard domain
var predefineIps = null;
predefineIps = predefinedStrings.split(",");
if (!predefineIps) {
return;
}
var seed = Math.floor(Math.random() * (100 + 1));
var randIdx = seed % predefineIps.length;
if (randIdx < 0 || randIdx >= predefineIps.length) {
randIdx = 0;
}
var retryIndex = this.gslbTryTimes_ % 4;
switch (retryIndex) {
case 1:
case 2:
this.gslbBackupIp_ = predefineIps[randIdx];
break;
default:
// try default domain at the last time
this.gslbBackupIp_ = "";
break;
}
},
});

p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Manager = JClass.extend_({
channels_ : null,
defaultMultiMode_ : false,
channelCapacity_ : 0,
downloadCapacity_ : 0,
downloadParallelCount_ : 0,
enviroment_ : null,
tag_:"com::webp2p::logic::base::Manager",

init : function(enviroment) {
this.channels_ = new p2p$.com.common.Map();
this.enviroment_ = enviroment;
this.defaultMultiMode_ = false;
this.channelCapacity_ = 3;
this.downloadCapacity_ = 1000;
this.downloadParallelCount_ = 1;
},

getEnviroment_ : function() {
return this.enviroment_;
},

openChannel_ : function(channelUrl, params, scope) {
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::openChannel_",this.tag_));
var groupType = params.find("pip") ? params.get("pip") : 0;
var streamMode = params.find("stream") ? params.get("stream") : 0;
if (params.find("group")) {
groupType = params.get("group");
}
var urlTagTime = params.find("tagtime") ? (params.get("tagtime") * 1000 * 1000) : 0;
var channel = null;

if (this.channels_.has(channelUrl)) {
channel = this.channels_.get(channelUrl);
channel.updateActiveTime_(false);
return channel;
}

var programUrl = new p2p$.com.common.Url();
programUrl.fromString_(channelUrl);
var tagName = (programUrl.params_.find("tag")) ? programUrl.params_.get("tag") : "";
var streamId = (programUrl.params_.find("stream_id")) ? programUrl.params_.get("stream_id") : "";
var isLiveStream = (streamMode > 0) || streamId != "";

if (isLiveStream) {
channel = new p2p$.com.webp2p.logic.live.Channel(channelUrl, programUrl, this);
} else {
channel = new p2p$.com.webp2p.logic.vod.Channel(channelUrl, programUrl, this);
}
channel.setGroupType(groupType);
channel.setReopenMode(false);
channel.loadParams_(params, this.enviroment_.customContextParams_);
channel.updateActiveTime_(false);
channel.setUrlTagTime_(urlTagTime);
this.channels_.set(channelUrl, channel);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Open new {1} channel url({2}) OK",this.tag_,tagName || "vod", channelUrl));
return channel;
},

closeChannel_ : function(channelUrl) {
for ( var n = 0; n < this.channels_.length; n++) {
var mapItem = this.channels_.element(n);
if (mapItem.key == channelUrl) {
var item = mapItem.value;
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Close channel id({1}), type({2}), url({3}), total {4} channel(s) now",this.tag_,item.getId_(), item.getTypeName_(), item.getChannelUrl_(), this.channels_.size() - 1));
item.close();
this.channels_.erase(this.channels_.element(n).key);
item=null;
return true;
}
}
},

checkTimeout_ : function() {
var isMobileNow = this.enviroment_.isMobileNetwork_();
var nowTime = p2p$.com.common.Global.getMilliTime_();
for ( var n = 0; n < this.channels_.length; n++) {
var item = this.channels_.element(n).value;
if (!item.isOpened_() || !item.p2pIsReady_()) {
continue;
}
var needDeactivate = (item.getActiveTime_() + item.getMaxSilentTime_() < nowTime) || isMobileNow || item.isPaused_();
if (needDeactivate && item.p2pisActive_()) {
item.p2pDeactive_();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Deactive slient channel, mobile network({1}), id({2}), type({3}), url({4})",this.tag_,isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
} else if (!needDeactivate && !item.p2pisActive_()) {
item.p2pActivate_();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Activate slient channel, mobile network({1}), id({2}), type({3}), url({4})",this.tag_,isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
}
}
},

getChannelById_ : function(id) {
var channel = null;
for ( var n = 0; n < this.channels_.length; n++) {
var item = this.channels_.element(n).value;
if (item.getId_() == id) {
channel = item;
break;
}
}
return channel;
},
getAllStatus_ : function(params, result) {
var jsonManager = result["manager"] = {};
jsonManager["defaultMultiMode"] = this.defaultMultiMode_;
jsonManager["channelCapacity"] = this.channelCapacity_;
jsonManager["downloadCapacity"] = this.downloadCapacity_;
jsonManager["downloadParallelCount"] = this.downloadParallelCount_;
// jsonManager["authSynced"] = authorization_.synced();
// jsonManager["authSyncedSuccess"] = authorization_.syncedSuccess();
// jsonManager["authServerTimeNow"] = authorization_.serverTimeNow();
// jsonManager["authRemoteServerTime"] = authorization_.remoteServerTime();
// jsonManager["authAbsoluteCdeTime"] = authorization_.absoluteCdeTime();
// jsonManager["authLocalCdeTime"] = authorization_.localCdeTime();
// jsonManager["authTimeDiff"] = authorization_.timeDiff();
// jsonManager["playedHistoryCount"] = playedHistoryKeys_.size();

var jsonChannels = result["channels"] = [];

for ( var n = 0; n < this.channels_.length; n++) {
var channel = this.channels_.element(n).value;
var channelTemp = jsonChannels[n] = {};
channel.getAllStatus_(params, channelTemp);
}
// for( logic::base::ChannelPtrList::const_iterator itr = downloads_.begin(); itr != downloads_.end(); itr ++ )
// {
// const logic::base::ChannelPtr &channel = (*itr);
// channel->getAllStatus_(params, jsonChannels[jsonChannels.size()]);
// }
}
});
p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Meta = JClass.extend_({
tag_: "com::webp2p::logic::base::Meta",
activeTime_:0,
scope_:null,
channelType_:"vod",
metaLoadTime_ : 0,
metaUseTime_ : 0,
metaReloadTimes_ : 0,
metaResponsed_ : false,
metaServerResponseCode_ : 0,
metaCompleteReported_ : false,

liveMetaRefreshInterval_ : 0,//直播刷新时间
liveMaxSegmentStartTime_ : 0,
livePlayOffset_ : 0,
livePlayMaxTimeLength_ : 0,
liveMetaTryTimeoutTimes_ : 0,
liveTimeShift_ : 0,
livePlayerShift_ : 0,
liveCurrentTime_ : 0,
liveStartTime_ : 0,
liveAbTimeShift_ : 0,
liveNowPlayOffset_ : 0,
liveMetaLoadTime_ : 0,
liveMetaUpdateTime_ : 0,
updateLiveTimer_:null,
lastProgramChangeTime_ : 0,

timer_:null,
nodelist_:null,
sourceMetaUrl_:"",
updateMetaUrl_ : "",
config_:null,
global_:null,
strings_:null,
loaders_:[],
init:function(scope,type)
{
this.config_ = p2p$.com.selector.Config;
this.global_ = p2p$.com.common.Global;
this.strings_ = p2p$.com.common.String;
this.scope_=scope;
this.channelType_ = type;
this.liveMetaRefreshInterval_ = 5000; // ms
this.lastProgramChangeTime_ = 0;
this.livePlayOffset_ = 120; // seconds
this.livePlayMaxTimeLength_ = 200; // 200 seconds
this.liveMetaTryTimeoutTimes_ = 0;
this.liveTimeShift_ = -1;
this.livePlayerShift_ = 0;
this.liveCurrentTime_ = 0;
this.liveStartTime_ = 0;
this.liveAbTimeShift_ = 0;
this.liveNowPlayOffset_ = 0;
this.liveMetaLoadTime_ = 0;
this.liveMetaUpdateTime_ = 0;
this.liveMaxSegmentStartTime_ = 0;
this.updateLiveTimer_ = null;
this.sourceMetaUrl_="";
},
load_:function(nodelist)
{
if(nodelist != null){
this.nodelist_ = nodelist;
}
var gslbEncryptUrl_;
switch(this.channelType_){
case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive:
this.setUpdateLiveMetaTimeout_(p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate, this.liveMetaRefreshInterval_);
gslbEncryptUrl_ = this.getNowRequestMetaUrl_();
this.openLoader_({url_:gslbEncryptUrl_, scope_:this, tag_:"live::meta_"});
case p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod:
if(this.metaLoadTime_<=0){
this.metaLoadTime_ = this.global_.getMilliTime_();
}
for(var i=0;i<this.nodelist_.length&&i<this.config_.maxMetaNum;i++)
{
gslbEncryptUrl_ = this.nodelist_[i]["location"];
this.openLoader_({url_:gslbEncryptUrl_, scope_:this, tag_:"base::meta_"+i});
}
var timeoutMs = 10 * 1000;
this.setTimeout_(timeoutMs);
}
},
setLiveParams_:function()
{
var gslbData = this.scope_.context_.gslbData_;
var nowTime = this.global_.getMilliTime_();
this.liveMaxSegmentStartTime_ = 0;
this.liveTimeShift_ = gslbData["livesftime"];
if (this.liveTimeShift_ >= 0) {
// use gslb configure, max 180 seconds (livePlayMaxTimeLength_ - 20)
this.livePlayOffset_ = this.liveTimeShift_ > (this.livePlayMaxTimeLength_ - 20) ? (this.livePlayMaxTimeLength_ - 20) : this.liveTimeShift_;
}
this.livePlayMaxTimeLength_ = (this.livePlayOffset_ > 30 ? this.livePlayOffset_ : 30) + 60;
this.liveCurrentTime_ = gslbData["curtime"];
this.liveStartTime_ = gslbData["starttime"];
this.liveNowPlayOffset_ = this.livePlayOffset_;
if (this.livePlayerShift_ != 0) {
this.liveCurrentTime_ += (this.livePlayerShift_ + this.livePlayOffset_);
}
this.liveCurrentTime_ += 10;
this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveNowPlayOffset_ - 10;
this.liveMetaLoadTime_ = nowTime;
this.liveMetaUpdateTime_ = nowTime;
this.activeTime_ = this.global_.getMilliTime_();
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Detect channel({1}), time shift({2} sec), gslb reload({3} sec), current time({4}), start time({5})",this.tag_,this.id_,this.liveTimeShift_, this.gslbReloadInterval_ / 1000, p2p$.com.common.String.formatTime_(this.liveCurrentTime_),p2p$.com.common.String.formatTime_(this.liveStartTime_)));
},

openLoader_:function(params)
{
var downloader = new p2p$.com.loaders.HttpDownLoader(params);
downloader.load_();
this.loaders_.push(downloader);
},
onHttpDownloadCompleted_:function(downloader)
{
if(downloader.tag_ == "live::meta_"){
this.onLiveMetaComplete_(downloader);
return;
}
var tag_= downloader.tag_.split("_")[1];
if (downloader.successed_) {//加载成功,关闭其他m3u8的加载
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} close other loaders",this.tag_));
//通知meta加载完毕
this.onMetaCompleted_(downloader);
var loader_,index_=-1;
for(var i=0;i<this.loaders_.length;i++) {
loader_ = this.loaders_[i];
index_ = loader_.tag_.split("_")[1];
if (tag_ != index_) {
loader_.close();
}
}
}
},
onLiveMetaComplete_:function(downloader)
{
this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
this.scope_.context_.metaServerIp_ = downloader.remoteEndpoint_;
if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
// failed
this.scope_.onSchedule_(false);
this.switchNextMetaSource_();
return;
}
if (!this.parseUpdateMetaResponse_(downloader)) {
this.switchNextMetaSource_();
return;
}
this.metaReloadTimes_++;
this.activeTime_ = this.global_.getMilliTime_();
this.metaUseTime_ = this.activeTime_-this.metaLoadTime_;
},
onMetaCompleted_:function(downloader)
{
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onMetaComplete_",this.tag_));
var handled = true;
this.activeTime_ = this.global_.getMilliTime_();
this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
// stop timer
this.stopTimer_();
this.scope_.metaData_.finalUrl_ = downloader.url_;
this.scope_.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
if (!this.parseMetaResponse_(downloader)) {
this.scope_.onMetaComplete_(20601, "Meta Response Failed", "");
return;
}
this.metaReloadTimes_++;
this.metaUseTime_ = this.activeTime_-this.metaLoadTime_;
this.scope_.context_.videoFormat_ = this.scope_.metaData_.p2pGroupId_ == "" ? "m3u8" : "lm3u8";
if (this.scope_.metaData_.p2pGroupId_ == "") {
// standard hls redirect
this.onMetaCompleteCode_ = 302;
this.scope_.onMetaComplete_(302, "Moved", this.scope_.metaData_.sourceUrl_);
return;
}
if (!this.metaCompleteReported_) {
this.metaCompleteReported_ = true;
}
this.scope_.onMetaComplete_(200, "OK", this.scope_.metaData_.getLocalMetaContent_());
},
parseMetaResponse_ : function(downloader) {
var metaTypeName = p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.scope_.type_);
if (!this.scope_.metaData_.load(downloader.responseData_, downloader.totalUsedTime_, true)) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} [{1}]Parse hls meta response failed, url({2}), channel({3}), size({4})",this.tag_,metaTypeName,downloader.url_,this.id_,downloader.responseData_.length));
return false;
}
return true;
},
parseUpdateMetaResponse_ : function(downloader) {
var metaChanged = false;
var p2pGroupIdChanged = false;
var nowTime = this.global_.getMilliTime_();
var updateMeta = new p2p$.com.webp2p.core.supernode.MetaData();
updateMeta.type_ = this.scope_.metaData_.type_;
updateMeta.rangeParamsSupported_ = this.scope_.metaData_.rangeParamsSupported_;
updateMeta.verifyMethod_ = this.scope_.metaData_.verifyMethod_;
updateMeta.sourceUrl_ = downloader.url_;
updateMeta.finalUrl_ = downloader.url_;
updateMeta.channelUrl_ = this.scope_.metaData_.channelUrl_;
updateMeta.storageId_ = this.scope_.metaData_.storageId_;
if (!updateMeta.load(downloader.responseData_, downloader.totalUsedTime_)) {
P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::parseUpdateMetaResponse_ Parse meta response failed, url({1}), channel({2}), size({3})"),this.tag_,downloader.url_,this.id_,this.downloader_.responseData_.length);
this.metaServerResponseCode_ = 701; // content error
this.scope_.onSchedule_(false);
return false;
}

if (updateMeta.p2pGroupId_ != this.scope_.metaData_.p2pGroupId_) {//gid发生变化
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::parseUpdateMetaResponse_ Meta group id change from({1}) to({2}), reopen p2p protocols...",this.tag_,this.scope_.metaData_.p2pGroupId_,updateMeta.p2pGroupId_));
if (this.lastProgramChangeTime_ <= 0) {
this.lastProgramChangeTime_ = this.global_.getMilliTime_();
var retval = {
newSegmentCount_ : 0,
newSegments_ : []
};
retval = this.scope_.metaData_.combineSameGroup_(updateMeta);
if (retval.newSegmentCount_ > 0) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add2 ({1}) new meta segment({2}) to channel({3}), total {4} segment(s) now",this.tag_,retval.newSegmentCount_, retval.newSegments_.join(','), this.scope_.id_, this.scope_.metaData_.segments_.length));
}
}
if (this.lastProgramChangeTime_ + (120 * 1000) > nowTime) {
// check if all segments are completed
var allSegmentsCompleted = true;
for ( var k = 0; k < this.scope_.metaData_.segments_.length; k++) {
var segment = this.scope_.metaData_.segments_[k];
if (segment.id_ < this.scope_.urgentSegmentId_) {
continue;
}
if (segment.completedTime_ <= 0) {
allSegmentsCompleted = false;
break;
}
}
if (!allSegmentsCompleted) {
// wait for next time
this.scope_.onSchedule_(false);
return true;
}
}
metaChanged = true;
p2pGroupIdChanged = true;
this.scope_.metaData_.p2pGroupId_ = updateMeta.p2pGroupId_;
this.scope_.metaData_.markAllSegmentP2pDisabled_();
var retval = {
newSegmentCount_ : 0,
newSegments_ : []
};
retval = this.scope_.metaData_.combineWith_(updateMeta, false, true);
if (retval.newSegmentCount_ <= 0) {
// rebuild segment and piece indexes while all p2p segments disabled
this.scope_.metaData_.buildIndexes_();
}
if (retval.newSegmentCount_ > 0) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add3 ({1}) new meta segment({2}) to channel({3}), total {4} segment(s) now",this.tag_,retval.newSegmentCount_, retval.newSegments_.join(','), this.scope_.id_, this.scope_.metaData_.segments_.length));
}
// update self range cache
this.scope_.fillSelfPieceRanges_(this.scope_.selfRangesMessage_);

} else {
// {newSegmentCount_:newSegmentCount,newSegments_:newSegments};
var retval = this.scope_.metaData_.combineWith_(updateMeta, false, false);
if (retval.newSegmentCount_ > 0) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add4 ({1}) new meta segment({2}) to channel({3}), total {4} segment(s) now",this.tag_,retval.newSegmentCount_, retval.newSegments_.join(','), this.scope_.id_, this.scope_.metaData_.segments_.length));
metaChanged = true;
}
}

this.scope_.metaData_.updateTime_ = nowTime;
if (metaChanged) {
this.scope_.removeExpiredSegments_();
this.scope_.updateMetaPieceShareInRanges_(true);
this.scope_.metaResponseBody_ = this.scope_.metaData_.localMetaContent_;
}

this.lastProgramChangeTime_ = 0;
this.liveMaxSegmentStartTime_ = 0;
for ( var k = 0; k < this.scope_.metaData_.segments_.length; k++) {
var segment = this.scope_.metaData_.segments_[k];
this.liveMaxSegmentStartTime_ = this.liveMaxSegmentStartTime_ > segment.startTime_ ? this.liveMaxSegmentStartTime_ : segment.startTime_;
}
this.scope_.onSchedule_(false);
return true;
},
switchNextMetaSource_ : function() {
this.liveMetaTryTimeoutTimes_++;
var bak = this.sourceMetaUrl_;
var allMetaNodes = this.nodelist_;
for ( var n = 0; n < allMetaNodes.length; n++) {
var metaItem = allMetaNodes[(n + this.liveMetaTryTimeoutTimes_) % allMetaNodes.length];
var locationUrl = metaItem["location"];
if (!(locationUrl == "") && locationUrl != this.scope_.metaData_.sourceUrl_) {
this.sourceMetaUrl_ = locationUrl;
break;
}
}

var url = new p2p$.com.common.Url();
url.fromString_(this.sourceMetaUrl_);
this.scope_.context_.metaServerIp_ = this.strings_.format("{0}:{1}", url.host_, (url.port_) == 0 ? 80 : url.port_);
P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::switchNextMetaSource_ [{1}]Meta timeout/error for url({2}), channel({3}), {4} try times, switch next source({4})...",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bak, this.scope_.id_, this.liveMetaTryTimeoutTimes_, this.sourceMetaUrl_));
},
updateMeta_ : function() {
var nowTime = this.global_.getMilliTime_();
if (this.liveNowPlayOffset_ > 0) {
if (this.liveNowPlayOffset_ > this.liveTimeShift_) {
this.liveNowPlayOffset_ -= this.liveTimeShift_;
} else {
this.liveNowPlayOffset_ = 0;
}
}
this.liveAbTimeShift_ = this.liveMaxSegmentStartTime_ / 1000;
if (this.liveAbTimeShift_ <= 0) {
this.liveAbTimeShift_ = this.liveCurrentTime_ - this.liveTimeShift_;
}
this.liveMetaUpdateTime_ = nowTime;
this.load_();
},
setTimeout_:function(timeoutMs)
{
var me = this;
this.timer_ = setTimeout(function() {
me.onMetaTimeout_();
}, timeoutMs);
},
onMetaTimeout_:function()
{
this.close_();
this.scope_.onMetaComplete_(20600, "Meta Request Failed", "");
},
stopTimer_:function()
{
if (this.timer_) {
clearTimeout(this.timer_);
this.timer_ = null;
}
},
setUpdateLiveMetaTimeout_ : function(tag, timeoutMs) {
var me = this;
this.updateLiveTimer_ = setTimeout(function() {
me.onUpdateLiveMetaTimeout_(tag);
}, timeoutMs);
},

stopUpdateLiveMetaTimer_ : function() {
if (this.updateLiveTimer_) {
clearTimeout(this.updateLiveTimer_);
this.updateLiveTimer_ = null;
}
},
onUpdateLiveMetaTimeout_ : function(tag) {
switch (tag) {
case p2p$.com.webp2p.logic.live.ChannelStatic.kTimerTagMetaUpdate:
this.close_();
this.switchNextMetaSource_();
this.updateMeta_();
break;
default:
break;
}
},
getNowRequestMetaUrl_ : function() {
var url = this.sourceMetaUrl_ == "" ? this.scope_.metaData_.sourceUrl_ : this.sourceMetaUrl_;
var time = this.global_.getMilliTime_();
url += (url.indexOf('?') < 0) ? "?" : "&";
if (this.livePlayerShift_ == 0) {
// auto delay
url += p2p$.com.common.String.format("abtimeshift={0}&cdernd={1}", this.liveAbTimeShift_, time);
} else if (url.indexOf("&timeshift=") < 0 && url.indexOf("?timeshift=") < 0) {
// shift time not found, repair it
url += p2p$.com.common.String.format("timeshift={0}&cdernd={1}", this.livePlayerShift_, time);
} else {
url += p2p$.com.common.String.format("cdernd={0}", time);
}

return url;
},
close_:function()
{
for(var i=0;i<this.loaders_.length;i++)
{
loader_ = this.loaders_[i];
loader_.close();
}
this.loaders_=[];
this.stopUpdateLiveMetaTimer_();
this.stopTimer_();
}
});
p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.PeerStatic = {
nextSessionId_ : 0,
};
p2p$.com.webp2p.logic.base.Peer = JClass.extend_({

session_ : null,
tnPieceMark_ : null,
pnPieceMark_ : null,
tnPieceInvalid_ : null,
pnPieceInvalid_ : null,

activeTime_ : 0,
lastTimeoutTime_ : 0,
totalSendBytes_ : 0,
totalSendPieces_ : 0,
totalReceiveBytes_ : 0,
totalReceivePieces_ : 0,
totalSendSpeed_ : 0,
totalReceiveSpeed_ : 0,
totalChecksumErrors_ : 0,
totalInvalidErrors_ : 0,
lastSendTime_ : 0,
lastReceiveTime_ : 0,
lastSendSpeed_ : 0,
lastReceiveSpeed_ : 0,

totalSendRanges_ : 0,
totalSendRequests_ : 0,
totalSendResponses_ : 0,
totalReceiveRanges_ : 0,
totalReceiveRequests_ : 0,
totalReceiveResponses_ : 0,
lastSendStartBytes_ : 0,
lastReceiveStartBytes_ : 0,
lastReceiveStartTime_ : 0,
lastRangeExchangeTime_ : 0,

sessionId_ : 0,
lastSegmentId_ : 0,
maxQuotaPieces_ : 0,
timeoutTimes_ : 0,
praisedTimes_ : 0,
pendingRequestCount_ : 0,
scheduleLocked_ : false,
receivePiece_ : null,
streamMark_ : 0,
streamAvaiable_ : false,
streamDetected_ : false,
streamUploading_ : false,
selfRanges_ : "",

init : function() {
this.sessionId_ = ++p2p$.com.webp2p.logic.base.PeerStatic.nextSessionId_;
if (this.sessionId_ <= 0) {
this.sessionId_ = p2p$.com.webp2p.logic.base.PeerStatic.nextSessionId_ = 1;
}
this.receivePiece_ = new p2p$.com.webp2p.core.supernode.MetaPiece();
this.activeTime_ = 0;
this.lastTimeoutTime_ = 0;
this.totalSendBytes_ = 0;
this.totalSendPieces_ = 0;
this.totalReceiveBytes_ = 0;
this.totalReceivePieces_ = 0;
this.totalSendSpeed_ = 0;
this.totalReceiveSpeed_ = 0;
this.totalChecksumErrors_ = 0;
this.totalInvalidErrors_ = 0;
this.lastSendTime_ = 0;
this.lastReceiveTime_ = 0;
this.lastSendSpeed_ = 0;// used by peer upload schedule
this.lastReceiveSpeed_ = -1;
this.lastSegmentId_ = -1;
this.maxQuotaPieces_ = 2;
this.timeoutTimes_ = 0;
this.praisedTimes_ = 0;
this.pendingRequestCount_ = 0;

this.totalSendRanges_ = 0;
this.totalSendRequests_ = 0;
this.totalSendResponses_ = 0;
this.totalReceiveRanges_ = 0;
this.totalReceiveRequests_ = 0;
this.totalReceiveResponses_ = 0;

this.lastSendStartBytes_ = 0;
this.lastReceiveStartBytes_ = 0;
this.lastReceiveStartTime_ = 0;
this.lastRangeExchangeTime_ = 0;
this.scheduleLocked_ = false;

this.streamMark_ = -1;
this.streamDetected_ = false;
this.streamAvaiable_ = false;
this.streamUploading_ = false;
this.tnPieceMark_ = new p2p$.com.webp2p.core.supernode.Bitmap();
this.pnPieceMark_ = new p2p$.com.webp2p.core.supernode.Bitmap();
this.tnPieceInvalid_ = new p2p$.com.webp2p.core.supernode.Bitmap();
this.pnPieceInvalid_ = new p2p$.com.webp2p.core.supernode.Bitmap();
this.selfRanges_ = "";
},

hasPiece_ : function(type, id) {
var bitmap = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceMark_ : this.pnPieceMark_;
var invalid = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceInvalid_ : this.pnPieceInvalid_;

if (invalid.getValue(id)) {
// already invalid
return false;
}
return bitmap.getValue(id);
},

setPieceMark_ : function(type, id, on) {
var mark = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceMark_ : this.pnPieceMark_;
mark.setValue(id, on);
},

setPieceInvalid_ : function(type, id, on) {
var invalid = (type == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? this.tnPieceInvalid_ : this.pnPieceInvalid_;
invalid.setValue(id, on);
},

updateSpeed_ : function(nowTime) {
var speed = this.session_.getUpdateReceiveSpeed_(nowTime, this.pendingRequestCount_ > 0);
if (speed >= 0) {
this.lastReceiveSpeed_ = speed;
}
},

statSendMessage_ : function(message) {
this.totalSendRanges_ += (message.ranges_.length == 0 ? 0 : 1);
this.totalSendRequests_ += message.requests_.length;
this.totalSendResponses_ += message.responses_.length;
},

statSendData_ : function(pieces, bytes) {
this.lastSendStartBytes_ = this.totalSendBytes_;
this.totalSendBytes_ += bytes;
this.totalSendPieces_ += pieces;
this.lastSendTime_ = p2p$.com.common.Global.getMilliTime_();
},
statReceiveBegin_ : function() {
this.lastReceiveStartBytes_ = this.totalReceiveBytes_;
this.lastReceiveStartTime_ = p2p$.com.common.Global.getMilliTime_();
},

statReceiveEnd_ : function() {
this.lastReceiveStartTime_ = 0;
},

statReceiveMessage_ : function(message) {
this.totalReceiveRanges_ += message.ranges_.length;
this.totalReceiveRequests_ += message.requests_.length;
this.totalReceiveResponses_ += message.responses_.length;
},

statReceiveData_ : function(pieces, bytes) {
this.totalReceivePieces_ += pieces;
this.statReceiveData2_(bytes);
},

statReceiveData2_ : function(bytes) {
var nowTime = p2p$.com.common.Global.getMilliTime_();

this.totalReceiveBytes_ += bytes;
this.lastReceiveTime_ = nowTime;
if (this.lastReceiveStartTime_ > 0 && nowTime > this.lastReceiveStartTime_) {
var sizeDiff = this.totalReceiveBytes_ - this.lastReceiveStartBytes_;
this.lastReceiveSpeed_ = sizeDiff * 1000 / (nowTime - this.lastReceiveStartTime_);
}
},
getAllStatus_ : function(result) {
result["name"] = this.session_.getName_();
result["type"] = this.session_.getManager_().getTypeName_();
result["remoteId"] = this.session_.getRemoteId_();
result["remoteAddress"] = this.session_.getRemoteAddress_();
result["remoteType"] = this.session_.getRemoteType_();
result["lastReceiveSpeed"] = this.lastReceiveSpeed_;
result["lastReceiveTime"] = this.lastReceiveTime_;
result["lastSendTime"] = this.lastSendTime_;
result["pendingRequestCount"] = this.pendingRequestCount_;
result["totalReceiveBytes"] = this.totalReceiveBytes_;
result["totalReceivePieces"] = this.totalReceivePieces_;
result["totalSendBytes"] = this.totalSendBytes_;
result["totalSendPieces"] = this.totalSendPieces_;
result["totalChecksumErrors"] = this.totalChecksumErrors_;
result["totalInvalidErrors"] = this.totalInvalidErrors_;
result["totalSendRanges"] = this.totalSendRanges_;
result["totalSendRequests"] = this.totalSendRequests_;
result["totalSendResponses"] = this.totalSendResponses_;
result["totalReceiveRanges"] = this.totalReceiveRanges_;
result["totalReceiveRequests"] = this.totalReceiveRequests_;
result["totalReceiveResponses"] = this.totalReceiveResponses_;
result["selfRanges"] = this.selfRanges_;
}
});
p2p$.ns('com.webp2p.logic.base');

p2p$.com.webp2p.logic.base.StatData = JClass.extend_({
totalSendPieces_ : 0,
totalSendBytes_ : 0,
totalReceivePieces_ : 0,
totalReceiveBytes_ : 0,
actualSendPieces_ : 0,
actualSendBytes_ : 0,
actualReceivePieces_ : 0,
actualReceiveBytes_ : 0,
urgentReceiveBytes_ : 0,
lastReceiveBytes_ : 0,

firstSendTime_ : 0,
firstReceiveTime_ : 0,
urgentReceiveBeginTime_ : 0,
lastReceiveBeginTime_ : 0,

avgSendSpeed_ : 0,
avgReceiveSpeed_ : 0,
urgentReceiveSpeed_ : 0,
lastReceiveSpeed_ : 0,
restrictedSendSpeed_ : 0,

protocolSendPieces_ : null,
protocolSendBytes_ : null,
protocolSendSpeeds_ : null,
protocolReceivePieces_ : null,
protocolReceiveBytes_ : null,
protocolReceiveSpeeds_ : null,

shareSendRatio_ : 0,
shareReceiveRatio_ : 0,
firstPieceFetchTime_ : 0,

totalReceiveDuration_ : 0,
downloadedDuration_ : 0,
totalPlayedBytes_ : 0,
totalPlayedPieces_ : 0,
totalPlayedDuration_ : 0,

init : function() {
this.totalSendPieces_ = 0;
this.totalSendBytes_ = 0;
this.actualSendPieces_ = 0;
this.actualSendBytes_ = 0;
this.totalReceivePieces_ = 0;
this.totalReceiveBytes_ = 0;
this.actualReceivePieces_ = 0;
this.actualReceiveBytes_ = 0;
this.urgentReceiveBytes_ = 0;
this.lastReceiveBytes_ = 0;

this.firstSendTime_ = 0;
this.firstReceiveTime_ = 0;
this.urgentReceiveBeginTime_ = 0;
this.lastReceiveBeginTime_ = 0;

this.avgSendSpeed_ = 0;
this.avgReceiveSpeed_ = 0;
this.urgentReceiveSpeed_ = 0;
this.lastReceiveSpeed_ = 0;
this.restrictedSendSpeed_ = 0;

this.protocolSendPieces_ = [];
this.protocolSendBytes_ = [];
this.protocolSendSpeeds_ = [];
this.protocolReceivePieces_ = [];
this.protocolReceiveBytes_ = [];
this.protocolReceiveSpeeds_ = [];
for ( var n = 0; n < p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax; n++) {
this.protocolSendPieces_[n] = 0;
this.protocolSendBytes_[n] = 0;
this.protocolSendSpeeds_[n] = 0;
this.protocolReceivePieces_[n] = 0;
this.protocolReceiveBytes_[n] = 0;
this.protocolReceiveSpeeds_[n] = 0;
}
this.shareSendRatio_ = 0;
this.shareReceiveRatio_ = 0;
this.firstPieceFetchTime_ = 0;

this.totalReceiveDuration_ = 0;
this.downloadedDuration_ = 0;
this.totalPlayedBytes_ = 0;
this.totalPlayedPieces_ = 0;
this.totalPlayedDuration_ = 0;
},

addSendData_ : function(protocolType, pieces, bytes) {
this.addSendData2_(protocolType, bytes, pieces);
this.statSendData_();
},

addSendData2_ : function(protocolType, bytes, pieces) {
if (protocolType < 0 || protocolType >= p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax) {
return;
}

this.totalSendPieces_ += pieces;
this.totalSendBytes_ += bytes;
this.actualSendPieces_ += pieces;
this.actualSendBytes_ += bytes;
this.protocolSendPieces_[protocolType] += pieces;
this.protocolSendBytes_[protocolType] += bytes;
},

statSendData_ : function() {
if (this.totalReceiveBytes_ > 0) {
this.shareSendRatio_ = this.totalSendBytes_ / this.totalReceiveBytes_;
}

var nowTime = p2p$.com.common.Global.getMilliTime_();
if (this.firstSendTime_ > 0 && nowTime > this.firstSendTime_) {
var timeEclipse = nowTime - this.firstSendTime_;
this.avgSendSpeed_ = this.actualSendPieces_ * 1000 / timeEclipse;
} else {
this.firstSendTime_ = nowTime;
}
},

addReceiveData_ : function(urgent, protocolType, pieces, bytes) {
this.addReceiveData2_(protocolType, bytes, pieces);
if (urgent) {
this.urgentReceiveBytes_ += bytes;
}

this.statReceiveData_(urgent);
},

addReceiveData2_ : function(protocolType, bytes, pieces) {
if (protocolType < 0 || protocolType >= p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeMax) {
return;
}

this.totalReceivePieces_ += pieces;
this.totalReceiveBytes_ += bytes;
this.actualReceivePieces_ += bytes;
this.actualReceiveBytes_ += bytes;
this.protocolReceivePieces_[protocolType] += pieces;
this.protocolReceiveBytes_[protocolType] += bytes;

this.lastReceiveBytes_ += bytes;
},

statReceiveData_ : function(urgent) {
if (this.totalReceiveBytes_ > 0) {
var p2pReceiveBytes = this.totalReceiveBytes_ - this.protocolReceiveBytes_[p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn];
this.shareSendRatio_ = this.totalSendBytes_ / this.totalReceiveBytes_;
this.shareReceiveRatio_ = p2pReceiveBytes / this.totalReceiveBytes_;
}

var nowTime = p2p$.com.common.Global.getMilliTime_();
if (this.firstReceiveTime_ > 0 && nowTime > this.firstReceiveTime_) {
var timeEclipse = nowTime - this.firstReceiveTime_;
this.avgReceiveSpeed_ = this.actualReceiveBytes_ * 1000 / timeEclipse;
} else {
this.firstReceiveTime_ = nowTime;
}

if (this.lastReceiveBeginTime_ > 0 && nowTime > this.lastReceiveBeginTime_) {
var timeEclipse = nowTime - this.lastReceiveBeginTime_;
this.lastReceiveSpeed_ = this.lastReceiveBytes_ * 1000 / timeEclipse;
if (timeEclipse > 5 * 1000) {
// reset
this.lastReceiveBeginTime_ = nowTime;
this.lastReceiveBytes_ = 0;
}
} else {
this.lastReceiveBeginTime_ = nowTime;
}

if (urgent) {
if (this.urgentReceiveBeginTime_ > 0 && nowTime > this.urgentReceiveBeginTime_) {
var timeEclipse = nowTime - this.urgentReceiveBeginTime_;
this.urgentReceiveSpeed_ = this.urgentReceiveBytes_ * 1000 / timeEclipse;
if (timeEclipse > 5 * 1000) {
// reset
this.urgentReceiveBeginTime_ = nowTime;
this.urgentReceiveBytes_ = 0;
}
} else {
this.urgentReceiveBeginTime_ = nowTime;
}
}
},
getAllStatus_ : function(result) {
result["totalSendPieces"] = this.totalSendPieces_;
result["totalSendBytes"] = this.totalSendBytes_;
result["actualSendPieces"] = this.actualSendPieces_;
result["actualSendBytes"] = this.actualSendBytes_;
result["totalReceivePieces"] = this.totalReceivePieces_;
result["totalReceiveBytes"] = this.totalReceiveBytes_;
result["actualReceivePieces"] = this.actualReceivePieces_;
result["actualReceiveBytes"] = this.actualReceiveBytes_;
result["urgentReceiveBytes"] = this.urgentReceiveBytes_;
result["lastReceiveBytes"] = this.lastReceiveBytes_;

result["shareSendRatio"] = this.shareSendRatio_;
result["shareReceiveRatio"] = this.shareReceiveRatio_;

result["avgSendSpeed"] = this.avgSendSpeed_;
result["avgReceiveSpeed"] = this.avgReceiveSpeed_;
result["urgentReceiveSpeed"] = this.urgentReceiveSpeed_;
result["lastReceiveSpeed"] = this.lastReceiveSpeed_;
result["restrictedSendSpeed"] = this.restrictedSendSpeed_;

result["totalReceiveDuration"] = this.totalReceiveDuration_;
result["downloadedDuration"] = this.downloadedDuration_;
result["totalPlayedBytes"] = this.totalPlayedBytes_;
result["totalPlayedPieces"] = this.totalPlayedPieces_;
result["totalPlayedDuration"] = this.totalPlayedDuration_;

var protocolValues = result["protocols"] = [];
var ptypes = p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES;
for ( var type = ptypes.kProtocolTypeReserved + 1; type < ptypes.kProtocolTypeMax; type++) {
var protocolItem = protocolValues[type] = {};
protocolItem["totalSendPieces"] = this.protocolReceivePieces_[type];
protocolItem["totalSendBytes"] = this.protocolSendBytes_[type];
protocolItem["totalReceivePieces"] = this.protocolReceivePieces_[type];
protocolItem["totalReceiveBytes"] = this.protocolReceiveBytes_[type];
protocolItem["shareSendRatio"] = this.protocolReceiveBytes_[type] > 0 ? (this.protocolSendBytes_[type] / this.protocolReceiveBytes_[type]) : 0;
protocolItem["shareReceiveRatio"] = this.totalReceiveBytes_ > 0 ? (this.protocolReceiveBytes_[type] / this.totalReceiveBytes_) : 0;
}
}
});
p2p$.ns('com.webp2p.logic.live');

p2p$.com.webp2p.logic.live.ChannelStatic = {
kTimerTagMetaUpdate : 0,
};

p2p$.com.webp2p.logic.live.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
channelType_ : "liv",
playLastSegmentCount_ : 0,
lastFetchEndSegmentId_ : 0,
liveFirstUrgentUpdated_ : false,
liveSkipSegmentTime_ : 0,
liveStreamId_ : "",
backupMetaData_ : null,
// boost::asio::deadline_timer liveTimer_;

init : function(channelUrl, decodedUrl, mgr) {
this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive, channelUrl, decodedUrl, mgr);
this.tag_ = "com::webp2p::logic::live::Channel";
this.context_.playType_ = "liv";
this.maxSleepTime_ = 60 * 1000;
this.lastFetchEndSegmentId_ = 0;
this.liveFirstUrgentUpdated_ = false;
this.liveSkipSegmentTime_ = 0;
},

getChannelType_ : function() {
return this.channelType_;
},

open : function() {
this._super();
if (this.manager_.getEnviroment_().livePlayOffset_ > 0) {
this.meta_.livePlayOffset_ = this.manager_.getEnviroment_().livePlayOffset_;
}
this.liveStreamId_ = this.url_.params_.get("stream_id");
this.playerHistoryKey_ = "live:" + this.liveStreamId_;
// this.updateUrlParams(false);
this.gslb_.url_.params_.set("mslice", 5);
var timeshift = this.gslb_.url_.params_.get("timeshift");
if (timeshift != null) {
this.meta_.livePlayerShift_ = this.strings_.parseNumber_(timeshift.value, 0);
if (this.meta_.livePlayerShift_ == 0) {
this.gslb_.url_.params_.erase(timeshift.key);
}
}
this.gslb_.start_();
return true;
},
close : function() {
this._super();
return true;
},
// override logic::base::Channel
onOpened_ : function() {

var minSegmentTime = -1;
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
this.meta_.liveMaxSegmentStartTime_ = Math.max(this.meta_.liveMaxSegmentStartTime_, segment.startTime_);
if (minSegmentTime < 0 || minSegmentTime > segment.startTime_) {
minSegmentTime = segment.startTime_;
}
}
if (this.gslb_.gslbReloadTimes_ <= 0 && (minSegmentTime / 1000) > this.meta_.liveAbTimeShift_) {
// fixed abtimeshift
this.meta_.liveCurrentTime_ += (minSegmentTime / 1000 - this.meta_.liveAbTimeShift_);
}

var p2pGroupIdChanged = false;
if (this.gslb_.gslbReloadTimes_ > 0) {
var newSegment = {
newSegmentCount_ : 0,
newSegments_ : []
};
if (this.backupMetaData_ && this.backupMetaData_.p2pGroupId_ == this.metaData_.p2pGroupId_) {
p2pGroupIdChanged = false;
newSegment = this.metaData_.combineWith_(this.backupMetaData_, true, false);
} else {
p2pGroupIdChanged = true;
}
this.backupMetaData_.tidy();
this.meta_.liveMaxSegmentStartTime_ = 0;
for ( var k = 0; k < this.metaData_.segments_.length; k++) {
var segment = this.metaData_.segments_[k];
this.meta_.liveMaxSegmentStartTime_ = Math.max(this.meta_.liveMaxSegmentStartTime_, segment.startTime_);
}

P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Add {1} backup meta segment(s) to reloaded channel({2}), total {3} segment(s) now",this.tag_,newSegment.newSegmentCount_, this.id_, this.metaData_.segments_.length));
}

this.stablePeers_ = [];
this.otherPeers_ = [];
if (this.protocolPool_ != null && !this.protocolPool_.initialize_()) {
return false;
}
return true;
},
onGslbComplete_:function()
{
this.meta_.setLiveParams_();
this._super();
},

removeExpiredSegments_ : function() {
var validDuration = 0;
var validSegmentCount = 0;
var endIndex = this.metaData_.segments_.length;
for (; endIndex != -1; endIndex--) {
if (endIndex == this.metaData_.segments_.length) {
continue;
}

var segment = this.metaData_.segments_[endIndex];
validDuration += segment.duration_;
validSegmentCount++;
if (validDuration >= (this.livePlayMaxTimeLength_) * 1000) {
break;
}
}
if (endIndex > 0) {
var expiredSegmentCount = this.metaData_.segments_.length - validSegmentCount;
var expiredSegmentNames = "";
var bucket = this.getStorageBucket_();
for ( var n = 0; n < endIndex; n++) {
var segment = this.metaData_.segments_[n];
var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
if (n == endIndex - 1) {
expiredSegmentNames += segment.id_;
} else {
expiredSegmentNames += (segment.id_ + ",");
}
bucket.remove(objectId);
}
for ( var n = 0; n < endIndex; n++) {
var segment = this.metaData_.segments_[n];
this.metaData_.p2pPieceCount_ -= segment.pieces_.length;
}
this.metaData_.segments_.splice(0, endIndex);
P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Remove {1} ({2}) expired meta segment(s) from channel({3}), total {4} segment(s) now",this.tag_,expiredSegmentCount, expiredSegmentNames, this.id_, this.metaData_.segments_.length));

if (expiredSegmentCount > 0) {
this.fillSelfPieceRanges_(this.selfRangesMessage_);
this.metaData_.buildIndexes_();
}
}
},

onSchedule_ : function(shareMode) {
var nowTime = this.global_.getMilliTime_();
if (this.paused_) {
return;
}
// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::live::Channel", "Schedule %s for channel(%s) ..."), shareMode ? "share only" : "multi mode", id_.c_str());
this.lastScheduleTime_ = nowTime;
this.updatePeersSpeed_(nowTime, this.stablePeers_);

// check pieces to download
var totalDuration = 0;
var maxDuration = this.context_.p2pUrgentSize_ * 1000;
this.urgentSegmentIndex_ = -1;
for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
var segment = this.metaData_.segments_[n];
if (segment.id_ == this.urgentSegmentId_) {
// find urgent segment index
this.urgentSegmentIndex_ = n;
this.context_.playingPosition_ = segment.startTime_ / 1000;
}
if (n >= this.urgentSegmentIndex_) {
if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
// urgent should has 2 segments at least if more segments eixst
this.urgentSegmentEndId_ = segment.id_;
}
totalDuration += segment.duration_;
}
}

if (this.urgentSegmentIndex_ < 0 && this.metaData_.segments_.length > 0) {
this.urgentSegmentIndex_ = 0;
}
this.updateUrgentIncompleteCount_();
if (!shareMode) {
this.checkTimeoutPieces_(nowTime);
this.checkTimeoutPeers_(nowTime);
this.checkPeerPieceRanges_(nowTime);

this.lastPeerSortTime_ = nowTime;
this.stablePeers_.sort(function(item1, item2) {
if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
}
return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
});
this.otherPeers_.sort(function(item1, item2) {
if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
}
return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
});
this.statData_.addReceiveData_(true, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn, 0, 0); // flush speed
// updateStatSyncSpeeds_();
}

this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
if (this.urgentSegmentIndex_ < 0) {
// all segments completed
return;
}

// urgent area stable peers first
var stableDispatchPiece = 0;
if (!shareMode && this.stablePeers_.length > 0) {
stableDispatchPiece = this.dispatchStablePeers_(this.urgentSegmentIndex_);
}

// p2p area try other peers, sort by last receive speed
// if( manager_.getEnviroment_().p2pEnabled_ )
// if( urgentIncompleteCount_ <= 0 )
this.otherPeerRequestCount_ = this.dispatchOtherPeers_(this.urgentSegmentIndex_);

// active cdn fetch area
var fetchPieces = 0;
if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.manager_.getEnviroment_().p2pEnabled_ && this.urgentIncompleteCount_ <= 0
&& this.otherPeers_.length > 0) {
fetchPieces = this.dispatchFetchRate_(this.urgentSegmentIndex_);
}

// updateStatDownloadedDuration();

P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Schedule {1} stable pieces ...",this.tag_,stableDispatchPiece));
},
dispatchFetchRate_ : function(startSegmentIndex) {
if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
return 0;
}

// active cdn fetch area
var fetchPieceCount = 0;
var idlePieceCount = 0;
// var maxRatioFetchCount = 1;
var maxFetchNumber = this.context_.p2pFetchRate_ * 100;
var startFetchId = this.lastFetchEndSegmentId_;
var nowTime = this.global_.getMilliTime_();
var usedSegmentCount = 0;
var usedOffsetBytes = 0;
var maxOffsetBytes = (this.getStorageBucket_().getDataCapacity_()) * 2 / 3;

var message = new p2p$.com.webp2p.protocol.base.Message();
var peer = this.getNextIdleStablePeer_();
for ( var n = startSegmentIndex; n < this.metaData_.segments_.length && peer; n++) {
var segment = this.metaData_.segments_[n];
if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
// urgent incompleted
break;
}

usedSegmentCount++;
if (segment.size_ > 0) {
// to avoid too many bytes
usedOffsetBytes += segment.size_;
if (usedOffsetBytes > maxOffsetBytes) {
break;
}
} else if (usedSegmentCount > 10) {
// to avoid too many segments
break;
}

this.lastFetchEndSegmentId_ = segment.id_;
if (segment.id_ <= startFetchId) {
continue;
} else if (segment.completedTime_ > 0) {
continue;
}

var previousTn = false;
var previousHit = false;
for ( var k = 0; k < segment.pieces_.length && peer; k++) {
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0 || piece.receiveStartTime_ > 0 || piece.shareInRanges_ > 0 || piece.size_ <= 0) {
// completed or receiving or exits other peer
previousHit = false;
continue;
}

if (piece.randomNumber_ >= maxFetchNumber) {
if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
if (k + 1 >= segment.pieces_.length) {
continue;
}
var next = segment.pieces_[k + 1];
if (next.completedTime_ > 0 || next.receiveStartTime_ > 0 || next.shareInRanges_ > 0) {
continue;
} else if (next.randomNumber_ >= maxFetchNumber) {
continue;
}
} else if (!previousHit || !previousTn) {
continue;
}
}

var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
requestItem.segmentId_ = segment.id_;
requestItem.pieceType_ = piece.type_;
requestItem.pieceId_ = piece.id_;
requestItem.checksum_ = piece.checksum_;
message.requests_.push(requestItem);
piece.receiveByStable_ = true;
piece.receiveStartTime_ = nowTime;
piece.receiveSessionId_ = peer.sessionId_;
if (segment.startReceiveTime_ <= 0) {
segment.startReceiveTime_ = nowTime;
}
fetchPieceCount++;
previousTn = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn);
previousHit = true;
}
if (message.requests_.length > 0) {
if (peer.pendingRequestCount_ <= 0) {
peer.lastSegmentId_ = segment.id_;
}
peer.pendingRequestCount_ += message.requests_.length;
peer.statSendMessage_(message);
peer.session_.send(message);
message.requests_ = [];
peer = this.getNextIdleStablePeer_();
}
}

P2P_ULOG_TRACE(P2P_ULOG_FMT("{0} Random fetch, start index ({1}), total ({2}) idle pieces, fetched ({3}) fetch rate({4})",this.tag_,startFetchId, idlePieceCount, fetchPieceCount, this.context_.p2pFetchRate_ * 100));

return fetchPieceCount;
},
dispatchStablePeers_ : function(startSegmentIndex) {
if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
return 0;
}

// urgent area stable peers first
var totalDuration = 0;
var stableDispatchPiece = 0;
// var allPeersBusy = false;
var busyPieceCount = 0;
var appendDuration = 0;
var nowTime = this.global_.getMilliTime_();
var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
var message = new p2p$.com.webp2p.protocol.base.Message();

var peer = this.getNextIdleStablePeer_();
for ( var n = startSegmentIndex;
// n < endSegmentIndex && n < metaData_.segments_.size() && eachStablePiece > 0 && stableIterator != stablePeers_.end() && totalDuration <
// maxDuration;
n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
var segment = this.metaData_.segments_[n];
this.lastFetchEndSegmentId_ = Math.max(this.lastFetchEndSegmentId_, segment.id_);
totalDuration += segment.duration_;
// if( segment.lastPlayTime_ > 0 ) continue;
if (segment.completedTime_ > 0) {
continue;
}

for ( var k = 0; k < segment.pieces_.length && peer != null && busyPieceCount <= 0; k++) {
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0) {
if (message.requests_.length > 0) {
// if message.requests_.length > 0
// Keep downloadrange Continuous
// break
break;
} else {
// already complete
// continue;
continue;
}
} else if (piece.receiveStartTime_ > 0) {
// duplicate receiving
var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
if (piece.receiveByStable_ && (piece.receiveStartTime_ + pieceTimeout > nowTime)) {
// receving by stable cdn peer
busyPieceCount++;
continue;
}
}

if (segment.size_ > 0 && segment.duration_ > 0) {
appendDuration += piece.size_ / segment.size_ * segment.duration_ * 1000.0;
}

var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
requestItem.urgent_ = true;
requestItem.segmentId_ = segment.id_;
requestItem.pieceType_ = piece.type_;
requestItem.pieceId_ = piece.id_;
requestItem.checksum_ = piece.checksum_;
message.requests_.push(requestItem);
piece.receiveByStable_ = true;
piece.receiveStartTime_ = nowTime + appendDuration;
piece.receiveSessionId_ = peer.sessionId_;
if (segment.startReceiveTime_ <= 0) {
segment.startReceiveTime_ = nowTime;
}

stableDispatchPiece++;
if (message.requests_.length >= 50) {
if (peer.pendingRequestCount_ <= 0) {
peer.lastSegmentId_ = segment.id_;
}
peer.activeTime_ = nowTime;
peer.pendingRequestCount_ += message.requests_.length;
peer.statSendMessage_(message);
peer.session_.send(message);
message.requests_ = [];
appendDuration = 0;
peer = null;
break;
}
}
if (message.requests_.length > 0 && peer != null) {
if (peer.pendingRequestCount_ <= 0) {
peer.lastSegmentId_ = segment.id_;
}
peer.activeTime_ = nowTime;
peer.pendingRequestCount_ += message.requests_.length;
peer.statSendMessage_(message);
peer.session_.send(message);
message.requests_ = [];
appendDuration = 0;
peer = null;
}
}

return stableDispatchPiece;
},

dispatchOtherPeers_ : function(startSegmentIndex) {
if (this.otherPeers_.length == 0 || this.metaData_.segments_.length == 0) {
return 0;
}

// p2p area try other peers, sort by last receive speed
var stableTooSlow = false;
var requestCount = this.getOtherPeerRequestCount_();
var maxCount = this.urgentIncompleteCount_ > 0 ? this.context_.p2pMaxUrgentRequestPieces_ : this.context_.p2pMaxParallelRequestPieces_;
var bucket = this.getStorageBucket_();
var offsetIndex = -1;
var usedSegmentCount = 0;
var usedOffsetBytes = 0;
var maxOffsetBytes = bucket.getDataCapacity_() * 2 / 3;

// forward offset
if (startSegmentIndex >= 0) {
// var startIndex = startSegmentIndex;
var totalDuration = 0;
var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1500 : 2000); // 2 ratio of urgent size
stableTooSlow = this.getStablePeersSpeedTooSlow_();
for ( var n = startSegmentIndex; requestCount < maxCount && n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
totalDuration += segment.duration_;
usedSegmentCount++;
if (segment.size_ > 0) {
// to avoid too many bytes
usedOffsetBytes += segment.size_;
if (usedOffsetBytes > maxOffsetBytes || (usedSegmentCount + 5) > bucket.getMaxOpenBlocks_()) {
break;
}
} else if (usedSegmentCount > 10) {
// to avoid too many segments
break;
}

if (segment.p2pDisabled_) {
continue;
}
if (totalDuration <= maxDuration && !stableTooSlow && this.urgentSegmentIndex_ >= 0) {
continue;
}
if (offsetIndex < 0) {
offsetIndex = n;
}
requestCount = this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
// urgent incompleted
break;
}
}
}
if (offsetIndex < 0) {
offsetIndex = this.metaData_.segments_.length - 1;
}
// backward check
for ( var n = offsetIndex; requestCount < maxCount && n >= 0 && n >= startSegmentIndex; n--) {
var segment = this.metaData_.segments_[n];
if (segment.p2pDisabled_ || segment.completedTime_ > 0) {
continue;
}
requestCount += this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
}
return requestCount;
},

dispatchSegmentForOtherPeers_ : function(stableTooSlow, requestCount, maxCount, segment) {
var nowTime = this.global_.getMilliTime_();
for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0 || piece.size_ <= 0) {
// completed
continue;
} else if (piece.receiveStartTime_ > 0)
{
// duplicate receiving
var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
if (piece.receiveStartTime_ + pieceTimeout > nowTime) {
if (!piece.receiveByStable_ || !stableTooSlow) {
// not expired
continue;
}
}
}

var peer = this.getNextIdleOtherPeer_(piece.type_, piece.id_);

if (peer == null) {
// no idle peer has this piece
continue;
}

var message = new p2p$.com.webp2p.protocol.base.Message();
var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
requestItem.segmentId_ = segment.id_;
requestItem.pieceType_ = piece.type_;
requestItem.pieceId_ = piece.id_;
requestItem.checksum_ = piece.checksum_;
message.requests_.push(requestItem);
piece.receiveByOther_ = true;
piece.receiveSessionId_ = peer.sessionId_;
piece.receiveStartTime_ = nowTime;
peer.activeTime_ = nowTime;
peer.lastSegmentId_ = segment.id_;
peer.receivePiece_ = piece;
peer.statSendMessage_(message);
peer.statReceiveBegin_();
peer.session_.send(message);
requestCount++;

// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::dispatchSegmentForOtherPeer"));
}

return requestCount;
},

getAllStatus_2_ : function(params, result) {
this._super(params, result);
result["liveStreamId"] = this.liveStreamId_;
// result["liveStartTime"] = this.liveStartTime_;
// result["liveCurrentTime"] = this.liveCurrentTime_;
// result["livePlayerShift"] = this.livePlayerShift_;
// result["liveAbTimeShift"] = this.liveAbTimeShift_;
// result["livePseudoPlayTime"] = this.getPseudoPlayTime_(nowTime);
// result["liveNowPlayOffset"] = this.liveNowPlayOffset_;
// result["livePlayOffset"] = this.livePlayOffset_;
// result["livePlayMaxTimeLength"] = this.livePlayMaxTimeLength_;
// result["liveMetaRefreshInterval"] = this.liveMetaRefreshInterval_;
// result["liveSkipSegmentTime"] = this.liveSkipSegmentTime_;
},

getPseudoPlayTime_ : function(nowTime) {
var liveSkipTime = Math.floor(this.liveSkipSegmentTime_ / 1000);
this.liveSkipTime = Math.max(Math.min(liveSkipTime, 60), 0);
var playFlushGap = 0;
var pseudoTime = this.liveCurrentTime_ + (nowTime - this.liveMetaLoadTime_) / 1000;
return pseudoTime - this.livePlayOffset_ + this.context_.specialPlayerTimeOffset_ + playFlushGap + liveSkipTime; // +
// (time_t)(metaData_.totalGapDuration_ / 1000);
},

updateUrgentSegment_ : function(requireId) {
this._super(requireId);
if ( /* fromPlayer && */requireId >= 0 && !this.liveFirstUrgentUpdated_) {
this.liveFirstUrgentUpdated_ = true;
this.liveSkipSegmentTime_ = 0;
for ( var n = 0; n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
if (segment.id_ >= requireId) {
break;
}
if (segment.duration_ > 0) {
this.liveSkipSegmentTime_ += segment.duration_;
}
}
}
}
});
p2p$.ns('com.webp2p.logic.vod');
p2p$.com.webp2p.logic.vod.ChannelStatic = {
kTimerSchedule : 0,
kTimerReport : 1,
};
p2p$.com.webp2p.logic.vod.Channel = p2p$.com.webp2p.logic.base.Channel.extend_({
// 初始化参数
lastUrgentStartAbsTime_ : 0,
lastUrgentStartMetaTime_ : 0,
lastRequireSegmentId_ : 0,

init : function(channelUrl, decodedUrl, mgr) {
this._super(p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod, channelUrl, decodedUrl, mgr);
this.tag_="com::webp2p::logic::vod::Channel";
this.channelType_="vod";
this.context_.playType_ = "vod";
this.lastUrgentStartAbsTime_ = 0;
this.lastUrgentStartMetaTime_ = 0;
this.lastRequireSegmentId_ = 0;
},

open : function() {
this._super();
this.sendStatus_({type:"VIDEO.GSLB.LOADING"});
this.gslb_.start_();
return true;
},

onOpened_ : function() {
if (this.protocolPool_ == null) {
return;
}
this.stablePeers = [];
this.otherPeers_ = [];
this.protocolPool_.initialize_();
this.setScheduleTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule, 3 * 1000);
},

close : function() {
this._super();
},

detectAutoRedirectMode_ : function() {
},

dispatchStablePeers_ : function(startSegmentIndex) {
if (this.stablePeers_.length == 0 || this.metaData_.segments_.length == 0) {
return null;
}
// urgent area stable peers first
var totalDuration = 0;
var stableDispatchPiece = 0;
// bool allPeersBusy = false;
var busyPieceCount = 0;
var appendDuration = 0;
var nowTime = this.global_.getMilliTime_();
var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1000 : 1500); // 1.5 ratio for p2p
var message = new p2p$.com.webp2p.protocol.base.Message();

if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
&& this.metaData_.segments_[this.urgentSegmentIndex_].completedTime_ <= 0) {
// cancel all far downloading stable peers when urgent segment is not completed
for ( var n = 0; n < this.stablePeers_.length; n++) {
var item = this.stablePeers_[n];
if (item == null || item.pendingRequestCount_ <= 0 || item.lastSegmentId_ == this.urgentSegmentId_) {
continue;
}

P2P_ULOG_INFO(P2P_ULOG_FMT("{0} [{1}]Cancel far downloading stable peer, segment({2}), pending({3}), id({4}), address({5})",this.tag_,p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.lastSegmentId_, item.pendingRequestCount_, item.session_.getRemoteId_(), item.session_.getRemoteAddress_()));
this.resetPieceReceivingBySession_(item.sessionId_);
this.resetPeerMessage_(nowTime, false, item);
}
}
var peer = this.getNextIdleStablePeer_();
var retPeer = peer;
var retSegment = null;
for ( var n = startSegmentIndex;n < this.metaData_.segments_.length && totalDuration < maxDuration; n++) {
var segment = this.metaData_.segments_[n];
totalDuration += segment.duration_;
if (segment.completedTime_ > 0) {
continue;
}
for ( var k = 0; k < segment.pieces_.length && peer != null && busyPieceCount <= 0; k++) {
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0) {
if (message.requests_.length > 0) {
break;
} else {
continue;
}
} else if (piece.receiveStartTime_ > 0) {
// duplicate receiving
var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
if (piece.receiveByStable_ && (piece.receiveStartTime_ + pieceTimeout > nowTime)) {
// receving by stable cdn peer
busyPieceCount++;
continue;
}
// busyPieceCount ++;
// break;
}
retSegment = segment;
if (segment.size_ > 0 && segment.duration_ > 0) {
appendDuration += piece.size_ / segment.size_ * segment.duration_ * 1000.0;
}

var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
requestItem.urgent_ = true;
requestItem.segmentId_ = segment.id_;
requestItem.pieceType_ = piece.type_;
requestItem.pieceId_ = piece.id_;
requestItem.checksum_ = piece.checksum_;
message.requests_.push(requestItem);
piece.receiveByStable_ = true;
piece.receiveStartTime_ = nowTime + appendDuration;
piece.receiveSessionId_ = peer.sessionId_;
if (segment.startReceiveTime_ <= 0) {
segment.startReceiveTime_ = nowTime;
}

stableDispatchPiece++;
if (message.requests_.length >= 50) {
if (peer.pendingRequestCount_ <= 0) {
peer.lastSegmentId_ = segment.id_;
}
peer.activeTime_ = nowTime;
peer.pendingRequestCount_ += message.requests_.length;
peer.statSendMessage_(message);
peer.session_.send(message);
message.requests_ = [];
appendDuration = 0;
peer = null;
break;
}
}
if (message.requests_.length > 0 && peer != null) {
if (peer.pendingRequestCount_ <= 0) {
peer.lastSegmentId_ = segment.id_;
}
peer.activeTime_ = nowTime;
peer.pendingRequestCount_ += message.requests_.length;
peer.statSendMessage_(message);
peer.session_.send(message);
message.requests_ = [];
appendDuration = 0;
peer = null;
}
}

return {
"stableDispatchPiece" : stableDispatchPiece,
"peerInfo" : retPeer,
"segmentInfo" : retSegment
};
},

onSchedule_ : function(shareMode) {
var nowTime = this.global_.getMilliTime_();
if (this.paused_) {
return;
}
this.lastScheduleTime_ = nowTime;
this.updatePeersSpeed_(nowTime, this.stablePeers_);
// check pieces to download
var totalDuration = 0;
var maxDuration = this.context_.p2pUrgentSize_ * 1000;
this.urgentSegmentIndex_ = -1;
for ( var n = 0; (this.urgentSegmentId_ >= 0) && (n < this.metaData_.segments_.length); n++) {
var segment = this.metaData_.segments_[n];
if (segment.id_ == this.urgentSegmentId_) {
// find urgent segment index
this.urgentSegmentIndex_ = n;
this.context_.playingPosition_ = segment.startTimeActual_ / 1000;
}
if (this.urgentSegmentIndex_ >= 0 && n >= this.urgentSegmentIndex_) {
if (totalDuration < maxDuration || this.urgentSegmentEndId_ <= this.urgentSegmentId_) {
// urgent should has 2 segments at least if more segments eixst
this.urgentSegmentEndId_ = segment.id_;
}
totalDuration += segment.duration_;
}
}
if (!shareMode) {
this.checkTimeoutPieces_(nowTime);
this.checkTimeoutPeers_(nowTime);
this.checkPeerPieceRanges_(nowTime);

this.lastPeerSortTime_ = nowTime;
this.stablePeers_.sort(function(item1, item2) {
if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
}
return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
});
this.otherPeers_.sort(function(item1, item2) {
if (item1.lastReceiveSpeed_ == item2.lastReceiveSpeed_) {
return item1.lastTimeoutTime_ - item2.lastTimeoutTime_;
}
return item2.lastReceiveSpeed_ - item1.lastReceiveSpeed_;
});
this.statData_.addReceiveData_(true, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn, 0, 0); // flush speed
}
//
this.metaData_.urgentSegmentId_ = this.urgentSegmentId_;
this.updateUrgentIncompleteCount_();
// urgent area stable peers first
var retVal = null;
if (!shareMode && (this.urgentSegmentIndex_ >= 0) && this.stablePeers_.length > 0) {
retVal = this.dispatchStablePeers_(this.urgentSegmentIndex_);
if (retVal != null && retVal.segmentInfo != null) {
P2P_ULOG_INFO(P2P_ULOG_FMT("{0} Schedule {1} piece request(s) to ({2}), channel({3}),urgentSegmentId({4}), segmentID({5}), segmentPieces({6})",this.tag_, retVal.stableDispatchPiece, retVal.peerInfo.session_.remoteAddress_,this.id_, this.urgentSegmentId_, retVal.segmentInfo.id_,((this.urgentSegmentIndex_ < this.metaData_.segments_.length) ? this.metaData_.segments_[retVal.segmentInfo.id_].pieces_.length : 0)));
}
}
this.otherPeerRequestCount_ = this.dispatchOtherPeers_((this.urgentSegmentIndex_ >= 0) ? this.urgentSegmentIndex_ : 0);
},

dispatchOtherPeers_ : function(startSegmentIndex) {
if (this.otherPeers_.length == 0 || this.metaData_.segments_.length == 0) {
return 0;
}

// p2p area try other peers, sort by last receive speed
var stableTooSlow = false;
var requestCount = this.getOtherPeerRequestCount_();
var maxCount = this.urgentIncompleteCount_ > 0 ? this.context_.p2pMaxUrgentRequestPieces_ : this.context_.p2pMaxParallelRequestPieces_;
var bucket = this.getStorageBucket_();
var offsetIndex = -1;
var usedSegmentCount = 0;
var usedOffsetBytes = 0;
var maxOffsetBytes = bucket.getDataCapacity_() * 2 / 3;
//
// // forward offset
if (startSegmentIndex >= 0) {
// size_t startIndex = startSegmentIndex;
var totalDuration = 0;
var maxDuration = this.getUrgentMaxDuration_(this.manager_.getEnviroment_().isMobileNetwork_() ? 1500 : 2000); // 2 ratio of urgent size
stableTooSlow = this.getStablePeersSpeedTooSlow_();
for ( var n = startSegmentIndex; requestCount < maxCount && n < this.metaData_.segments_.length; n++) {
var segment = this.metaData_.segments_[n];
totalDuration += segment.duration_;
usedSegmentCount++;
if (segment.size_ > 0) {
// to avoid too many bytes
usedOffsetBytes += segment.size_;
if (usedOffsetBytes > maxOffsetBytes || (usedSegmentCount + 5) > bucket.getMaxOpenBlocks_()) {
break;
}
} else if (usedSegmentCount > 10) {
// to avoid too many segments
break;
}

if (segment.p2pDisabled_) {
continue;
}
if (totalDuration <= maxDuration && !stableTooSlow && this.urgentSegmentIndex_ >= 0) {
continue;
}
if (offsetIndex < 0) {
offsetIndex = n;
}
requestCount = this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
if (this.urgentIncompleteCount_ > 0 && this.urgentSegmentEndId_ >= 0 && segment.id_ >= this.urgentSegmentEndId_) {
// urgent incompleted
break;
}
}
}
//
if (offsetIndex < 0) {
return requestCount;
}
//
// // backward check
for ( var n = offsetIndex; requestCount < maxCount && n >= 0 && n >= startSegmentIndex; n--) {
var segment = this.metaData_.segments_[n];
if (segment.p2pDisabled_ || segment.completedTime_ > 0) {
continue;
}
requestCount += this.dispatchSegmentForOtherPeers_(stableTooSlow, requestCount, maxCount, segment);
}
return requestCount;
},

dispatchSegmentForOtherPeers_ : function(stableTooSlow, requestCount, maxCount, segment) {
var nowTime = this.global_.getMilliTime_();
for ( var k = 0; requestCount < maxCount && k < segment.pieces_.length; k++) {
var piece = segment.pieces_[k];
if (piece.completedTime_ > 0 || piece.size_ <= 0) {
// completed
continue;
} else if (piece.receiveStartTime_ > 0)
{
// duplicate receiving
var pieceTimeout = ((piece.size_ > 0) ? (this.context_.p2pUrgentSize_ / 2) : this.context_.p2pUrgentSize_) * 1000;
if (piece.receiveStartTime_ + pieceTimeout > nowTime) {
if (!piece.receiveByStable_ || !stableTooSlow) {
// not expired
continue;
}
}
}

var peer = this.getNextIdleOtherPeer_(piece.type_, piece.id_);

if (peer == null) {
// no idle peer has this piece
continue;
}

var message = new p2p$.com.webp2p.protocol.base.Message();
var requestItem = new p2p$.com.webp2p.protocol.base.RequestDataItem();
requestItem.segmentId_ = segment.id_;
requestItem.pieceType_ = piece.type_;
requestItem.pieceId_ = piece.id_;
requestItem.checksum_ = piece.checksum_;
message.requests_.push(requestItem);
piece.receiveByOther_ = true;
piece.receiveSessionId_ = peer.sessionId_;
piece.receiveStartTime_ = nowTime;
peer.activeTime_ = nowTime;
peer.lastSegmentId_ = segment.id_;
peer.receivePiece_ = piece;
peer.statSendMessage_(message);
peer.statReceiveBegin_();
peer.session_.send(message);
requestCount++;

// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::vod::Channel::dispatchSegmentForOtherPeer"));
}

return requestCount;
},

sortStablePeers_ : function() {
// for ( var n = 0; n < this.stablePeers_.length; n++) {
// var item = this.stablePeers_[n];
// }
},

onTimeout_ : function(tag) {

switch (tag) {
case p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule: {
this.onSchedule_(false);
this.setScheduleTimeout_(p2p$.com.webp2p.logic.vod.ChannelStatic.kTimerSchedule, 3 * 1000);
break;
}
default:
break;
}

},

// override protocol::base::EventListener
onProtocolSessionMessage_ : function(session, message) {
this._super(session, message);
}
});

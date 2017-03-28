p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ClientStageStatic = {
	kActionInitialize : 0,
	kActionDownloadMeta : 1,
	kActionSelectorConnected : 2,
	kActionRtmfpConnected : 3,
	kActionGatherConnected : 4,
	kActionWebrtcConnected : 6,

	kActionFirstP2pPiece : 5,
	kActionCdeTrackerConnected : 8,
	kActionScheduleCompleted : 11,
	kActionFirstPiece : 12,
};

p2p$.com.webp2p.tools.collector.ClientStage = p2p$.com.webp2p.tools.collector.ClientBase.extend_({
	action_ : 0,
	errorCode_ : 0,
	usedTime_ : 0,
	serverIp_ : "",
	serverPort_ : 0,

	init : function() {
		this.action_ = 0;
		this.errorCode_ = 0;
		this.usedTime_ = 0;
		this.serverPort_ = 0;
		this.serverIp_ = "";
	},

	tidy : function() {
		this._super();
		this.action_ = 0;
		this.errorCode_ = 0;
		this.usedTime_ = 0;
		this.serverPort_ = 0;
	},

	toUrl_ : function(client, url) {
		this._super(client, url);
		url.file_ = "/ClientStageInfo";
		url.params_.set("act", p2p$.com.webp2p.core.common.String.fromNumber(this.action_));
		url.params_.set("err", p2p$.com.webp2p.core.common.String.fromNumber(this.errorCode_));
		url.params_.set("utime", p2p$.com.webp2p.core.common.String.fromNumber(this.usedTime_));
		url.params_.set("ip", this.serverIp_);
		url.params_.set("port", p2p$.com.webp2p.core.common.String.fromNumber(this.serverPort_));
	}

});
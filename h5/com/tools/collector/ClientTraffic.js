p2p$.ns('com.tools.collector');

p2p$.com.tools.collector.ClientTraffic = p2p$.com.tools.collector.ClientBase.extend_({

	playing_ : false,
	downloadSizeFromCdn_ : 0,

	downloadSizeByRtmfp_ : 0,
	downloadSizeByRtmfpFromPc_ : 0,
	downloadSizeByRtmfpFromTv_ : 0,
	downloadSizeByRtmfpFromBox_ : 0,
	downloadSizeByRtmfpFromMobile_ : 0,

	downloadSizeByWebsocket_ : 0,
	downloadSizeByWebsocketFromPc_ : 0,
	downloadSizeByWebsocketFromTv_ : 0,
	downloadSizeByWebsocketFromBox_ : 0,
	downloadSizeByWebsocketFromMobile_ : 0,

	downloadSizeByWebrtc_ : 0,
	downloadSizeByWebrtcFromPc_ : 0,
	downloadSizeByWebrtcFromTv_ : 0,
	downloadSizeByWebrtcFromBox_ : 0,
	downloadSizeByWebrtcFromMobile_ : 0,

	avgRtmfpNodes_ : 0,
	avgRtmfpSessions_ : 0,
	avgWebSocketNodes_ : 0,
	avgWebSocketSessions_ : 0,
	avgWebrtcNodes_ : 0,
	avgWebrtcSessions_ : 0,

	totalRtmfpNodes_ : 0,
	totalRtmfpSessions_ : 0,
	totalWebSocketNodes_ : 0,
	totalWebSocketSessions_ : 0,
	totalWebrtcNodes_ : 0,
	totalWebrtcSessions_ : 0,

	rtmfpNodeTimes_ : 0,
	rtmfpSessionTimes_ : 0,
	webSocketNodeTimes_ : 0,
	webSocketSessionTimes_ : 0,
	webrtcNodeTimes_ : 0,
	webrtcSessionTimes_ : 0,

	trackerServerIp_ : "",
	trackerServerPort_ : 0,
	rtmfpServerIp_ : "",
	rtmfpServerPort_ : 0,
	webrtcServerIp_ : "",
	webrtcServerPort_ : 0,
	stunServerIp_ : "",
	stunServerPort_ : 0,

	uploadSizeByRtmfp_ : 0,
	uploadSizeByWebsocket_ : 0,
	uploadSizeByWebrtc_ : 0,

	checksumSuccessCount_ : 0,
	checksumErrorsByCdn_ : 0,
	checksumErrorsByRtmfp_ : 0,
	checksumErrorsByWebsocket_ : 0,
	checksumErrorsByWebrtc_ : 0,
	checksumErrorsByUnknown_ : 0,

	dropSizeByCdn_:0,
	dropSizeByRtmfp_:0,
	dropSizeByWebrtc_:0,
	dropSizeByWebsocket_:0,
	dropSizeByUnknown_:0,

	updated_ : false,
	nodesReset_ : false,
	updateTime_ : 0,
	lastFlushTime_ : 0,

	init : function() {
		this._super();
		this.trackerServerPort_ = 0;
		this.rtmfpServerPort_ = 0;

		this.updated_ = false;
		this.updateTime_ = 0;
		this.lastFlushTime_ = this.global_.getMilliTime_();
		this.tidy();
		this.tidyNodeAndSessions_();
	},

	tidy : function() {
		this._super();
		this.nodesReset_ = true;
		this.playing_ = true;
		this.downloadSizeFromCdn_ = 0;
		this.downloadSizeByRtmfp_ = 0;
		this.downloadSizeByRtmfpFromPc_ = 0;
		this.downloadSizeByRtmfpFromTv_ = 0;
		this.downloadSizeByRtmfpFromBox_ = 0;
		this.downloadSizeByRtmfpFromMobile_ = 0;

		this.downloadSizeByWebsocket_ = 0;
		this.downloadSizeByWebsocketFromPc_ = 0;
		this.downloadSizeByWebsocketFromTv_ = 0;
		this.downloadSizeByWebsocketFromBox_ = 0;
		this.downloadSizeByWebsocketFromMobile_ = 0;

		this.downloadSizeByWebrtc_ = 0;
		this.downloadSizeByWebrtcFromPc_ = 0;
		this.downloadSizeByWebrtcFromTv_ = 0;
		this.downloadSizeByWebrtcFromBox_ = 0;
		this.downloadSizeByWebrtcFromMobile_ = 0;

		this.uploadSizeByRtmfp_ = 0;
		this.uploadSizeByWebsocket_ = 0;
		this.uploadSizeByWebrtc_ = 0;

		this.checksumSuccessCount_ = 0;
		this.checksumErrorsByCdn_ = 0;
		this.checksumErrorsByRtmfp_ = 0;
		this.checksumErrorsByWebsocket_ = 0;
		this.checksumErrorsByWebrtc_ = 0;
		this.checksumErrorsByUnknown_ = 0;

		this.dropSizeByCdn_=0;
        this.dropSizeByRtmfp_=0;
        this.dropSizeByWebrtc_=0;
        this.dropSizeByWebsocket_=0;
        this.dropSizeByUnknown_=0;
	},

	tidyNodeAndSessions_ : function() {
		this.avgRtmfpNodes_ = 0;
		this.avgRtmfpSessions_ = 0;
		this.avgWebSocketNodes_ = 0;
		this.avgWebSocketSessions_ = 0;
		this.avgWebrtcNodes_ = 0;
		this.avgWebrtcSessions_ = 0;

		this.totalRtmfpNodes_ = 0;
		this.totalRtmfpSessions_ = 0;
		this.totalWebSocketNodes_ = 0;
		this.totalWebSocketSessions_ = 0;
		this.totalWebrtcNodes_ = 0;
		this.totalWebrtcSessions_ = 0;

		this.rtmfpNodeTimes_ = 0;
		this.rtmfpSessionTimes_ = 0;
		this.webSocketNodeTimes_ = 0;
		this.webSocketSessionTimes_ = 0;
		this.webrtcNodeTimes_ = 0;
		this.webrtcSessionTimes_ = 0;
	},

	getLoadParams_:function()
	{
		var params={};
		params["csize"]=this.strings_.fromNumber(this.downloadSizeFromCdn_);
		params["dsize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromPc_);
		params["tsize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromTv_);
		params["bsize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromBox_);
        params["msize"]=this.strings_.fromNumber(this.downloadSizeByRtmfpFromMobile_);
        params["dnode"]=this.avgRtmfpSessions_ < 0 ? "-1" : this.strings_.fromNumber(this.avgRtmfpSessions_);
        params["lnode"]=this.avgRtmfpNodes_ < 0 ? "-1" : this.strings_.fromNumber(this.avgRtmfpNodes_);
        params["dnode-cde"]=this.avgWebSocketSessions_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebSocketSessions_);
        params["lnode-cde"]=this.avgWebSocketNodes_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebSocketNodes_);
        params["dnode-rtc"]=this.avgWebSocketSessions_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebrtcSessions_);
        params["lnode-rtc"]=this.avgWebSocketNodes_ < 0 ? "-1" : this.strings_.fromNumber(this.avgWebrtcNodes_);
        params["gip"]=this.trackerServerIp_;
        params["gport"]=this.strings_.fromNumber(this.trackerServerPort_);
        params["rip"]=this.rtmfpServerIp_;
        params["rport"]=this.strings_.fromNumber(this.rtmfpServerPort_);
        params["gip"]=this.webrtcServerIp_;
        params["gport"]=this.strings_.fromNumber(this.webrtcServerPort_);
        params["up-rtmfp"]=this.strings_.fromNumber(this.uploadSizeByRtmfp_);
        params["up-cde"]=this.strings_.fromNumber(this.uploadSizeByWebsocket_);
        params["up-rtc"]=this.strings_.fromNumber(this.uploadSizeByWebrtc_);
        params["dsize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromPc_);
        params["tsize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromTv_);
        params["bsize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromBox_);
        params["msize-cde"]=this.strings_.fromNumber(this.downloadSizeByWebsocketFromMobile_);
        params["dsize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromPc_);
        params["tsize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromTv_);
        params["bsize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromBox_);
        params["msize-rtc"]=this.strings_.fromNumber(this.downloadSizeByWebrtcFromMobile_);
        params["chk0"]=this.strings_.fromNumber(this.checksumSuccessCount_);
        params["chk1"]=this.strings_.fromNumber(this.checksumErrorsByUnknown_);
        params["chk2"]=this.strings_.fromNumber(this.checksumErrorsByCdn_);
        params["chk3"]=this.strings_.fromNumber(this.checksumErrorsByRtmfp_);
        params["chk4"]=0;
        params["chk5"]=this.strings_.fromNumber(this.checksumErrorsByWebsocket_);
        params["lcsize"]=this.strings_.fromNumber(this.dropSizeByCdn_);
        params["lpsize"]=this.strings_.fromNumber(this.dropSizeByRtmfp_+this.dropSizeByWebrtc_+this.dropSizeByWebsocket_);
        return params;
	},

	updateSessions_ : function(client, protocolType, count) {
		var context = client.getContext_();
		if (this.nodesReset_) {
			this.tidyNodeAndSessions_();
			this.nodesReset_ = false;
		}

		this.updated_ = true;
		this.updateTime_ = this.global_.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.rtmfpSessionTimes_++;
			this.totalRtmfpSessions_ += count;
			this.avgRtmfpSessions_ = context.p2pRtmfpPeerId_ == "" ? -1 : (this.totalRtmfpSessions_ / this.rtmfpSessionTimes_);
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.webSocketSessionTimes_++;
			this.totalWebSocketSessions_ += count;
			this.avgWebSocketSessions_ = context.trackerServerConnectedTime_ <= 0 ? -1 : (this.totalWebSocketSessions_ / this.webSocketSessionTimes_);
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.webrtcSessionTimes_++;
			this.totalWebrtcSessions_ += count;
			this.avgWebrtcSessions_ = context.webrtcServerConnectedTime_ <= 0 ? -1 : (this.totalWebrtcSessions_ / this.webrtcSessionTimes_);
			break;
		default:
			break;
		}

		var nodeCount = 0;
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			nodeCount = context.rtmfpTotalNodeCount_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			nodeCount = context.websocketTotalNodeCount_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			nodeCount = context.webrtcTotalNodeCount_;
			break;
		default:
			break;
		}
		this.updateNodes_(client, protocolType, nodeCount);
	},

	updateNodes_ : function(client, protocolType, count) {
		this.updated_ = true;
		this.updateTime_ = this.global_.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.rtmfpNodeTimes_++;
			this.totalRtmfpNodes_ += count;
			this.avgRtmfpNodes_ = this.totalRtmfpNodes_ / this.rtmfpNodeTimes_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.webSocketNodeTimes_++;
			this.totalWebSocketNodes_ += count;
			this.avgWebSocketNodes_ = this.totalWebSocketNodes_ / this.webSocketNodeTimes_;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.webrtcNodeTimes_++;
			this.totalWebrtcNodes_ += count;
			this.avgWebrtcNodes_ = this.totalWebrtcNodes_ / this.webrtcNodeTimes_;
			break;
		default:
			break;
		}
	},

	addDownloadSize_ : function(client, protocolType, terminalType, size) {
		if (size <= 0) {
			return;
		}

		this.updated_ = true;
		this.updateTime_ = this.global_.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			this.downloadSizeFromCdn_ += size;
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.downloadSizeByRtmfp_ += size;
			switch (terminalType) {
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
				this.downloadSizeByRtmfpFromPc_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
				this.downloadSizeByRtmfpFromTv_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
				this.downloadSizeByRtmfpFromBox_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
				this.downloadSizeByRtmfpFromMobile_ += size;
				break;
			default:
				this.downloadSizeByRtmfpFromPc_ += size;
				break;
			}
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.downloadSizeByWebsocket_ += size;
			switch (terminalType) {
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
				this.downloadSizeByWebsocketFromPc_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
				this.downloadSizeByWebsocketFromTv_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
				this.downloadSizeByWebsocketFromBox_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
				this.downloadSizeByWebsocketFromMobile_ += size;
				break;
			default:
				this.downloadSizeByWebsocketFromPc_ += size;
				break;
			}
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.downloadSizeByWebrtc_ += size;
			switch (terminalType) {
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypePc:
				this.downloadSizeByWebrtcFromPc_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeTv:
				this.downloadSizeByWebrtcFromTv_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeBox:
				this.downloadSizeByWebrtcFromBox_ += size;
				break;
			case p2p$.com.webp2p.protocol.base.TERMINAL_TYPES.kTerminalTypeMobile:
				this.downloadSizeByWebrtcFromMobile_ += size;
				break;
			default:
				this.downloadSizeByWebrtcFromPc_ += size;
				break;
			}
			break;

		default:
			break;
		}
	},

	addUploadSize_ : function(client, protocolType, terminalType, size) {
		if (size <= 0) {
			return;
		}

		this.updated_ = true;
		this.updateTime_ = this.global_.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.uploadSizeByRtmfp_ += size;
			break;

		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.uploadSizeByWebsocket_ += size;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.uploadSizeByWebrtc_ += size;
			break;

		default:
			break;
		}
	},

	addChecksumErrors_ : function(client, protocolType, successCount, failedCount,size) {
		this.checksumSuccessCount_ += successCount;
		this.updateTime_ = this.global_.getMilliTime_();
		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			this.checksumErrorsByCdn_ += failedCount;
			this.dropSizeByCdn_+=size;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.checksumErrorsByRtmfp_ += failedCount;
			this.dropSizeByRtmfp_+=size;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.checksumErrorsByWebsocket_ += failedCount;
			this.dropSizeByWebsocket_+=size;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.checksumErrorsByWebrtc_ += failedCount;
			this.dropSizeByWebrtc_+=size;
			break;
		default:
			this.checksumErrorsByUnknown_ += failedCount;
			this.dropSizeByUnknown_+=size;
			break;
		}
	},

	flush : function(client, closed) {
		if (!this.updated_) {
			return;
		}
		this.tidy();
	},
	getAllStatus_ : function(result) {
		result["playing"] = this.playing_;
		result["downloadSizeFromCdn"] = this.downloadSizeFromCdn_;
		result["downloadSizeByRtmfp"] = this.downloadSizeByRtmfp_;
		result["downloadSizeByRtmfpFromPc"] = this.downloadSizeByRtmfpFromPc_;
		result["downloadSizeByRtmfpFromTv"] = this.downloadSizeByRtmfpFromTv_;
		result["downloadSizeByRtmfpFromBox"] = this.downloadSizeByRtmfpFromBox_;
		result["downloadSizeByRtmfpFromMobile"] = this.downloadSizeByRtmfpFromMobile_;
		result["downloadSizeByWebsocket"] = this.downloadSizeByWebsocket_;
		result["downloadSizeByWebsocketFromPc"] = this.downloadSizeByWebsocketFromPc_;
		result["downloadSizeByWebsocketFromTv"] = this.downloadSizeByWebsocketFromTv_;
		result["downloadSizeByWebsocketFromBox"] = this.downloadSizeByWebsocketFromBox_;
		result["downloadSizeByWebsocketFromMobile"] = this.downloadSizeByWebsocketFromMobile_;
		result["downloadSizeByWebrtc"] = this.downloadSizeByWebsocket_;
		result["downloadSizeByWebrtcFromPc"] = this.downloadSizeByWebrtcFromPc_;
		result["downloadSizeByWebrtcFromTv"] = this.downloadSizeByWebrtcFromTv_;
		result["downloadSizeByWebrtcFromBox"] = this.downloadSizeByWebrtcFromBox_;
		result["downloadSizeByWebrtcFromMobile"] = this.downloadSizeByWebrtcFromMobile_;

		result["avgRtmfpNodes"] = this.avgRtmfpNodes_;
		result["avgRtmfpSessions"] = this.avgRtmfpSessions_;
		result["avgWebSocketNodes"] = this.avgWebSocketNodes_;
		result["avgWebSocketSessions"] = this.avgWebSocketSessions_;
		result["avgWebrtcNodes"] = this.avgWebrtcNodes_;
		result["avgWebrtcSessions"] = this.avgWebrtcSessions_;

		result["totalRtmfpNodes"] = this.totalRtmfpNodes_;
		result["totalRtmfpSessions"] = this.totalRtmfpSessions_;
		result["totalWebSocketNodes"] = this.totalWebSocketNodes_;
		result["totalWebSocketSessions"] = this.totalWebSocketSessions_;
		result["totalWebrtcNodes"] = this.totalWebrtcNodes_;
		result["totalWebrtcSessions"] = this.totalWebrtcSessions_;

		result["rtmfpNodeTimes"] = this.rtmfpNodeTimes_;
		result["rtmfpSessionTimes"] = this.rtmfpSessionTimes_;
		result["webSocketNodeTimes"] = this.webSocketNodeTimes_;
		result["webSocketSessionTimes"] = this.webSocketSessionTimes_;
		result["webrtcNodeTimes"] = this.webrtcNodeTimes_;
		result["webrtcSessionTimes"] = this.webrtcSessionTimes_;

		result["uploadSizeByRtmfp"] = this.uploadSizeByRtmfp_;
		result["uploadSizeByWebsocket"] = this.uploadSizeByWebsocket_;
		result["uploadSizeByWebrtc"] = this.uploadSizeByWebrtc_;

		result["checksumSuccessCount"] = this.checksumSuccessCount_;
		result["checksumErrorsByCdn"] = this.checksumErrorsByCdn_;
		result["checksumErrorsByRtmfp"] = this.checksumErrorsByRtmfp_;
		result["checksumErrorsByWebsocket"] = this.checksumErrorsByWebsocket_;
		result["checksumErrorsByWebrtc"] = this.checksumErrorsByWebrtc_;
		result["checksumErrorsByUnknown"] = this.checksumErrorsByUnknown_;

		result["updated"] = this.updated_;
		result["nodesReset"] = this.nodesReset_;
		result["updateTime"] = this.updateTime_;
		result["lastFlushTime"] = this.lastFlushTime_;
	}
});

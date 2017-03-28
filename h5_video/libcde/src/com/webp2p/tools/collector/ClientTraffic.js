p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ClientTraffic = p2p$.com.webp2p.tools.collector.ClientBase.extend_({

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

	updated_ : false,
	nodesReset_ : false,
	updateTime_ : 0,
	lastFlushTime_ : 0,

	init : function() {
		this.trackerServerPort_ = 0;
		this.rtmfpServerPort_ = 0;

		this.updated_ = false;
		this.updateTime_ = 0;
		this.lastFlushTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

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

	toUrl_ : function(client, url) {
		var context = client.getContext_();
		this._super(client, url);
		var upnpStatus = 0;
		if (!context.protocolWebsocketDisabled_) {
			upnpStatus = context.upnpMapSuccess_ ? 1 : 2;
		}

		url.file_ = "/ClientTrafficInfo";
		url.params_.set("play", this.playing_ ? "1" : "0");
		url.params_.set("csize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeFromCdn_));
		url.params_.set("dsize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromPc_));
		url.params_.set("tsize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromTv_));
		url.params_.set("bsize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromBox_));
		url.params_.set("msize", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByRtmfpFromMobile_));
		url.params_.set("dnode", this.avgRtmfpSessions_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgRtmfpSessions_));
		url.params_.set("lnode", this.avgRtmfpNodes_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgRtmfpNodes_));
		url.params_.set("dnode-cde", this.avgWebSocketSessions_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebSocketSessions_));
		url.params_.set("lnode-cde", this.avgWebSocketNodes_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebSocketNodes_));
		url.params_.set("dnode-rtc", this.avgWebSocketSessions_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebrtcSessions_));
		url.params_.set("lnode-rtc", this.avgWebSocketNodes_ < 0 ? "-1" : p2p$.com.webp2p.core.common.String.fromNumber(this.avgWebrtcNodes_));
		url.params_.set("gip", this.trackerServerIp_);
		url.params_.set("gport", p2p$.com.webp2p.core.common.String.fromNumber(this.trackerServerPort_));
		url.params_.set("rip", this.rtmfpServerIp_);
		url.params_.set("rport", p2p$.com.webp2p.core.common.String.fromNumber(this.rtmfpServerPort_));

		url.params_.set("gip", this.webrtcServerIp_);
		url.params_.set("gport", p2p$.com.webp2p.core.common.String.fromNumber(this.webrtcServerPort_));
		// url.params_.set("stunip", this.stunServerIp_);
		// url.params_.set("stunport", p2p$.com.webp2p.core.common.String.fromNumber(this.stunServerPort_));

		url.params_.set("upnp", p2p$.com.webp2p.core.common.String.fromNumber(upnpStatus));
		url.params_.set("up-rtmfp", p2p$.com.webp2p.core.common.String.fromNumber(this.uploadSizeByRtmfp_));
		url.params_.set("up-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.uploadSizeByWebsocket_));
		url.params_.set("up-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.uploadSizeByWebrtc_));

		url.params_.set("dsize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromPc_));
		url.params_.set("tsize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromTv_));
		url.params_.set("bsize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromBox_));
		url.params_.set("msize-cde", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebsocketFromMobile_));

		url.params_.set("dsize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromPc_));
		url.params_.set("tsize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromTv_));
		url.params_.set("bsize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromBox_));
		url.params_.set("msize-rtc", p2p$.com.webp2p.core.common.String.fromNumber(this.downloadSizeByWebrtcFromMobile_));

		url.params_.set("chk0", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumSuccessCount_));
		url.params_.set("chk1", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByUnknown_));
		url.params_.set("chk2", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByCdn_));
		url.params_.set("chk3", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByRtmfp_));
		url.params_.set("chk4", "0");
		url.params_.set("chk5", p2p$.com.webp2p.core.common.String.fromNumber(this.checksumErrorsByWebsocket_));
	},

	updateSessions_ : function(client, protocolType, count, autoFlush) {
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}
		var context = client.getContext_();
		if (this.nodesReset_) {
			this.tidyNodeAndSessions_();
			this.nodesReset_ = false;
		}

		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
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

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	updateNodes_ : function(client, protocolType, count) {
		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
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

	addDownloadSize_ : function(client, protocolType, terminalType, size, autoFlush) {
		if (size <= 0) {
			return;
		}
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}

		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
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

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	addUploadSize_ : function(client, protocolType, terminalType, size, autoFlush) {
		if (size <= 0) {
			return;
		}
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}

		this.updated_ = true;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
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

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	addChecksumErrors_ : function(client, protocolType, successCount, failedCount, autoFlush) {
		this.checksumSuccessCount_ += successCount;
		this.updateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (typeof autoFlush == 'undefined') {
			autoFlush = true;
		}

		switch (protocolType) {
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeCdn:
			this.checksumErrorsByCdn_ += failedCount;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp:
			this.checksumErrorsByRtmfp_ += failedCount;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket:
			this.checksumErrorsByWebsocket_ += failedCount;
			break;
		case p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc:
			this.checksumErrorsByWebrtc_ += failedCount;
			break;
		default:
			this.checksumErrorsByUnknown_ += failedCount;
			break;
		}

		// if (autoFlush) {
		// this.flush(client, false);
		// }
	},

	flush : function(client, closed) {
		if (!this.updated_) {
			return;
		}
		client.sendClientTraffic_(this);
		// this.lastFlushTime_ = nowTime;
		this.tidy();
	}
});
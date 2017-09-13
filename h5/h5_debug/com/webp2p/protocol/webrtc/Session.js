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

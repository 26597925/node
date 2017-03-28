p2p$.ns('com.webp2p.protocol.websocket');

p2p$.com.webp2p.protocol.websocket.Session = p2p$.com.webp2p.protocol.base.Session.extend_({

	init : function(mgr, remoteId, remoteIp, remotePort) {
		this._super(mgr, remoteId);
		this.remoteIp_ = remoteIp;
		this.remotePort_ = remotePort;
		this.passive_ = false;
		this.remoteAddress_ = p2p$.com.webp2p.core.common.String.format("{0}:{1}", this.remoteIp_, this.remotePort_);
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
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol.webrtc.Session::open failed, exception: {0}", e));
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
			mgr.onWebSocketClose_(evt, me);
		};

		return true;
	},

	close : function() {
		this.websocket = null;
	},

	isActive_ : function() {
		if (this.passive_) {
			return false;// connection_.get() && connection_->isActive_();
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
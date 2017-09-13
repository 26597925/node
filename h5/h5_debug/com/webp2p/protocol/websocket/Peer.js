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

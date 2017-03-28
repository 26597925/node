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

	init : function(pool, evt) {
		this._super(pool, evt, p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc);
		this.peers_ = new p2p$.com.webp2p.core.common.Map();
		this.peerMaxConnectingTime_ = 100 * 1000;
		this.activeSessionCount_ = 0;
		this.webrtcRegisterEnabled_ = true;
		this.webrtcRegistered_ = false;
	},

	open : function() {
		this.close();
		this.opened_ = true;
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.id_ = p2p$.com.webp2p.core.common.String.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
				Math.floor(Math.random() * (1000 + 1)), p2p$.com.webp2p.core.common.Global.getMilliTime_());

		if (this.pool_.getContext_().p2pHeartbeatInterval_ > 0) {
			this.heartbeatInterval_ = this.pool_.getContext_().p2pHeartbeatInterval_;
		}

		this.queryFromWebrtcServer_();
		this.sessionTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 1 * 1000);
		return true;
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
	},

	onTimeout_ : function(tag, timer, errorCode) {
		// P2P_ULOG_ERROR(P2P_ULOG_FMT("timeout tag({0})",tag));
		// if( (timer != this.queryWebrtcServerTimer_))
		// {
		// return;
		// }
		switch (tag) {
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeTracker:
			onTimeout_();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeSession:
			this.onSessionTimeout_();
			break;
		case p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeAsyncPeers:
			onAsyncPeersTimeout();
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
		var version = p2p$.com.webp2p.core.common.String.format("{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
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
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Register timeout, try again ..."));
	},

	onHeartBeatTimeout_ : function() {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::HeartBeat timeout, try again ..."));
	},

	onQueryPeerListTimeout_ : function() {
		// P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Query peer list timeout, try again ..."));
		this.queryPeerList_();
	},

	queryFromWebrtcServer_ : function() {
		var _serverUrl = this.pool_.getContext_().webrtcServerHost_;
		this.websocket_ = new WebSocket(_serverUrl);

		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::open webrtc server ({0}) ...", this.pool_.getContext_().webrtcServerHost_));
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Start register webrtc server ({0}) ...", this.pool_.getContext_().webrtcServerHost_));
		this.registerWebrtcServer_();
	},

	onWebSocketClose_ : function(evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Close webrtc({0}) close ...", this.pool_.getContext_().webrtcServerHost_));
	},

	onWebSocketMessage_ : function(evt) {
		// var me = this;
		var message = JSON.parse(evt.data);
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
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::WebSocket proxy data response code: {0}", message.errorCode));
			break;

		default:
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::WebSocket unknown method: {0}", message.method));
			break;
		}
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
			localTime : p2p$.com.webp2p.core.common.Global.getMilliTime_()
		};
		var mst = p2p$.com.webp2p.protocol.webrtc.ManagerStatic;
		this.queryWebrtcServerTimer_ = this.setTimeout_(mst.kTimerTypeOnRegister, this.queryWebrtcServerTimer_, 5000);
		this.beginRegisterTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.sendMessage_(req);
	},

	onRegisterResponse_ : function(message) {
		if (message.errorCode !== 0) {
			// if register failed, waiting timeout for next registering
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Register response failed, errorCode({0})", message.errorCode));
			return;
		}
		// if register success, cancel timer
		if (this.queryWebrtcServerTimer_) {
			clearTimeout(this.queryWebrtcServerTimer_);
			this.queryWebrtcServerTimer_ = null;
		}
		this.pool_.getContext_().webrtcServerConnectedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_() - this.beginRegisterTime_;
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Register response success, peerid({0})", message.peerId));
		this.pool_.getContext_().p2pWebrtcPeerId_ = message.peerId;

		this.heartBeat_();
		this.queryPeerList_();
	},

	heartBeat_ : function() {
		// this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnHeartBeat, this.heartBeatTimer_, 5000);
	},

	queryPeerList_ : function() {
		var queryPeerListRequest = {
			method : "queryPeerListRequest",
			limit : 10
		};
		this.queryPeerListTimer_ = this.setTimeout_(p2p$.com.webp2p.protocol.webrtc.ManagerStatic.kTimerTypeOnQueryPeerList, this.queryPeerListTimer_,
				10 * 1000);
		this.sendMessage_(queryPeerListRequest);
	},

	onQueryPeerListResponse_ : function(message) {
		// if(this.queryPeerListTimer_)
		// {
		// clearTimeout(this.queryPeerListTimer_);
		// this.queryPeerListTimer_ = null;
		// }
		var peerResponseCount = 0;
		var newPeerCount = 0;
		var itemId = "";
		var _arr = message.items;
		if (_arr.length == 0) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Query peer list responsed, peerList.length = 0"));
		}
		for ( var i = 0; i < _arr.length; i++) {
			var peerItem = _arr[i];
			itemId = peerItem.peerId;
			// P2P_ULOG_TRACE("protocol::webrtc::Manager::Query peer list response, item: ", peerItem);
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

		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Query peer list successfully, load {0} peer(s), {1} peer(s) now, channel({2})",
				peerResponseCount, this.peers_.size(), this.pool_.getMetaData_().storageId_));
	},

	checkPeerSessions_ : function() {
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		var updatedPeerCount = 0;

		// clean connect failed peers
		for ( var n = 0; n < this.peers_.length; n++) {
			var elem = this.peers_.element(n);
			var peer = elem.value;
			if (!peer.isActive_(nowTime, this.peerMaxConnectingTime_) && (peer.totalConnectingTimes_ > 5 || peer.disconnectTimes_ > 3 || !peer.fromServer_)) {
				if (peer.session_ != null) {
					this.pool_.getContext_().webrtcTotalNodeCount_ = this.peers_.size();
					// this.eventListener_.onProtocolSessionClose_(peer.session_);
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
				// this.eventListener_.onProtocolSessionClose_(*peer->session_.get());
				peer.disconnect();
				updatedPeerCount++;
			} else {
				this.activeSessionCount_++;
			}
		}

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
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Remote peer unknown action: {0}", message.data.action));
			break;
		}
	},

	onRemotePeerConnectResponse_ : function(peerId, message) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Recveive a connect response from {0}", peerId));
		var itemId = peerId;
		var isFind = this.peers_.find(itemId);
		var info;
		if (!isFind) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::webrtc::Manager::Receive a connect response from {0}, but not in the peers", peerId));
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Manager::Receive a connect request from {0}", peerId));
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
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Send message channel({0}), msg:{1}", this.pool_.getMetaData_().storageId_, message));
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
	}
});
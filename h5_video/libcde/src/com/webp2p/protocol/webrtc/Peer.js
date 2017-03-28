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
	init : function(manager) {
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
			// only caller can use the new stunserver
			// callee's stunserver should be the same with caller's
			// callee can get the stunserver when it receive a connectRequest from caller
			var _iceUrl = this.manager_.getPool_().getContext_().stunServerHost_;
			this.iceServers_ = [ {
				url : _iceUrl + '?transport=udp'
			} ];
		}
		if (this.fromServer_) {
			this.connectionId_ = this.remoteId_ + "-active";
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer active Try to connect to remote peer({0})  ...,stunServer({1})", this.remoteId_,
					this.iceServers_[0].url));
		} else {
			this.connectionId_ = this.remoteId_ + "-passive";
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer passive Try to connect to remote peer({0})  ...,stunServer({1})", this.remoteId_,
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
				this.caller_.createOffer(function(description) {
					me.caller_.setLocalDescription(description);
					me.localSdpDescriptions_ = description.sdp;
				});
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
				});
			}
			this.lastConnectTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		} catch (e) {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::Open failed, exception: {0}", (e || "").toString()));
		}
	},

	onPeerOpen_ : function() {
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer::sendConnectRequest ({0}) Send connect request ", this.connectionId_));
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
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer::sendConnectResponse ({0}) Send connect response ", this.connectionId_));
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
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer::onPeerIceCandidate ({0}) Receive PeerIceCandidate:({1})", this.connectionId_,
					evt.candidate.candidate));
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
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::onPeerDataChannel ({0}) Receive PeerDataChannel,channel name({1})", this.connectionId_,
				evt.channel.label));
		this.dataChannel_ = evt.channel;
		this.setChannelEvents_(evt.channel);
	},
	onChannelOpen_ : function(channel, evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::webrtc::Peer::onChannelOpen ({0}) Channel open success!!!!!!!!!!!!!!", this.connectionId_));
		this.connecting_ = true;
		this.session_ = new p2p$.com.webp2p.protocol.webrtc.Session(this.manager_, this.remoteId_, this.dataChannel_, this.remoteIp_, this.remotePort_);
		this.session_.attchProperties_(this.properties_);
		this.manager_.getEventListener_().onProtocolSessionOpen_(this.session_);
	},

	onChannelMessage_ : function(channel, evt) {

		var _barry = new Uint8Array(evt.data);
		// 提取前4位，如果前4位为0则为数据开始，然后
		if (_barry[0] === 0 && _barry[1] === 0 && _barry[2] === 0 && _barry[3] === 0) {
			this.rData = new CdeByteArray();
			this.rData_len = _barry.length;
			this.rTotalData_len = (_barry[4] << 24) + (_barry[5] << 16) + (_barry[6] << 8) + _barry[7];
		} else {
			this.rData_len = this.rData_len + _barry.length;
		}
		this.rData.writeBytes(_barry);

		if (this.rData_len >= this.rTotalData_len) {
			this.rData_len = 0;
			this.rTotalData_len = 0;
			var message = p2p$.com.webp2p.protocol.webrtc.Packet.decode(this.rData.uInt8Array, this.manager_.getType());
			// console.log("protocol::webrtc::Peer::onChannelMessage_:",message);
			this.manager_.getEventListener_().onProtocolSessionMessage_(this.session_, message);

		} else {
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::onChannelMessage ({0}) Channel open part of the message", this.connectionId_));
		}
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
	},
	acceptAnswer_ : function(candidates, sdpDescriptions) {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::acceptAnswer ({0}) Accept answer ", this.connectionId_));
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
		P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Peer::disconnect ({0}) disconnect... ", this.connectionId_));

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
/**
 * http://usejsdoc.org/
 */
rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.Peer = JClass.extend_({
	config_:null,
	global_:null,
	strings_:null,
	peer_ : null,
	peerId_:null,
	remoteId_:null,
	id_ : null,
	fromServer_ : false,
	
	lastConnectTime_ : 0,
	context_ : null,

	localIceCandidates_ : null,
	localSdpDescriptions_ : null,

	remoteIceCandidates_ : null,
	remoteSdpDescriptions_ : null,

	iceOptions : null,
	sdpOptions : null,
	connecting_ : false,
	connectionId_:"",
	tag_:"com::relayCore::webrtc::Peer",

	init:function(_context)
	{
    	this.config_ = rc$.com.relayCore.vo.Config;
    	this.global_ = rc$.com.relayCore.utils.Global;
    	this.strings_ = rc$.com.relayCore.utils.String;
    	this.context_ = _context;
    	this.id_ = this.context_.id_;
		this.connecting_ = false;
		this.connectionId_ = "";
    	this.fromServer_ = false;
		this.lastConnectTime_ = 0;
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
	},
	load : function(_peerItem) {
		this.peerId_ = this.remoteId_ = _peerItem.remoteId;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0},load id({1}),remoteId({2})",this.tag_,this.id_,this.peerId_));
	},
	load2 : function(_message) {
		for ( var n = 0; n < _message.iceCandidates.length; n++) {
			var peerInfo_ = _message.iceCandidates[n];
			var candidate_ = peerInfo_.candidate;
			if (candidate_.indexOf("udp") != -1) {
				var datas_ = candidate_.split(" ");
				if (!this.remoteIp_) {
					this.remoteIp_ = datas_[4] || "0.0.0.0";
				}

				if (this.remoteIp_.indexOf(":") != -1) {
					continue;
				}
				if (!this.remotePort_) {
					this.remotePort_ = datas_[5] || "0";
				}

				if ((datas_[7] || "").indexOf("srflx") == -1) {
					continue;
				} else {
					this.remoteIp_ = datas_[4] || "0.0.0.0";
					this.remotePort_ = datas_[5] || "0";
				}
				break;
			}
		}
	},
	//创建rtc链接
	connect: function()
	{
		var iceUrl_ = this.config_.stunServerHost;
		this.iceServers_ = [ {
			url : iceUrl_ + '?transport=udp'
		} ];
		if (this.fromServer_) {
			this.connectionId_ = this.peerId_ + "-active";
		} else {
			this.connectionId_ = this.peerId_ + "-passive";
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0},caller({1}),stunServer({2})",this.tag_,this.fromServer_,this.iceServers_[0].url));
		try
		{
			this.peer_ = new RTCPeerConnection({
				iceServers : this.iceServers_
			}, this.iceOptions);
			this.setPeerEvents_(this.peer_);
			var scope_ = this;
			if (this.fromServer_) {
				// caller
			} else {
				// callee
				this.peer_.setRemoteDescription(new RTCSessionDescription({type : 'offer',sdp:this.remoteSdpDescriptions_}));
				this.peer_.createAnswer(function( description ){
					if(scope_.remoteIceCandidates) scope_.addPeerIceCandidates(scope_.remoteIceCandidates);
					scope_.peer_.setLocalDescription(description);
					scope_.localSdpDescriptions_ = description.sdp;
				}, 
				function( err ){
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createAnswer error",scope_.tag_));
				}, this.sdpOptions);
			}
			this.lastConnectTime_ = this.global_.getMilliTime_();
		}
		catch(e)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0} error({1})", this.tag_,(e || "").toString()));
		}
	},
	setPeerEvents_ : function(_peer) {
		var scope_ = this;
		_peer.onnegotiationneeded = function() {
			scope_.onPeerOpen_();
		};
		_peer.onicecandidate = function(evt) {
			scope_.onPeerIceCandidate_(evt);
		};
	},
	onPeerDataChannel_: function(_evt )
	{
	},
	onPeerOpen_: function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0},onPeerOpen,connectionId({1}),peerId({2})",this.tag_,this.connectionId_,this.peerId_));
		var scope_ = this;
		this.peer_.createOffer(function( description )
		{
			scope_.peer_.setLocalDescription(description);
			scope_.localSdpDescriptions_ = description.sdp;
		}, function( err )
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0},createOffer error",scope_.tag_));
		}, this.sdpOptions);
	},
	sendConnectRequest_: function()
	{
		if (this.localIceCandidates_.length < 1) {
			return;
		}

		var proxyData_ = {
			action : 'connectRequest',
			iceServers : this.iceServers_,
			iceCandidates : this.localIceCandidates_,
			sdpDescriptions : this.localSdpDescriptions_
		};
		
		this.status = true;
		this.context_.sendMessage_({
			method : 'proxyDataRequest',
			sendId:this.id_,
			destPeerId : this.remoteId_,
			peerId:this.peerId_,
			data : JSON.stringify(proxyData_)
		});
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectRequest connectionId({1}) Send connect request) ",this.tag_, this.connectionId_));
	},
	sendConnectResponse_ : function() {
		if (this.localIceCandidates_.length < 1) {
			return;
		}
		var proxyData_ = {
			action : 'connectResponse',
			iceCandidates : this.localIceCandidates_,
			sdpDescriptions : this.localSdpDescriptions_
		};
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendConnectResponse ({1})Send connect response",this.tag_, this.connectionId_));
		this.status = true;
		this.context_.sendMessage_({
			method : 'proxyDataRequest',
			sendId:this.id_,
			destPeerId : this.remoteId_,
			peerId:this.peerId_,
			data : JSON.stringify(proxyData_)
		});
	},
	addPeerIceCandidates_: function( _candidates )
	{
		if( Object.prototype.toString.call(_candidates) == '[object Array]' )
		{
			for( var i = 0; i < _candidates.length; i ++ )
			{
				this.peer_.addIceCandidate(new RTCIceCandidate(typeof(_candidates[i]) != 'string' ? _candidates[i] :
				{
					sdpMLineIndex: 0,
					sdpMid: 'data',
					candidate: _candidates[i]
				}));
			}
		}
		else
		{
			this.peer.addIceCandidate(new RTCIceCandidate(_candidates));
		}
	},
	acceptAnswer_ : function(_candidates, _sdpDescriptions) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::acceptAnswer ({1}) Accept answer",this.tag_, this.connectionId_));
		this.remoteIceCandidates_ = _candidates;
		this.remoteSdpDescriptions_ = _sdpDescriptions;
		this.peer_.setRemoteDescription(new RTCSessionDescription({
			type : 'answer',
			sdp : _sdpDescriptions
		}));
		this.addPeerIceCandidates_(_candidates);
	},
	onPeerIceCandidate_: function( _evt )
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerIceCandidate ({1}) Receive",this.tag_, this.connectionId_));
		if (_evt.candidate) {
			// both of caller and callee should save it first,waiting for switch candidate with Peer
			this.localIceCandidates_.push(_evt.candidate);
		} else {
			if (this.fromServer_) {
				this.sendConnectRequest_();
			} else {
				this.sendConnectResponse_();
			}
		}
	},
	
	clear:function()
	{
		this.config_=null;
		this.global_=null;
		this.strings_=null;
		this.peer_=null;
		this.peerId_=null;
		this.remoteId_=0;
		this.fromServer_=false;
		this.lastConnectTime_=0;
		this.manager_=null;

		this.localIceCandidates_=null;
		this.localSdpDescriptions_=null;

		this.remoteIceCandidates_=null;
		this.remoteSdpDescriptions_=null;

		this.iceOptions=null;
		this.sdpOptions=null;
		this.connectionId_="";
		this.id_ = "";
		this.connecting_=false;
		this.tag_="";
	}
});

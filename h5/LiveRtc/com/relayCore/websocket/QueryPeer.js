rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.QueryPeer = JClass.extend_({
	webrtcServerInterval_:5*1000,
	webrtcServerTimerId_ : -1,
	id_:null,
	webrtc_:null,
	manager_:null,
	global_:null,
	strings_:null,
	session_:null,
	config_:null,
	peers_:null,
	
	tag_:"com::relayCore::websocket::QueryPeer",

	init : function(_mgr) {
		this.manager_ = _mgr;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.peers_ = new rc$.com.relayCore.utils.Map();
	},
	bindSession_:function(_session)
	{ 
		this.session_ = _session;
		this.webrtc_ = this.manager_.getRtc();
		this.webrtc_.id_ = this.id_ = this.session_.id_;
	},
	onWebSocketOpen_ : function(_evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start register webrtc server ({1}) ...",this.tag_, _evt.target.url));
		this.register_();
	},
	onWebSocketMessage_ : function(_evt) {
		// var me = this;
		var message_ = JSON.parse(_evt.data);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onWebSocketMessage tag({1})",this.tag_, message_.method));
		switch (message_.method) {
		case 'registerRequest':
			this.onRegisterResponse_(message_);
			break;
		case 'proxyDataRequest':
			this.onProxyDataRequest_(message_);
			break;
		default:
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::WebSocket unknown method: {1}",this.tag_, message_.method));
			break;
		}
	},
	register_:function()
	{
		var req_ = {
				method : "registerRequest",
				channel:"chenzhaofei",
				id:this.id_,
				localTime : this.global_.getMilliTime_()
			};
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::register",this.tag_));
		
		var callback_ = this.onRegisterTimeout_.bind(this);
		this.webrtcServerTimerId_ = setTimeout(callback_, this.webrtcServerInterval_);
		this.webrtc_.beginRegisterTime_ = this.global_.getMilliTime_();
		this.sendMessage_(req_);
	},
	onRegisterResponse_ : function(_message) {
		var mid_ = _message.id;
		if(mid_ == this.id_)
		{
			if (this.webrtcServerTimerId_>0) {
				clearTimeout(this.webrtcServerTimerId_);
				this.webrtcServerTimerId_ = -1;
			}
			this.webrtc_.connectedTime_ = this.global_.getMilliTime_() - this.webrtc_.beginRegisterTime_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Register response success, peerid({1})",this.tag_, _message.id));
		}
		else
		{
			if(_message.channel=="chenzhaofei")
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::New Peer response success, peerid({1})",this.tag_, mid_));
				this.createPeer_(mid_);
			}
			
		}
	},
	createPeer_:function(_id)
	{
		var mypeer_ = new rc$.com.relayCore.websocket.Peer(this);
		mypeer_.fromServer_ = true;
		mypeer_.load({"id":this.id_,"remoteId":_id});
		mypeer_.connect();
		params_={
			id:this.id_,
			remoteId:_id,
			from:true,
			peer:mypeer_.peer_
		};
		this.peers_.set(params_.remoteId,mypeer_);
		this.manager_.controller_.addPeer(params_);
	},
	onProxyDataRequest_ : function(_message) {
		if (typeof (_message.data) == 'string') {
			_message.data = JSON.parse(_message.data);
		}
		var sid_ = _message.sendId;
		var destId_ = _message.destPeerId;
		var peerId_ = _message.peerId;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onProxyDataRequest selfId({1}),sendId({2}),connectionId({3}),peerId({4}))",this.tag_,this.id_,sid_,destId_,peerId_));
		if(sid_ != this.id_ && this.id_ == peerId_)//别人发的需要链接我
		{
			this.onRemotePeerConnectRequest_(sid_, _message.data);
		}
		else if(destId_ == this.id_ && peerId_ == sid_)
		{
			this.onRemotePeerConnectResponse_(sid_, _message.data);
		}
		return;
	},
/////测试
	onRemotePeerConnectRequest_ : function(_peerId, _message) {//当别人连接我时
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Receive a connect request from {1}",this.tag_, _peerId));
		var mypeer_;
		if(!this.peers_.find(_peerId))
		{
			mypeer_ = new rc$.com.relayCore.websocket.Peer(this);
		}
		else
		{
			mypeer_ = this.peers_.get(_peerId);
		}
		mypeer_.fromServer_ = false;
		mypeer_.load2(_message);
		mypeer_.id_ = this.id_;
		mypeer_.remoteId_ = _peerId;
		mypeer_.peerId_ = this.id_;
		mypeer_.iceServers_ = _message.iceServers;
		mypeer_.remoteIceCandidates_ = _message.iceCandidates;
		mypeer_.remoteSdpDescriptions_ = _message.sdpDescriptions;
		mypeer_.connect();
		params_={
				id:this.id_,
				remoteId:_peerId,
				from:false,
				peer:mypeer_.peer_
			};
		this.peers_.set(_peerId,mypeer_);
		this.manager_.controller_.addPeer(params_);
	},
	onRemotePeerConnectResponse_ : function(_peerId, _message) {
		var isFind_ = this.peers_.find(_peerId);
		var peer_;
		if (!isFind_) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Receive a connect response from {1}, but not in the peers",this.tag_, _peerId));
			return;
		} 
		peer_ = this.peers_.get(_peerId);
		peer_.load2(_message);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Recveive a connect response from {1}",this.tag_, _peerId));
		peer_.acceptAnswer_(_message.iceCandidates, _message.sdpDescriptions);
	},
	onRegisterTimeout_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onRegisterTimeout thisId({1}) 注册超时！",this.tag_,this.id_));
		clearTimeout(this.webrtcServerTimerId_);
		this.webrtcServerTimerId_ = -1;
	},
	close : function() {
		return true;
	},
	sendMessage_ : function(_message) {
		if (typeof (_message) != 'string') {
			_message = JSON.stringify(_message);
		}
		this.session_.send(_message);
		//P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::webrtc::Manager::Send message channel({0}), msg:{1}", this.pool_.getMetaData_().storageId_, message));
	}
});

rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.Manager = JClass.extend_({
	opened_ : false,
	id_:null,
	totalConut_:0,
	maxActiveSession_:10,
	beginRegisterTime_:0,
	connectedTime_:0,
	peerMaxConnectingTime_:100*1000,//最大死亡时间
	activeSessionCount_:0,//当前活跃节点数
	controller_:null,
	peers_ : null,
	global_:null,
	strings_:null,
	config_:null,
	broadcast_:null,
	
	tag_:"com::relayCore::webrtc::Manager",

	init : function(_controller) {
		this.peers_ = new rc$.com.relayCore.utils.Map();
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.controller_ = _controller;
	},

	open : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open 打开webrtp管理", this.tag_));
		this.opened_ = true;
		this.activeTime_ = this.global_.getMilliTime_();
//		this.sessionTimer_ = this.setTimeout_(rc$.com.relayCore.webrtc.ManagerStatic.kTimerTypeSession, this.sessionTimer_, 1 * 1000);
		return true;
	},
	addPeer:function(_params)
	{
		var isExit_ = this.peers_.find(_params.remoteId);
		if(!isExit_)
		{
			if (this.peers_.size() >= this.maxActiveSession_ * 2) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Peer is max, cancle",this.tag_));
				return;
			}
			var peer_ = new rc$.com.relayCore.webrtc.Peer(this,_params);
			this.peers_.set(_params.remoteId, peer_);
			this.broad_({type:"add",peer:peer_});
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addPeer, id({1})from({2})remote({3})size({4})",this.tag_,_params.id,_params.from,_params.remoteId,this.peers_.size()));
		}
	},
	////////
	removePeerById_:function(_peerId)
	{
		if(this.peers_.find(_peerId))
		{
			this.controller_.OnPeerClose_(_peerId);
			this.peers_.get(_peerId).clear();
			this.peers_.remove(_peerId);
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removePeerById close Peer({1}),peers({2})",this.tag_, _peerId,this.peers_.length));
			this.broad_({type:"remove",id:_peerId});
		}
	},
	getPeerById_:function(_id)
	{
		return this.peers_.get(_id);
	},
	getSSRCManager_:function()
	{
		return this.controller_.ssManager_;
	},
	broad_:function(_params)
	{
		if(this.broadcast_)
		{
			this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypePeer,data:_params});
		}
	},
	close_:function()
	{
		var el_;
		for(var i=0;i<this.peers_.length;i++)
		{
			el_ = this.peers_.elements_[i].value;
			el_.close();
		}
		this.peers_.clear();
	}
});

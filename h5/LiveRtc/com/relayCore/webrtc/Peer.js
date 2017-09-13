rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.PeerStatic = {
		kTimerTypeOnInit : 1
};
rc$.com.relayCore.webrtc.Peer = JClass.extend_({
	config_:null,
	global_:null,
	strings_:null,
	channel_:null,
	peer_ : null,
	peerId_:null,
	remoteId_ : 0,
	fromServer_ : false,
	manager_ : null,
	id_ : "",
	tag_:"com::relayCore::webrtc::Peer",
	
	
	init:function(_manager,_params)
	{
    	this.config_ = rc$.com.relayCore.vo.Config;
    	this.global_ = rc$.com.relayCore.utils.Global;
    	this.strings_ = rc$.com.relayCore.utils.String;
    	this.channel_ = new rc$.com.relayCore.webrtc.Channel(this);
    	this.manager_ = _manager;
    	this.id_ = _params.id;
    	this.fromServer_ = _params.from;
    	this.remoteId_ = _params.remoteId;
    	this.peer_ = _params.peer;
    	this.setPeerEvents_(this.peer_);
    	this.peerId_ = this.remoteId_;
    	if(this.fromServer_)
    	{
    		this.channel_.createChannel_({"name":"peerChannel","id":0});
    	}
	},
	setPeerEvents_ : function(_peer) {
		var scope_ = this;
		_peer.ondatachannel = function(evt) {
			scope_.onPeerDataChannel_(evt);
		};
	},
	onPeerDisconnet_:function()
	{
		this.manager_.removePeerById_(this.peerId_);
	},
	onPeerDataChannel_: function( _evt )
	{
		var channel_ = _evt.channel;
		//检查
		var isReject_ = false;
		if(channel_.id!=0)
		{
			var sid_ = channel_.label.split(":")[1];
			//检查是否存在该资源
			var myssrcs_ = this.manager_.getSSRCManager_().ssrcs_;
			var ssrcId_ = this.strings_.format("{0}:{1}",sid_,"relay");
			if(myssrcs_.find(ssrcId_))//存在relay级别服务
			{
				if(myssrcs_.get(ssrcId_).getMainChannelPeer_()==this.peerId_)
				{
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onPeerDataChannel 接收到Peer({1})存在(relay)主channel({2}),拒绝！",this.tag_, myssrcs_.get(ssrcId_).getMainChannelPeer_(),channel_.label));
					isReject_=true;
				}
			}
			else
			{
				ssrcId_ = this.strings_.format("{0}:{1}",sid_,"serving");
				if(myssrcs_.find(ssrcId_))//存在relay级别服务
				{
					if(myssrcs_.get(ssrcId_).getMainChannelPeer_()==this.peerId_)
					{
						P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onPeerDataChannel 接收到Peer({1})存在(serving)主channel({2}),拒绝！",this.tag_, myssrcs_.get(ssrcId_).getMainChannelPeer_(),channel_.label));
						isReject_=true;
					}
				}
			}
		}
		if(isReject_||(channel_.id>0&&channel_.label.indexOf("@SYNC")==-1))
		{
			channel_.close();
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onPeerDataChannel ({1}) Receive PeerDataChannel,channel name({2}),id({3})",this.tag_, this.remoteId_,channel_.label,channel_.id));
		this.channel_.createChannel_({"channel":channel_});
	},
	setTimeout_ : function(_tag, _timer, _milliSeconds) {
		var scope_ = this;
		_timer = setTimeout(function() {
			scope_.onTimeout_(_tag, _timer);
		}, _milliSeconds);
		return _timer;
	},
	onTimeout_ : function(_tag, _timer, _errorCode) {
		switch (_tag) {
		case rc$.com.relayCore.webrtc.PeerStatic.kTimerTypeOnInit:/*初始化超时*/
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::初始化信息交换超时，放弃通信", this.tag_));
			this.initTimer_ = null;
			//放弃通信
			this.closeChannel_(0);
			break;
		default:
			break;
		}
	},
	disconnect : function() {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::disconnect ({1}) disconnect... ", this.tag_,this.peerId_));
		this.channel_.close();
		if (this.peer_) {
			this.peer_.close();
			this.peer_ = null;
		}
		this.connecting_ = false;
	},
	updateSSRC_:function()
	{
		
	},
	clear:function()
	{
		this.config_=null;
		this.global_=null;
		this.strings_=null;
		if(this.channel_)
		{
			this.channel_.close_();
			this.channel_=null;
		}
		this.peer_=null;
		this.peerId_=null;
		this.remoteId_=0;
		this.fromServer_=false;
		this.manager_=null;
		this.id_ = "";
		this.tag_="";
	}
});

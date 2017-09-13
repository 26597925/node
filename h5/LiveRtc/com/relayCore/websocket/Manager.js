rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.ManagerStatic = {
	kTimerTypeTracker : 1,
	kTimerTypeSession : 2,
	kTimerTypeAsyncPeers : 3,
};

rc$.com.relayCore.websocket.Manager = JClass.extend_({
	config_:null,
	global_:null,
	strings_:null,
	opened_:false,
	activeTime_:0,
	id_:null,
	sessions_:null,
	trackerBeginQueryTime_:0,
	status:false,
	controller_:null,
	sessionId_:null,
	queryPeer_:null,
	broadcast_:null,
	tag_:"com::relayCore::websocket::Manager",

	init : function(_controller) {
		this.controller_ = _controller;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.sessions_ = new rc$.com.relayCore.utils.Map();
		this.queryPeer_ = new rc$.com.relayCore.websocket.QueryPeer(this);
		this.sessionId_ = [];
	},

	createSession : function(_sessionParams) {
		//创建本地webrtc-socket连接
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createSession params({1})", this.tag_,JSON.stringify(_sessionParams)));
		if(typeof(_sessionParams) == "object")
		{
			var session_;
			var sessionTag_;
			for(var i=0;i<_sessionParams.length;i++)
			{
				sessionTag_ = _sessionParams[i];
				if(this.sessions_.find(sessionTag_.name))
				{
					continue;
				}
				session_ = new rc$.com.relayCore.websocket.Session(this,sessionTag_.name);
				session_.open_(sessionTag_.url);
				if(sessionTag_.name=="webrtc")
				{
					this.config_.clientId = session_.id_;
					this.queryPeer_.bindSession_(session_);
					this.broad_({type:rc$.com.relayCore.broadcast.Types.RemoteID,data:session_.id_});
					session_.bind_(this.queryPeer_);
				}
				this.sessions_.set(sessionTag_.name,session_);
			}
		}
		return true;
	},
	getRtc:function()
	{
		return this.controller_.webrtc_;
	},
	getSessionByName:function(_name)
	{
		return this.sessions_.get(_name);
	},
	broad_:function(_message)
	{
		this.broadcast_.broad_(_message);
	},
	close : function() {
		this.opened_ = false;
		this.session_.close_();
	}
});

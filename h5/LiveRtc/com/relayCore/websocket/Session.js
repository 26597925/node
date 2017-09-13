rc$.ns("com.relayCore.websocket");
rc$.com.relayCore.websocket.ManagerStatic = {
		kTimerTypeTracker : 1,
		kTimerTypeSession : 2,
		kTimerTypeAsyncPeers : 3,
		kTimerTypeOnRegister : 100,
		kTimerTypeOnHeartBeat : 101,
		kTimerTypeOnQueryPeerList : 102
};
rc$.com.relayCore.websocket.Session = JClass.extend_({

	config_:null,
	strings_:null,
	global_:null,
	manager_:null,
	websocket:null,
	opened_:false,
	activeTime_:0,
	id_:null,
	status_:false,
	name_:"",
	
	onWebSocketOpenBinded_:null,
	onWebSocketCloseBinded_:null,
	onWebSocketMessageBinded_:null,
	onWebSocketErrorBinded_:null,
	
	tag_:"com::relayCore::webrtc::Session",
	uir_:null,
	
	init : function(_mgr,_name) {
		this.manager_ = _mgr;
		this.name_ = _name;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.id_ = this.strings_.format("{0}{1}{2}{3}", Math.floor(Math.random() * (1000 + 1)), Math.floor(Math.random() * (1000 + 1)),
				Math.floor(Math.random() * (1000 + 1)), this.global_.getMilliTime_());
	},

	send : function(_message) {
		this.activeTime_ = this.global_.getMilliTime_();
		this.websocket.send(_message);
	},

	open_ : function(_url,_type) {
		this.opened_ = true;
		this.activeTime_ = this.global_.getMilliTime_();
		this.uir = _url;
		if(_type)
		{
			this.uir = _url ;
		}
		try {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::open webSocket: {1}", this.tag_,this.uir));
			this.websocket = new WebSocket(this.uir);
		} catch (e) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::open failed, exception: {1}", this.tag_,e));
			return false;
		}
		this.bind_(this);
		return true;
	},
	bind_:function(_scope)
	{
		this.onWebSocketOpenBinded_ = _scope.onWebSocketOpen_.bind(_scope);
		this.onWebSocketMessageBinded_ = _scope.onWebSocketMessage_.bind(_scope);
		this.onWebSocketCloseBinded_ = this.onWebSocketClose_.bind(this);
		this.onWebSocketErrorBinded_ = this.onWebSocketError_.bind(this);
		this.websocket.onopen = this.onWebSocketOpenBinded_;
		this.websocket.onclose = this.onWebSocketCloseBinded_;
		this.websocket.onmessage = this.onWebSocketMessageBinded_;
		this.websocket.onerror = this.onWebSocketErrorBinded_;
	},
	onWebSocketOpen_ : function(_evt) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onWebSocketOpen", this.tag_));
		this.status_ = true;
		if(this.name_ == "peer")//获取本地源
		{
			
		}
	},
	onWebSocketMessage_ : function(_message) {
//		this.manager_.processMessage(name,_message);
		if(this.name_ == "peer")//处理app交换数据
		{
			
		}
	},
	onWebSocketClose_ : function(_evt) {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onWebSocketClose name({1})", this.tag_,this.name_));
		this.status_ = false;
		return true;
	},
	onWebSocketError_ : function(_evt) {
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onWebSocketError({1}), exception: {2}", this.tag_,this.name_,_evt.toString));
		this.status_ = false;
		return true;
	},
	close_ : function() {
		this.status_ = false;
		this.websocket.close();
		this.websocket = null;
	}
});

rc$.ns("com.relayCore.controller");
rc$.com.relayCore.controller.LMPN = JClass.extend_({
	config_:null,
	strings_:null,
	global_:null,
	webrtc_:null,
	socket_:null,
	ssManager_:null,
	statics_:null,
	//外部回调接口
	OnPeerClose:null,
	OnSSClose:null,
	OnTryResolveQuery:null,
	broadcast_:null,
	
	tag_:"com::relayCore::player::Live",
	live:null,
	
	init:function()
	{
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.statics_ = new rc$.com.relayCore.statics.Statics(this);
		if(arguments.length>0&&typeof(arguments[0]) == "object")
		{
			rc$.apply(this.config_,arguments[0]);
		}
		this.broadcast_.init_(this.config_.debugBarId);
		//日志输出设置
		rc$.com.relayCore.utils.Log.init(this.config_.logLevel, this.config_.logType, this.config_.logServer);
		//创建SSRC资源管理
		this.ssManager_ = new rc$.com.relayCore.ssrcs.Manager(this);
		//开启webrtc管理
		this.webrtc_ = new rc$.com.relayCore.webrtc.Manager(this);
		this.webrtc_.open();
		if(this.config_.auto)
		{
			//开启socket通道管理
			if(rc$.com.relayCore.websocket)
			{
				this.socket_ = new rc$.com.relayCore.websocket.Manager(this);
				this.socket_.createSession([{"name":"webrtc","url":this.config_.webrtcServerHost_}]);
			}
		}
	},
	syncSSRC:function(_data)
	{
		this.ssManager_.sycn(_data);
	},
	addPeer:function(_params)
	{
		this.webrtc_.addPeer(_params);
		this.broad_(_params.id);
	},
	//外部获取一个媒体流服务
	requetSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"serving",
				channel:_options.channel,
				callback:_options.callback,
				options:_options
		};
		if(!params_.channel)
		{
			params_.channel=this.config_.channel_;
		}
		//创建一个节点
		this.ssManager_.addSSRC_(params_);
	},
	stopRequetSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"serving",
				layer:_options.layer,
				channel:_options.channel,
				scope:_options
		};
		this.ssManager_.stopSSRC_(params_);
	},
	
	sourcingSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"sourcing",
				layer:_options.layer,
				channel:_options.channel,
				options:_options
		};
		this.ssManager_.addSSRC_(params_);
	},
	testSourcingSS:function(_params)
	{
		this.ssManager_.testSourcingSS_(_params);
	},
	stopSourcingSS:function(_options)
	{
		var params_={
				id:_options.id,
				level:"sourcing",
				layer:_options.layer,
				channel:_options.channel,
				scope:_options
		};
		this.ssManager_.stopSSRC_(params_);
	},
	OnPeerClose_:function(_value)
	{
		if(this.OnPeerClose != null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} OnPeerClose 通知外部Peer({1})断开",this.tag_,_value));
			this.OnPeerClose(_value);
		}
	},
	OnSSRCClose_:function(_value)
	{
		if(this.OnSSClose != null)
		{
			this.OnSSClose(_value);
		}
	},
	OnTryResolveQuery_:function(_value)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::OnTryResolveQuery_ ({1})重新获取新的外部数据", this.tag_,_value));
		if(this.OnTryResolveQuery != null)
		{
			this.OnTryResolveQuery(_value);
		}
	},
	broad_:function(_value)
	{
		if(this.broadcast_)
		{
			this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.RemoteID,data:_value});
		}
	}
});

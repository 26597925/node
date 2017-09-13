rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.MetaChannel = JClass.extend_({
	label_:null,//channel label
	id_:null,//唯一标示Id
	cid_:-1,//channel id
	level_:-1,
	from_:-1,
	layer_:-1,
	peerId_:null,
	
	activeTime_:0,
	createTime_:0,
	timestamp_:-1,
	seq_:-1,
	cachePacket_:null,//维护一个缓存消息
	channel_:null,
	context_:null,
	active_:false,
	interval_:5*1000,
	timerOutId_:-1,
	pingId_:-1,
	global_:null,
	strings_:null,
	config_:null,
	from_:-1,
	syncStatusId_:-1,
	syncStatusInterval_:300*1000,
	syncStatus_:67,
	sendSeqs_:null,//重传的序列号
	lossP_:0,//丢包
	
	unavailableTimes_:0,
	rsendTimes_:0,
	unavailableTimes_:0,
	route_:null,
	broadcast_:null,
	tag_:"com::relayCore::webrtc::MetaChannel",
	
	init:function(_context,_channel,_params)
	{
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.cachePacket_ = new rc$.com.relayCore.utils.Map();
		this.timerId_ = -1;
		this.pingId_ = -1;
		this.channel_ = _channel;
		this.context_ = _context;
		this.peerId_ = this.context_.context_.peerId_;
		this.from_ = this.context_.context_.fromServer_?0:1;
		this.label_ = this.channel_.label;
		var arr_ = this.label_.split(":");
		this.layer_ = arr_.length>2?Number(arr_[2]):0;
		this.cid_ = this.channel_.id;
		this.level_ = (this.from_+this.cid_)%2;
		if(this.label_.indexOf("@SYNC")>-1)
		{
			this.id_ = this.strings_.format("{0}:{1}:{2}", this.from_,this.peerId_, this.cid_);
		}
		this.active_ = true;
		this.route_ = _params.route,
		this.createTime_ = this.global_.getMilliTime_();
		this.sendSeqs_=[];
	},
	startPing_:function()
	{
		this.send_({type:"byte",data:{type:75}});
		this.startTimeout_();
	},
	startTimeout_:function()
	{
		this.stopTimeout_();
		if(this.temerOutId_ == -1)
		{
			var callback_ = this.timerOut_.bind(this);
			this.temerOutId_ = setTimeout(callback_,this.interval_);
		}
	},
	stopTimeout_:function()
	{
		if(this.temerOutId_ != -1)
		{
			clearTimeout(this.temerOutId_);
			this.temerOutId_ = -1;
		}
	},
	timerOut_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::timerOut_ Ping send Out! peerId({1}),channelId({2}),close channel",this.tag_, this.peerId_,this.channel_.id));
		this.active_ = false;
		this.close_();
	},
	respond_:function()
	{
		this.active_ = true;
		this.activeTime_ = this.global_.getMilliTime_();
		this.stopTimeout_();
		//等待一个时间计时继续发送Ping
		if(this.pingId_ != -1)
		{
			clearTimeout(this.pingId_);
		}
		this.pingId_ = setTimeout(this.startPing_.bind(this),this.interval_);
	},
	addUnavailbleTime_:function()
	{
		this.unavailableTimes_++;
		//发送一个状态
		this.send_({type:"byte",data:{type:this.syncStatus_}});
		//清除其他不可用的检测
		if(this.unavailableTimes_>this.config_.unavailableMaxTimes_)//超过阈值关闭
		{
			this.close_();
		}
	},
	updateStatus_:function(_value)
	{
		if(this.syncStatus_ != _value)
		{
			//开启关闭超时
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::updateStatus peerId({1}),status({2})->({3})",this.tag_, this.peerId_,this.syncStatus_,_value));
			if(this.syncStatusId_>0)
			{
				clearTimeout(this.syncStatusId_);
				this.closeId_ = -1;
			}
			this.syncStatus_ = _value;
			if(this.syncStatus_==67)
			{
				var callback_ = this.timerOut_.bind(this);
				this.syncStatusId_ = setTimeout(callback_,this.syncStatusInterval_)
			}
			this.broad_("syncStatus",this.syncStatus_);
			return true;
		}
		return false;
	},
	redoSend_:function(_data,_seq)
	{
		if(this.sendSeqs_.indexOf(_seq)>-1)
		{
			return;
		}
		P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})发现丢包seq({2}),发送N", this.tag_,this.channel_.label,_seq));
		this.sendSeqs_.push(_seq);
		this.send_(_data);
	},
	send_:function(_value)
	{
		var type_ = _value.type;
		var packet_=_value.data;
		var messageType_=0;
		switch(type_)
		{
		case "json":
			packet_ = JSON.stringify(_value.data);
			messageType_=0;
			break;
		case "byte":
			packet_ = this.context_.bytesPacket_.encode_(_value.data);
			messageType_=rc$.com.relayCore.utils.Number.convertToValue_('1', packet_,0);
			break;
		default:
			messageType_=rc$.com.relayCore.utils.Number.convertToValue_('1', _value.data,0);
				break;
		}
		this.broad_("send",messageType_);
		if(this.channel_.readyState == "closing")
		{
			return;
		}
		if(this.channel_.id>0&&this.channel_.label.indexOf("@SYNC")==-1)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::send_ peerId({1}),channelId({2)非法channel！",this.tag_, this.peerId_,this.channel_.id));
			this.close_();
			return;
		}
		try{
			this.channel_.send(packet_);
		}
		catch(e)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::send_ peerId({1}),channelId({2) fail({3})！",this.tag_, this.peerId_,this.channel_.id,e.toString()||""));
		}
		
	},
	getSYNC_:function()
	{
		var labelInfo_ = this.channel_.label.split(":");
		return this.context_.getSYNC_(labelInfo_[1]);
	},
	//更新和缓存消息
	updatePacket_:function(_message)
	{
		var type_ = _message.type;
		var cache_;
		if(this.cachePacket_.find(type_))
		{
			//更新
			cache_ = this.cachePacket_.get(type_);
			cache_.update_(_message);
			return;
		}
		cache_ = new rc$.com.relayCore.ssrcs.CacheData(this);
		cache_.update_(_message);
		this.cachePacket_.set(type_,cache_);
	},
	getActiveTime_:function()
	{
		return this.activeTime_-this.createTime_;
	},
	broad_:function(_type,_value)
	{
		this.broadcast_.channelMessage_(this.id_,_type,_value);
	},
	updateLossSEQ_:function(_rtt)
	{
		var rttb_ = this.context_.uRTT_;//副
		if(this.cachePacket_.find(72))//存在H
		{
			var Hb_ = this.cachePacket_.get(72);
			var ts_ = Hb_.timestamp_;
			var rtt_ = ts_-(rttb_-_rtt);
			this.seq_ = Hb_.getSEQ_(rtt_);
			if(this.seq_>-1)
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::updateLossSEQ 设置channel({1})的seq({2}),可能存在丢包！",this.tag_, this.channel_.label,this.seq_));
			}
		}
	},
	getH_:function(_seq)
	{
		if(!this.cachePacket_.find(72))
		{
			return null;
		}
		var Hb_ = this.cachePacket_.get(72);
		if(!_seq&&Hb_.data.find(Hb_.seq_))
		{
			return Hb_.data.get(Hb_.seq_);
		}
		return Hb_.data.get(_seq);
	},
	close_:function()
	{
		this.channel_.close();
		this.context_.removeChannel_(this.channel_);
	},
	clear_:function()
	{
		this.activeTime_=-1;
		this.createTime_=0;
		this.channel_=null;
		this.context_=null;
		this.route_=null;
		this.active_=false;
		this.interval_=-1;
		this.stopTimeout_();
		this.broadcast_=null;
		if(this.pingId_!=-1)
		{
			clearTimeout(this.pingId_);
		}
		if(this.syncStatusId_>0)
		{
			clearTimeout(this.syncStatusId_);
			this.closeId_ = -1;
		}
		this.global_=null;
	}
});

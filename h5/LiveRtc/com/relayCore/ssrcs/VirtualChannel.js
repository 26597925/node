rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.VirtualChannel = JClass.extend_({
	id_:null,//channelId
	label_:null,//channelLabel
	from_:0,//0serving,1soucing
	layer_:0,
	peerId_:"",
	cid_:1,
	callback_:null,
	level_:-1,
	context_:null,
	bytesPacket_:null,
	cachePacket_:null,
	lossP_:0,//丢包
	unavailableTimes_:0,
	
	syncStatusId_:-1,
	syncStatusInterval_:300*1000,
	syncStatus_:67,
	sendSeqs_:null,
	
	route_:null,
	broadcast_:null,
	tag_:"com::relayCore::ssrcs::VirtualChannel",
	init:function(_context,_params)
	{
		this.context_=_context;
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
		this.cachePacket_ = new rc$.com.relayCore.utils.Map();
		this.setParams_(_params);
		this.sendSeqs_=[];
		this.level_ = (this.from_+this.cid_)%2;
	},
	setParams_:function(_params)
	{
		for(var i in _params)
		{
			this[(i+"_")]=_params[i];
		}
	},
	onOpen_:function()
	{
		if(this.level_==0)
		{
			//需要求情Native获取数据 发送Q
			this.callback_ = this.context_.options.callback;
		}
		else
		{
			//等待数据
			this.syncStatus_ = 81;
			this.sendServingQ_();
		}
	},
	//serving
	sendServingQ_:function()
	{
		//需要求情Native获取数据 发送Q
		var ext_ = {};
		var packet_ = {type:81,ext:JSON.stringify(ext_)};
		var Qb_ = this.bytesPacket_.encode_(packet_);
		this.onMessage_(Qb_);
	},
	getSDP_:function()
	{
		//从layer获取U信息
		return "";
	},
	//重发丢包
	redoSend_:function(_data,_seq)
	{
		if(this.sendSeqs_.indexOf(_seq)>-1)
		{
			return;
		}
		P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})发现丢包seq({2}),发送N", this.tag_,this.label_,_seq));
		this.sendSeqs_.push(_seq);
		this.send_(_data);
	},
	//对外发送给APP
	send_:function(_value)
	{
		var type_ = _value.type;
		var packet_=_value.data;
		var messageType_=0;
		if(this.callback_)
		{
			switch(type_)
			{
			case "json":
				packet_ = JSON.stringify(_value.data);
				messageType_=0;
				break;
			case "byte":
				packet_ = this.context_.bytesPacket_.encode_(_value.data);
				messageType_=_value.data.type?_value.data.type:_value.data.status;
				break;
			default:
				messageType_=rc$.com.relayCore.utils.Number.convertToValue_('1', _value.data,0);
				break;
			}
			if(this.context_.config_.prints_.indexOf(messageType_)>-1)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0} ({1})layer({2})level({3})发送数据({4})给APP!",this.tag_,this.label_,this.layer_,this.level_,messageType_));
			}
			this.broad_("send",messageType_);
			this.callback_(packet_,this.layer_);
		}
	},
	getRoute_:function()
	{
		return {route:this.peerId,ttl:300*1000};
	},
	onMessage_:function(_message)//接收到数据
	{
		var type_ = rc$.com.relayCore.utils.Number.convertToValue_('1',new Uint8Array(_message),0);//获取消息类型
		this.broad_("receive",type_);
		this.context_.onStreamSync_({type:type_,channel:this,data:_message});
	},
	timerOut_:function()
	{
		this.active_ = false;
	},
	updateStatus_:function(_value)
	{
		if(this.syncStatus_ != _value)
		{
			//开启关闭超时
			if(this.syncStatusId_>0)
			{
				clearTimeout(this.syncStatusId_);
				this.closeId_ = -1;
			}
			this.syncStatus_ = _value;
			if(this.syncStatus_==67)
			{
				var callback_ = this.timerOut_.bind(this);
				this.syncStatusId_ = setTimeout(callback_,this.syncStatusInterval_);
			}
			this.broad_("syncStatus",this.syncStatus_);
		}
	},
	getSYNC_:function()
	{
		return this.label_.split(":")[1];
	},
	updateLossSEQ_:function(_rtt)
	{
		
	},
	updatePacket_:function(_message)
	{
	},
	broad_:function(_type,_value)
	{
		this.broadcast_.channelMessage_(this.id_,_type,_value);
	},
	addUnavailbleTime_:function()
	{
		this.unavailableTimes_++;
		//发送一个状态
		this.send_({type:"byte",data:{type:this.syncStatus_}});
		//清除其他不可用的检测
		if(this.unavailableTimes_>this.context_.config_.unavailableMaxTimes_)//超过阈值关闭
		{
			this.close_();
		}
	},
	getH_:function(_seq)
	{
		if(!this.cachePacket_.find(72))
		{
			return null;
		}
		var H_ = this.cachePacket_.get(72);
		if(!_seq&&H_.data.find(H_.seq_))
		{
			return H_.data.get(H_.seq_);
		}
		return H_.data.get(seq);
	},
	close_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} id({1}) close!",this.tag_,this.label_));
		if(this.syncStatusId_>0){clearTimeout(this.syncStatusId_);}
		this.context_.closeVirtualChannel_({label:this.id_,layer:this.layer_});
	}
});

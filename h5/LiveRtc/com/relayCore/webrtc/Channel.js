rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.PeerSSRCStatus = {
		UNKNOWN:0,
		KNOWN:1,
		UNSYNC:2
};
/**
 * 频道管理
 * 保存各种级别channel
 */
rc$.com.relayCore.webrtc.Channel = JClass.extend_({
	dataChannels_ : null,
	timestamp_:-1,
	context_:null,
	packet_:null,
	negPacket_:null,
	bytesPacket_:null,
	isHasNewNg_:false,//当前是否协商完后还有新的协商
	ngStatus_:false,//当前是否处在协商中
	ng_:0,//协商完成序列号
	lastPacket_:null,//最后一次交换信息数据
	initTimerOutId_:-1,//首次超时计时
	initTimerOutInterval_:30*1000,//首次超时计时
	ssrcTimerOutId_:-1,//ssrc同步超时标示
	ssrcTimerOutInterval_:30*1000,//ssrc同步超时时间
	remoteSSRCStatus_:0,//对端资源情况
	remoteOwned_:null,//保留对端Owned
	//保存数值
	uRTT_:0,
	uJitter_:0,
	uPackLossRate_:0,
	uSPC_:null,
	owned_:null,
	global_:null,
	strings_:null,
	mappedIds_:null,
	tag_:"com::relayCore::webrtc::Channel",
	
	init:function(_context)
	{
		this.context_ = _context;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.dataChannels_ = new rc$.com.relayCore.utils.Map();
		this.mappedIds_ = new rc$.com.relayCore.utils.Map();
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.packet_ = new rc$.com.relayCore.webrtc.PacketProcess(this);
		this.negPacket_ = new rc$.com.relayCore.webrtc.packets.NegPacket(this);
		this.remoteOwned_ = null;
		this.owned_ = [];
	},
	createChannel_:function(_params)
	{
		var dataChannel_;
		if(_params.channel)
		{
			dataChannel_ = _params.channel;
		}
		else
		{
			var dsp_ = {"ordered":false};
			dsp_.id = _params.id;
			try{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createChannel peerId({1})!",this.tag_,this.context_.peerId_));
				dataChannel_ = this.context_.peer_.createDataChannel(_params.name,dsp_);
			}
			catch(e)
			{
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::createChannel peerId({1})params({2})! error({3})",this.tag_,this.context_.peerId_,JSON.stringify(dsp_),e.toString()));
			}
		}
		if(!dataChannel_)
		{
			return null;
		}
		var metaChannel_ = new rc$.com.relayCore.webrtc.MetaChannel(this,dataChannel_,_params);
		this.dataChannels_.set(dataChannel_.id,metaChannel_);
		this.setChannelEvents_(dataChannel_);
		return dataChannel_;
	},
	setChannelEvents_ : function(_channel) {
		var scope_ = this;
		_channel.onopen = function(evt) {
			scope_.onChannelOpen_(evt);
		};
		_channel.onmessage = function(evt) {
			scope_.onChannelMessage_(evt);
		};
		_channel.onerror = function(evt) {
			scope_.onChannelError_(evt);
		};
		_channel.onclose = function(evt) {
			scope_.onChannelClose_(evt);
		};
	},
	//channel事件
	onChannelOpen_: function(_evt)
	{
		var channel_ = _evt.target;
		//打开数据发送心跳
		this.context_.connecting_ = true;
		var cid_ = channel_.id;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onChannelOpen peerId({1}) Channel({2}) open success!!!!!!!!!!!!!!", this.tag_,this.context_.peerId_,cid_));
		var metaChannel_ = this.dataChannels_.get(cid_);
		if(metaChannel_ == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onChannelOpen id({1}) metaChannel 不存在", this.tag_,cid_));
			return;
		}
		metaChannel_.startPing_();
		if(cid_ == 0)//初始化交换信息
		{
			this.sendNeg_();
			var callback_ = this.initTimeOut_.bind(this);
			this.initTimerOutId_ = setTimeout(callback_, this.initTimerOutInterval_);
			return;
		}
		this.context_.manager_.controller_.ssManager_.addChannel_(metaChannel_);
	},
	
	//自言关闭了，检查是否需要重新协商
	onSSRCUpdate_:function()
	{
		var myowned_ = this.getOwned_();
		if(this.strings_.compareTo_(JSON.stringify(myowned_),JSON.stringify(this.owned_))!=0)//对比资源
		{
			if(this.ngStatus_)//协商进行中。。。
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg 上一个协商还未完成，等待...", this.tag_,this.context_.peerId_));
				this.isHasNewNg_ = true;
				return;
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCUpdate peerId({1})资源发生变化！", this.tag_,this.context_.peerId_));
			this.sendNeg_(true);
		}
	},
	sendNeg_:function(_status)
	{
		if(_status)//资源变动，重新协商
		{
			this.negPacket_.status_ = 0;
			if(this.negPacket_.ngId_>0)
			{
				this.negPacket_.ngId_ = this.ng_+1;//重新协商序列号加1	
			}
			this.isHasNewNg_ = false;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg peerId({1}) 重新协商！", this.tag_,this.context_.peerId_));
		}
		this.ngStatus_ = true;
		var channel_ = this.dataChannels_.get(0);
		if(!channel_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendNeg peerId({1}) 节点已经断连！", this.tag_,this.context_.peerId_));
			return;
		}
		this.lastPacket_ = this.negPacket_.getPacket_();
//		console.log(this.lastPacket_);
		this.sendMessage_(this.lastPacket_,channel_);
	},
	onChannelMessage_: function(_evt)
	{
		//接收到数据
		var channel_ = _evt.target;
		var data_ = _evt.data;
		var cid_ = channel_.id;
		var metaChannel_ = this.dataChannels_.get(cid_);
		if(metaChannel_ == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onChannelMessage id({1}) metaChannel 不存在", this.tag_,cid_));
			return;
		}
		var dataType_ = typeof(data_);
		if(dataType_ == "string")
		{
			if(cid_ == 0)//协商层
			{
				metaChannel_.broad_("receive",0);
				this.ngStatus_ = true;
				if(this.initTimerOutId_ > 0)
				{
					clearTimeout(this.initTimerOutId_);
					this.initTimerOutId_ = -1;
				}
				var message_ = {type:"negotiation",data:data_};
				this.packet_.process_(message_);
				return;
			}
		}
		else
		{
			var stype_ = rc$.com.relayCore.utils.Number.convertToValue_('1',new Uint8Array(data_),0);
			metaChannel_.broad_("receive",stype_);
			switch(stype_)
			{
			case 75://K Ping包
				//返回响应包
				metaChannel_.send_({type:"byte",data:{type:107}});
				break;
			default:
				metaChannel_.respond_();
				this.context_.manager_.getSSRCManager_().receiveMessage_({type:stype_,channel:metaChannel_,data:new Uint8Array(data_)});
				break;
			}
		}
	},
	onChannelError_ : function(_evt) {
		this.removeChannel_(_evt.target);
	},

	onChannelClose_ : function(_evt) {
		//this.removeChannel_(_evt.target);
	},
	removeChannel_:function(_channel)
	{
		var cid_=_channel.id;
		if(this.dataChannels_.find(cid_)){
			var metaChannel_ = this.dataChannels_.get(cid_);
			this.dataChannels_.remove(cid_);
			//删除本地同步列表中的信息
			if(metaChannel_.label_.indexOf("@SYNC")>-1)//删除ssrc资源中dataChannel的信息
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel_ peer({1})删除资源频道({2})", this.tag_,this.context_.peerId_,metaChannel_.label_));
				this.context_.manager_.controller_.ssManager_.removeChannel_(metaChannel_);
			}
			metaChannel_.clear_();
//			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onChannelClose peer({1}) channelId({2}),channels({3})", this.tag_,this.context_.peerId_,id_,this.dataChannels_.length));
			if(this.dataChannels_.length == 0)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel_ peer({1})所有dataChannel关闭！该peer断连)", this.tag_,this.context_.peerId_));
				this.context_.onPeerDisconnet_();
			}
		}
	},
	initTimeOut_:function()
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::initTimeOut peer({1})初始化交换信息超时", this.tag_,this.context_.remoteId_));
	},
	closeChannelById_ : function(_id) {
		if(_id != null && this.dataChannels_.find(_id))
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::closeChannel channelId({1})", this.tag_,_id));
			var metaChannel_ = this.dataChannels_.get(_id);
			metaChannel_.close_();
		}
	},
	close_:function()
	{
		var el_;
		for(var i=0;i<this.dataChannels_.length;i++)
		{
			el_ = this.dataChannels_.element(i);
			el_.value.close_();
		}
		this.dataChannels_.clear();
		if(this.ssrcTimerOutId_>0)
		{
			clearInterval(this.ssrcTimerOutId_);
			this.ssrcTimerOutId_ = -1;
		}
	},
	sendMessage_:function(_message,_channel)
	{
		if(_channel == null)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::sendMessage metaChannel 不存在", this.tag_));
			return;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendMessage peerId({1}),NG({2})", this.tag_,_channel.peerId_,_message.Negotiate));
		try {
			_channel.send_({type:"json",data:_message});
		} catch (e) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::sendMessage_ failed, {1}",this.tag_, e.toString()));
		}
	},
	//本地资源列表
	getOwned_:function()
	{
		var myssrcs_ = this.context_.manager_.getSSRCManager_().ssrcs_;
		if(myssrcs_.length == 0)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getOwned, 当前还不存在任何媒体流",this.tag_));
			return [];
		}
		var owned_ = [];
		var ssrc_;
		var startMappedId_ = this.context_.fromServer_ ?1:2;
		var spc_,myroute_,routes_=[],rIndex_,index_=-1,ttl_,reject_,peerId_;
		for(var i=0;i<myssrcs_.length;i++)
		{
			rIndex_ = -1;
			ttl_ = -1;
			ssrc_ = myssrcs_.elements_[i].value;
			peerId_ = ssrc_.getMainChannelPeer_();
			spc_ = -1;
			switch(ssrc_.level)
			{
			case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
				spc_ = ssrc_.spc;
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
				spc_ = ssrc_.getSPC_(this.context_.peerId_);
				break;
			}
			if(spc_!=-1)
			{
				myroute_ = ssrc_.getRoute_();
				if(myroute_)
				{
					routes_.push(myroute_.route);
					index_++;
					rIndex_ = index_;
					ttl_ = myroute_.ttl;
				}
				if(this.mappedIds_.find(ssrc_.id))
				{
					mappedId_=this.mappedIds_.get(ssrc_.id);
				}
				else
				{
					//生成一个新的mappId
					mappedId_=this.mappedIds_.length*2+startMappedId_;
					this.mappedIds_.set(ssrc_.id,mappedId_);
				}
				var params = {
						id:ssrc_.id,
						channel:ssrc_.channel,
						mappedId:mappedId_,
						spc:spc_,
						layer:ssrc_.layer,
						routeIndex:rIndex_,
						routeTTL:ttl_,
						peerId:peerId_
						};
				if(!this.hasOwned_(owned_,params))
				{
					owned_.push(params);
				}
			}
		}
		//排序
		this.negPacket_.sortSSRC_(owned_);
		this.routes_ = routes_;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getOwned, 当前存在媒体流个数({1})",this.tag_,owned_.length));
		return owned_;
	},
	hasOwned_:function(_owned,_value)
	{
		var exit_=false;
		var tmp;
		for(var i=0;i<_owned.length;i++)
		{
			if(_owned[i].id == _value.id)
			{
				exit_ = true;
				break;
			}
		}
		return exit_;
	},
	//本地想同步资源
	getWanted_:function()
	{
		return [];
	},
	
	onNegOver_:function()
	{
		if(this.isHasNewNg_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1})有一个新的协商继续...", this.tag_,this.context_.peerId_));
			this.sendNeg_(true);
			return false;	
		}
		//对外广播
		this.broad_("neg",{"ng":this.ng_,"ngseq":this.negPacket_.ngId_});
		//开启资源同步定时,检查是否需要开启资源同步
		this.syncSSRC_();
//		this.ngStatus_ = false;
		if(this.ssrcTimerOutId_>0)
		{
			clearTimeout(this.ssrcTimerOutId_);
		}
		var callback_=this.checkSSRCStatus_.bind(this);
		this.ssrcTimerOutId_ = setTimeout(callback_,this.ssrcTimerOutInterval_);
	},
	///检查当前资源是否已经开始同步
	checkSSRCStatus_:function()
	{
		var unsynced_ = [];
		var ssrc_,id_;
		var syncing_ = this.getSyncStatus_();
		for(var i=0;i<this.negPacket_.synced_.length;i++)
		{
			ssrc_ = this.negPacket_.synced_[i];
			id_ = this.strings_.format("{0}:{1}",ssrc_.id,ssrc_.mappedId);
//			console.log(this.synced_.find(id_),id_);
			if(!syncing_.find(id_))
			{
				if(this.addToUnSync_(ssrc_))
				{
					unsynced_.push(ssrc_);
				}
			}
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkSSRCStatus, peerId({1})协商列表中有({2})个未进行同步的.",this.tag_,this.context_.peerId_,unsynced_.length));
		if(unsynced_.length>0)
		{
			//发起新的协商
			var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
			//关闭对应的Channel
			for(var i=0;i<unsynced_.length;i++)
			{
				var layerArr_ = unsynced_[i].layer?unsynced_[i].layer:[0];
				for(var j=0;j<layerArr_.length;j++)
				{
					id_ = layerArr_[j]*(1024/maxLayer_)+ssrc_.mappedId_;
					if(this.dataChannels_.find(id_))
					{
						this.closeChannelById_(id_);
					}
				}
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkSSRCStatus, peerId({1})协商列表中有未进行同步的SSRC({2}).",this.tag_,this.context_.peerId_,JSON.stringify(unsynced_)));
			this.negPacket_.ngId_++;//重新协商
			this.sendNeg_();
		}
	},
	//添加到非同步列表
	addToUnSync_:function(_ssrc)
	{
		var id_ = this.strings_.format("{0}:{1}",_ssrc.id,_ssrc.mappedId);
		var ssrc_ = this.negPacket_.getSync_(this.negPacket_.unsynced_,[_ssrc],false);
		if(ssrc_.length>0)
		{
			this.negPacket_.addunSync_(ssrc_);
			return true;
		}
		return false;
	},
	getSYNC_:function(_id)
	{
		var mysynced_ = this.negPacket_.synced_;
		for(var i=0;i<mysynced_.length;i++)
		{
			if(mysynced_[i].id == _id)
			{
				return mysynced_[i];
			}
		}
		return null;
	},
	syncSSRC_:function(_params)
	{
		var ssrc_,ssrcId_,level_,mappedId_,channelName_,channelId_,channel_,syncId_,ssrcFrom_;
		var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
		var mysynced_ = this.negPacket_.synced_;
		var from_ = this.context_.fromServer_?0:1;
		var myssrcs_ =this.context_.manager_.getSSRCManager_().ssrcs_;
		var syncing_ = this.getSyncStatus_();
		var route_,mainChannelId_;
		for(var i=0;i<mysynced_.length;i++)
		{
			if(_params&&mysynced_[i].id != _params.id)
			{
				continue;
			}
			mappedId_ = mysynced_[i].mappedId;
			level_ = (from_+mappedId_)%2;//0是已同步
			if(level_==1)
			{
				continue;
			}
			//如果Sourcing服务里存在维护的scps,则无需同步该流
			ssrcId_ = this.strings_.format("{0}:{1}",mysynced_[i].id,"sourcing");
			if(myssrcs_.find(ssrcId_))//存在sourcing级别的服务
			{
				ssrc_ = myssrcs_.get(ssrcId_);
				//判断该级别的spc中是否存在该spc
				if(ssrc_.spcs_.values().indexOf(mysynced_[i].spc)>-1)
				{
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncSSRC, SSRC({1})存在Sourcing级别的服务。不同步",this.tag_,JSON.stringify(mysynced_[i])));
					continue;
				}
			}
			//判断是不是已经同步该流
			syncId_ = this.strings_.format("{0}:{1}",mysynced_[i].id,mappedId_);
			if(syncing_.find(syncId_))
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncSSRC, peerId({1})SSRC({2})已经在同步中..",this.tag_,this.context_.peerId_,JSON.stringify(mysynced_[i])));
				continue;
			}
			//检测是否是发给对方的
			
			if(this.remoteOwned_)
			{
				for(var j=0;j<this.remoteOwned_.length;j++)
				{
					if(this.remoteOwned_[j].id==mysynced_[i].id&&this.remoteOwned_[j].mappedId==mysynced_[i].mappedId)
					{
						mainChannelId_ = this.remoteOwned_[j].peerId;
					}
				}
			}
			if(mainChannelId_==this.context_.id_)
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSync 拉流的Peer的主Channel为自己，不需要同步该SSRC({1})", this.tag_,JSON.stringify(mysynced_[i])));
				continue;
			}
			
			layerArr_ = [];
			if(typeof(mysynced_[i].layer)=="number")
			{
				for(var j=0;j<mysynced_[i].layer;j++)
				{
					layerArr_.push(j);
				}
			}
			else
			{
				layerArr_ = mysynced_[i].layer;
			}
			channelName_ = "@SYNC"+this.strings_.getRandom_();
			channelName_ += ":"+mysynced_[i].id;
			var tmp_ = channelName_;
			for(var j=0;j<layerArr_.length;j++)
			{
				channelId_ = layerArr_[j]*(1024/maxLayer_)+mappedId_;
				if(layerArr_[j]!=0)
				{
					tmp_ = channelName_ +":"+layerArr_[j];
				}
				route_ = this.negPacket_.getRoute_(mysynced_[i]);//从对端路由提取当前channel路由信息
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::syncSSRC, peerId({1})channel({2})id({3})同步中..",this.tag_,this.context_.peerId_,tmp_,channelId_));
				this.createChannel_({name:tmp_,id:channelId_,route:route_});
			}
		}
	},
	getSyncStatus_:function()
	{
		var syncs_ = new rc$.com.relayCore.utils.Map();
		var maxLayer_ = this.negPacket_.maxlayerCount_>0?this.negPacket_.maxlayerCount_:1;
		var arr_,label_,layer,mappedId_,syncId_,channel_,cid_;
		for(var i=0;i<this.dataChannels_.length;i++)
		{
			channel_ = this.dataChannels_.elements_[i].value;
			label_ = channel_.label_;
			layer_ = channel_.layer_;
			cid_ = channel_.cid_;
			if(label_.indexOf("@SYNC")>-1)//同步流频道
			{
				arr_ = label_.split(":");
				mappedId_ = cid_-layer_*(1024/maxLayer_);
				syncId_ = this.strings_.format("{0}:{1}",arr_[1],mappedId_);
				if(!syncs_.find(syncId_))
				{
					syncs_.set(syncId_,1);
				}
			}
		}
		return syncs_;
	},
	setU_:function(_value)
	{
		var pk_ = this.bytesPacket_.decode_(_value);
		var ext_;
		if(pk_.data.ext)
		{
			ext_ = JSON.parse(pk_.data.ext);
			for(var i in ext_)
			{
				switch(i)
				{
				case "PackLossRate":
					this.uPackLossRate_ = 1-(1-this.uPackLossRate_)*(1-ext_[i]);
					break;
				case "RTT":
					this.uRTT_ = ext_[i]+this.uRTT_;
					break;
				case "Jitter":
					this.uJitter_ = ext_[i];
				case "SPC":
					this.uSPC_=ext_[i];
				}
			}
		}
	},
	broad_:function(_key,_value)
	{
		if(this.context_.manager_.broadcast_)
		{
			this.context_.manager_.broadcast_.channelMessage_(this.context_.peerId_,_key,_value);
		}
	}
});

rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.SyncLevel={
	RELAY:"relay",
	SERVING:"serving",
	SOURCING:"sourcing"
};
rc$.com.relayCore.ssrcs.SSRC = JClass.extend_({
	id:null,
	channel:null,
	level:"relay",
	sdp:null,
	spc:null,
	callback:null,//回调方法
	options:null,//参数作用域
	layer:0,

	timestamp_:0,
	routeIndex_:-1,
	activeTime_:0,
	manager_:null,
	
	ssrcChannel_:null,//本资源channel管理
	
	spcs_:null,
	config_:null,
	layers_:null,
	global_:null,
	strings_:null,
	bytesPacket_:null,
	
	checkPacketId_:-1,
	checkPacketInterval:30*1000,
	virCloseInterval_:60*1000,
	virTimeoutId_:-1,
	sendCID_:-1,
	sendCInterval_:5*1000,
	checkSyncId_:-1,//sourcing级别使用
	checkSyncInterval_:30*1000,
	
//	checkServeLevelId_:-1,
//	checkServeLevelInterval_:300*1000,
	//每种级别维护的Channel数量
	relaysyncMin_:1,
	servingsyncMin_:3,
	sourcingunsyncMin_:2,
	
	
	tag_:"com::relayCore::ssrcs::SSRC",
	
	init:function(_mgr,_params)
	{
		this.level = rc$.com.relayCore.ssrcs.SyncLevel.RELAY;
		this.manager_ = _mgr;
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.config_ = rc$.com.relayCore.vo.Config;
		rc$.apply(this,_params);
		this.layers_ = new rc$.com.relayCore.utils.Map();
		this.spcs_ = new rc$.com.relayCore.utils.Map();
		this.ssrcChannel_ = this.manager_.getChannelById_(this.id);
		this.ssrcChannel_.registerMethod_({name:"onAdd",body:this.addChannel_.bind(this)});
		this.ssrcChannel_.registerMethod_({name:"onRemove",body:this.removeChannel_.bind(this)});
	},
	initializeServing_:function()
	{
		//创建虚拟通道
		var layers_ = [];
		if(typeof(this.layer)=="number")
		{
			for(var i=0;i<this.layer;i++)
			{
				layers_.push(i);
			}
		}
		else
		{
			layers_ = this.layer;
		}
		var layerChannel_,cid_,channel_,label_,metaChannel_,hasChannels_,params_,layer_,type_,arr_,channelId_;
		switch(this.level)
		{
		case "relay":
			for(var i=0;i<layers_.length;i++)//创建各层
			{
				layerChannel_ = this.createLayer_(layers_[i]);
			}
			//添加serving中已有channel
			hasChannels_=this.ssrcChannel_.getChannelByType_({type:"@SYNC"});
			for(var i=0;i<hasChannels_.length;i++)//添加所有已同步Channel的管理
			{
				metaChannel_ = this.ssrcChannel_.getChannelById_(hasChannels_[i]);
				this.addChannel_(metaChannel_);
			}
			break;
		case "serving":
			//创建虚拟通道
			for(var i=0;i<layers_.length;i++)
			{
				layerChannel_ = this.createLayer_(layers_[i]);
				this.getSPC_(this.id);//分配spc
				//创建一个虚的需同步channel
				cid_ = this.strings_.format("{0}:{1}:{2}",0,this.id,1+layers_[i]*2);
				label_ = this.strings_.format("@VIR:{0}:{1}",this.id,layers_[i]);
				if(layerChannel_.unsyncChannels_.indexOf(cid_)==-1)
				{
					channel_ = this.createVirtualChannel_({label:label_,peerId:this.id,from:0,cid:1+layers_[i]*2,id:cid_,layer:layers_[i],callback:this.callback});
					channel_.onOpen_();
				}
			}
			this.createLayer_(0);//0层必须创建
			//添加relay中已有channel
			hasChannels_=this.ssrcChannel_.getChannelByType_({level:0});
			for(var i=0;i<hasChannels_.length;i++)//添加所有已同步Channel的管理
			{
				metaChannel_ = this.ssrcChannel_.getChannelById_(hasChannels_[i]);
				this.addChannel_(metaChannel_);
			}
			break;
		case "sourcing":
			//创建一个虚的已同步channel
			//创建虚拟通道
			for(var i=0;i<layers_.length;i++)
			{
				cid_ = this.strings_.format("{0}:{1}:{2}",1,this.id,1+layers_[i]*2);
				label_ = this.strings_.format("@VIR:{0}:{1}",this.id,layers_[i]);
				layerChannel_ = this.createLayer_(layers_[i]);
				if(layerChannel_.syncChannels_.indexOf(cid_)==-1)
				{
					if(this.virTimeoutId_>0)
					{
						clearTimeout(this.virTimeoutId_);
					}
					params_={
							label:label_,
							peerId:"VIR",
							from:1,
							cid:1+layers_[i]*2,
							id:cid_,
							layer:layers_[i]
							};
					channel_ = this.createVirtualChannel_(params_);
					channel_.onOpen_();
					this.settingMainChannel_(channel_);
				}
			}
			this.options.send = this.messageFromApp_.bind(this);
			break;
		}
		//打开定期检查同步状况
		if(this.checkSyncId_>0){clearInterval(this.checkSyncId_);}
		this.checkSyncId_ = setInterval(this.checkSyncStatus_.bind(this),this.checkSyncInterval_);
	},
	//对外接口
	
	stop_:function(_params)
	{
		var mylayers_=this.layers_.keys();//所有层
		if(_params.hasOwnProperty("layer"))
		{
			if(typeof(_params.layer)=="number")
			{
				mylayers_=[];
				for(var i=0;i<_params.layer;i++)
				{
					mylayers_.push(i);
				}
			}
			else
			{
				mylayers_ = _params.layer;
			}
		}
		var cid_,channel_;
		for(var i=0;i<mylayers_.length;i++)
		{
			cid_ = this.strings_.format("{0}:{1}:{2}",_params.level=="serving"?0:1,this.id,1+mylayers_[i]*2);
			channel_ = this.ssrcChannel_.getChannelById_(cid_);
			if(channel_)
			{
				channel_.close_();
			}
		}
	},
	addChannel_:function(_channel)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel 添加level({1})Channel({2})",this.tag_,this.level,_channel.id_));
		var layerChannel_ = this.createLayer_(_channel.layer_);
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			if(_channel.label_.indexOf("@SYNC")>-1)
			{
				if(_channel.level_==0)//
				{
					layerChannel_.syncChannels_.push(_channel.id_);//添加到已同步维护列表
					this.settingMainChannel_(_channel);
				}
				else
				{
					layerChannel_.unsyncChannels_.push(_channel.id_);//添加到需同步维护列表
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			if(_channel.level_==0)
			{
				layerChannel_.syncChannels_.push(_channel.id_);//添加到已同步维护列表
				this.settingMainChannel_(_channel);
				//检查是否有VIR
//				if(_channel.label_.indexOf("@SYNC")>-1)//需要创建该层，并创建vir
//				{
					var virId_ = this.strings_.format("{0}:{1}:{2}",0,this.id,1+_channel.layer_*2);
					if(layerChannel_.unsyncChannels_.indexOf(virId_)==-1)
					{
						this.getSPC_(this.id);//分配spc
						label_ = this.strings_.format("@VIR:{0}:{1}",this.id,_channel.layer_);
						//创建一个虚的需同步channel
						var channel_ = this.createVirtualChannel_({label:label_,peerId:this.id,from:0,cid:1+_channel.layer_*2,id:virId_,layer:_channel.layer_,callback:this.callback});
						channel_.onOpen_();
					}
//				}
			}
			else
			{
				if(_channel.label_.indexOf("@VIR")>-1)
				{
					layerChannel_.unsyncChannels_.push(_channel.id_);//添加到需同步维护列表
				}	
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:/*维护两个以上需同步的dataChannel*/
			if(_channel.level_==1)
			{
				layerChannel_.unsyncChannels_.push(_channel.id_);//添加到需同步维护列表
			}
			else
			{ 
				if(_channel.label_.indexOf("@VIR")>-1)
				{
					layerChannel_.syncChannels_.push(_channel.id_);//添加到需同步维护列表
				}
			}
			
			break;
		}
		this.broad_({type:"add",id:_channel.id_});
		this.syncChannelStatus_(_channel.layer_);//更新已同步的状态
	},
	removeChannel_:function(_channel)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::removeChannel 删除level({1})Channel({2})",this.tag_,this.level,_channel.id_));
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			if(this.layers_.find(_channel.layer_))
			{
				if(_channel.level_==0)
				{
					this.layers_.get(_channel.layer_).syncChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_channel.layer_});
					this.settingMainChannel_(_channel);//更新主channel
					if(this.layers_.get(_channel.layer_).syncChannels_<this.relaysyncMin_)//维护频道低于需求
					{
						this.getMoreChannel_(_channel);
					}
					if(this.layers_.get(_channel.layer_).syncChannels_.length==0)//删除最后一个已同步的channel，则向所有需同步的channel发送C
					{
						var C_=this.getMessageByType_(67);
						if(this.sendCID_ > 0){clearInterval(this.sendCID_);}
						this.sendCID_ = setInterval(this.relayMessage_.bind(this),this.sendCInterval_,{layer:[0],level:1,data:C_});
					}
				}
				else
				{
					this.layers_.get(_channel.layer_).unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_channel.layer_});
					var unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1});
					this.syncChannelStatus_(_channel.layer_);//更新channel状态
//					var syncChannels_ = this.ssrcChannel_.getChannelByType_(0);
					if(unsyncChannels_.length==0)//待同步的channel已经全部关闭
					{
						this.onSSRCClose_();
					}
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			if(this.layers_.find(_channel.layer_))
			{
				if(_channel.level_==0)
				{
					this.layers_.get(_channel.layer_).syncChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_channel.layer_});
					this.settingMainChannel_(_channel);//更新主channel
					if(this.layers_.get(_channel.layer_).syncChannels_<this.servingsyncMin_)//维护频道低于需求
					{
						this.getMoreChannel_(_channel);
					}
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:/*维护两个以上需同步的dataChannel*/
			if(this.layers_.find(_channel.layer_))
			{
				if(_channel.level_==1)
				{
					this.layers_.get(_channel.layer_).unsyncChannels_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_channel.layer_});
					if(this.layers_.get(_channel.layer_).unsyncChannels_<this.sourcingunsyncMin_)//维护频道低于需求
					{
						this.getMoreChannel_(_channel);
					}
					var virtualChannels_ = this.ssrcChannel_.getChannelByType_({level:0,layer:_channel.layer_,type:"@VIR"});
					if(this.layers_.get(_channel.layer_).unsyncChannels_.length==0&&virtualChannels_.length==0)//虚通道关闭，并且需同步dataChannel都已关闭
					{
						this.onSSRCClose_();
					}
					this.syncChannelStatus_(_channel.layer_);//更新channel状态
				}
			}
			break;
		}
		this.broad_({type:"remove",id:_channel.id_});
	},
	getSPC_:function(_id)
	{
		if(this.spcs_.find(_id))
		{
			return this.spcs_.get(_id);
		}
		var spc_ = this.strings_.format("{0}-{1}-{2}",this.strings_.getRandom_(5),this.strings_.getRandom_(5),this.strings_.getRandom_(5));
		this.spcs_.set(_id,spc_);
		return spc_;
	},
	//虚通道
	createVirtualChannel_:function(_params)
	{
		var channel_ = this.ssrcChannel_.getChannelById_(_params.label);
		if(channel_)
		{
			return channel_;
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}createVirtualChannel 创建虚拟通道({1})",this.tag_,_params.label));
		channel_ = new rc$.com.relayCore.ssrcs.VirtualChannel(this,_params);
		this.manager_.addChannel_(channel_);
		return channel_;
//		this.virtualChannel_.set(params.label,virtual_);
		
	},
	closeVirtualChannel_:function(_params)
	{
		var channel_ = this.ssrcChannel_.getChannelById_(_params.label);
		if(channel_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::closeVirtualChannel_ 关闭虚拟通道({1})",this.tag_,_params.label));
			this.ssrcChannel_.removeChannel_(channel_);
			var layer_ = this.layers_.get(_params.layer);
			var sync_,index_,virtuals_;
			switch(this.level)
			{
			case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
				sync_ = layer_.unsyncChannels_;
				index_ = sync_.indexOf(_params.label);
				if(index_>-1)
				{
					sync_.splice(index_,1);
				}
				layer_.unsyncChannels_ = sync_;
				virtuals_ = this.ssrcChannel_.getChannelByType_({level:1,type:"@VIR"});
				if(virtuals_.length==0)//所有的虚拟通道关闭
				{
					this.onSSRCClose_();
				}
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
				//像需同步channel发送消息C
				sync_ = layer_.syncChannels_;
				index_ = sync_.indexOf(_params.label);
				if(index_>-1)
				{
					sync_.splice(index_,1);
				}
				layer_.syncChannels_ = sync_;
				virtuals_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@VIR"});
				if(virtuals_.length==0)//所有的虚拟通道关闭
				{
					var Cb_=this.getMessageByType_(67);
					if(this.sendCID_ > 0){clearInterval(this.sendCID_);}
					this.sendCID_ = setInterval(this.relayMessage_.bind(this),this.sendCInterval_,{layer:this.layers_.keys(),level:1,data:Cb_});
					//虚关闭定时
					if(this.virTimeoutId_>0)
					{
						clearTimeout(this.virTimeoutId_);
					}
					this.virTimeoutId_ = setTimeout(this.onSSRCClose_.bind(this),this.virCloseInterval_);
				}
				break;
			}
		}
	},
	//创建层
	createLayer_:function(_layer)
	{
		if(this.layers_.find(_layer))
		{
			return this.layers_.get(_layer);
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createLayer 创建新层({1})",this.tag_,_layer));
		var layerInfo_ = new rc$.com.relayCore.ssrcs.Layer(this,_layer);
		if(_layer==0){//0层开启检查
			layerInfo_.startCheck_();
		}
		this.layers_.set(_layer,layerInfo_);
		return layerInfo_;
	},
	//维护已同步channel状态
	updateChannelStatus_:function()
	{
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
			//定期发送媒体状态数据U
			break;
		}
	},
	//设置主channel_
	settingMainChannel_:function(_channel)
	{
		//设置一个主channel
		var mylayer_ = this.layers_.get(_channel.layer_);
		if(mylayer_.channelId_ == null)
		{
			//谁最先创建这个的SPC
			mylayer_.channelId_ = _channel.id_;
			//如果存在则保存路由信息
			mylayer_.route_ = this.getRoute_(_channel.layer_);
			return;
		}
		var mysyncChannels_=mylayer_.syncChannels_;
		
		if(mysyncChannels_.indexOf(_channel.id_)==-1)
		{
			mylayer_.channelId_ = null;
			var metaChannel_;
			for(var i=0;i<mysyncChannels_.length;i++)
			{
				metaChannel_ = this.ssrcChannel_.getChannelById_(mysyncChannels_[i]);
				if(metaChannel_)
				{
					if(metaChannel_.context_.uSPC_==this.spc)
					{
						mylayer_.channelId_ = mysyncChannels_[i];
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}openSycnChannel 更改主Channel({1})->({2})",this.tag_,mylayer_.channelId_,mysyncChannels_[i]));
						break;
					}
				}
			}
			if(mylayer_.channelId_==null)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}openSycnChannel 没有找到对应SPC({1})的channel做主Channel",this.tag_,this.spc));
			}
		}
		return;
	},
	messageFromApp_:function(_value,_layer)
	{
		var cid_ = this.strings_.format("{0}:{1}:{2}",1,this.id,1+Number(_layer)*2);
		var channel_ = this.ssrcChannel_.getChannelById_(cid_);
		if(!channel_)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::messageFromApp channel_({1})还没有创建！",this.tag_,cid_));
			return;
		}
		try{
            channel_.onMessage_(_value);
		}
		catch(e)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::messageFromApp channel_({1})数据处理错误（）！",this.tag_,cid_,e.toString()));
		}
	},
	//收到同步信息
	onStreamSync_:function(_params)
	{
		this.activeTime_ = this.global_.getMilliTime_();
		var mylevel_ = _params.channel.level_;//1需同步0已同步
		var mylayer_ = _params.channel.layer_;
		var layerStream_;
		//缓存数据
		if(!this.layers_.find(mylayer_))//如果该层不存在，需创建
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync 当前发送数据所在层({1})不存在！",this.tag_,mylayer_));
			return;
		}
		//判断channel类型
		var channelId_ = _params.channel.id_;//对应的ID
		var metaChannel_;
		var info_ = this.isMainChannel_(_params.channel);
		//更新层数据信息
		switch(mylevel_)
		{
		case 0://已同步
			switch(_params.type)
			{
			case 67://C
				//接收到消息的处理
				switch(info_.status)//主channel 接收到C，已同步 状态为T、Q 转发
				{
				case 67:
//					info_.channel.send_(this.getMessageByType_(67));
					break;
				case 81://Q转发到C->T,C->Q状态
					info_.channel.addUnavailbleTime_();//暂时不可用状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[81,84],data:_params.data});
					}
					break;
				case 84://T转发到C->T状态
					info_.channel.addUnavailbleTime_();//暂时不可用状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				}
				if(info_.channel.updateStatus_(67)){
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				break;
			case 72://H
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:_params.type,data:_params.data});//缓存最新H
				info_.channel.updatePacket_({type:_params.type,data:_params.data});//channel中缓存H
				info_.channel.updateLossSEQ_(this.getChannelRTT_(mylayer_));
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					info_.channel.send_(this.getMessageByType_(info_.status));
					break;
				case 81://Q相应Q转发到T状态
					var Qb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Qb_);
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				case 84://T不响应转发到T状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				}
				break;
			case 77://M
				var Mb_,oldts_=-1,sdpHash_;
				layerStream_ = this.layers_.get(0);
				Mb_ = layerStream_.cachePacket_.get(77);
				if(Mb_)
				{
					oldts_ = Mb_.timestamp_;
					sdpHash_ =Mb_.sdpHash_;
				}
				//缓存
				layerStream_.updatePacket_({type:_params.type,data:_params.data});
				Mb_ = layerStream_.cachePacket_.get(77);
//				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::onStreamSync_ {1}:{2}接到消息M)", this.tag_,this.id,this.level));
				if(oldts_>Mb_.timestamp_)
				{
					break;
				}
				var Ub_ = layerStream_.cachePacket_.get(85);
				if(Mb_.sdpHash_&&Ub_)
				{
					if(!Ub_.active_)
					{
						Ub_.check_(Mb_.sdpHash_);
					}
					else
					{
						if(sdpHash_&&this.strings_.compareTo_(sdpHash_,Mb_.sdpHash_)!=0)//校验发生变化
						{
							Ub_.active_ = false;
							P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息M。SDPHash变化，U失效 。label({1}),sdp({2})->({3})", this.tag_,_params.channel.label_,sdpHash_,payload_.SDPHash));
						}
					}
				}
				this.timestamp_ = Mb_.timestamp_;//更新时间戳
				
				//转发到所有需同步peer的layer0
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					var Cb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Cb_);
					break;
				case 81://Q相应转发到T,Q状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[81,84],data:_params.data});
					}
					break;
				case 84://T不响应转发到T状态
					if(info_.main)
					{
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:_params.data});
					}
					break;
				}
				break;
			case 80://P
				info_.channel.unavailbleTimes_=0;//不可用状态清零
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:_params.type,data:_params.data});//更新
//				P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::onStreamSync_ {1}:{2}接到消息P)", this.tag_,this.id,this.level));
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					var Cb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Cb_);
					break;
				case 81://Q不相应Q转发到H->T，P->Q
					//丢包情况1
					var Nb_;
					var loss_ = layerStream_.checkLoss_(_params.data);//检测丢包
					if(loss_.length>0)//出现新的丢包
					{
						for(var i=0;i<loss_.length;i++)
						{
							Nb_ = this.getMessageByType_(78,loss_[i]);
							info_.channel.redoSend_(Nb_,loss_[i].seq);
						}
					}
					////转发
					if(info_.main)
					{
						var Hb_ = layerStream_.getH_();
						if(Hb_)
						{
							this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:Hb_});
						}
						this.relayMessage_({layer:[mylayer_],level:1,status:[81],data:_params.data});
						break;
					}
					break;
				case 84://T响应T转发H->T
					info_.channel.updatePacket_({type:72,data:_params.data});//channel中缓存H
					info_.channel.updateLossSEQ_(this.getChannelRTT_(mylayer_));
					var Tb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Tb_);
					if(info_.main)
					{
						var Hb_ = layerStream_.getH_();
						this.relayMessage_({layer:[mylayer_],level:1,status:[84],data:Hb_});
					}
					break;
				}
				break;
			case 82://R
				break;
			case 85://U
				if(info_.channel&&info_.channel.label_.indexOf("@VIR")==-1)//解析数据，并保存到对应peer中
				{
					info_.channel.context_.setU_(_params.data);
				}
				///
				layerStream_ = this.layers_.get(0);
				var Ub_,use_=false;
				//U_计算规则
				switch(this.level)
				{
				case rc$.com.relayCore.ssrcs.SyncLevel.RELAY://转发和缓存U
					//更新对应channel的状态数据
					if(info_.main)//主channel
					{
						layerStream_.updatePacket_({type:85,data:_params.data});
						Ub_ = layerStream_.cachePacket_.get(85).data;
					}
					break;
				case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
					//该级别下任何channel的U都会独立进行更新和缓存
					info_.channel.updatePacket_({type:85,data:_params.data});
					
					//提取主Channel和副channel_
					var channels_ = layerStream_.syncChannels_;//所有管理已同步Channel;
					var Ub_,payload_,loss_=1,rtt_=0,jitter_,channel_,temp_;
					for(var i=0;i<channels_.length;i++)
					{
						metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
						if(metaChannel_)
						{
							loss_ = loss_*metaChannel_.context_.uPackLossRate_;
							jitter_ = Math.max((metaChannel_.context_.uRTT_+metaChannel_.context_.uJitter),jitter_);
							rtt_ = Math.max(metaChannel_.context_.uRTT,rtt_);
						}
					}
					Ub_ = this.bytesPacket_.decode_(_params.data).data;
					payload_ = JSON.parse(Ub_.payload);
					payload_.PackLossRate = 1-loss_;
					payload_.RTT = rtt_;
					payload_.Jitter = jitter_-rtt_;
					Ub_.payload_ = JSON.stringify(payload_);
					Ub_=this.bytesPacket_.encode_(Ub_);
					layerStream_.updatePacket_({type:85,data:Ub_});
					break;
				case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
					//转发到所有待同步Peer
					layerStream_.updatePacket_({type:85,data:_params.data});
					var Ub_ = this.bytesPacket_.decode_(_params.data);
					var payload_ = JSON.parse(Ub_.data.payload);
					var spc_,spcId_;
					for(var i=0;i<layerStream_.unsyncChannels_.length;i++)
					{
						metaChannel_ = this.ssrcChannel_.getChannelById_(layerStream_.unsyncChannels_[i]);
						if(metaChannel_)
						{
							
							spcId_ = metaChannel_.peerId_;
							if(metaChannel_.label_.indexOf("@VIR")==-1)
							{
								if(!this.spcs_.find(spcId_))
								{
									P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ channel({1})spc不存在", this.tag_,layerStream_.unsyncChannels_[i]));
									continue;
								}
								//获取该channel的spc
								spc_ = this.spcs_.get(spcId_);
								payload_.SPC = spc_;
								Ub_.data.payload = JSON.stringify(payload_);
							}
							metaChannel_.send_({type:"byte",data:Ub_.data});
						}
					}
					break;
				}
				//转发和相应规则
				switch(info_.status)//主channel 接收到H，已同步 状态为T、Q 转发
				{
				case 67://C响应C
					var Cb_ = this.getMessageByType_(info_.status);
					info_.channel.send_(Cb_);
					break;
				case 81://Q不相应Q转发到U->T，U->Q
					////转发
					if(info_.main)
					{
						this.relayMessage_({layer:[0],level:1,status:[81,84],data:Ub_});
					}
					break;
				case 84://T响应T转发U->T
					if(info_.main)
					{
						this.relayMessage_({layer:[0],level:1,status:[84],data:Ub_});
					}
					break;
				}
				break;
			}
			break;
		case 1://同步channel
			switch(_params.type)
			{
			case 67://C
				if(info_.channel.updateStatus_(67))
				{
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				break;
			case 78://N
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:78,data:_params.data});
				var Npackes_ = this.bytesPacket_.decode_(_params.data).data;
				var seq_ = Npackes_.seq;
				try{
					var Pb_ = this.layers_.get(mylayer_).getP_(seq_);
					if(!Pb_){
						P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,无法找到对应消息P，忽略", this.tag_));
						break;
					}
					var Pinfo_ = this.bytesPacket_.decode_(Pb_).data;
					if(Math.abs(Pinfo_.ts-Npackes_.ts)>1000)//超出一个回滚单位
					{
						P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,找到对应消息P，但是时间戳超出范围", this.tag_));
						break;
					}
					info_.channel.send_({type:"raw",data:Pb_});
				}
				catch(e)
				{
					P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync_ 接到消息N,error({1})", this.tag_,e||e.toString()));
				}
				break;
			case 81://Q
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})layer({3})接到消息Q", this.tag_,this.id,this.level,mylayer_));
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:81,data:_params.data});
				if(info_.channel.updateStatus_(81))
				{
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				if(info_.channel.label_.indexOf("@VIR")>-1){
					break;
				}
				var Qb_ = this.bytesPacket_.decode_(_params.data).data;
				var Pb_;
				var Mb_ = this.layers_.get(0).cachePacket_.get(77);//发送layer0中存在的M
				var Ub_ = this.layers_.get(0).cachePacket_.get(85);//发送layer0中存在的U
				var sendM_=false,sendU_=false;
				if(Mb_&&Mb_.isActive_()) {
                    sendM_ = true;
                    info_.channel.send_({type: "raw", data: Mb_.data});
                }
				if(mylayer_!=0)
				{
					Pb_ = layerStream_.getP_(Qb_.seq);
					if(Pb_) {
                        info_.channel.send_({type: "raw", data: Pb_});
                    }
                    //需要在0层发送
					var maxLayer_=info_.channel.context_.negPacket_.maxlayerCount_;
                    var layer0_ = this.layers_.get(0);
					var arr_=info_.id.split(":");
					var sourceMapId_ = Number(arr_[2])-mylayer_*(1024/maxLayer_);
					var layer0Id_ = this.strings_.format("{0}:{1}:{2}",arr_[0],arr_[1],sourceMapId_);
                    // P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})接到消息Q，发送U消息到({3})({4}){5}", this.tag_,this.id,this.level,layer0Id_,layer0_.unsyncChannels_,layer0_.unsyncChannels_.indexOf(layer0Id_)));
                    if(layer0_.unsyncChannels_.indexOf(layer0Id_)>-1) {
                        P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync_ ({1}):({2})接到消息Q，发送U消息到({3})", this.tag_,this.id,this.level,layer0Id_));
                        if(Ub_&&Ub_.isActive_()){//U且在有效期,在0层发送
                            sendU_ = true;
                            metaChannel_=this.ssrcChannel_.getChannelById_(layer0Id_);
                            if(metaChannel_) {
                                metaChannel_.send_({type: "raw", data: Ub_.data});
                            }
                        }
                    }
				}
				if((mylayer_==0&&sendM_&&sendU_)||(mylayer_!=0&&sendM_))//向已同步Peer转发Q
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync 发送了M({1})U({2})", this.tag_,sendM_,sendU_));
				}
				break;
			case 84://T
				layerStream_ = this.layers_.get(mylayer_);
				layerStream_.updatePacket_({type:84,data:_params.data});
				info_.channel.unavailbleTimes_=0;
				if(info_.channel.updateStatus_(84))
				{
					this.syncChannelStatus_(mylayer_);//更新已同步的状态
				}
				var Tb_ = this.bytesPacket_.decode_(_params.data).data;
				var Hb_ = layerStream_.getH_(Tb_.seq);//H是从P包转出来
				var Mb_ = this.layers_.get(0).cachePacket_.get(77);//发送layer0中存在的M
				var Ub_ = this.layers_.get(0).cachePacket_.get(85);//发送layer0中存在的U
				var sendM_=false,sendU_=false;
				if(Mb_&&Mb_.isActive_())
				{
					sendM_ = true;
					info_.channel.send_({type:"raw",data:Mb_.data});
				}
				if(mylayer_!=0)
				{
					if(Hb_)
					{
						info_.channel.send_({type:"raw",data:Hb_});
					}
					if(Ub_&&Ub_.isActive_()){//存在M，U且在有效期
						sendU_ = true;
						info_.channel.send_({type:"raw",data:Ub_.data});
					}
				}
				if((mylayer_==0&&sendM_&&sendU_)||(mylayer_!=0&&sendM_))//向已同步Peer转发Q
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onStreamSync 发送了M({1})U({2})", this.tag_,sendM_,sendU_));
				}
				break;
			}
			break;
		}
	},
	
	getChannelRTT_:function(_layer)
	{
		var layer_;
		if(!this.layers_.find(_layer))
		{
			return 0;
		}
		layer_ = this.layers_.get(_layer);
		var cid_ = layer_.channelId_;
		if(cid_==null)
		{
			return 0;
		}
		return this.ssrcChannel_.getChannelById_(cid_).context_.uRTT_;
	},
	syncChannelStatus_:function(_layer)
	{
	////计算channe的状态
		if(!this.layers_.find(_layer))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::syncChannelStatus layer({1})不存在，无法更新同步状态！", this.tag_,_layer));
			return;
		}
		var layerStream_ = this.layers_.get(_layer);
		if(layerStream_.unsyncChannels_.length>0)
		{
			//根据需同步的channel判断状态,应该从所有需同步中查，包括虚拟channel
			var hasT_=0;
			var hasC_=0;
			var hasQ_=0;
			var unsyncs_ = this.ssrcChannel_.getChannelByType_({level:1,layer:_layer});
			for(var i=0;i<unsyncs_.length;i++)
			{
				metaChannel_=this.ssrcChannel_.getChannelById_(unsyncs_[i]);
				if(metaChannel_)
				{
					if(metaChannel_.syncStatus_==67)
					{
						hasC_++;
					}
					else if(metaChannel_.syncStatus_==84)
					{
						hasT_++;
					}
					else if(metaChannel_.syncStatus_==81)
					{
						hasQ_++;
					}
				}
			}
			var mainsystatus_ = 0,secondarystatus_ = 0;
			if(hasQ_>0)
			{
				mainsystatus_ = 81;//主81，副84
				secondarystatus_ = 84;
			}
			else if(hasT_>0)//除了C就是T
			{
				mainsystatus_ = secondarystatus_ =  84;
			}
			else//都是C
			{
				mainsystatus_ = secondarystatus_ = 67;
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::syncChannelStatus layer({1})已同步状态变更C({2})Q({3})T({4}),sync({5})", this.tag_,_layer,hasC_,hasQ_,hasT_,layerStream_.syncChannels_.join(",")));
			if(layerStream_.syncChannels_.length>0)
			{
				var mainId_,systatus_;
				for(var i=0;i<layerStream_.syncChannels_.length;i++)
				{
					metaChannel_=this.ssrcChannel_.getChannelById_(layerStream_.syncChannels_[i]);
					if(metaChannel_)
					{			
						//是否主Channel
						if(layerStream_.syncChannels_[i]==layerStream_.channelId_)
						{
							systatus_ = mainsystatus_;
						}
						else
						{
							systatus_ = secondarystatus_;
						}
						if(systatus_>0&&systatus_!=metaChannel_.syncStatus_)//已同步dataChannel的同步状态发生转换时，Peer必须向对端发送一个此状态对应的消息
						{
							metaChannel_.updateStatus_(systatus_);//同步状态;
							metaChannel_.send_(this.getMessageByType_(systatus_));
						}
					}
				}
			}
		}
	},
	getMainChannelPeer_:function()
	{
		if(!this.layers_.find(0))
		{
			return null;
		}
		var layer_ = this.layers_.get(0);
		var channel_ = this.ssrcChannel_.getChannelById_(layer_.channelId_);
		if(channel_)
		{
			return channel_.peerId_;
		}
		return null;
	},
	//定期检查同步情况
	checkSyncStatus_:function()
	{
		var mylayer_,reload_ = false;
		for(var i=0;i<this.layers_.length;i++)
		{
			mylayer_ = this.layers_.elements_[i].key;
			switch(this.level)
			{
			case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
				if(this.layers_.get(mylayer_).syncChannels_<this.relaysyncMin_)//维护频道低于需求
				{
					reload_ = true;
					this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:0});
				}
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
				if(this.layers_.get(mylayer_).syncChannels_<this.servingsyncMin_)//维护频道低于需求
				{
					reload_ = true;
					this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:0});
				}
				break;
			case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING://维护两个以上需同步的dataChannel
				if(this.layers_.get(mylayer_).unsyncChannels_<this.sourcingunsyncMin_)//维护频道低于需求
				{
					reload_ = true;
					this.getMoreChannel_({id_:this.id,layer_:mylayer_,level_:1});
				}
				break;
			}
			if(reload_){break;}
		}
	},
	//获取更多资源
	getMoreChannel_:function(_params)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel ssrc({1}-{2})获取更多资源需求处理", this.tag_,this.id,this.level));
		//1.存在对应路由信息
		var mypeerId_,mypeer_,ssrcs_;
		var mylayer_ = this.layers_.get(_params.layer_);
		var mypeers_ = this.manager_.controller_.webrtc_.peers_;
		if(mylayer_&&mylayer_.route_)
		{
			//提取第一个节点
			var active_ = mylayer_.route_.rtt-(this.global_.getMilliTime_()-mylayer_.route_.start);
			if(active_>0)
			{
				var myroute_ = mylayer_.route_.route;
				if(route_)
				{
					mypeerId_ = myroute_.split("*")[0];
					if(mypeers_.find(mypeerId_))
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})满足需求1重新协商", this.tag_,mypeerId_));
						mypeers_.get(mypeerId_).channel_.sendNeg_(true);//重新协商
						return;
					}
				}
			}
		}
		//2.搜索Peer所维护的已知资源列表
		var hasPeers_ = this.ssrcChannel_.getChannelByType_({level:_params.level_,layer:_params.layer_});
		for(var i=0;i<mypeers_.length;i++)
		{
			mypeer_ = mypeers_.elements_[i].value;
			if(_params.type==0&&hasPeers_.indexOf(mypeer_.peerId_)==-1)//首先该资源不在当前列表中
			{
				ssrcs_ = mypeer_.channel_.remoteOwned_;//对方拥有列表中存在
				for(var j=0;j<ssrcs_.length;j++)
				{
					if(ssrcs_[j].id==this.id&&ssrcs_[j].peerId!=mypeer_.id_&&ssrcs_[j].peerId!=mypeer_.peerId_)//存在未同步的本资源信息，协商同步
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})level({2})满足需求2重新协商", this.tag_,mypeer_.peerId_,_params.level_));
						mypeer_.channel_.sendNeg_(true);//重新协商
						return;
					}
				}
			}
			if(_params.level_==1&&hasPeers_.indexOf(mypeer_.peerId_)==-1)//资源没有同步
			{
				//如果主channel不是对方的PeerID
				if(mypeer_.id!=this.getMainChannelPeer_())
				{
					P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getMoreChannel Peer({1})满足需求3重新协商", this.tag_,mypeer_.peerId_));
					mypeer_.channel_.sendNeg_(true);//重新协商
					return;
				}
			}
		}
		//3.
		this.manager_.controller_.OnTryResolveQuery_(this.id);
	},
	isMainChannel_:function(_channel)
	{
		var mainC_ = false;
		var layerid_ = this.layers_.get(_channel.layer_).channelId_;
		var status_ = _channel.syncStatus_;
		if(layerid_==null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::isMainChannel ssrc({1}-{2})layer({3})主Channel不存在", this.tag_,this.id,this.level,_channel.layer_));
		}
		if(layerid_==_channel.id_)
		{
			mainC_ = true;
		}
		return {level:_channel.level_,id:_channel.id_,status:status_,main:mainC_,channel:_channel};
	},
	//转发
	relayMessage_:function(_params)
	{
		var layerMax_ = _params.layer;
		for(var l=0;l<layerMax_.length;l++)
		{
			var mylayer_ = this.layers_.get(layerMax_[l]);
			var channelIds_ = _params.level == 0?mylayer_.syncChannels_:mylayer_.unsyncChannels_;
			if(channelIds_.length==0)
			{
				continue;
			}
			var metaChannel_,mysend_,status_,cid_;
			for(var i=0;i<channelIds_.length;i++)
			{
				cid_ = channelIds_[i];
				metaChannel_ = this.ssrcChannel_.dataChannels_.get(cid_);
				if(metaChannel_)
				{
					status_ = metaChannel_.syncStatus_;
					mysend_=false;
					if(_params.hasOwnProperty("status"))
					{
						for(var j=0;j<_params.status.length;j++)
						{
							if(status_==_params.status[j])
							{
								mysend_=true;
							}
						}
					}
					else
					{
						mysend_=true;
					}
					if(mysend_)
					{
						var type_ = rc$.com.relayCore.utils.Number.convertToValue_('1', _params.data, 0);
						if(this.config_.prints_.indexOf(type_)>-1)
						{
							P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::relayMessage ssrc({1}-{2}) level({3})转发消息({4})给({5})。", this.tag_,this.id,this.level,_params.level==0?"已同步":"需同步",type_,cid_));
						}
						metaChannel_.send_({type:"raw",data:_params.data});
					}
				}
			}
		}
	},
	onSSRCClose_:function()
	{
		var ssrc_,channels_,metaChannel_;
		switch(this.level)
		{
		case rc$.com.relayCore.ssrcs.SyncLevel.RELAY:
			//如果所有服务都关闭了，则关闭所有连接channel_
			ssrc_ = this.manager_.getSSRCById_({id:this.id,level:"serving"});
			if(!ssrc_)//不存在,关闭所有同步服务
			{
				channels_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@SYNC"});//关闭已同步频道
				//关闭频道
				for(var i=0;i<channels_.length;i++)
				{
					metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
					if(metaChannel_)
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCClose_ 关闭频道({1})！",this.tag_,channels_[i]));
						metaChannel_.close_();
					}
				}
				//在频道管理中删除该id
				if(this.manager_.channels_.find(this.id))
				{
					this.manager_.channels_.remove(this.id);
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SERVING:
			ssrc_ = this.manager_.getSSRCById_({id:this.id,level:"relay"});
			if(!ssrc_)//不存在,关闭所有同步服务
			{
				channels_ = this.ssrcChannel_.getChannelByType_({level:0,type:"@SYNC"});//关闭已同步频道
				//关闭频道
				for(var i=0;i<channels_.length;i++)
				{
					metaChannel_ = this.ssrcChannel_.getChannelById_(channels_[i]);
					if(metaChannel_)
					{
						P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onSSRCClose_ 关闭频道({1})！",this.tag_,channels_[i]));
						metaChannel_.close_();
					}
				}
				//在频道管理中删除该id
				if(this.manager_.channels_.find(this.id))
				{
					this.manager_.channels_.remove(this.id);
				}
			}
			break;
		case rc$.com.relayCore.ssrcs.SyncLevel.SOURCING:
			break;
		}
		this.manager_.closeSSRCById_({id:this.id,level:this.level});
	},
	checkPacket_:function()
	{
		var myactive_ = false;
		if(this.layers_.find(0))
		{
			var cache_ = this.layers_.get(0).cachePacket_;
			if(cache_)
			{
				var Mb_ = cache_.get(77);
				var Ub_ = cache_.get(85);
				if(Mb_&&Mb_.active_&&Ub_&&Ub_.active_)
				{
					myactive_ = true;
				}
			}
			if(!myactive_)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkPacket M或者U过期。发送Q ", this.tag_));
				var Qb_ = this.bytesPacket_.encode_({type:81});
				this.relayMessage_({layer:[0],level:0,data:Qb_});
			}
		}
	},
	getMessageByType_:function(_type,_params)
	{
		var data_={type:_type};
		if(_params)
		{
			rc$.apply(data_,_params);
		}
		switch(_type){
		case 72://H 媒体流数据包
			break;
		case 67://C 
			break;
		case 78://N
			break;
		case 80://P
			break;
		case 81://Q
			break;
		case 84://T
			break;
		case 77://M 媒体流元数据包，包含校验哈希值
			break;
		case 85://U 媒体状态数据
			break;
		case 82://R 媒体所在频道元数据
		}
		return {type:"byte",data:data_};
	},
	getRoute_:function(_layer)
	{
		//提取主0ceng CHannel的路由
		var cid_,routeInfo_,channel_;
		if(!_layer)
		{
			_layer = 0;
		}
		if(this.layers_.find(_layer))
		{
			cid_ = this.layers_.get(_layer).channelId_;
			if(!cid_)
			{
				P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::getRoute ssrc({1}:{2})layer(0)主channel不存在！", this.tag_,this.id,this.level));
				return null;
			}
			channel_ = this.ssrcChannel_.getChannelById_(cid_);
			if(!channel_)
			{
				return null;
			}
			if(channel_.label_.indexOf("@VIR")>-1)
			{
				routeInfo_ = channel_.getRoute_({id:this.id});
			}
			else
			{
				routeInfo_ = channel_.context_.negPacket_.getRoute_({id:this.id});
			}
			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::getRoute ssrc({1}:{2})路由信息({3})！", this.tag_,this.id,this.level,JSON.stringify(routeInfo_)));
		}
		return routeInfo_;
	},
	broad_:function()
	{
		if(this.id)
		{
			var id_ = this.strings_.format("{0}:{1}",this.id,this.level);
			this.manager_.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypeChannel,data:id_});
		}
	},
	
	close_:function()
	{
		this.id=null;
		this.channel=null;
		this.spc=null;
		this.level="";
		this.sdp=null;
		if(this.checkSyncId_>0){clearInterval(this.checkSyncId_);}
		if(this.checkPacketId_>0){clearInterval(this.checkPacketId_);}
		if(this.virTimeoutId_>0){clearTimeout(this.virTimeoutId_);}
		if(this.sendCID_>0){clearInterval(this.sendCID_);}
		this.timestamp_=0;
		this.routeIndex_=-1;
		this.activeTime_=-1;
		this.manager_=null;
		this.dataChannels_=null;
		this.sessionPeers_=null;
		this.layers_=null;
		this.global_=null;
		this.strings_=null;
	}
});

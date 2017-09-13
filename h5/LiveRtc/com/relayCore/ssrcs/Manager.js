rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.Manager = JClass.extend_({
	ssrcs_:null,
	channels_:null,
	config_:null,
	global_:null,
	controller_:null,
	broadcast_:null,
	strings_:null,
	
	tag_:"com:ssrcs::Manager",
	
	init:function(_controller)
	{
		this.controller_ = _controller;
		this.ssrcs_ = new rc$.com.relayCore.utils.Map();
		this.channels_ = new rc$.com.relayCore.utils.Map();
		this.config_ = rc$.com.relayCore.vo.Config;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.broadcast_ = rc$.com.relayCore.broadcast.BroadCast;
	},
	addSSRC_:function(_params)
	{
		if(!_params)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSSRC 添加资源错误",this.tag_));
			return null;
		}
		var ssrcId_ = this.strings_.format("{0}:{1}",_params.id,_params.level?_params.level:"relay");
		if(this.ssrcs_.find(ssrcId_))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::addSSRC 存在SSRC媒体流id({1})",this.tag_,ssrcId_));
			return this.ssrcs_.get(ssrcId_);
		}
		//创建资源channel管理
		if(!this.channels_.find(_params.id))
		{
			var channel_ = new rc$.com.relayCore.ssrcs.Channel(this);
			this.channels_.set(_params.id,channel_);
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSSRC 添加新的ChannelMap id({1})",this.tag_,_params.id));
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSSRC 添加新的SSRC媒体流 id({1})",this.tag_,ssrcId_));
		var ssrc_ = new rc$.com.relayCore.ssrcs.SSRC(this,_params);
		this.ssrcs_.set(ssrcId_,ssrc_);
		ssrc_.initializeServing_();
		this.broad_({type:"add",ssrc:ssrc_});
		if(_params.level!="relay")
		{
			this.onSSRCUpdate_();
		}
		return ssrc_;
	},
	stopSSRC_:function(_params)
	{
		var id_ = this.strings_.format("{0}:{1}",_params.id,_params.level);
		if(this.ssrcs_.find(id_))
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0} stopSSRC 停止SSRC({1})！",this.tag_,id_));
			var ssrc_ = this.ssrcs_.get(id_);
			ssrc_.stop_(_params);
		}
	},
	addChannel_:function(_channel)
	{
		var mylabel_ = _channel.label_;
		var ssrcId_ = mylabel_.split(":")[1];
		var ssrcR_;
		var sourcing_ = this.strings_.format("{0}:{1}",ssrcId_,"sourcing");
		var relay_ = this.strings_.format("{0}:{1}",ssrcId_,"relay");
		if(!this.channels_.find(ssrcId_)||(mylabel_.indexOf("@SYNC")>-1&&_channel.level_==1&&this.ssrcs_.find(sourcing_)&&this.ssrcs_.find(relay_)))
		{
			//创建资源
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel 频道所在ssrc({1})不存在！创建relay级别资源",this.tag_,_channel.id_));
			var ssrc_ = _channel.getSYNC_();
			var ssrcparams_ = {};
			rc$.apply(ssrcparams_,ssrc_);
			ssrcparams_.level="relay";
			//并把当前channel设为主channel
			ssrcR_ = this.addSSRC_(ssrc_);
			if(ssrcR_==null)
			{
				return;
			}
		}
		var channel_ = this.channels_.get(ssrcId_);
		channel_.addChannel_(_channel);
		if(ssrcR_!=null)
		{
			this.onSSRCUpdate_();
		}
	},
	removeChannel_:function(_channel)
	{
		var ssrcId_ = _channel.label_.split(":")[1];
		if(!this.channels_.find(ssrcId_))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::removeChannel 删除频道Channel({1})不存在！",this.tag_,ssrcId_));
			return;
		}
		var channel_ = this.channels_.get(ssrcId_);
		channel_.removeChannel_(_channel);
	},
	testSourcingSS_:function(_params)
	{
		var ssrcId_ = _params.id;
		var type_ = Number(_params.type);
		var message_ = _params.message;
		var sid_ = this.strings_.format("{0}:{1}",_params.id,"sourcing");
		if(!this.ssrcs_.find(sid_))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::testSourcingSS SSRC({1})不存在！",this.tag_,sid_));
			return;
		}
		var layer_ = 1+message_.layer*2;
		var vid_ = this.strings_.format("{0}:{1}:{2}",1,_params.id,layer_);
		var channel_ = this.channels_.get(ssrcId_).getChannelById_(vid_);
		if(!channel_)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::testSourcingSS 虚拟频道({1})不存在！",this.tag_,vid_));
			return;
		}
		var params_;
		if(type_==80)
		{
			params_ ={
					type:type_,
					ts:message_.ts?message_.ts:0,
					seq:message_.seq?message_.seq:0,
					payload:message_.payload?message_.payload:0,
			};
		}
		else
		{
			params_ ={
					type:type_,
					Layers:message_.layer?message_.layer:0
			};
		}
		var data_ = rc$.com.relayCore.webrtc.packets.BytesPacket.encode_(params_);
		channel_.onMessage_(data_);
	},
	getChannelById_:function(_id)
	{
		if(!this.channels_.find(_id))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getChannelById 请求ssrc({1})dataChannel不存在！",this.tag_,_id));
			return null;
		}
		return this.channels_.get(_id);
	},
	getSSRCById_:function(_params)
	{
		var id_ = this.strings_.format("{0}:{1}",_params.id,_params.level);
		return this.ssrcs_.get(id_);
	},
	closeSSRCById_:function(_params)
	{
		var id_ = this.strings_.format("{0}:{1}",_params.id,_params.level);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} closeSSRCById 关闭SSRC({1})！",this.tag_,id_));
		if(this.ssrcs_.find(id_))
		{
			var ssrc_ = this.ssrcs_.get(id_);
			ssrc_.close_();
			this.ssrcs_.remove(id_);
			this.onSSRCUpdate_();//通知SSRC更新了
			this.controller_.OnSSRCClose_(_params);//通知外部某个资源关闭了
			this.broad_({type:"remove",id:id_});
		}
	},
	receiveMessage_:function(_params)
	{
		var labelInfo_ = _params.channel.label_.split(":");
		var ssrcId_ = labelInfo_[1];
		var level_ = "";
		var id_;
		for(var i in rc$.com.relayCore.ssrcs.SyncLevel)
		{
			level_ = rc$.com.relayCore.ssrcs.SyncLevel[i];
			id_=this.strings_.format("{0}:{1}",ssrcId_,level_);
			if(this.ssrcs_.find(id_))
			{
				this.ssrcs_.get(id_).onStreamSync_(_params);
			}
		}
	},
	onSSRCUpdate_:function()
	{
		var mypeers_ = this.controller_.webrtc_.peers_;
		var peer_;
		for(var i=0;i<mypeers_.length;i++)
		{
			peer_ = mypeers_.elements_[i].value;
			peer_.channel_.onSSRCUpdate_();
		}
	},
	broad_:function(_params)
	{
		this.broadcast_.broad_({type:rc$.com.relayCore.broadcast.Types.TypeSSRC,data:_params});
	}
});

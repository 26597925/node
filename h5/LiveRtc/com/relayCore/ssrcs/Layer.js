rc$.ns("com.relayCore.ssrcs");
rc$.com.relayCore.ssrcs.Layer = JClass.extend_({
	context_:null,
	layer_:-1,
	cachePacket_:null,//维护一个缓存消息
	channelId_:null,
	route_:null,
	syncChannels_:null,//维护已同步的channel
	unsyncChannels_:null,//维护需同步的channel
	checkId_:-1,
	
	lossSeq_:-1,//检测丢包序列号位置
	lossSeqs_:null,//存储丢包序列号
	loss_:0,
	
	checkInterval_:30*1000,
	bytesPacket_:null,
	relaySpc_:null,
	tag_:"com::relayCore::ssrcs::Layer",
	
	init:function(_context,_layer)
	{
		this.context_ = _context;
		this.layer_ = _layer;
		this.checkInterval_ = this.context_.config_.messageExpiredTime_?this.context_.config_.messageExpiredTime_:30*1000;
		this.cachePacket_ = new rc$.com.relayCore.utils.Map();
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.spc_ = null;
		this.route_ = null;
		this.syncChannels_=[];
		this.unsyncChannels_=[];
		this.lossSeqs_=[];
	},
	//定期检查该层的U和M是否过期
	startCheck_:function()
	{
		if(this.checkId_>0)
		{
			clearInterval(this.checkId_);
			this.checkId_ = -1;
		}
		var callBack_ = this.checkExpired_.bind(this);
		this.checkId_ = setInterval(callBack_,this.checkInterval_);
	},
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
	getP_:function(_seq)
	{
		var Pb_ = this.cachePacket_.get(80);
		if(!Pb_||!Pb_.data)
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getP P消息为空！",this.tag_));
			return null;
		}
		if(!_seq||_seq<0)
		{
			_seq = Pb_.seq_;
		}
		if(!Pb_.data||!Pb_.data.find(_seq))
		{
			P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::getP seq({1})的消息不存在！",this.tag_,_seq));
			return null;
		}
		return Pb_.data.get(_seq);
	},
	getH_:function(_seq)
	{
		var Pb_ = this.cachePacket_.get(80);
		var Hb_ = this.cachePacket_.get(72);
		var data_,seq_;
		seq_=_seq;
		if(Hb_&&Hb_.data)
		{
			if(!_seq)
			{
				seq_ = Hb_.seq_;
			}
			data_ = Hb_.data.get(seq_);
		}
		if(Pb_&&Pb_.data)
		{
			if((data_&&Hb_.timestamp_<Pb_.timestamp_)||!data_)
			{
				if(!_seq)
				{
					seq_ = Pb_.seq_;
				}
				data_ = Pb_.data.get(seq_);
				if(data_)
				{
					data_ = this.bytesPacket_.decode_(data_).data;
					data_.type = 72;
					data_.payload=0;
					data_ = this.bytesPacket_.encode_(data_);
				}
			}
		}
		return data_;
	},
	rollBack_:function(_seq)
	{
		//发生回滚。重置this.lossSeq_
		if(this.lossSeq_>_seq)
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::rollBack 重置lossSeq_({1})->({2})", this.tag_,this.lossSeq_,_seq));
			this.lossSeq_=_seq;
		}
		var index_ = this.lossSeqs_.indexOf(_seq);
		if(index_>-1)//回滚的序列号未获得P返回
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::rollBack channel({1})序列号({2})丢包记录", this.tag_,this.channelId_,_seq));
			this.loss_++;
			this.broad_("loss",{loss:this.loss_,seq:_seq});
			var channel_ = this.context_.ssrcChannel_.getChannelById_(this.channelId_);
			if(channel_)
			{
				channel_.lossP_++;
			}
			this.lossSeqs_.splice(index_,1);
			return;
		}
	},
	checkLoss_:function(_data)
	{
		var oldP_,newP_,a_,b_,c_,loss_=0,ts_,newloss_=[];
		newP_ = this.bytesPacket_.decode_(_data).data;
		var index_ = this.lossSeqs_.indexOf(newP_.seq);
		if(index_>-1)//返回的是重发的N
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::checkLoss 接收到丢包序列号({1})", this.tag_,newP_.seq));
			this.lossSeqs_.splice(index_,1);
			return [];
		}
		if(this.cachePacket_.find(80))
		{
			oldP_ = this.getP_(this.lossSeq_);
			if(!oldP_)
			{
				return [];
			}
			oldP_ = this.bytesPacket_.decode_(oldP_).data;
			if(this.lossSeq_>oldP_.seq)//已经检测过了
			{
				return [];
			}
			this.lossSeq_ = newP_.seq;
			a_=oldP_?oldP_.seq:-1;
			b_=newP_.seq;
			if(a_>b_){
				return [];
			}
			if((a_+1)<b_)
			{
				loss_ = b_-a_-1;//丢包
				for(var i=a_+1;i<b_;i++)
				{
					ts_ = (newP_.ts-oldP_.ts)*(i-a_)/loss_+oldP_.ts;
					newloss_.push({ts:ts_,seq:i});
					this.lossSeqs_.push(i);
				}
			}
		}
		return newloss_;
	},
	checkExpired_:function()
	{
		var Mb_,Ub_,Qb_;
		if(this.cachePacket_.find(77))
		{
			Mb_ = this.cachePacket_.get(77);
		}
		if(this.cachePacket_.find(85))
		{
			Ub_ = this.cachePacket_.get(85);
		}
		var Mex_=true;
		var Uex_=true;
		if(Mb_)
		{
			Mex_ = Mb_.isActive_();
		}
		if(Ub_)
		{
			Uex_ = Ub_.isActive_();
		}
		if(!Uex_||!Mex_)//M或者U过期
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::checkExpired 消息M({1})U({2})",this.tag_,Mex_?"有效":"过期",Uex_?"有效":"过期"));
			Qb_ = this.bytesPacket_.encode_(this.context_.getMessageByType_(81).data);
			this.context_.relayMessage_({layer:[0],level:0,data:Qb_});
		}
	},
	broad_:function(_type,_value)
	{
		var id_ = this.context_.strings_.format("{0}:{1}:{2}",this.context_.id,this.context_.level,this.layer_);
		this.context_.manager_.broadcast_.channelMessage_(id_,_type,_value);
	},
	close_:function()
	{
		if(this.checkId_>0){clearInterval(this.ckeckId_);}
		this.bytesPacket_ = null;
		this.context_=null;
		this.cachePacket_=null;//维护一个缓存消息
		this.channelId_=null;
		this.syncChannels_=[];//维护已同步的channel
		this.unsyncChannels_=[];//维护需同步的channel
	}
});

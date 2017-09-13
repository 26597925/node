rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.ssrcs.CacheData = JClass.extend_({
	type:null,
	data:null,
	activeTime_:0,
	global_:null,
	bytesPacket_:null,
	context_:null,
	timestamp_:-1,
	sdpHash_:null,
	sdp_:null,
	seq_:-1,
	active_:false,
	maxCache_:100,
	maxCacheSeq_:null,
	total_:0,
	successTotal_:0,
	tag_:"com.relayCore::ssrcs::CacheData",
	
	init:function(_context)
	{
		this.context_ = _context;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.bytesPacket_ = rc$.com.relayCore.webrtc.packets.BytesPacket;
		this.activeTime_ = this.global_.getMilliTime_();
		this.maxCacheSeq_=[];
		this.data=null;
	},
	update_:function(_message)
	{
		this.activeTime_ = this.global_.getMilliTime_();
		this.type=_message.type;
		var data_ = _message.data;
		this.total_++;
		switch(this.type)
		{
		case 85://U
			//解析U消息
			var oldU_={};
			var info_ = this.bytesPacket_.decode_(data_).data;
			if(!info_.payload)
			{
				P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::update U({1})消息的载荷为空！",this.tag_,JSON.stringify(info_)));
				break;
			}
			this.successTotal_++;
			var UInfo_ = JSON.parse(info_.payload);
			if(this.data != null)
			{
				var old_ = this.bytesPacket_.decode_(this.data).data;
				oldU_ = JSON.parse(old_.payload);
			}
			for(var i in UInfo_)
			{
				switch(i)
				{
				case "SPC":
					oldU_[i] = UInfo_[i];
					if(this.context_.context_.level == rc$.com.relayCore.ssrcs.SyncLevel.SERVING)
					{
						oldU_[i] = this.context_.context_.spc;
					}
					break;
				case "PackLossRate":
					var olu_ = oldU_.PackLossRate?oldU_.PackLossRate:0;
					var nlu_ = 1-(1-olu_)*(1-UInfo_[i]);
					oldU_.PackLossRate = nlu_;
					break;
				case "RTT":
					var rtt_ = oldU_.RTT+UInfo_[i];
					oldU_.RTT = rtt_;
					break;
				case "Jitter":
					oldU_[i] = UInfo_[i];
					break;
				case "SDP":
					oldU_[i] = UInfo_[i];
					this.sdp_ = UInfo_[i];
					this.timestamp_ = info_.ts;
					break;
				default:
					break;
				}
			}
			info_.payload_ = JSON.stringify(oldU_);
			this.data = this.bytesPacket_.encode_(info_);
			break;
		case 72://H
		case 80://P
			if(this.data==null)
			{
				this.data=new rc$.com.relayCore.utils.Map();
			}
			var pInfo_ = this.bytesPacket_.decode_(data_).data;
			var isAdd_ = 0;
			//丢包数据的处理的重新缓存
			if(this.timestamp_<pInfo_.ts||(this.timestamp_==pInfo_.ts&&(this.seq_<pInfo_.seq||(this.seq_==255&&pInfo_.seq==0))))
			{
				isAdd_ = 2;
			}
			else if(!this.data.find(pInfo_.seq))
			{
				isAdd_ = 1;
			}
			if(isAdd_>0)//新数据，添加
			{
				this.successTotal_++;
				if(this.type==72&&pInfo_.type==80)
				{
					pInfo_.type=72;
					pInfo_.payload = null;
					data_ = this.bytesPacket_.encode_(pInfo_);//重新转封装
					P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::update 缓存H,P->H！",this.tag_,data_));
				}
				if(this.data.length>this.maxCache_)//最大缓存
				{
					var tmp_ = this.maxCacheSeq_.shift();//删除并取出第一个序列号
					this.data.remove(tmp_.seq);
					if(this.type==80)
					{
						this.context_.broad_("P",{type:"remove",num:tmp_.seq});
					}
				}
				this.data.set(pInfo_.seq,data_);
				this.maxCacheSeq_.push({"type":this.type,"seq":pInfo_.seq,"ts":pInfo_.ts});
				this.maxCacheSeq_.sort(function(a,b){
					if(a.ts-b.ts==0)
					{
						if(a.seq<b.seq)
						{
							return a.seq-b.seq
						}
						else
						{
							return b.seq-a.seq
						}
					}
					return a.ts-b.ts
					});
				if(isAdd_>1){
					if(this.type==80)
					{
						this.context_.broad_("P",{type:"add",num:pInfo_.seq});
						if(this.context_.tag_=="com::relayCore::ssrcs::Layer")
						{
							this.context_.rollBack_(pInfo_.seq);
						}	
					}
					this.timestamp_ = pInfo_.ts;
					this.seq_ = pInfo_.seq;
				}
				else
				{
					if(this.type==80)
					{
						this.context_.broad_("P",{type:"insert",num:pInfo_.seq});
					}
				}
			}
			break;
		case 77:
			var payload_,M_;
			M_ = this.bytesPacket_.decode_(data_).data;
			if(M_.ts<=this.timestamp_)
			{
				break;
			}
			this.successTotal_++;
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0}::update_ 接到消息M。时间({1})>({2})，更新", this.tag_,M_.ts,this.timestamp_));
			this.active_ = true;
			this.timestamp_ = M_.ts;//更新时间戳
			payload_ = this.bytesPacket_.decode_(M_.payload).data;
			this.sdpHash_ = payload_.SDPHash;
			this.data = data_;
			break;
		default:
			this.successTotal_++;
			this.data = data_;
			break;
		}
		if(this.context_.tag_=="com::relayCore::ssrcs::Layer")
		{
			this.context_.broad_("layer-message",{type:this.type,success:this.successTotal_,total:this.total_});
		}
	},
	getSEQ_:function(_time)//获得时间晚于time的seq
	{
		var keys_ = this.data.keys();
		keys_.sort();
		var seq_=-1;
		var data_;
		///提取最后一个时间戳
		data_ = this.bytesPacket_.decode_(this.data.get(keys_[keys_.length-1])).data;
		if(data_.ts<_time)
		{
			return -1;
		}
		for(var i=keys_.length-2;i>0;i--)
		{
			data_ = this.bytesPacket_.decode_(this.data.get(keys_[i])).data;
			if(data_.ts<_time)
			{
				break;
			}
			seq_ = data_.seq;
		}
		return seq_;
	},
	isActive_:function()
	{
		return this.active_;
	},
	check_:function(_sdp)
	{
		this.active_ = true;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::check 校验SDP({1}),SDPHash({2})！",this.tag_,_sdp,this.sdp_));
	}
});

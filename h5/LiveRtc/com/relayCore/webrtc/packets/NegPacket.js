rc$.ns("com.relayCore.webrtc.packets");
rc$.com.relayCore.webrtc.packets.NegPacket = JClass.extend_({
	ngId_:0,
	lmVer_:0,
	maxlayerCount_:8,
	synced_:[],
	unsynced_:[],
	congif_:null,
	tag_:"com::relayCore::webrtc::packets::NGPacket",
	remoteAdvertise_:null,
	lastAdvertise_:null,
	context_:null,
	strings_:null,
	global_:null,
	remoteRoute_:null,//路由信息
	routeActiveTime_:-1,//路由信息计时时间
	status_:0,
	
	init:function(_context)
	{
		this.context_ = _context;
		this.config_ = rc$.com.relayCore.vo.Config;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.global_ = rc$.com.relayCore.utils.Global;
		this.maxOwneds_ = this.config_.maxOwnedNum?this.config_.maxOwnedNum:this.maxOwneds_;
		this.synced_ = [];
		this.unsynced_ = [];
		this.remoteAdvertise_ = null;
		this.remoteRoute_ = null;
		this.routeActiveTime_=-1;
		this.lastAdvertise_ = null;
	},
	getPacket_:function()
	{
		var packet_ = {};
		packet_.Negotiate = this.ngId_;//协商序列号
		packet_.LMPNRC_Ver = this.lmVer_;//连接协议版本号。如果协商消息中不包含此域，应当直接放弃通讯。
		packet_.maxLayerCount = this.maxlayerCount_;//2^ 媒体流的最大层数（见上）。此数值必须是2的n次幂，合理的值在32（含）以内。
		packet_.synced = this.synced_;
		packet_.unsynced = this.unsynced_;
		var myOwned_ = this.context_.getOwned_();//获取本地资源
		var mysame_ = this.isSame_(myOwned_,this.context_.owned_);
		if(!mysame_||this.status_==0)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getPacket peer({1})资源发生变化需要发送Owned",this.tag_,this.context_.context_.peerId_));
			this.context_.owned_ = myOwned_;
			this.lastAdvertise_ = this.getAdvertise_();
			packet_.Advertise = this.lastAdvertise_;
		}
		return packet_;
	},
	getAdvertise_:function()
	{
		var resource_ = {};//协商资源信息，包含下列子对象中的一个或多个：
		if(this.synced_.length<this.config_.syncMax_)
		{
			resource_.owned = this.context_.owned_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getAdvertise peerId({1})", this.tag_,this.context_.context_.peerId_));
		}
		else
		{//计算自己想要的
			var mywanted_ = this.context_.getWanted_();
			resource_.wanted = mywanted_;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::getAdvertise peerId({1})->wanted({2})", this.tag_,this.status_,this.context_.context_.peerId_,JSON.stringify(resource_.wanted)));
		}
		resource_.route = this.context_.routes_;
		return  resource_;
	},
	//查看rec1中不存在rec2的SSRC
	getSync_:function(_rec1,_rec2,_status)
	{
		if(_rec1 == null||_rec2 == null)
		{
			return [];
		}
		var mysync_ = [],exit_;
		var params_ = ["id","channel","mappedId"];
		for(var i=0;i<_rec2.length;i++)
		{
			exit_ = false;
			for(var j=0;j<_rec1.length;j++)
			{
				exit_ = this.compareTo_(_rec2[i],_rec1[j],params_);
				if(exit_)
				{
					break;
				}
			}
			if(exit_==_status)
			{
				mysync_.push(_rec2[i]);
			}
		}
		return mysync_;
	},
	//添加到本地同步列表
	addSync_:function(_rec)
	{
		if(_rec.length==0)
		{
			return false;
		}
		var mysync_,hasUnsync_;
		for(var i=0;i<_rec.length;i++)
		{
			mysync_ = _rec[i];
			//如果存在于非同步列表则无需添加
			hasUnsync_ = this.getSync_(this.unsynced_,[mysync_],true);
			if(hasUnsync_.length>0)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addSync 存在sync({1})", this.tag_,JSON.stringify(mysync_)));
				continue;
			}
			this.synced_.push({id:mysync_.id,channel:mysync_.channel,mappedId:mysync_.mappedId,layer:mysync_.layer,spc:mysync_.spc});
		}
		return true;
	},
	getRoute_:function(_ssrc)
	{
		//从对端获取
		var remoteSSRC_;
		if(this.context_.remoteOwned_)
		{
			for(var i=0;i<this.context_.remoteOwned_.length;i++)
			{
				if(this.context_.remoteOwned_[i].id==_ssrc.id)
				{
					remoteSSRC_ = this.context_.remoteOwned_[i];
					break;
				}
			}
		}
		var route_,ttl_;
		route_ = this.remoteRoute_[remoteSSRC_.routeIndex];
		ttl_ = remoteSSRC_.routeTTL;//剩余有效时间
		return {route:route_,ttl:ttl_,start:this.routeActiveTime_};
	},
	//添加到非同步列表
	addunSync_:function(_rec)
	{
		if(_rec.length==0)
		{
			return false;
		}
		var unsync_ = this.getSync_(this.unsynced_,_rec,false);
		for(var i=0;i<unsync_.length;i++)
		{
			for(var j=0;j<this.synced_.length;j++)
			{
				if(this.compareTo_(unsync_[i],this.synced_[j],["id","channel","mappedId"]))
				{
					this.synced_.splice(j,1);
				}
			}
			this.unsynced_.push(unsync_[i]);
			this.sortSSRC_(this.unsynced_);
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addunSync 增加一个UnSync({1})", this.tag_,JSON.stringify(unsync_)));
		return true;
	},
	deleteSync_:function(_owned)
	{
		var list_ = [];
		var level_;
		var from_ = this.context_.context_.fromServer_?0:1;
		for(var i=0;i<this.synced_.length;i++)
		{
			level_ = (from_+this.synced_[i].mappedId)%2;
			if(level_ == 0)
			{
				for(var j=0;j<_owned.length;j++)
				{
					if(this.synced_[i].id == _owned[j].id && this.synced_[i].mappedId == _owned[j].mappedId)
					{
						list_.push(this.synced_[i]);
					}
				}
			}
		}
		if(list_.length>0)
		{
			this.addunSync_(list_);
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::deleteSync 同步资源（{1}）不存在了", this.tag_,JSON.stringify(list_)));
		}
	},
	processData_:function(_data)
	{
		this.status_ = 1;
		var rec_,myowned_,mysynced_,syncStatus_,syncStatus2_;
		var myng_ = _data.Negotiate;
		if(_data.LMPNRC_Ver == null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 协议版本号为空，放弃通信", this.tag_));
			return false;
		}
		if(Math.abs(this.ngId_ - this.context_.ng_)>this.config_.maxThreshold_)//大于阈值终断
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 阈值({1})超出最大阈值({2})，中断", this.tag_,this.ngId_ - this.context_.ng_,this.config_.maxThreshold_));
			return false;
		}
		this.ngId_++;//协商序列号加1
		var lv_ = _data.LMPNRC_Ver;//不一致使用较低版本
		if(lv_<this.lmVer_)
		{
			this.lmVer_ = lv_;
		}
		var mlc_ = _data.maxLayerCount;
		if(mlc_>this.maxlayerCount_)
		{
			this.maxlayerCount_ = mlc_;
		}
		if(_data.synced.length>0)//检查是否是需要从本地同步流
		{
			if(!this.isSame_(this.synced_,_data.synced))//不相同,更新
			{
				//重新计算本地与对端同步列表
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 同步列表不同，重新生成同步列表", this.tag_));
				syncs_ = this.getSync_(this.synced_,this.context_.owned_,false);
				this.addSync_(syncs_);
				syncs_ = this.getSync_(this.synced_,this.context_.remoteOwned_,false);
				this.addSync_(syncs_);
			}
		}
		if(_data.unsynced&&_data.unsynced.length>0)//协商停止同步
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 更新不同步列表", this.tag_));
			this.addunSync_(_data.unsynced);
		}
		rec_ = _data.Advertise;
		myowned_ = this.context_.owned_;
		syncStatus_=false;
		syncStatus2_=false;
		if(rec_ != null)//接收到Advertise
		{
			this.remoteAdvertise_ = rec_;  
			//首先检查本地owned_中不在sync的
			if(myowned_ != null)
			{
				mysynced_ = this.getSync_(this.synced_,myowned_,false);
				syncStatus_ = this.addSync_(mysynced_);
			}
			if(rec_.owned)
			{
				mysynced_ = this.getSync_(this.synced_,rec_.owned,false);
				syncStatus2_ = this.addSync_(mysynced_);
				///接收到对端owned
				this.context_.remoteOwned_ = rec_.owned;
				this.context_.remoteSSRCStatus_ = rc$.com.relayCore.webrtc.PeerSSRCStatus.KNOWN;
			}
			if(rec_.wanted)//如果接受的是wanted，则需查找本地ssrc是否有匹配的
			{
				mysynced_ = this.getSync_(myowned_,rec_.wanted,true);
				syncStatus2_ = this.addSync_(mysynced_);
				this.context_.remoteSSRCStatus_ = rc$.com.relayCore.webrtc.PeerSSRCStatus.UNKNOWN;
			}
			if(rec_.route)
			{
				this.remoteRoute_ = rec_.route;
				this.routeActiveTime_ = this.global_.getMilliTime_();
			}
			if(syncStatus_||syncStatus2_)
			{
				this.sortSSRC_(this.synced_);
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processPacket 本地是否需要同步({1})，是否存在新的同步({2})", this.tag_,syncStatus_,syncStatus2_));
			//检查本地不同的放到syned中
		}
		//检查同步列表中的资源需要在本地同步的是否还存在
		this.deleteSync_(myowned_);
		return true;
	},
	sortSSRC_:function(_ssrc)
	{
		var property_ = ["id","mappedId","spc"];
		_ssrc.sort(function(a,b){
			var len_ = property_.length;
			for(var i=0;i<len_;i++)
			{
				if(a[property_[i]] != null)
				{
					if((a[property_[i]]-b[property_[i]]) != 0)
					{
						return a[property_[i]]-b[property_[i]];
					}
				}
			}
            return a[property_[len_-1]]-b[property_[len_-1]];
            });
	},
	isSame_:function(_sy1,_sy2)
	{
		var isEx_ = this.getSync_(_sy1,_sy2,false);
		if(isEx_.length>0)
		{
			return false;
		}
		isEx_=this.getSync_(_sy2,_sy1,false);
		if(isEx_.length>0)
		{
			return false;
		}
		return true;
	},
	/*
	 * cesissisisi
	 */
	compareTo_:function(_value1,_value2,_params)
	{
		var b_ = true;
		for(var i=0;i<_params.length;i++)
		{
			switch(_params[i])
			{
			case "mappedId"://算出奇偶
				var m1_ = _value1.mappedId%2;
				var m2_ = _value2.mappedId%2;
				if(m1_!=m2_)
				{
					b_ = false;
				}
				break;
			default:
				if(_value1[_params[i]]!=_value2[_params[i]])
				{
					b_ = false;
				}
				break;
			}
			if(b_ == false)
			{
				break;
			}
		}
		return b_;
	}
});

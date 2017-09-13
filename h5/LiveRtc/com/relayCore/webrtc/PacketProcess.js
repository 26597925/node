rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.webrtc.PacketProcess = JClass.extend_({
	negPacket_:null,
	bytesPacket_:null,
	channel_:null,
	strings_:null,
	tag_:"com::relayCore::webrtc::PacketProcess",
	init:function(_channel)
	{
		this.channel_ = _channel;
		this.strings_ = rc$.com.relayCore.utils.String;
	},
	//处理各种数据信息
	process_:function(_message)
	{
		var type_ = _message.type;
		switch(type_)
		{
		case "negotiation"://协商
			this.processNeg_(_message.data);
			break;
		case "meta"://元数据
			break;
		case "stream"://流数据
			break;
		default:
			break;
		}
	},
	processNeg_:function(_data)
	{
		var receivePacket_ = JSON.parse(_data);
		var ngPacket_ = this.channel_.lastPacket_;//用来协商的消息
		var needSend_ = false;
		var prd_=true;
		var negResult_=false;
		if(ngPacket_&&receivePacket_.Negotiate==ngPacket_.Negotiate)//最新消息
		{
			//下一级个需要是发送的序列号//
			negResult_ = this.compareTo_(ngPacket_,receivePacket_);
			if(!negResult_)//做一个新的协商
			{
				prd_ = this.channel_.negPacket_.processData_(receivePacket_);
			}
		}
		else if(receivePacket_.Negotiate == (this.channel_.negPacket_.ngId_+1))
		{
			prd_ = this.channel_.negPacket_.processData_(receivePacket_);//进行协商
			needSend_ = true;
			ngPacket_ = this.channel_.negPacket_.getPacket_();
			negResult_ = this.compareTo_(ngPacket_,receivePacket_);
		}
		if(!prd_){//错误,终断连接
				return false;
		}
		if(!negResult_)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1}) NG({2}) 协商不成立，继续...", this.tag_,this.channel_.context_.peerId_,receivePacket_.Negotiate));
			this.channel_.sendNeg_();
			return false;
		}
		
		if(needSend_)//下一个即将要发送的消息
		{
			this.channel_.sendNeg_();
		}
		this.channel_.ng_ = this.channel_.negPacket_.ngId_;//更新协商序完成列号
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::processNeg Peer({1})协商成立,序列号({2})", this.tag_,this.channel_.context_.peerId_,this.channel_.ng_));
		//更新同步资源列表
		//对外广播
		this.channel_.ngStatus_ = false;
		this.channel_.onNegOver_();
	},
	compareTo_:function(_value1,_value2)
	{
		var propertise_ = ["Negotiate","LMPNRC_Ver","maxLayerCount","synced","unsynced","Advertise"];
		var result_ = true;
		var sy1_,sy2_,v1_,v2_,owned1_,owned2_;
		for(var i=0;i<propertise_.length;i++)
		{
			v1_ = _value1[propertise_[i]];
			v2_ = _value2[propertise_[i]];
			switch(propertise_[i])
			{
			case "synced":
			case "unsynced":
				sy1_ = this.channel_.negPacket_.getSync_(v1_,v2_,false);
				sy2_ = this.channel_.negPacket_.getSync_(v1_,v2_,false);
				if(sy1_.length>0||sy2_.length>0)
				{
					result_ = false;
				}
				break;
			case "Advertise":
				owned1_ = v1_?v1_.owned:[];
				owned2_ = v2_?v2_.owned:[];
				sy1_ = this.channel_.negPacket_.getSync_(owned1_,owned2_,false);
				sy2_ = this.channel_.negPacket_.getSync_(owned2_,owned1_,false);
				if(sy1_.length>0||sy2_.length>0)
				{
					result_ = false;
				}
				owned1_ = v1_?v1_.wanted:[];
				owned2_ = v2_?v2_.wanted:[];
				sy1_ = this.channel_.negPacket_.getSync_(owned1_,owned2_,false);
				sy2_ = this.channel_.negPacket_.getSync_(owned2_,owned1_,false);
				if(sy1_.length>0||sy2_.length>0)
				{
					result_ = false;
				}
				break;
			default:
				if(v1_!=v2_)
				{
					result_ = false;
				}
				break;
			}
			if(result_==false)
			{
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::compareTo ({1}),{2}-{3}", this.tag_,propertise_[i],JSON.stringify(v1_),JSON.stringify(v2_)));
				break;
			}
		}
		return result_;
	}
});

rc$.ns("com.relayCore.webrtc");
rc$.com.relayCore.ssrcs.Channel = JClass.extend_({
	dataChannels_ : null,
	context_:null,
	methodMap_:null,
	strings_:null,
	tag_:"com::relayCore::ssrcs::Channel",
	
	init:function(_context)
	{
		this.context_ = _context;
		this.strings_ = rc$.com.relayCore.utils.String;
		this.dataChannels_ = new rc$.com.relayCore.utils.Map();
		this.methodMap_ = new rc$.com.relayCore.utils.Map();
	},
	addChannel_:function(_channel)
	{
		if(this.dataChannels_.find(_channel.id_))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} addChannel 存在peerId({1}),mappedId({2}) channel",this.tag_,_channel.peerId_,_channel.cid_));
			return;
		}
		this.dataChannels_.set(_channel.id_,_channel);
		this.excuteMethod_("onAdd",_channel);
	},
	removeChannel_:function(_channel)
	{
		if(this.dataChannels_.find(_channel.id_))
		{
			P2P_ULOG_WARNING(P2P_ULOG_FMT("{0} removeChannel 删除dataChannels中id({1})的channel",this.tag_,_channel.id_));
			this.dataChannels_.remove(_channel.id_);
			this.excuteMethod_("onRemove",_channel);
		}
	},
	excuteMethod_:function(_name,_params)
	{
		if(this.methodMap_.find(_name))
		{
			var methods_ = this.methodMap_.get(_name);
			for(var i=0;i<methods_.length;i++)
			{
				methods_[i](_params);
			}
		}
	},
	registerMethod_:function(_params)
	{
		if(!this.methodMap_.find(_params.name))
		{
			this.methodMap_.set(_params.name,[]);
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::registerMethod 注册一个({1})回调方法",this.tag_,_params.name));
		this.methodMap_.get(_params.name).push(_params.body);
	},
	getChannelById_:function(_id)
	{
		return this.dataChannels_.get(_id);
	},
	
	getChannelByType_:function(_params)//获取不同类型的channel
	{
		var list_=[];
		var channel_,mylabel_,mylayer_,mylevel_;
		for(var i=0;i<this.dataChannels_.length;i++)
		{
			key_ = this.dataChannels_.elements_[i].key;
			channel_ = this.dataChannels_.elements_[i].value;
			mylabel_ = channel_.label_;
			mylevel_ = channel_.level_;
			mylayer_ = channel_.layer_;
			if(_params.hasOwnProperty("type"))
			{
				if(mylabel_.indexOf(_params.type)==-1)
				{
					continue;
				}
			}
			if(_params.hasOwnProperty("level"))
			{
				if(mylevel_!=_params.level)
				{
					continue;
				}
			}
			if(_params.hasOwnProperty("layer"))
			{
				if(mylayer_!=_params.layer)
				{
					continue;
				}
			}
			list_.push(key_);
		}
		return list_;
	},
});

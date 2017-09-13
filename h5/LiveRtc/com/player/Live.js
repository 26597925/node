/**
 * 
 */
rc$.ns("com.relayCore.player");
rc$.com.relayCore.player.Live = JClass.extend_({
	config_:null,
	channels_:null,
	storages_:null,
	tag_:"com::relayCore::player::Live",
	videos_:null,
	
	init:function()
	{
		this.config_ = rc$.com.relayCore.vo.Config;
		//播放视频管理
		this.videos_ = new rc$.com.relayCore.utils.Map();
		//频道管理
		this.channels_ = new rc$.com.relayCore.channels.Manager(this);
		//存储管理
		this.storages_ = rc$.com.relayCore.channels.storage.Pool;
		this.storages_.initialize_();
	},
	addChannel:function(channelUrl)
	{
		//检查频道是否已经创建
		var channel_ = this.channels_.openChannel(channelUrl);
		this.storages_.addChannel(channel_);
		//打开播放
		if(this.videos_.get(channel_.id_))
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::addChannel ({1})已经存在频道！",this.tag_,channel_.id_));
			return;
		}
		var stream_ = new rc$.com.relayCore.player.Stream(this,channel_.id_);
		stream_.start_();
		this.videos_.set(channel_.id_,stream_);
		//添加到场景
		if(this.config_.videoBox)
		{
			this.config_.videoBox.appendChild(stream_.video_);
		}
		return channel_;
	}
});
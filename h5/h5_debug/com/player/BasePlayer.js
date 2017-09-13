p2p$.ns("com.player");
p2p$.com.player.BasePlayer = JClass.extend_({
	params_:{},
	// properties
	video_:null,//video对象
	context_ : null,
	url_ : null,
	config_:null,
	http_ : null,
	player_ : null,
	stream_ : null,//流加载对象
	firstSeekTime_:0,
	creator_:null,
	tag_:"com::player::BasePlayer",
	/*各种状态说明
		1.VIDEO.PLAY.ERROR 错误信息
	 	2.VIDEO.GSLB.LOADING 调度加载
		3.VIDEO.GSLB.LOADED 调度加载结束
		4.VIDEO.META.LOADING meta加载
	 	5.VIDEO.META.LOADED meta加载结束
	 	6.VIDEO.PLAY.START 视频开始
	 	7.VIDEO.META.INFO meta信息加载
	 	8.VIDEO.PLAY.LOAD
	 	9.VIDEO.PLAY.FIRST 首次起播
	 	10.VIDEO.PLAY.SEEKING  seek开始
	 	11.VIDEO.PLAY.SEEKED seek结束
	 	12.VIDEO.BUFFER.START  缓冲开始
	 	13.VIDEO.BUFFER.END 缓冲结束
	 	14.VIDEO.PLAY.END 播放结束
	 	15.VIDEO.BUFFER.RANGR SourceBuffer中缓冲的数据
	* */
	
	init:function(video)
	{
		this.config_ = p2p$.com.selector.Config;
		this.video_ = video;
		this.http_ = null;
		this.url_ = this.config_.playUrl;
	},
	sendStatus_:function(params)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0::sendStatus params({1})",this.tag_,JSON.stringify(params)));
		if(typeof (this.config_.callback) == "function")
		{
			this.config_.callback(params_);
		}
		else if(typeof (this.config_.callback) == "string")
		{
			try{
                eval(this.config_.callback+"("+JSON.stringify(params)+")");
			}
			catch(e){
                P2P_ULOG_WARNING(P2P_ULOG_FMT("{0::sendStatus callback({1} has no function)",this.tag_,this.config_.callback));
			}
		}
	}
});

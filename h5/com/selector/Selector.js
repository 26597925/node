p2p$.ns("com.selector");
p2p$.com.selector.Selector=JClass.extend_({
	config_:null,
	message_:null,
	media_:null,
	video_:null,
	load_:null,
	useTime_:-1,
	gTime_:-1,
	global_:null,
	tag_:"com::selector::Selector",
	init:function()
	{
		this.config_ = p2p$.com.selector.Config;
		this.global_ = p2p$.com.common.Global;
		if(arguments.length>0&&typeof(arguments[0])=="object")
    	{
			//处理外部参数
			for(var i in arguments[0]){
                this.initConfig_(i,arguments[0][i]);
			}

    	}
    	//根据url刷新参数
		this.refreshFromUrl_(this.config_.playUrl);
		if(this.config_.video == null)
		{
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init 没有传入video参数！",this.tag_));
			return;
		}
		var el_=this.config_.video;
		if (el_.tagName.toLowerCase() == 'video') {
			this.video_ = el_;
		} else {
			this.video_ = document.createElement("video");
			if (params && params.playerAttributes) {
				try {
					for ( var n in params.playerAttributes) {
						this.video_[n] = params.playerAttributes[n];
					}
				} catch (e) {
					// Ignore
				}
			}
			while (el_.childNodes.length > 0) {
				el_.removeChild(el_.childNodes[0]);
			}
			el.appendChild(this.video_);
		}
		this.gTime_=this.global_.getMilliTime_();
		this.load_=new p2p$.com.selector.LoadScript(this);
	},
	refreshFromUrl_:function(videourl)
	{
        var url = new p2p$.com.common.Url();
        url.fromString_(videourl);
        var params = url.getParams();
        var el;
        for(var i=0;i<url.getParams().elements_.length;i++)
        {
            el = url.getParams().elements_[i];
            this.initConfig_(el.key,el.value);
        }
	},
    initConfig_:function(key,value)
    {
        switch(key)
        {
            case "video":
            case "callback":
            case "useType":
            case "encode":
            case "p2p":
            case "video":
            case "playUrl":
            case "showConsole":
            case "bufferLength":
            case "startTime":
            case "autoplay":
            case "jsonp":
			case "domains":
                this.config_[key]= (typeof this.config_[key] == "number") ? parseInt(value) : value;
        }
    },
	onComplete_:function()
	{
		if(this.config_.showConsole == 1)//显示bug面板
		{
			p2p$.com.tools.console.Index.start();
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::onComplete_...",this.tag_));
		}
		this.createPlayer_();
	},
	createPlayer_:function()
	{
		var flag=this.load_.getFlag_();
		switch(flag)
		{
		case 0://mp4
		case 1://ts
			this.media_ = new p2p$.com.player.MediaPlayer(this.video_);
			break;
		case 2://system
			this.media_ = new p2p$.com.player.SystemPlayer(this.video_);
			break;
		default:
			break;
		}
		this.useTime_=this.global_.getMilliTime_()-this.gTime_;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::createPlayer_ 播放模块加载成功！创建播放器。type({1}),useTime({2})",this.tag_,this.load_.getFlag_(),this.useTime_));
		if(this.config_.autoplay == 1)
		{
			this.media_.start();
		}
	},
	openUrl_:function(url)
	{
		this.config_.playUrl=url;
        //根据url刷新参数
        this.refreshFromUrl_(this.config_.playUrl);
		if(!this.media_)
		{
			this.createPlayer_();
			return;
		}
		this.media_.openUrl_(url);
	}
});

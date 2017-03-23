/**
 * m3u8文件加载
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.M3u8Loader = h5$.createClass({
	gslb:null,
	intervalId:-1,
	outtimeId:-1,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{	
	},
	start:function()
	{
		var _params = {callback:this,config:this.config,initData:this.initData,statics:this.statics,parseUrl:this.parseUrl};
		this.gslb = new h5$.com.p2p.loaders.GslbLoader(_params);
		this.gslb.load();
	},
	gslbSuccess:function()
	{
		console.log("m3u8::gslb_success:");
		if(this.config.PLAY_TYPE == this.config.M3U8_TYPE || this.initData.src.length === 0)
		{
			return;
		}
		this.runTask();
		this.startTimer();	
	},
	startTimer:function()
	{
		this.stopTimer();
		var me = this;
		this.intervalId = setInterval(function(){ me.runTask(); }, this.config.m3u8_gaps);
	},
	stopTimer:function()
	{
		if(this.intervalId)
		{
			clearInterval( this.intervalId );
			this.intervalId =null;
		}
	},
	outTimer:function()
	{
		var _me = this;
		this.stopOutTimer();
		this.outtimeId = setTimeout(function(){
			console.log("m3u8::loadM3U8 time out!");
			_me.loaderError(); 
			}, this.config.m3u8_out_time );
	},
	stopOutTimer:function()
	{
		if(this.outtimeId)
		{
			clearTimeout(this.outtimeId);
			this.outtimeId = null;
		}
	},
	success:function(value)
	{
		console.log("m3u8::load..success!");
		if(!this.config.m3u8_loading) return;
		this.stopOutTimer();
		this.config.cdnRetry = 0;
		this.config.m3u8_loading = false;
//		this.config.g_bVodLoaded = false;
		var _params = {config:this.config,initData:this.initData,parseUrl:this.parseUrl};
		var m3u8Parse = new h5$.com.p2p.loaders.ParseM3U8(_params);
		m3u8Parse.parseFile(value, this.clipHandler, this );
	},
	clipHandler:function(_clipList)
	{
		this.dataManager.addBlock(_clipList);
	},
	loaderError:function(status)
	{
		console.log("m3u8:: loadererror",status);
		if(!this.config.m3u8_loading) return;
		this.config.m3u8_loading = false;
		this.stopOutTimer();
		//超时，更换新节点重试
		if(this.config.cdn_idx<(this.initData.src.length-1))
		{
			if(this.config.cdnRetry>=this.config.cdnMaxRetry)
			{
				this.config.cdnRetry = 0;
				this.config.cdn_idx++;
				console.log("m3u8::更换下一个节点！");	
			}
			this.config.cdnRetry++;
			console.log("m3u8::cdn重试次数：",this.config.cdnRetry);
		}
		else if(this.config.gslbRetry<this.config.gslbMaxRetry)
		{
			console.log("m3u8::所有cdn地址都已经重试，重置开始点！并重新请求调度！");
			this.config.cdnRetry = 0;
			this.config.gslbRetry++;
			this.start();
		}
		else
		{
			console.log("m3u8::当前网络地址或者服务器不可用，稍后再刷新吧！");
		}
	},
	runTask:function()
	{
		if(this.config.m3u8_loading) return;//正在加载不运行新的任务
		if(this.config.TYPE == this.config.LIVE && this.dataManager.getEmptyBlock() > 10) return;
		if(this.config.TYPE == this.config.VOD && true === this.config.g_bVodLoaded) return;
		//如果是点播视频，已经加载结束则返回，并清掉定时
		//获取加载地址
		var _url = this.initData.src[this.config.cdn_idx].location;
		switch(this.config.TYPE)
		{
			case this.config.LIVE:
				var _timeshift = 0;
				if(!this.config.g_bVodLoaded)
				{//首次加载，时间设定
					_timeshift = this.config.ADD_DATA_TIME;
					_url = this.parseUrl.replaceParam(_url,"mslice",String(3));
				}
				else
				{//后续加载，时间设定为m3u8的最后一片时间值
					_timeshift = this.config.M3U8_MAXTIME;
					_url = this.parseUrl.replaceParam(_url,"mslice",String(5));
				}
				if(_timeshift<=0 || typeof(_timeshift) != "number")//重新赋值
				{
					_timeshift = Math.floor(this.config.localTime/1000)-30;
				}
				
				_url = this.parseUrl.replaceParam(_url,"abtimeshift",""+_timeshift);
				_url = this.parseUrl.replaceParam(_url,"rdm",""+ this.config.localTime);
				break;
			case this.config.VOD:
				break;
			default:
		}
		_url=this.parseUrl.replaceParam(_url,"ajax","1");
		if(true === this.initData.isProxy)
		{
			_url = "proxy?url="+encodeURIComponent(_url);
		}
//		console.log("m3u8Loader:",_url);
		this.initData.currentSrc = _url;
		this.config.streamid = this.parseUrl.getParam(this.initData.currentSrc,"stream_id");
		this.outTimer();
		this.config.m3u8_loading = true;
		this.config.g_bVodLoaded = true;
		var _params = {url:_url,method:"GET",scope:this,type:"text"};
		var xhr = new h5$.com.p2p.loaders.BaseHttpLoad(_params);
		xhr.load();
	},
	reset:function()
	{
		this.stopOutTimer();
		this.config.m3u8_loading = false;
		this.config.g_bVodLoaded = false;
	}
});
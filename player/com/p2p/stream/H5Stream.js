/**
 * write by chenzhaofei on 2015 March 19
 */
h5$.nameSpace('com.p2p.stream');
h5$.com.p2p.stream.H5Stream = h5$.createClass({
	config:null,//配置信息
	statics:null,//统计
	parseUrl:null,
	initData:null,//外部属性初始化
	dataManager:null,//数据管理
	playState:null,//播放状态
	bInfo:null,//浏览器信息
	filehandler:null,//视频转码
	
	mainTimerId:null,
	mainTimerInterval:10,//读取视频的刷新速度
	mediaSource:null,
	video:null,//video对象
	blockContainer:[],//存放block的容器
	sourceGroup:{},
	fileMp4:null,
	connection:null,
	videoStatus:false,
	
	scope:this,
	
	
	__ctor:function()
	{
		this.config = h5$.com.p2p.vo.Config;
		this.initData = h5$.com.p2p.vo.InitData;
		this.playState = h5$.com.utils.PlayStates;
		this.bInfo = h5$.com.utils.BrowserUtils;
		this.statics = h5$.com.p2p.statics.Statics;
		this.fileMp4 = new h5$.com.p2p.ts2mp4.FileHandler();
		this.parseUrl = h5$.com.utils.ParseUrl;
	},
	
	init:function()
	{
		//
//		this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
//		if(this.connection&&this.connection.type == "wifi")
//		{
//			this.initData.P2P_OPEN = true;
//		}
//		else
//		{
//			this.initData.P2P_OPEN = false;
//		}
		this.config.initStatus = true;
		this.config.noChangeTime = this.config.localTime;
		this.config.initFnum = 0;
		var params;
		if(arguments.length>0)//包含参数，处理参数
		{
			params = arguments[0];//提取第一个对象
			for(var arg in params)
			{
				//分析参数到initdata里
				if(this.initData.hasProperty(arg))
				{
					this.initData[arg] = params[arg];
				}
			}
		}
		if(this.initData.gslb !== "")
		{
			this.configParams(this.initData.gslb);
		}
//		this.sendInfo("网络类型："+this.connection);
		this.config.TYPE = this.initData.type;
		if(!this.config.uuid)
		{
			this.config.uuid = this.config.createUUID();
		}
		/**如果是直播设置开始运行时间*/
		if(this.config.TYPE == this.config.LIVE)
		{
			if(this.initData.currentTime<=0)
			{
				this.initData.currentTime = Math.floor(this.config.localTime/1000) - this.initData.livesftime;
				console.log("currentime:",this.initData.currentTime,this.initData.livesftime);
			}
		}
		this.config.ADD_DATA_TIME = this.initData.currentTime;
		///选择播放器播放类型
		var support=this.bInfo.SupportInfo;
		if(support && support.support)
		{
			this.config.PLAY_TYPE = this.config.APPEND_TYPE;
			if(support.encode)
			{
				this.config.isEncode = support.encode;
			}
		}else
		{
			this.config.PLAY_TYPE = this.config.M3U8_TYPE;
		}
		if(this.initData.playType)//外部设定了播放形式
		{
			console.log("强制设定了播放模式为：",this.initData.playType,"(1：使用扩展播放；2：m3u8文件形式播放)");
			if(this.initData.playType < this.config.PLAY_TYPE)
			{
				console.log("你设定的播放模式不支持，请取消设置！");
				return;
			}
			this.config.PLAY_TYPE = Number(this.initData.playType);
			
		}
		console.log("系统版本：",this.bInfo.BrowserInfo.agent,this.bInfo.BrowserInfo.version,this.bInfo.MediaType.m3u8);
		if(this.bInfo.MediaType.m3u8 === false && this.config.PLAY_TYPE == this.config.M3U8_TYPE)
		{
			this.initData.gslb = this.parseUrl.replaceParam(this.initData.gslb,"tss","no");
		}
		if(this.initData.encode)//外部设定了是否解码
		{
			console.log("强制设定了是否解码：",this.initData.encode,"(系统要求："+this.config.isEncode+")");
			this.config.isEncode = this.initData.encode;
		}
		/**创建调度器*/
		if( !this.dataManager )
		{
			this.dataManager = new h5$.com.p2p.manager.DataManager();
			this.dataManager.init();
		}
		if("autoplay" == this.initData.autoplay)
		{
			this.play();
		}
		//发送信息
		var info = {};
		info.code="Video.Player.Init";
		info.info={version:this.config.VERSION,browser:this.bInfo.BrowserInfo,mediasource:this.bInfo.MediaType,uuid:this.config.uuid};
		this.sendInfo(info);
	},
	
	/**播放*/
	play: function () 
	{
		//防止直播重复调用play
		if(this.playState.status == this.playState.PAUSE)//暂停状态，恢复播放
		{
			this.resume();
		}
		else if(this.playState.status == this.playState.PLAY)
		{
			this.pause();
		}
		else
		{
			this.dataManager.startPlay();
			this.startMainTimer();
		}
	},
	/**暂停*/
	pause:function()
	{
		this.playState.status = this.playState.PAUSE;
		if(this.video)
		{
			this.video.pause();
		}
	},
	/**恢复播放*/
	resume:function()
	{
		this.playState.status = this.playState.PLAY;
		if(this.video)
		{
			this.video.play();
		}
	},
	/**seek*/
	seek:function(offset)
	{
		if(typeof(offset)!="number") offset = Number(offset);
		if(this.config.PLAY_TYPE == this.config.M3U8_TYPE)
		{
			this.video.currentTime = offset;
			return;
		}
		this.playState.status = this.playState.SEEKING;
		if(this.config.TYPE == this.config.VOD)
		{
			if(offset < 0) offset=0;
			if(offset >= this.config.lastID &&
			   this.config.lastID != -1) offset = this.config.lastID;
		}
		else
		{
			if(offset>(Math.round(this.config.serverTime/1000)-Number(this.initData.livesftime)) ||
					offset <= 0)
			{
				offset = Math.round(this.config.serverTime/1000)-Number(this.initData.livesftime);
			}
		}

		switch(this.config.PLAY_TYPE)
		{
			case this.config.M3U8_TYPE:
				if(this.video)
				{
					this.video.currentTime = offset;
				}
				break;
			case this.config.APPEND_TYPE:
				//初始化一些参数
				this.config.seekTimeRecord   = offset;
				this.config.bufferLength = 0;
				this.config.BlockID = this.config.preBlockID = -1;
				this.config.isLastData = false;
				this.config.initFnum = 0;
				this.config.seekOK = false;
				this.config.G_SEEKPOS = offset;
				this.config.ADD_DATA_TIME = this.config.seekTimeRecord;
				this.blockContainer = [];  
				var _reload = true;
				
				if (this.mediaSource&&this.mediaSource.readyState == "open") {
					if(this.config.TYPE == this.config.LIVE)
					{//直播处理 
						var _block = this.dataManager.getBlock(this.config.seekTimeRecord); 
						console.log("**seek:",this.config.seekTimeRecord);
						if(_block&&_block.groupID == this.config.currentVid)
						{
							_reload = false;
						}
					}
					else
					{//点播处理
						_reload = false;
					}
				}
				//刷新下载任务
				if(_reload)
				{
					console.log("**reset!");
					this.sourceGroup[this.config.currentVid].abort();
					this.dataManager.reset();
					this.dataManager.startPlay();
				}
				else
				{
					this.sourceGroup[this.config.currentVid].abort();
					this.searchbuffer();
					this.dataManager.seek();
				}
				break;
		}
	},
	replay:function()
	{
		console.log("++重新启动");
		this.playState.status = this.playState.SEEKING;
		this.config.seekTimeRecord   = this.config.ADD_DATA_TIME;
		this.config.preTime = 0;
		this.config.BlockID = this.config.preBlockID = -1;
		this.config.isLastData = false;
		this.config.initFnum = 0;
		this.config.seekOK = false;
		this.config.G_SEEKPOS = 0;
		this.blockContainer = []; 
		this.config.changeGrouID = true;
		this.config.waiting = true;
		if (this.mediaSource&&this.mediaSource.readyState == "open") {
			this.sourceGroup[this.config.currentVid].abort();
		}
		this.config.bufferLength = 0;
		if(this.config.PLAY_TYPE == this.config.M3U8_TYPE)
		{
			this.initData.src = [];
			this.playState.status = this.playState.IDE;
		}
		this.dataManager.reset();
		this.dataManager.startPlay();
	},
	startNewPlay:function(url)
	{
		if(null!== url)
		{
			this.initData.gslb = url;
			if(!this.bInfo.MediaType.m3u8 && this.config.PLAY_TYPE == this.config.M3U8_TYPE)
			{
				this.initData.gslb = this.parseUrl.replaceParam(this.initData.gslb,"tss","no");
			}
		}
		this.config.ADD_DATA_TIME = 0;
		this.replay();
	},
	/**关闭播放*/
	stop:function()
	{
		this.close();
	},
	close:function()
	{
		this.clear();
	},
	clear:function()
	{
		this.stopMainTimer();
		this.blockContainer        = [];
		this.clearMediaSource();
		if(this.video)
		{
			this.removeVideoEvent(this.video);
			this.video     = null;
		}
		this.dataManager.clear();
		this.dataManager = null;
		this.config.reset();
		this.playState.status =this.playState.IDE;
	},
	onLoop:function()
	{
		//不支持mediaSource扩展的时候直接播放m3u8文件
		if(this.config.PLAY_TYPE == this.config.M3U8_TYPE){
			this.playM3u8();
			return;
		}
		//填充播放数据			
		this.appendData();
	},
	//填充数据播放
	appendData: function()
	{		
		//获取数据
		if(!this.config.seekOK)
		{
			this.config.seekOK = true;
			this.blockContainer=[];
		}
		var _streamInfo;
		if(this.blockContainer.length<this.initData.maxts&&
				!this.config.isLastData)
		{
			//二进制播放
			_streamInfo=this.getData();
			if(_streamInfo)
			{
//				console.log("开始预加载！mediasouce播放");
				this.config.preload = true;
				this.blockContainer.push({"segement":_streamInfo.stream,"block":_streamInfo.block});
			}
		}
		if(this.initData.canvas)
		{
			this.playsegment();
		}
		else
		{
			this.playsegmentUsingMediaStream();
		}
	},
	getData:function()
	{
		var _tmpBlock;
		if(!this.dataManager) return null;
		//根据时间获取数据
		if(this.config.G_SEEKPOS !== 0)
		{
			_tmpBlock=this.dataManager.getBlock(this.config.G_SEEKPOS);
		}
		else
		{
			_tmpBlock=this.dataManager.getBlock(this.config.ADD_DATA_TIME);
		}
		
		if(!_tmpBlock ) return null;
		if(this.exitTime((_tmpBlock.id+_tmpBlock.duration/2)))//当前取得时间点已经存在buffer中，忽略重新计算
		{
			console.log("忽略：",_tmpBlock.id,"|",Number(_tmpBlock.id+_tmpBlock.duration),"|",this.config.preTime,"|",this.config.bufferLength);
			if(-1!=_tmpBlock.nextblkid)
			{
				this.config.ADD_DATA_TIME = _tmpBlock.nextblkid;
			}
			else
			{
				if(this.config.TYPE == this.config.VOD)
				{
					this.config.isLastData = true;
				}
			}
			return null;
		}
		this.config.BlockID = _tmpBlock.id;
		if(this.config.preBlockID == _tmpBlock.id)//防止重复添加同一数据
		{
			if(-1!=_tmpBlock.nextblkid)
			{
				this.config.ADD_DATA_TIME = _tmpBlock.nextblkid;
			}else
			{
				if(this.config.TYPE == this.config.VOD)
				{
					this.config.isLastData = true;
				}
			}
			return null;//没有新数据，不处理。
		}
		/**组合block数据给video对象*/
		
		var _bytes = _tmpBlock.getBlockStream();
		if(!_bytes||_bytes.uInt8Array.length === 0)
		{
			//当前数据不可用，更换下一节点
			if(-1!=_tmpBlock.nextblkid&&_tmpBlock.isLoaded == 1)
			{
				this.config.ADD_DATA_TIME = _tmpBlock.nextblkid;
			}
			return null;
		}
		this.config.BlockID = this.config.preBlockID = _tmpBlock.id;
		if(-1 != _tmpBlock.nextblkid)
		{
			this.config.ADD_DATA_TIME = _tmpBlock.nextblkid;
		}
		else
		{
			if(this.config.TYPE == this.config.VOD)
			{
				this.config.isLastData = true;
			}
		}
		var _dur = Number(_tmpBlock.duration)*1000;
		var _stream;
		var _mediatype="video/mp2t";
		var _byte;
		var _offset;
		var _pos;
		var _lastid = false;
		//转封装处理
		_mediatype="video/mp4";
		console.log("-->解码id:",_tmpBlock.id,_dur);
		_stream = this.fileMp4.processFileSegment(_bytes.uInt8Array,{start:_tmpBlock.id,duration:_dur,type:this.initData.canvas,width:_tmpBlock.width,height:_tmpBlock.height},this.config.initFnum,this.config.isEncode);
		_tmpBlock.timestamp = this.fileMp4.startTime;
		this.avccName = this.fileMp4.getMediaStreamAvccName();
		this.config.initFnum++;
		return {"stream":_stream,"block":_tmpBlock};
	},
	playSegment:function()
	{
		console.log("playSegment...");
		var me = this;
		var _box = this.initData.videoContainer;
		var _i;
		if(!_box || this.blockContainer.length == 0) return;//如果不存在加载数据或者不存在容器，直接返回
		//容器里存在2块数据
		if(videoStatus == true) return;
		videoStatus = true;
		if(!this.video)
		{
			this.video = this.createNewVideo();
			while(_box.childNodes.length>0)
			{
				_box.removeChild(_box.childNodes[0]);
			}
			_box.appendChild(this.video);
		}
		var _streamInfo = this.blockContainer.shift();
		this.config.isPlayBlock = _streamInfo.block;
		this.video.src = window.URL.createObjectURL(new Blob([_streamInfo.segement]));
	},
	playsegmentUsingMediaStream:function()
	{
		var me = this;
		var _box = this.initData.videoContainer;
		var _i;
		this.excuteBuffer();
		if(!_box) return;//如果不存在加载数据或者不存在容器，直接返回
		
		if(!this.mediaSource&&this.blockContainer.length>0)
		{
			console.log("创建MediaSource");
			this.sourceGroup = {};
			this.mediaSource = this.createMediaSource();
			if(!this.video)
			{
				this.video = this.createNewVideo();
				this.config.delayTime = 0;
				while(_box.childNodes.length>0)
				{
					_box.removeChild(_box.childNodes[0]);
				}
				_box.appendChild(this.video);
			}
			this.video.src = window.URL.createObjectURL(this.mediaSource);
		}

		if(!this.sourceGroup[this.config.currentVid])
		{
			if(!this.config.currentVid) return;
			this.config.delayTime++;
			if(this.config.delayTime>500)
			{
				console.log("开启MediaSource失败！");
				this.sendInfo("开启MediaSource失败！");
				this.config.delayTime = 0;//转换播放方式；
				this.config.PLAY_TYPE = this.config.M3U8_TYPE;
			}
			return;
		}
		if (this.sourceGroup[this.config.currentVid].updating)//上一块数据还在等待中
		{
			return;
		}
		if(this.video.currentTime!=this.config.preTime)
		{
			this.config.noChangeTime = this.config.localTime;
		}
		//seeking,查询是否存在于buffer中，如果存在直接播放该时间点
		if(this.playState.status == this.playState.SEEKING&&this.exitTime(this.config.seekTimeRecord))
		{
			this.playState.status = this.playState.SEEKED;
		}
		if(this.playState.status == this.playState.SEEKED)
		{
			var _time = this.config.seekTimeRecord - this.config.startTime;
			var _bjTime = 0;
			var _stime = 0;
			var _b = false;
			console.log("**_time=",this.playState.status);
			//检查buffer,找一个最接近_time的时间点
			if(this.config.buffered&&
					this.config.buffered.length>0)
			{
				this.config.bufferGroup = [];
				for(_i=0;_i<this.config.buffered.length;_i++)
				{
					var _start = this.config.buffered.start(_i);
					var _end = this.config.buffered.end(_i);
					this.config.bufferGroup.push([_start,_end]);
					if(_time>=_start&&_time<=_end)
					{
						//存在
						_b = true;
						console.log("**",_time,"|",_start,"|",_end);
						break;
					}
					if(_bjTime<=0||_bjTime > Math.abs(_time -_start))
					{
						_bjTime = Math.abs(_time -_start);
						_stime = _start;
						console.log("**",_time,"|",_start);
					}
				}
			}
			this.playState.status = this.playState.PLAY;
			if(!_b) _time = _stime;
			this.video.currentTime = _time;
			this.video.play();
		}
		
		if((this.config.localTime-this.config.noChangeTime)>this.config.MAX_TIME*1000&&!this.config.isLock&&this.playState.status == this.playState.PLAY)
		{
			this.config.noChangeTime = this.config.localTime;
			this.config.isLock = true;
		}
		if((this.config.refreshTime||
				(this.playState.status == this.playState.PLAY&&this.config.isLock))&&this.config.buffered&&this.config.buffered.length>0)
		{
			if(this.config.isLock)//卡顿
			{
				console.log("卡顿，恢复播放！",this.config.preTime);
				this.video.currentTime =this.config.preTime+0.1;
				this.config.isLock = false;
				this.config.kdTimes++;
				if(this.config.kdTimes >this.config.maxKdTimes)//超出最大卡顿次数
				{
					this.replay();
					return;
				}
			}
			if(this.config.refreshTime)
			{
				console.log("开始播放！");
				this.config.refreshTime = false;
				this.video.currentTime =this.config.buffered.start(0)+0.1;
				this.config.setVideoStartTime(this.config.buffered.start(0));
			}
			this.video.play();
		}
		
		if(this.blockContainer.length>0&&this.config.isWaitData&&(this.config.bufferLength<3||this.playState.status == this.playState.SEEKING))
		{
			var _streamInfo = this.blockContainer[0];
			this.config.isPlayBlock = _streamInfo.block;
			var _dstime = (this.config.isPlayBlock.id*1000-this.config.isPlayBlock.timestamp - this.config.startTime*1000);
//			console.log("*添加数据: bid=",,",",this.config.isPlayBlock.groupID,_dstime,this.config.isPlayBlock.id*1000,this.config.isPlayBlock.timestamp,this.config.startTime);
			if(this.config.currentVid!=this.config.isPlayBlock.groupID ||
					(this.config.startTime !== 0 && Math.abs(_dstime)>this.config.allowDTime))
			{//自然更换groupid时//seek时切换groupID
				if(!this.config.changeGrouID)
				{
					this.config.changeGrouID = true;
					this.config.waiting = true;
				}
			}
			if(this.config.changeGrouID&&
					((this.config.bufferLength<0.2&&
							this.playState.status == this.playState.PLAY)||this.playState.status == this.playState.SEEKING))
			{//等待上一个播放结束，切换下一个
				console.log("*切换groupID::[",this.config.currentVid,"]to[",this.config.isPlayBlock.groupID,"]");
				this.deleteSourceBuffer();
				this.config.currentVid = this.config.isPlayBlock.groupID;
				this.config.changeGrouID = false;
				this.config.waiting = false;
				this.config.refreshTime = true;
				this.config.startBlock = null;
				this.config.startTime = 0;
				var info = {};
				info.code = "Data.Groupid.Change";
				info.info = this.config.currentVid;
				this.sendInfo(info);
				var _addh = this.addMediaSourceHeader();
				if(!_addh)
				{
//					this.playState.status = this.playState.SEEKING;
					return;
				}
			}
			if(this.config.waiting)
			{
				return;
			}
			this.blockContainer.shift();
			this.onMetaData(_streamInfo.block);
			if(!this.config.startBlock&&this.config.TYPE==this.config.LIVE)
			{
				this.config.startBlock = this.config.isPlayBlock;
			}
			try
			{
				this.sourceGroup[this.config.currentVid].appendBuffer(_streamInfo.segement);
				console.log("添加数据:gid:bufferlen:",this.config.bufferLength,",block_len:",this.config.isPlayBlock.duration);
			}
			catch(err)
			{
				console.log("添加数据错误：",this.mediaSource.sourceBuffers.length,err);
				var info = {};
				info.code = "Mobile.Info.Debug";
				info.info = "添加数据错误";
				this.sendInfo(info);
			}
			if(this.playState.status == this.playState.SEEKING)
			{
				this.playState.status = this.playState.SEEKED;
				return;
			}
			this.playState.status = this.playState.PLAY;
		}
	},
	
	onMediaSourceOpen: function()
	{
		if(this.config.TYPE == this.config.VOD)
		{
			this.mediaSource.duration = this.initData.duration;
		}
		this.addMediaSourceHeader();
		this.playsegmentUsingMediaStream();
	},
	addMediaSourceHeader:function()
	{
		var _b = false;
		var typeName = 'video/mp2t; codecs="avc1.64001f"';
		if(this.avccName)
		{	
			if(this.config.isEncode)
			{
				typeName = 'video/mp4; codecs="' + this.avccName + ',mp4a.40.2"';
			}
			else
			{
				typeName = 'video/mp2t; codecs="' + this.avccName;
			}
		}
		var issurport=MediaSource.isTypeSupported(typeName);
//		console.log("mediaHeader:",this.config.currentVid);
		if(this.mediaSource&&!this.sourceGroup[this.config.currentVid])
		{
			var str='id='+this.config.currentVid;
			this.sendInfo(str);
			this.config.buffered = null;
			try
			{
				console.log("*mediaSource:",typeName);
				this.sourceGroup[this.config.currentVid]=this.mediaSource.addSourceBuffer(typeName);
				this.addSourceEvent(this.sourceGroup[this.config.currentVid]);
				_b = true;
			}
			catch(err)
			{
				console.log("*Error:mediaSource");
				this.clearMediaSource();
				_b = false;
			}
			
		}
		return _b;
	},
	deleteSourceBuffer:function()
	{
		console.log("*remove",this.mediaSource.sourceBuffers.length);
		this.removeSourceEvent(this.sourceGroup[this.config.currentVid]);
		this.mediaSource.removeSourceBuffer(this.sourceGroup[this.config.currentVid]);
		this.sourceGroup[this.config.currentVid] = null;
		delete this.sourceGroup[this.config.currentVid];
	},
	createMediaSource:function()
	{
		var _me = this;
		var _media = new MediaSource();
//		var _prefix=['','moz','on'];
		_media.addEventListener('sourceopen',function(){_me.onMediaSourceOpen();});
		_media.addEventListener('sourceended',function(){_me.onMediaSourceEnded();});
		_media.addEventListener('sourceclose',function(){_me.onMediaSourceClosed();});
		_media.addEventListener('error', function(){_me.onUpdateError();});
		return _media;
	},
	clearMediaSource:function()
	{
		if(this.mediaSource)
		{
			var _me = this;
			for(var i in this.sourceGroup)
			{
				if(this.sourceGroup[i]!==null)
				{
					this.removeSourceEvent(this.sourceGroup[i]);
					this.sourceGroup[i] = null;
					delete this.sourceGroup[i];
				}
			}
			this.sourceGroup = {};
			this.mediaSource.removeEventListener('sourceopen', function(){_me.onMediaSourceOpen();});
			this.mediaSource.removeEventListener('sourceended',function(){_me.onMediaSourceEnded();});
			this.mediaSource.removeEventListener('sourceclose',function(){_me.onMediaSourceClosed();});
			this.mediaSource.removeEventListener('error',function(){_me.onMediaSourceClosed();});
			this.mediaSource = null;
		}
	},
	onMediaSourceEnded:function()
	{
		console.log("source ended!");
	},
	onMediaSourceClosed:function()
	{
		this.config.buffered = null;
		console.log("source closed!");
	},
	onUpdateStart:function()
	{
		this.isWaitData = false;
	},
	onUpdate:function()
	{
//		console.log("-->update");
	},
	onUpdateEnd:function()
	{
		if(!this.sourceGroup[this.config.currentVid])
		{
			return;
		}
		this.config.isWaitData = true;
		this.config.buffered = this.sourceGroup[this.config.currentVid].buffered;
		if(this.config.buffered &&
				this.config.buffered.length>0)
		{	
			for(var i=0;i<this.config.buffered.length;i++)
			{
				console.log("**buffer: start:",this.config.buffered.start(i),",end:",this.config.buffered.end(i));
			}
		}
	},
	onUpdateError:function()
	{
		console.log("-->error:",arguments.length);
	},
	addSourceEvent:function(source)
	{
		var me=this;
		source.addEventListener('updateend', function(){me.onUpdateEnd();});
		source.addEventListener('update', function(){me.onUpdate();});
		source.addEventListener('updatestart', function(){me.onUpdateStart();});
		source.addEventListener('error', function(){me.onUpdateError();});
	},
	removeSourceEvent:function(source)
	{
		var me=this;
		source.removeEventListener('updateend', function(){me.onUpdateEnd();});
		source.removeEventListener('update', function(){me.onUpdate();});
		source.removeEventListener('updatestart', function(){me.onUpdateStart();});
		source.removeEventListener('error', function(){me.onUpdateError();});
	},
	excuteBuffer:function()
	{
		if((this.config.localTime-this.config.buffer_gtime)<100)
		{
			return;
		}
		this.config.buffer_gtime = this.config.localTime;
		this.searchbuffer();
	},
	searchbuffer:function()
	{
		if(this.currentTime != this.config.preTime)
		{
			var info={};
			info.info=(this.config.TYPE == this.config.VOD?0:2);
			info.code="Stream.Play.Time";
			this.sendInfo(info);
		}
		if(this.config.APPEND_TYPE == this.config.PLAY_TYPE && this.video && this.playState.status == this.playState.PLAY)
		{
			var _st = 0;
			var _ed = 0;
			if(this.video)
			{
				if(this.playState.status == this.playState.SEEKING)
				{
					this.config.preTime = this.config.seekTimeRecord;
				}
				else
				{	
					this.config.preTime = this.video.currentTime;
				}
			}
			if(this.config.buffered)
			{	
				for(var i=0;i<this.config.buffered.length;i++)
				{
					_st = this.config.buffered.start(i);
					if(_st<1){_st = 0;}
					_ed = this.config.buffered.end(i);
					if(_st<=this.config.preTime&&_ed>=this.config.preTime)
					{
						this.config.bufferLength=(_ed-this.config.preTime);
//						console.log("++buffer=",this.config.bufferLength);
						break;
					}
				}	
			}
			else
			{
				this.config.bufferLength = 0;
			}
//			if(this.config.TYPE==this.config.LIVE&&this.liveTime.lastLocationTime<=0)
//			{//如果是直播在开始时间不存在的时候纪录开始播放时间点，用来与加入的第一个节点时间匹配，换算成进度时间
//				this.liveTime.SetLastTime();
//			}
			//判断视频是否结束
			if(this.config.isLastData &&
					this.config.temp_len == this.config.bufferLength &&
					this.config.temp_len>-1)
			{
				this.isOver();
			}
			this.config.temp_len = this.config.bufferLength;
			//对外时间广播
			
		}
	},
	isOver:function()
	{
		var _id=-1;
		if(this.config.isPlayBlock)
		{
			_id = this.config.isPlayBlock.id;
		}
		if(this.config.lastID>0 &&
				this.config.lastID == _id &&
				this.config.isLastData)
		{
			//播放结束
			console.log("播放结束",_id,"lastid=",this.config.lastID,this.config.isLastData);
			if("loop" == this.initData.loop)
			{
				//重播
				this.config.isLastData = false;
				this.seek(0);
			}
			else
			{
				this.stop();
			}
		}
	},
	onMetaData: function (block)
	{
		if(!block) return;
		var info={};
		info.code = "Play.Start.Block";
		info.info={"id":block.id,"range":block.pieceIdxArray};
		this.sendInfo(info);
		///////
		var _metaData = this.config.metaData || {};
		if( block &&
			_metaData.groupID == block.groupID && 
			_metaData.width == block.width && 
			_metaData.height == block.height )return;
		
		if( block )
		{
			_metaData.groupID = block.groupID;
			_metaData.width = block.width;
			_metaData.height = block.height;
			if(this.config.TYPE != this.config.LIVE )
			{
				_metaData.duration = this.initData.duration;
				_metaData.mediaDuration = this.initData.mediaDuration;
				this.config.DATA_RATE = Math.round(this.initData.totalSize*8/this.initData.duration/1024);
			}
			this.config.metaData = _metaData;
		}
		this.sendInfo({"code":"Stream.Play.Start","info":_metaData});
		//
	},
	//启动定时器
	startMainTimer:function( time )
	{
		var me = this;
		
		this.mainTimerInterval = time || this.mainTimerInterval;
		this.onLoop();
		this.stopMainTimer();
		this.mainTimerId = setInterval(function(){
			me.onLoop();
		},this.mainTimerInterval);
		
	},
	stopMainTimer:function()
	{
		if( this.mainTimerId )
		{
			clearInterval( this.mainTimerId );
			this.mainTimerId = null;
		}
	},
	playM3u8:function()
	{
		if(this.playState.status != this.playState.IDE){return;}
		if(this.initData.src&&this.initData.src.length>0)
		{
//			console.log("CDN:",this.initData.src);
			var _box = this.initData.videoContainer;
			if(_box)
			{
				if(!this.video)
				{
					this.video = this.createNewVideo();
					this.video.autoplay = this.initData.autoplay;
					while(_box.childNodes.length>0)
					{
						_box.removeChild(_box.childNodes[0]);
					}
					_box.appendChild(this.video);
					this.addVideoEvent(this.video);
				}
				this.initData.currentSrc = this.initData.src[0].location;
				this.playState.status = this.playState.PLAY;
				this.video.src = this.initData.currentSrc;
			}
		}
	},
	
	//增加视频容器监听
	addVideoEvent:function(video)
	{
		var _me = this;
		var _ve = this.playState.VideoEvent;
		for(var i=0;i<_ve.length;i++)
		{
			video.addEventListener(_ve[i],function(evt){_me.videoStatusHandler(evt);});
		}
	},
	removeVideoEvent:function(video)
	{
		var me = this;
		var _ve = this.playState.VideoEvent;
		for(var i=0;i<_ve.length;i++)
		{
			video.removeEventListener(_ve[i],function(evt){_me.videoStatusHandler(evt);});
		}
	},
	//设置视频属性
	setVideoProperty:function()
	{
		if(this.video)
		{
			this.video.muted = this.initData.muted;
			this.video.volume = this.initData.volume;
		}
	},
	videoStatusHandler:function(evt)
	{
		var _type=evt.type;
//		this.dispatchEvent({type:'status', message: {"code":_type}});
//		console.log("--->event:",_type);
		switch(_type)
		{
			case "abort":
				break;
			case "canplay":
				//设置视频属性
				this.setVideoProperty();
				break;
			case "canplaythrough":
				break;
			case "durationchange":
				break;
			case "emptied":
				break;
			case "ended":
				break;
			case "error":
				break;
			case "loadeddata":
				break;
			case "loadedmetadata":
				break;
			case "loadstart":
				break;
			case "pause":
				break;
			case "play":
				break;
			case "playing":
				break;
			case "progress":
				break;
			case "ratechange":
				break;
			case "seeked":
				break;
			case "seeking":
				break;
			case "stalled":
				break;
			case "suspend":
				break;
			case "timeupdate":
				if(this.config.PLAY_TYPE == this.config.M3U8_TYPE)
				{
					this.searchbuffer();
				}
				break;
			case "volumechange":
				break;
			case "waiting":
				//等待新数据
//				this.isOver();
				break;
		}
	},
	createNewVideo:function()
	{
		var newVideo=document.createElement("video");
		this.addVideoEvent(newVideo);
		newVideo.id="player";
		newVideo.width = this.initData.width;
		newVideo.height = this.initData.height;
		newVideo.setAttribute("webkit-playsinline",this.initData.inline);
		newVideo.controls=this.initData.controls;
		newVideo.loop=this.initData.loop;
		return newVideo;
	},
	sendInfo:function(value)
	{
		if(this.statics)
		{
			var info = {};
			if(typeof(value) == "string")
			{
				info.code = "Mobile.Info.Debug";
				info.info = value;
				this.statics.sendToJs(info);
			}
			else
			{
				this.statics.sendToJs(value);
			}
			
		}
	},
	
	//seeking计算时间点是否存在于buffer中
	exitTime:function(value)
	{
//		console.log("++exit ID:",id);
		var b = false;
		for(var i = 0;i<this.config.bufferGroup.length;i++)
		{
			var _start = this.config.bufferGroup[i][0];
			var _end = this.config.bufferGroup[i][1];
			//
			if(value>=_start&&value<=_end)
			{
				b = true;
				break;
			}
		}
		return b;
	},
	//get set 方法
	/////////////////外部接口
	setter_fullscreen:function(value)
	{
		if(true === value&&this.video)
		{
			if(this.video.requestFullscreen)
			{
				this.video.requestFullscreen();
			}
			else if(this.video.mozRequestFullScreen)
			{
				this.video.mozRequestFullScreen();
			}
			else if(this.video.webkitRequestFullScreen)
			{
				this.video.webkitRequestFullScreen();
			}
			else if(this.video.msRequestFullscreen)
			{
				this.video.msRequestFullscreen();
			}
			this.initData.fullscreen = true;
		}
	},
	getter_fullscreen:function()
	{
		return this.initData.fullscreen;
	},
	
	getter_videotime:function()
	{
		if(this.video)
		{
			return this.video.currentTime;
		}
		return 0;
	},
	getter_totalbytes:function()
	{
		return this.initData.totalSize;
	},
	getter_loadedpercent:function()
	{
		if(this.config.PLAY_TYPE == this.config.M3U8_TYPE)
		{
			return parseInt(this.currentTime*10000/this.initData.duration)/100;
		}
		var bfb=0;
		bfb = parseInt(this.config.ADD_DATA_TIME*10000/this.initData.duration)/100;
		return bfb;
	},
	//是否自动播放设置
	setter_autoplay:function(value)
	{
		console.log("set params:",value);
		this.initData.autoplay = value;
	},
	getter_autoplay:function()
	{
		console.log("get params:",this.initData.autoplay);
		return this.initData.autoplay;
	},
	//是否显示控制条
	setter_controls:function(value)
	{
		console.log("set params:",value);
		this.initData.controls = value; 
	},
	getter_controls:function()
	{
		console.log("get params:",this.initData.controls);
		return this.initData.controls;
	},
	//设置视频高度
	setter_height:function(value)
	{
		console.log("set params:height=",value);
		this.initData.height=Number(value);
		this.resize();
	},
	getter_height:function()
	{
		console.log("get params:",this.initData.height);
		return this.initData.height;
	},
	//
	getter_videoHeight:function()
	{
		if(this.video)
		{	
			return this.video.videoHeight;
		}
		return 0;
	},
	getter_videoWidth:function()
	{
		if(this.video)
		{
			return this.video.videoWidth;
		}
		return 0;
	},
	//设置视频宽度
	setter_width:function(value)
	{
		console.log("set params:width=",value);
		this.initData.width=Number(value);
		this.resize();
	},
	getter_width:function()
	{
		console.log("get params:",this.initData.width);
		return this.initData.width;
	},
	
	//调整视频尺寸
	resize:function(iw,ih)
	{
		if(iw){this.initData.width = iw;}
		if(ih){this.initData.height = ih;}
		if(this.video)
		{
			console.log("size:",this.initData.width,",",this.initData.height);
			this.video.width = this.initData.width;
			this.video.height = this.initData.height;
		}
	},
	
	//设置视频播放地址
	setter_src:function(value)
	{
		if(this.src==value)
		{
			return;
		}
		if(typeof(value) == "string")
		{
			this.initData.src = [value];
		}
		else
		{
			this.initData.src=value;
		}
	},
	getter_src:function()
	{
		console.log("get params:",this.initData.currentSrc);
		return this.initData.currentSrc;
	},
	//setGslbURL
	setter_gslb:function(value)
	{
		this.initData.gslb = value;
		this.configParams(value);
		if(this.config.initStatus)//重新加载视频地址
		{
			this.startNewPlay();
		}
	},
	getter_gslb:function()
	{
		return this.initData.gslb;
	},
	configParams:function(param)
	{
		this.config.TERMID = this.parseUrl.getParam(param,"termid");
		this.config.PLATID = this.parseUrl.getParam(param,"platid");
		this.config.SPLATID = this.parseUrl.getParam(param,"splatid");
		this.config.VTYPE = this.parseUrl.getParam(param,"vtype");
	},
	//设置是否播放结束重播
	setter_loop:function(value)
	{
		console.log("set params:",value);
		this.initData.loop = value;
	},
	getter_loop:function()
	{
		console.log("get params:",this.initData.loop);
		return this.initData.loop;
	},
	//geo
	setter_geo:function(value)
	{
		this.initData.geo=value;
	},
	getter_type:function(value)
	{
		return this.initData.type;
	},
	setter_type:function(value)
	{
		this.initData.type = value;
	},
	
	//返回当前是否静音
	getter_muted:function()
	{
		return this.initData.muted;
	},
	setter_muted:function(value)
	{
		this.initData.muted = value;
		if(this.video)
		{
			this.video.muted=value;
		}
	},
	//音量设置
	getter_volume:function()
	{
		return Number(this.initData.volume);
	},
	setter_volume:function(value)
	{
		var vol = Number(value);
		if(vol>1)
		{
			vol = 1;
		}
		if(vol<0)
		{
			vol =0;
		}
		this.initData.volume=vol;
		if(this.video)
		{
			this.video.volume = vol;
		}
	},
	//设置视频容器的div
	setter_videoContainer:function(value)
	{
		this.initData.videoContainer = value;
	},
	getter_videoContainer:function()
	{
		return this.initData.videoContainer;
	},
	
	setter_livesftime:function(value)
	{
		this.initData.livesftime=value;
	},
	getter_livesftime:function()
	{
		return this.initData.livesftime;
	},
	
	setter_adremainingtime:function(value)
	{
		this.adRemainingTime = parseInt(value)*1000;
		this.initData.setAdRemainingTime(this.adRemainingTime);
	},
	getter_adremainingtime:function()
	{
		return this.adRemainingTime;
	},
	getter_groupid:function()
	{
		return this.config.currentVid;
	},
	setter_callback:function(value)
	{
		this.initData.callback = value;
	},
	//p2p
	setter_wss:function(value)
	{
		if(value == "true" || value == "1")
		{
			this.initData.wss = true;
		}
		else
		{
			this.initData.wss = false;
		}
//		console.log("wss=",this.initData.wss);
	},
	setter_wrtc:function(value)
	{
		if(value == "true" || value == "1")
		{
			this.initData.wrtc = true;
		}
		else
		{
			this.initData.wrtc = false;
		}
	},
	//视频时间
	setter_currentTime:function(value)
	{
		this.initData.currentTime = value;
	},
	getter_currentTime:function()
	{
		if(this.playState.status == this.playState.SEEKING)
		{
			return this.config.seekTimeRecord;
		}
		var _currentTime=0;
		if(this.video)
		{	
			switch(this.config.PLAY_TYPE)
			{
				case this.config.APPEND_TYPE:
					if(this.config.TYPE==this.config.VOD)
					{
						_currentTime = this.video.currentTime;
					}
					else
					{
						_currentTime = this.config.startTime + this.video.currentTime;
					}
					
					break;
				case this.config.M3U8_TYPE:
					_currentTime = this.video.currentTime;
					break;
			}
		}
		return parseInt(_currentTime);
	},
	//获得视频总时间
	getter_duration:function()
	{
		if(this.config.PLAY_TYPE==this.config.M3U8_TYPE&&this.video)
		{
			return this.video.duration;
		}
		return this.initData.duration;
	},
	
	getter_bufferLength:function()
	{
		return this.config.bufferLength;
	},
	
	setter_vartype:function(value)
	{
		this._varType = value;
	},
	getter_varType:function()
	{
		return this._varType;
	},
	
	getter_blockid:function()
	{
		if(this.config.isPlayBlock)
		{
			return this.config.isPlayBlock.id;
		}
		return 0;
	},
	
	setter_isProxy:function(value)
	{
		if(value == "1")
		{
			this.initData.isProxy = true;
		}
		else
		{
			this.initData.isProxy = false;
		}
	},
	getter_p1:function()
	{
		return this.initData.p1;
	},
	getter_p2:function()
	{
		return this.initData.p2;
	},
	getter_p3:function()
	{
		return this.initData.p3;
	},
	getter_ch:function()
	{
		return this.initData.ch;
	},
	setter_p1:function(value)
	{
		this.initData.p1 = value;
	},
	setter_p2:function(value)
	{
		this.initData.p2 = value;
	},
	setter_p3:function(value)
	{
		this.initData.p3 = value;
	},
	setter_ch:function(value)
	{
		this.initData.ch = value;
	},
	setter_serverurl:function(value)
	{
		this.initData.serverurl = value;
	},
	setter_iceserver:function(value)
	{
		this.initData.iceserver = value;
	},
	setter_playType:function(value)
	{
		this.initData.playType = value;
	},
	setter_encode:function(value)
	{
		this.initData.encode = value;
	}
});
/**
 * 
 */
h5$.nameSpace("com.p2p.manager");
h5$.com.p2p.manager.DataManager = h5$.createClass({
	statics:null,
	config:null,
	initData:null,
	parseUrl:null,
	
	m3u8Loader:null,
	loadManager:null,
	groupList:null,
	
	__ctor:function()
	{
		this.statics = h5$.com.p2p.statics.Statics;
		this.config = h5$.com.p2p.vo.Config;
		this.initData = h5$.com.p2p.vo.InitData;
		this.parseUrl = h5$.com.utils.ParseUrl;
		var _params = {dataManager:this,config:this.config,initData:this.initData,statics:this.statics,parseUrl:this.parseUrl};
		this.groupList = new h5$.com.p2p.data.GroupList(_params);
		this.loadManager = new h5$.com.p2p.loaders.LoadManager(_params);
		this.m3u8Loader = new h5$.com.p2p.loaders.M3u8Loader(_params);
	},
	init:function()
	{
		this.groupList.init();
		this.m3u8Loader.init();
		this.loadManager.init();
	},
	startPlay:function()
	{
		if(this.config.PLAY_TYPE != this.config.M3U8_TYPE)
		{
			this.loadManager.start();
		}
		this.m3u8Loader.start();
	},
	seek:function()
	{
		this.loadManager.start();
	},
	addBlock:function (clipList)
	{
		//把m3u8数据列表放到grouplist中，并在groupIDlist中标记
		var _len = clipList.length;
		if(_len > 0)
		{
			for( var i = 0; i < _len; i++ )
			{
				if(i<_len-1)
				{
					clipList[i].nextID = clipList[i+1].timestamp;
				}
				this.groupList.addBlock(clipList[i]);
			}
		}
		if(this.config.TYPE == this.config.VOD)
		{
			this.config.lastID = clipList[_len-1].timestamp;
		}
	},
	getBlock:function(id)
	{
		if (!this.groupList) return null;
		//获得block group相关信息
		var _blockID = this.groupList.getBlockId(id);
		if(!_blockID) return null;
//		console.log("**datamanager--id",id);
		
		this.config.G_SEEKPOS = 0;
		return this.groupList.getBlock(_blockID);
	},
	getTNRange:function(groupID)
	{
		if(this.groupList) return this.groupList.getTNRange(groupID);
		return null;
	},
	
	getPNRange:function(groupID)
	{
		if(this.groupList) return this.groupList.getPNRange(groupID);
		return null;
	},
	getPiece:function(param)
	{
		if (this.groupList) return this.groupList.getPiece(param);
		return null;
	},
	getBlockArray:function()
	{
		if(this.groupList) return this.groupList.getBlockArray();
		return null;
	},
	getGroupIDList:function()
	{
		if(this.groupList) return this.groupList.getGroupIDList();
		return null;
	},
	getP2PTask: function ( value )
	{
		if(this.loadManager) return this.loadManager.getP2PTask(value);
		return null;
	},
	getEmptyBlock:function()
	{
		var _arr = [];
		if(this.groupList){
			_arr = this.groupList.getBlockArray();
		}
		var _len = _arr.length;
		if(_len === 0) return 0;
		var _index = _len;
		var _scope = this;
		_arr.some(function (value, index, array) {
			if(value > _scope.config.ADD_DATA_TIME){
				_index = index;
				return index;
			}
		});
		return _len - _index;
	},
	reset:function()
	{
		this.m3u8Loader.reset();
		this.groupList.reset();
		this.loadManager.init();
	}
});/**
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
		this.playsegmentUsingMediaStream();
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
		_stream = this.fileMp4.processFileSegment(_bytes.uInt8Array,{start:_tmpBlock.id,duration:_dur,type:this.config.PLAY_TYPE,width:_tmpBlock.width,height:_tmpBlock.height},this.config.initFnum,this.config.isEncode);
		_tmpBlock.timestamp = this.fileMp4.startTime;
		this.avccName = this.fileMp4.getMediaStreamAvccName();
		this.config.initFnum++;
		return {"stream":_stream,"block":_tmpBlock};
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
});/**
 * 统计，广播，发送接口
 */
h5$.nameSpace("com.p2p.statics");
h5$.com.p2p.statics.Statics = {
	initData:null,
	config:null,
	processReport:null,
	
	p2pSize:0,
	cdnSize:0,
	shareSize:0,
	/**按groupID生成的统计单元列表*/
	staticsElementList:{},
	tempStaticsElement:null,
	connectPeerSuccess:false,
	
	P2PDownloadPieceNum:0,
	CDNDownloadPieceNum:0,
	P2PSharePieceNum:0,
	chk0:0,//心跳周期内校验通过 piece 的数量
	chk1:0,//心跳周期内未知下载来源的 piece 校验失败数
	chk2:0,//心跳周期内 CDN 下载的 piece 校验失败数
	chk3:0,//rtmfp
	chk4:0,//utp
	chk5:0,//心跳周期内 CDE P2P 下载的 piece 校验失败数
	
	//发送给页面的数据
	sendToJs:function(value)
	{
		if(!this.initData)
		{
			this.initData = h5$.com.p2p.vo.InitData;
		}
		if(this.initData.callback)
		{
			this.initData.callback(value);
		}
	},
	peerInfo:function(obj,snodes,tnodes,gid,type)
	{
		var info = {};
		info.code = "P2P.Peer.Nodes";
		info.info = {type:type,"data":obj};
		this.sendToJs(info);
		if(type=="cdn") return;
		this.tempStaticsElement = this.staticsElementList[gid];
		if(this.tempStaticsElement)
		{
			this.tempStaticsElement.getNeighbor(snodes,tnodes);
		}
	},
	httpGetData:function(id,begin,end,size,gID)
	{
		this.tempStaticsElement = this.staticsElementList[gID];
		if( this.tempStaticsElement )
		{
			this.tempStaticsElement.httpGetData(id,begin,end,size);
		}
		this.CDNDownloadPieceNum++;
	},
	P2PGetData:function(id,begin,end,size,peerID,gID,clientType,protocol)
	{
		this.tempStaticsElement = this.staticsElementList[gID];
		if(this.tempStaticsElement )
		{
			this.tempStaticsElement.P2PGetData(id,begin,end,size,peerID,clientType,protocol);
		}
		this.P2PDownloadPieceNum++;
	},
	P2PRepeatLoad:function()
	{
		
	},
	deleteP2P:function(gID)
	{
		
	},
	createP2P:function(gID)
	{
		console.log("-->creatStatisticByGroupID--",gID);
		if(!this.config){
			this.config = h5$.com.p2p.vo.Config;
		}
		if(!this.initData){
			this.initData = h5$.com.p2p.vo.InitData;
		}
		var _params = {groupID:gID,statics:this,initData:this.initData,config:this.config};
		if(!this.processReport)
		{
			this.processReport = new h5$.com.p2p.statics.ProcessReport(_params);
			this.processReport.init();
		}
		_params = {groupID:gID,statics:this,processReport:this.processReport,config:this.config};
		if( !this.staticsElementList[gID] )
		{
			this.staticsElementList[gID] = new h5$.com.p2p.statics.StaticsElement(_params);
			this.staticsElementList[gID].start();
			this.loadXMLSuccess(gID);
		}
	},
	gatherStart:function(value)
	{
//		console.log("static:",value);
	},
	gatherSuccess:function(value)
	{
		console.log("-->gatherSuccess");
		this.tempStaticsElement = this.staticsElementList[value.groupID];
		if( this.tempStaticsElement )
		{
			this.tempStaticsElement.gatherSuccess(value.gatherName,value.gatherPort);
		}
	},
	selectorSuccess:function(gID)
	{
		console.log("-->selectorSuccess");
		this.tempStaticsElement = this.staticsElementList[gID];
		if( this.tempStaticsElement )
		{
			this.tempStaticsElement.selectorSuccess();
		}
	},
	checkSumFailed:function(value)
	{
		var info = {};
		info.code = "P2P.Info.Debug";
		info.info = value;
		this.sendToJs(info);
	},
	addSize:function(value)
	{
		var size = value.size;
		var type = value.type;
		switch(type)
		{
			case 'cdn':
			case 'http':
				this.cdnSize+=Number(size);
				break;
			case 'share':
				this.shareSize+=Number(size);
				break;
			default:
				this.p2pSize+=Number(size);
				break;
		}
	},
	loadXMLSuccess:function(groupid)
	{
		console.log("-->loadXMLSuccess--",groupid);
		this.tempStatisticsElement = this.staticsElementList[groupid];
		if( this.tempStatisticsElement )
		{
			this.tempStatisticsElement.loadXMLSuccess();
		}
	}
};/**
 * 
 */
h5$.nameSpace('com.p2p.vo');
h5$.com.p2p.vo.Config = {
		/**当前播放的类型*/
		LIVE: "LIVE",//直播
		VOD: "VOD",//点播
		TYPE: "VOD",//VOD,
		
		TERMID:"1",
		PLATID:"",
		SPLATID:"",
		VTYPE:"",
		/**内核版本号*/
		VERSION:"h5.1.0.01140437",
		/**P2P协议版本号 */
		P2P_AGREEMENT_VERSION:   "1.3m3u8_12272000",//"1.3m3u8_12111859",//"1.3m3u8_11151520",//"1.3m3u8_11051326",//0909122->加removeHaveData功能
		
		G_SEEKPOS:0,//seek时间设定
		ADD_DATA_TIME:0,//添加数据时间
		MAX_TIME:5,//卡顿时长判断
		M3U8_MAXTIME:-1,
		M3U8_LAST_BLOCKID:-1,
		DATA_RATE:-1,//vod视频的码率
		
		PLAY_TYPE:0,//播放类型设定
		APPEND_TYPE:1,//二进制方式
		M3U8_TYPE:2,//播放m3u8文件方式
		
		P2P_OPEN:true,//p2p控制开关
		CDN_OPEN:true,//cdn控制开关
		All_P2P:false,//p2p下载忽略紧急区
		MAX_GAP:20,//允许两个切片之间的最大时间间隔
		
		/**p2p*/
		MAX_PEERS:10,//p2p节点限制个数
		DAT_BUFFER_TIME:10,
		DAT_BUFFER_TIME_LEVEL1:-1,
		IS_SHARE_PEERS:true,
		CDN_START_TIME:-1,
		BAD_PEER_TIME:0.5*60*1000,//连接失败节点保存时间
		bufferGroup:[],
		//直播时间处理
		timeShift:0,
		videoTime:0,//设置视频开始对应的直播时间
		startBlock:null,//第一个加入播放的block
		startTime:0,//直播开始时间点设置
		allowDTime:50000,//直播时允许和开始点的误差，超过该值认为不是同一视频
		
		uuid:null,
		metaData:{},//视频的相关信息
		//
		TaskCache:null,//加载任务
		streamSize:0,//加载数据
		nextConnectionId:1,
		kdTimes:0,//卡顿次数
		maxKdTimes:5,//连续调试最大次
		
		//视频数据记录
		initStatus:false,//是否首次初始化播放器
		bufferLength:-1,//当前视频缓冲时间长度
		allowCacheLength:10,//允许缓冲区的时长，单位秒
		maxstep:30,
		temp_len:-1,
		preBlockID:null,//上一个添加blockid
		BlockID:null,//当前播放blockid
		isPlayBlock:null,//当前添加到缓冲里的block
		lastID:-1,//最后一个TS的ID
		changeGrouID:null,//准备更换的goupid
		waiting:false,
		currentVid:null,//当前播放Vid
		isLock:false,//是否卡主了
		refreshTime:true,//是否刷新时间
		isLastData:false,//是否是最后一块数据
		preload:false,//是否预加载下一块数据
		initFnum:0,//fmp4切片编号
		delayTime:0,//等待开启mediaSource计时
		noChangeTime:0,
		preTime:0,
		seekTimeRecord:0,
		buffered:null,//缓冲队列里的开始时间
		isWaitData:true,//是否等待数据添加
		isEncode:false,//是否需要解码封装
		seekOK:false,
		buffer_gtime:0,//计算buffer长度的时间
		///m3u8loaderparams
		m3u8_gaps:3000,//M3u8加载定时
		m3u8_out_time:15000,//M3u8加载超时时间
		m3u8_loading:false,
		cdn_idx:0,
		cdnRetry:0,//cdn重试次数
		cdnMaxRetry:3,//每个cdn重试次数；
		gslbRetry:0,//调度重试次数
		gslbMaxRetry:3,//调度最大重试次数
		g_bVodLoaded:false,
		//
		/**系统本地时间*/
		get localTime()
		{
			return Math.floor((new Date()).getTime());
		},
		/**内存中允许视频的最大存放字节*/
		get MEMORY_SIZE()
		{
			if( this.TYPE == this.VOD )
			{
				return 300*1024*1024;
			}
			return 100*1024*1024;
		},
		createUUID:function()
		{
			var _uuid =  this.localTime.toString(16);
			while(_uuid.length<40){
				_uuid += parseInt(Math.random()*10000000).toString(16);
			}
			_uuid =_uuid.substr(0,40);
			return _uuid;
		},
		setVideoStartTime:function(videoTime)
		{
			if(this.startBlock)
			{
				this.startTime = Number(this.startBlock.id) - videoTime;
			}
		},
		set serverTime(value)
		{
			this.timeShift = Number(value) - this.localTime;
		},
		get serverTime()
		{
			return this.localTime + this.timeShift;
		},
		reset:function()
		{
			
		}
};/**
 * 接受和保存一些flashvar参数
 */
h5$.nameSpace('com.p2p.vo');
h5$.com.p2p.vo.InitData = {
		autoplay:"",//是否自动播放
		controls:"controls",//是否显示控制条
		currentSrc:null,//当前视频播放地址
		currentTime: 0,//当前播放时间设定
		callback:null,//回调方法
		maxts:1,//cdn加载区的ts个数
		duration:0,//视频总时长设定
		mediaDuration:-1,
		encode:null,//是否强制解码
		fullscreen:false,
		groupName:'',//groupName
		gslb: "",//调度地址
		geo:null,
		isProxy:false,
		iceServer:"stun:111.206.210.143:8120",//"",stun:23.21.150.121?transport=udp//webRTC服务的ice地址
		loop:"loop",//是否循环
		livesftime:30,
		muted:false,
		playlevel:4,
		playType:null,
		paused:false,//是否暂停
		seeking:false,
		src: [],//cdn地址
		serverurl:"ws://123.125.89.101:3852",//",//webRTC链接的websocket服务地址
		type:'VOD',
		totalSize: 0,//视频大小
		videoWidth:400,
		videoHeight:300,
		volume:1,
		videoContainer:null,
		width:400,//视频宽度
		height:300,//视频高度
		wss:true,//开启websocket p2p功能
		wrtc:true,//开启webRTC p2p功能
		inline:"",
		//上报参数
		appid:"800",
		ch:"",
		p1:"0",
		p2:"06",
		p3:"001",
		vformat:"lm3u8",
};/**
 * 
 */
h5$.nameSpace("com.p2p.statics");
h5$.com.p2p.statics.ProcessReport = h5$.createClass(
{
	/**
	 * config,
	 * groupID
	 * initData
	 * */
	isDebug:true,
	stagePath:"http://s.webp2p.letv.com/ClientStageInfo?",
	
	/**
	 * 保存过程上报的起始时间，当Statistics被实例化时取一次时间值付给progressReportTime，当发生第一次过程上报时
	 * 再取一次时间与之相减，得到的时间差即为本次过程上报的耗时，并将新取得时间值付给_progressReportTime，
	 * 当下一个过程事件发生时重复上述操作，从而得到每一个过程上报的时间值，因为过程上报的每一个事件都是按顺序执行的，
	 * 所以上报的耗时可认为是准确的（P2P.LoadXML.Success事件需单独统计耗时，因为该事件与P2P.P2PNetStream.success之后的
	 * 时间并行发生）
	 * */
	progressReportTime:0,
	/**
	 * progressReportObj对象保存过程上报的事件类型，并记录该事件是否已经上报过
	 * 过程上报分为内部上报和外部上报；
	 * P2P.P2PNetStream.success：   P2P内核第一次执行play()操作时上报（内部上报）
	 * P2P.LoadCheckInfo.Success：  第一次下载DESC时上报（内、外部上报）
	 * P2P.selectorConnect.Success：第一次成功连接selector时上报（内、外部上报）
	 * P2P.rtmfpConnect.Success：   第一次成功连接rtmfp时上报（内、外部上报）
	 * P2P.gatherConnect.Success：  第一次成功连接gather时上报（内、外部上报）
	 * P2P.P2PGetChunk.Success：    第一次从p2p获得数据时上报（内、外部上报）
	 * 以上事件只上报一次。
	 * */
	progressReportObj:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.progressReportObj = {
			"P2P.P2PNetStream.Success":true,
			"P2P.LoadXML.Success":true,
			"P2P.SelectorConnect.Success":true,
			"P2P.RtmfpConnect.Success":true,
			"P2P.GatherConnect.Success":true,
			"P2P.CDE.Tracker":true,
			"P2P.P2PGetChunk.Success":true
		};
		this.progressReportTime = this.config.localTime;
	},
	/**
	 * 负责上报关于P2P过程的相关信息给播放器
	 * 每次调用dispatchProgressEvent时，都依具info.act在progressReportObj中查找是否有相关属性，如果找到
	 * 相关属性则说明需要将此事件上报，同时将该属性从progressReportObj中删除，保证相同的事件只上报一次。
	 * */ 
	progress:function(obj)
	{
		if(obj.code && this.progressReportObj[obj.code])
		{			
			/**该过程没有上报过*/
			this.progressReportObj[obj.code] = false;
		}
		else
		{
			/**该过程已经上报过*/
			return;
		}
		var _act = -1;
		var _err = 0;
		var _IP = "0";
		var _Port  = 0;
		
		switch(obj.code)
		{
		case "P2P.P2PNetStream.Success":
			_act = 0;
			break;
		case "P2P.LoadXML.Success":
			_act = 1;
			break;
		case "P2P.LoadXML.Failed":
			_act = 1;
			_err = 1;
			break;
		case "P2P.SelectorConnect.Success":
			_act = 2;
			break;	
		case "P2P.RtmfpConnect.Success":
			_act = 3;
			_IP = obj.ip;
			_Port = obj.port;
			break;
		case "P2P.GatherConnect.Success":
			_act = 4;
			_IP = obj.ip;
			_Port = obj.port;
			break;
		case "P2P.P2PGetChunk.Success":
			_act = 5;
			break;
		case "P2P.CDE.Tracker":
			_act = 8;
			break;
		case "P2P.UTP.Tracker":
			_act = 6;
			break;
//				case "P2P.P2PGetChunk.Success":
//					_act = 11;
//					break;
//				case "P2P.CDE.Tracker":
//					_act = 12;
//					break;
			
		}
		
		if(_act != -1)
		{
			if(!obj.utime)
			{
				var _thisTime = Math.floor((new Date()).getTime());
				if(this.progressReportTime===0)
				{
					obj.utime = 0;
				}
				else
				{	
					obj.utime = _thisTime - this.progressReportTime;
				}
				this.progressReportTime = _thisTime;
			}
			/**上报给播放器,主站目前未贮备该上报*/
			/*if(obj.code != "P2P.P2PNetStream.Success")
		{					
			netStream.dispatchEvent(new EventExtensions(NETSTREAM_PROTOCOL.P2P_STATUS,obj));					 
		}*/
			/**上报给内部统计*/
			var _termid = this.config.TERMID==="" ? "1" : this.config.TERMID;
			var _platid = this.config.PLATID==="" ? "0" : this.config.PLATID;
			var _splatid = this.config.SPLATID==="" ? "0" : this.config.SPLATID;
			
			var _gdur  = this.config.TYPE!=this.config.LIVE ? this.initData.duration : 0;
			var _str = String(this.stagePath+
					"act="+_act+
					((this.config.TYPE==this.config.LIVE)?"&streamid="+this.config.streamid:"")+
					"&err="+_err+
					"&utime="+obj.utime+
					"&ip="+_IP+
					"&port="+_Port+
					"&gID="+this.groupID+
					"&ver="+this.config.VERSION+
					"&type="+this.config.TYPE.toLowerCase()+
					"&termid="+_termid+
					"&platid="+_platid+
					"&splatid="+_splatid+
					"&vtype="+this.config.VTYPE+
					"&gdur="+_gdur+
					//新增
					"&p2p="+(this.config.P2P_OPEN?"1":"0")+//是否开启p2p
					//+"&vtype="+this.config.VTYPE//编码类型
					"&appid=800"+//+this.config.appid//应用程序id
					"&ch="+this.initData.ch+//云视频客户id
					//+"&p-rtmfp=0"//rtmp协议使用开关
					//+"&p-utp=0"//utp协议的使用开关
					"&p-cde=1"+//ftl的实用开关
					"&vformat="+this.initData.vformat+//视频格式
					//+"&strong=0"//硬件处理能力
					//+"&package=0"//调用的cde包名
					"&p1="+this.initData.p1+
					"&p2="+this.initData.p2+
					"&p3="+this.initData.p3+
					"&r="+Math.floor(Math.random()*100000));
			console.log(this,"process:"+_str);
			if(true === this.initData.isProxy)
			{
				_str = "proxy?url="+encodeURIComponent(_str);
			}
			new Image().src = _str;
		}
		obj = null;
	},
	clear:function()
	{
		this.groupID = "";
		this.progressReportObj = {
				"P2P.P2PNetStream.Success":true,
				"P2P.LoadXML.Success":true,
				"P2P.SelectorConnect.Success":true,
				"P2P.RtmfpConnect.Success":true,
				"P2P.GatherConnect.Success":true,
				"P2P.CDE.Tracker":true,
				"P2P.P2PGetChunk.Success":true
		};
	}
});
/**
 * 
 */
h5$.nameSpace("com.p2p.statics");
h5$.com.p2p.statics.StaticsElement = h5$.createClass({
	/**statics:null,
	config:null,
	groupid:null,
	processReport:null,*/
	heartTime:3*60*1000,
	speedSizeTime:15,//计算下载速度时使用，表示speedSizeTime秒内累计（http和p2p）下载的字节大小
	heartTimerId:-1,
	protocol:"ws",
	
//	/**心跳周期内http累计下载的字节数 */
//	csize:0,
//	/**心跳周期内来自PC端的p2p累计下载字节数*/
//	dsize:0,
//	/**心跳周期内来自TV端的p2p累计下载字节数*/
//	tsize:0,
//	/**心跳周期内来自手机端的p2p累计下载字节数*/
//	msize:0,
	csize:0,
	/**心跳周期内来自TV端的p2p累计下载字节数*/
	utsize:0,
	/**心跳周期内来自手机端的p2p累计下载字节数*/
	umsize:0,
	/**心跳周期内来自盒子端的p2p累计下载字节数*/
	ubsize:0,
	totalP2PSize:0,
	totalCDNSize:0,
	/**周期内http累计下载耗时，毫秒*/
	httpTimeForSpeed:0,
	/**是否下载数据*/
	downLoadBoo:false,
	/**存p2p开始结尾时间数据*/
	p2pArr:[],
	/**存p2p已经排序合并花费时间*/
	p2pTimeArr:[],
	/**心跳周期内累计成功连接节点的数量*/
	dnodeTotal:0,
	/**心跳周期内累计获得可连接节点的数量*/
	lnodeTotal:0,
	/**_dnode次数*/
	dnodeTimes:0,
	/**_lnode次数*/
	lnodeTimes:0,
	/**rtmfp服务器的状态，当rtmfp中断时__lnodeTotal = -1，__dnodeTotal=-1*/
	_rtmfpSuccess:false,
	_gatherSuccess:false,
	rIP:"0",
	gIP:"0",
	rPort:0,
	gPort:0,
	
	newTime:0,
	preTime:0,
	/**内部心跳上报使用的地址*/
	nativeTrafficPath:"http://s.webp2p.letv.com/ClientTrafficInfo",		

	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	start:function()
	{
		this.startTimer();
	},
	startTimer:function()
	{
		this.stopTimer();
		var me = this;
		this.heartTimerId = setInterval(function(){ me.getStatisticData(); },this.heartTime);
	},
	stopTimer:function()
	{
		if(this.heartTimerId==-1) return;
		clearInterval(this.heartTimerId);
		this.heartTimerId = -1;
	},
	getStatisticData:function()
	{
		var lnode = -1;
		var dnode = -1;
		
		if( this.rtmfpSuccess )
		{
			this.lnodeTimes = this.lnodeTimes ? this.lnodeTimes : 1;
			this.dnodeTimes = this.dnodeTimes ? this.dnodeTimes : 1;
			lnode  = Math.round((this.lnodeTotal/this.lnodeTimes) * 10)/10;
			dnode  = Math.round((this.dnodeTotal/this.dnodeTimes) * 10)/10;
		}

		if(this.statics.connectPeerSuccess === false && dnode === 0 )
		{
			dnode = -2;
		}		
		
		/**
		 * 内部心跳上报，上报内容：
		 * csize 周期内CDN下载大小（字节）
		 * dsize 周期内来自PC端的P2P下载大小（字节）
		 * tsize 周期内来自TV端的P2P下载大小（字节）
		 * msize 周期内来自手机端的P2P下载大小（字节）
		 * bsize 周期内来自BOX端的P2P下载大小（字节）
		 * dnode 周期内成功连接的平均节点数
		 * lnode 周期内所有可以连接的平均节点数
		 * gip   gather服务器ip
		 * gport gather服务器port
		 * rIP   rtmfp服务器ip
		 * rPort rtmfp服务器port
		 * gID   groupName
		 * ver   内核版本号
		 * type  live或vod
		 * termid   终端类型 直接使用调度地址提供的参数值
		 * platid   平台ID   直接使用调度地址提供的参数值
		 * splatid  子平台ID 直接使用调度地址提供的参数值
		 * r        随机数
		 * */
		var _termid = this.config.TERMID==="" ? "1" : this.config.TERMID;
		var _platid = this.config.PLATID==="" ? "0" : this.config.PLATID;
		var _splatid = this.config.SPLATID==="" ? "0" : this.config.SPLATID;
		
		var _gdur  = this.config.TYPE!=this.config.LIVE ? this.config.TOTAL_DURATION : 0;
		
		var _str = this.nativeTrafficPath+"?";
		_str += String("csize="+this.csize+
				"&dsize-cde="+this.udsize+
				"&tsize-cde="+this.utsize+
				"&msize-cde="+this.umsize+
				"&bsize-cde="+this.ubsize+
				"&streamid="+this.config.streamid+
				//+"&lpsize="+(this.utsize+this.umsize+this.ubsize)
				//+"&p="+this.config.P2P_KERNEL
				"&dnode="+dnode+
				"&lnode-cde="+lnode+
				"&gip="+this.gIP+
				"&gport="+this.gPort+
				//+"&rip="+this.rIP
				//+"&rport="+this.rPort
				"&gID="+this.groupID+
				"&ver="+this.config.VERSION+
				"&type="+this.config.TYPE.toLowerCase()+
				"&termid="+_termid+
				"&platid="+_platid+
				"&splatid="+_splatid+
				"&vtype="+this.config.VTYPE+
				"&gdur="+_gdur+
				"&p1="+this.config.p1+
				"&p2="+this.config.p2+
				"&p3="+this.config.p3+
				"&ch="+this.config.ch+
				"&p2p="+(this.config.P2PDownload?"1":"0")+
				"&appid=800"+
				"&vformat="+this.config.vformat+
				"&up-cde="+this.statics.shareSize+
				"&chk0="+this.statics.chk0+
				"&chk1="+this.statics.chk1+
				"&chk2="+this.statics.chk2+
				"&chk3="+this.statics.chk3+
				"&chk4="+this.statics.chk4+
				"&chk5="+this.statics.chk5+
				"&r="+Math.floor(Math.random()*100000));
//		console.log(this,"heart:"+_str);
		var _params = {url:_str,method:"GET",type:"json",scope:this};
		var loader = new h5$.com.p2p.loaders.BaseHttpLoad(_params);
		loader.load();
		this.reset();
		
	},
	success:function()
	{
		
	},
	getNeighbor:function(dnode,lnode)
	{
		this.dnodeTotal += Number(dnode);
		this.dnodeTimes++;
		
		this.lnodeTotal += Number(lnode);
		this.lnodeTimes++;
	},
	
	speedArray:null,
	creatSpeedArray:function()
	{
		/*当speedArray为null时，创建一个长度为15的空数组，每个元素代表每一秒钟的数据下载情况
		每一秒钟的数据结构
		obj.time 	 = 0;秒数
		obj.httpSize = 0;字节
		obj.p2pSize  = 0;字节
		*/
		if( !this.speedArray )
		{
			this.speedArray = [];
			for( var i=this.speedSizeTime-1 ; i>=0 ; i--)
			{
				var obj = {};
				obj.time 	 = Math.floor(this.creatTime/1000)-(this.speedSizeTime-1-i);
				obj.httpSize = 0;
				obj.p2pSize  = 0;
				this.speedArray[i] = obj;
			}
		}
		else
		{
			for( var j=this.speedArray.length-1 ; j>=0 ; j--)
			{
				this.speedArray[j].time 	  = Math.floor(this.creatTime/1000)-j;
				this.speedArray[j].httpSize = 0;
				this.speedArray[j].p2pSize  = 0;
			}
		}
	},
	cleanUpSpeedArray:function(tempTime)
	{
//		console.log("-->cleanUpSpeedArray:",tempTime);
		if( !this.speedArray )
		{
			this.creatSpeedArray(tempTime);
			return;
		}				
		var _overTimes = Math.floor(tempTime/1000)-this.speedArray[this.speedSizeTime-1].time;
		if( _overTimes > 0 )
		{
			if( _overTimes < this.speedSizeTime )
			{
				/*当前收到数据没有超过15秒的存储范围，进行存储淘汰，调整speedArray数组*/
				for( var j=0 ; j<this.speedArray.length ; j++ )
				{
					if( (j+_overTimes)<this.speedArray.length )
					{
						this.speedArray[j].time 	= this.speedArray[j+_overTimes].time;
						this.speedArray[j].httpSize = this.speedArray[j+_overTimes].httpSize;
						this.speedArray[j].p2pSize  = this.speedArray[j+_overTimes].p2pSize;
					}
					else
					{
						this.speedArray[j].time 	= this.speedArray[j].time+_overTimes;
						this.speedArray[j].httpSize = 0;
						this.speedArray[j].p2pSize  = 0;
					}
				}
			}
			else
			{
				/*当前收到数据已经超过15秒的存储范围，将speedArray数组重置*/
				this.creatSpeedArray(tempTime);
			}
		}				
	},
	
	pushSpeedArray:function(size,from)
	{
		var _tempTime = this.getTime();
		if( !this.speedArray )
		{
			this.creatSpeedArray( _tempTime );
		}
		else
		{
			this.cleanUpSpeedArray(_tempTime);
		}
		for( var j=this.speedArray.length-1 ; j>=0 ; j-- )
		{					
			if( this.speedArray[j].time == Math.floor(_tempTime/1000) )
			{
				/*当前数据落入这一秒钟时*/
				if( from == "http" )
				{
					this.speedArray[j].httpSize += size;
				}
				else
				{
					this.speedArray[j].p2pSize  += size;
				}
				return;
			}
		}
	},
	
	httpGetData:function(begin,end,size)
	{
		/**统计上报使用*/
		if(!isNaN(begin)||!isNaN(end))
		{
			this.httpTimeForSpeed += end - begin;
			
		}else
		{
			console.log(this,"p2p时间报NaN啦~~~~~~");
		}
//		console.log("--->size:",size);
		this.csize += Number(size);
		
		this.totalCDNSize += Number(size);
		
		if( this.newTimeForSpeed === 0)
		{
			this.newTimeForSpeed = this.getTime();
		}
		
		this.pushSpeedArray(Number(size),"http");
		
		this.downLoadBoo=true;
	},
	
	P2PGetData:function(id,begin,end,size,peerID,clientType,protocol)
	{
		var tempEventName = "P2P.P2PGetChunk.Success";
		/**过程上报使用*/
		if( this.processReport.progressReportObj[tempEventName] )
		{
			var obj = {};
			obj.code = tempEventName;
			this.processReport.progress(obj);
		}
		this.protocol = "ws";
			/**统计上报使用*/	
		var bytesize = Number(size);
		switch(clientType)
		{
			case "PC":
				this.udsize += bytesize;
				break;
			case "TV":
				this.utsize += bytesize;
				break;
			case "MP":
				this.umsize += bytesize;
				break;
			case "BOX":
				this.ubsize += bytesize;
				break;
			default:
				this.utsize += bytesize;
				break;
		}
		//////////////////
		this.totalP2PSize += bytesize;
		
		if( this.newTimeForSpeed === 0)
		{
			this.newTimeForSpeed = this.getTime();
		}
		
		this.pushSpeedArray(bytesize,"p2p");
		
		this.downLoadBoo=true;
	},
	oldTimeForSpeed:0,
	newTimeForSpeed:0,
	speedObj:{},
	
	dealDownloadSpeed:function()
	{
		this.speedObj.httpSpeed = 0;			
		this.speedObj.p2pSpeed  = 0;
		if( !this.speedArray )
		{
			return this.speedObj;
		}
		
		var _durtion = 0;			
		
		var _tempTime = this.getTime();
		
		this.oldTimeForSpeed = this.newTimeForSpeed;
		_tempTime = this.newTimeForSpeed = this.getTime();			
		
		this.cleanUpSpeedArray(_tempTime);			
		
		for( var i=0 ; i<this.speedArray.length ; i++ )
		{
			this.httpSizeForSpeed += this.speedArray[i].httpSize;
			this.p2pSizeForSpeed  += this.speedArray[i].p2pSize;
			
			if( _durtion === 0 && Math.floor(this.statistic.startRunningTimeForDownLoad/1000) <= this.speedArray[i].time )
			{
				/*如果durtion有值且起始时间小于统计速度时间*/
				_durtion = this.speedArray.length-i;
			}
		}
		//trace("durtion  = "+durtion);
		this.speedObj.httpSpeed = Math.round( 10*(this.httpSizeForSpeed/1024)/_durtion )/10;			
		this.speedObj.p2pSpeed  = Math.round( 10*(this.p2pSizeForSpeed/1024)/_durtion )/10;
		
		this.httpTimeForSpeed = 0;
		
		return this.speedObj;
	},
	
	selectorSuccess:function()
	{
		console.log("P2P.SelectorConnect.Success!");
		if( this.processReport.progressReportObj["P2P.SelectorConnect.Success"] )
		{
			var obj = {};
			obj.code 	   = "P2P.SelectorConnect.Success";
			this.processReport.progress(obj);	
		}			
	},
	
	rtmfpSuccess:function(rtmfpName,rtmfpPort,myName)
	{
		this.rIP	  = rtmfpName;
		this.rPort = rtmfpPort;
		this._rtmfpSuccess = true;
		
		if( this.processReport.progressReportObj["P2P.RtmfpConnect.Success"] )
		{
			var obj 	= {};
			obj.code	= "P2P.RtmfpConnect.Success";
			obj.ip      = rtmfpName;
			obj.port 	= rtmfpPort;
			this.processReport.progress(obj);
		}
	},
	gatherSuccess:function(gatherName,gatherPort)
	{
		this.gIP   = gatherName;
		this.gPort = gatherPort;
		this._gatherSuccess = true;
		if( this.processReport.progressReportObj["P2P.GatherConnect.Success"] )
		{
			var obj  = {};
			obj.code 		= "P2P.GatherConnect.Success";
			obj.ip   		= gatherName;
			obj.port 		= gatherPort;
			this.processReport.progress(obj);
		}
	},
	gatherFailed:function()
	{
		this._gatherSuccess = false;
	},
	rtmfpFailed:function()
	{
		this._rtmfpSuccess = false;
	},
	loadXMLSuccess:function()
	{
		var obj = {};
		if( this.processReport.progressReportObj["P2P.P2PNetStream.Success"] )
		{
			obj.code 	   = "P2P.P2PNetStream.Success";
			this.processReport.progress(obj);	
		}
		if(this.processReport.progressReportObj["P2P.LoadXML.Success"] )
		{
			obj.code 	   = "P2P.LoadXML.Success";
			this.processReport.progress(obj);	
		}
	},
	/**
	 *获取二维数组中，两个值的差的和。
	 */
	getTimeNum:function(len,arr)
	{
		var num=0;
		for(var n=0;n<len;n++)
		{
			num+=arr[n][1]-arr[n][0];
		}
		
		return num;
	},
	reset:function()
	{
		this.p2pArr=[];
		this.p2pTimeArr=[];	
		
		this.csize=0;			
		
		this.udsize=0;
		this.utsize=0;
		this.umsize=0;
		this.ubsize=0;
		
		this.dnodeTotal = 0;
		this.lnodeTotal = 0;
		this.dnodeTimes = 0;
		this.lnodeTimes = 0;
		this.statics.chk0 = 0;
		this.statics.chk1 = 0;
		this.statics.chk2 = 0;
		this.statics.chk3 = 0;
		this.statics.chk4 = 0;
		this.statics.chk5 = 0;
		
		this.downLoadBoo=false;
	},
	clear:function()
	{
//		this.statics=null;
		this.getStatisticData();
		
		this.reset();
		
		this.totalP2PSize = 0;
		this.totalCDNSize = 0;
		
		this.httpTimeForSpeed = 0;
		
		while( this.speedArray && this.speedArray.length>0 )
		{
			this.speedArray.shift();
		}
		this.speedArray = null;
		
		this.processReport.clear();
		
		this.stopTimer();
	},
	getTime:function()
	{
		return Math.floor((new Date()).getTime());
	},
});

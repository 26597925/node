/**
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
};
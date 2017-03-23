/**
 * 接受和保存一些flashvar参数
 */
h5$.nameSpace('com.p2p.vo');
h5$.com.p2p.vo.InitData = {
		canvas:1,
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
		wss:false,//开启websocket p2p功能
		wrtc:false,//开启webRTC p2p功能
		inline:"",
		//上报参数
		appid:"800",
		ch:"",
		p1:"0",
		p2:"06",
		p3:"001",
		vformat:"lm3u8",
};
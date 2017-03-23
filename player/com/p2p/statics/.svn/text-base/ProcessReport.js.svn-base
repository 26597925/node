/**
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

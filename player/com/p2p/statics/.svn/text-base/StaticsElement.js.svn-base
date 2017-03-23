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

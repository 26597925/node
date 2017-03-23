/**
 * 下载模块，统一处理下载数据
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.BaseHttpLoad = h5$.createClass({
	url:null,
	method:'get',
	scope:null,
	type:'text',
	issurport:false,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	load:function()
	{
		var _xhr = this.createHttpLoader();
		var _me = this;
		_xhr.onreadystatechange = function()
		{
			if(this.readyState == 4)
			{
				if(this.status >=200 && this.status <300)
				{
					if(_me.issurport === true)
					{	
						_me.scope.success(this.response);
					}
					else
					{
						_me.scope.success(this.responseText);
					}
				}
				else
				{
					if(typeof(_me.scope.loaderError) == "function")
					{
						_me.scope.loaderError(this.status);
					}
					
				}
			}
				
		};
		_xhr.open(this.method,this.url,true);
		if(_xhr.hasOwnProperty("responseType"))
		{
			this.issurport = true;
			_xhr.responseType = this.type;
		}
		_xhr.send(null);
	},
	createHttpLoader:function()
	{
		var _xhr;
		if(window.ActiveXObject)
		{
			var _activeXNameList = ['Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.5.0','Msxml2.XMLHTTP.4.0','Msxml2.XMLHTTP.3.0','Msxml2.XMLHTTP','Microsoft.XMLHTTP'];
			for(var i = 0; i<_activeXNameList.length;i++)
			{
				try{
					_xhr = new ActiveXObject(_activeXNameList[i]);
				}
				catch(err){
					continue;
				}
				if(_xhr){break;}
			}
		}
		else if(window.XMLHttpRequest)
		{
			_xhr = new XMLHttpRequest();
			if(_xhr.overrideMineType)
			{
				_xhr.overrideMineType = this.type;
			}
		}
		return _xhr;
	}
});/**
 * 
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.CDNLoader = h5$.createClass({
	
	//定时器
	timerId:-1,
	timerInterval:1000,
	task:null,
	loaderTimerId:-1,
	loaderTimeLength:15000,
	startLoadTime:0,
	endLoadTime:0,
	willloadrange:null,
	cdnlist:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.cdnlist = [];
	},
	start:function()
	{
		this.startTimer();
	},
	startTimer:function()
	{
		this.stopTimer();
		var _me = this;
		this.timerId = setInterval(function(){_me.loadTask();},this.timerInterval);
	},
	stopTimer:function()
	{
		if(this.timerId>-1)
		{
			clearInterval(this.timerId);
			this.timerId = -1;
		}
	},
	//加载任务
	loadTask:function()
	{
		if (this.task === null)
		{	
			this.task = this.loadManager.getCDNTask();
			if(this.task === null) return;
			var _url = this.task.url_ts;
			if(_url.indexOf("http://") !== 0 )
			{
				_url = this.getTaskURL(_url);
			}
			this.downloadingPiecesArray = [];
			//test
			var _range = this.getDownloadPieceContentTask(_url,this.downloadingPiecesArray,-1);
			if(_range !== null ||!this.task.hasPiece)
			{
				var _sendRange = [];
				for(var _i=0;_i<this.downloadingPiecesArray.length;_i++)
				{
					_sendRange.push({type:this.downloadingPiecesArray[_i].type,key:this.downloadingPiecesArray[_i].pieceKey});
				}
				var info={};
				info.code = "Load.info.Task";
				info.info = {id:this.task.id,status:0,range:_sendRange};
				this.statics.sendToJs(info);
				this.startLoadTime = this.config.localTime;
				if(this.task.hasPiece) _url = _url+_range;
				_url= this.parseUrl.replaceParam(_url,"rd",""+this.startLoadTime);
				_url = this.parseUrl.replaceParam(_url,"ajax","1");
				if(this.config.isProxy)
				{
					_url = "proxy?url="+encodeURIComponent(_url);
				}
				this.startLoader(_url);
			}
			else
			{
				this.task = null;
			}
		}
	},
	getDownloadPieceContentTask:function(url,p_arrPieces,pieceId)
	{
		this.startLoadTime  = -1;
		this.endLoadTime    = -1;
		
		var _piece = null;
		var _sb = -1;
		var _eb = -1;
		var _len = this.task.pieceIdxArray.length;
		
		for(var i = 0 ; i< _len; i++)
		{
			_piece = this.dataManager.getPiece(this.task.pieceIdxArray[i]);
			if(_piece&& 
				(!_piece.isChecked && _piece.errorCount <= 3)&& 
				(_piece.iLoadType != 1||_piece.isLoad)
			)
			{							
				_piece.iLoadType = 1;
				if(_sb == -1)
				{
					_sb = this.calculatePieceStart(this.task,i);
				}
				
				_eb = this.calculatePieceEnd(this.task,i);	
				p_arrPieces.push(_piece);
				if( i == _len-1)
				{
					if(_sb === 0)
					{
						return "";								
					}
					else
					{
						if(url.indexOf("?")>0)
						{
							return String("&rstart="+_sb+"&rend="+_eb);
						}
						else
						{
							return String("?rstart="+_sb+"&rend="+_eb);
						}
					}
				}
			}
			else
			{
				if(_sb != -1 && _eb != -1)
				{
					if(url.indexOf("?")>0)
					{
						return String("&rstart="+_sb+"&rend="+_eb);
					}
					else
					{
						return String("?rstart="+_sb+"&rend="+_eb);
					}
				}
			}			
		}		
		return null;
	},
	calculatePieceStart:function(p_block,p_nIdx)
	{
		var _pos = 0;
		for(var i = 0 ; i< p_nIdx; i++)
		{
			_pos += Number(this.dataManager.getPiece(p_block.pieceIdxArray[i]).size);
		}
		return _pos;
	},
	
	calculatePieceEnd:function(p_block,p_nIdx)
	{
		var _pos = 0;
		
		for(var i = 0 ; i<= p_nIdx; i++)
		{
			_pos += Number(this.dataManager.getPiece(p_block.pieceIdxArray[i]).size);
		}
		_pos -= 1;
		
		return _pos;
	},
	getTaskURL:function(url)
	{
		var offset		= this.initData.src[this.config.cdn_idx].location.lastIndexOf("/");
		var fileName	= this.initData.src[this.config.cdn_idx].location.substr(0, offset+1)+url;
		return fileName;
	},
	startLoader:function(url)
	{
		if(this.task === null) return;
		console.log("-->start load cdn data,id:",this.task.id);
		this.startOutTimer(url);
		var _params = {url:url,method:"GET",scope:this,type:"arraybuffer"};
		var _loader = new h5$.com.p2p.loaders.BaseHttpLoad(_params);
		_loader.load();
	},
	success:function(arraybuffer)
	{	
		this.clearOutTimer();
		this.config.All_P2P = false;
		this.endLoadTime = this.config.localTime;
		var _uInt8Array = new Uint8Array(arraybuffer);
		if(!this.downloadingPiecesArray||!this.task) return;
		console.log("-->cdn data load success,id:",this.task.id,_uInt8Array.length);

		var _pieceTimeIdx = 0;
		var _pieceTime = Math.round((this.endLoadTime-this.startLoadTime)/this.downloadingPiecesArray.length);
		var _nReadSize = 0;
		var _errck=0;
		var _piece;
		var info={};
		info.code = "Load.info.Task";
		info.info = {id:this.task.id,status:1};
		this.statics.sendToJs(info);
		if(this.task.hasPiece)
		{
			while(	this.downloadingPiecesArray.length > 0&&
					this.downloadingPiecesArray[0]&&
					_uInt8Array &&
					_uInt8Array.length >= this.downloadingPiecesArray[0].size )
			{				
				_piece = this.downloadingPiecesArray[0];
				var _tempByteArray = _uInt8Array.subarray(_nReadSize, _nReadSize+Number(_piece.size));
				if(_piece && !_piece.isChecked && _piece.iLoadType != 3)
				{
					_piece.from  = "http";
					_piece.begin = this.startLoadTime+_pieceTimeIdx*_pieceTime;
					_piece.end   = _piece.begin+_pieceTime;
					_piece.setStream(_tempByteArray);
				}
				if(_piece.isChecked)
				{
					_errck++;
				}
				this.downloadingPiecesArray.shift();
				_pieceTimeIdx++;
				_nReadSize += Number(_piece.size);
			}
		}
		else
		{
			this.task.stream = new ByteArray(_uInt8Array);
			this.task.isChecked = true;
		}
		///下载数据处理结束
		if(this.task)
		{
			var cdnip=this.parseUrl.parseUrlToObj(this.task.url_ts);
			if(this.task.url_ts.indexOf("http://") !== 0)
			{
				cdnip = this.parseUrl.parseUrlToObj(this.initData.src[this.config.cdn_idx].location);
			}
			var id = cdnip.hostName.replace(/\./g,"-").replace(':',"-");
			if(this.cdnlist.indexOf(id)==-1&&id!==undefined)
			{
				this.cdnlist.push(id);
				this.cdnlist[id]={
						sname:'CDN',
						name:id, 
						farID:"-", 
						ip:cdnip.hostName,
						speed:0,
						lasttime:0,
						dsize:0,
						dnum:0,
						ssize:0,
						snum:0,
						ck:0,
						errck:0,
						other:"",
						state:"connect"
				};
			}
			this.cdnlist[id].speed=Math.round(_uInt8Array.length*8/(this.endLoadTime-this.startLoadTime)/10)/100;
			this.cdnlist[id].lasttime=this.config.localTime;
			this.cdnlist[id].dsize=this.cdnlist[id].dsize+Math.round((_uInt8Array.length)*100/1024/1024)/100;
			this.cdnlist[id].dnum=this.cdnlist[id].dnum+_pieceTimeIdx;
			this.cdnlist[id].ck=this.cdnlist[id].ck+_pieceTimeIdx;
			this.cdnlist[id].errck=this.cdnlist[id].errck+_errck;
			this.statics.peerInfo(this.cdnlist,this.cdnlist.length,null,this.groupID,"cdn");
			//判断是不是下载完全了
			this.task=null;
		}
		this.downloadingPiecesArray = null;
	},
	startOutTimer:function(url)
	{
//		console.log("打开加载超时");
		var me = this;
		this.loaderTimerId = setTimeout(function(){me.loadError(url);},this.loaderTimeLength);
	},
	clearOutTimer:function()
	{
//		console.log("关闭加载超时");
		if(this.loaderTimerId!=-1)
		{
			clearTimeout(this.loaderTimerId);
			this.loaderTimerId = -1;
		}
		
	},
	loadError:function(url)
	{	//重试
		var _isExit = this.parseUrl.getParam(url,"retry");
		var _retry = 1;
		if(_isExit !== "")
		{
			_retry =parseInt(_isExit)+1;
		}
		if(_retry>6)//重试10次
		{
			this.task = null;
			return;
		}
		if(_retry>3){//3次失败把数据放到p2p列表中尝试p2p加载
			//检查该数据是否存在peer节点中
			
			this.config.All_P2P = true;
			this.task.isLoaded = 1;//下载失败！
		}
		url = this.parseUrl.replaceParam(url,"retry",_retry);
		console.log("-->重试地址：e=",_isExit,",r=",_retry,",",url);
		this.startLoader(url);
	},
});/**
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
});/**
 * 请求调度处理
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.GslbLoader = h5$.createClass({
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	load:function()
	{
		if(null === this.initData.gslb || "" === this.initData.gslb) this.callback.gslbSuccess(); 
		var reg=/([\w|\d]+\.){1,}[\w|\d]+/i;
		var _g3url = this.initData.gslb;
		console.log('loader::gslb::url',_g3url);
		_g3url = this.parseUrl.replaceParam(_g3url,'ajax','1');
		_g3url = this.parseUrl.replaceParam(_g3url,'format','1');
		_g3url = this.parseUrl.replaceParam(_g3url,'expect','3');
		_g3url = this.parseUrl.replaceParam(_g3url,'m3v','1');
		var _me = this;
		var _info = {url:_g3url,method:'get',scope:this};
		var _loader = new h5$.com.p2p.loaders.BaseHttpLoad(_info);
		_loader.load();
	},
	success:function(param)
	{
		if(typeof(param) == 'string')
		{
			param = eval("("+decodeURIComponent(param)+")");
		}
		if(param.playlevel)
		{
			this.initData.playlevel = param.playlevel;
		}
		if(param.geo)
		{
			this.initData.geo = param.geo;
		}
		if(param.livesftime)
		{
			this.initData.livesftime = param.livesftime;
		}
		//分析节点
		if(param.nodelist&&param.nodelist.length>0)
		{
			this.initData.src = param.nodelist;
		}
		this.callback.gslbSuccess();
		var info={};
		info.code = "Video.Gslb.Info";
		info.info={url:this.initData.src[0].location};
		this.statics.sendToJs(info);
		this.clear();
	},
	clear:function()
	{
		this.parseUrl = null;
		this.initData = null;
		this.config = null;
		this.statics = null;
		this.callback = null;
	}
});/**
 * 
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.LoadManager = h5$.createClass({
	p2pCluster:null,
	cdnLoader:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	//初始化一些参数配置
	init:function()
	{
		var _params = {
				dataManager:this.dataManager,
				loadManager:this,
				config:this.config,
				initData:this.initData,
				parseUrl:this.parseUrl,
				statics:this.statics
				};
		//创建p2p加载模块
		if(this.config.P2P_OPEN)
		{
			this.p2pCluster = new h5$.com.p2p.loaders.p2ploader.P2PCluster(_params);
			this.p2pCluster.init();
		}
		//创建cdn加载
		this.cdnLoader = new h5$.com.p2p.loaders.CDNLoader(_params);
		this.cdnLoader.init();
	},
	//开始
	start:function()
	{
		//缓冲任务
		console.log("delete:");
		this.config.TaskCache = [];
		var _tempBlockArr = this.dataManager.getBlockArray();
		var _j;
		if(_tempBlockArr)
		{
			var _tempBlock;
			var _b=false;
			for ( _j = 0; _j < _tempBlockArr.length; _j++)
			{
				if(_tempBlockArr[_j] >=this.config.ADD_DATA_TIME||(_tempBlockArr[_j] <this.config.ADD_DATA_TIME&&_tempBlockArr[_j+1]>=this.config.ADD_DATA_TIME))
				{
					_b=true;
				}
//				console.log("**",_tempBlockArr[_j]);
				if(_b)
				{
					_tempBlock = this.dataManager.getBlock(_tempBlockArr[_j]);
					if(_tempBlock&&
							!_tempBlock.isChecked)
					{	
						this.config.TaskCache.push(_tempBlockArr[_j]);
					}
				}
			}
		}
		this.cdnLoader.start();
	},
	getCDNTask:function()
	{
		this.handlerTaskList();
		if(!this.config||
				!this.config.CDN_OPEN || //CDN下载是否开启
				this.config.bufferLength > this.config.allowCacheLength ||//紧急区判断
				0 === this.config.TaskCache.length) return null;//是否存在下载任务
		
		var _temPiece;
		if(this.config.BlockID<0)
		{
			this.config.BlockID = 0;
		}
		
		for( var i = 0 ; i < this.config.TaskCache.length; i++ )
		{
			var _tmp = this.config.BlockID ;
			if( -1 == _tmp ) return null;
			
			var _blk = this.dataManager.getBlock(this.config.TaskCache[i]);
			
			if(_tmp>0 && _blk &&(_blk.id-_tmp+1) > _blk.duration) return null;//超出下一个切片范围
			
			if(_blk && _blk.id >= _tmp)
			{
				if(!_blk.isChecked)
				{
					if(!_blk.hasPiece) return _blk;
					for(var idx = 0; idx < _blk.pieceIdxArray.length; idx++)
					{
						_temPiece = this.dataManager.getPiece(_blk.pieceIdxArray[idx]);
						if( _temPiece && !_temPiece.isChecked&& _temPiece.iLoadType!=1) 
						{
							return _blk;
						}
					}
				}
				break;
			}
		}
		return null;
	},
	getP2PTask: function (value)
	{
		this.handlerTaskList();	
		if(null === this.dataManager.groupList) return null;
		
		var _pieceRet = null;
		var _blk;
		for(var i=0;i<this.config.TaskCache.length;i++)
		{
			_blk = this.dataManager.getBlock(this.config.TaskCache[i]);
			if( _blk && _blk.groupID != value.groupID ) continue;

			if(_blk&&((_blk.id - this.config.ADD_DATA_TIME) > this.config.DAT_BUFFER_TIME || (this.config.All_P2P&&_blk.id >= this.config.ADD_DATA_TIME)))
			{
				_pieceRet = this.handlerP2PPiece(_blk,value);
				if(_pieceRet !== null )
				{
					return _pieceRet;
				}
			}
		}
		return null;
	},
	handlerP2PPiece: function (blk,value)
	{
		if(!blk.isChecked)
		{
			var _piece;
			var _pieceRet;
			for( var j = 0; j < blk.pieceIdxArray.length; j++ )
			{
				_piece=blk.getPiece(j);
				if( !_piece.isChecked&&
					_piece.iLoadType != 1&&
					_piece.iLoadType != 3&&
					(_piece.peerID === ""|| 
					(_piece.peerID != value.remoteID&&
					this.config.localTime - _piece.begin > 30*1000))
				)
				{
					
					if(_piece.peerID !== "" &&
					   _piece.peerID != value.remoteID&&
						this.config.localTime - _piece.begin > 30*1000)
					{
						_piece.peerID = "";
						_piece.begin	 = 0;
						_piece.from	 = "";
						_piece.iLoadType = 0;
					}
					
					var _rangeArray = value.TNrange;
					if("PN" == _piece.type)
					{
						_rangeArray = value.PNrange;
					}
					 
					_pieceRet = this.BinsearchPiece(_piece,_rangeArray, value);
					if(_pieceRet !== null )
					{
						return _pieceRet;
					}
				}
			}
		}
		return null;
	},
	BinsearchPiece: function (p_piece, p_rangeArray, value)//二分查找，返回有序表中大于等于x的元素位置
	{
		if( !p_rangeArray || !value ) return null;
		
		var _iLow = 0;
		var _iHigh = p_rangeArray.length-1;
		var _imid = 0;
		var _p_data;
		while(_iLow <= _iHigh )
		{
			_imid= Math.floor((_iLow + _iHigh )/2);
			_p_data = p_rangeArray[_imid];

			if(	Number(p_piece.pieceKey) >= _p_data.start&&
				Number(p_piece.pieceKey)<=_p_data.end )
			{
				p_piece.iLoadType = 2;
				p_piece.peerID    = value.remoteID;
				p_piece.begin     = this.config.localTime;
				return p_piece;
			}
			else
			{
				if( Number(p_piece.pieceKey) > _p_data.end )
				{
					// 右侧查找
					_iLow = _imid + 1;
				}
				else if( Number(p_piece.pieceKey) < _p_data.start )
				{
					_iHigh = _imid -1;
				}
			}
		}
		return null;//返回大于x的第一个元素
	},
	handlerTaskList: function ()
	{
		if(!this.config.TaskCache) return;

		while (this.config.TaskCache.length > 0)
		{
			if (this.config.TaskCache[0] < this.config.BlockID)
			{
				console.log("delete:",this.config.TaskCache[0],"|",this.config.BlockID);
				this.config.TaskCache.shift();
			}
			else
			{
				break;
			}
		}
		//设置p2p任务列表
		if(this.p2pCluster)
		{
			this.p2pCluster.handlerP2PList(this.dataManager.getGroupIDList());
		}
	},
});/**
 * 解析m3u8文件
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.ParseM3U8 = h5$.createClass({
	param:{
		fileTotalSize:0,
		groupID:"",
		width:0,
		height:0,
		totalDuration:0,
		mediaDuration:0
	},
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	
	GetNameKey:function ( p_strUrl )
	{
		var _tmpStrNameKey = "";
		_tmpStrNameKey = this.parseUrl.parseUrlToObj(p_strUrl).path;//objUrl.path;//
		if( null === _tmpStrNameKey )
		{
			return p_strUrl;
		}
		var _nPos = _tmpStrNameKey.lastIndexOf("/");
		_tmpStrNameKey = _tmpStrNameKey.substr(_nPos+1,_tmpStrNameKey.length);
		return _tmpStrNameKey;
	},
	
	getValue:function ( str1, str2 )
	{
		var value = "";
		if( str1.indexOf( str2 ) === 0 )
		{
			value=str1.replace(str2,"");
		}	
		return value;
	},
	parseFile:function(file,callback,scope)
	{
		file = file.replace(/\r/g,"");
		var reg = /(\.ts\S{0,})\n/ig;
		file = file.replace(reg,"$1\n~_~");
		var _tsList = file.split("~_~");
		var i = 0;
		var j = 0;
		var _clip = null;
		var _tmpFileItem = null;
		var _clipList = [];
		
		for(i=0;i<_tsList.length;i++)
		{
			var _lines = _tsList[i].split("\n");
			_clip = new h5$.com.p2p.data.Clip();
			_clip.pieceInfoArray = [];
			if(0 !== i)
			{
				for(j=0;j<_lines.length;j++)
				{
					if(_lines[j].length <= 0) continue;
					_tmpFileItem = this.parseData(_lines[j]);
					if(_tmpFileItem && _tmpFileItem.hasOwnProperty("key"))
					{
						if(_tmpFileItem.key !== "")
						{
							if( _tmpFileItem.key == "pieceInfoArray" )
							{
								_clip.pieceInfoArray.push(_tmpFileItem.value);
								continue;
							}
							_clip[_tmpFileItem.key]=_tmpFileItem.value;
							if( _tmpFileItem.key == "timestamp" )
							{
								if( this.hasOwnProperty("DESC_LASTSTARTTIME") )
								{
									this.DESC_LASTSTARTTIME = _tmpFileItem.value;
								}
							}
							else if( _tmpFileItem.key == "url_ts" )
							{
								_clip.name = this.GetNameKey( _tmpFileItem.value );
							}
						}
						continue;
					}
					
					_tmpFileItem = this.parseProgram(_lines[j]);
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( this.config.TYPE == this.config.VOD && this.param.hasOwnProperty(_tmpFileItem.key) )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}
							else if( this.config.TYPE == this.config.LIVE && 
								this.param.hasOwnProperty(_tmpFileItem.key) &&
								_tmpFileItem.key !== "totalDuration" )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}	
						}
						continue;
					}
				}
			}
			else if( 0 === i )
			{
				for( j=0; j<_lines.length; j++ )
				{
					if( _lines[j].length <= 0 )
					{
						continue;
					}
					_tmpFileItem = this.parseFileHead(_lines[j]);
					
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( _tmpFileItem.key == "EXT_LETV_M3U8_VER" )
							{
								EXT_LETV_M3U8_VER = _tmpFileItem.value;
							}
						}
						continue;
					}
					
					_tmpFileItem = this.parseProgram(_lines[j]);
					
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( this.config.TYPE == this.config.VOD && this.param.hasOwnProperty(_tmpFileItem.key) )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}
							else if( this.config.TYPE == this.config.LIVE &&
								this.param.hasOwnProperty(_tmpFileItem.key) && 
								_tmpFileItem.key !== "totalDuration" )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}
						}
						continue;
					}
					
					_tmpFileItem = this.parseData(_lines[j]);
					
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( _tmpFileItem.key == "pieceInfoArray" )
							{
								_clip.pieceInfoArray.push(_tmpFileItem.value);
								
								continue;
							}
							_clip[_tmpFileItem.key]=_tmpFileItem.value;

							if( _tmpFileItem.key == "timestamp" )
							{
								if( this.hasOwnProperty("DESC_LASTSTARTTIME") )
								{
									this.DESC_LASTSTARTTIME = _tmpFileItem.value;
								}
							}
							else if( _tmpFileItem.key == "url_ts" )
							{
								_clip.name = this.GetNameKey( _tmpFileItem.value );
							}
						}
						continue;
					}
				}
			}
			_clip.groupID =  this.param.groupID + EXT_LETV_M3U8_VER + this.config.P2P_AGREEMENT_VERSION;
			if(this.config.currentVid === null)
			{
				if(this.param.groupID !== "")
				{
					this.config.currentVid = _clip.groupID;
				}
				else if(this.config.TYPE==this.config.LIVE)
				{
					this.config.currentVid = "noContinute";
				}
				else
				{
					this.config.currentVid = "noContinute";
				}
			}
			_clip.width   = this.param.width;
			_clip.height  = this.param.height;
			_clip.totalDuration = this.param.totalDuration;
			_clip.mediaDuration = this.param.mediaDuration;
			
			if( _clip.name && "" !== _clip.name )
			{
				_clipList.push(_clip);
			}
		}
//		console.log("currentVid="+this.config.currentVid,",",this.param.groupID);
		this.initData.duration = this.param.totalDuration;
		this.initData.mediaDuration = this.param.mediaDuration;
		this.initData.totalSize		= this.param.fileTotalSize;
			
		if(_clipList.length>0)
		{
			this.config.M3U8_MAXTIME = _clipList[_clipList.length-1].timestamp;	
		}
		
		var kbps = 800;
		if( this.config.TYPE !=  this.config.LIVE )
		{
			kbps = Math.round( (this.param.fileTotalSize*8/this.totalDuration)/1024 );
		}
		
		callback.call(scope,_clipList, kbps );
	},
	parseData:function( str )
	{
		var obj = {};
		var value = "";
	
		var switchStr = str;
		
		if( switchStr.indexOf("#") != -1 )
		{
			var nIdx = switchStr.indexOf(":");
			if( -1 != nIdx )
			{
				switchStr = switchStr.substr(0,nIdx+1);
			}
			
			switch(switchStr)
			{
				case "#EXT-X-DISCONTINUITY":
					obj.key = "discontinuity";
					obj.value = 1;
					return obj;
				case "#EXT-LETV-START-TIME:":
					value = this.getValue( str, "#EXT-LETV-START-TIME:" );
					if( value !== "" )
					{
						obj.key="timestamp";
						obj.value=parseFloat(value);
						return obj;
					}
					break;
				case "#EXT-LETV-P2P-PIECE-NUMBER:":
					value = this.getValue( str, "#EXT-LETV-P2P-PIECE-NUMBER:" );
					if( value !== "" )
					{
						obj.key="p2pPieceNumber";
						obj.value=value;
						return obj;
					}
					break;
				case "#EXT-LETV-SEGMENT-ID:":
					value = this.getValue( str, "#EXT-LETV-SEGMENT-ID:" );
					if( value !== "" )
					{
						obj.key = "sequence";
						obj.value = parseInt( value , 10 );
						return obj;
					}
					break;
				case "#EXT-LETV-CKS:":
					value = this.getValue( str, "#EXT-LETV-CKS:" );
					if( value !== "" )
					{
						obj.key = "pieceInfoArray";
						obj.value = value;
						obj.size = parseFloat(this.parseUrl.getParam(obj.value,"SZ")); 
						this.param.fileTotalSize += obj.size;
						return obj;
					}
					break;
				case "#EXTINF:":
					value = this.getValue( str, "#EXTINF:" );
					if( value !== "" )
					{
						obj.key = "duration";
						obj.value = parseFloat(value);
						return obj;
					}
					break;	
			}	
		}
		else if( switchStr.length > 0 )
		{
			obj.key = "url_ts";
			obj.value = switchStr;
			return obj;
		}

		return null;
	},
	
	parseProgram:function( str )
	{
		var obj = {};
		var value = "";
		
		var switchStr = str;
		var nIdx = switchStr.indexOf(":");
		if( -1 != nIdx )
		{
			switchStr = switchStr.substr(0,nIdx+1);
		}
		
		switch(switchStr)
		{
			case "#EXT-LETV-X-DISCONTINUITY:":
				obj.key = "";
				break;
			case "#EXT-LETV-PROGRAM-ID:":
				value=this.getValue( str, "#EXT-LETV-PROGRAM-ID:" );
				if( value !== "" )
				{
					obj.key="groupID";
					obj.value=value;					
					return obj;
				}
				break;
			case "#EXT-LETV-PIC-WIDTH:":
				value = this.getValue( str, "#EXT-LETV-PIC-WIDTH:" );
				if( value !== "" )
				{
					obj.key = "width";
					obj.value = value;
					return obj;
				}
				break;
			case "#EXT-LETV-PIC-HEIGHT:":
				value = this.getValue( str, "#EXT-LETV-PIC-HEIGHT:" );
				if( value !== "" )
				{
					obj.key = "height";
					obj.value = value;
					return obj;
				}
				break;
			case "#EXT-LETV-TOTAL-TS-LENGTH:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-ES-LENGTH:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-SEGMENT:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-P2P-PIECE:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-DURATION:":
				value = this.getValue( str, "#EXT-LETV-TOTAL-DURATION:" );
				if(value !== "")
				{
					obj.key = "totalDuration";
					obj.value = value;
					return obj;
				}
				break;
			case "#EXT-LETV-TOTAL-MEDIADURATION:":
				value = this.getValue( str, "#EXT-LETV-TOTAL-MEDIADURATION:" );
				if( value !== "" )
				{
					obj.key = "mediaDuration";
					obj.value = value;
					return obj;
				}
				break;
		}
		return obj;
	},
	
	parseFileHead:function ( str )
	{
		var obj = {};
		var value = "";
		
		var switchStr = str;
		var nIdx = switchStr.indexOf(":");
		switchStr = switchStr.substr(0,nIdx+1);
		
		switch(switchStr)
		{
			case "#EXTM3U":
				obj.key = "";
				break;
			case "#EXT-X-VERSION:":

				obj.key = "";
				break;
			case "#EXT-X-MEDIA-SEQUENCE:":
				obj.key = "";
				break;
			case "#EXT-X-ALLOW-CACHE:":
				obj.key = "";
				break;
			case "#EXT-X-TARGETDURATION:":
				obj.key = "";
				break;
			case "#EXT-LETV-M3U8-TYPE:":
				value = this.getValue(str,"#EXT-LETV-M3U8-TYPE:");
				if( value !== "" )
				{
					obj.key = "str_EXT_LETV_M3U8_TYPE";
					obj.value=value;
					return obj;
				}
				break;
			case "#EXT-LETV-M3U8-VER:":
				value = this.getValue(str,"#EXT-LETV-M3U8-VER:");
				if( value !== "" )
				{
					obj.key="EXT_LETV_M3U8_VER";
					obj.value=value;
					return obj;
				}
				break;
		}
		return obj;
	
	},
});/**
 * 数据转换处理
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.DataConvert = {
		
		processObj:function (obj, _array)
		{
			switch(typeof(obj))
			{
				case "array":
					for(var i = 0; i < obj.length; i++)
					{
						if (obj[i] instanceof Array)
						{
							this.processObj(obj[i], _array);
						}else if( typeof(obj[i]) == "object" )
						{
							this.processObj(obj[i], _array);
						}
					}
					break;
				case "object":
					for( var element in obj )
					{
						var size = element.split("_")[1];
						if(size)
						{
							this.convertToBit( size,obj[element],_array );
						}
						if(!size && obj[element])
						{
							this.processObj( obj[element], _array );
						}
					}
					break;
				default:
					break;
			}
		},
		
		convertToBit: function ( size, data,_array)
		{
			var __uint8 = null;
			switch(size)
			{
			case "2":
				__uint8 = new Uint8Array(2);
				__uint8[0] = (parseInt(data) >> 8) & 0xff;
				__uint8[1] = parseInt(data) & 0xff;
				_array.push(__uint8);
				break;
			case "4":
				__uint8 = new Uint8Array(4);
				__uint8[0] = (parseInt(data) >> 24) & 0xff;
				__uint8[1] = (parseInt(data) >> 16) & 0xff;
				__uint8[2] = (parseInt(data) >> 8) & 0xff;
				__uint8[3] = parseInt(data) & 0xff;
				_array.push(__uint8);
				break;
			case "8":
				__uint8 = new Uint8Array(8);
				var data1 =  Math.floor(data/0x100000000);			
				__uint8[0] = (data1 >> 24) & 0xff;
				__uint8[1] = (data1 >> 16) & 0xff;
				__uint8[2] = (data1 >> 8) & 0xff;
				__uint8[3] = (data1) & 0xff;
				var data2 =  Math.floor(data%0x100000000);
				__uint8[4] = (data2 >> 24) & 0xff;
				__uint8[5] = (data2 >> 16) & 0xff;
				__uint8[6] = (data2 >> 8) & 0xff;
				__uint8[7] = (data2) & 0xff;
				_array.push(__uint8);
				break;
			case "utf":
				__uint8 = new Uint8Array(data.length);
				for(var i=0;i<data.length;i++)
				{
					__uint8[i] = data.charCodeAt(i);
				}
				_array.push(__uint8);
				break;
			case "d":
				if( data && data.length > 0 )
				{
					_array.push(data);
				}
				break;
			}
		},
		
		convertToValue:function(size,byteArray,position,len )
		{
			var value1;
			var value2;
			var value3;
			var value4;
			var value;
			switch(size)
			{
				case "2":
					value1 = byteArray[position];
					value2 = byteArray[position+1];
					value = (value1<<8) + value2;
					break;
				case "4":
					value1 = byteArray[position];
					value2 = byteArray[position+1];
					value3 = byteArray[position+2];
					value4 = byteArray[position+3];
					value = (value1<<24) + (value2<<16) + (value3<<8) + value4;
					break;
				case "8":
					value1 = byteArray[position];
					value2 = byteArray[position+1];
					value3 = byteArray[position+2];
					value4 = byteArray[position+3];
					
					var high = (value1<<24) + (value2<<16) + (value3<<8) + value4;
					value1 = byteArray[position+4];
					value2 = byteArray[position+5];
					value3 = byteArray[position+6];
					value4 = byteArray[position+7];
					var  low = (value1*Math.pow(2,24)) + (value2<<16) + (value3<<8) + value4;
					value = (high * 0x100000000) + low;
					break;
				case "utf":
					var str = "";
					for(var i=0;i<len;i++)
					{
						str += String.fromCharCode(byteArray[position+i]);
					}
					value = str;
					break;
				case "d":
					value = byteArray.subarray(position,position+len);
					break;
			}
			return value;
		},
};/**
 * 
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.P2PCluster = h5$.createClass({
	p2pList:null,
	dataConvert:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.p2pList = {};
		this.dataConvert = h5$.com.p2p.loaders.p2ploader.DataConvert;
	},
	create:function(gID)
	{
		if( !this.p2pList.hasOwnProperty(gID))
		{
			this.p2pList[gID]=[];
			this.statics.createP2P(gID);
			var _params = {dataManager:this.dataManager,
					dataConvert:this.dataConvert,
					config:this.config,
					initData:this.initData,
					statics:this.statics,
					parseUrl:this.parseUrl,
					groupID:gID};
			if(this.initData.wss)
			{
				console.log("##p2p::create ws:",gID);
				var _ws = new h5$.com.p2p.loaders.p2ploader.WSLoader(_params);
				_ws.init();
				this.p2pList[gID].push(_ws);
			}
			if(this.initData.wrtc)
			{
				var _rtc = new h5$.com.p2p.loaders.p2ploader.RTCLoader(_params);
				_rtc.init();
				this.p2pList[gID].push(_rtc);
			}
			for(var i = 0;i<this.p2pList[gID].length;i++)
			{
				this.p2pList[gID][i].start();
			}
		}
	},
	remove:function(gID)
	{
		if(this.p2pList.hasOwnProperty(gID))
		{
			for(var i=0;i<this.p2pList[gID].length;i++)
			{
				this.p2pList[gID][i].clear();
			}
			this.p2pList[gID] = null;
			delete this.p2pList[gID];
		}
	},
	handlerP2PList:function(groupIDList)
	{
		var _gid = "";
		for( _gid in this.p2pList )
		{
			if(groupIDList.indexOf(_gid) == -1 )
			{
				this.remove(_gid);
				this.statics.deleteGroupID(_gid);
			}
		}
		
		for(var groupKey in groupIDList)
		{
			if( this.p2pList.hasOwnProperty(groupIDList[groupKey]))
			{
				continue;
			}
			this.create(groupIDList[groupKey]);
		}
	},
});h5$.nameSpace('com.p2p.loaders.p2ploader');
h5$.com.p2p.loaders.p2ploader.Selector = h5$.createClass
({
	_selectorName: "selector.webp2p.letv.com",
	_selectorPort:80,
	
	gatherName:'',
	gatherPort:0,
	
	maxQPeers:0,
	hbInterval:11,
	

	__ctor: function(value)
	{
		h5$.apply(this,value);
	},
	load:function()
	{
		console.log("-->连接 selector服务器！",this.groupID);
		//连接selector
		var _url = "http://"+this._selectorName+":"+this._selectorPort+"/query?groupId="+this.groupID+"&ran="+Math.floor(Math.random()*10000);
		var _params = {url:_url,method:"GET",scope:this,type:"json"};
		var loader = new h5$.com.p2p.loaders.BaseHttpLoad(_params);
		loader.load();
	},
	success:function(data)
	{
		console.log("-->selector data:",data);
		var _obj = data;
		var _arr;
		if(typeof(data) == "string")
		{
			_obj = eval("("+decodeURIComponent(data)+")");
		}
		if(_obj.result == "success")
		{
			/**成功返回所需地址和接口*/
			this.statics.selectorSuccess(this.groupID);
			_arr = String(_obj.value.proxyId).split(":");
			this.gatherName = _arr[0];
			this.gatherPort = _arr[1];
			this.setDataTo(_obj.value);
			this.scope.selectorSuccess();
		}
		else if(_obj.result == "redirect")
		{
			/**需要重定向再次请求*/
			console.log("需要重定向再次请求");
			_arr = String(_obj.value.mselectorId).split(":");
			this._selectorName = _arr[0];
			this._selectorPort = _arr[1];
			this.load();
		}
		else if(_obj.result == "failed")
		{
			console.log("-->selector::no Request!");	
		}
		else
		{
			console.log("-->selector::dataError");				
			return;
		}
	},
	setDataTo:function(value)
	{
		if(value.hasOwnProperty("fetchRate"))
		{
			this.config.DAT_LOAD_RATE = Number(value.fetchRate);
		}
		if(value.hasOwnProperty("maxPeers"))
		{
			this.config.MAX_PEERS = Number(value.maxPeers);
		}
		
		if(value.hasOwnProperty("urgentSize"))
		{
			this.config.DAT_BUFFER_TIME = value.urgentSize;
		}
		if(value.hasOwnProperty("urgentLevel1"))
		{
			this.config.DAT_BUFFER_TIME_LEVEL1 = value.urgentLevel1;
		}
		
		if(value.hasOwnProperty("sharePeers"))
		{
			this.config.IS_SHARE_PEERS = value.sharePeers;
		}
		if(value.hasOwnProperty("maxQPeers"))
		{
			this.maxQPeers = value.maxQPeers;
		}
		if(value.hasOwnProperty("hbInterval"))
		{
			this.hbInterval = value.hbInterval;
		}
		if(value.hasOwnProperty("cdnDisable"))
		{
			this.config.CDN_OPEN = Boolean(value.cdnDisable);
		}
		if(value.hasOwnProperty("cdnStartTime"))
		{
			this.config.CDN_START_TIME = parseInt(value.cdnStartTime);
		}
	}
});
/**
 * 信令
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.Signalling = h5$.createClass({
	/**
	 * p2pLoader
	 * dataManager
	 * config
	 * groupID
	 * dataConvert
	 * statics
	 * peer
	 * remoteID
	 * */
	sendrangNum:0,
	reqrangNum:0,
	requestArr:[],
	readySendDataList:[],
	remoteTNList:[],
	remotePNList:[],
	starttime:0,//开始时间
	
	
	/**
	 * 统计数据*/
	speed:0,//传输速度
	errck:0,//错误
	ck:0,//校验
	downSize:0,//下载大小
	downNum:0,//下载piece数
	shareSize:0,//分享大小
	shareNum:0,//分享piece数
	dl:0,
	req:0,
	res:0,
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.sendrangeNum = 0;
		this.reqrangeNum = 0;
		this.requestArr = [];
		this.readySendDataList = [];
		this.remoteTNList = [];
		this.remotePNList = [];
	},
	
	//获得发送的数据
	getSendData:function()
	{
		this.sendrangNum++;
		var _sendDataSct = [
			{"sequence_4":0},//0
			{"datalen_4":0},//1
			{"rangeCount_4":0},//2
			{"rangeItems":[
				[{"type_2":123},{"start_8":234},{"end_4":345}]
			]},//3
			{"requestCount_4":0},//4
			{"requestItems":[
				[{"type_2":0},{"start_8":1411033199},{"cks_4":57473}]
			]},//5
			{"responseCount_4":0},//6
			{"responseItems":[
				[{"type_2":0},{"start_8":1411033199},{"streamLength_4":57473},{"stream_d":null}]
			]},//7
			{"peerCount_4":1},//连接节点数//8
			{"peerItems":[
				[{"head_4":0},{"URL_utf":"ws://202.103.4.52:34567/*****"}]
			]}//9
		];
		//3
		var _rangeItems=[];
		var _i;
		var _tempList;
		var _start;
		var _end;
		_tempList = this.dataManager.getTNRange(this.groupID);
		if(_tempList !== null)
		{
			for(_i=0;_i<_tempList.length;_i++)
			{
				_start=_tempList[_i].start;
				_end =_tempList[_i].end;
				_rangeItems.push([{"type_2":0},{"start_8":_start},{"end_4":(_end-_start+1)}]);
			}
		}
		_tempList	= this.dataManager.getPNRange(this.groupID);
		if(_tempList !== null)
		{
			for(_i=0;_i<_tempList.length;_i++)
			{
				_start=_tempList[_i].start;
				_end =_tempList[_i].end;
				_rangeItems.push([{"type_2":1},{"start_8":_start},{"end_4":(_end-_start+1)}]);
			}
		}
		_sendDataSct[3].rangeItems=_rangeItems;
			
		var _requestItems = [];
		var _type = 0;
		if(this.requestArr.length === 0)
		{
			var _piece = this.getTask(this.remoteTNList,this.remotePNList);
			
			if(_piece)
			{
				this.requestArr.push(_piece);
				if(_piece.type == "PN")
				{
					_type = 1;
				}
				this.starttime = this.config.localTime;
				_requestItems.push([{"type_2":_type},{"start_8":_piece.pieceKey},{"cks_4":_piece.checkSum}]);
			}
		}
		_sendDataSct[5].requestItems=_requestItems;
		
		//7
		var _responseItems=[];
		_type=0;
		if( this.readySendDataList && this.readySendDataList.length > 0 )
		{
			for( _i=0; _i < this.readySendDataList.length; _i++ )
			{
				if( this.readySendDataList[_i].type == "PN" )
				{
					_type = 1;
				}
				_responseItems.push([{"type_2":_type},{"start_8":this.readySendDataList[_i].key},{"streamLength_4":this.readySendDataList[_i].data.length},{"stream_d":this.readySendDataList[_i].data}]);
			}
			this.readySendDataList 	= null;//new Array();
		}
		_sendDataSct[7].responseItems=_responseItems;
		
		//9
		var _peerItems=[];
		_tempList = this.p2pLoader.getSuccessPeerList(this.remoteID);
		for(_i=0;_i<_tempList.length;_i++)
		{
			_peerItems.push([{"head_4":_i},{"URL_utf":_tempList[_i]}]);
		}
		_sendDataSct[9].peerItems=_peerItems;
	
		_sendDataSct[2].rangeCount_4 = _sendDataSct[3].rangeItems.length;
		_sendDataSct[4].requestCount_4 = _sendDataSct[5].requestItems.length;
		_sendDataSct[6].responseCount_4 = _sendDataSct[7].responseItems.length;
		
		for( _i = 0; _i < _sendDataSct[7].responseItems.length;_i++ )
		{
			_sendDataSct[7].responseItems[_i][2].streamLength_4 = _sendDataSct[7].responseItems[_i][3].stream_d.length;
		}
		
		_sendDataSct[8].peerCount_4 = _sendDataSct[9].peerItems.length;
		
		for(_i = 0; _i < _sendDataSct[9].peerItems.length;_i++ )
		{
			_sendDataSct[9].peerItems[_i][0].head_4 = _sendDataSct[9].peerItems[_i][1].URL_utf.length;
		}
		///结算分享数据信息
		for(_i=0;_i<_sendDataSct[7].responseItems.length;_i++)
		{
			this.shareNum++;
			this.shareSize+=Number(_sendDataSct[7].responseItems[_i][2].streamLength_4);
		}
		
		this.sendInfo(_sendDataSct);	
		
		var _arr = [];
		if(this.type == "WS")
		{
			_sendDataSct.splice(1,1);
		}
		this.dataConvert.processObj(_sendDataSct,_arr);
		var _size = 0;
		
		for(_i=0;_i<_arr.length; _i++)
		{
			_size += _arr[_i].length;
		}
		var _sendData = new Uint8Array(_size);
		var _count=0;
		for(_i=0;_i<_arr.length; _i++)
		{
			for(var _j=0;_j<_arr[_i].length;_j++)
			{
				_sendData[_count++] = _arr[_i][_j];
			}
		}
		//重写数据前8位为数据长度
		if(this.type == "RTC")
		{
			var _sdatalen=_sendData.length;
			_sendData[4] = (parseInt(_sdatalen) >> 24) & 0xff;
			_sendData[5] = (parseInt(_sdatalen) >> 16) & 0xff;
			_sendData[6] = (parseInt(_sdatalen) >> 8) & 0xff;
			_sendData[7] = parseInt(_sdatalen) & 0xff;
		}
		this.req++;
		this.dl++;
		return _sendData;
	},
	//处理接受的数据
	processData:function (value)
	{
//		console.log("##res:",this.res);
		var _position = 0;
		var _sequnce = this.dataConvert.convertToValue('4',value,_position);
		var _time;
		var _type;
		var _info;
		var _i;
		this.res++;
		this.dl--;
		_position += 4;
		if(this.type == "RTC")
		{
//			console.log("rtc,跳过4个字节");
			_position += 4;//跳过4个字节，这4个字节是说明数据长度的
		}
		var _rangeCount = this.dataConvert.convertToValue('4',value,_position);
		_position += 4;

		if(_rangeCount !== 0)
		{
			this.remoteTNList = [];
			this.remotePNList = [];
			for( _i = 0; _i < _rangeCount;_i++)
			{
				_type = this.dataConvert.convertToValue('2',value,_position);
				_position += 2;
				var _start = this.dataConvert.convertToValue('8',value,_position);
				_position += 8;
				var _end = this.dataConvert.convertToValue('4',value,_position);
				_position += 4;
				if(0 === _type)
				{
					this.remoteTNList.push({"start":_start,"end":(_start+_end-1)});
				}
				else
				{
					this.remotePNList.push({"start":_start,"end":(_start+_end-1)});
				}
			}
			//输出 range信息
			_info={};
			_info.code="P2P.Range.Info";
			_info.info={"TN":this.remoteTNList,"PN":this.remotePNList};
			this.statics.sendToJs(_info);
		}
		
		var _reqCount = this.dataConvert.convertToValue('4',value,_position);
		_position += 4;
		var _sendArr = [];
		for( _i = 0; _i < _reqCount;_i++)
		{
			_type = this.dataConvert.convertToValue('2',value,_position);
			_position += 2;
			var _pid = this.dataConvert.convertToValue('8',value,_position);
			_position += 8;
			var _sck = this.dataConvert.convertToValue('4',value,_position);
			_position += 4;
			if(_type === 0)
			{
				_sendArr.push({"type":"TN","groupId":this.groupID,"key":_pid,'checksum':_sck});
			}
			else
			{
				_sendArr.push({"type":"PN","groupId":this.groupID,"key":_pid,'checksum':_sck});
			}
		}
		if(_sendArr.length>0)
		{
			this.readySendDataList = this.getData(_sendArr);
		}
		var _respCount = this.dataConvert.convertToValue('4',value,_position);

		_position += 4;
		var _len =1;// (requestArr?requestArr.length:1);
		for( _i = 0; _i < _respCount&&_i<_len;_i++)
		{
			_time = this.config.localTime - this.starttime;
			_type = this.dataConvert.convertToValue('2',value,_position);
			_position += 2;
			var _pid2 = this.dataConvert.convertToValue('8',value,_position);
			_position += 8;
			var _DataL = this.dataConvert.convertToValue('4',value,_position);
			_position += 4;

			var _stream = this.dataConvert.convertToValue('d',value,_position,_DataL);
			_position += _DataL;
			this.dealRemoteData({'pieceID':_pid2,'data':_stream});
			this.downNum++;
			this.downSize+=_stream.length;
			this.speed = Math.round(_stream.length*8/_time/10)/100;
			_info = {};
			_info.code = "P2P.Info.Debug";
			_info.info="p2p:["+this.remoteID+"] "+_type+"_"+_pid2;
			this.statics.sendToJs(_info);
		}
		
		var _peerCount = this.dataConvert.convertToValue('4',value,_position);//sequnce
		_position += 4;
		for(_i = 0; _i < _peerCount;_i++)
		{
			var _peerheadL = this.dataConvert.convertToValue('4',value,_position);//sequnce
			_position += 4;
			var _url = this.dataConvert.convertToValue('utf',value,_position,_peerheadL);
			_position += _peerheadL;
	
		}
		//接受完数据
		if(_rangeCount>0)
		{
			this.reqrangNum++;
			//防止发送太快，设置间隔
			this.peer.sendMessage();
		}
	},
	getTask: function(TNarr,PNarr)
	{
		if(!TNarr && !PNarr )
		{
			return null;
		}
		var obj = {};
		obj.groupID		= this.groupID;
		obj.PNrange		= PNarr;
		obj.TNrange		= TNarr;
		obj.remoteID	= this.remoteID;
		
		var callBackObj = this.dataManager.getP2PTask(obj);
		
		obj = null;
		return callBackObj;
	},
	getData:function(arr)
	{
		var _tmpArray = [];
		if(!arr) return _tmpArray;
		
		var _tmpPiece;
		var _readySendData;
		
		for(var i=0;i<arr.length;i++)
		{
			if(arr[i])
			{
				var _type = arr[i].type;
				var _key = arr[i].key;
				if(_type && _key)
				{
					_tmpPiece = this.dataManager.getPiece(
						{
							"groupID":this.groupID,
							"type":arr[i].type,
							"pieceKey":arr[i].key
						}
					);
					if(!_tmpPiece || !_tmpPiece.isChecked) continue;
					
					if(_type == "TN" && _tmpPiece.checkSum != arr[i].checksum) continue;
					
					_readySendData = 
						{
							"type":_tmpPiece.type,
							"key":_tmpPiece.pieceKey,
							"data":_tmpPiece.getStream()
						};
					
					_tmpArray.push(_readySendData);
					if(_tmpArray.length>0)
					{
						break;
					}
				}
			}
		}
		_tmpPiece = null;
		return _tmpArray;
	},
	
	dealRemoteData:function(obj)
	{
		var _tmpPiece;
		if(this.requestArr.length === 0) return;
		
		if(obj.pieceID && (this.requestArr[0]).pieceKey == obj.pieceID )
		{
			_tmpPiece = this.dataManager.getPiece(
				{
					"groupID":this.groupID,
					"type":(this.requestArr[0]).type,
					"pieceKey":(this.requestArr[0]).pieceKey
				}
			);
			
			if(_tmpPiece)
			{
				if(!_tmpPiece.isChecked )
				{
					this.isReceivedData = true;
					_tmpPiece.protocol = "ws";
					this.ck++;
					_tmpPiece.setStream((obj.data),this.remoteID,this.remoteClientType);
					if(!_tmpPiece.isChecked)
					{
						this.errck++;
					}
				}
				else
				{
					this.statics.P2PRepeatLoad(_tmpPiece.pieceKey,_tmpPiece.from);
				}
				var _idx = this.requestArr.indexOf(_tmpPiece);
				if ( -1 != _idx)
				{
					this.requestArr.splice(_idx, 1);
				}
			}
		}
		_tmpPiece = null;
	},
	sendInfo:function(data)
	{
		var _requestArr = data[5].requestItems;
		var _responseArr = data[7].responseItems;
		var _tempPiece;
		var _type;
		var _key;
		var _info;
		var _i;

		for(_i=0 ; _i<_requestArr.length; _i++)
		{	
			//输出 range信息
			_info={};
			_info.code = "P2P.Info.Debug";
			_info.info = "I want ["+_requestArr[_i][0].type_2+"],id:"+this.remoteID+","+_requestArr[_i][1].start_8;
			this.statics.sendToJs(_info);
			
			_info={};
			_info.code = "Load.Range.isCheck";
			_info.info = {"from":this.remoteID,"type":_requestArr[_i][0].type_2,"key":_requestArr[_i][1].start_8,status:"loading"};
			this.statics.sendToJs(_info);
		}
		for(_i=0 ; _i<_responseArr.length ; _i++)
		{
			_type = "TN";
			if(_responseArr[_i][0].type_2 == 1) _type = "PN";
			
			_tempPiece = this.dataManager.getPiece({"groupID":this.groupID,"pieceKey":_responseArr[_i][1].start_8,"type":_type});
			_tempPiece.share++;
			this.statics.addSize({type:"share",size:_responseArr[_i][2].streamLength_4});
			//输出 range信息
			_info={};
			_info.code="P2P.Info.Debug";
			_info.info={p2p:this.statics.p2pSize,cdn:this.statics.cdnSize,share:this.statics.shareSize,message:"share:["+this.remoteID+"] "+_type+"_"+_responseArr[_i][1].start_8};
			this.statics.sendToJs(_info);
		}			
	},
	clear:function()
	{
		this.sendrangNum = 0;
		this.reqrangNum = 0;
		this.requestArr = [];
		this.readySendDataList = [];
		this.remoteTNList = [];
		this.remotePNList = [];
	},
});/**
 * WEB SOcket模式
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.WSLoader = h5$.createClass({
	selector:null,
	
	
	pipeListArr:null,
	badPipeList:null,	
	sparePipeArr:null,
	
	peerHartBeatTimerInterval:1000,//获得peerlist心跳时间
	peerHeartBeatId: null,
	
	gatherTimerInterval:10000*1,//数据发送心跳时间设置
	gatherTimerId: null,
	
	isLoading:false,
	pipeSuccessNum:0,
	
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.pipeListArr = [];
		this.badPipeList = {};
		this.sparePipeArr= [];
		var _params = {scope:this,
				config:this.config,
				initData:this.initData,
				parseUrl:this.parseUrl,
				statics:this.statics,
				groupID:this.groupID};
		this.selector = new h5$.com.p2p.loaders.p2ploader.Selector(_params);
	},
	start:function()
	{
		console.log("##selector start!");
		this.selector.load();
	},
	selectorSuccess:function()
	{
		console.log("##selector success");
		this.statics.gatherSuccess(this.selector);
		//开启创建节点定时器
		this.startTimer("peerHeartBeatId",this.peerHartBeatTimer,this.peerHartBeatTimerInterval);
		//开启获取节点定时器
		this.startTimer("gatherTimerId",this.gatherTimer,300);
	},
	peerHartBeatTimer:function(scope)
	{
		var _peerInfo = {};
		scope.pipeSuccessNum = 0;
		for(var idx = scope.pipeListArr.length-1; idx >= 0; idx--)
		{
			var _pipe = scope.pipeListArr[idx];
			if (_pipe.isDead)
			{
				scope.badPipe(_pipe.remoteID,idx);
				continue;
			}
			scope.pipeSuccessNum++;
			var _data = _pipe.signal;
			_peerInfo[_data.remoteID] = {
					sname:'CDE',
					name:_data.remoteID, 
					farID:_data.remoteID, 
					ip:_pipe.host+":"+_pipe.port,
					speed:_data.speed,
					lasttime:_pipe.beginTime,
					dsize:Math.round(_data.downSize*100/1024/1024)/100,
					dnum:_data.downNum,
					ssize:Math.round(_data.shareSize*100/1024/1024)/100,
					snum:_data.shareNum,
					ck:_data.errck+"/"+_data.ck,
					other:Math.abs(_data.dl)+"/"+_data.res+"/"+_data.req+"/"+(_data.res+_data.req),
					state: _pipe.status
			};
		}
		scope.pushSparePeerIntoPipeList();
		scope.statics.peerInfo(_peerInfo,scope.pipeSuccessNum,(scope.pipeListArr.length+scope.sparePipeArr.length),scope.groupID,"ws");
	},
	pushSparePeerIntoPipeList:function()
	{
		while(this.sparePipeArr.length>0)
		{
			if(this.pipeListArr.length < this.config.MAX_PEERS)
			{
				this.createPeer(this.sparePipeArr.shift());
			}
		}
	},
	gatherTimer:function(scope)
	{
		if(scope.isLoading) return;
		scope.isLoading = true;
		if(-1!=scope.gatherTimerID)
		{
			scope.startTimer("gatherTimerId",scope.gatherTimer,scope.gatherTimerInterval);
		}
		if(scope.pipeListArr.length+scope.sparePipeArr.length >= scope.config.MAX_PEERS ) return;
		var _url = "";
		_url += "http://"+scope.selector.gatherName+":"+scope.selector.gatherPort+"/cde?termid=1";
		if( scope.initData.gslb)
		{
			_url += "&platid="+ scope.parseUrl.getParam(scope.initData.gslb,"platid");
			_url += "&splatid="+scope.parseUrl.getParam(scope.initData.gslb,"splatid");
		}
		_url += "&pid=33-"+scope.config.uuid+"-0-0";
		_url += "&ver="+scope.config.VERSION;
		_url += "&appid=0";
		var array = scope.initData.geo.split(".");
		_url += "&ispId="+array[3];
		_url += "&arealevel1="+array[0];
		_url += "&arealevel2="+array[1];
		_url += "&arealevel3="+array[2];
		_url += "&neighbors="+scope.pipeSuccessNum;
		_url += "&ckey="+scope.groupID;
		_url += "&expect=10";
		_url += "&op=3";
		_url += "&format=1";
		_url += "&inip=0.0.0.0";
		_url += "&outip=0.0.0.0";
		_url += "&rdm="+scope.config.localTime;
		
		scope.statics.gatherStart(scope.selector);
		
		var _params = {url:_url,method:"GET",scope:scope,type:"json"};
		var _loader = new h5$.com.p2p.loaders.BaseHttpLoad(_params);
		_loader.load();
	},
	success:function(data)
	{
		this.isLoading = false;
	
		this.clearBadPipe();
		var _obj = data;	
		if(typeof(data) == "string")
		{
			_obj = eval("("+encodeURIComponent(data)+")");
		}
		if(_obj.length === 0)
		{
			return;
		}

//		obj["peerlist"]=[{userip:'10.58.136.180',pport:'1443',termid:'2','peerid':'12131231234'}];	
		var _remoteID = "";
		var _arr = _obj.peerlist;
		
		for( var i = 0 ; i<_arr.length ; i++ )
		{
			_remoteID = _arr[i].peerid;
			if( _remoteID !== ""&&
				!this.badPipeList[_remoteID]&&
				_remoteID != this.config.uuid&&
				-1 == this.hasPipe(this.pipeListArr,_remoteID,true)&&
				_arr[i].userip&&
				_arr[i].pport&&
				_arr[i].termid !="1"
			)
			{
				console.log("##create peer:",this.pipeListArr.length,this.config.MAX_PEERS);
				if( this.pipeListArr.length < this.config.MAX_PEERS)
				{
					this.createPeer(_arr[i]);
				}
				else
				{
					/**将arr中剩余的空闲节点保存*/
					if( -1 == this.hasPipe(this.sparePipeArr,_remoteID,false) )
					{
						
						this.pushPeerID(this.sparePipeArr,_arr[i]);
					}							
				}
			}		
		}
	},
	createPeer:function(value)
	{
		console.log("##p2p::create ws pipe:"+value.userip+":"+value.pport+" "+value.peerid);
		var _params = {dataManager:this.dataManager,
				dataConvert:this.dataConvert,
				p2pLoader:this,
				config:this.config,
				statics:this.statics,
				groupID:this.groupID,
				remoteID:value.peerid,
				host:value.userip,
				port:value.pport,
				termid:value.termid};
		var _pipe = new h5$.com.p2p.loaders.p2ploader.WSPipe(_params);
		_pipe.init();
		_pipe.start();
		this.pipeListArr.push(_pipe);
	},
	pushPeerID:function(arr,value)
	{
		arr.push(value);
		if(arr.length>50)
		{
			arr.shift();
		}
	},
	badPipe:function(remoteID,idx)
	{
		/**
		 * 当节点连接失败时,在_badPipeList列表中创建key=pipeID的对象，并将本地时间存入该对象，
		 * 此时间用来对比存入_badPipeList的时长
		 * */
		this.badPipeList[remoteID] = this.config.localTime;
		this.pipeListArr[idx].clear();
		this.pipeListArr[idx] = null;
		this.pipeListArr.splice(idx, 1);			
	},
	clearBadPipe:function()
	{
		var _tm = this.config.localTime;
		for (var i in this.badPipeList)
		{
			if((_tm - this.badPipeList[i]) >= this.config.BAD_PEER_TIME)
			{
				delete this.badPipeList[i];
			}
		}	
	},
	hasPipe:function(arr,id,b)
	{
		for( var i=0 ; i<arr.length ; i++ )
		{
			if(b)
			{
				if(arr[i].remoteID == id )
				{
					return i;
				}
			}
			else
			{
				if( arr[i] == id )
				{
					return i;
				}
			}
		}
		return -1;
	},
	getSuccessPeerList:function(peerID)
	{
		var _arr=[];
		if(!this.pipeListArr) return _arr;
		
		for(var i=0 ; i<this.pipeListArr.length ; i++)
		{	
			var _pipe = this.pipeListArr[i];
			if(_pipe.remoteID !== ""&& 
			   _pipe.remoteID != peerID&&
			   this.pipeListArr[i].status)
			{
				_arr.push(_pipe.uir);
			}
		}
		return _arr;
	},
	startTimer:function(id,callback,dalytime)
	{
		this.stopTimer(id);
		this[id]  = setInterval(callback,dalytime,this);
	},
	
	stopTimer:function(id)
	{
		if(this[id]!=-1)
		{
			clearInterval(this[id]);
			this[id]=-1;
		}
	},
	clearPipe:function()
	{
		if(this.pipeListArr)
		{
			for(var i=this.pipeListArr.length-1 ; i>=0 ; i--)
			{
				this.pipeListArr[i].clear();
				
				this.pipeListArr[i] = null;
				this.pipeListArr.splice(i,1);		
			}
			this.pipeListArr  = null;
		}
	},
	clear:function()
	{
		this.stopTimer("peerHartBeatTimerID");
		this.stopTimer("gatherTimerID");			
		
		this.clearPipe();
		this.badPipeList  = null;
		this.sparePipeArr = null;
		
		this.pipeSuccessNum = 0;
	},
});/**
 * 
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.WSPipe = h5$.createClass({
	/**config
	 * statics
	 * loadManager
	 * p2pLoader
	 * groupID,
	 * remoteID,
	 * host,
	 * port
	 * termid
	 * */
	status:false,//连接状态
	connectFail:false,
	openHashhand:false,
	signal:null,
	isDead:false,
	beginTime:0,
	uir:'',
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.beginTime = this.config.localTime;
		var _params = {
				config:this.config,
				initData:this.initData,
				statics:this.statics,
				p2pLoader:this.p2pLoader,
				dataManager:this.dataManager,
				dataConvert:this.dataConvert,
				peer:this,
				groupID:this.groupID,
				remoteID:this.remoteID,
				type:'WS'
				};
		this.signal = new h5$.com.p2p.loaders.p2ploader.Signalling(_params);
		this.signal.init();
	},
	start:function()
	{
		//request握手信息头
		var _os = 'mac';
		var _ver = this.config.VERSION;
		this.handleExtensions=
			"xMtepClientId="+encodeURIComponent(this.config.uuid)+
			"&xMtepClientModule=h5"+
			"&xMtepClientVersion="+encodeURIComponent(_ver)+
			"&xMtepProtocolVersion=1.0"+
			"&xMtepBusinessParams="+encodeURIComponent("playType="+this.config.TYPE+"&p2pGroupId="+this.groupID)+
			"&xMtepOsPlatform="+encodeURIComponent(_os)+
			"&xMtepHardwarePlatform=pc";
		var _scope = this;
		this.uir = "ws://"+this.host+":"+this.port+"/mtep-exchange-connection?"+this.handleExtensions;
		this.websocket = new WebSocket(this.uir);
		this.websocket.onopen = function( evt ){ _scope.onWebSocketOpen(evt); };
		this.websocket.onclose = function( evt ){ _scope.onWebSocketClose(evt); };
		this.websocket.onmessage = function( message ){ _scope.onWebSocketMessage(message);};
		this.websocket.onerror = function( evt ){_scope.onWebSocketClose(evt);};
	},
	onWebSocketOpen:function()
	{
		this.status = true;
	},
	onWebSocketClose:function(evt)
	{
//		console.log("##ws::connection close!");
		this.status = false;
		this.connectFail = true;
	},
	onWebSocketMessage:function(message)
	{
		if(!this.status) return;
		
		this.beginTime = this.config.localTime;
		var data = message.data;
		switch(typeof(data))
		{
			case "string":
				if(false === this.openHashhand)
				{
					this.openHashhand = true;
					this.sendHandshake(data);
				}
				break;
			case "object":
				//信息接受
//				console.log("##receive!");
				var fileReader = new FileReader();
		    	var me=this;
		    	fileReader.onload = function() {
		    	    me.signal.processData(new Uint8Array(this.result));
		    	};
		    	fileReader.readAsArrayBuffer(data);
				break;
		}

	},
	sendMessage: function()
	{
//		console.log("##send");
		var _bytes = this.signal.getSendData();
		this.websocket.send(new Blob([_bytes]));
	},
	//握手信息
	sendHandshake:function(value)
	{
		//数据
		if(!value)return;
		console.log("##ws：：握手成功，peer:",this.remoteID);
		this.handshakeIsOk = true;//握手成功
		var _lines = value.split(/\r?\n/);
		var _responseLine;
		while (_lines.length > 0) {
			_responseLine = _lines.shift();
			var _lineArr=_responseLine.split(/\: +/);
			var _header = null;
			if(_lineArr.length == 2)
			{
				_header = {
						name: header[0],
						value: header[1]
				};
			} 
			if(_header === null)
			{
				continue;
			}
			var _lcName= _header.name.toLocaleLowerCase();
			var _lcValue= _header.value.toLocaleLowerCase();
			switch(_lcName)
			{
				case "x-mtep-client-id":
					break;
				case "x-mtep-client-module":
					break;
				case "x-mtep-client-version":
					break;
				case "x-mtep-protocol-version":
					break;
				case "x-mtep-business-tags":
					break;
				case "x-mtep-os-platform":
					break;
				case "x-mtep-hardware-platform":
					break;
			}
		}
	},
	getter_isDead:function()
	{
		if(this.connectFail) return true;
		return (this.config.localTime-this.beginTime) > (3*60*1000);
	},
	clear:function()
	{
		this.beginTime = 0;
		this.signal.clear();
		this.signal = null;
	}
});/**
 * Web RTC模式
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.RTCLoader = h5$.createClass({
	
	pipeListArr:null,
	badPipeList:null,	
	sparePipeArr:null,
	
	peerHartBeatTimerInterval:1000,//获得peerlist心跳时间
	peerHeartBeatId: null,
	
	gatherTimerInterval:10000*1,//数据发送心跳时间设置
	gatherTimerId: null,
	
	isLoading:false,
	pipeSuccessNum:0,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.pipeListArr = [];
		this.badPipeList= {};
		this.sparePipeArr= [];
	},
	start:function()
	{
		//需要加载数据节点
		var _serverUrl=this.initData.serverurl||'ws://127.0.0.1:20070/';
		var _me = this;
		this.websocket = new WebSocket(_serverUrl);
		this.websocket.onopen = function( evt ){ _me.onWebSocketOpen(evt); };
		this.websocket.onclose = function( evt ){ _me.onWebSocketClose(evt); };
		this.websocket.onerror = function( evt ){ _me.onWebSocketClose(evt); };
		this.websocket.onmessage = function( message ){ _me.onWebSocketMessage(message); };
	},
	//websocket创建成功！
	onWebSocketOpen: function( evt )
	{
		console.log('##::WebRTC::Manager: WebSocket open',this.groupID);
		this.sendMessage({
					method: "registerRequest",
					streamId: this.groupID,
					nodeInfo:this.nodeInfo(),
					localTime: this.config.localTime
				});
	},
	//websocket创建失败！
	onWebSocketClose: function( evt )
	{
		console.log('##::WebRTC::Manager: WebSocket close');
		this.delayOpen(5000);
	},
	delayOpen:function(timeout)
	{
		this.clear();
		console.log('WebRTC::Manager: Delay open after ' + timeout + 'ms ...');
		var me = this;
		if( this.delayOpenTimerId > 0 ){
			clearTimeout(this.delayOpenTimerId);
		}
		this.delayOpenTimerId = setTimeout(function()
		{
			me.delayOpenTimerId = 0;
			me.start();
		}, timeout);
	},
	onWebSocketMessage: function( evt )
	{
		var me = this;
		var message = JSON.parse(evt.data);
		console.log("##::message:",message);
		switch( message.method )
		{
			case 'registerResponse'://registerResponse
				if( message.errorCode !== 0 )
				{
					console.log('##::WebRTC:: register failed: ' + message.errorCode);
					break;
				}
				this.peerID = message.peerId;
				//开启创建节点定时器
				this.startTimer("peerHeartBeatId",this.peerHartBeatTimer,this.peerHartBeatTimerInterval);
				//开启获取节点定时器
				this.startTimer("gatherTimerId",this.gatherTimer,300);
				break;
				
			case 'heartbeatResponse':
				this.wsHeartBeatTime = this.config.localTime;		
				break;
				
			case 'queryPeerListResponse':
				this.success(message);
				break;
				
			case 'proxyDataRequest':
				if( typeof(message.data) == 'string' )
				{
					message.data = JSON.parse(h5$.lzwDecode(message.data));
				}
				this.onRemotePeerMessage(message.sourcePeerId, message.data);			
				break;
				
			case 'proxyDataResponse':
				console.log('##::WebRTC::Manager: WebSocket proxy data response code: ' + message.errorCode);	
				break;
				
			default:
				console.log('##::WebRTC::Manager: WebSocket unknown method: ' + message.method);
				break;
		}
	},
	sendMessage: function( message )
	{
		if( typeof(message) != 'string' )
		{
			message = JSON.stringify(message);
		}
		if(this.websocket)
		{
			this.websocket.send(message);	
		}
	},
	peerHartBeatTimer:function(scope)
	{
		var _peerInfo = {};
		scope.pipeSuccessNum = 0;
		for(var idx = scope.pipeListArr.length-1; idx >= 0; idx--)
		{
			var _pipe = scope.pipeListArr[idx];
			if (_pipe.isDead)
			{
				scope.badPipe(_pipe.remoteID,idx);
				continue;
			}
			scope.pipeSuccessNum++;
			var _data = _pipe.signal;
			_peerInfo[_data.remoteID] = {
					sname:'RTC',
					name:_data.remoteID, 
					farID:_data.remoteID, 
					ip:"-",
					speed:_data.speed,
					lasttime:_pipe.beginTime,
					dsize:Math.round(_data.downSize*100/1024/1024)/100,
					dnum:_data.downNum,
					ssize:Math.round(_data.shareSize*100/1024/1024)/100,
					snum:_data.shareNum,
					ck:_data.errck+"/"+_data.ck,
					other:Math.abs(_data.dl)+"/"+_data.res+"/"+_data.req+"/"+(_data.res+_data.req),
					state: _pipe.status
			};
		}
		scope.pushSparePeerIntoPipeList();
		scope.statics.peerInfo(_peerInfo,scope.pipeSuccessNum,(scope.pipeListArr.length+scope.sparePipeArr.length),scope.groupID,"rtc");
	},
	pushSparePeerIntoPipeList:function()
	{
		while(this.sparePipeArr.length>0)
		{
			if(this.pipeListArr.length < this.config.MAX_PEERS)
			{
				this.createPeer(this.sparePipeArr.shift());
			}
		}
	},
	//获得peerlist心跳
	gatherTimer:function(scope)
	{
		if(scope.isLoading) return;
		scope.isLoading = true;
		if(-1!=scope.gatherTimerID)
		{
			scope.startTimer("gatherTimerId",scope.gatherTimer,scope.gatherTimerInterval);
		}
		
		if(scope.pipeListArr.length+scope.sparePipeArr.length >= scope.config.MAX_PEERS ) return;
		
		scope.statics.gatherStart(scope.selector);
		scope.sendMessage(
		{
			method: "queryPeerListRequest",
			limit: 10
		});
	},
	success: function( message )
	{
		console.log("##::webrtc::分析返回节点",message);
		this.isLoading = false;
		
		this.clearBadPipe();
		var _remoteID = "";
		var _arr = message.items;
		
		for( var i = 0 ; i<_arr.length ; i++ )
		{
			_remoteID = _arr[i].peerId;
			if( _remoteID !== ""&&
				!this.badPipeList[_remoteID]&&
				_remoteID != this.peerID&&
				-1 == this.hasPipe(this.pipeListArr,_remoteID,true)
			)
			{
				console.log("##create peer:",this.pipeListArr.length,this.config.MAX_PEERS);
				if( this.pipeListArr.length < this.config.MAX_PEERS)
				{
					this.createPeer(_arr[i]);
				}
				else
				{
					/**将arr中剩余的空闲节点保存*/
					if( -1 == this.hasPipe(this.sparePipeArr,_remoteID,false) )
					{
						
						this.pushPeerID(this.sparePipeArr,_arr[i]);
					}							
				}
			}		
		}
	},
	//主动连接
	createPeer:function(value)
	{
		console.log("##::create ws pipe:"+value);
		var _params = {dataManager:this.dataManager,
				dataConvert:this.dataConvert,
				p2pLoader:this,
				config:this.config,
				initData:this.initData,
				statics:this.statics,
				p2pcluster:this.p2pCluster,
				groupID:this.groupID,
				remoteID:value.peerId,
				passive:false
				};
		var _pipe = new h5$.com.p2p.loaders.p2ploader.Peer(_params);
		_pipe.init();
		_pipe.start();
		this.pipeListArr.push(_pipe);
	},
	pushPeerID:function(arr,value)
	{
		arr.push(value);
		if(arr.length>50)
		{
			arr.shift();
		}
	},
	badPipe:function(remoteID,idx)
	{
		/**
		 * 当节点连接失败时,在_badPipeList列表中创建key=pipeID的对象，并将本地时间存入该对象，
		 * 此时间用来对比存入_badPipeList的时长
		 * */
		this.badPipeList[remoteID] = this.config.localTime;
		this.pipeListArr[idx].clear();
		this.pipeListArr[idx] = null;
		this.pipeListArr.splice(idx, 1);			
	},
	clearBadPipe:function()
	{
		var _tm = this.config.localTime;
		for (var i in this.badPipeList)
		{
			if((_tm - this.badPipeList[i]) >= this.config.BAD_PEER_TIME)
			{
				delete this.badPipeList[i];
			}
		}	
	},
	hasPipe:function(arr,id,b)
	{
		for( var i=0 ; i<arr.length ; i++ )
		{
			if(b)
			{
				if(arr[i].remoteID == id )
				{
					return i;
				}
			}
			else
			{
				if( arr[i] == id )
				{
					return i;
				}
			}
		}
		return -1;
	},
	getSuccessPeerList:function(peerID)
	{
		var _arr=[];
		if(!this.pipeListArr) return _arr;
		
		for(var i=0 ; i<this.pipeListArr.length ; i++)
		{	
			var _pipe = this.pipeListArr[i];
			if(_pipe.remoteID !== ""&& 
			   _pipe.remoteID != peerID&&
			   this.pipeListArr[i].status)
			{
				_arr.push(_pipe.uir);
			}
		}
		return _arr;
	},
	nodeInfo:function()
	{
		var arr = String(this.initData.geo).split(".");
		if( arr.length < 4 )
		{
			return {
				ver: 'test',
				pos: (this.config.ADD_DATA_TIME >= 0?this.config.ADD_DATA_TIME:0),
				neighbors:this.pipeSuccessNum,
				isp: 1,
				country: 'cn',
				province: 1,
				city: 1,
				area: 0
			};
		}
		return {
			ver: this.config.VERSION,
			pos: (this.config.ADD_DATA_TIME >= 0?this.config.ADD_DATA_TIME:0),
			neighbors:this.pipeSuccessNum,
			isp: arr[3],
			country: arr[0],
			province: arr[1],
			city: arr[2],
			area: 0
		};
	},
	onRemotePeerConnectResponse: function( peerId, message )
	{
		var _conn = null;
		for( var i = 0; i < this.pipeListArr.length; i ++ )
		{
			var item = this.pipeListArr[i];
			if( item.remoteID == peerId && item.connectionId == message.remoteConnectionId )
			{
				item.remoteConnectionId = message.connectionId;
				_conn = item;
				break;
			}
		}
		
		if(!_conn ) return;
		_conn.acceptAnswer(message.iceCandidates, message.sdpDescriptions);
	},
	onRemotePeerConnectRequest: function(peerId, message )
	{
		console.log("##RTC::create..",this.peerID,peerId);
		var _pipe = new h5$.com.p2p.loaders.p2ploader.Peer(
		{
			dataManager:this.dataManager,
			dataConvert:this.dataConvert,
			p2pLoader:this,
			config:this.config,
			initData:this.initData,
			statics:this.statics,
			p2pcluster:this.p2pCluster,
			passive:true,
			groupID:this.groupID,
			remoteID: peerId,
			remoteConnectionId: message.connectionId, 
			iceServers: message.iceServers || this.iceServers,
			sdpOptions: message.sdpOptions,
			remoteIceCandidates: message.iceCandidates,
			remoteSdpDescriptions: message.sdpDescriptions
		});
		_pipe.init();
		_pipe.start();
		this.pipeListArr.push(_pipe);
	},
	onRemotePeerMessage: function( peerId, message )
	{
		console.log('##p2p::WebRTC::Manager: RemotePeer action: ' + message.action + ', from: ' + peerId);	
		switch( message.action )
		{
			case 'connectRequest':
				this.onRemotePeerConnectRequest(peerId, message);
				break;
			case 'connectResponse':
				this.onRemotePeerConnectResponse(peerId, message);
				break;
			default:
				console.log('p2p::WebRTC::Manager: RemotePeer unknown action: ' + message.action);
				break;
		}
	},
	startTimer:function(id,callback,dalytime)
	{
		this.stopTimer(id);
		this[id]  = setInterval(callback,dalytime,this);
	},
	
	stopTimer:function(id)
	{
		if(this[id]!=-1)
		{
			clearInterval(this[id]);
			this[id]=-1;
		}
	},
	clearPipe:function()
	{
		if(this.pipeListArr)
		{
			for(var i=this.pipeListArr.length-1 ; i>=0 ; i--)
			{
				this.pipeListArr[i].clear();
				this.pipeListArr[i] = null;
				this.pipeListArr.splice(i,1);		
			}
			this.pipeListArr  = [];
		}
	},
	clear:function()
	{
		this.stopTimer("peerHartBeatTimerID");
		this.stopTimer("gatherTimerID");			
		
		this.clearPipe();
		this.badPipeList  = {};
		this.sparePipeArr = [];
		
		this.pipeSuccessNum = 0;
	},
});/**
 * 
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.Peer = h5$.createClass({
	/**config
	 * statics
	 * dataManager
	 * dataConvert
	 * p2pLoader
	 * groupID,
	 * remoteID,
	 * initData
	 * passive
	 * */
	status:false,//连接状态
	connectFail:false,
	signal:null,
	isDead:false,
	beginTime:0,
	sendTime:0,
	uir:'',
	
	localIceCandidates: [],
	localSdpDescriptions: null,
	remoteIceCandidates: [],
	remoteSdpDescriptions: null,
	ip:"",
	iceOptions:null,
	sdpOptions:null,
	iceServers:null,
	dataChannel: null,
	peer:null,
	connectionId:0,
	remoteConnectionId: 0,
	hartBeatTimerId:-1,//
	hartBeatTimerInterval:30*1000,//发送数据超时时间设置
	timeOutId:-1,
	
	rTotalData_len:0,
	rData_len:0,
	rData:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.connectionId = this.config.nextConnectionId++;
		this.localIceCandidates = this.localIceCandidates || [];
		this.remoteIceCandidates = this.remoteIceCandidates || [];
		this.iceOptions = this.iceOptions || {"optional": []};
		this.sdpOptions = this.sdpOptions || {'mandatory': {'OfferToReceiveAudio': false, 'OfferToReceiveVideo': false}};
		this.beginTime = this.config.localTime;
		var _params = {
				config:this.config,
				initData:this.initData,
				statics:this.statics,
				p2pLoader:this.p2pLoader,
				dataManager:this.dataManager,
				dataConvert:this.dataConvert,
				peer:this,
				groupID:this.groupID,
				remoteID:this.remoteID,
				type:'RTC'
				};
		this.signal = new h5$.com.p2p.loaders.p2ploader.Signalling(_params);
		this.signal.init();
	},
	//创建rtc链接
	start: function()
	{
		var _iceUrl=this.initData.iceServer;
		this.iceServers=
			[
				{
					url: _iceUrl+'?transport=udp'
				}
			];
		console.log("##::WebRTC::",this.passive);
		this.peer = new RTCPeerConnection(
		{
			iceServers: this.iceServers
		}, this.iceOptions);
		this.setPeerEvents(this.peer);
		if(this.passive)
		{
			this.peer.setRemoteDescription(new RTCSessionDescription({type: 'offer', sdp: this.remoteSdpDescriptions}));
			this.answerOffer();
		}
		else
		{
			console.log("####::WebRTC::create data channel");
			this.dataChannel = this.peer.createDataChannel('peerChannel');
//			this.dataChannel.binaryType = "blob";
			this.setChannelEvents(this.dataChannel);
		}
	},
	setPeerEvents: function(peer)
	{
		var me = this;
		peer.onnegotiationneeded = function(){ me.onPeerOpen(); };
		peer.onicecandidate = function(evt){ me.onPeerIceCandidate(evt); };
		peer.ondatachannel = function(evt){ me.onPeerDataChannel(evt); };
	},
	setChannelEvents: function( channel )
	{
		var me = this;
		channel.onopen = function(evt){ me.onChannelOpen(channel, evt); };
		channel.onmessage = function(evt){ me.onChannelMessage(channel, evt); };
		channel.onerror = function(evt){ me.onChannelError(channel, evt); };
		channel.onclose = function(evt){ me.onChannelClose(channel, evt); };
	},

	onPeerOpen: function()
	{
		console.log('####::WebRTC::Connection(' + this.connectionId + '): peer open, ' + this.remoteIceCandidates.length + ' ice candidates');
		this.state="connect";
		if(!this.passive)
		{
			this.createOffer();
		}
	},
	answerOffer: function()
	{
		var me = this;
		this.peer.createAnswer(function( description ){
				me.onPeerCreateAnswer(description, null);
			}, 
			function( err ){
				me.onPeerCreateAnswer(null, err);
			}, this.sdpOptions);
	},
	createOffer: function()
	{
		var me = this;
		this.peer.createOffer(function( description )
		{
			me.onPeerCreateOffer(description, null);
		}, function( err )
		{
			me.onPeerCreateOffer(null, err);
		}, this.sdpOptions);
	},
	onPeerCreateOffer: function( description, err )
	{
		console.log('##::WebRTC::Peer(' + this.connectionId + '): peer create offer: ' + (err ? err : 'OK'));
		if( err )
		{
			return;
		}
//		console.log('##::WebRTC::Connection(' + this.connectionId + '): desc: ',description.sdp);
		this.peer.setLocalDescription(description);
		this.localSdpDescriptions = description.sdp;
	},
	sendConnectRequest: function()
	{
		console.log("##::WebRTC::Peer:",this.status);
		if( this.status || this.localIceCandidates.length < 1)
		{
			return;
		}
		
		var proxyData =
		{                                             
			action:'connectRequest',
			connectionId: this.connectionId,
			iceServers: this.iceServers,
			sdpOptions: this.sdpOptions,
			iceCandidates: this.localIceCandidates,
			sdpDescriptions: this.localSdpDescriptions
		};

		console.log('##::WebRTC::::Peer(' + this.connectionId + '): send connect request ...',this.remoteID);
		this.status = true;
		this.p2pLoader.sendMessage(
		{
			method: 'proxyDataRequest',
			destPeerId: this.remoteID,
			data: h5$.lzwEncode(JSON.stringify(proxyData))
		});
	},
	onPeerCreateAnswer: function( description, err )
	{
		console.log('##::WebRTC::Peer(' + this.connectionId + '): peer create answer : ' + (err ? err : 'OK'));
		if( err )
		{
			return;
		}
		if(this.remoteIceCandidates) this.addPeerIceCandidates(this.remoteIceCandidates);
		this.peer.setLocalDescription(description);
		this.localSdpDescriptions = description.sdp;
		this.sendConnectResponse();
	},
	addPeerIceCandidates: function( candidates )
	{
		if( Object.prototype.toString.call(candidates) == '[object Array]' )
		{
			for( var i = 0; i < candidates.length; i ++ )
			{
				this.peer.addIceCandidate(new RTCIceCandidate(typeof(candidates[i]) != 'string' ? candidates[i] :
				{
					sdpMLineIndex: 0,
					sdpMid: 'data',
					candidate: candidates[i]
				}));
			}
		}
		else
		{
			this.peer.addIceCandidate(new RTCIceCandidate(candidates));
		}
	},
	acceptAnswer: function( candidates, sdpDescriptions )
	{
		console.log('##::WebRTC::Peer(' + this.connectionId + '): accept answer');
		
		this.remoteIceCandidates = candidates;
		this.remoteSdpDescriptions = sdpDescriptions;
		this.peer.setRemoteDescription(new RTCSessionDescription({type: 'answer', sdp: sdpDescriptions}));
		this.addPeerIceCandidates(candidates);
	},
	sendConnectResponse: function()
	{
		if(this.status || this.localIceCandidates.length < 1 )
		{
			return;
		}
		var proxyData =
		{
			action:'connectResponse',
			connectionId: this.connectionId,
			remoteConnectionId: this.remoteConnectionId,
			sdpOptions: this.sdpOptions,
			iceCandidates: this.localIceCandidates,
			sdpDescriptions: this.localSdpDescriptions
		};

		console.log('##::WebRTC::Peer(' + this.connectionId + '): send connect...',this.remoteID,proxyData);
		this.status = true;
		this.p2pLoader.sendMessage(
		{
			method: 'proxyDataRequest',
			destPeerId: this.remoteID,
			data: h5$.lzwEncode(JSON.stringify(proxyData))
		});
	},
	
	onPeerIceCandidate: function( evt )
	{
		console.log('##::WebRTC::Peer(' + this.connectionId + '): peer－－》' ,evt.candidate);
		if(evt.candidate )
		{
			this.localIceCandidates.push(evt.candidate);
			
		}
		else
		{
			if( this.passive ) this.sendConnectResponse();
			else this.sendConnectRequest();
		}
	},

	onPeerDataChannel: function( evt )
	{
		console.log('##::WebRTC::Peer(' + this.connectionId + '): peer data channel connected, channel name: ' + evt.channel.label);
		this.dataChannel = evt.channel;
		this.setChannelEvents(evt.channel);
		this.onPeerOpen();
	},
	sendMessage:function()
	{
		if(this.config.localTime - this.sendTime < 1000 || !this.status)
		{
			var _me = this; 
			if(this.timeOutId!=-1)
			{
				clearTimeout(this.timeOutId);
				this.timeOutId = -1;
			}
			this.timeOutId = setTimeout(function(){_me.sendMessage();},1000);
			return;
		}
		this.sendTime = this.config.localTime;
		if(this.dataChannel)
		{
			var _bytes = this.signal.getSendData();
			this.dataChannel.send(_bytes);
		}
	},
	//channel事件
	onChannelOpen: function( channel, evt )
	{
		console.log('##::WebRTC::Peer(' + this.connectionId + '): channel open');
		//打开数据发送心跳
		if(!this.passive)
		{
			this.sendMessage();
			this.startTimer("hartBeatTimerId",this.hartBeatTimer,1000);
		}
	},
	hartBeatTimer:function(scope)
	{
		//
		if(scope.config.localTime-scope.beginTime>scope.hartBeatTimerInterval&&this.status)
		{
			//超时，重新开始发送数据
			console.log("##::webrtc::sending-data time out!");
			scope.sendMessage();
		}
	},
	onChannelMessage: function( channel, evt )
	{
		//接收到数据
		this.beginTime = this.config.localTime;
		var _barry=new Uint8Array(evt.data);
		//提取前4位，如果前4位为0则为数据开始，然后
		if(_barry[0] === 0&&_barry[1] === 0&&_barry[2] === 0&&_barry[3] === 0)
		{
			this.rData=new ByteArray();
			this.rData_len = _barry.length;
			this.rTotalData_len = (_barry[4]<<24) + (_barry[5]<<16) + (_barry[6]<<8) + _barry[7];
		}
		else
		{
			this.rData_len = this.rData_len+_barry.length;
		}
		this.rData.writeBytes(_barry);

		if(this.rData_len>=this.rTotalData_len)
		{
			this.rData_len = 0;
			this.rTotalData_len = 0;
			this.signal.processData(this.rData.uInt8Array);
		}
	},
	onChannelError: function( channel, evt )
	{
		this.closeChannel(evt);
	},
	onChannelClose: function( channel, evt )
	{
		this.closeChannel(evt);
	},
	closeChannel:function(evt)
	{
		this.status = false;
		this.connectFail = true;
		this.dataChannel = null;
		console.log('##::WebRTC::Peer(' + this.connectionId + '): channel close',evt);
	},
	getter_isDead:function()
	{
		if(this.connectFail) return true;
		if(this.beginTime>0) return (this.config.localTime-this.beginTime) > (3*60*1000);
	},
	startTimer:function(id,callback,dalytime)
	{
		this.stopTimer(id);
		this[id]  = setInterval(callback,dalytime,this);
	},
	
	stopTimer:function(id)
	{
		if(this[id]!=-1)
		{
			clearInterval(this[id]);
			this[id]=-1;
		}
	},
	clear:function()
	{
		this.stopTimer("hartBeatTimerId");
		this.peer=null;
		this.connectionId=0;
		this.connectFail=false;
		this.remoteID=null;
		this.remoteConnectionId=0;
		this.dataChannel=null;
		this.iceServers=null;
		this.iceOptions=null;
		this.sdpOptions=null;
		this.localIceCandidates=null;
		this.localSdpDescriptions=null;
		this.remoteIceCandidates=null;
		this.remoteSdpDescriptions=null;
		this.status=false;
		this.beginTime=0;//节点是否活跃开始时间
		this.sendTime=0;
		this.hartBeatTimerInterval=0;
		this.hartBeatTimerId=-1;
	}
});
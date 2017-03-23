/**
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
			console.log("-->cdn data load over",this.task);
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
});
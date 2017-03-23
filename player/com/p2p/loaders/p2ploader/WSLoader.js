/**
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
});
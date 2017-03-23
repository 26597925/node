/**
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
});
/**
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
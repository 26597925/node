/**
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
});
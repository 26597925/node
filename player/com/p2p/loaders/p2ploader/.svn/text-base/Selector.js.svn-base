h5$.nameSpace('com.p2p.loaders.p2ploader');
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

/**
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
});
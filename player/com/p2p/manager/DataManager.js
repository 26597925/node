/**
 * 
 */
h5$.nameSpace("com.p2p.manager");
h5$.com.p2p.manager.DataManager = h5$.createClass({
	statics:null,
	config:null,
	initData:null,
	parseUrl:null,
	
	m3u8Loader:null,
	loadManager:null,
	groupList:null,
	
	__ctor:function()
	{
		this.statics = h5$.com.p2p.statics.Statics;
		this.config = h5$.com.p2p.vo.Config;
		this.initData = h5$.com.p2p.vo.InitData;
		this.parseUrl = h5$.com.utils.ParseUrl;
		var _params = {dataManager:this,config:this.config,initData:this.initData,statics:this.statics,parseUrl:this.parseUrl};
		this.groupList = new h5$.com.p2p.data.GroupList(_params);
		this.loadManager = new h5$.com.p2p.loaders.LoadManager(_params);
		this.m3u8Loader = new h5$.com.p2p.loaders.M3u8Loader(_params);
	},
	init:function()
	{
		this.groupList.init();
		this.m3u8Loader.init();
		this.loadManager.init();
	},
	startPlay:function()
	{
		if(this.config.PLAY_TYPE != this.config.M3U8_TYPE)
		{
			this.loadManager.start();
		}
		this.m3u8Loader.start();
	},
	seek:function()
	{
		this.loadManager.start();
	},
	addBlock:function (clipList)
	{
		//把m3u8数据列表放到grouplist中，并在groupIDlist中标记
		var _len = clipList.length;
		if(_len > 0)
		{
			for( var i = 0; i < _len; i++ )
			{
				if(i<_len-1)
				{
					clipList[i].nextID = clipList[i+1].timestamp;
				}
				this.groupList.addBlock(clipList[i]);
			}
		}
		if(this.config.TYPE == this.config.VOD)
		{
			this.config.lastID = clipList[_len-1].timestamp;
		}
	},
	getBlock:function(id)
	{
		if (!this.groupList) return null;
		//获得block group相关信息
		var _blockID = this.groupList.getBlockId(id);
		if(!_blockID) return null;
//		console.log("**datamanager--id",id);
		
		this.config.G_SEEKPOS = 0;
		return this.groupList.getBlock(_blockID);
	},
	getTNRange:function(groupID)
	{
		if(this.groupList) return this.groupList.getTNRange(groupID);
		return null;
	},
	
	getPNRange:function(groupID)
	{
		if(this.groupList) return this.groupList.getPNRange(groupID);
		return null;
	},
	getPiece:function(param)
	{
		if (this.groupList) return this.groupList.getPiece(param);
		return null;
	},
	getBlockArray:function()
	{
		if(this.groupList) return this.groupList.getBlockArray();
		return null;
	},
	getGroupIDList:function()
	{
		if(this.groupList) return this.groupList.getGroupIDList();
		return null;
	},
	getP2PTask: function ( value )
	{
		if(this.loadManager) return this.loadManager.getP2PTask(value);
		return null;
	},
	getEmptyBlock:function()
	{
		var _arr = [];
		if(this.groupList){
			_arr = this.groupList.getBlockArray();
		}
		var _len = _arr.length;
		if(_len === 0) return 0;
		var _index = _len;
		var _scope = this;
		_arr.some(function (value, index, array) {
			if(value > _scope.config.ADD_DATA_TIME){
				_index = index;
				return index;
			}
		});
		return _len - _index;
	},
	reset:function()
	{
		this.m3u8Loader.reset();
		this.groupList.reset();
		this.loadManager.init();
	}
});
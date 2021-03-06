/**
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
						console.log(_temPiece.isChecked,_temPiece.iLoadType,_blk.id);
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
});
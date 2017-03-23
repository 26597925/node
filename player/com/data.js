h5$.nameSpace("com.p2p.data");
h5$.com.p2p.data.Clip = h5$.createClass
({
	/**时间戳*/
	timestamp: -1,
	/**数据块的字节*/
	size: -1,
	/**数据块播放时长*/
	duration: -1,
	/**groupID*/
	groupID: '',
	/**文件名*/
	name: "",
	url_ts: '',
	
	/**块校验码*/
	block_checkSum: '',
	
	sequence: 0,
	pieceTotal: 0,
	
	width: 0,
	height: 0,
	totalDuration: 0,
	
	discontinuity: 0,
	
	/**总字节偏移量*/
	offsize: 0,
	
	/**片校验码*/
	pieceInfoArray:[],
	nextID: -1
});
/**
 * 
 */
h5$.nameSpace("com.p2p.data");
h5$.com.p2p.data.Block = h5$.createClass({
	/**外部设置
	 * config:null,
	 * parseUrl:null,
	 * blockList:null,
	 * statics:null,
	 * pieceList:null,*/
	
	id:-1,//时间戳
	nextblkid:-1,//下一片时间戳
	url:"",//ts地址
	groupID: "",
	name: "",
	/**该片影片时长*/
	duration: 0,	
	/**该片影片时长*/
	width: 0,	
	/**该片影片时长*/
	height: 0,		
	/**该块ts文件的视频数据大小*/
	size: -1,
	offSize: 0,
	/**是否已经checksum验证过*/
	checked:false,
	/**按先后顺序存储该block逻辑分片(piece)的索引,piece按照tn,pn出现的先后顺序填入pieceIdxArray中*/
	pieceIdxArray:null,	
	discontinuity:0,
	isLoaded:0,//0初始化，1:cdn下载失败
	stream:null,
	timestamp:0,//实际时间戳
	hasPiece:true,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.pieceIdxArray =[];
	},
	setter_pieceInfoArray: function(arr)
	{
		if( this.pieceIdxArray.length>0 )
		{
			return;
		}
		if(arr.length === 0){
			this.hasPiece = false;
			return;
		}
		this.hasPiece = true;
		var _tempPiece = null;
		for(var i=0;i<arr.length;i++)
		{
			var params = {statics:this.statics,blockList:this.blockList};
			_tempPiece = new h5$.com.p2p.data.Piece(params);
			_tempPiece.init();
			_tempPiece.id = i;
			_tempPiece.blockId = this.id;
			_tempPiece.groupID = this.groupID;
			_tempPiece.checkSum = this.parseUrl.getParam(arr[i],"CKS");
			_tempPiece.size = this.parseUrl.getParam(arr[i],"SZ");
			if(_tempPiece.size === 0)
			{
				_tempPiece.from ="http";
				_tempPiece.isChecked = true;
				_tempPiece.iLoadType =3;
			}
			_tempPiece.type = arr[i].indexOf("PN")>-1 ? "PN" : (arr[i].indexOf("TN")>-1?"TN":"");
			_tempPiece.pieceKey = this.parseUrl.getParam(arr[i],_tempPiece.type);
			
			if(!this.blockList.checkPiece(_tempPiece))
			{
				/**添加所在block的pieceIdArray列表*/
				this.pieceIdxArray.push({
					"groupID":this.groupID,
					"type":_tempPiece.type,
					"pieceKey":_tempPiece.pieceKey
				});
			}
		}
	},

	/**获得块对应.dat文件,默认返回null*/
	getBlockStream:function()
	{
		if(!this.hasPiece) return this.stream;
		var _byteArray = new ByteArray();			
		var _tempPiece = null;
		//检查该block的 piece是否都加载完成
		var _canUse = true;
		for(var i=0;i<this.pieceIdxArray.length;i++)
		{
			_tempPiece = this.blockList.getPiece(this.pieceIdxArray[i]);
			if(!_tempPiece.isChecked)
			{
				_canUse = false;
				break;
			}
		}
		if(!_canUse)return null;

		for(i=0; i<this.pieceIdxArray.length; i++ )
		{				
			_tempPiece = this.blockList.getPiece(this.pieceIdxArray[i]);
			if( _tempPiece )
			{
				var _byte = _tempPiece.getStream();
				if(_byte && _byte.length > 0 )
				{
					try
					{
						_byteArray.writeBytes(_byte);
					}
					catch(err)
					{
						console.log(err);
						return null;
					}
				}
			}				
		}
		return _byteArray;
	},
	/**获得块对应.dat或.header的单个片,默认返回null*/
	getPiece:function(id)
	{
		if(this.blockList === null) return null;
		return this.blockList.getPiece(this.pieceIdxArray[id]);
	},
	getter_isChecked:function()
	{
		if( !this.checked )
		{
			this.checked = this.doCheck();
		}
		return this.checked;
	},
	setter_isChecked:function(value)
	{
		this.checked = value;
	},
	doCheck:function()
	{
		if(!this.checked )
		{
			if(!this.hasPiece) return false;
			var _piece = null;
			var _i;
			for(_i=0;_i<this.pieceIdxArray.length;_i++)
			{
				_piece = this.blockList.getPiece(this.pieceIdxArray[_i]);
				if( _piece && !_piece.isChecked)
				{
					return false;
				}
			}		
			_i = this.config.TaskCache.indexOf(this.id);
			if( -1 != _i )
			{
				this.config.TaskCache.splice(_i, 1);
			}
		}
		return true;
	},
	reset:function()
	{
		console.log("淘汰刷新 reset");
		this.isChecked = false;
		var _tempPiece;
		for(var i=0;i<this.pieceIdxArray.length;i++)
		{
			_tempPiece = this.blockList.getPiece(this.pieceIdxArray[i]);
			if(_tempPiece)
			{
				_tempPiece.reset();
			}
		}
	},
	clear:function()
	{
		//淘汰block
		var info={};
		info.code = "Load.Range.DeleteBlock";
		info.info = {"id":this.id,"piece":this.pieceIdxArray};
		this.statics.sendToJs(info);
		//清除piece
		var _tempPiece;
		var _i;
		for(_i=0;_i<this.pieceIdxArray.length;_i++)
		{
			_tempPiece = this.blockList.getPiece(this.pieceIdxArray[_i]);
			if(_tempPiece)
			{
				_tempPiece.clear();
			}
		}
		for(_i in this)
		{
			this[_i] = null;
		}
	}
});/**
 *保存一个GroupId内的所有Block
 */
h5$.nameSpace("com.p2p.data");
h5$.com.p2p.data.BlockList = h5$.createClass({
	/**外部设置
	 * config:null,
	 * parseUrl:null,
	 * blockList:null,
	 * statics:null,
	 * groupList:null,*/
	
	groupID:null,
	createTime:null,
	blockContainer:null,
	pieceList:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	addRange:function(range,idx)
	{
		if(range.length === 0)
		{
			range.push({"start":idx,"end":idx});
			return;
		}
		for( var n=0 ; n<range.length ; n++ )
		{
			if( idx+1 < range[n].start )
			{
				range.splice(n,0,{"start":idx,"end":idx});
				return;
			}
			else if( idx+1 == range[n].start )
			{
				range[n].start = idx;
				return;
			}
			else if( idx>= range[n].start && idx<=range[n].end )
			{
				return;
			}
			else if( idx-1 == range[n].end )
			{
				range[n].end = idx;
				if( range[n+1] && 
					range[n].end+1 == range[n+1].start )
				{
					range[n].end = range[n+1].end;
					range.splice(n+1,1);
				}
				return;
			}
			else if( idx-1 > range[n].end )
			{
				if( range[n+1] )
				{
					if( idx+1 < range[n+1].start )
					{
						range.splice(n+1,0,{"start":idx,"end":idx});
						return;
					}
					else if( idx+1 == range[n+1].start )
					{
						range[n+1].start = idx;
						return;
					}
				}
				else
				{
					range.push({"start":idx,"end":idx});
					return;
				}
			}
		}
	},
	deleteRange: function (range,index)
	{
		if (index <= -1) return;
		
		for(var idx = 0;idx < range.length;idx++)
		{
			if( index >= range[idx].start && index <= range[idx].end )
			{
				if( index == range[idx].start && index == range[idx].end )
				{
					range.splice(idx,1);
					return;
				}
				if( index == range[idx].start )
				{
					range[idx].start++;
					return;
				}
				if( index == range[idx].end )
				{
					range[idx].end--;
					return;
				}
				var tempEnd = range[idx].end;
				range[idx].end = index-1;
				range.splice(idx+1,0,{"start":index+1,"end":tempEnd});
				return;
			}
		}
	},
	
	getTNRange: function (gID)
	{
		if(
			this.pieceList &&
			this.pieceList[gID] &&
			this.pieceList[gID].TNRange
		)
		{
			return this.pieceList[gID].TNRange;
		}
		return null;
	},
	
	addTNRange: function (gID,index)
	{
		if(index <= -1 || !this.pieceList || !this.pieceList[gID]) return;
		
		if(!this.pieceList[gID].TNRange)
		{
			this.pieceList[gID].TNRange = [];
		}
		this.addRange(this.pieceList[gID].TNRange,index );
	},
	deleteTNRange: function (gID,index)
	{
		if (index <= -1 || !this.pieceList || !this.pieceList[gID] || !this.pieceList[gID].TNRange) return;
		this.deleteRange(this.pieceList[gID].TNRange,index );
	},	

	getPNRange: function (gID)
	{
		if(this.pieceList &&this.pieceList[gID] &&this.pieceList[gID].PNRange) return this.pieceList[gID].PNRange;
		return null;
	},
	
	addPNRange: function (gID,index)
	{
		if(index <= -1 || !this.pieceList || !this.pieceList[gID]) return;
		
		if(!this.pieceList[gID].PNRange)
		{
			this.pieceList[gID].PNRange = [];
		}
		
		var _PNRange = this.pieceList[gID].PNRange;
		this.addRange( _PNRange,index );		
		for( var i = 0; i<_PNRange.length-1; i++ )
		{
			if( _PNRange[i].start> _PNRange[i].end )
			{
				console.log( "超出警戒" );
			}
			if(_PNRange[i].end>=_PNRange[i+1].start)
			{
				console.log( "超出警戒" );
			}
		}
	},
	
	deletePNRange: function (gID,index)
	{
		if (index <= -1 || !this.pieceList || !this.pieceList[gID] || !this.pieceList[gID].PNRange) return;
		this.deleteRange(this.pieceList[gID].PNRange,index );
	},
	checkPiece:function(p)
	{
		if(!this.pieceList)
		{
			this.pieceList = {};
		}
		if(!this.pieceList[p.groupID])
		{
			this.pieceList[p.groupID] ={};
		}
		if(!this.pieceList[p.groupID][p.type])
		{
			this.pieceList[p.groupID][p.type]={};
		}
		if(!this.pieceList[p.groupID][p.type][p.pieceKey])
		{
			/**添加总列表*/
			this.pieceList[p.groupID][p.type][p.pieceKey] = p;
			return false;
		}
		return true;
	},
	getPiece: function (param)
	{
		if (!this.pieceList) return null;
		
		if(param && param.groupID && param.type && param.pieceKey)
		{
			if(
				this.pieceList[param.groupID] && 
				this.pieceList[param.groupID][param.type] && 
				this.pieceList[param.groupID][param.type][param.pieceKey]
			)
			{
				return this.pieceList[param.groupID][param.type][param.pieceKey];
			}
		}
		return null;
	},
	
	deletePiece: function deletePiece( pieceIndication )
	{
		if (!this.pieceList) return null;
		this.pieceList[pieceIndication.groupID][pieceIndication.type][pieceIndication.pieceKey] = null;
		delete this.pieceList[pieceIndication.groupID][pieceIndication.type][pieceIndication.pieceKey];
	},
	addBlock:function(clip)
	{
		if(!this.blockContainer)
		{
			this.blockContainer = [];
		}
		var _tmpBlock = this.blockContainer["id_"+clip.timestamp];
		if(_tmpBlock)
		{
			if( -1 != clip.nextID )
			{
				_tmpBlock.nextblkid = clip.nextID;
			}
			_tmpBlock.url_ts = clip.url_ts;
			return true;
		}
		
		var params = {blockList:this,
				config:this.config,
				parseUrl:this.parseUrl,
				statics:this.statics,
				pieceList:this.pieceList};
		var _block = new h5$.com.p2p.data.Block(params);
		_block.init();
		_block.id = clip.timestamp;
		_block.duration = clip.duration;
		_block.width = clip.width;
		_block.height = clip.height;
		_block.name = clip.name;
		_block.url_ts = clip.url_ts;
		_block.offSize = clip.offsize;
		_block.size = clip.size;
		_block.discontinuity  = clip.discontinuity;
		_block.groupID = clip.groupID;
		_block.nextblkid = clip.nextID;
		_block.pieceInfoArray=clip.pieceInfoArray;
		
		if(_block.duration === 0 )
		{
			/**有时最后一块会出现这种情况*/
			_block.dodurationHandler();
		}
		
		this.blockContainer["id_"+clip.timestamp] = _block;
		this.blockContainer.push(_block.id);
		this.blockContainer.sort(function(a,b){return a-b;});
		if (!_block.isChecked)
		{
			this.config.TaskCache.push(_block.id);
			//更新ronge信息
			var _info={};
			_info.code = "Load.Range.Info";
			_info.info = {"id":_block.id,"range":_block.pieceIdxArray,"task":this.config.TaskCache};
			this.statics.sendToJs(_info);
		}
		this.config.M3U8_LAST_BLOCKID = _block.id;
		return true;
	},
	getBlock:function(id)
	{
		if (!this.blockContainer)return null;
		if(id == -1)
		{
			return null;
		}
		return this.blockContainer["id_"+id];
	},
	addSize:function(size)
	{
		this.config.streamSize += size;
		this.statics.sendToJs({code:"Stream.Memory.Size",info:this.config.streamSize});
	},
	reduceSize:function(size)
	{
		this.config.streamSize -= size;
		this.statics.sendToJs({code:"Stream.Memory.Size",info:this.config.streamSize});
	},
	getGroupIDList: function ()
	{
		var _tempArr = [];
		if( this.pieceList)
		{
			for(var param in this.pieceList)
			{
				_tempArr.push(param);
			}
		}
		return _tempArr;
	},
	gEliminate:function()
	{
		this.groupList.eliminate();
	},
	
	eliminate: function (type)
	{
		if( this.config.BlockID < 0 ) return;

		if(this.config.streamSize < this.config.MEMORY_SIZE) return;
		
		var i = 0;
		var j = 0;
		var _block = null;
		if(this.config.TYPE == this.config.LIVE&&
				(this.config.streamSize >= this.config.MEMORY_SIZE||
				this.blockContainer.length >= 300 )
		)
		{
			//直播处理情况
			for( j = 0; j < this.blockContainer.length;j++ )
			{
				_block = this.getBlock(this.blockContainer[0]);
				// 这里加入淘汰前判断
				if( _block.id >= this.config.BlockID-30 )
				{
					console.log("左侧数据已经淘汰到边界");
					break;
				}
				this.realEliminate(_block,false);
				this.cleanUpPieceList();
				return;
			}	
			
			for( j = this.blockContainer.length -1; j >= 0; j-- )
			{
				_block = this.getBlock(this.blockContainer[j]);
				if(!_block) continue;
				
				if(_block.id <= this.config.M3U8_MAXTIME )
				{
					console.log("右侧数据已经淘汰到边界",_block.id);
					this.cleanUpPieceList();
					break;
				}
				this.realEliminate(_block,false);
				this.cleanUpPieceList();
				var _firstAbsens = 0;
				_block = this.getBlock(this.blockContainer[0]);
				while(_block.nextblkid != -1 )
				{
					_firstAbsens = _block.id;
					_block = this.getBlock(_block.nextblkid);
					if(!_block )
					{
						this.getBlock(_firstAbsens).nextblkid = -1;
						this.config.M3U8_MAXTIME = _firstAbsens;
						return;
					}
				}
				if(this.config.BlockID && _block.id < this.config.BlockID.id)
				{
					this.config.M3U8_MAXTIME = this.config.BlockID.id;
					return;
				}
				this.config.M3U8_MAXTIME = _block.id;
				return;
			}
		}
		else
		{
			if( "left" == type)
			{
				
				for(j = 0; j < this.blockContainer.length;j++)
				{
					if( this.blockContainer[j] >= this.config.BlockID-60 )
					{
						console.log("左侧数据已经淘汰");
						break;
					}
					_block = this.getBlock(this.blockContainer[j]);
					this.realEliminate(_block,true);
					if(this.config.streamSize >= this.config.MEMORY_SIZE )
					{
						continue;
					}
					else
					{
						this.cleanUpPieceList();
						return;
					}
				}
			}
			else if( "right" == type )
			{
				
				for(j = this.blockContainer.length -1; j >= 0;j--)
				{
					
					if( this.blockContainer[j] <= this.config.BlockID + 60 )
					{
						console.log("淘汰到右侧边界");
						this.cleanUpPieceList();
						return;
					}
					_block = this.getBlock(this.blockContainer[j]);
					this.realEliminate(_block,true);
					if(this.config.streamSize >= this.config.MEMORY_SIZE )
					{
						continue;
					}
					else
					{
						this.cleanUpPieceList();
						return;
					}
				}
			}
		}
	},
	cleanUpPieceList: function ()
	{
		for( var groupID in this.pieceList )
		{
			/**是否存在属于groupID的数据*/
			var j=0;
			for( var i in this.pieceList[groupID] )
			{
				j++;
				break;
			}
			if( j!==0 )
			{
				var tn_j=0;
				var pn_j=0;
				if( this.pieceList[groupID].TN )
				{
					for( var p in this.pieceList[groupID].TN )
					{
						tn_j++;
						break;
					}
				}
				if(this.pieceList[groupID].PN)
				{
					for( var q in this.pieceList[groupID].PN )
					{
						pn_j++;
						break;
					}
				}
				if( tn_j===0 && pn_j===0 )
				{
					/**如果groupID中的TN,PN数据为空，则删除该group*/
					this.pieceList[groupID] = null;
					delete this.pieceList[groupID];
				}
			}
			else
			{
				/**如果groupID的数据为空，则删除该group*/
				this.pieceList[groupID] = null;
				delete this.pieceList[groupID];
			}
		}
		
		if( 0 === this.streamSize && this.groupID != this.config.currentVid)
		{
			this.groupList.deleteBlockList( this.groupID );
		}		
	},
	realEliminate: function (block,isReset)
	{
		var info;
		if( isReset )
		{
			//淘汰已经下载的视频数据信息
			info={};
			info.code = "Load.Range.DeleteStream";
			var _piece;
			var _pieceArr=[];
			var _over = false;
			for(var i=0;i<block.pieceIdxArray.length;i++)
			{
				_piece = this.getPiece(block.pieceIdxArray[i]);
				if(_piece.isChecked)
				{
					_pieceArr.push(_piece.pieceInfo);
					_over = true;
				}
			}
			info.info = _pieceArr;
			this.statics.sendToJs(info);
			if(_over)
			{
				block.reset();
			}
		}
		else
		{
			if( this.blockContainer)
			{
				var _id = this.blockContainer.indexOf(block.id);
				if (_id != -1)
				{
					this.blockContainer.splice(id,1);
				}
				if(block )
				{
					var _index = this.config.TaskCache.indexOf(block.id);
					if(-1!=_index)
					{
						this.config.TaskCache.splice(index, 1);
					}
					block.clear();
					if( this.blockContainer[block.id] )
					{
						this.blockContainer[block.id] = null;
						delete this.blockContainer[block.id];
					}
				}
				block = null;
			}
		}
	},
	clear:function()
	{
		if(this.blockContainer)
		{
			for(var i=0;i<this.blockContainer.length;i++)
			{
				this.blockContainer["id_"+this.blockContainer[i]].clear();
				this.blockContainer["id_"+this.blockContainer[i]] = null;
				delete this.blockContainer[i];
			}
			this.blockContainer = null;
		}
		this.cleanUpPieceList();
		this.pieceList = null;
		this.config     = null;
		this.dataManager= null;
		
		this.groupID    = "";
		this.createTime = 0;
	}
});/**
 * 保存block的容器
 */
h5$.nameSpace("com.p2p.data");
h5$.com.p2p.data.GroupList = h5$.createClass({
	/**外部设置
	 * config:null,
	 * parseUrl:null,
	 * blockList:null,
	 * statics:null,
	 * dataManager:null,*/
	
	groupList:null,
	pieceList:null,
	groupBlocks:null,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.groupList = {} ;
		this.pieceList = {};
		this.groupBlocks=[];
	},
	//添加Ts数据
	addBlock:function(clip)
	{
//		kbps = kbps || 800;
		var _gid = clip.groupID;
		if(!this.groupList.hasOwnProperty(_gid))
		{
			var params = {initData:this.initData,
					config:this.config,
					parseUrl:this.parseUrl,
					statics:this.statics,
					pieceList:this.pieceList,
					groupList:this,
					createTime:this.config.localTime,
					groupID:_gid};
			this.groupList[_gid] = new h5$.com.p2p.data.BlockList(params);
		}
		//记录所有Block数据
		if(!this.groupBlocks["id_"+clip.timestamp])
		{
			this.groupBlocks.push(clip.timestamp);
			this.groupBlocks["id_"+clip.timestamp]=clip.groupID;
			this.groupBlocks.sort(function(a,b){return a-b;});
		}
		
		return this.groupList[_gid].addBlock(clip);
	},
	getBlock:function(id)
	{
		if(!id)return;
		var tempVid = id.gid ;
		if( this.groupList.hasOwnProperty(tempVid) )
		{
			return this.groupList[tempVid].getBlock(id.id);
		}
		return null;
	},
	getPiece:function(param)
	{
		if( param && param.hasOwnProperty("groupID") )
		{
			var _gid = param.groupID ;
			if(this.groupList.hasOwnProperty(_gid))
			{
				return this.groupList[_gid].getPiece(param);
			}
		}
		return null;
	},
	
	/**获得blockid，给定一个block所包含的时间段中任何时间戳将返回该block的id即该块的起始时间戳，没有对应值返回-1*/
	getBlockId:function(id)
	{
		if(this.groupBlocks.length === 0) return null;
		
		var _check = this.groupBlocks.indexOf(id);
		if(_check>=0)
		{
			return {"gid":this.groupBlocks["id_"+id],"id":id};
		}
//		console.log("**获取一个接近的Block！",this.groupBlocks);
		if(this.groupBlocks.length > 0 )
		{
			var end = this.groupBlocks[this.groupBlocks.length-1];
			if(id>end) return {"gid":this.groupBlocks["id_"+this.groupBlocks[this.groupBlocks.length-1]],"id":this.groupBlocks[this.groupBlocks.length-1]};
			
			var time = id - this.groupBlocks[0];
			if( Math.abs(time) < this.config.maxstep)
			{
				return {"gid":this.groupBlocks["id_"+this.groupBlocks[0]],"id":this.groupBlocks[0]};
			}
			if(time<-(this.config.maxstep))
			{
				return null;
			}
			var iLow = 0;
			var iHigh = this.groupBlocks.length -1;
			var imid = 0;
			var tid = 0;
			var nextid = 0;
			var tempblock = null;
			while( iLow <= iHigh )
			{
				imid= parseInt(( iLow + iHigh )/2);
				tid = this.groupBlocks[imid];
				
				if( imid == this.groupBlocks.length -1 )
				{
					if( id - tid < this.config.maxstep)
					{
						return {"gid":this.groupBlocks["id_"+tid],"id":tid};
					}
					return null;
				}
				nextid = this.groupBlocks[imid+1];
				if( id >= tid && id <nextid)
				{
					tempblock = this.getBlock({"gid":this.groupBlocks["id_"+tid],"id":tid});
					if( tempblock.nextblkid != -1 && id < tempblock.nextblkid )
					{
						return {"gid":this.groupBlocks["id_"+tid],"id":tid};
					}
					if( tempblock.nextblkid != -1 && id > tempblock.nextblkid && (id - tempblock.nextblkid) < this.config.maxstep)
					{
						return {"gid":this.groupBlocks["id_"+nextid],"id":nextid};
					}
					var midTime;
					if( tempblock.nextblkid == -1 )
					{
						midTime = (tid+nextid)/2;
						if( midTime > id && id -tid < this.config.maxstep)
						{
							return {"gid":this.groupBlocks["id_"+tid],"id":tid};
						}
						if( nextid - id < this.config.maxstep )
						{
							return {"gid":this.groupBlocks["id_"+nextid],"id":nextid};
						}
					}
				}
				if(id >tid)
				{
					// 右侧查找
					iLow = imid + 1;
				}
				else if(id < tid )
				{
					iHigh = imid -1;
				}
			}
		}
		return null;
	},
	getPNRange:function(gid)
	{
		if( this.groupList.hasOwnProperty(gid) )
		{
			return this.groupList[gid].getPNRange(gid);
		}
		return null;
	},
	getTNRange:function(gid)
	{	
		if(this.groupList.hasOwnProperty(gid) )
		{
			return this.groupList[gid].getTNRange(gid);
		}
		return null;
	},
	getBlockArray:function()
	{
		if( this.groupBlocks)
		{
			return this.groupBlocks;
		}
		return null;
	},
	getGroupIDList:function()
	{
		var _tempArr = [];
		for( var gId in this.groupList )
		{
			_tempArr = _tempArr.concat(this.groupList[gId].getGroupIDList());
		}
		return _tempArr;
	},
	getNextBlockId:function(id)
	{
		var pos = this.groupBlocks.indexOf(id);
		if(pos>-1 && 
				pos<(this.groupBlocks.length-1))
		{
			return {"gid":this.groupBlocks["id_"+this.groupBlocks[pos+1]],"id":this.groupBlocks[pos+1]};
		}
		return null;
	},
	//淘汰数据
	eliminate:function ()
	{
		if( this.config.BlockID < 0 )
		{
			return;
		}
		var _gId = "";
		if( this.config.streamSize >= this.config.MEMORY_SIZE+1024*1024 )
		{
			_gId = this.getEarlyGroupID();
			//首先存在旧gid时，先清理以前的
			if(_gId &&_gId != this.config.currentVid )
			{
				this.groupList[_gId].eliminate("left");
				return;
			}
			//其次清理本gid数据，左边开始
			this.groupList[this.config.currentVid ].eliminate("left");
			//最后右边开始清理
			if( this.config.streamSize >= this.config.MEMORY_SIZE )
			{
				this.groupList[this.config.currentVid ].eliminate("right");
			}
		}
	},
	getEarlyGroupID:function()
	{
		var _arr = [];
		for( var gId in this.groupList )
		{
			if(gId != this.config.currentVid)
			{
				_arr.push({"createTime":(this.groupList[gId]).createTime,"groupId":gId});
			}
		}
		if(_arr.length >= 1 )
		{
			_arr.sort(function(a,b){return a.createTime-b.createTime;});
			return _arr[0].groupId;
		}
		return null;
	},
	reset:function()
	{
		var _gid;
		for(_gid in this.groupList)
		{
			this.groupList[_gid].clear();
			this.groupList[_gid] = null;
			delete this.groupList[_gid];
		}
		this.groupList = {} ;
		this.pieceList = {};
		this.groupBlocks=[];
	}
});/**
 * 
 */
h5$.nameSpace("com.p2p.data");
h5$.com.p2p.data.Piece = h5$.createClass({
	/**外部设置
	 * parseUrl:null,
	 * blockList:null,
	 * statics:null*/
	/**每片piece在所属block的pieces数组中的索引*/
	id: 0,	
	/**每片piece保存在piece总表中的键值:pieceID*/
	pieceKey: "",
	/**该片数据是tn或pn数据*/
	type: "PN",
	/**该片数据所属的groupID*/
	groupID: "",
	/**数据流*/
	stream:null,
	//调度===================================
	/**数据来源:http或p2p，获得数据后赋值*/
	from: "",
	/**该piece的状态 ： 1为http调度紧急区设置； 2为p2p调度 ；3为已经有正确数据，默认是 2为p2p调度*/
	iLoadType: 0,
	
	/***/
	isChecked:false,
	checkSum: "",
	size: 0,
	blockId:-1,
	
	//p2p========================================
	/**每片数据peerID,其值是分配的临节点*/
	peerID: "",
	/**对方节点的名称*/
	//peerName:String		= "",
	//统计===========================================
	/**数据开始索取时的时间，获得数据前赋值*/
	begin: 0,
	/**获得数据时的时间，获得数据赋值*/
	end: 0,
	/**被分享的次数，分享时赋值，没分享一次累加一次*/
	share: 0,
	
	isLoad: false,
	
	/**数据来源的终端设备类型PC,TV,MP,BOX*/
	clientType: "PC",
	
	blockIDArray:[],
	/**checksum 失败或下载字节不对，该值累加*/
	errorCount: 0,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.isLoad = false;
		this.isChecked = false;
		this.clientType = "PC";
		this.begin = 0;
		this.end = 0;
		this.share = 0;
		this.blockIDArray = [];
		this.errorCount = 0;
		this.peerID = "";
		this.blockId ="";
		this.size = 0;
		this.id = 0;
		this.pieceKey = "";
		this.type ="PN";
		this.stream = null;
	},
	doCheckSum: function (byteArray)
	{
		if(byteArray.length == this.size)
		{
			
			var cksValue = this.checkSumBytes(byteArray);
			this.statics.chk0++;
			if( parseInt(this.checkSum) == cksValue )
			{
				return true;
			}
			else
			{
				if(this.from == "http")
				{
					this.errorCount++;
					if(this.errorCount>=10){
						this.errorCount=10;
					}
					this.statics.chk2++;
					this.statics.checkSumFailed("CDN CS Error-->id="+this.id+",key="+this.pieceKey+",bID="+this.blockId+",CS="+this.checkSum+",CV="+cksValue);
				}
				else
				{
					this.statics.chk5++;
					this.statics.checkSumFailed("P2P CS Error-->id="+this.id+",key="+this.pieceKey+",bID="+this.blockId+",CS="+this.checkSum+",CV="+cksValue);
				}
			}
		}
		else
		{
			if(this.from == "http")
			{
				this.errorCount++;
				if(this.errorCount>=10){
					this.errorCount=10;
				}
				this.statics.chk2++;
				this.statics.checkSumFailed("CDN SIZE Error "+this.id+",key="+this.pieceKey+",bID="+this.blockId+",s="+this.size+",l="+byteArray.length);
			}
			else
			{
				this.statics.chk5++;
				this.statics.checkSumFailed("P2P SIZE Error "+this.id+",key="+this.pieceKey+",bID="+this.blockId+",s="+this.size+",l="+byteArray.length);
			}
		}
		return false;			
	},
	checkSumBytes:function(input)
	{
		var _step = 47;
		var _pos = 0;
		var _sum = 0xffffffff;
		var _len = input.length;
		if( _len >= 188 )
		{
			_pos += 4;
			_len -= 4;
			while( _len > _step)
			{
				var value1 = input[_pos ++];
				var value2 = input[_pos ++];
				var value3 = input[_pos ++];
				var value4 = input[_pos ++];
				_sum ^= (value1 << 24) +(value2 << 16) +(value3 << 8) + value4;
				_pos += (_step-4);
				_len = input.length - _pos;
			}
		}
		_sum  = ((_sum >> 16) & 0xffff) + (_sum & 0xffff);
		return (~_sum & 0xffff);
	},
	
	setStream: function ( byteArray, remoteID, clientType )
	{
		remoteID = remoteID || '';
		clientType = clientType || "PC";
		if( !this.stream && 
			!this.isChecked && 
			this.doCheckSum(byteArray) )
		{			
			this.stream=byteArray;
			this.blockList.addSize(this.stream.length);
			if("TN" == this.type)
			{
				this.blockList.addTNRange(this.groupID,Number(this.pieceKey));
			}
			else if("PN" == this.type)
			{
				this.blockList.addPNRange(this.groupID,Number(this.pieceKey));	
			}
			/**当有数据要更改数据状态*/
			this.isChecked = true;
			this.iLoadType = 3;
			
			if(remoteID !== "" && this.peerID === "")
			{
				this.peerID = remoteID;
			}
			this.clientType = clientType;
			this.dispatcherReceiveStream();	
			this.statics.addSize({type:this.from,size:this.size});
			//更新ronge cdn下载信息
			var _info={};
			var _staticsInfo = {"p2p":this.statics.p2pSize,"cdn":this.statics.cdnSize,"share":this.statics.shareSize};
			_info.code = "Load.Range.isCheck";
			_info.info = {"from":remoteID,"blockid":this.blockId,"type":this.type,"key":this.pieceKey,statics:_staticsInfo};
			this.statics.sendToJs(_info);
			//数据淘汰处理
			this.blockList.gEliminate();
			return true;
		}
		if(this.isChecked)
		{
			this.reset();
		}
		return false;
	},
	
	getStream:function()
	{
		return this.stream;
	},
	dispatcherReceiveStream: function ()
	{
		var tempStr = "";
		if(this.type == "TN")
		{
			tempStr = "TN_";
		}
		
		if( this.from == "http" )
		{
			this.statics.httpGetData(tempStr+"_"+this.pieceKey,this.begin,this.end,this.size,this.groupID);
		}
		else
		{
			this.statics.P2PGetData(tempStr+"_"+this.pieceKey,this.begin,this.end,this.size,this.peerID,this.groupID,this.clientType);
		}
	},
	getter_pieceInfo:function()
	{
		return {type:this.type,groupID:this.groupID,blockID:this.blockId,key:this.pieceKey};
	},

	reset:function ()
	{
		this.begin = 0;
		this.end = 0;
		this.iLoadType = 0;
		this.peerID = "";
		this.from = "";
		this.size = 0;
		this.isChecked = false;
		
		if(this.stream&&this.stream.length>0)
		{
			if("TN" == this.type)
			{
				this.blockList.deleteTNRange(this.groupID,Number(this.pieceKey));	
			}
			else if("PN" == this.type)
			{
				this.blockList.deletePNRange( this.groupID, Number(this.pieceKey) );	
			}
			
			this.blockList.reduceSize(this.stream.length);
		}
		this.stream = null;
	},
	clear:function()
	{
		this.begin    = 0;
		this.end      = 0;
		this.iLoadTyp = 0;
		this.peerID   = "";
		this.from     = "";
		
		this.isChecked = false;
		if(this.stream&&this.stream.length>0)
		{
			this.blockList.reduceSize(this.size);
		}
		if( this.size >= 0 /*&& this.isChecked*/)
		{
			if("TN" == this.type)
			{
				this.blockList.deleteTNRange(this.groupID,Number(this.pieceKey));	
			}
			else if("PN" == this.type)
			{
				this.blockList.deletePNRange(this.groupID,Number(this.pieceKey));	
			}
		}
		this.stream    = null;
		this.id		   = 0;	
		this.pieceKey  = "";
		this.type	   = "PN";
		this.groupID   = "";
		this.size	   = 0;
		this.config    = null;
		this.initData  = null;
		this.statics   = null;
		this.blockList = null;
		this.checkSum	= "";
	}
});
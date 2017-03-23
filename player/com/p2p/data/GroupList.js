/**
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
});
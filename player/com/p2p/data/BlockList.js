/**
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
});
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
});
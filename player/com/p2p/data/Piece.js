/**
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
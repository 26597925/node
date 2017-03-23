/**
 * 信令
 */
h5$.nameSpace("com.p2p.loaders.p2ploader");
h5$.com.p2p.loaders.p2ploader.Signalling = h5$.createClass({
	/**
	 * p2pLoader
	 * dataManager
	 * config
	 * groupID
	 * dataConvert
	 * statics
	 * peer
	 * remoteID
	 * */
	sendrangNum:0,
	reqrangNum:0,
	requestArr:[],
	readySendDataList:[],
	remoteTNList:[],
	remotePNList:[],
	starttime:0,//开始时间
	
	
	/**
	 * 统计数据*/
	speed:0,//传输速度
	errck:0,//错误
	ck:0,//校验
	downSize:0,//下载大小
	downNum:0,//下载piece数
	shareSize:0,//分享大小
	shareNum:0,//分享piece数
	dl:0,
	req:0,
	res:0,
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	init:function()
	{
		this.sendrangeNum = 0;
		this.reqrangeNum = 0;
		this.requestArr = [];
		this.readySendDataList = [];
		this.remoteTNList = [];
		this.remotePNList = [];
	},
	
	//获得发送的数据
	getSendData:function()
	{
		this.sendrangNum++;
		var _sendDataSct = [
			{"sequence_4":0},//0
			{"datalen_4":0},//1
			{"rangeCount_4":0},//2
			{"rangeItems":[
				[{"type_2":123},{"start_8":234},{"end_4":345}]
			]},//3
			{"requestCount_4":0},//4
			{"requestItems":[
				[{"type_2":0},{"start_8":1411033199},{"cks_4":57473}]
			]},//5
			{"responseCount_4":0},//6
			{"responseItems":[
				[{"type_2":0},{"start_8":1411033199},{"streamLength_4":57473},{"stream_d":null}]
			]},//7
			{"peerCount_4":1},//连接节点数//8
			{"peerItems":[
				[{"head_4":0},{"URL_utf":"ws://202.103.4.52:34567/*****"}]
			]}//9
		];
		//3
		var _rangeItems=[];
		var _i;
		var _tempList;
		var _start;
		var _end;
		_tempList = this.dataManager.getTNRange(this.groupID);
		if(_tempList !== null)
		{
			for(_i=0;_i<_tempList.length;_i++)
			{
				_start=_tempList[_i].start;
				_end =_tempList[_i].end;
				_rangeItems.push([{"type_2":0},{"start_8":_start},{"end_4":(_end-_start+1)}]);
			}
		}
		_tempList	= this.dataManager.getPNRange(this.groupID);
		if(_tempList !== null)
		{
			for(_i=0;_i<_tempList.length;_i++)
			{
				_start=_tempList[_i].start;
				_end =_tempList[_i].end;
				_rangeItems.push([{"type_2":1},{"start_8":_start},{"end_4":(_end-_start+1)}]);
			}
		}
		_sendDataSct[3].rangeItems=_rangeItems;
			
		var _requestItems = [];
		var _type = 0;
		if(this.requestArr.length === 0)
		{
			var _piece = this.getTask(this.remoteTNList,this.remotePNList);
			
			if(_piece)
			{
				this.requestArr.push(_piece);
				if(_piece.type == "PN")
				{
					_type = 1;
				}
				this.starttime = this.config.localTime;
				_requestItems.push([{"type_2":_type},{"start_8":_piece.pieceKey},{"cks_4":_piece.checkSum}]);
			}
		}
		_sendDataSct[5].requestItems=_requestItems;
		
		//7
		var _responseItems=[];
		_type=0;
		if( this.readySendDataList && this.readySendDataList.length > 0 )
		{
			for( _i=0; _i < this.readySendDataList.length; _i++ )
			{
				if( this.readySendDataList[_i].type == "PN" )
				{
					_type = 1;
				}
				_responseItems.push([{"type_2":_type},{"start_8":this.readySendDataList[_i].key},{"streamLength_4":this.readySendDataList[_i].data.length},{"stream_d":this.readySendDataList[_i].data}]);
			}
			this.readySendDataList 	= null;//new Array();
		}
		_sendDataSct[7].responseItems=_responseItems;
		
		//9
		var _peerItems=[];
		_tempList = this.p2pLoader.getSuccessPeerList(this.remoteID);
		for(_i=0;_i<_tempList.length;_i++)
		{
			_peerItems.push([{"head_4":_i},{"URL_utf":_tempList[_i]}]);
		}
		_sendDataSct[9].peerItems=_peerItems;
	
		_sendDataSct[2].rangeCount_4 = _sendDataSct[3].rangeItems.length;
		_sendDataSct[4].requestCount_4 = _sendDataSct[5].requestItems.length;
		_sendDataSct[6].responseCount_4 = _sendDataSct[7].responseItems.length;
		
		for( _i = 0; _i < _sendDataSct[7].responseItems.length;_i++ )
		{
			_sendDataSct[7].responseItems[_i][2].streamLength_4 = _sendDataSct[7].responseItems[_i][3].stream_d.length;
		}
		
		_sendDataSct[8].peerCount_4 = _sendDataSct[9].peerItems.length;
		
		for(_i = 0; _i < _sendDataSct[9].peerItems.length;_i++ )
		{
			_sendDataSct[9].peerItems[_i][0].head_4 = _sendDataSct[9].peerItems[_i][1].URL_utf.length;
		}
		///结算分享数据信息
		for(_i=0;_i<_sendDataSct[7].responseItems.length;_i++)
		{
			this.shareNum++;
			this.shareSize+=Number(_sendDataSct[7].responseItems[_i][2].streamLength_4);
		}
		
		this.sendInfo(_sendDataSct);	
		
		var _arr = [];
		if(this.type == "WS")
		{
			_sendDataSct.splice(1,1);
		}
		this.dataConvert.processObj(_sendDataSct,_arr);
		var _size = 0;
		
		for(_i=0;_i<_arr.length; _i++)
		{
			_size += _arr[_i].length;
		}
		var _sendData = new Uint8Array(_size);
		var _count=0;
		for(_i=0;_i<_arr.length; _i++)
		{
			for(var _j=0;_j<_arr[_i].length;_j++)
			{
				_sendData[_count++] = _arr[_i][_j];
			}
		}
		//重写数据前8位为数据长度
		if(this.type == "RTC")
		{
			var _sdatalen=_sendData.length;
			_sendData[4] = (parseInt(_sdatalen) >> 24) & 0xff;
			_sendData[5] = (parseInt(_sdatalen) >> 16) & 0xff;
			_sendData[6] = (parseInt(_sdatalen) >> 8) & 0xff;
			_sendData[7] = parseInt(_sdatalen) & 0xff;
		}
		this.req++;
		this.dl++;
		return _sendData;
	},
	//处理接受的数据
	processData:function (value)
	{
//		console.log("##res:",this.res);
		var _position = 0;
		var _sequnce = this.dataConvert.convertToValue('4',value,_position);
		var _time;
		var _type;
		var _info;
		var _i;
		this.res++;
		this.dl--;
		_position += 4;
		if(this.type == "RTC")
		{
//			console.log("rtc,跳过4个字节");
			_position += 4;//跳过4个字节，这4个字节是说明数据长度的
		}
		var _rangeCount = this.dataConvert.convertToValue('4',value,_position);
		_position += 4;

		if(_rangeCount !== 0)
		{
			this.remoteTNList = [];
			this.remotePNList = [];
			for( _i = 0; _i < _rangeCount;_i++)
			{
				_type = this.dataConvert.convertToValue('2',value,_position);
				_position += 2;
				var _start = this.dataConvert.convertToValue('8',value,_position);
				_position += 8;
				var _end = this.dataConvert.convertToValue('4',value,_position);
				_position += 4;
				if(0 === _type)
				{
					this.remoteTNList.push({"start":_start,"end":(_start+_end-1)});
				}
				else
				{
					this.remotePNList.push({"start":_start,"end":(_start+_end-1)});
				}
			}
			//输出 range信息
			_info={};
			_info.code="P2P.Range.Info";
			_info.info={"TN":this.remoteTNList,"PN":this.remotePNList};
			this.statics.sendToJs(_info);
		}
		
		var _reqCount = this.dataConvert.convertToValue('4',value,_position);
		_position += 4;
		var _sendArr = [];
		for( _i = 0; _i < _reqCount;_i++)
		{
			_type = this.dataConvert.convertToValue('2',value,_position);
			_position += 2;
			var _pid = this.dataConvert.convertToValue('8',value,_position);
			_position += 8;
			var _sck = this.dataConvert.convertToValue('4',value,_position);
			_position += 4;
			if(_type === 0)
			{
				_sendArr.push({"type":"TN","groupId":this.groupID,"key":_pid,'checksum':_sck});
			}
			else
			{
				_sendArr.push({"type":"PN","groupId":this.groupID,"key":_pid,'checksum':_sck});
			}
		}
		if(_sendArr.length>0)
		{
			this.readySendDataList = this.getData(_sendArr);
		}
		var _respCount = this.dataConvert.convertToValue('4',value,_position);

		_position += 4;
		var _len =1;// (requestArr?requestArr.length:1);
		for( _i = 0; _i < _respCount&&_i<_len;_i++)
		{
			_time = this.config.localTime - this.starttime;
			_type = this.dataConvert.convertToValue('2',value,_position);
			_position += 2;
			var _pid2 = this.dataConvert.convertToValue('8',value,_position);
			_position += 8;
			var _DataL = this.dataConvert.convertToValue('4',value,_position);
			_position += 4;

			var _stream = this.dataConvert.convertToValue('d',value,_position,_DataL);
			_position += _DataL;
			this.dealRemoteData({'pieceID':_pid2,'data':_stream});
			this.downNum++;
			this.downSize+=_stream.length;
			this.speed = Math.round(_stream.length*8/_time/10)/100;
			_info = {};
			_info.code = "P2P.Info.Debug";
			_info.info="p2p:["+this.remoteID+"] "+_type+"_"+_pid2;
			this.statics.sendToJs(_info);
		}
		
		var _peerCount = this.dataConvert.convertToValue('4',value,_position);//sequnce
		_position += 4;
		for(_i = 0; _i < _peerCount;_i++)
		{
			var _peerheadL = this.dataConvert.convertToValue('4',value,_position);//sequnce
			_position += 4;
			var _url = this.dataConvert.convertToValue('utf',value,_position,_peerheadL);
			_position += _peerheadL;
	
		}
		//接受完数据
		if(_rangeCount>0)
		{
			this.reqrangNum++;
			//防止发送太快，设置间隔
			this.peer.sendMessage();
		}
	},
	getTask: function(TNarr,PNarr)
	{
		if(!TNarr && !PNarr )
		{
			return null;
		}
		var obj = {};
		obj.groupID		= this.groupID;
		obj.PNrange		= PNarr;
		obj.TNrange		= TNarr;
		obj.remoteID	= this.remoteID;
		
		var callBackObj = this.dataManager.getP2PTask(obj);
		
		obj = null;
		return callBackObj;
	},
	getData:function(arr)
	{
		var _tmpArray = [];
		if(!arr) return _tmpArray;
		
		var _tmpPiece;
		var _readySendData;
		
		for(var i=0;i<arr.length;i++)
		{
			if(arr[i])
			{
				var _type = arr[i].type;
				var _key = arr[i].key;
				if(_type && _key)
				{
					_tmpPiece = this.dataManager.getPiece(
						{
							"groupID":this.groupID,
							"type":arr[i].type,
							"pieceKey":arr[i].key
						}
					);
					if(!_tmpPiece || !_tmpPiece.isChecked) continue;
					
					if(_type == "TN" && _tmpPiece.checkSum != arr[i].checksum) continue;
					
					_readySendData = 
						{
							"type":_tmpPiece.type,
							"key":_tmpPiece.pieceKey,
							"data":_tmpPiece.getStream()
						};
					
					_tmpArray.push(_readySendData);
					if(_tmpArray.length>0)
					{
						break;
					}
				}
			}
		}
		_tmpPiece = null;
		return _tmpArray;
	},
	
	dealRemoteData:function(obj)
	{
		var _tmpPiece;
		if(this.requestArr.length === 0) return;
		
		if(obj.pieceID && (this.requestArr[0]).pieceKey == obj.pieceID )
		{
			_tmpPiece = this.dataManager.getPiece(
				{
					"groupID":this.groupID,
					"type":(this.requestArr[0]).type,
					"pieceKey":(this.requestArr[0]).pieceKey
				}
			);
			
			if(_tmpPiece)
			{
				if(!_tmpPiece.isChecked )
				{
					this.isReceivedData = true;
					_tmpPiece.protocol = "ws";
					this.ck++;
					_tmpPiece.setStream((obj.data),this.remoteID,this.remoteClientType);
					if(!_tmpPiece.isChecked)
					{
						this.errck++;
					}
				}
				else
				{
					this.statics.P2PRepeatLoad(_tmpPiece.pieceKey,_tmpPiece.from);
				}
				var _idx = this.requestArr.indexOf(_tmpPiece);
				if ( -1 != _idx)
				{
					this.requestArr.splice(_idx, 1);
				}
			}
		}
		_tmpPiece = null;
	},
	sendInfo:function(data)
	{
		var _requestArr = data[5].requestItems;
		var _responseArr = data[7].responseItems;
		var _tempPiece;
		var _type;
		var _key;
		var _info;
		var _i;

		for(_i=0 ; _i<_requestArr.length; _i++)
		{	
			//输出 range信息
			_info={};
			_info.code = "P2P.Info.Debug";
			_info.info = "I want ["+_requestArr[_i][0].type_2+"],id:"+this.remoteID+","+_requestArr[_i][1].start_8;
			this.statics.sendToJs(_info);
			
			_info={};
			_info.code = "Load.Range.isCheck";
			_info.info = {"from":this.remoteID,"type":_requestArr[_i][0].type_2,"key":_requestArr[_i][1].start_8,status:"loading"};
			this.statics.sendToJs(_info);
		}
		for(_i=0 ; _i<_responseArr.length ; _i++)
		{
			_type = "TN";
			if(_responseArr[_i][0].type_2 == 1) _type = "PN";
			
			_tempPiece = this.dataManager.getPiece({"groupID":this.groupID,"pieceKey":_responseArr[_i][1].start_8,"type":_type});
			_tempPiece.share++;
			this.statics.addSize({type:"share",size:_responseArr[_i][2].streamLength_4});
			//输出 range信息
			_info={};
			_info.code="P2P.Info.Debug";
			_info.info={p2p:this.statics.p2pSize,cdn:this.statics.cdnSize,share:this.statics.shareSize,message:"share:["+this.remoteID+"] "+_type+"_"+_responseArr[_i][1].start_8};
			this.statics.sendToJs(_info);
		}			
	},
	clear:function()
	{
		this.sendrangNum = 0;
		this.reqrangNum = 0;
		this.requestArr = [];
		this.readySendDataList = [];
		this.remoteTNList = [];
		this.remotePNList = [];
	},
});
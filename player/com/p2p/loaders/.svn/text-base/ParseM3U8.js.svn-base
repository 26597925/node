/**
 * 解析m3u8文件
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.ParseM3U8 = h5$.createClass({
	param:{
		fileTotalSize:0,
		groupID:"",
		width:0,
		height:0,
		totalDuration:0,
		mediaDuration:0
	},
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	
	GetNameKey:function ( p_strUrl )
	{
		var _tmpStrNameKey = "";
		_tmpStrNameKey = this.parseUrl.parseUrlToObj(p_strUrl).path;//objUrl.path;//
		if( null === _tmpStrNameKey )
		{
			return p_strUrl;
		}
		var _nPos = _tmpStrNameKey.lastIndexOf("/");
		_tmpStrNameKey = _tmpStrNameKey.substr(_nPos+1,_tmpStrNameKey.length);
		return _tmpStrNameKey;
	},
	
	getValue:function ( str1, str2 )
	{
		var value = "";
		if( str1.indexOf( str2 ) === 0 )
		{
			value=str1.replace(str2,"");
		}	
		return value;
	},
	parseFile:function(file,callback,scope)
	{
		file = file.replace(/\r/g,"");
		var reg = /(\.ts\S{0,})\n/ig;
		file = file.replace(reg,"$1\n~_~");
		var _tsList = file.split("~_~");
		var i = 0;
		var j = 0;
		var _clip = null;
		var _tmpFileItem = null;
		var _clipList = [];
		
		for(i=0;i<_tsList.length;i++)
		{
			var _lines = _tsList[i].split("\n");
			_clip = new h5$.com.p2p.data.Clip();
			_clip.pieceInfoArray = [];
			if(0 !== i)
			{
				for(j=0;j<_lines.length;j++)
				{
					if(_lines[j].length <= 0) continue;
					_tmpFileItem = this.parseData(_lines[j]);
					if(_tmpFileItem && _tmpFileItem.hasOwnProperty("key"))
					{
						if(_tmpFileItem.key !== "")
						{
							if( _tmpFileItem.key == "pieceInfoArray" )
							{
								_clip.pieceInfoArray.push(_tmpFileItem.value);
								continue;
							}
							_clip[_tmpFileItem.key]=_tmpFileItem.value;
							if( _tmpFileItem.key == "timestamp" )
							{
								if( this.hasOwnProperty("DESC_LASTSTARTTIME") )
								{
									this.DESC_LASTSTARTTIME = _tmpFileItem.value;
								}
							}
							else if( _tmpFileItem.key == "url_ts" )
							{
								_clip.name = this.GetNameKey( _tmpFileItem.value );
							}
						}
						continue;
					}
					
					_tmpFileItem = this.parseProgram(_lines[j]);
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( this.config.TYPE == this.config.VOD && this.param.hasOwnProperty(_tmpFileItem.key) )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}
							else if( this.config.TYPE == this.config.LIVE && 
								this.param.hasOwnProperty(_tmpFileItem.key) &&
								_tmpFileItem.key !== "totalDuration" )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}	
						}
						continue;
					}
				}
			}
			else if( 0 === i )
			{
				for( j=0; j<_lines.length; j++ )
				{
					if( _lines[j].length <= 0 )
					{
						continue;
					}
					_tmpFileItem = this.parseFileHead(_lines[j]);
					
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( _tmpFileItem.key == "EXT_LETV_M3U8_VER" )
							{
								EXT_LETV_M3U8_VER = _tmpFileItem.value;
							}
						}
						continue;
					}
					
					_tmpFileItem = this.parseProgram(_lines[j]);
					
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( this.config.TYPE == this.config.VOD && this.param.hasOwnProperty(_tmpFileItem.key) )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}
							else if( this.config.TYPE == this.config.LIVE &&
								this.param.hasOwnProperty(_tmpFileItem.key) && 
								_tmpFileItem.key !== "totalDuration" )
							{
								this.param[_tmpFileItem.key]=_tmpFileItem.value;
							}
						}
						continue;
					}
					
					_tmpFileItem = this.parseData(_lines[j]);
					
					if( _tmpFileItem && _tmpFileItem.hasOwnProperty("key") )
					{
						if( _tmpFileItem.key !== "" )
						{
							if( _tmpFileItem.key == "pieceInfoArray" )
							{
								_clip.pieceInfoArray.push(_tmpFileItem.value);
								
								continue;
							}
							_clip[_tmpFileItem.key]=_tmpFileItem.value;

							if( _tmpFileItem.key == "timestamp" )
							{
								if( this.hasOwnProperty("DESC_LASTSTARTTIME") )
								{
									this.DESC_LASTSTARTTIME = _tmpFileItem.value;
								}
							}
							else if( _tmpFileItem.key == "url_ts" )
							{
								_clip.name = this.GetNameKey( _tmpFileItem.value );
							}
						}
						continue;
					}
				}
			}
			_clip.groupID =  this.param.groupID + EXT_LETV_M3U8_VER + this.config.P2P_AGREEMENT_VERSION;
			if(this.config.currentVid === null)
			{
				if(this.param.groupID !== "")
				{
					this.config.currentVid = _clip.groupID;
				}
				else if(this.config.TYPE==this.config.LIVE)
				{
					this.config.currentVid = "noContinute";
				}
				else
				{
					this.config.currentVid = "noContinute";
				}
			}
			_clip.width   = this.param.width;
			_clip.height  = this.param.height;
			_clip.totalDuration = this.param.totalDuration;
			_clip.mediaDuration = this.param.mediaDuration;
			
			if( _clip.name && "" !== _clip.name )
			{
				_clipList.push(_clip);
			}
		}
//		console.log("currentVid="+this.config.currentVid,",",this.param.groupID);
		this.initData.duration = this.param.totalDuration;
		this.initData.mediaDuration = this.param.mediaDuration;
		this.initData.totalSize		= this.param.fileTotalSize;
			
		if(_clipList.length>0)
		{
			this.config.M3U8_MAXTIME = _clipList[_clipList.length-1].timestamp;	
		}
		
		var kbps = 800;
		if( this.config.TYPE !=  this.config.LIVE )
		{
			kbps = Math.round( (this.param.fileTotalSize*8/this.totalDuration)/1024 );
		}
		
		callback.call(scope,_clipList, kbps );
	},
	parseData:function( str )
	{
		var obj = {};
		var value = "";
	
		var switchStr = str;
		
		if( switchStr.indexOf("#") != -1 )
		{
			var nIdx = switchStr.indexOf(":");
			if( -1 != nIdx )
			{
				switchStr = switchStr.substr(0,nIdx+1);
			}
			
			switch(switchStr)
			{
				case "#EXT-X-DISCONTINUITY":
					obj.key = "discontinuity";
					obj.value = 1;
					return obj;
				case "#EXT-LETV-START-TIME:":
					value = this.getValue( str, "#EXT-LETV-START-TIME:" );
					if( value !== "" )
					{
						obj.key="timestamp";
						obj.value=parseFloat(value);
						return obj;
					}
					break;
				case "#EXT-LETV-P2P-PIECE-NUMBER:":
					value = this.getValue( str, "#EXT-LETV-P2P-PIECE-NUMBER:" );
					if( value !== "" )
					{
						obj.key="p2pPieceNumber";
						obj.value=value;
						return obj;
					}
					break;
				case "#EXT-LETV-SEGMENT-ID:":
					value = this.getValue( str, "#EXT-LETV-SEGMENT-ID:" );
					if( value !== "" )
					{
						obj.key = "sequence";
						obj.value = parseInt( value , 10 );
						return obj;
					}
					break;
				case "#EXT-LETV-CKS:":
					value = this.getValue( str, "#EXT-LETV-CKS:" );
					if( value !== "" )
					{
						obj.key = "pieceInfoArray";
						obj.value = value;
						obj.size = parseFloat(this.parseUrl.getParam(obj.value,"SZ")); 
						this.param.fileTotalSize += obj.size;
						return obj;
					}
					break;
				case "#EXTINF:":
					value = this.getValue( str, "#EXTINF:" );
					if( value !== "" )
					{
						obj.key = "duration";
						obj.value = parseFloat(value);
						return obj;
					}
					break;	
			}	
		}
		else if( switchStr.length > 0 )
		{
			obj.key = "url_ts";
			obj.value = switchStr;
			return obj;
		}

		return null;
	},
	
	parseProgram:function( str )
	{
		var obj = {};
		var value = "";
		
		var switchStr = str;
		var nIdx = switchStr.indexOf(":");
		if( -1 != nIdx )
		{
			switchStr = switchStr.substr(0,nIdx+1);
		}
		
		switch(switchStr)
		{
			case "#EXT-LETV-X-DISCONTINUITY:":
				obj.key = "";
				break;
			case "#EXT-LETV-PROGRAM-ID:":
				value=this.getValue( str, "#EXT-LETV-PROGRAM-ID:" );
				if( value !== "" )
				{
					obj.key="groupID";
					obj.value=value;					
					return obj;
				}
				break;
			case "#EXT-LETV-PIC-WIDTH:":
				value = this.getValue( str, "#EXT-LETV-PIC-WIDTH:" );
				if( value !== "" )
				{
					obj.key = "width";
					obj.value = value;
					return obj;
				}
				break;
			case "#EXT-LETV-PIC-HEIGHT:":
				value = this.getValue( str, "#EXT-LETV-PIC-HEIGHT:" );
				if( value !== "" )
				{
					obj.key = "height";
					obj.value = value;
					return obj;
				}
				break;
			case "#EXT-LETV-TOTAL-TS-LENGTH:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-ES-LENGTH:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-SEGMENT:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-P2P-PIECE:":
				obj.key = "";
				break;
			case "#EXT-LETV-TOTAL-DURATION:":
				value = this.getValue( str, "#EXT-LETV-TOTAL-DURATION:" );
				if(value !== "")
				{
					obj.key = "totalDuration";
					obj.value = value;
					return obj;
				}
				break;
			case "#EXT-LETV-TOTAL-MEDIADURATION:":
				value = this.getValue( str, "#EXT-LETV-TOTAL-MEDIADURATION:" );
				if( value !== "" )
				{
					obj.key = "mediaDuration";
					obj.value = value;
					return obj;
				}
				break;
		}
		return obj;
	},
	
	parseFileHead:function ( str )
	{
		var obj = {};
		var value = "";
		
		var switchStr = str;
		var nIdx = switchStr.indexOf(":");
		switchStr = switchStr.substr(0,nIdx+1);
		
		switch(switchStr)
		{
			case "#EXTM3U":
				obj.key = "";
				break;
			case "#EXT-X-VERSION:":

				obj.key = "";
				break;
			case "#EXT-X-MEDIA-SEQUENCE:":
				obj.key = "";
				break;
			case "#EXT-X-ALLOW-CACHE:":
				obj.key = "";
				break;
			case "#EXT-X-TARGETDURATION:":
				obj.key = "";
				break;
			case "#EXT-LETV-M3U8-TYPE:":
				value = this.getValue(str,"#EXT-LETV-M3U8-TYPE:");
				if( value !== "" )
				{
					obj.key = "str_EXT_LETV_M3U8_TYPE";
					obj.value=value;
					return obj;
				}
				break;
			case "#EXT-LETV-M3U8-VER:":
				value = this.getValue(str,"#EXT-LETV-M3U8-VER:");
				if( value !== "" )
				{
					obj.key="EXT_LETV_M3U8_VER";
					obj.value=value;
					return obj;
				}
				break;
		}
		return obj;
	
	},
});
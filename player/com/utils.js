var h5$ = {
		nameSpace:function(value)
		{
			var names = String(value).split('.');
			var objs = this;
			for(var i = 0; i<names.length; i++)
			{
				var subName = names[i];
				var subType = typeof(objs[subName]);
				if(subType != 'object' && subType != 'undefined')
				{
					throw('Invalid namespace '+value+',subName='+subName);
				}
				objs = objs[subName] = objs[subName] || {};
			}
		},
		//把对象生成Class
		createClass:function(value)
		{
			var cls = function()
			{
				if(typeof(this.__ctor) == 'function')
				{
					this.__ctor.apply(this,arguments);
				}
			};
			cls.prototype = cls.prototype || {};
			var type = 0;
			var fname;
			var get_set_obj = {};
			for(var name in value)
			{
				if(name.indexOf('getter_') === 0)
				{
					fname = name.split('_')[1];
					type = 1;
				}
				else if(name.indexOf('setter_') === 0)
				{
					fname = name.split('_')[1];
					type = 2;
				}
				else
				{
					type = 0;
				}
				switch(type)
				{
					case 0:
						cls.prototype[name] = value[name];
						break;
					case 1:
						get_set_obj[fname] = get_set_obj[fname] || {};
						get_set_obj[fname].get = value[name];
						break;
					case 2:
						get_set_obj[fname] = get_set_obj[fname] || {};
						get_set_obj[fname].set = value[name];
						break;
				}
			}
			//设置属性的方法
			for(var i in get_set_obj)
			{
				Object.defineProperty(cls.prototype,i,{
					get:get_set_obj[i].get,
					set:get_set_obj[i].set,
				});
			}
			return cls;
		},
		apply:function(scope,source)
		{
			for(var name in source)
			{
				scope[name] = source[name];
			}
			return scope;
		},
		lzwEncode : function(s)
		{
			var dict = {};
			var data = (s + "").split("");
			var out = [];
			var currChar = 0;
			var phrase = data[0];
			var code = 256;
			var i;
			for (i = 1; i < data.length; i++)
			{
				currChar = data[i];
				if (dict[phrase + currChar])
				{
					phrase += currChar;
				}
				else
				{
					out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
					dict[phrase + currChar] = code;
					code++;
					phrase = currChar;
				}
			}
			out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
			for (i = 0; i < out.length; i++)
			{
				out[i] = String.fromCharCode(out[i]);
			}
			return out.join("");
		},

		// Decompress an LZW-encoded string
		lzwDecode : function(s)
		{
			var dict = {};
			var data = (s + "").split("");
			var currChar = data[0];
			var oldPhrase = currChar;
			var out = [ currChar ];
			var code = 256;
			var phrase;
			var i;
			for (i = 1; i < data.length; i++)
			{
				var currCode = data[i].charCodeAt(0);
				if (currCode < 256)
				{
					phrase = data[i];
				}
				else
				{
					phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
				}
				out.push(phrase);
				currChar = phrase.charAt(0);
				dict[code] = oldPhrase + currChar;
				code++;
				oldPhrase = phrase;
			}
			return out.join("");
		}
};/**
 * 
 */
h5$.nameSpace('com.utils');
h5$.com.utils.BrowserUtils = {
		//浏览器支持视频格式
		//判断midiaSource扩展是否可用
		get SupportInfo()
		{
			var info = {encode:false,support:false};
			var mediaType=this.MediaType;
			if(mediaType.mediasource)//支持mediaSource
			{
				if(mediaType.ts||mediaType.mp4)
				{
					info.support = true;
				}
				if(!mediaType.ts)
				{
					info.encode = true;
				}
			}
			return info;
		},
		get MediaType()
		{
			var mediaType={mediasource:false,webm:false,mp4:false,ts:false,m3u8:false};
			var _b_info =  this.BrowserInfo.agent;
			var _pattern = /AppleWebKit\/(\d+)/i; 
			var _arr = _b_info.match(_pattern);
			var _version = 0;
			if(_arr&&_arr.length>1)
			{
				_version = Number(_arr[1]);
			}
			console.log("version:",_version);
			if(_version>=600)
			{	
				mediaType.m3u8 = true;
			}
			window.MediaSource = window.MediaSource || window.WebKitMediaSource;
			if(!!!window.MediaSource){
				
			}
			else
			{
				mediaType.mediasource = true;
				mediaType.webm = MediaSource.isTypeSupported('video/webm; codecs="vorbis,vp8"');
				mediaType.mp4 = MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
				mediaType.ts = MediaSource.isTypeSupported('video/mp2t; codecs="avc1.42E01E,mp4a.40.2"');
			}
			return mediaType;
		},
		//获得浏览器版本类型
		get BrowserInfo()
		{
			var browserInfo = {};
			browserInfo.name=navigator.appName;
			browserInfo.version=parseFloat(navigator.appVersion);
			browserInfo.agent=navigator.userAgent;
			return browserInfo;
		}
};/**
 * 调度地址解析，参数替换，添加，删除等
 */
h5$.nameSpace("com.utils");
h5$.com.utils.ParseUrl = {
		parseUrlToObj:function(url)
		{
			var _pattern = /^([\w\-]+:\/\/)?([^\/?#]*)?(\/[^?#]*)?(\?[^#]*)?(\#.*)?/i;		
			if(url === null) return null;
			var result = url.match(_pattern);
			if ( result !== null )
			{
				//去掉后缀名
				var objUrl = {};
				objUrl.protocol = result[1];
				objUrl.hostName = result[2];
				objUrl.path = result[3];
				objUrl.query = result[4];
				objUrl.fragment = result[5];
				
				return objUrl;
			}
			return null;
		},
		getParam:function(url,key)
		{
			var _reg = new RegExp("[?&]?"+key+"=([^&]{0,})");
			var _param = "";
			if(_reg.test(url))
			{
				_param = url.match(_reg)[1];
			}
			return _param;
		},
		replaceParam:function(url,key,value)
		{
			var _reg = new RegExp("[?&]+"+key+"=([^&]{0,})?");
			var _findstr = '';
			if(_reg.test(url))
			{
				_findstr = url.match(_reg)[0];
			}
			if(url.indexOf("?") == -1)
			{
				url = url + ("?"+key+"="+value);
			}
			else if(_findstr.length>0)
			{
				url = url.replace(_findstr,_findstr.charAt(0)+key+"="+value);
			}
			else
			{
				url = url + "&"+key+"="+value;
			}
			return url;
		}
};/**
 * 播放过程中得一些状态
 */
h5$.nameSpace('com.utils');
h5$.com.utils.PlayStates = {
	status:	'IDE',
	IDE:'IDE',
	PLAY:'PLAY',
	PLAYING:'PLAYING',
	PAUSE:'PAUSE',
	RESUME:'RESUME',
	SEEKING:'SEEKING',
	SEEKED:'SEEKED',
	///video 事件
	VideoEvent:[
	            "abort",//	当音频/视频的加载已放弃时
	            "canplay",//	当浏览器可以播放音频/视频时
	            "canplaythrough",//	当浏览器可在不因缓冲而停顿的情况下进行播放时
	            "durationchange",//	当音频/视频的时长已更改时
	            "emptied",//	当目前的播放列表为空时
	            "empty",
	            "ended",//	当目前的播放列表已结束时
	            "error",//	当在音频/视频加载期间发生错误时
	            "loadeddata",//	当浏览器已加载音频/视频的当前帧时
	            "loadedmetadata",//	当浏览器已加载音频/视频的元数据时
	            "loadstart",//	当浏览器开始查找音频/视频时
	            "pause",//	当音频/视频已暂停时
	            "play",//	当音频/视频已开始或不再暂停时
	            "playing",//	当音频/视频在已因缓冲而暂停或停止后已就绪时
	            "progress",//	当浏览器正在下载音频/视频时
	            "ratechange",//	当音频/视频的播放速度已更改时
	            "seeked",//	当用户已移动/跳跃到音频/视频中的新位置时
	            "seeking",//	当用户开始移动/跳跃到音频/视频中的新位置时
	            "stalled",//	当浏览器尝试获取媒体数据，但数据不可用时
	            "suspend",//	当浏览器刻意不获取媒体数据时
	            "timeupdate",//当目前的播放位置已更改时
	            "volumechange",//	当音量已更改时
	            "waiting"
	            ]
};window.JSON = window.JSON || {};
window.URL = (window.URL || window.webkitURL || window.msURL || window.oURL);
window.RTCPeerConnection = (window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection);
window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);
window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription); // order is very important: "RTCSessionDescription" defined in Nighly but useless
window.ByteArray = function($_uInt8Array)
{

	this.length			= 0;
	this._position		= 0;
	this.uInt8Array	= new Uint8Array();
	if($_uInt8Array ){
		this.uInt8Array	= new Uint8Array($_uInt8Array);
	}
	this.writeBytes = function(bytes)
	{
			var tempByteArray = null;
			if(this.uInt8Array)
			{
				tempByteArray = new Uint8Array(this.uInt8Array.length+bytes.length);
				tempByteArray.set(this.uInt8Array,0);
				tempByteArray.set(bytes,this.uInt8Array.length);
			}else
			{
				tempByteArray = bytes;
			}
			this.uInt8Array = tempByteArray;
	};
	this.setBytes = function(int8)
	{
		this.position = 0;
		this.uInt8Array = int8;
	};
	
	this.readBytes = function(bytes, offset, length)
	{
		offset = offset || 0;
		length = length || this.uInt8Array.length;
		if(length===0)
		{
			length = this.uInt8Array.length;
		}
		if( (offset === 0 || (offset>0 && offset<bytes.uInt8Array.length ))&& 
			length>0 && 
			(this.position+length)<=this.uInt8Array.length)
		{
			var tempBytes0 = new Uint8Array(offset);
			tempBytes0 = bytes.uInt8Array.subarray(0, offset);
			
			var tempBytes1 = new Uint8Array(tempBytes0.length+length);
			var tempBytes2 = new Uint8Array(length);
			
			tempBytes2 = this.uInt8Array.subarray(this.position, length);			
			
			tempBytes1.set(tempBytes0);
			tempBytes1.set(tempBytes2,tempBytes0.length);
			bytes.uInt8Array = new Uint8Array(tempBytes1);
		}
		else
		{
			console.log("readBytes error");
		}
		
	};
	this.generationByteArray=function(int8)
	{
		this.position = 0;
		this.uInt8Array = int8;
	};
	
	this.clear = function()
	{
		this.position = 0;
		this.uInt8Array = new Uint8Array();
	};
	
	this.__defineGetter__("position", function(){
     return  this._position;
   });

   this.__defineSetter__("position", function(value){
	   this._position = value;
   });
   this.__defineGetter__("length", function(){
	   return this.uInt8Array.length;
   });
   this.__defineGetter__("bytesAvailable", function(){
	   return this.length-this._position;
   });

   this.__defineGetter__("ByteArray", function(){
	   return this.uInt8Array;
   });

};

JSON.stringify = JSON.stringify || function( obj )
{
	var t = typeof(obj);
	if( t != "object" || obj === null )
	{
		// simple data type
		if( t == "string" ) obj = '"' + obj + '"';
		return String(obj);
	}
	else
	{
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for( n in obj )
		{
			v = obj[n];
			t = typeof(v);
			if( t == "string" ) v = '"' + v + '"';
			else if( t == "object" && v !== null ) v = JSON.stringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

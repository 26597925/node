/**
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
};
/**
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
};
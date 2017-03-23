/**
 * 下载模块，统一处理下载数据
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.BaseHttpLoad = h5$.createClass({
	url:null,
	method:'get',
	scope:null,
	type:'text',
	issurport:false,
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	load:function()
	{
		var _xhr = this.createHttpLoader();
		var _me = this;
		_xhr.onreadystatechange = function()
		{
			if(this.readyState == 4)
			{
				if(this.status >=200 && this.status <300)
				{
					if(_me.issurport === true)
					{	
						_me.scope.success(this.response);
					}
					else
					{
						_me.scope.success(this.responseText);
					}
				}
				else
				{
					if(typeof(_me.scope.loaderError) == "function")
					{
						_me.scope.loaderError(this.status);
					}
					
				}
			}
				
		};
		_xhr.open(this.method,this.url,true);
		if(_xhr.hasOwnProperty("responseType"))
		{
			this.issurport = true;
			_xhr.responseType = this.type;
		}
		_xhr.send(null);
	},
	createHttpLoader:function()
	{
		var _xhr;
		if(window.ActiveXObject)
		{
			var _activeXNameList = ['Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.5.0','Msxml2.XMLHTTP.4.0','Msxml2.XMLHTTP.3.0','Msxml2.XMLHTTP','Microsoft.XMLHTTP'];
			for(var i = 0; i<_activeXNameList.length;i++)
			{
				try{
					_xhr = new ActiveXObject(_activeXNameList[i]);
				}
				catch(err){
					continue;
				}
				if(_xhr){break;}
			}
		}
		else if(window.XMLHttpRequest)
		{
			_xhr = new XMLHttpRequest();
			if(_xhr.overrideMineType)
			{
				_xhr.overrideMineType = this.type;
			}
		}
		return _xhr;
	}
});
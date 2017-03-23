/**
 * 请求调度处理
 */
h5$.nameSpace("com.p2p.loaders");
h5$.com.p2p.loaders.GslbLoader = h5$.createClass({
	
	__ctor:function(value)
	{
		h5$.apply(this,value);
	},
	load:function()
	{
		if(null === this.initData.gslb || "" === this.initData.gslb) this.callback.gslbSuccess(); 
		var reg=/([\w|\d]+\.){1,}[\w|\d]+/i;
		var _g3url = this.initData.gslb;
		console.log('loader::gslb::url',_g3url);
		_g3url = this.parseUrl.replaceParam(_g3url,'ajax','1');
		_g3url = this.parseUrl.replaceParam(_g3url,'format','1');
		_g3url = this.parseUrl.replaceParam(_g3url,'expect','3');
		_g3url = this.parseUrl.replaceParam(_g3url,'m3v','1');
		var _me = this;
		var _info = {url:_g3url,method:'get',scope:this};
		var _loader = new h5$.com.p2p.loaders.BaseHttpLoad(_info);
		_loader.load();
	},
	success:function(param)
	{
		if(typeof(param) == 'string')
		{
			param = eval("("+decodeURIComponent(param)+")");
		}
		if(param.playlevel)
		{
			this.initData.playlevel = param.playlevel;
		}
		if(param.geo)
		{
			this.initData.geo = param.geo;
		}
		if(param.livesftime)
		{
			this.initData.livesftime = param.livesftime;
		}
		//分析节点
		if(param.nodelist&&param.nodelist.length>0)
		{
			this.initData.src = param.nodelist;
		}
		this.callback.gslbSuccess();
		var info={};
		info.code = "Video.Gslb.Info";
		info.info={url:this.initData.src[0].location};
		this.statics.sendToJs(info);
		this.clear();
	},
	clear:function()
	{
		this.parseUrl = null;
		this.initData = null;
		this.config = null;
		this.statics = null;
		this.callback = null;
	}
});
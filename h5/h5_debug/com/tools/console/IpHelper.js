p2p$.ns('com.tools.console');
p2p$.com.tools.console.IpHelper = JClass.extend_({

	names_ : null,
	pendingIps_ : null,
	loader_:null,
	ip_:null,
	scope_:null,
	callback_:null,
	isload_:false,

	init : function() {
		this.names_ = {};
		this.pendingIps_ = [];
	},

	getNameByIp_ : function(ip, callback, scope) {
		if (ip.indexOf(':') >= 0) {
			ip = ip.substr(0, ip.indexOf(':'));
		}
		if (ip.substr(0, 1) == '*') {
			ip = ip.substr(1);
		}
		ip = p2p$.com.utils.Utils.trim(ip);
		if (this.names_[ip]) {
			return this.names_[ip];
		}
		this.queryIp_(ip,callback,scope);
		return '...';
	},

	queryIp_ : function(ip,callback,scope) {
		for (var i = 0; i < this.pendingIps_.length; i++) {
			if (this.pendingIps_[i] == ip) {
				return;
			}
		}
		this.pendingIps_.push(ip);
		this.callback_=callback;
		this.scope_=scope;
		this.queryNext_();
	},

	queryNext_ : function() {
		if (this.pendingIps_.length == 0) {
			return;
		}
		if(this.isload_)
		{
			return;
		}
		this.ip_ = this.pendingIps_[0];
		this.pendingIps_.shift();
		this.isload_=true;
		loader_=new p2p$.com.loaders.HttpDownLoader({"url_":'http://g3.letv.cn/?format=1&ajax=1&uip=' + this.ip_ + '&random=' + Math.random(),"scope_":this,"type_":"jsonp","tag_":"ip"});
		loader_.load_();
	},
	onHttpDownloadCompleted_:function()
	{
		var data=loader_.responseData_;
		if (typeof (data) == 'string') {
			try {
				data = eval('(' + data + ')');
			} catch (e) {
			}
		}
		var name = (data.desc || '-');
		var trimValues = '中国-';
		if (name.substr(0, trimValues.length) == trimValues) {
			name = name.substr(trimValues.length);
		}
		this.names_[this.ip_] = name;
		this.isload_=false;
		this.queryNext_();
		if (this.callback_) {
			this.callback_.call(this.scope_);
		}
	}
});

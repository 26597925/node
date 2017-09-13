p2p$.ns('com.tools.collector');
p2p$.com.tools.collector.Statics = p2p$.com.tools.collector.ClientBase.extend_({
	clientParams_:null,
	pendingReports_ : null,
	http_ : null,
	reportServer_ : "",
    timer_ : null,
	timerIntervalTime_:10*1000,
	heart_:null,
    reportTraffic_:null,
	snObj_:{},
	blockTime_:0,
	blockFirstReport_:false,

	init : function(wrapper) {
		this._super();
		this.scope_ = wrapper;
		this.tag_="com::tools::collector::Statics";
		this.clientParams_ = new p2p$.com.tools.collector.ClientParams(this);
		this.heart_ = new p2p$.com.tools.collector.HeartBeat(this);
        this.reportTraffic_ = new p2p$.com.tools.collector.ClientTraffic();
		this.reportServer_ = "http://" + this.scope_.manager_.getEnviroment_().getHostDomain_("s.webp2p.letv.com");
		this.pendingReports_ = [];
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::init reportServer({1})",this.tag_,this.reportServer_));
	},
	setReportTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onHttpTimeout_();
		}, timeoutMs);
	},
	reportNext_ : function() {
		if (this.http_ != null || this.pendingReports_.length == 0) {
			return;
		}

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		this.setReportTimeout_(this.timerIntervalTime_);
		var nextItem = this.pendingReports_[0];
		this.pendingReports_.shift();

		var url;
		var postData=nextItem[1];
		if (nextItem[0].indexOf("http://") == 0) {
			url = nextItem[0];
		} else {
			url = this.reportServer_ + nextItem[0];
		}
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Send report, {1} pending item(s) to url({2})",this.tag_,this.pendingReports_.length, url));
		this.http_ = new p2p$.com.loaders.HttpDownLoader({url_:url, scope_:this, method_:"POST", type_:"text",postData_:postData, tag_:"collector::report"});
		this.http_.load_();
	},

	onHttpTimeout_ : function() {
		this.http_ = null;
		this.reportNext_();
	},

	onHttpDownloadCompleted_ : function(downloader) {
		if (this.http_ != downloader) {
			// expired
			return true;
		}

		this.http_ = null;
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		this.reportNext_();
		return true;
	},

	getEnviroment_ : function() {
		return this.scope_.manager_.getEnviroment_();
	},

	getContext_ : function() {
		return this.scope_.context_;
	},

	getMetaData_ : function() {
		return this.scope_.metaData_;
	},

	getPlayer_ : function(){
		return this.scope_.player_;
	},

	close_ : function() {
        this.reportTraffic_.flush(this, true);
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.http_ != null) {
			this.http_ = null;
		}
		this.heart_.close_();
		this.heart_ = null;
		this.pendingReports_ = [];
	},
	/**状态处理*/
	sendStatus_:function(params)
	{
		if(this.heart_){
            this.heart_.playStatus_(params);
		}
		var type_ = params["type"];
		var params_ = params["params"];
		switch(type_)
		{
			case "PLAYER.INIT":
                this.requestInfo_("/act/pl","pl/init",params_);
				break;
			case "VIDEO.INIT":
                this.requestInfo_("/act/cde","cde/init",params_);
				break;
			case "VIDEO.GSLB.LOADING":
				break;
			case "VIDEO.GSLB.LOADED":
                this.requestInfo_("/act/cde","cde/gslb",params_);
				break;
			case "VIDEO.META.LOADING":
				break;
			case "VIDEO.META.LOADED":
                this.requestInfo_("/act/cde","cde/chk",params_);
				break;
			case "ACTION.SELECTOR.CONNECTED":
				this.requestInfo_("/act/cde","cde/sel",params_);
				break;
			case "ACTION.RTMFP.CONNECTED":
                this.requestInfo_("/act/cde","cde/rtm",params_);
				break;
			case "ACTION.SOCKET.CONNECTED":
                this.requestInfo_("/act/cde","cde/soc",params_);
				break;
			case "ACTION.WEBRTC.CONNECTED":
                this.requestInfo_("/act/cde","cde/rtc",params_);
				break;
			case "ACTION.FIRST.PIECE":
				break;
			case "ACTION.FIRST.P2P.PIECE":
                this.requestInfo_("/act/cde","cde/pie",params_);
				break;
			case "VIDEO.TS.LOADING":
                this.requestInfo_("/act/cde","cde/cquery",params_);
				break;
			case "VIDEO.TS.LOADED":
                this.requestInfo_("/act/cde","cde/cload",params_);
				break;
			case "ACTION.SCHEDULE.COMPLETED":
                break;
			case "VIDEO.PLAY.FIRST":
                this.requestInfo_("/act/pl","pl/play",params_);
				break;
			case "VIDEO.PLAY.SEEKED":
                this.requestInfo_("/act/pl","pl/seek",params_);
				break;
			case "VIDEO.PLAY.END":
                this.requestInfo_("/act/pl","pl/end",params_);
				break;
			case "VIDEO.BUFFER.START":
                this.blockTime_ = this.global_.getMilliTime_();
				break;
            case "VIDEO.BUFFER.END":
            	if(!this.blockFirstReport_){
            		this.blockFirstReport_=true;
                    params_["utime"]=this.global_.getMilliTime_()-this.blockTime_;
                    this.requestInfo_("/act/pl","pl/block",params_);
				}
				break;
			case "VIDEO.HEART":
				var p2pParams=this.reportTraffic_.getLoadParams_();
				for(var i in params_){
                    p2pParams[i]=params_[i];
				}
                this.requestInfo_("/hb","time",p2pParams);
				break;
			case "VIDEO.PLAY.ERROR":
				var code = params["code"];
				switch (code){
					case 20500:
					case 20501:
                        this.requestInfo_("/err/s","s/gslb",params_);
                        break;
					case 20601:
                        this.requestInfo_("/err/s","s/chk",params_);
						break;
					case 30001:
						this.requestInfo_("/err/s","s/cload",params_);
						break;
					default:
						this.requestInfo_("/err/c","err",params_)
						break;
				}
				break;
		}
	},
	sendTraffic_:function()
	{
		var type_ = arguments[0];
		switch(type_){
			case 0://checkError
                this.reportTraffic_.addChecksumErrors_(this, arguments[1], arguments[2], arguments[3],arguments[4]);
				break;
			case 1:
                this.reportTraffic_.addDownloadSize_(this, arguments[1], arguments[2], arguments[3]);
				break;
			case 2:
                this.reportTraffic_.updateSessions_(this, arguments[1], arguments[2]);
				break;
			case 3:
                this.reportTraffic_.addUploadSize_(this, arguments[1], arguments[2], arguments[3]);
				break;
			case 4:
				this.reportTraffic_.flush(this,arguments[1]);
				break;
		}
	},

    setTrafficParams_:function(params)
	{
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0} setTrafficParams",this.tag_));
		for(var i in params)
		{
			if(this.reportTraffic_.hasOwnProperty(i)){
                this.reportTraffic_[i]=params[i];
			}
		}
	},

    requestInfo_:function(tag,type,params)
	{
        var reportParams = this.clientParams_.getReportParams_(type);//获取需要上报参数
		var baseParamValues = this.clientParams_.getBaseParams_();
		var info = {};
		for(var i=0;i<reportParams.length;i++){
			info[reportParams[i]] = baseParamValues[reportParams[i]];
		}
		if(info.hasOwnProperty("act")){
            var act = type;
            var data = type.split("/");
            if(data.length>1){
                act = data[1];
            }
            info["act"]=act;
		}
		//赋值携带参数
		for(var i in params){
			info[i] = params[i];
		}
        this.pendingReports_.push([tag,info]);
        this.reportNext_();
	}
});

p2p$.ns("com.player");
p2p$.com.player.SystemPlayer = p2p$.com.player.BasePlayer.extend_({

	init : function(video) {
		this._super(video);
		this.tag_="com::player::SystemPlayer";
	},
	start : function() {
		if (this.http_) {
			this.http_.abort();
			this.http_ = null;
		}
		var urlInfo = new p2p$.com.common.Url();
		urlInfo.fromString_(this.url_);
		urlInfo.params_.set('format', '1');
		urlInfo.params_.set('expect', '3');
		urlInfo.params_.set('ajax', '1');
		if (!urlInfo.params_.has('stream_id')) {
			urlInfo.params_.set('tss', 'no');
		}
		var gslbUrl = urlInfo.toString();
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Start download gslb url: {1} ...",this.tag_,gslbUrl));

		var loader = new p2p$.com.loaders.HttpDownLoader({url_:gslbUrl,scope_:this,type_:"json"});
		loader.load_();

		var env = p2p$.com.selector.Enviroment;
		var report = new p2p$.com.common.Url();
		report.protocol_ = "http";
		report.host_ = env.getHostDomain_("s.webp2p.letv.com");
		report.file_ = "/ClientStageInfo";
		report.params_.set("act", "0");
		report.params_.set("err", "1");
		report.params_.set("utime",0);
		report.params_.set("type", urlInfo.params_.has("stream_id") ? "liv" : "vod");
		report.params_.set("termid", urlInfo.params_.get("termid"));
		report.params_.set("platid", urlInfo.params_.get("platid"));
		report.params_.set("splatid", urlInfo.params_.get("splatid"));
		report.params_.set("vtype", urlInfo.params_.get("vtype") || "0");
		report.params_.set("streamid", urlInfo.params_.get("stream_id") || "");
		report.params_.set("ch", urlInfo.params_.get("ch") || "");
		report.params_.set("p1", urlInfo.params_.get("p1") || "");
		report.params_.set("p2", urlInfo.params_.get("p2") || "");
		report.params_.set("p3", urlInfo.params_.get("p3") || "");
		report.params_.set("uuid", urlInfo.params_.get("uuid") || "");
		report.params_.set("p2p", "0");
		report.params_.set("appid", env.externalAppId_);
		report.params_.set("cdeid", env.moduleId_);
		report.params_.set("package", env.externalAppPackageName_);
	},
	onHttpDownloadCompleted_ : function(downloader) {
		
		var data_ = downloader.responseData_;
		var code_ = downloader.responseCode_;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Download gslb {1}: {2} ...",this.tag_,data_!="" ? 'success' : 'failed', code_));
		if (!data_) {
            this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code_,info:"no data!"});
			return;
		}

		try {
			var gslbData = (typeof (data_) == "string") ? eval("(" + data_ + ")") : data_;
			var mediaUrl = gslbData.location;
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Gslb responsed, error code({1}), details({2}), user ip({3}), url({4})",this.tag_,gslbData.ercode,
				gslbData.errinfo || '', gslbData.remote, mediaUrl));
			this.video_.src = mediaUrl;
			this.addVideoEvent_(this.video_);
			this.video_.play();
		} catch (e) {
            this.sendStatus_({type:"VIDEO.PLAY.ERROR",code:code_,info:e.toString()|""});
		}
	}
});

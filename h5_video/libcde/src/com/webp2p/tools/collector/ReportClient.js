p2p$.ns('com.webp2p.tools.collector');

p2p$.com.webp2p.tools.collector.ReportClient = CdeBaseClass.extend_({

	timer_ : null,
	enviroment_ : null,
	context_ : null,
	metaData_ : null,
	pendingReports_ : null,
	http_ : null,
	reportServer_ : "",

	init : function(env, context, metaData) {
		this.enviroment_ = env;
		this.metaData_ = metaData;
		this.context_ = context;
		this.reportServer_ = "http://" + env.getHostDomain_("s.webp2p.letv.com");
		this.pendingReports_ = [];
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
		this.setReportTimeout_(10 * 1000);

		var nextItem = this.pendingReports_[0];
		this.pendingReports_.shift();

		var url;
		if (nextItem.indexOf("http://") == 0) {
			url = nextItem;
		} else {
			url = this.reportServer_ + nextItem;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::ReportClient::Send report, {0} pending item(s) to url({1})", this.pendingReports_.length, url));
		this.http_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(url, this, "GET", "text", "collector::report");
		this.http_.load();
	},

	onHttpTimeout_ : function() {
		this.http_ = null;
		this.reportNext_();
	},

	onHttpDownloadCompleted_ : function(downloader) {
		if (this.http_ != downloader) {
			// expired
			P2P_ULOG_INFO(P2P_ULOG_FMT("tools::collector::ReportClient::expired http complete for tag({0}), channel({1}), ignore", downloader.tag_,
					this.metaData_.storageId_));
			return true;
		}

		this.http_ = null;
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT(
				"tools::collector::ReportClient::Report complete for tag({0}), channel({1}), url({2}), response code({3}), details({4}), size({5})",
				downloader.tag_, this.metaData_.storageId_, downloader.fullUrl_, downloader.responseCode_, downloader.responseDetails_,
				downloader.responseData_.length));

		this.reportNext_();
		return true;
	},

	getEnviroment_ : function() {
		return this.enviroment_;
	},

	getContext_ : function() {
		return this.context_;
	},

	getMetaData_ : function() {
		return this.metaData_;
	},

	initialize_ : function(params) {
		return true;
	},

	exit : function() {

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.http_ != null) {
			this.http_ = null;
		}
		this.pendingReports_ = [];
	},

	sendClientStage_ : function(stage) {
		var url = new p2p$.com.webp2p.core.supernode.Url();
		stage.toUrl_(this, url);
		var val = "";
		if (url.params_.find("act")) {
			val = url.params_.get("act");
			url.params_.erase("act");
		}
		this.pendingReports_.push(url.file_ + "?act=" + val + url.toQueryString_(false));
		this.reportNext_();
		return true;
	},

	sendClientTraffic_ : function(traffic) {
		var url = new p2p$.com.webp2p.core.supernode.Url();
		traffic.toUrl_(this, url);
		this.pendingReports_.push(url.file_ + url.toQueryString_());
		this.reportNext_();
	},

	sendAdvertStage_ : function(stage) {
		var url = new p2p$.com.webp2p.core.supernode.Url();
		stage.toUrl_(this, url);
		this.pendingReports_.push(url.toString());
		this.reportNext_();
	},

	sendClientStage2_ : function(action, errorCode, serverHost, usedTime) {
		var stage = new p2p$.com.webp2p.tools.collector.ClientStage();
		var data2 = serverHost.split(" ");
		var data = "";
		if (data2.length == 1) {
			data = data2[0].split(":");
		} else {
			data = data2[1].split(":");
		}

		stage.action_ = action;
		stage.errorCode_ = errorCode;
		stage.usedTime_ = usedTime;
		stage.serverIp_ = data[0];
		stage.serverPort_ = data.length == 1 ? 80 : data[1];
		return this.sendClientStage_(stage);
	}
});
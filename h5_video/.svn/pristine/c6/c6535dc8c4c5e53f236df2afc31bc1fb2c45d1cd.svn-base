p2p$.ns('com.webp2p.core.entrance');

p2p$.com.webp2p.core.entrance.VideoStream = {
	initialized_ : false,
	channelManager_ : null,
	pool_ : null,
	enviroment_ : null,
	connectionType_ : "",

	init : function() {
		if (this.initialized_) {
			return;
		}
		this.connectionType_ = "";
		this.initialized_ = true;
		this.enviroment_ = p2p$.com.webp2p.core.supernode.Enviroment;
		this.enviroment_.initialize_();
		this.checkNetwork_();
		this.channelManager_ = new p2p$.com.webp2p.logic.base.Manager(this.enviroment_);
		this.pool_ = p2p$.com.webp2p.core.storage.Pool;
		this.pool_.initialize_(this.channelManager_);
		this.setCheckTimer_(5000);
	},

	checkNetwork_ : function() {
		var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		if (connection) {
			this.connectionType_ = connection.type;

			try {
				var me = this;
				// Register for event changes.
				connection.onchange = function(e) {
					me.onNetowrkTypeChanged_(e);
				};
				// Alternatively.
				connection.addEventListener('change', function(e) {
					me.onNetowrkTypeChanged_(e);
				});
			} catch (e) {
				P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Add network change event failed: {0}", (e || "").toString()));
			}

			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Check network, type: {0}", this.connectionType_));
		} else {
			var osType = "unknown";
			try {
				var sUserAgent = navigator.userAgent;
				var isWindows = (navigator.platform == "Win32") || (navigator.platform == "Windows");
				var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh")
						|| (navigator.platform == "MacIntel");
				if (isMac) {
					osType = "mac";
				} else if (String(navigator.platform).toLowerCase().indexOf("android") > -1 || sUserAgent.toLowerCase().indexOf("android") > -1) {
					osType = "android";
				} else {
					osType = isWindows ? "windows" : "other";
				}
			} catch (e) {
			}

			this.connectionType_ = (osType == "windows" || osType == "mac") ? "ethernet" : "mobile";
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Check network not support, os {0} default as {1}", osType, this.connectionType_));
		}
		this.enviroment_.setNetworkType_(this.connectionType_);
	},

	onNetowrkTypeChanged_ : function(e) {
		var temp = this.connectionType_;
		this.connectionType_ = navigator.connection.type;
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Network changed from ({0}) to ({1})", temp, this.connectionType_));
		this.enviroment_.setNetworkType_(connectionType);
		this.channelManager_.checkTimeout_();
	},

	onCheckTimeout_ : function() {
		this.channelManager_.checkTimeout_();
		// this.checkInactiveNotifiers_();
		// this.checkTimeoutChannels_();
		this.setCheckTimer_(5000);
	},

	setCheckTimer_ : function(timeoutMs) {
		var me = this;
		this.checkTimer_ = setTimeout(function() {
			me.onCheckTimeout_();
		}, timeoutMs);
	},

	getConnectionParams_ : function(palyUrl, url) {
		url.fromString_(palyUrl);
	},

	requestPlay_ : function(palyUrl) {

		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::entrance::VideoStream::Request play, url({0})", palyUrl));

		var channel = null;
		var url = new p2p$.com.webp2p.core.supernode.Url();
		this.playUrl_ = palyUrl;
		this.getConnectionParams_(palyUrl, url);

		channel = this.channelManager_.openChannel(this.playUrl_, url.params_, this);
		if (!channel) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("core::entrance::VideoStream::Open channel failed"));
		}
		return channel;
	},

	requestPlaySlice_ : function(channelId, requestSegmentId, urgentSegmentId) {
		// get segment
		// var responseCode = 0;
		var responseDetails = "";
		var channel = this.channelManager_.getChannelById_(channelId);

		if (channel == null) {
			// responseCode = 200;
			responseDetails = "Channel Not Found";
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice {0}", responseDetails));
			return null;
		}

		P2P_ULOG_TRACE(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice urgent segment id: {0}", requestSegmentId));
		var result = channel.requireSegmentData_(requestSegmentId, urgentSegmentId);
		// streamInfo == null || streamInfo.stream == null
		// segment:segment,stream:retStream
		if (result.segment != null && result.stream != null) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice request urgent({0}) success", requestSegmentId));
		} else {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("core::entrance::VideoStream::Request play slice request urgent({0}) failed", requestSegmentId));
		}
		return result;
	},

	requestPlayStop_ : function(palyUrl) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("core::entrance::VideoStream::Request stop {0}", palyUrl));
		this.channelManager_.closeChannel_(palyUrl);
	},

	requestControlParams_ : function() {
	},

	getConnectionParams2_ : function(palyUrl) {
		var urlParse = new p2p$.com.webp2p.core.supernode.Url();
		urlParse.fromString_(palyUrl);
		return urlParse.params_;
	},

	requestStateCurrent_ : function(url) {
		var params, result = {};
		params = this.getConnectionParams2_(url);
		var maxLogTime = 0;
		this.getCurrentState_(params, result, maxLogTime);
		return result;
	},
	getCurrentState_ : function(params, result, maxLogTime) {
		// module
		var moduleResult = result["module"] = {};
		moduleResult["version"] = p2p$.com.webp2p.core.common.String.format("CDE-{0}.{1}.{2}", p2p$.com.webp2p.core.common.Module.kCdeMajorVersion,
				p2p$.com.webp2p.core.common.Module.kCdeMinorVersion, p2p$.com.webp2p.core.common.Module.kCdeBuildNumber);
		moduleResult["buildTime"] = p2p$.com.webp2p.core.common.Module.kBuildTime;

		// system
		result["system"] = {};
		this.getSystemInfoDetails_(params, result["system"]);

		// enviroment
		result["enviroment"] = {};
		this.enviroment_.getAllStatus_(result["enviroment"]);
		// this.supportSession_.getAllStatus_(result["support"]);

		if (!params.get("ignoreChannels")) {
			this.channelManager_.getAllStatus_(params, result);
		}

		// log pipes
		if (params.get("needLogPipe")) {
			var logResult = p2p$.com.webp2p.core.common.Log.logPipe_.require(parseInt(params.get("logPipeId") || 0), parseInt(params.get("logPipeTime") || 0),
					parseInt(params.get("logPipeLevel") || 255), params.get("logPipeFilter") || "", parseInt(params.get("logPipeLimit") || 1), maxLogTime);
			maxLogTime = logResult.maxLogTime;
			result["logs"] = logResult.records;
		}

		return maxLogTime;
	},

	getSystemInfoDetails_ : function(params, result) {
		result["currentTime"] = new Date().getTime() / 1000;

		// system:default bucket
		var defaultBucket = p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
		var storageInfo = result["storage"] = {};
		var defaultInfo = storageInfo["default"] = {};
		defaultInfo["name"] = defaultBucket.getName_();
		defaultInfo["dataSize"] = defaultBucket.getDataSize_();
		defaultInfo["dataCapacity"] = defaultBucket.getDataCapacity_();
	}
};
p2p$.ns('com.webp2p.core.entrance');

p2p$.com.webp2p.core.entrance.VideoStream = {
	initialized_ : false,
	channelManager_ : null,
	pool_ : null,
	enviroment_ : null,
	connectionType_ : "",
	strings_:null,
	platForms_:[["Win32","Windows"],["Mac68K","MacPPC","Macintosh","MacIntel"]],
	tag_:"com::webp2p::core::entrance::VideoStream",

	init : function() {
		if (this.initialized_) {
			return;
		}
		this.strings_ = p2p$.com.common.String;
		this.connectionType_ = "";
		this.initialized_ = true;
		this.enviroment_ = p2p$.com.selector.Enviroment;
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
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Add network change event failed: {1}",this.tag_,(e || "").toString()));
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Check network, type: {1}",this.tag_,this.connectionType_));
		} else {
			var osType = this.enviroment_.getOSType_();
			switch(osType)
			{
				case "Mac":
				case "Unix":
				case "Linux":
				case "Win2000":
				case "Win2003":
				case "WinXP":
				case "WinVista":
				case "Win7":
				case "Win":
				case "other":
					this.connectionType_ = "ethernet";
					break;
				case "iPhone":
				case "Android":
					this.connectionType_ = "mobile";
					break;
				default:
					break;
			}
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Check network not support, os {1} default as {2}",this.tag_,osType,this.connectionType_));
		}
		this.enviroment_.setNetworkType_(this.connectionType_);
	},
	onNetowrkTypeChanged_ : function(e) {
		var temp = this.connectionType_;
		this.connectionType_ = navigator.connection.type;
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Network changed from ({1}) to ({2})",this.tag_, temp, this.connectionType_));
		this.enviroment_.setNetworkType_(connectionType);
		this.channelManager_.checkTimeout_();
	},

	onCheckTimeout_ : function() {
		this.channelManager_.checkTimeout_();
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
		var channel = null;
		var url = new p2p$.com.common.Url();
		this.playUrl_ = palyUrl;
		this.getConnectionParams_(palyUrl, url);
		channel = this.channelManager_.openChannel_(this.playUrl_, url.params_, this);
		if (channel) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play, url({1})", this.tag_,palyUrl));
			return channel;
		}
		P2P_ULOG_ERROR(P2P_ULOG_FMT("{0}::Open channel failed",this.tag_));
		return null;
	},

	requestPlaySlice_ : function(channelId, requestSegmentId, urgentSegmentId) {
		var responseDetails = "";
		var channel = this.channelManager_.getChannelById_(channelId);

		if (channel == null) {
			responseDetails = "Channel Not Found";
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play slice {1}",this.tag_, responseDetails));
			return null;
		}

		var result = channel.requireSegmentData_(requestSegmentId, urgentSegmentId);
		if (result.segment != null && result.stream != null) {
			P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request play slice request urgent({1}) success",this.tag_, requestSegmentId));
		} else {
			P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::Request play slice request urgent({1}) failed",this.tag_,requestSegmentId));
		}
		return result;
	},

	requestPlayStop_ : function(palyUrl) {
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Request stop {1}",this.tag_,palyUrl));
		this.channelManager_.closeChannel_(palyUrl);
	},

	requestControlParams_ : function() {
	},

	getConnectionParams2_ : function(palyUrl) {
		var urlParse = new p2p$.com.common.Url();
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
		moduleResult["version"] = this.strings_.format("H5-{0}.{1}.{2}", p2p$.com.selector.Module.kH5MajorVersion,p2p$.com.selector.Module.kH5MinorVersion, p2p$.com.selector.Module.kH5BuildNumber);
		moduleResult["buildTime"] = p2p$.com.selector.Module.kBuildTime;

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
			var logResult = p2p$.com.common.Log.logPipe_.require(parseInt(params.get("logPipeId") || 0), parseInt(params.get("logPipeTime") || 0),
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

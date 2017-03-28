p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Manager = CdeBaseClass.extend_({
	channels_ : null,
	defaultMultiMode_ : false,
	channelCapacity_ : 0,
	downloadCapacity_ : 0,
	downloadParallelCount_ : 0,

	// ChannelPtrMap channels_;
	// ChannelPtrList downloads_;
	// AuthorizationPtr authorization_;
	// core::common::StringSet playedHistoryKeys_;
	// core::access::KeyManager keyManager_;
	enviroment_ : null,
	// boost::asio::io_service &service_;

	init : function(enviroment) {
		this.channels_ = new p2p$.com.webp2p.core.common.Map();
		this.enviroment_ = enviroment;
		this.defaultMultiMode_ = false;
		this.channelCapacity_ = 3; // default
		this.downloadCapacity_ = 1000;
		this.downloadParallelCount_ = 1;
		// authorization_.reset(new Authorization(*this, io));
	},

	getEnviroment_ : function() {
		return this.enviroment_;
	},

	openChannel : function(channelUrl, params, scope) {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("openChannel"));

		// var playerTaskId = params.find("taskid") ? params.get("taskid") : "";
		// var multiMode = params.find("multi") ? params.get("multi") : this.defaultMultiMode_;
		// var closeIfExists = params.find("exclusive") ? params.get("exclusive") : false;
		var groupType = params.find("pip") ? params.get("pip") : 0;
		var streamMode = params.find("stream") ? params.get("stream") : 0;
		if (params.find("group")) {
			groupType = params.get("group");
		}
		var urlTagTime = params.find("tagtime") ? (params.get("tagtime") * 1000 * 1000) : 0;
		var channel = null;
		// var isLiveStream = false;
		if (this.channels_.has(channelUrl)) {
			channel = this.channels_.get(channelUrl);
			channel.updateActiveTime_(false);
			return channel;
		}

		var programUrl = new p2p$.com.webp2p.core.supernode.Url();
		programUrl.fromString_(channelUrl);
		var tagName = (programUrl.params_.find("tag")) ? programUrl.params_.get("tag") : "";
		var streamId = (programUrl.params_.find("stream_id")) ? programUrl.params_.get("stream_id") : "";
		var isLiveStream = (streamMode > 0) || streamId != "";
		// var isRtlStream = false;
		// if (this.enviroment_.rtlStreamEnabled_) {
		// if (programUrl.protocol_ == "rtmp") {
		// isRtlStream = true;
		// } else {
		// isRtlStream = isLiveStream && (programUrl.params_.find("scheme")) && programUrl.params_.get("scheme") == "rtmp";
		// }
		// }

		if (isLiveStream) {
			channel = new p2p$.com.webp2p.logic.live.Channel(channelUrl, programUrl, this);
		} else {
			channel = new p2p$.com.webp2p.logic.vod.Channel(channelUrl, programUrl, this);
		}
		channel.setGroupType(groupType);
		channel.setReopenMode(false);
		channel.loadParams_(params, this.enviroment_.customContextParams_);
		channel.updateActiveTime_(false);
		channel.setUrlTagTime_(urlTagTime);
		if (!channel.open()) {

			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Manager::Open new {0} channel url({1}) failed", tagName || "vod", channelUrl));
			channel = null;
			return channel;
		}
		this.channels_.set(channelUrl, channel);

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Open new {0} channel url({1}) OK", tagName || "vod", channelUrl));
		return channel;
	},

	closeChannel_ : function(channelUrl) {
		for ( var n = 0; n < this.channels_.length; n++) {
			var mapItem = this.channels_.element(n);
			if (mapItem.key == channelUrl) {
				var item = mapItem.value;
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Close channel id({0}), type({1}), url({2}), total {3} channel(s) now", item.getId_(), item
						.getTypeName_(), item.getChannelUrl_(), this.channels_.size() - 1));
				item.close();
				this.channels_.erase(this.channels_.element(n).key);
				delete item;
				return true;
			}
		}
	},

	checkTimeout_ : function() {
		var isMobileNow = this.enviroment_.isMobileNetwork_();
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		for ( var n = 0; n < this.channels_.length; n++) {
			var item = this.channels_.element(n).value;
			// if (item.getActiveTime_() + item.getMaxSleepTime_() < nowTime) {
			// P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Close timeout channel id({0}), type({1}), url({2}), total {3} channel(s) now", item.getId_(),
			// item.getTypeName_(), item.getChannelUrl_(), this.channels_.size() - 1));
			// item.close();
			// this.channels_.erase(this.channels_.element(n).key);
			// n--;
			// continue;
			// }

			if (!item.isOpened_() || !item.p2pIsReady_()) {
				continue;
			}
			var needDeactivate = (item.getActiveTime_() + item.getMaxSilentTime_() < nowTime) || isMobileNow || item.isPaused_();
			if (needDeactivate && item.p2pisActive_()) {
				item.p2pDeactive_();
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Deactive slient channel, mobile network({0}), id({1}), type({2}), url({3})",
						isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
			} else if (!needDeactivate && !item.p2pisActive_()) {
				item.p2pActivate_();
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Manager::Activate slient channel, mobile network({0}), id({1}), type({2}), url({3})",
						isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
			}
		}
	},

	getChannelById_ : function(id) {
		var channel = null;
		for ( var n = 0; n < this.channels_.length; n++) {
			var item = this.channels_.element(n).value;
			if (item.getId_() == id) {
				channel = item;
				break;
			}
		}
		return channel;
	}
});
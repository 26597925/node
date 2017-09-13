p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Manager = JClass.extend_({
	channels_ : null,
	defaultMultiMode_ : false,
	channelCapacity_ : 0,
	downloadCapacity_ : 0,
	downloadParallelCount_ : 0,
	enviroment_ : null,
	tag_:"com::webp2p::logic::base::Manager",

	init : function(enviroment) {
		this.channels_ = new p2p$.com.common.Map();
		this.enviroment_ = enviroment;
		this.defaultMultiMode_ = false;
		this.channelCapacity_ = 3;
		this.downloadCapacity_ = 1000;
		this.downloadParallelCount_ = 1;
	},
	
	getEnviroment_ : function() {
		return this.enviroment_;
	},
	
	openChannel_ : function(channelUrl, params, scope) {
		P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}::openChannel_",this.tag_));
		var groupType = params.find("pip") ? params.get("pip") : 0;
		var streamMode = params.find("stream") ? params.get("stream") : 0;
		if (params.find("group")) {
			groupType = params.get("group");
		}
		var urlTagTime = params.find("tagtime") ? (params.get("tagtime") * 1000 * 1000) : 0;
		var channel = null;
		
		if (this.channels_.has(channelUrl)) {
			channel = this.channels_.get(channelUrl);
			channel.updateActiveTime_(false);
			return channel;
		}

		var programUrl = new p2p$.com.common.Url();
		programUrl.fromString_(channelUrl);
		var tagName = (programUrl.params_.find("tag")) ? programUrl.params_.get("tag") : "";
		var streamId = (programUrl.params_.find("stream_id")) ? programUrl.params_.get("stream_id") : "";
		var isLiveStream = (streamMode > 0) || streamId != "";

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
		this.channels_.set(channelUrl, channel);
		P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Open new {1} channel url({2}) OK",this.tag_,tagName || "vod", channelUrl));
		return channel;
	},

	closeChannel_ : function(channelUrl) {
		for ( var n = 0; n < this.channels_.length; n++) {
			var mapItem = this.channels_.element(n);
			if (mapItem.key == channelUrl) {
				var item = mapItem.value;
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Close channel id({1}), type({2}), url({3}), total {4} channel(s) now",this.tag_,item.getId_(), item.getTypeName_(), item.getChannelUrl_(), this.channels_.size() - 1));
				item.close();
				this.channels_.erase(this.channels_.element(n).key);
				item=null;
				return true;
			}
		}
	},

	checkTimeout_ : function() {
		var isMobileNow = this.enviroment_.isMobileNetwork_();
		var nowTime = p2p$.com.common.Global.getMilliTime_();
		for ( var n = 0; n < this.channels_.length; n++) {
			var item = this.channels_.element(n).value;
			if (!item.isOpened_() || !item.p2pIsReady_()) {
				continue;
			}
			var needDeactivate = (item.getActiveTime_() + item.getMaxSilentTime_() < nowTime) || isMobileNow || item.isPaused_();
			if (needDeactivate && item.p2pisActive_()) {
				item.p2pDeactive_();
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Deactive slient channel, mobile network({1}), id({2}), type({3}), url({4})",this.tag_,isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
			} else if (!needDeactivate && !item.p2pisActive_()) {
				item.p2pActivate_();
				P2P_ULOG_INFO(P2P_ULOG_FMT("{0}::Activate slient channel, mobile network({1}), id({2}), type({3}), url({4})",this.tag_,isMobileNow ? "yes" : "no", item.getId_(), item.getTypeName_(), item.getChannelUrl_()));
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
	},
	getAllStatus_ : function(params, result) {
		var jsonManager = result["manager"] = {};
		jsonManager["defaultMultiMode"] = this.defaultMultiMode_;
		jsonManager["channelCapacity"] = this.channelCapacity_;
		jsonManager["downloadCapacity"] = this.downloadCapacity_;
		jsonManager["downloadParallelCount"] = this.downloadParallelCount_;
		// jsonManager["authSynced"] = authorization_.synced();
		// jsonManager["authSyncedSuccess"] = authorization_.syncedSuccess();
		// jsonManager["authServerTimeNow"] = authorization_.serverTimeNow();
		// jsonManager["authRemoteServerTime"] = authorization_.remoteServerTime();
		// jsonManager["authAbsoluteCdeTime"] = authorization_.absoluteCdeTime();
		// jsonManager["authLocalCdeTime"] = authorization_.localCdeTime();
		// jsonManager["authTimeDiff"] = authorization_.timeDiff();
		// jsonManager["playedHistoryCount"] = playedHistoryKeys_.size();

		var jsonChannels = result["channels"] = [];

		for ( var n = 0; n < this.channels_.length; n++) {
			var channel = this.channels_.element(n).value;
			var channelTemp = jsonChannels[n] = {};
			channel.getAllStatus_(params, channelTemp);
		}
		// for( logic::base::ChannelPtrList::const_iterator itr = downloads_.begin(); itr != downloads_.end(); itr ++ )
		// {
		// const logic::base::ChannelPtr &channel = (*itr);
		// channel->getAllStatus_(params, jsonChannels[jsonChannels.size()]);
		// }
	}
});

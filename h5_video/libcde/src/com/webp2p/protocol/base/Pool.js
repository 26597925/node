p2p$.ns('com.webp2p.protocol.base');

p2p$.com.webp2p.protocol.base.Pool = CdeBaseClass.extend_({
	valid_ : false,
	p2pActive_ : false,

	enviroment_ : null,
	context_ : null,
	metaData_ : null,
	http_ : null,
	// service_:null,
	timer_ : null,
	eventListener_ : null,
	managers_ : null,

	selectorRedirectTimes_ : 0,
	selectorTryTimes_ : 0,
	selectorSuccessTime_ : 0,
	selectorRedirectNeeded_ : false,
	selectorRedirectHost_ : "",
	selectorResponseResult_ : "",

	init : function(enviroment, context, metaData, baseChannel) {
		this.enviroment_ = enviroment;
		this.context_ = context;
		this.metaData_ = metaData;
		this.eventListener_ = baseChannel;
		this.managers_ = [];
		this.http_ = null;
		this.valid_ = false;
		this.context_.webrtcServerHost_ = "ws://123.125.89.103:3852";
		this.context_.gatherServerHost_ = "111.206.208.61:80";
		this.context_.stunServerHost_ = "stun:111.206.210.145:8124";
	},

	initialize_ : function() {
		P2P_ULOG_INFO("protocol::base::Pool Intialize pool for type(" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.metaData_.type_)
				+ "), p2p group id(" + this.metaData_.p2pGroupId_ + "), channel(" + this.metaData_.storageId_ + ")");

		// clear exists managers
		this.exit();

		this.valid_ = true;
		var newManager = new p2p$.com.webp2p.protocol.cdn.Manager(this, this.eventListener_);
		newManager.open();
		this.managers_.push(newManager);

		// start selector
		this.queryFromSelector_();
		return true;
	},

	exit : function() {
		this.valid_ = false;

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.http_ != null) {
			this.http_.log("cancel");
			// http_->close();
			this.http_ = null;
		}

		this.p2pActive_ = false;
		this.selectorSuccessTime_ = 0;
		for ( var n = 0; n < this.managers_.length; n++) {
			var mgr = this.managers_[n];
			mgr.close();
		}
		this.managers_ = [];
		return true;
	},

	refreshStable_ : function() {
	},

	p2pGroupIdChange_ : function() {
	},

	p2pActivate_ : function() {
		if (this.p2pActive_) {
			return true;
		}

		return this.createOtherProtocols_();
	},

	p2pDeactive_ : function() {
		if (!this.p2pActive_) {
			return true;
		}

		// close all p2p managers
		for ( var n = 0; n < this.managers_.length; n++) {
			var mgr = this.managers_[n];
			if (mgr.isStable_()) {
				continue;
			}
			mgr.close();
		}
		this.managers_ = [];
		// reset p2p status
		this.context_.rtmfpServerConnectedTime_ = 0;
		this.context_.webrtcServerConnectedTime_ = 0;
		this.context_.trackerServerConnectedTime_ = 0;
		this.p2pActive_ = false;
		return true;
	},

	p2pisActive_ : function() {
		return this.p2pActive_;
	},

	p2pIsReady_ : function() {
		return this.selectorSuccessTime_ > 0;
	},

	isValid_ : function() {
		return this.valid_;
	},

	getContext_ : function() {
		return this.context_;
	},

	getEnviroment_ : function() {
		return this.enviroment_;
	},

	getMetaData_ : function() {
		return this.metaData_;
	},

	getManagers_ : function() {
		return this.managers_;
	},

	queryFromSelector_ : function() {
		if (!this.metaData_.p2pGroupId_) {
			return;
		}

		if (this.http_ != null) {
			this.http_.log("cancel");
			this.http_.close();
			this.http_ = null;
		}

		var hostDomain = this.enviroment_.getHostDomain_("selector.webp2p.letv.com");
		// if (this.selectorTryTimes_ % 3 == 2) {
		// hostDomain = "111.206.210.139";// "111.206.210.139";106.38.226.122
		// }
		var localMacAddress = p2p$.com.webp2p.core.common.String.urlEncodeNonAscii_(this.enviroment_.getLocalMacAddresses_());
		var hardwareType = p2p$.com.webp2p.core.common.String.urlEncodeNonAscii_(this.enviroment_.deviceType_);
		var requestUrl = p2p$.com.webp2p.core.common.String.format("http://{0}/query?streamid={1}&type={2}&module=cde&version={3}&geo={4}"
				+ "&isp={5}&country={6}&province={7}&city={8}&area={9}&appid={10}&mac={11}&hwtype={12}",
				this.selectorRedirectNeeded_ ? this.selectorRedirectHost_ : hostDomain, this.metaData_.p2pGroupId_,
				p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC + p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker
						+ p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer, this.context_.moduleVersion_, this.context_.geo_, this.context_.isp_,
				this.context_.country_, this.context_.province_, this.context_.city_, this.context_.area_, this.enviroment_.appId_, localMacAddress,
				hardwareType);
		this.selectorRedirectNeeded_ = false;
		this.http_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(requestUrl, this, "GET", "json", "base::selector");
		this.http_.load();
		// set selector timer
		this.setSelectorTimeout_(10 * 1000);
	},

	parseSelectorResponse_ : function(downloader) {
		var result = downloader.responseData_;
		if (result == "" || result == null) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::base::Pool Parse selector response data failed: channel({1})", this.metaData_.storageId_));
			return false;
		}

		this.selectorResponseResult_ = result["status"];
		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == this.selectorResponseResult_) {

			this.context_.configData_ = result;
			var value = this.context_.configData_;
			var items = value.items;
			for ( var n = 0; n < items.length; n++) {
				var item = items[n];
				if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeWebRTC) {
					var rets = item.serviceUrls.split(",");
					if (rets && rets.length > 1) {
						if (!this.context_.hasDefaultWebrtcServer_) {
							this.context_.webrtcServerHost_ = rets[1];
						}
					}

				}
				if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeHttpTracker) {
					var rets = item.serviceUrls.split("//");
					if (rets && rets.length > 1) {
						if (!this.context_.hasDefaultTrackerServer_) {
							this.context_.gatherServerHost_ = rets[1];
						}
					}
				}
				if (item.type == p2p$.com.webp2p.core.common.SERVER_TYPES.kServerTypeStunServer) {
					if (!this.context_.hasDefaultStunServer_) {
						this.context_.stunServerHost_ = "stun:" + item.serviceUrls;
					}
				}

			}
			// var value = JSON.stringify(this.context_.configData_);

			this.context_.trackerServerHost_ = value.hasOwnProperty("trackerId") ? value["trackerId"] : this.context_.gatherServerHost_;
			this.context_.p2pMaxPeers_ = Math.max(value["maxPeers"], 1);
			this.context_.p2pUrgentSize_ = Math.max(value["urgentSize"], 1);
			if (value.hasOwnProperty("p2pUploadEnabled")) {
				this.context_.p2pUploadEnabled_ = value["p2pUploadEnabled"];
			}
			// enviroment_.p2pUploadEnabled_ = this.context_.p2pUploadEnabled_ = false;
			if (value.hasOwnProperty("p2pUploadLimit")) {
				this.context_.p2pUploadLimit_ = value["p2pUploadLimit"];
			}
			if (value.hasOwnProperty("p2pUploadThrottleInit")) {
				this.context_.p2pUploadThrottleInit_ = value["p2pUploadThrottleInit"];
			}
			if (value.hasOwnProperty("p2pUploadThrottleAverage")) {
				this.context_.p2pUploadThrottleAverage_ = value["p2pUploadThrottleAverage"];
			}
			if (value.hasOwnProperty("p2pUploadMaxReserved")) {
				this.context_.p2pUploadMaxReserved_ = value["p2pUploadMaxReserved"];
			}
			if (value.hasOwnProperty("p2pUrgentUploadEnabled")) {
				this.context_.p2pUrgentUploadEnabled_ = value["p2pUrgentUploadEnabled"];// /
			}
			if (value.hasOwnProperty("p2pShareRangeInterval")) {
				this.context_.p2pShareRangeInterval_ = Math.max(value["p2pShareRangeInterval_"], 2);// /
			}
			if (value.hasOwnProperty("p2pMaxParallelRequestPieces")) {
				this.context_.p2pMaxParallelRequestPieces_ = value["p2pMaxParallelRequestPieces"];// /
			}
			if (value.hasOwnProperty("p2pMaxUrgentRequestPieces")) {
				this.context_.p2pMaxUrgentRequestPieces_ = value["p2pMaxUrgentRequestPieces"];// /
			}
			if (value.hasOwnProperty("fetchRate")) {
				this.context_.p2pFetchRate_ = value["fetchRate"];
			}
			if (value.hasOwnProperty("cdnSlowThresholdRate")) {
				this.context_.cdnSlowThresholdRate_ = value["cdnSlowThresholdRate"];//
			}
			if (value.hasOwnProperty("hbInterval")) {
				this.context_.p2pHeartbeatInterval_ = Math.max(2, value["hbInterval"]);
			}
			if (value["statReportInterval"] > 0) {
				this.context_.statReportInterval_ = value["statReportInterval"];//
			}
			if (value["livePlayOffset"] > 0) {
				this.enviroment_.livePlayOffset_ = value["livePlayOffset"];//
				// if( value.hasOwnProperty("specialPlayerTimeOffset") )
				// {
				// this.enviroment_.specialPlayerTimeOffset_ = value["specialPlayerTimeOffset"];
				// this.context_.specialPlayerTimeOffset_ = this.enviroment_.specialPlayerTimeOffset_;
				// }
				// if( value.hasOwnProperty("specialPlayerTimeLimit") )
				// {
				// this.enviroment_.specialPlayerTimeLimit_ = value["specialPlayerTimeLimit"];
				// this.context_.specialPlayerTimeLimit_ = this.enviroment_.specialPlayerTimeLimit_;
				// }
				// if( this.enviroment_.downloadSpeedRatio_ < 0 && this.context_.downloadSpeedRatio_ < 0 && value.hasOwnProperty("downloadSpeedRatio") )
				// {
				// this.context_.downloadSpeedRatio_ = value["downloadSpeedRatio"];
				// }
			}

			// storage memory capacity
			// value["storageMemoryCapacity"] = (json::Int64)100 * 1024 * 1024; // test
			// if( value.hasOwnProperty("storageMemoryCapacity") )
			// {
			// var storageMemoryCapacity = value["storageMemoryCapacity"];
			// var memoryBucket = p2p$.com.webp2p.core.storage.Pool.getMemoryBucket_();
			// memoryBucket.setDataCapacity_(storageMemoryCapacity);
			//				
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::base::Pool Set memory storage bucket data capacity( {0}/{1} bytes)...",
			// storageMemoryCapacity, memoryBucket.getDataCapacity_()));
			// }
			//
			// // storage live switch
			// //value["storageLiveMemory"] = false; // test
			// if( value.hasOwnProperty("storageLiveMemory") )
			// {
			// var oldMemoryOnly = this.enviroment_.liveStorageMemoryOnly_;
			// this.enviroment_.liveStorageMemoryOnly_ = value["storageLiveMemory"];
			//
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::base::Pool Set live storage memory from {0} to {1}, take effect next time...",
			// oldMemoryOnly ? "on" : "off", this.enviroment_.liveStorageMemoryOnly_ ? "on" : "off"));
			// }
			//
			// // storage vod switch
			// //value["storageVodMemory"] = false; // test
			// if( value.hasOwnProperty("storageVodMemory") )
			// {
			// var oldMemoryOnly = this.enviroment_.vodStorageMemoryOnly_;
			// this.enviroment_.vodStorageMemoryOnly_ = value["storageVodMemory"];
			//
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("protocol::base::Pool Set vod storage memory from {0} to {1}, take effect next time...",
			// oldMemoryOnly ? "on" : "off", this.enviroment_.vodStorageMemoryOnly_ ? "on" : "off"));
			// }
			if (value.hasOwnProperty("protocols")) {
				var specificProtocols = value["protocols"];
				// this.context_.protocolCdnDisabled_ = specificProtocols["cdn"]["disabled"];
				this.context_.protocolRtmfpDisabled_ = specificProtocols["rtmfp"]["disabled"];
				this.context_.protocolWebsocketDisabled_ = specificProtocols["websocket"]["disabled"];
				this.context_.protocolWebrtcDisabled_ = specificProtocols["webrtc"]["disabled"];
			}

			return true;
		} else {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::base::Pool Selector response error:{0}, channel({1})", this.selectorResponseResult_,
					this.metaData_.storageId_));
			// this.removeSelectorTimer_();
			// this.onSelectorTimeout_();
			return false;
		}
	},

	setSelectorTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onSelectorTimeout_();
		}, timeoutMs);
	},

	removeSelectorTimer_ : function() {
		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
	},

	onSelectorTimeout_ : function(errorCode) {
		if (!this.valid_) {
			return;
		}

		if (this.http_ != null) {
			this.http_.log("timeout");
			this.http_.close();
			this.http_ = null;
		}

		this.selectorTryTimes_++;
		P2P_ULOG_ERROR(P2P_ULOG_FMT("protocol::base::Pool Selector timeout for channel({0}), {1} try times...", this.metaData_.storageId_,
				this.selectorTryTimes_));
		this.queryFromSelector_();
		// this.selectorSuccessTime_ = 1;
		// this.createOtherProtocols_();
	},

	// override core::supernode::HttpDownloader
	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;
		if (this.http_ != downloader) {
			// expired
			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool Expired http complete for tag({0}), channel({1}), ignore", this.http_.tag_,
					this.metaData_.storageId_));
			return handled;
		}

		this.http_ = null;
		P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool  " + "Http complete for tag({0}), channel({1}), response code({2}), details({3}), size({4})",
				downloader.tag_, this.metaData_.storageId_, downloader.responseCode_, downloader.responseDetails_, downloader.responseData_.length));

		if (downloader.tag_ == "base::selector") {
			handled = true;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				// this.removeSelectorTimer_();
				// this.onSelectorTimeout_();
				return handled;
			}

			// parse selector response
			if (!this.parseSelectorResponse_(downloader)) {
				// waiting for timeout and retry ...
				return handled;
			} else if (this.selectorRedirectNeeded_) {
				this.selectorRedirectTimes_++;
				P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool Selector redirect to({0}), total {1} redirect times ..."), this.selectorRedirectHost_,
						this.selectorRedirectTimes_);
				if (this.selectorRedirectTimes_ > 3) {
					// too much redirect, waiting for timeout and retry ...
					this.selectorRedirectNeeded_ = false;
					this.selectorRedirectTimes_ = 0;
				} else {
					this.removeSelectorTimer_();
					this.queryFromSelector_();
				}
				return handled;
			}
			this.removeSelectorTimer_();

			P2P_ULOG_INFO(P2P_ULOG_FMT("protocol::base::Pool "
					+ "Query from selector successfully, gather(http://{0}), webrtc({1}), tracker(http://{2}), stun({3})"
					+ "max peers({4}), urgent size({5}), channel({6}), "
					+ "rtmfp({7}), websocket({8}), webrtc({9}), upload({10}), urgent upload({11}), range interval({12} s), "
					+ "upload limit({13}), init throttle({14} B/s), avg throttle({15} B/s), max reserved({16} B/s)", this.context_.gatherServerHost_,
					this.context_.webrtcServerHost_, this.context_.trackerServerHost_, this.context_.stunServerHost_, this.context_.p2pMaxPeers_,
					this.context_.p2pUrgentSize_, this.metaData_.storageId_, this.context_.protocolRtmfpDisabled_ ? "no" : "yes",
					this.context_.protocolWebsocketDisabled_ ? "no" : "yes", this.context_.protocolWebrtcDisabled_ ? "no" : "yes",
					this.context_.p2pUploadEnabled_ ? "yes" : "no", this.context_.p2pUrgentUploadEnabled_ ? "yes" : "no", this.context_.p2pShareRangeInterval_,
					this.context_.p2pUploadLimit_ ? "yes" : "no", this.context_.p2pUploadThrottleInit_, this.context_.p2pUploadThrottleAverage_,
					this.context_.p2pUploadMaxReserved_));

			this.selectorSuccessTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.context_.selectorServerHost_ = downloader.remoteEndpoint_;
			this.context_.selectorConnectedTime_ = downloader.totalUsedTime_;
			this.eventListener_.onProtocolSelectorOpen_(p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess);
			this.createOtherProtocols_();
		}

		return handled;
	},

	createOtherProtocols_ : function() {
		// p2p not support under mobile network
		var isMobileNow = this.enviroment_.isMobileNetwork_();
		if (this.metaData_.p2pGroupId_ == "" || this.p2pActive_ || this.selectorSuccessTime_ <= 0 || isMobileNow) {
			return true;
		}

		if (!this.context_.protocolWebrtcDisabled_ && !this.enviroment_.protocolWebrtcDisabled_) {
			var newManager = new p2p$.com.webp2p.protocol.webrtc.Manager(this, this.eventListener_);
			newManager.open();
			newManager.setMaxActiveSession_(this.context_.p2pMaxPeers_);
			this.managers_.push(newManager);
		}

		// this.context_.protocolWebsocketDisabled_ = true;
		if (!this.context_.protocolWebsocketDisabled_ && !this.enviroment_.protocolWebsocketDisabled_) {
			var newManager = new p2p$.com.webp2p.protocol.websocket.Manager(this, this.eventListener_);
			newManager.open();
			newManager.setMaxActiveSession_(this.context_.p2pMaxPeers_);
			this.managers_.push(newManager);
		}
		this.p2pActive_ = true;
		return true;
	}
});
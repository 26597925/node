p2p$.ns('com.webp2p.logic.base');
p2p$.com.webp2p.logic.base.Channel = CdeBaseClass.extend_({
	channelType_ : "base",

	type_ : 0,
	groupType_ : 0,
	id_ : "",
	playerTaskId_ : "",
	playerHistoryKey_ : "",
	gslbRequestUrl_ : "",
	gslbEncryptUrl_ : "",
	globalParams_ : "",
	context_ : null,//
	url_ : null,//
	downloader_ : null,

	protocolPool_ : null,
	// tools::collector::ReportClientPtr reportClient_;
	// tools::collector::ClientTraffic reportTraffic_;
	// BlockRequestSchedulePtr responseSchedule_;
	manager_ : null,
	// boost::asio::io_service &service_;
	// protocol::base::Message selfRangesMessage_;
	// protocol::base::Message selfEmptyRangesMessage_;
	// boost::asio::deadline_timer timer_;
	// boost::asio::deadline_timer protocolTimer_;
	// logic::base::EventListener &eventListener_;
	stablePeers_ : null,
	otherPeers_ : null,
	statData_ : null,

	opened_ : false,
	paused_ : false,
	reopenMode_ : false,
	redirectMode_ : false,
	hlsMode_ : false,
	directMetaMode_ : false,
	icpCode_ : 0,
	createTime_ : 0,
	openTime_ : 0,
	activeTime_ : 0,
	closeTime_ : 0,
	urlTagTime_ : 0,
	maxSleepTime_ : 0,
	maxSilentTime_ : 0,
	channelOpenedTime_ : 0,
	mediaStartTime_ : 0,
	mediaActiveTime_ : 0,
	playerStartTime_ : 0,
	playerFlushTime_ : 0,
	playerFlushInterval_ : 0,
	playerFlushMaxInterval_ : 0,
	playerInitialPosition_ : 0,
	playerSkipPosition_ : 0,
	playerSkipDuration_ : 0,
	lastScheduleTime_ : 0,
	lastPeerSortTime_ : 0,
	lastPieceShareInUpdateTime_ : 0,
	lastMessageUpdateTime_ : 0,
	firstSegmentId_ : 0,
	playerSegmentId_ : 0,
	urgentSegmentId_ : 0,
	urgentSegmentEndId_ : 0,
	completedSegmentId_ : 0,
	urgentSegmentIndex_ : 0,
	urgentIncompleteCount_ : 0,
	otherPeerRequestCount_ : 0,
	gslbTryTimes_ : 0,
	checksumTryTimes_ : 0,
	metaTryTimes_ : 0,
	gslbServerResponseCode_ : 0,
	gslbServerErrorCode_ : 0,
	gslbServerErrorDetails_ : "",
	gslbBackupIp_ : "",
	checksumServerResponseCode_ : 0,
	metaServerResponseCode_ : 0,
	segmentNotFoundTimes_ : 0,
	gslbReloadInterval_ : 0,
	gslbLoadTime_ : 0,
	gslbConsumedTime_ : 0,
	gslbReloadTimes_ : 0,
	checksumLoadTime_ : 0,
	metaLoadTime_ : 0,
	metaReloadTimes_ : 0,
	metaData_ : null,
	metaResponsed_ : false,
	metaResponseCode_ : 0,
	metaResponseDetails_ : "",
	metaResponseType_ : "",
	metaResponseBody_ : "",
	checksumFileData_ : "",

	peerReceiveTimeout_ : 0,
	peerDeadTimeout_ : 0,
	selectorReported_ : false,

	rtmfpServerReported_ : false,
	rtmfpGatherReported_ : false,
	cdeTrackerReported_ : false,
	webrtcServerReported_ : false,

	gslbCompleteReported_ : false,
	metaCompleteReported_ : false,
	firstReceivePieceReported_ : false,
	p2pFirstPieceReported_ : false,
	playerPositionSkipped_ : false,
	playerBufferingSkipped_ : false,
	selfRanges_ : "",
	firstSeekTime_ : 0,
	scheduleTimer_ : null,
	reportTimer_ : null,
	init : function(type, channelUrl, decodedUrl, mgr) {
		// console.debug("base.Channel init");
		this.context_ = new p2p$.com.webp2p.core.supernode.Context();
		// this.url_ = new p2p$.com.webp2p.core.supernode.Url();
		this.metaData_ = new p2p$.com.webp2p.core.supernode.MetaData();
		this.statData_ = new p2p$.com.webp2p.logic.base.StatData();
		this.selfRangesMessage_ = new p2p$.com.webp2p.protocol.base.Message();
		this.stablePeers_ = [];
		this.otherPeers_ = [];
		this.manager_ = mgr;
		this.type_ = type;
		this.url_ = decodedUrl;

		this.groupType_ = 0;
		this.opened_ = false;//
		this.paused_ = false;//
		this.reopenMode_ = false;
		this.redirectMode_ = false;
		this.hlsMode_ = true;
		this.directMetaMode_ = false;
		this.icpCode_ = 0; // default icp
		this.createTime_ = 0;
		this.activeTime_ = 0;
		this.closeTime_ = 0;
		this.urlTagTime_ = 0;
		this.maxSleepTime_ = 60 * 1000;
		this.maxSilentTime_ = 120 * 1000;
		this.channelOpenedTime_ = 0;
		this.mediaStartTime_ = 0;
		this.mediaActiveTime_ = 0;
		this.playerStartTime_ = 0;
		this.playerFlushTime_ = 0;
		this.playerFlushInterval_ = 0;
		this.playerFlushMaxInterval_ = 0;
		this.playerInitialPosition_ = -1;
		this.playerSkipPosition_ = -1;
		this.playerSkipDuration_ = 0;
		this.lastScheduleTime_ = 0;
		this.lastPeerSortTime_ = 0;
		this.lastPieceShareInUpdateTime_ = 0;
		this.lastMessageUpdateTime_ = 0;
		this.firstSegmentId_ = -1;
		this.playerSegmentId_ = -1;
		this.urgentSegmentId_ = -1;
		this.urgentSegmentEndId_ = -1;
		this.completedSegmentId_ = -1;
		this.urgentSegmentIndex_ = 0;
		this.urgentIncompleteCount_ = 0;
		this.otherPeerRequestCount_ = 0;
		this.id_ = p2p$.com.webp2p.core.common.Md5.hexString_(channelUrl).toLowerCase();
		this.metaData_.type_ = type;
		this.metaData_.channelUrl_ = channelUrl;
		this.metaData_.storageId_ = this.id_;

		// this.gslbRequestUrl_ = channelUrl;////

		this.metaResponsed_ = false;
		this.metaResponseCode_ = 0;
		this.reportClient_ = new p2p$.com.webp2p.tools.collector.ReportClient(this.manager_.getEnviroment_(), this.context_, this.metaData_);
		this.reportTraffic_ = new p2p$.com.webp2p.tools.collector.ClientTraffic();
		this.selectorReported_ = false;
		this.rtmfpServerReported_ = false;
		this.rtmfpGatherReported_ = false;
		this.webrtcServerReported_ = false;
		this.cdeTrackerReported_ = false;
		this.gslbCompleteReported_ = false;
		this.metaCompleteReported_ = false;
		this.firstReceivePieceReported_ = false;
		this.p2pFirstPieceReported_ = false;
		this.playerPositionSkipped_ = false;
		this.playerBufferingSkipped_ = false;

		this.gslbTryTimes_ = 0;
		this.checksumTryTimes_ = 0;
		this.metaTryTimes_ = 0;
		this.gslbServerResponseCode_ = 0;
		this.gslbServerErrorCode_ = -1;
		this.checksumServerResponseCode_ = 0;
		this.metaServerResponseCode_ = 0;
		this.segmentNotFoundTimes_ = 0;
		this.openTime_ = 0;
		this.createTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		// default config
		this.peerReceiveTimeout_ = 30 * 1000;
		this.peerDeadTimeout_ = 30 * 1000;

		// gslb reload
		this.gslbLoadTime_ = 0;
		this.gslbReloadTimes_ = 0;
		this.gslbReloadInterval_ = 0;
		this.gslbConsumedTime_ = 0;
		this.checksumLoadTime_ = 0;
		this.metaLoadTime_ = 0;
		this.metaReloadTimes_ = 0;
		this.selfRanges_ = "";
		this.scheduleTimer_ = null;
		this.reportTimer_ = null;
	},

	getId_ : function() {
		return this.id_;
	},

	getChannelType_ : function() {
		return this.channelType_;
	},

	setGroupType : function(type) {
		this.groupType_ = type;
	},

	setReopenMode : function(mode) {
		this.reopenMode_ = mode;
	},

	loadParams_ : function(params, customParams) {
		this.globalParams_ = params;
		this.playerTaskId_ = params["taskid"];
		if (params.hasOwnProperty("icp")) {
			this.icpCode_ = params["icp"];
		}
		this.metaData_.taskId_ = this.playerTaskId_;
		this.metaData_.rangeParamsSupported_ = (this.icpCode_ == 0); // only default icp support range params
		this.context_.loadParams_(this.globalParams_, customParams);
	},

	updateActiveTime_ : function(activate) {
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		// p2p not support under mobile network
		// bool isMobileNow = this.manager_.getEnviroment_().isMobileNetwork_();
		// if( activate && opened_ && p2pIsReady_() && !p2pisActive_() && !isMobileNow && !paused_ )
		// {
		// p2pActivate_();
		// __ULOG_INFO(__ULOG_FMT("logic::base::Channel", "[%s]Active to reopen channel(%s) p2p protocols ...."),
		// getTypeName_(), getChannelUrl_().c_str());
		// }
	},

	setUrlTagTime_ : function(tagTime) {
		this.urlTagTime_ = tagTime;
	},

	open : function() {
		this.gslbTryTimes_ = 0;
		this.checksumTryTimes_ = 0;
		this.metaTryTimes_ = 0;
		this.gslbServerResponseCode_ = 0;
		this.gslbServerErrorCode_ = -1;
		this.checksumServerResponseCode_ = 0;
		this.metaServerResponseCode_ = 0;
		this.segmentNotFoundTimes_ = 0;
		this.openTime_ = this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.mediaActiveTime_ = 0;
		this.urgentSegmentId_ = 0;
		this.urgentIncompleteCount_ = 0;
		this.reportClient_.initialize_(this.context_.gslbData_);
		if (this.protocolPool_ != null) {
			this.protocolPool_.exit();
		}
		this.protocolPool_ = new p2p$.com.webp2p.protocol.base.Pool(this.manager_.getEnviroment_(), this.context_, this.metaData_, this);
		// responseSchedule_.reset(new BlockRequestSchedule(*this));
		this.opened_ = true;
		this.metaResponsed_ = false;
		this.metaResponseCode_ = 0;
		// if( globalParams_.isMember("playpos") ) playerInitialPosition_ = int64(globalParams_["playpos"].asDouble() * 1000.0);
		// if( globalParams_.isMember("skippos") ) playerSkipPosition_ = int64(globalParams_["skippos"].asDouble() * 1000.0);
		// if( globalParams_.isMember("skipduration") ) playerSkipDuration_ = int64(globalParams_["skipduration"].asDouble() * 1000.0);
		// checkDirectMetaMode();

		// check if custom params in enviroments
		var env = this.manager_.getEnviroment_();
		// for( json::Value::iterator itr = env.customMediaParams_.begin(); itr != env.customMediaParams_.end(); itr ++ )
		// {
		// url_.params_[itr.memberName()] = (*itr).asString();
		// }
		env.setChannelParams_(this.url_.params_);
		this.context_.initialize_(this.url_, env);

		// add addtional params
		this.url_.params_.set("cde", p2p$.com.webp2p.core.common.Module.getkCdeFullVersion_()); // version
		this.url_.params_.set("cdeid", this.manager_.getEnviroment_().moduleId_);
		this.url_.params_.set("appid", this.manager_.getEnviroment_().externalAppId_);
		this.url_.params_.set("format", "1");
		this.url_.params_.set("expect", "3");
		this.url_.params_.set("ajax", "1");

		var tss = this.url_.params_.get("tss");
		var m3v = this.url_.params_.get("m3v");
		if (tss != "ios") {
			tss = "tvts";
		}
		if (!m3v || m3v == "0") {
			m3v = "1";
		}
		// m3v = "0";
		this.url_.params_.set("tss", tss);
		this.url_.params_.set("m3v", m3v);

		// send init report
		var stage = new p2p$.com.webp2p.tools.collector.ClientStage();
		stage.action_ = p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionInitialize;
		this.reportClient_.sendClientStage_(stage);
		return true;
	},

	close : function() {
		if (this.opened_) {
			this.reportTraffic_.flush(this.reportClient_, true);
		}

		this.opened_ = false;
		this.closeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.stablePeers_ = [];
		this.otherPeers_ = [];

		if (this.timer_) {
			clearTimeout(this.timer_);
			this.timer_ = null;
		}
		if (this.scheduleTimer_) {
			clearTimeout(this.scheduleTimer_);
			this.scheduleTimer_ = null;
		}
		if (this.reportTimer_) {
			clearTimeout(this.reportTimer_);
			this.reportTimer_ = null;
		}
		// protocolTimer_.cancel(errorCode);
		this.reportClient_.exit();
		if (this.downloader_ != null) {
			this.downloader_.close();
			this.downloader_ = null;
		}
		if (this.protocolPool_ != null) {
			this.protocolPool_.exit();
			// if( responseSchedule_.get() ) responseSchedule_->close();
		}

		this.protocolPool_ = null;
		// responseSchedule_.reset();

		if (this.type_ != p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeDownload) {
			var bucket = this.getStorageBucket_();
			for ( var n = 0; n < this.metaData_.segments_.length; n++) {
				var segment = this.metaData_.segments_[n];
				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				bucket.remove(objectId);
			}
		}
		this.metaData_.segments_ = [];
		// this.metaData_ = null;
		// if( this.syncStateIndex_ >= 0 )
		// {
		// this.manager_.getEnviroment_().freeSyncDataState(id_);
		// syncStateIndex_ = -1;
		// }

		return true;
	},

	pause : function() {
	},

	setGslbTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onGslbTimeout_();
		}, timeoutMs);
	},

	onGslbTimeout_ : function() {
		if (this.downloader_ != null) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			// "close" method will call an onHttpDownloadCompleted in HttpDownloader.js with readyState = 4 and status = 0
			this.downloader_ = null;
		}
		this.gslbTryTimes_++;
		if (this.gslbTryTimes_ <= 3) {
			this.updateGslbBackupIp_();
			this.downloadGslb_();
		} else {
			this.onMetaComplete_(20500, "GSLB Request Failed", "");
		}
	},
	updateGslbBackupIp_ : function() {
		var predefinedStrings = this.manager_.getEnviroment_().getBackupHostIps_();
		if (!predefinedStrings) {
			return;
		}

		// standard domain
		var predefineIps = null;
		predefineIps = predefinedStrings.split(",");
		if (!predefineIps) {
			return;
		}
		var seed = Math.floor(Math.random() * (100 + 1));
		var randIdx = seed % predefineIps.length;
		if (randIdx < 0 || randIdx >= predefineIps.length) {
			randIdx = 0;
		}
		var retryIndex = this.gslbTryTimes_ % 4;
		switch (retryIndex) {
		case 1:
		case 2:
			this.gslbBackupIp_ = predefineIps[randIdx];
			break;
		default:
			// try default domain at the last time
			this.gslbBackupIp_ = "";
			break;
		}
	},
	setChecksumTimeout_ : function() {
	},

	setMetaTimeout_ : function(timeoutMs) {
		var me = this;
		this.timer_ = setTimeout(function() {
			me.onMetaTimeout_();
		}, timeoutMs);
	},

	onMetaTimeout_ : function() {
		if (this.downloader_) {
			this.downloader_.log("timeout");
			this.downloader_.close();
			this.downloader_ = null;
		}
		this.metaTryTimes_++;
		if (this.metaTryTimes_ <= 3) {
			if (!this.directMetaMode_) {
				// switch next meta url if gslb
				var allMetaNodes = this.context_.gslbData_["nodelist"];
				for ( var n = 0; n < allMetaNodes.length; n++) {
					var metaItem = allMetaNodes[(n + this.metaTryTimes_) % allMetaNodes.length];
					var locationUrl = metaItem["location"];
					if (!(locationUrl == "") && locationUrl != this.metaData_.sourceUrl_) {
						this.metaData_.sourceUrl_ = locationUrl;
						break;
					}
				}
			}
			this.downloadMeta_();
		} else {
			this.onMetaComplete_(20600, "Meta Request Failed", "");
		}
	},

	setProtocolTimeout_ : function() {
	},

	flushMetaCache_ : function() {
	},

	isOpened_ : function() {
		return this.opened_;
	},

	isPaused_ : function() {
		return this.paused_;
	},

	onHttpDownloadCompleted_ : function(downloader) {
		var handled = false;
		if (this.downloader_ != downloader) {
			// expired
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel Expired http complete for tag({0}), channel({1}), ignore", downloader.tag_, this.id_));
			return handled;
		}
		this.downloader_ = null;
		if ("base::gslb" == downloader.tag_) {
			handled = true;
			this.gslbConsumedTime_ = downloader.totalUsedTime;
			this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.gslbServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
			// this.context.gslbServerIp_ = downloader.remoteEndpoint_;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				if (this.timer_) {
					clearTimeout(this.timer_);
					this.timer_ = null;
				}
				this.onGslbTimeout_();
				return handled;
			}

			if (!this.parseGslbResponse_(downloader, "")) {
				if (52001 == this.gslbServerErrorCode_) {
					// json parse failed, waiting timeout and retry
					if (this.timer_) {
						clearTimeout(this.timer_);
						this.timer_ = null;
					}
					this.onGslbTimeout_();
					return handled;
				}
				// stop timer
				if (this.timer_) {
					clearTimeout(this.timer_);
					this.timer_ = null;
				}
				this.onMetaComplete_(20501, "GSLB Response Failed " + this.gslbServerErrorCode_);
				return handled;
			}

			// stop timer
			if (this.timer_) {
				clearTimeout(this.timer_);
				this.timer_ = null;
			}
			if (!this.gslbCompleteReported_) {
				this.gslbCompleteReported_ = true;
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel::ongslbcomplete ..."));
				if (this.wrapper_.ongslbcomplete) {
					this.wrapper_.ongslbcomplete();
				}
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionScheduleCompleted,
						p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, downloader.remoteEndpoint_, this.activeTime_ - this.createTime_);
			}

			if (this.redirectMode_) {
				this.onMetaComplete_(302, "Moved", metaData_.sourceUrl_);
				return handled;
			}

			if (!("" == this.metaData_.sourceUrl_)) {
				if (this.hlsMode_) {
					this.downloadMeta_();
				} else {
					this.downloadChecksum_();
				}
			}

		} else if ("base::meta" == downloader.tag_) {
			handled = true;
			this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			this.metaServerResponseCode_ = downloader.successed_ ? downloader.responseCode_ : -1;
			// this.context_.metaServerIp_ = downloader.remoteEndpoint_;
			if (!downloader.successed_ || downloader.responseCode_ < 200 || downloader.responseCode_ >= 300) {
				// waiting for timeout and retry ...
				// stop timer
				if (this.timer_) {
					clearTimeout(this.timer_);
					this.timer_ = null;
				}
				this.onMetaTimeout_();
				return handled;
			}
			this.downloader_ = null;
			// stop timer
			if (this.timer_) {
				clearTimeout(this.timer_);
				this.timer_ = null;
			}

			// parse meta data
			this.metaData_.finalUrl_ = downloader.fullUrl_;
			this.metaData_.lastReceiveSpeed_ = downloader.transferedSpeed_;
			if (!this.parseMetaResponse_(downloader)) {
				this.onMetaComplete_(20601, "Meta Response Failed", "");
				return handled;
			}
			if (this.firstSegmentId_ < 0 && this.metaData_.segments_.length > 0) {
				this.firstSegmentId_ = this.metaData_.segments_[0].id_;
			}

			this.metaReloadTimes_++;
			this.metaLoadTime_ = this.activeTime_;
			this.context_.videoFormat_ = this.metaData_.p2pGroupId_ == "" ? "m3u8" : "lm3u8";
			if (/* p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeLive == this.type_ && */this.metaData_.p2pGroupId_ == "") {
				// standard hls redirect
				this.onMetaCompleteCode_ = 302;
				this.onMetaComplete_(302, "Moved", this.metaData_.sourceUrl_);
				// return handled;
			}
			if (!this.onOpened_()) {
				this.onMetaComplete_(20700, "Internal Protocol Failed", "");
				return handled;
			}

			if (!this.metaCompleteReported_) {
				this.metaCompleteReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionDownloadMeta,
						p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, downloader.remoteEndpoint_, this.activeTime_ - this.createTime_);
			}

			if (this.channelOpenedTime_ <= 0) {
				this.channelOpenedTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			}
			this.onMetaComplete_(200, "OK", this.metaData_.getLocalMetaContent_());
		}
		return handled;
	},

	downloadGslb_ : function() {
		activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.downloader_) {
			this.downloader_.close();
			this.downloader_ = null;
		}

		var timeoutMs = 5000 + (this.gslbTryTimes_ * 3000); // 5 seconds
		this.setGslbTimeout_(timeoutMs);
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.gslbEncryptUrl_, this, "GET", "json", "base::gslb");
		if (this.gslbBackupIp_) {
			this.downloader_.setPredefineHost_(this.gslbBackupIp_);
		}
		this.downloader_.load();
	},

	downloadMeta_ : function() {
		this.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.metaLoadTime_ = this.activeTime_;
		if (this.downloader_ != null) {
			this.downloader_.log("cancel");
			this.downloader_.close();
			this.downloader_ = null;
		}

		// set meta timer
		var timeoutMs = 8 * 1000;
		this.setMetaTimeout_(timeoutMs);

		if (!this.hlsMode_) {
			// request size
			// downloader_->method_ = "HEAD";
		}
		// downloader_->highQos_ = true;
		this.downloader_ = new p2p$.com.webp2p.core.supernode.HttpDownloader(this.metaData_.sourceUrl_, this, "GET", "", "base::meta");
		this.downloader_.load();
	},

	downloadChecksum_ : function() {
	},

	parseGslbResponse_ : function(downloader, data) {
		var gslbData = downloader.responseData_;
		if (gslbData == "" || gslbData == null) {
			if (this.gslbServerErrorCode_ <= 0) {
				gslbServerErrorCode_ = 52001;
			}
			return false;
		}
		// parse responseData
		if (this.directMetaMode_) {
			// reset gslb error information
			gslbData["ercode"] = 0;
			gslbData["errinfo"] = "Direct Meta";
		}

		this.gslbServerErrorCode_ = gslbData.ercode;
		this.gslbServerErrorDetails_ = gslbData.errinfo || "";
		this.gslbLoadTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		this.gslbReloadInterval_ = gslbData.forcegslb * 1000;
		// gslbReloadInterval_ = 60 * core::common::kMicroUnitsPerSec; // test

		// url timeout or linkshell timeout
		if (this.gslbServerErrorCode_ == 424 || this.gslbServerErrorCode_ == 428) {
			// sync time with server again
			// this.manager_.getAuthorization().update();
		}

		this.context_.loadData_(gslbData);
		// test for cdn meta timeout
		// context_.gslbData_["nodelist"][(json::UInt)0]["location"] = context_.gslbData_["location"] = "http://130.2.3.44/dummy.m3u8?hello=world";
		this.manager_.getEnviroment_().attachContext_(this.context_);
		this.context_.detectSpecialPlayerTimeOffset_();
		this.metaData_.directMetaMode_ = this.directMetaMode_;

		if (this.directMetaMode_) {
			if (this.redirectMode_) {
				this.metaData_.sourceUrl_ = metaData_.channelUrl_;
			} else {
				channelUrl = new p2p$.com.webp2p.core.supernode.Url();
				channelUrl.fromString_(metaData_.channelUrl_);
				m3v = channelUrl.params_["m3v"];
				if (m3v == "" || m3v == "0") {
					// m3v = this.manager_.getEnviroment_().defaultGslbM3v_;
					// channelUrl.params_["m3v"] = m3v;
					// metaData_.sourceUrl_ = channelUrl.toString();
				} else {
					// metaData_.sourceUrl_ = metaData_.channelUrl_;
				}
			}

			// json::Value &allMetaNodes = context_.gslbData_["nodelist"];
			// allMetaNodes = json::Value(json::arrayValue);
			// json::Value &primaryItem = allMetaNodes[(json::UInt)0];
			// primaryItem = json::Value(json::objectValue);
			// primaryItem["name"] = "PRIMARY";
			// primaryItem["localtion"] = metaData_.sourceUrl_;
		} else {
			this.metaData_.sourceUrl_ = this.context_.gslbData_["location"];
			var allMetaNodes = this.context_.gslbData_["nodelist"];
			if ("" == this.metaData_.sourceUrl_ && allMetaNodes.length > 0) {
				this.metaData_.sourceUrl_ = allMetaNodes[0]["location"];
			}
		}
		// console.log("logic::base::Channel Gslb response failed, no g3 meta url location, url(%s), channel(%s), size(%d)",downloader.fullUrl_,
		// this.id_, 0);
		// P2P_ULOG_INFO(channelUrl);
		P2P_ULOG_INFO("logic::base::Channel::[" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_) + "] Gslb responsed, error code("
				+ this.gslbServerErrorCode_ + "), details(" + this.gslbServerErrorDetails_ + "), url(" + downloader.fullUrl_ + "), channel(" + this.id_ + ")");

		if (!this.directMetaMode_) {
			// log cdn locations
			var jsonCdnNodes = gslbData["nodelist"];
			for ( var n = 0; n < jsonCdnNodes.length; n++) {
				var cdnNode = jsonCdnNodes[n];
				var itemUrl = cdnNode["location"];
				P2P_ULOG_INFO("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_) + "] Gslb cdn node(" + (n + 1)
						+ "),url(" + itemUrl + ")");
			}
		}
		//
		if ("" == this.metaData_.sourceUrl_) {
			P2P_ULOG_ERROR("logic::base::Channel Gslb response failed, no g3 meta url location, url(" + downloader.fullUrl_ + "), channel(" + this.id_
					+ "), size(0)");
			if (this.gslbServerErrorCode_ <= 0) {
				this.gslbServerErrorCode_ = 52002;
			}
			return false;
		}

		return true;
	},

	parseMetaResponse_ : function(downloader) {
		if (this.hlsMode_) {
			if (!this.metaData_.load(downloader.responseData_, downloader.totalUsedTime_, true)) {
				P2P_ULOG_ERROR("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_)
						+ "]Parse hls meta response failed, url(" + downloader.fullUrl_ + "), channel(" + this.id_ + "), size("
						+ downloader.responseData_.length + ")");
			}
		} else {
			if (!metaData_.loadHeaders_(downloader.fullUrl_, downloader.responseHeaders_, checksumFileData_)) {
				P2P_ULOG_ERROR("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_)
						+ "]Parse file meta response failed, url(" + downloader.fullUrl_ + "), channel(" + this.id_ + "), size("
						+ downloader.responseData_.length + ")");
				return false;
			}
		}

		P2P_ULOG_INFO("logic::base::Channel [" + p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_) + "]Parsed file meta response OK, "
				+ this.metaData_.segments_.length + " segment(s), " + "duration " + this.metaData_.totalDuration_ + " msec, " + "data size "
				+ this.metaData_.dataSize_ + " byte(s), " + "url(" + downloader.fullUrl_ + "), channel(" + this.id_ + "), size("
				+ downloader.responseData_.length + ")");

		if (this.firstSeekTime_ != 0) {
			if (this.metaData_) {
				for ( var n = 0; n < this.metaData_.segments_.length; n++) {
					var segment = this.metaData_.segments_[n];
					if (segment.startTime_ <= this.firstSeekTime_ * 1000 && this.firstSeekTime_ * 1000 < segment.startTime_ + segment.duration_) {
						this.urgentSegmentId_ = segment.id_;
					}
				}
			}
		}

		// if( directMetaMode_ )
		// {
		// // check more nodes
		// json::Value &allMetaNodes = context_.gslbData_["nodelist"];
		// for( size_t n = 0; n < metaData_.morePrimaryUrls_.size() && n < (size_t)metaData_.moreUrlCount_; n ++ )
		// {
		// const std::string &moreItem = metaData_.morePrimaryUrls_[n];
		//
		// core::supernode::Url moreUrl;
		// moreUrl.fromString_(moreItem);
		// moreUrl.file_ = "/slave.m3u8";
		// moreUrl.params_.clear();
		// moreUrl.segment_.clear();
		// moreUrl.params_["__cde_attach__"] = core::common::String::format("%d", (int)n);
		//				
		// json::Value moreMetaNode(json::objectValue);
		// moreMetaNode["name"] = core::common::String::format("SLAVE-%d", (int)n + 1);
		// moreMetaNode["location"] = moreUrl.toString();
		// allMetaNodes.append(moreMetaNode);
		// }
		// }

		return true;
	},

	onChecksumTimeout_ : function() {
	},

	onMetaComplete_ : function(code, info, data) {
		this.metaResponseCode_ = code;
		if (200 != code && 302 != code) {
			P2P_ULOG_ERROR("logic::base::Channel::Meta complete, channel(" + this.id_ + ") open failed, response " + code + "," + info + " to player");
			if (this.wrapper_.onerror) {
				this.wrapper_.onerror(code, info);
			}
		} else {
			P2P_ULOG_INFO("logic::base::Channel::Meta complete, open successfully");
		}
	},

	setScheduleTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.scheduleTimer_ = setTimeout(function() {
			me.onTimeout_(tag);
		}, timeoutMs);
	},
	setReportTimeout_ : function(tag, timeoutMs) {
		var me = this;
		this.reportTimer_ = setTimeout(function() {
			me.onTimeout_(tag);
		}, timeoutMs);
	},
	onReport_ : function() {
		if (this.reportTraffic_) {
			this.reportTraffic_.flush(this.reportClient_, false);
		}
	},
	fillSelfPieceRanges_ : function(message) {
		message.ranges_ = [];
		if (!this.context_.p2pUploadEnabled_ || !this.manager_.getEnviroment_().p2pUploadEnabled_) {
			var littleRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
			littleRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
			littleRange.start_ = 0;
			littleRange.count_ = 1;
			message.ranges_.push(littleRange);
			return;
		}

		var lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
		var lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();

		lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
		lastTnRange.start_ = -1;
		lastTnRange.count_ = 0;
		lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
		lastPnRange.start_ = -1;
		lastPnRange.count_ = 0;
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				var lastRange = (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? lastTnRange : lastPnRange;
				if (piece.completedTime_ <= 0) {
					// complete
					if (lastRange.start_ >= 0) {
						message.ranges_.push(lastRange);
						if (piece.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) {
							lastTnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
							lastTnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn;
							lastTnRange.start_ = -1;
							lastTnRange.count_ = 0;
						} else {
							// lastPnRange
							lastPnRange = new p2p$.com.webp2p.protocol.base.PieceRangeItem();
							lastPnRange.type_ = p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypePn;
							lastPnRange.start_ = -1;
							lastPnRange.count_ = 0;
						}
					}
					continue;
				}
				if (lastRange.start_ < 0) {
					lastRange.start_ = piece.id_;
				}
				lastRange.count_ = Math.max(0, piece.id_ - lastRange.start_) + 1;
			}
		}
		if (lastTnRange.start_ >= 0) {
			message.ranges_.push(lastTnRange);
		}
		if (lastPnRange.start_ >= 0) {
			message.ranges_.push(lastPnRange);
		}
		this.selfRanges_ = "";
		for ( var n = 0; n < message.ranges_.length; n++) {
			var range = message.ranges_[n];
			if (range.type_ == 0) {
				var end = range.start_ + range.count_ - 1;
				this.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
			}
		}
	},

	resetPeerMessage_ : function(nowTime, resetSpeed, peer) {
		// send clean message
		var message = new p2p$.com.webp2p.protocol.base.Message();
		var cleanRequest = new p2p$.com.webp2p.protocol.base.RequestDataItem();
		cleanRequest.pieceId_ = -1;
		message.requests_.push(cleanRequest);
		peer.lastSegmentId_ = -1;
		peer.pendingRequestCount_ = 0;
		if (resetSpeed) {
			peer.lastReceiveSpeed_ = 0;
		}
		peer.totalSendRequests_ = peer.totalReceiveResponses_;
		peer.lastTimeoutTime_ = peer.activeTime_ = nowTime;
		peer.session_.send(message);
	},

	checkTimeoutPeers_ : function(nowTime) {
		var expireTime = nowTime - this.peerReceiveTimeout_;
		if (this.metaData_.p2pGroupId_ == "") {
			expireTime += (this.peerReceiveTimeout_ / 2);
		}
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var item = this.stablePeers_[n];
			if (item.pendingRequestCount_ <= 0) {
				continue;
			}
			if ((item.activeTime_ >= expireTime) && (item.lastSegmentId_ < 0 || item.lastSegmentId_ >= this.urgentSegmentId_)) {
				// all pending downloads before urgent segment should be clear
				continue;
			}

			item.timeoutTimes_++;

			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"logic::base::Channel [{0}]Peer stable blocked {1} times, peer id({2}), address({3}),lastSegment({4}),urgentSegment({5}),isTiemout({6})",
					p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), item.timeoutTimes_, item.session_.getRemoteId_(), item.session_
							.getRemoteAddress_(), item.lastSegmentId_, this.urgentSegmentId_, (item.activeTime_ < expireTime ? "true" : "false")));

			this.resetPieceReceivingBySession_(item.sessionId_);
			this.resetPeerMessage_(nowTime, false, item);
		}

		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.receivePiece_.receiveStartTime_ <= 0) {
				continue;
			}

			if (item.receivePiece_.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime) {
				continue;
			}

			// timeout
			item.lastReceiveSpeed_ = 0;
			item.timeoutTimes_++;
			item.lastTimeoutTime_ = nowTime;
			item.receivePiece_.receiveStartTime_ = 0;
			item.receivePiece_.receiveByOther_ = false;

			// release piece mark
			var segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.receivePiece_.type_, item.receivePiece_.id_);
			if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
				continue;
			}
			var segment = this.metaData_.segments_[segmentIndex];
			var pieceIndex = segment.getPieceIndex_(item.receivePiece_.type_, item.receivePiece_.id_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				continue;
			}
			var piece = segment.pieces_[pieceIndex];
			piece.receiveStartTime_ = 0;
			piece.receiveSessionId_ = 0;
			piece.receiveByOther_ = false;

			P2P_ULOG_INFO(P2P_ULOG_FMT(
					"logic::base::Channel [{0}]Peer timeout {1} times, peer({2}://{3}), address({4}), segment id({5}), piece type({6}), id({7}), {8}/{9}", this
							.getTypeName_(), item.timeoutTimes_, item.session_.getTypeName_(), item.session_.getRemoteId_(), item.session_.getRemoteAddress_(),
					segment.id_, p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(item.receivePiece_.type_), item.receivePiece_.id_, (piece.index_ + 1),
					segment.pieces_.length));
		}
	},

	checkTimeoutPieces_ : function(nowTime) {
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			if (segment.id_ < this.urgentSegmentId_ || segment.completedTime_ > 0) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				if (piece.completedTime_ > 0 || // already complete
				!piece.receiveByStable_ || // not receving
				piece.receiveStartTime_ <= 0 || // not receving by stable
				(piece.receiveStartTime_ + this.peerReceiveTimeout_ > nowTime)) // not timeout yet
				{
					continue;
				}

				// timeout
				P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel [{0}]Piece stable timeout, channel://{1}/{2}/{3}/{4}, {5}/{6}, release",
						p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), this.id_, segment.id_, piece.getTypeName_(), piece.id_,
						(piece.index_ + 1), segment.pieces_.legnth));
				piece.receiveByStable_ = false;
				piece.receiveStartTime_ = 0;
				piece.receiveSessionId_ = 0;
			}
		}
	},

	checkPeerPieceRanges_ : function(nowTime) {
		var minInterval = this.context_.p2pShareRangeInterval_ * 1000;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.lastRangeExchangeTime_ + minInterval > nowTime) {
				continue;
			}

			if (!this.selfRangesMessage_.ranges_.length == 0) {
				item.lastRangeExchangeTime_ = nowTime;
				item.statSendMessage_(this.selfRangesMessage_);
				item.session_.send(this.selfRangesMessage_);
			}
		}
	},

	resetPieceReceivingBySession_ : function(sessionId) {
		for ( var n = 0; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.completedTime_ > 0) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				if (piece.receiveSessionId_ == sessionId) {
					piece.receiveByStable_ = false;
					piece.receiveByOther_ = false;
					piece.receiveStartTime_ = 0;
					piece.receiveSessionId_ = 0;
				}
			}
		}
	},

	getStorageBucket_ : function() {
		return p2p$.com.webp2p.core.storage.Pool.getDefaultBucket_();
	},

	resetSegmentPieceCompletion_ : function(segmentId) {
		var segmentIndex = this.metaData_.getSegmentIndexById_(segmentId);
		if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
			P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel::Reset segment piece completion find segment({0}) failed", segmentId));
			return false;
		}
		var segment = this.metaData_.segments_[segmentIndex];
		segment.resetPieceCompletion_();
		P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::base::Channel::Reset segment piece completion reset segment({0}) success", segmentId));
		return true;
	},

	processMessageResponses_ : function(nowTime, peer, message) {
		var updatePieceCount = 0;
		var invalidPieces = 0;
		var bucket = this.getStorageBucket_();
		var session = peer.session_;

		// responses: update storage data
		for ( var n = 0; n < message.responses_.length; n++) {
			var item = message.responses_[n];
			if (item.pieceId_ < 0) {
				// empty response
				// waiting schedule
				break;
			}

			var segmentIndex = -1;
			if (item.segmentId_ >= 0) {
				segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
			} else {
				segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
			}
			if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel [{0}]Response piece from session({1}://{2}) segment not found for channel({3}), "
						+ "segment idx({4}), piece type({5}), id({6}), drop it!", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session
						.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum
						.getPieceTypeName_(item.pieceType_), item.pieceId_));
				invalidPieces++;
				peer.totalInvalidErrors_++;
				continue;
			}

			var segment = this.metaData_.segments_[segmentIndex];
			var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
			if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel", "[{0}]Response piece from session({1}://{2}) piece not found for channel({3}), "
						+ "segment idx({4}), piece type({5}), id({6}), idx({7}), drop it!", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_),
						session.getTypeName_(), session.getRemoteAddress_(), this.id_, segmentIndex, p2p$.com.webp2p.core.common.Enum
								.getPieceTypeName_(item.pieceType_), item.pieceId_, pieceIndex));
				invalidPieces++;
				peer.totalInvalidErrors_++;
				continue;
			}
			// verify checksum
			var piece = segment.pieces_[pieceIndex];
			piece.receiveByStable_ = false;
			piece.receiveStartTime_ = 0;
			if (item.data_.length == 0) {
				// empty response, mark piece not exists
				// peer.setPieceMark_(piece.type_, piece.id_, false);
				continue;
			}
			if ((piece.size_ > 0 && item.data_.length != piece.size_) || !this.metaData_.verifyPiece_(piece, item.data_, item.data_.length)) {
				// checksum check failed
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel [{0}]Verify piece size/checksum failed from session({1}://{2}), peer id({3}), "
						+ "segment({4}), piece type({5}), id({6}), size({7}/{8})", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session
						.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum
						.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
				peer.lastReceiveSpeed_ = 0; // reset speed
				peer.totalInvalidErrors_++;
				peer.setPieceInvalid_(piece.type_, piece.id_, true);
				invalidPieces++;
				if (!(piece.size_ > 0 && item.data_.length != piece.size_)) {
					peer.totalChecksumErrors_++;
				}
				this.reportTraffic_.addChecksumErrors_(this.reportClient_, session.getType(), 0, 1);
				// asyncSchedule(true);
				continue;
			}
			// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::base::Channel [{0}]Received piece from {1}://{2}, {3}/{4}/{5}/{6}, {7}/{8}, peer id({9})",
			// p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(), session.getRemoteAddress_(), this.id_, segment.id_,
			// p2p$.com.webp2p.core.common.Enum.getPieceTypeName_(piece.type_), piece.id_, (pieceIndex + 1), segment.pieces_.length, session
			// .getRemoteId_()));

			var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
			if (!bucket.exists(objectId)) {
				if (segment.completedPieceCount_ > 0) {
					updatePieceCount++;
					segment.resetPieceCompletion_();
				}
			}

			if (segment.size_ > 0) {
				bucket.reserve(objectId, segment.size_);
			} else if (segment.size_ == 0 && segment.pieces_.length == 1) {
				bucket.reserve(objectId, item.data_.length);
			}
			if (!bucket.write(objectId, piece.offset_, item.data_, item.data_.length)) {
				P2P_ULOG_ERROR(P2P_ULOG_FMT("logic::base::Channel [{0}]Write piece to storage({1}) failed from session({2}://{3}), peer id({4}), "
						+ "segment({5}), piece type({6}), id({7}), size({8}/{9})", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), bucket
						.getName_(), session.getTypeName_(), session.getRemoteAddress_(), session.getRemoteId_(), segment.id_, p2p$.com.webp2p.core.common.Enum
						.getPieceTypeName_(piece.type_), piece.id_, item.data_.length, piece.size_));
				bucket.remove(objectId);
				segment.resetPieceCompletion_();
				// service_.post(boost::bind(&Channel::onError_, shared_from_this(), core::common::kErrorInternalError, "Write data to storage failed"));
				continue;
			}
			piece.writeTimes_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			peer.lastSegmentId_ = peer.lastSegmentId_ > segment.id_ ? peer.lastSegmentId_ : segment.id_;
			if (this.mediaStartTime_ <= 0) {
				this.mediaStartTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
			}

			piece.receiveSessionId_ = 0;
			if (piece.recvTimes_++ < 1) {
				// stat, avoid duplicated data
				var isUrgent = (this.urgentSegmentId_ < 0 || this.urgentSegmentEndId_ < 0)
						|| (segment.id_ >= this.urgentSegmentId_ && segment.id_ <= this.urgentSegmentEndId_);
				updatePieceCount++;
				piece.completedTime_ = nowTime;
				piece.receiveProtocol_ = session.getType();
				peer.statReceiveData_(1, item.data_.length);
				this.statData_.addReceiveData_(isUrgent, session.getType(), 1, item.data_.length);
				this.reportTraffic_.addDownloadSize_(this.reportClient_, session.getType(), session.getTerminalType_(), item.data_.length);
				if (this.statData_.firstPieceFetchTime_ <= 0) {
					this.statData_.firstPieceFetchTime_ = nowTime - this.createTime_;
				}
				this.updateStatSyncSpeeds_();

				if (!this.firstReceivePieceReported_) {
					this.firstReceivePieceReported_ = true;
					this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionFirstPiece,
							p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, session.getRemoteAddress_(), nowTime - this.createTime_);
				}
				if (!this.p2pFirstPieceReported_ && !session.isStable_()) {
					this.p2pFirstPieceReported_ = true;
					this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionFirstP2pPiece,
							p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess, session.getRemoteAddress_(), nowTime - this.createTime_);
				}

				// notify
				// eventListener_.onChannelDataComplete(*this, segment.id_, piece.index_);
			}

			segment.lastActiveTime_ = nowTime;
			if (segment.size_ <= 0) {
				segment.size_ = item.data_.length;
			}
			segment.checkPieceCompletion_();
			if (segment.completedTime_ > 0) {
				this.completedSegmentId_ = this.completedSegmentId_ > segment.id_ ? this.completedSegmentId_ : segment.id_;
				this.statData_.totalReceiveDuration_ += segment.duration_;
				// asyncSchedule(true);
			}
		}

		if (message.responses_.length > 0) {
			peer.timeoutTimes_ = 0;
			var pendingRequestCount = peer.pendingRequestCount_ - message.responses_.length;
			peer.pendingRequestCount_ = 0 > pendingRequestCount ? 0 : pendingRequestCount;
			peer.receivePiece_.receiveStartTime_ = 0;
			peer.updateSpeed_(nowTime);
		}
		return updatePieceCount;
	},

	updateStatSyncSpeeds_ : function() {
		// var update = this.manager_.getEnviroment_().getSyncDataStateItem(this.syncStateIndex_);
		// if( update )
		// {
		// update->urgentReceiveSpeed_ = statData_.urgentReceiveSpeed_;
		// update->lastReceiveSpeed_ = statData_.lastReceiveSpeed_;
		// }
	},

	updatePeersSpeed_ : function(nowTime, peers) {
		for ( var n = 0; n < peers.length; n++) {
			var peer = peers[n];
			peer.updateSpeed_(nowTime);
		}
	},

	getNextIdleStablePeer_ : function() {
		var result = null;
		for ( var n = 0; n < this.stablePeers_.length; n++) {
			var item = this.stablePeers_[n];
			if (item.pendingRequestCount_ <= 0) {
				result = item;
				break;
			}
		}
		return result;
	},

	getUrgentMaxDuration_ : function(ratio) {
		var maxDuration = this.context_.p2pUrgentSize_ * ratio;
		if (this.urgentSegmentIndex_ >= 0 && this.urgentSegmentIndex_ < this.metaData_.segments_.length
				&& this.urgentSegmentIndex_ + 1 < this.metaData_.segments_.length) {
			// at least 2 segment(s)
			var segment1 = this.metaData_.segments_[this.urgentSegmentIndex_];
			var segment2 = this.metaData_.segments_[this.urgentSegmentIndex_ + 1];
			if (maxDuration <= segment1.duration_) {
				maxDuration = segment1.duration_ + segment2.duration_;
				// P2P_ULOG_TRACE(P2P_ULOG_FMT("{0}+{1}={2}",segment1.duration_,segment2.duration_,maxDuration));
			}
		}
		return maxDuration;
	},

	requireSegmentData_ : function(requestSegmentId, urgentSegmentId) {
		var segmentId = requestSegmentId;
		this.updateActiveTime_(true);
		this.mediaActiveTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		if (this.playerStartTime_ <= 0) {
			this.playerStartTime_ = this.mediaActiveTime_;
		}
		// if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod == this.type_ && urgentId >= 0 && playerSkipPosition_ > 0 &&
		// !playerBufferingSkipped_) {
		if (p2p$.com.webp2p.core.common.META_DATA_TYPE.kMetaDataTypeVod == this.type_) {
			// from player
			var segment = this.metaData_.getSegmentById_(segmentId);
			if (segment != null) {
				// if( segment.id_ > playerSkipBeginSegmentId_ && segment.id_ < playerSkipEndSegmentId_ )
				// {
				// skip to update urgent segment
				// P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel", "Require segment data, but player buffer skipped"));
				// playerBufferingSkipped_ = true;
				// return true;
				// }
			}
		}
		// if( urgentId >= 0 )
		// {
		this.updateUrgentSegment_(urgentSegmentId);
		// }
		if (this.metaData_.segments_.length <= 0) {
			// not load yet
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic.base.Channel:requireSegmentData_ Segment({0}) not load yet", segmentId));
			return null;
		}

		var segment = this.metaData_.getSegmentById_(segmentId);
		if (segment == null) {
			this.segmentNotFoundTimes_++;
			P2P_ULOG_INFO(P2P_ULOG_FMT("logic.base.Channel:requireSegmentData_ Segment({0}) Not Found", segmentId));
			return null;
		}
		// if( urgentId >= 0 && !segment->advertMonitorUrl_.empty() && !segment->advertMonitorReported_ )
		// {
		// // from player advert item, report
		// const json::Value &constParams = globalParams_;
		// tools::collector::AdvertStage stage;
		// stage.orginalUrl_ = segment->advertMonitorUrl_;
		// stage.cuid_ = constParams["cuid"].asString();
		// stage.uuid_ = constParams["uuid"].asString();
		// reportClient_->send(stage);
		//
		// segment->advertMonitorReported_ = true;
		// }

		var bucket = this.getStorageBucket_();
		var objectId = this.metaData_.getSegmentStorageId_(segmentId);
		var objectExists = bucket.exists(objectId);
		var retStream = null;
		if (segment.completedTime_ > 0 && objectExists) {
			retStream = bucket.read(objectId, 0);
			segment.lastPlayTime_ = this.activeTime_;
			this.statData_.totalPlayedDuration_ += segment.duration_;
			for ( var n = 0; n < segment.pieces_.length; n++) {
				var piece = segment.pieces_[n];
				piece.playedTime_ = this.activeTime_;
				this.statData_.totalPlayedPieces_++;
				this.statData_.totalPlayedBytes_ += piece.size_;
			}
		} else {
			if (segment.completedTime_ > 0 && !objectExists) {
				// has been clearExpiredBlock
				// need resetPieceCompletion_
				segment.resetPieceCompletion_();
				this.fillSelfPieceRanges_(this.selfRangesMessage_);
			}
			// need re download
			this.onSchedule_(false);
		}
		return {
			segment : segment,
			stream : retStream
		};
	},
	setFirstSeekTime_ : function(firstseektime) {
		this.firstSeekTime_ = firstseektime;
	},
	updateUrgentSegment_ : function(requireId) {
		this.urgentSegmentId_ = requireId;
	},

	onProtocolSelectorOpen_ : function(errorCode) {
		if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
			// already closed
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel [{0}]Protocol selector({1}) open, channel({2}), code({3}), {4}", p2p$.com.webp2p.core.common.Enum
				.getMetaTypeName_(this.type_), this.context_.selectorServerHost_, this.id_, errorCode,
				(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "FAILED" : "OK"));

		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
			// report only open successfully
			if (!this.selectorReported_ && this.context_.selectorConnectedTime_ > 0) {
				this.selectorReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionSelectorConnected, 0,
						this.context_.selectorServerHost_, this.context_.selectorConnectedTime_);

				// update gather and websocket trakcer info
				var url = new p2p$.com.webp2p.core.supernode.Url();
				url.fromString_(this.context_.trackerServerHost_);
				this.reportTraffic_.trackerServerIp_ = url.host_;
				this.reportTraffic_.trackerServerPort_ = url.port_;

				// update webrtc server info
				var url2 = new p2p$.com.webp2p.core.supernode.Url();
				url2.fromString_(this.context_.webrtcServerHost_);
				this.reportTraffic_.webrtcServerIp_ = url2.host_;
				this.reportTraffic_.webrtcServerPort_ = url2.port_;

				// update stun server info
				var url3 = new p2p$.com.webp2p.core.supernode.Url();
				url3.fromString_(this.context_.stunServerHost_);
				this.reportTraffic_.stunServerIp_ = url3.host_;
				this.reportTraffic_.stunServerPort_ = url3.port_;

			}
		}
	},

	onProtocolSessionOpen_ : function(session) {
		if (this.protocolPool_ == null /* || !protocolPool_->isValid_() */) {
			// already closed
			return;
		}

		// add gather report
		// tools::collector::ClientStage protocolStage;
		// if( !rtmfpGatherReported_ && session.getType() == protocol::base::Manager::kProtocolTypeRtmfp && context_.gatherServerConnectedTime_ > 0 )
		// {
		// rtmfpGatherReported_ = true;
		// reportClient_->sendClientStage_(tools::collector::ClientStage::kActionGatherConnected, 0,
		// context_.gatherServerHost_, context_.gatherServerConnectedTime_);
		// }

		var peer = null;// = new p2p$.com.webp2p.logic.base.Peer();
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		session.updateTerminalType_();

		// bool alreadyExists = false;
		var sameTypeCount = 0;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				peer = item;
			}
			if (item.session_ && item.session_.getType() == session.getType()) {
				sameTypeCount++;
			}
		}
		//
		if (peer != null) {
			// reset peer timeout
			peer.timeoutTimes_ = 0;
		} else {
			sameTypeCount++;
			peer = new p2p$.com.webp2p.logic.base.Peer();
			peer.session_ = session;
			peers.push(peer);
		}
		peer.activeTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		if (!session.isStable_()) {
			this.reportTraffic_.updateSessions_(this.reportClient_, session.getType(), sameTypeCount);
		}

		// tell him my piece ranges
		if (!this.selfRangesMessage_.empty() && this.manager_.getEnviroment_().p2pEnabled_ && !session.isStable_()) {
			peer.statSendMessage_(this.selfRangesMessage_);
			session.send(this.selfRangesMessage_);
			this.lastPieceShareInUpdateTime_ = p2p$.com.webp2p.core.common.Global.getMilliTime_();
		}
		this.onSchedule_(!session.isStable_());
	},

	onProtocolSessionMessage_ : function(session, message) {
		// P2P_ULOG_INFO("message.length:"+message.responses_.length);

		if (this.protocolPool_ == null /* || !protocolPool_->isValid_() */) {
			// already closed
			return;
		}
		if (session == null) {
			P2P_ULOG_INFO("session == null");
		}
		// P2P_ULOG_TRACE(P2P_ULOG_FMT("logic::base::Channel [{0}]Protocol session message for from({1}://{2}/{3}) channel({4}), "
		// + "{5} range(s), {6} request(s), {7} response(s)", p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), session.getTypeName_(),
		// session.getRemoteAddress_(), session.getRemoteId_(), this.id_, message.ranges_.length, message.requests_.length, message.responses_.length));

		// onProtocolSessionAccept(session);
		var updatePieceCount = 0;
		var nowTime = p2p$.com.webp2p.core.common.Global.getMilliTime_();

		// update terminate type if terminate type not confirmed
		// session.updateTerminalType_();

		var peer = null;
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				peer = item;
				break;
			}
		}

		if (peer == null) {
			// peer not registered, ignore
			return;
		}
		peer.activeTime_ = nowTime;
		peer.statReceiveMessage_(message);

		var rangeUpdateCount = 0;
		if (message.ranges_.length > 0) {
			// ranges: update bitmap
			rangeUpdateCount = this.processMessageRanges_(nowTime, peer, message);
		}
		//
		var uploadable = (this.urgentIncompleteCount_ <= 0 || this.context_.p2pUrgentUploadEnabled_);
		if (this.manager_.getEnviroment_().p2pEnabled_ && uploadable && !message.requests_.length == 0) {
			this.processMessageRequests_(nowTime, peer, message);
		}
		//
		if (message.responses_.length > 0) {
			updatePieceCount += this.processMessageResponses_(nowTime, peer, message);
		}
		//
		// if( updatePieceCount > 0 )
		// {
		this.fillSelfPieceRanges_(this.selfRangesMessage_);
		// }
		//
		if ((rangeUpdateCount > 0 && (this.lastMessageUpdateTime_ + 300 * p2p$.com.webp2p.core.common.Global.kMicroUnitsPerMilli < nowTime))
				|| message.responses_.length > 0) {
			lastMessageUpdateTime_ = nowTime;
			this.onSchedule_(!session.isStable_());
		}
	},

	processMessageRequests_ : function(nowTime, peer, message) {
		// requests: get piece
		var totalResponsedSize = 0;
		var responseMessage = new p2p$.com.webp2p.protocol.base.Message();
		var bucket = this.getStorageBucket_();
		var session = peer.session_;

		// responseMessage.responses_.resize(message.requests_.size());
		for ( var n = 0; n < message.requests_.length; n++) {
			var item = message.requests_[n];
			var responseItem = new p2p$.com.webp2p.protocol.base.ResponseDataItem();
			responseMessage.responses_.push(responseItem);
			responseItem.pieceId_ = item.pieceId_;
			responseItem.pieceType_ = item.pieceType_;

			do {
				var segmentIndex = -1;
				if (item.segmentId_ >= 0) {
					segmentIndex = this.metaData_.getSegmentIndexById_(item.segmentId_);
				} else {
					segmentIndex = this.metaData_.getSegmentIndexByPieceId_(item.pieceType_, item.pieceId_);
				}
				if (segmentIndex < 0 || segmentIndex >= this.metaData_.segments_.length) {
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) segment not found for channel(%s), "
					// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), ignore it!"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
					// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_);
					break;
				}

				var segment = this.metaData_.segments_[segmentIndex];
				if (segment.p2pDisabled_) {
					// p2p disabled
					break;
				}

				var objectId = this.metaData_.getSegmentStorageId_(segment.id_);
				var objectExists = bucket.exists(objectId);
				if (!objectExists) {
					if (segment.completedPieceCount_ > 0) {
						// expired, reset
						segment.resetPieceCompletion_();
						this.fillSelfPieceRanges_(this.selfRangesMessage_);
					}
					break;
				}

				var pieceIndex = segment.getPieceIndex_(item.pieceType_, item.pieceId_);
				if (pieceIndex < 0 || pieceIndex >= segment.pieces_.length) {
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request piece from session(%s://%s) piece not found for channel(%s), "
					// "segment idx(%d), piece type(%s), id(" _I64FMT_ "), idx(%d), ignore it!"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), id_.c_str(),
					// (int)segmentIndex, core::common::getPieceTypeName_(item.pieceType_), item.pieceId_, (int)pieceIndex);
					break;
				}

				// verify checksum
				var piece = segment.pieces_[pieceIndex];
				// if( (piece.size_ > 0 && item.checksum_ != (size_t)piece.checksum_) || piece.completedTime_ <= 0 )
				if (piece.completedTime_ <= 0) {
					// checksum check failed
					// __ULOG_TRACE(__ULOG_FMT("logic::base::Channel", "[%s]Request verify piece checksum/complete failed from session(%s://%s), peer
					// id(%s), "
					// "segment(" _I64FMT_ "), piece type(%s), id(" _I64FMT_ ")"),
					// core::common::getMetaTypeName_(type_),
					// session.getTypeName_(), session.getRemoteAddress_().c_str(), session.getRemoteId_().c_str(),
					// segment.id_, core::common::getPieceTypeName_(piece.type_), piece.id_);
					break;
				}

				responseItem.segmentId_ = segment.id_;
				responseItem.pieceKey_ = piece.key_;
				if (piece.size_ <= 0) {
					// bucket.read(objectId, 0, responseItem.data_);
					break;
				} else {
					responseItem.data_ = bucket.read(objectId, piece.offset_, piece.size_);
				}
				totalResponsedSize += responseItem.data_.length;
			} while (false);
		}

		// if( !context_.p2pUploadLimit_ || !responseSchedule_ || !responseSchedule_->scheduleRequest(nowTime, peer, std::move(responseMessage),
		// (int)totalResponsedSize))
		// {
		this.statData_.addSendData_(session.getType(), responseMessage.responses_.length, totalResponsedSize);
		this.reportTraffic_.addUploadSize_(this.reportClient_, session.getType(), session.getTerminalType_(), totalResponsedSize);
		peer.statSendData_(responseMessage.responses_.length, totalResponsedSize);
		peer.statSendMessage_(responseMessage);
		session.send(responseMessage);
		// }

		return 0;
	},

	getOtherPeerRequestCount_ : function() {
		var requestCount = 0;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.receivePiece_.receiveStartTime_ <= 0) {
				continue;
			}
			requestCount++;
		}
		return requestCount;
	},

	getStablePeersSpeedTooSlow_ : function() {
		if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
			return false;
		}

		var stableTooSlow = false;
		var firstSegment = this.metaData_.segments_[this.urgentSegmentIndex_];
		if (firstSegment.size_ > 0 && firstSegment.duration_ > 0) {
			var firstRate = firstSegment.size_ * 1000 / firstSegment.duration_;
			var thresoldRate = firstRate * this.context_.cdnSlowThresholdRate_;
			var fastStableSpeed = 0;
			for ( var n = 0; n < this.stablePeers_.length; n++) {
				var fastPeer = this.stablePeers_[n];
				if (fastPeer.pendingRequestCount_ > 0) {
					fastStableSpeed = fastPeer.lastReceiveSpeed_;
					break;
				}
			}
			if (fastStableSpeed >= 0 && fastStableSpeed < thresoldRate) {
				stableTooSlow = true;
			}
		}

		return stableTooSlow;
	},

	updateUrgentIncompleteCount_ : function() {
		this.urgentIncompleteCount_ = 0;
		if (this.urgentSegmentIndex_ < 0 || this.urgentSegmentIndex_ >= this.metaData_.segments_.length) {
			return;
		}

		var maxDuration = this.context_.p2pUrgentSize_ * 1000;
		var totalDuration = 0;
		var urgentCount = 0;
		for ( var n = this.urgentSegmentIndex_; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.completedTime_ <= 0) {
				this.urgentIncompleteCount_++;
			}
			totalDuration += segment.duration_;
			urgentCount++;
			if (urgentCount > 1 && totalDuration >= maxDuration) {
				// urgent should has 2 segments at least if more segments eixst
				break;
			}
		}
	},

	getNextIdleOtherPeer_ : function(pieceType, pieceId) {
		var result = null;
		for ( var n = 0; n < this.otherPeers_.length; n++) {
			var item = this.otherPeers_[n];
			if (item.timeoutTimes_ > 5) {
				continue;
			}

			if (item.receivePiece_.receiveStartTime_ <= 0 && item.hasPiece_(pieceType, pieceId)) {
				result = item;
				break;
			}
		}
		return result;
	},

	processMessageRanges_ : function(nowTime, peer, message) {
		var rangeUpdateCount = 0;
		var session = peer.session_;

		// clean old bitmap status
		peer.tnPieceMark_.clear(true);
		peer.pnPieceMark_.clear(true);
		peer.selfRanges_ = "";
		for ( var n = 0; n < message.ranges_.length; n++) {
			var range = message.ranges_[n];
			if (range.type_ == 0) {
				var end = range.start_ + range.count_ - 1;
				peer.selfRanges_ += "type:" + range.type_ + ",start:" + range.start_ + ",end:" + end + ",count:" + range.count_ + "\n";
			}

			var bitmap = (range.type_ == p2p$.com.webp2p.core.common.META_PIECE_TYPE.kMetaPieceTypeTn) ? peer.tnPieceMark_ : peer.pnPieceMark_;
			var maxBits = p2p$.com.webp2p.core.supernode.BitmapStatic.kMaxBitCount;
			for ( var index = range.start_, count = 0; count < range.count_ && count <= maxBits; index++, count++) {
				var old = bitmap.setValue(index, true);
				if (!old) {
					rangeUpdateCount++;
				}
			}
		}
		if (this.manager_.getEnviroment_().p2pEnabled_ && message.ranges_.length != 0
				&& (peer.lastRangeExchangeTime_ + this.context_.p2pShareRangeInterval_ * 1000 < nowTime)) {
			if (!this.selfRangesMessage_.empty()) {
				peer.lastRangeExchangeTime_ = nowTime;
				peer.statSendMessage_(this.selfRangesMessage_);
				session.send(this.selfRangesMessage_);
			}
		}
		if (rangeUpdateCount > 0 && this.lastPieceShareInUpdateTime_ + 2000 < nowTime) {
			this.lastPieceShareInUpdateTime_ = nowTime;
			this.updateMetaPieceShareInRanges_(true);
		}

		return rangeUpdateCount;
	},

	updateMetaPieceShareInRanges_ : function(startFromUrgent) {
		var startIndex = startFromUrgent ? ((this.urgentSegmentIndex_ < 0) ? 0 : this.urgentSegmentIndex_) : 0;
		for ( var n = startIndex; n < this.metaData_.segments_.length; n++) {
			var segment = this.metaData_.segments_[n];
			if (segment.p2pDisabled_) {
				continue;
			}
			for ( var k = 0; k < segment.pieces_.length; k++) {
				var piece = segment.pieces_[k];
				piece.shareInRanges_ = 0;
				for ( var j = 0; j < this.otherPeers_.length; j++) {
					var peer = this.otherPeers_[j];
					if (peer.hasPiece_(piece.type_, piece.id_)) {
						piece.shareInRanges_++;
					}
				}
			}
		}
	},

	getTypeName_ : function() {
		return p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_);
	},

	onProtocolManagerOpen_ : function(mgr, errorCode) {
		if (this.protocolPool_ == null || !this.protocolPool_.isValid_()) {
			// already closed
			return;
		}

		P2P_ULOG_INFO(P2P_ULOG_FMT("logic::base::Channel::[{0}] Protocol manager({1}://{2}) open, channel({3}), code({4}), {5}",
				p2p$.com.webp2p.core.common.Enum.getMetaTypeName_(this.type_), mgr.getTypeName_(), mgr.getId_(), this.id_, errorCode,
				(this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) ? "try open after 10 seconds..." : "OK"));

		if (this.opened_ && p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess != errorCode) {
			// this.setProtocolTimeout_(mgr, 10 * 1000);
		}

		// report only open successfully
		if (p2p$.com.webp2p.core.common.ERROR_CODE.kErrorSuccess == errorCode) {
			if (!this.rtmfpServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeRtmfp
					&& this.context_.rtmfpServerConnectedTime_ > 0) {
				this.rtmfpServerReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionRtmfpConnected, 0,
						this.context_.rtmfpServerHost_, this.context_.rtmfpServerConnectedTime_);
			}
			if (!this.cdeTrackerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebSocket
					&& this.context_.trackerServerConnectedTime_ > 0) {
				this.cdeTrackerReported_ = true;
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionCdeTrackerConnected, 0,
						this.context_.trackerServerHost_, this.context_.trackerServerConnectedTime_);
			}
			if (!this.webrtcServerReported_ && mgr.getType() == p2p$.com.webp2p.protocol.base.PROTOCOL_TYPES.kProtocolTypeWebrtc
					&& this.context_.webrtcServerConnectedTime_ > 0) {
				this.webrtcServerReported_ = true;

				var url = new p2p$.com.webp2p.core.supernode.Url();
				url.fromString_(this.context_.webrtcServerHost_);
				this.reportClient_.sendClientStage2_(p2p$.com.webp2p.tools.collector.ClientStageStatic.kActionWebrtcConnected, 0, url.host_ + ":" + url.port_,
						this.context_.webrtcServerConnectedTime_);
			}
		}
	},

	onProtocolSessionClose_ : function(session) {
		if (this.protocolPool_ == null || session == null) {
			// already closed
			return;
		}

		var erased = false;
		var sameTypeCount = 0;
		var peers = session.isStable_() ? this.stablePeers_ : this.otherPeers_;
		for ( var n = 0; n < peers.length; n++) {
			var item = peers[n];
			if (item.session_ == session) {
				erased = true;
				this.resetPieceReceivingBySession_(item.sessionId_);
				peers.splice(n--, 1);
			} else {
				if (item.session_ && item.session_.getType() == session.getType()) {
					sameTypeCount++;
				}
			}
		}

		if (erased) {
			// this.updateMetaPieceShareInRanges_(true);
			if (!session.isStable_()) {
				this.reportTraffic_.updateSessions_(this.reportClient_, session.getType(), sameTypeCount);
			}
		}
	},

	getActiveTime_ : function() {
		return this.activeTime_;
	},//

	getMaxSleepTime_ : function() {
		return this.maxSleepTime_;
	},

	getChannelUrl_ : function() {
		return this.metaData_.channelUrl_;
	},

	getMaxSilentTime_ : function() {
		return this.maxSilentTime_;
	},

	p2pIsReady_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pIsReady_();
		}
		return false;
	},

	p2pisActive_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pisActive_();
		}
		return false;
	},

	p2pDeactive_ : function() {
		this.otherPeers_ = [];
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pDeactive_();
		}
		return false;
	},

	p2pActivate_ : function() {
		if (this.protocolPool_ != null) {
			return this.protocolPool_.p2pActivate_();
		}
		return false;
	},
	setListener_ : function(listener) {
		this.wrapper_ = listener;
	},
	onGslbExpiredError_ : function(session) {
		var code = 30404;
		var info = "GSLB has expired";
		if (this.wrapper_.onerror) {
			this.wrapper_.onerror(code, info);
		}
	}
});